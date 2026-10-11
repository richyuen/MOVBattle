import {
  Scene, Vector3, MeshBuilder, Color3, TransformNode,
  PBRMetallicRoughnessMaterial, ParticleSystem,
} from "@babylonjs/core";
import type { GlowLayer, Mesh } from "@babylonjs/core";
import { getMaterialFactory } from "../units/materialFactory";
import { createSparks, createFire, createDust } from "./particleFactory";

interface TimedEffect {
  root: TransformNode;
  remaining: number;
  update?: (dt: number, elapsed: number) => void;
  dispose?: () => void;
  particles?: ParticleSystem[];
}

/**
 * Manages transient visual effects: lightning, smoke puffs, impact sparks, etc.
 */
export class VisualEffects {
  private _scene: Scene;
  private _effects: TimedEffect[] = [];

  constructor(scene: Scene) {
    this._scene = scene;
  }

  /** Create a unique unlit PBR material for transient effects (alpha-mutated per frame). */
  private _fxMat(color: Color3, emissive?: Color3, alpha = 1): PBRMetallicRoughnessMaterial {
    const m = getMaterialFactory().createUnique("unlit", color);
    m.disableLighting = true;
    if (emissive) m.emissiveColor = emissive;
    if (alpha < 1) { m.alpha = alpha; m.transparencyMode = 2; }
    return m;
  }

  /** Opaque unlit colour that the GlowLayer must not bloom into a soft halo. */
  private _solidMat(color: Color3): PBRMetallicRoughnessMaterial {
    return this._fxMat(color, color);
  }

  private _glowLayer(): GlowLayer | undefined {
    return this._scene.effectLayers?.find((layer) => layer.name === "glow") as GlowLayer | undefined;
  }

  /** Burst of opaque faceted chunks that swell, drift outward and shrink away. */
  private _spawnChunkPuff(position: Vector3, color: Color3, count: number, size: number, duration: number): void {
    const root = new TransformNode("puff", this._scene);
    root.position = position.clone();
    const mat = getMaterialFactory().createUnique("cloth", color);
    const chunks: { mesh: Mesh; drift: Vector3; spin: number }[] = [];
    for (let i = 0; i < count; i++) {
      const mesh = MeshBuilder.CreateIcoSphere("puffChunk", {
        radius: size * (0.6 + Math.random() * 0.6), subdivisions: 1, flat: true,
      }, this._scene);
      const angle = (i / count) * Math.PI * 2 + Math.random() * 0.8;
      const reach = size * (1.2 + Math.random() * 1.2);
      mesh.material = mat;
      mesh.parent = root;
      mesh.isPickable = false;
      mesh.rotation.set(Math.random() * 3, Math.random() * 3, Math.random() * 3);
      mesh.scaling.setAll(0.01);
      chunks.push({
        mesh,
        drift: new Vector3(Math.cos(angle) * reach, size * (1 + Math.random() * 2), Math.sin(angle) * reach),
        spin: (Math.random() - 0.5) * 3,
      });
    }

    this._effects.push({
      root,
      remaining: duration,
      update: (dt, remaining) => {
        const t = Math.min(1, Math.max(0, 1 - remaining / duration));
        const out = 1 - (1 - t) * (1 - t);
        const scale = Math.max(0.01, t < 0.2 ? t / 0.2 : 1 - (t - 0.2) / 0.8);
        for (const chunk of chunks) {
          chunk.mesh.position.copyFrom(chunk.drift).scaleInPlace(out);
          chunk.mesh.rotation.y += chunk.spin * dt;
          chunk.mesh.scaling.setAll(scale);
        }
      },
      dispose: () => mat.dispose(),
    });
  }

  update(dt: number): void {
    for (let i = this._effects.length - 1; i >= 0; i--) {
      const e = this._effects[i];
      e.remaining -= dt;
      if (e.update) e.update(dt, e.remaining);
      if (e.remaining <= 0) {
        if (e.particles) for (const ps of e.particles) { ps.stop(); ps.dispose(); }
        e.root.dispose();
        e.dispose?.();
        this._effects.splice(i, 1);
      }
    }
  }

