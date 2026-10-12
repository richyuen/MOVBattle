import {
  Scene, Vector3, MeshBuilder, Color3, TransformNode, Mesh,
  PBRMetallicRoughnessMaterial, ParticleSystem,
} from "@babylonjs/core";
import { getMaterialFactory } from "../units/materialFactory";
import { createSmoke, createSparks, createFire, createDust } from "./particleFactory";

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
   * Spawn a jagged lightning bolt from origin to target: a few hard-edged white wedges that zigzag
   * side to side, with a cyan fork. Opaque and kept out of the glow layer so it reads as flat
   * polygons instead of a soft beam.
   */
  spawnLightning(origin: Vector3, target: Vector3): void {
    const root = new TransformNode("lightning", this._scene);
    const segments = 4;
    const boltMat = this._fxMat(new Color3(0.45, 0.85, 1.0), new Color3(0.45, 0.85, 1.0));
    const coreMat = this._fxMat(new Color3(1, 1, 1), new Color3(1, 1, 1));
    const glow = this._scene.getGlowLayerByName("glow");
    const parts: Mesh[] = [];
    const addPart = (mesh: Mesh, material: PBRMetallicRoughnessMaterial): void => {
      mesh.material = material;
      mesh.parent = root;
      glow?.addExcludedMesh(mesh);
      parts.push(mesh);
    };
    // Three-sided wedge from a to b, thick at a and tapering to b, so joined segments step like a saw edge
    const wedge = (a: Vector3, b: Vector3, thick: number, material: PBRMetallicRoughnessMaterial): void => {
      const seg = MeshBuilder.CreateCylinder("lseg", {
        height: Vector3.Distance(a, b), diameterBottom: thick, diameterTop: thick * 0.3, tessellation: 3,
      }, this._scene);
      seg.rotation.x = Math.PI / 2;
      seg.bakeCurrentTransformIntoVertices();
      seg.position = Vector3.Center(a, b);
      seg.lookAt(b);
      addPart(seg, material);
    };

    const start = origin.clone();
    start.y += 1.5; // start from head height
    const endPoint = target.clone();
    endPoint.y += 0.8;
    const dir = endPoint.subtract(start);
    const len = dir.length();
    const side = Vector3.Cross(dir, Vector3.Up());
    if (side.lengthSquared() < 1e-6) side.set(1, 0, 0);
    side.normalize();

    // Zigzag path: each corner is thrown to the opposite side of the last
    const points: Vector3[] = [start];
    const flip = Math.random() < 0.5 ? -1 : 1;
    for (let i = 1; i < segments; i++) {
      const base = Vector3.Lerp(start, endPoint, i / segments + (Math.random() - 0.5) * 0.12);
      const swing = (i % 2 === 0 ? -flip : flip) * len * (0.1 + Math.random() * 0.08);
      base.addInPlace(side.scale(swing));
      base.y += (Math.random() - 0.5) * len * 0.12;
      points.push(base);
    }
    points.push(endPoint);
    const thick = Math.min(0.5, Math.max(0.22, len * 0.035));
    for (let i = 0; i < points.length - 1; i++) {
      wedge(points[i], points[i + 1], thick, coreMat);
    }

    // Cyan fork off the first corner: two short wedges with their own kink
    const forkDir = dir.scale(0.22).add(side.scale(-flip * len * 0.2));
    forkDir.y += len * 0.06;
    const forkMid = points[1].add(forkDir.scale(0.5)).add(side.scale(flip * len * 0.07));
    wedge(points[1], forkMid, thick * 0.7, boltMat);
    wedge(forkMid, points[1].add(forkDir), thick * 0.5, boltMat);

    // Small faceted flash at impact
    const flash = MeshBuilder.CreateSphere("lflash", { diameter: 0.4, segments: 2 }, this._scene);
    flash.position = endPoint;
    flash.convertToFlatShadedMesh();
    addPart(flash, boltMat);

    const totalDuration = 0.25;
    this._effects.push({
      root,
      remaining: totalDuration,
      update: (_dt, remaining) => {
        flash.scaling.setAll(1 + (1 - Math.max(0, remaining / totalDuration)) * 0.6);
      },
      dispose: () => {
        for (const part of parts) glow?.removeExcludedMesh(part);
      },
    });
  }

  // ══════════════════ SMOKE PUFF ══════════════════
  /**
   * Spawn an expanding smoke cloud at position. Used for ninja teleport.
   */
  spawnSmokePuff(position: Vector3, color?: Color3): void {
    const root = new TransformNode("smoke", this._scene);
    const pos = position.clone();
    root.position = pos;
    const clr = color ?? new Color3(0.4, 0.4, 0.45);

    const ps = createSmoke(this._scene, pos, clr, 20);
    ps.targetStopDuration = 0.15;
    ps.start();

    const totalDuration = 0.6;
    this._effects.push({
      root,
      remaining: totalDuration,
      particles: [ps],
    });
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
  /** Bright white pop on every hit. */
  spawnHitFlash(position: Vector3, intensity = 1): void {
    const flash = MeshBuilder.CreateSphere("hflash", { diameter: 0.1, segments: 4 }, this._scene);
    flash.position = position.clone();
    flash.position.y += 0.5;
    const mat = this._fxMat(new Color3(1, 1, 1), new Color3(1, 1, 1));

    flash.material = mat;
    const root = flash as unknown as TransformNode;

    const totalDuration = 0.15;
    this._effects.push({
      root,
      remaining: totalDuration,
      update: (_dt, remaining) => {
        const t = 1 - remaining / totalDuration;
        // Scale up quickly, then fade
        const s = (t < 0.53 ? 1 + t * 6 : 4) * intensity;
        flash.scaling.setAll(s);
        mat.alpha = t < 0.53 ? 1 : Math.max(0, 1 - (t - 0.53) * 2.1);
      },
      dispose: () => mat.dispose(),
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

  // ══════════════════ EXPLOSION BURST ══════════════════
  /** Brief flash, a head-sized white smoke puff, the dark ball and a burst of tan dust clods that outlasts the smoke. No particles. */
  spawnExplosionBurst(position: Vector3, scale = 1): void {
    const root = new TransformNode("explosionBurst", this._scene);
    root.position = position.clone();
    root.position.y += 0.6 * scale;

    // Lit matte materials: fully emissive ones trip the bloom threshold and wash out to white.
    const mats = getMaterialFactory();
    const flashMat = mats.createUnique("cloth", new Color3(1, 0.82, 0.35));
    flashMat.emissiveColor = new Color3(0.4, 0.3, 0.08);
    const smokeMat = mats.createUnique("cloth", new Color3(0.86, 0.85, 0.82));
    smokeMat.emissiveColor = new Color3(0.14, 0.14, 0.13);
    const dustMat = mats.createUnique("stone", new Color3(0.74, 0.64, 0.45));
    const ballMat = mats.createUnique("stone", new Color3(0.1, 0.1, 0.11));
    const floorY = -root.position.y + 0.08;

    const blob = (name: string, segments: number, mat: typeof flashMat): TransformNode => {
      const mesh = MeshBuilder.CreateSphere(name, { diameter: 1, segments }, this._scene);
      mesh.material = mat;
      mesh.parent = root;
      return mesh;
    };
    // Small enough that the bodies it throws stay in view around it.
    const flash = blob("burstFlash", 3, flashMat);
    const flashSize = 0.9 * scale;

    // The shot itself: a dark ball that hops out of the puff and comes to rest.
    const ball = blob("burstBall", 4, ballMat);
    const ballSize = 0.34 * scale;
    ball.scaling.setAll(ballSize);
    const ballFloor = floorY + ballSize * 0.5;
    const ballAngle = Math.random() * Math.PI * 2;
    const ballVelocity = new Vector3(Math.cos(ballAngle) * 1.6 * scale, 3.4, Math.sin(ballAngle) * 1.6 * scale);

    // Smoke: a small clump of faceted off-white lobes that swells and drifts up. A shell's puff is capped at a
    // musket ball's and sits at chest height, so it stays below the heads of the bodies it throws.
    const smokeScale = Math.min(scale, 1);
    const smokeY = 0.6 * smokeScale - 0.6 * scale;
    const lobes: { mesh: TransformNode; size: number; rise: number }[] = [];
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2 + Math.random() * 0.6;
      const reach = (i === 0 ? 0 : 0.22 + Math.random() * 0.16) * smokeScale;
      const lobe = blob("burstSmoke", 2, smokeMat);
      lobe.position.set(Math.cos(angle) * reach, smokeY + (Math.random() - 0.5) * 0.3 * smokeScale, Math.sin(angle) * reach);
      lobes.push({ mesh: lobe, size: (i === 0 ? 0.42 : 0.22 + Math.random() * 0.12) * smokeScale, rise: 0.2 + Math.random() * 0.2 });
    }

    // Dust: flattened tan clods thrown up out of the ground above the grass tops, landing in a ring and lying there.
    const chunks: { mesh: TransformNode; size: number; velocity: Vector3 }[] = [];
    for (let i = 0; i < 16; i++) {
      const chunk = blob("burstDust", 2, dustMat);
      const angle = (i / 16) * Math.PI * 2 + Math.random() * 0.5;
      const speed = (2.2 + Math.random() * 2.4) * scale;
      chunk.position.y = floorY + 0.35;
      chunks.push({
        mesh: chunk,
        size: (0.24 + Math.random() * 0.22) * scale,
        velocity: new Vector3(Math.cos(angle) * speed, 3 + Math.random() * 2.4, Math.sin(angle) * speed),
      });
    }

    const flashDuration = 0.16;
    const smokeDuration = 1.1;
    const totalDuration = 1.9;
    this._effects.push({
      root,
      remaining: totalDuration,
      update: (dt, remaining) => {
        const elapsed = totalDuration - remaining;
        const fade = Math.max(0.001, Math.min(1, remaining / 0.35));
        // The flash is gone before the bodies it threw have peaked.
        const flashLife = Math.max(0, 1 - elapsed / flashDuration);
        flash.scaling.setAll(Math.max(0.001, flashSize * Math.min(1, elapsed / 0.05 + 0.4) * flashLife));
        const swell = 0.45 + 0.55 * Math.min(1, elapsed / 0.2);
        // The puff is gone while the clods it kicked up are still settling.
        const smokeFade = Math.max(0.001, Math.min(1, (smokeDuration - elapsed) / 0.35));
        for (const lobe of lobes) {
          lobe.mesh.position.y += lobe.rise * dt;
          lobe.mesh.scaling.setAll(lobe.size * swell * smokeFade);
        }
        ballVelocity.y -= 14 * dt;
        ball.position.addInPlace(ballVelocity.scale(dt));
        if (ball.position.y < ballFloor) {
          ball.position.y = ballFloor;
          ballVelocity.setAll(0);
        }
        for (const chunk of chunks) {
          chunk.velocity.y -= 14 * dt;
          chunk.mesh.position.addInPlace(chunk.velocity.scale(dt));
          // Landed clods sit proud of the ground instead of sinking into the grass.
          const rest = floorY + chunk.size * 0.3;
          if (chunk.mesh.position.y < rest) {
            chunk.mesh.position.y = rest;
            chunk.velocity.setAll(0);
          }
          const size = chunk.size * fade;
          chunk.mesh.scaling.set(size, size * 0.6, size);
        }
      },
      dispose: () => {
        flashMat.dispose();
        smokeMat.dispose();
        dustMat.dispose();
        ballMat.dispose();
      },
    });
  }

  // ══════════════════ PERSISTENT SMOKE ══════════════════
  /** Dark smoke cloud that lingers after explosions. */
  spawnPersistentSmoke(position: Vector3): void {
    const root = new TransformNode("pSmoke", this._scene);
    const pos = position.clone();
    pos.y += 0.4;
    root.position = pos;

    const ps = createSmoke(this._scene, pos, new Color3(0.3, 0.3, 0.32), 15);
    ps.minLifeTime = 0.4;
    ps.maxLifeTime = 0.8;
    ps.targetStopDuration = 0.3;
    ps.start();

    this._effects.push({
      root,
      remaining: 1.0,
      particles: [ps],
    });
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