  // ══════════════════ LIGHTNING ══════════════════
  /**
   * Spawn a jagged lightning bolt from origin to target.
   * Made of multiple connected segments with random offsets.
   */
  spawnLightning(origin: Vector3, target: Vector3): void {
    const root = new TransformNode("lightning", this._scene);
    const segments = 10;
    const dir = target.subtract(origin);
    const len = dir.length();

    // Opaque jagged prisms: one solid pale colour, no alpha, no glow halo
    const boltMat = this._solidMat(new Color3(0.93, 0.97, 1.0));
    const flashMat = this._solidMat(new Color3(0.62, 0.84, 1.0));
    const glow = this._glowLayer();
    const parts: Mesh[] = [];

    // Build jagged path
    const points: Vector3[] = [origin.clone()];
    points[0].y += 1.5; // start from head height
    const endPoint = target.clone();
    endPoint.y += 0.8;

    for (let i = 1; i < segments; i++) {
      const t = i / segments;
      const base = Vector3.Lerp(points[0], endPoint, t);
      // Random jag perpendicular to bolt direction
      const jag = len * 0.2 * (1 - Math.abs(t - 0.5) * 2); // most jag in middle
      base.x += (Math.random() - 0.5) * jag;
      base.y += (Math.random() - 0.5) * jag * 0.5;
      base.z += (Math.random() - 0.5) * jag;
      points.push(base);
    }
    points.push(endPoint);

    const addPrism = (a: Vector3, b: Vector3, thickness: number) => {
      const prism = MeshBuilder.CreateCylinder("lseg", {
        height: Vector3.Distance(a, b) * 1.06, diameter: thickness, tessellation: 3,
      }, this._scene);
      prism.rotation.x = Math.PI / 2;
      prism.bakeCurrentTransformIntoVertices();
      prism.position = Vector3.Center(a, b);
      prism.lookAt(b);
      prism.material = boltMat;
      prism.parent = root;
      prism.isPickable = false;
      parts.push(prism);
    };

    // Thick triangular prisms connecting each pair
    for (let i = 0; i < points.length - 1; i++) {
      addPrism(points[i], points[i + 1], 0.3);
    }

    // Branch bolt (smaller fork)
    const branchStart = Math.floor(segments * 0.4);
    if (branchStart < points.length - 1) {
      const forkOrigin = points[branchStart];
      const forkDir = new Vector3(
        (Math.random() - 0.5) * len * 0.4,
        (Math.random() - 0.3) * len * 0.2,
        (Math.random() - 0.5) * len * 0.4,
      );
      addPrism(forkOrigin, forkOrigin.add(forkDir), 0.18);
    }

    // Faceted burst at impact
    const flash = MeshBuilder.CreateIcoSphere("lflash", { radius: 0.45, subdivisions: 1, flat: true }, this._scene);
    flash.position = endPoint;
    flash.material = flashMat;
    flash.parent = root;
    flash.isPickable = false;
    parts.push(flash);
    for (const part of parts) glow?.addExcludedMesh(part);

    const totalDuration = 0.35;
    this._effects.push({
      root,
      remaining: totalDuration,
      update: (_dt, remaining) => {
        // Hold solid, then thin out to nothing instead of fading
        const life = Math.max(0, remaining / totalDuration);
        const width = Math.max(0.01, Math.min(1, life * 2.5));
        for (const part of parts) {
          if (part === flash) continue;
          part.scaling.x = width;
          part.scaling.y = width;
        }
        flash.scaling.setAll(Math.max(0.01, (1 + (1 - life) * 1.6) * Math.min(1, life * 3)));
      },
      dispose: () => {
        for (const part of parts) glow?.removeExcludedMesh(part);
        boltMat.dispose();
        flashMat.dispose();
      },
    });
  }

  // ══════════════════ SMOKE PUFF ══════════════════
  /**
   * Spawn an expanding cloud of solid faceted chunks. Used for ninja teleport and spell casts.
   */
  spawnSmokePuff(position: Vector3, color?: Color3): void {
    const pos = position.clone();
    pos.y += 0.5;
    this._spawnChunkPuff(pos, color ?? new Color3(0.4, 0.4, 0.45), 7, 0.38, 0.7);
  }

  // ══════════════════ SHURIKEN (thrown) ══════════════════
  /**
   * Returns "shuriken" as a projectile shape identifier.
   * The actual mesh is built in projectileSystem.
   */

  // ══════════════════ TORNADO / SPIN DUST ══════════════════
  /**
   * Spawn swirling dust/wind lines around a position. Follows a unit.
   */
  spawnTornadoDust(position: Vector3): void {
    const root = new TransformNode("tornado", this._scene);
    const pos = position.clone();
    root.position = pos;

    const ps = createDust(this._scene, pos, new Color3(0.7, 0.65, 0.5), 25);
    // Swirl upward with wider spread
    ps.direction1 = new Vector3(-1, 0.5, -1);
    ps.direction2 = new Vector3(1, 2.5, 1);
    ps.minEmitPower = 1;
    ps.maxEmitPower = 2;
    ps.minLifeTime = 0.3;
    ps.maxLifeTime = 0.6;
    ps.targetStopDuration = 0.2;
    ps.start();

    this._effects.push({
      root,
      remaining: 0.7,
      particles: [ps],
    });
  }

  // ══════════════════ IMPACT DUST ══════════════════
  /** Burst of tan dust spheres on every hit. */
  spawnImpactDust(position: Vector3, intensity = 1, color = new Color3(0.75, 0.68, 0.5)): void {
    const root = new TransformNode("impactDust", this._scene);
    const pos = position.clone();
    pos.y += 0.3;
    root.position = pos;

    const ps = createDust(this._scene, pos, color, Math.max(6, Math.round(12 * intensity)));
    ps.minSize *= Math.max(0.65, intensity * 0.8);
    ps.maxSize *= Math.max(0.75, intensity);
    ps.minEmitPower *= Math.max(0.8, intensity * 0.9);
    ps.maxEmitPower *= Math.max(0.9, intensity);
    ps.targetStopDuration = 0.1;
    ps.start();

    this._effects.push({
      root,
      remaining: 0.45 + Math.max(0, intensity - 1) * 0.12,
      particles: [ps],
    });
  }

  // ══════════════════ HIT SPARKS ══════════════════
  /** Bright sparks that fly outward on melee hit. */
  spawnHitSparks(position: Vector3, intensity = 1): void {
    const root = new TransformNode("hitSparks", this._scene);
    const pos = position.clone();
    pos.y += 0.5;
    root.position = pos;

    const ps = createSparks(this._scene, pos, new Color3(1, 0.95, 0.7), Math.max(8, Math.round(15 * intensity)));
    ps.minEmitPower *= Math.max(0.85, intensity * 0.9);
    ps.maxEmitPower *= Math.max(0.9, intensity);
    ps.targetStopDuration = 0.05;
    ps.start();

    this._effects.push({
      root,
      remaining: 0.3 + Math.max(0, intensity - 1) * 0.08,
      particles: [ps],
    });
  }

  // ══════════════════ HIT FLASH ══════════════════
  /** Small solid faceted pop on every hit. */
  spawnHitFlash(position: Vector3, intensity = 1): void {
    const flash = MeshBuilder.CreateIcoSphere("hflash", { radius: 0.05, subdivisions: 1, flat: true }, this._scene);
    flash.position = position.clone();
    flash.position.y += 0.5;
    flash.isPickable = false;
    const mat = this._solidMat(new Color3(1, 0.95, 0.8));
    const glow = this._glowLayer();
    glow?.addExcludedMesh(flash);

    flash.material = mat;
    const root = flash as unknown as TransformNode;

    const totalDuration = 0.15;
    this._effects.push({
      root,
      remaining: totalDuration,
      update: (_dt, remaining) => {
        const t = 1 - remaining / totalDuration;
        // Pop up quickly, then shrink away (no alpha fade)
        const s = (t < 0.53 ? 1 + t * 6 : Math.max(0.05, 4 * (1 - (t - 0.53) * 2.1))) * intensity;
        flash.scaling.setAll(s);
      },
      dispose: () => {
        glow?.removeExcludedMesh(flash);
        mat.dispose();
      },
    });
  }

  // ══════════════════ FIRE BURST ══════════════════
  /** Cluster of orange-red flame spheres. */
  spawnFireBurst(position: Vector3): void {
    const root = new TransformNode("fireBurst", this._scene);
    const pos = position.clone();
    pos.y += 0.3;
    root.position = pos;

    const ps = createFire(this._scene, pos, 20);
    ps.targetStopDuration = 0.15;
    ps.start();

    this._effects.push({
      root,
      remaining: 0.6,
      particles: [ps],
    });
  }

  // ══════════════════ PERSISTENT SMOKE ══════════════════
  /** Dark smoke cloud that lingers after explosions. */
  spawnPersistentSmoke(position: Vector3): void {
    const pos = position.clone();
    pos.y += 0.4;
    this._spawnChunkPuff(pos, new Color3(0.3, 0.3, 0.32), 6, 0.42, 1.0);
  }

  // ══════════════════ GROUND SCORCH ══════════════════
  /** Flat dark disc left on the ground by explosions. */
  spawnGroundScorch(position: Vector3): void {
    const disc = MeshBuilder.CreateDisc("scorch", { radius: 0.5, tessellation: 12 }, this._scene);
    disc.position = position.clone();
    disc.position.y = 0.04;
    disc.rotation.x = Math.PI / 2;
    const mat = this._fxMat(new Color3(0.15, 0.12, 0.08), new Color3(0.03, 0.024, 0.016), 0.4);
    disc.material = mat;

    const totalDuration = 3.0;
    this._effects.push({
      root: disc as unknown as TransformNode,
      remaining: totalDuration,
      update: (_dt, remaining) => {
        mat.alpha = Math.max(0, 0.4 * (remaining / totalDuration));
      },
      dispose: () => mat.dispose(),
    });
  }

  dispose(): void {
    for (const e of this._effects) {
      if (e.particles) for (const ps of e.particles) { ps.stop(); ps.dispose(); }
      e.root.dispose();
      e.dispose?.();
    }
    this._effects.length = 0;
  }
}
