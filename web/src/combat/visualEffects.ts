import {
  Scene, Vector3, Mesh, MeshBuilder, Color3, TransformNode,
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
   * Spawn a jagged lightning bolt from origin to target.
   * Made of multiple connected segments with random offsets.
   */
  spawnLightning(origin: Vector3, target: Vector3): void {
    const root = new TransformNode("lightning", this._scene);
    const segments = 10;
    const dir = target.subtract(origin);
    const len = dir.length();

    const boltMat = this._fxMat(new Color3(0.6, 0.8, 1.0), new Color3(0.5, 0.7, 1.0), 0.9);
    const coreMat = this._fxMat(new Color3(1, 1, 1), new Color3(1, 1, 1));

    // Build jagged path
    const points: Vector3[] = [origin.clone()];
    points[0].y += 1.5; // start from head height
    const endPoint = target.clone();
    endPoint.y += 0.8;

    for (let i = 1; i < segments; i++) {
      const t = i / segments;
      const base = Vector3.Lerp(points[0], endPoint, t);
      // Random jag perpendicular to bolt direction
      const jag = len * 0.12 * (1 - Math.abs(t - 0.5) * 2); // most jag in middle
      base.x += (Math.random() - 0.5) * jag;
      base.y += (Math.random() - 0.5) * jag * 0.5;
      base.z += (Math.random() - 0.5) * jag;
      points.push(base);
    }
    points.push(endPoint);

    // Draw segments as thin boxes connecting each pair
    for (let i = 0; i < points.length - 1; i++) {
      const a = points[i];
      const b = points[i + 1];
      const mid = Vector3.Center(a, b);
      const segLen = Vector3.Distance(a, b);

      // Outer glow
      const glow = MeshBuilder.CreateBox("lseg", {
        width: 0.12, height: 0.12, depth: segLen,
      }, this._scene);
      glow.position = mid;
      glow.lookAt(b);
      glow.material = boltMat;
      glow.parent = root;

      // Inner bright core
      const core = MeshBuilder.CreateBox("lcore", {
        width: 0.04, height: 0.04, depth: segLen,
      }, this._scene);
      core.position = mid;
      core.lookAt(b);
      core.material = coreMat;
      core.parent = root;
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
      const forkEnd = forkOrigin.add(forkDir);
      const forkMid = Vector3.Center(forkOrigin, forkEnd);
      const forkLen = Vector3.Distance(forkOrigin, forkEnd);
      const fork = MeshBuilder.CreateBox("fork", {
        width: 0.06, height: 0.06, depth: forkLen,
      }, this._scene);
      fork.position = forkMid;
      fork.lookAt(forkEnd);
      fork.material = boltMat;
      fork.parent = root;
    }

    // Flash at impact
    const flash = MeshBuilder.CreateSphere("lflash", { diameter: 0.8, segments: 6 }, this._scene);
    flash.position = endPoint;
    flash.material = coreMat;
    flash.parent = root;

    const totalDuration = 0.25;
    this._effects.push({
      root,
      remaining: totalDuration,
      update: (_dt, remaining) => {
        const fade = Math.max(0, remaining / totalDuration);
        boltMat.alpha = fade * 0.9;
        coreMat.alpha = fade;
        flash.scaling.setAll(1 + (1 - fade) * 2);
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
  /** Ragged fire flash that breaks up into solid dark smoke lobes, with dust chunks thrown out on arcs. No particles. */
  spawnExplosionBurst(position: Vector3, scale = 1): void {
    const root = new TransformNode("explosionBurst", this._scene);
    root.position = position.clone();
    root.position.y += 0.9 * scale;

    // Lit matte materials: fully emissive ones trip the bloom threshold and wash out to white.
    const mats = getMaterialFactory();
    const coreMat = mats.createUnique("cloth", new Color3(1, 0.9, 0.5));
    coreMat.emissiveColor = new Color3(0.45, 0.38, 0.14);
    const lobeMat = mats.createUnique("cloth", new Color3(1, 0.4, 0.03));
    lobeMat.emissiveColor = new Color3(0.45, 0.13, 0);
    const hotMat = mats.createUnique("cloth", new Color3(1, 0.7, 0.08));
    hotMat.emissiveColor = new Color3(0.42, 0.27, 0.02);
    const smokeMat = mats.createUnique("stone", new Color3(0.2, 0.19, 0.19));
    const darkSmokeMat = mats.createUnique("stone", new Color3(0.11, 0.1, 0.1));
    const dustMat = mats.createUnique("stone", new Color3(0.5, 0.39, 0.25));
    const sootMat = mats.createUnique("stone", new Color3(0.16, 0.13, 0.11));

    const shard = (name: string, segments: number, mat: typeof coreMat): Mesh => {
      const mesh = MeshBuilder.CreateSphere(name, { diameter: 1, segments }, this._scene);
      mesh.convertToFlatShadedMesh();
      mesh.material = mat;
      mesh.parent = root;
      return mesh;
    };

    // Small squashed heart plus long thin tongues stabbing outward: a spiky flash, not a ball.
    const core = shard("burstCore", 2, coreMat);
    core.rotation.set(Math.random() * 3, Math.random() * 3, Math.random() * 3);
    const coreSize = new Vector3(1.9, 1.3, 1.6).scale(scale);
    const tongues: { mesh: Mesh; dir: Vector3; size: Vector3; reach: number }[] = [];
    for (let i = 0; i < 14; i++) {
      const angle = (i / 14) * Math.PI * 2 + Math.random() * 0.5;
      const lift = -0.15 + Math.random() * 1.1;
      const dir = new Vector3(Math.cos(angle), lift, Math.sin(angle)).normalize();
      const mesh = shard("burstTongue", 2, i % 2 === 0 ? hotMat : lobeMat);
      // Local Z is the long axis; aim it along dir.
      mesh.rotation.y = Math.atan2(dir.x, dir.z);
      mesh.rotation.x = -Math.asin(dir.y);
      const width = (0.4 + Math.random() * 0.35) * scale;
      tongues.push({
        mesh, dir,
        size: new Vector3(width, width, (1.6 + Math.random() * 1.4) * scale),
        reach: (0.5 + Math.random() * 0.3) * scale,
      });
    }

    // Dark smoke lobes born inside the flash; they swell, drift out and climb as the fire dies.
    const smokes: { mesh: Mesh; dir: Vector3; size: Vector3; rise: number }[] = [];
    for (let i = 0; i < 11; i++) {
      const angle = (i / 11) * Math.PI * 2 + Math.random() * 0.6;
      const dir = new Vector3(Math.cos(angle), 0.1 + Math.random() * 0.9, Math.sin(angle)).normalize();
      const mesh = shard("burstSmoke", 3, i % 3 === 0 ? darkSmokeMat : smokeMat);
      mesh.rotation.set(Math.random() * 3, Math.random() * 3, Math.random() * 3);
      const size = (0.9 + Math.random() * 0.8) * scale;
      smokes.push({
        mesh, dir,
        size: new Vector3(size, size * (0.7 + Math.random() * 0.3), size * (0.75 + Math.random() * 0.4)),
        rise: (0.9 + Math.random() * 0.9) * scale,
      });
    }

    const chunks: { mesh: TransformNode; velocity: Vector3; spin: Vector3 }[] = [];
    for (let i = 0; i < 20; i++) {
      const size = (0.08 + Math.random() * 0.1) * scale;
      const chunk = MeshBuilder.CreateBox("burstChunk", { size }, this._scene);
      chunk.material = i % 3 === 0 ? sootMat : dustMat;
      chunk.parent = root;
      const angle = (i / 20) * Math.PI * 2 + Math.random() * 0.5;
      const speed = (3.2 + Math.random() * 3) * scale;
      chunks.push({
        mesh: chunk,
        velocity: new Vector3(Math.cos(angle) * speed, 3.2 + Math.random() * 3, Math.sin(angle) * speed),
        spin: new Vector3(Math.random() * 8, Math.random() * 8, Math.random() * 8),
      });
    }

    const fireDuration = 0.4;
    const totalDuration = 1.6;
    const floorY = -root.position.y + 0.08;
    this._effects.push({
      root,
      remaining: totalDuration,
      update: (dt, remaining) => {
        const elapsed = totalDuration - remaining;
        // Flash peaks in 0.08 s and is already tearing apart by 0.15 s; all opaque, no fades.
        const grow = Math.min(1, elapsed / 0.08);
        const collapse = Math.max(0, Math.min(1, (fireDuration - elapsed) / 0.25));
        const fire = Math.max(0.001, (0.35 + 0.65 * grow) * collapse);
        core.scaling.copyFrom(coreSize).scaleInPlace(fire);
        for (const t of tongues) {
          // Tongues thin faster than they shorten, so the dying flash reads as streaks.
          t.mesh.scaling.set(t.size.x * fire * collapse, t.size.y * fire * collapse, t.size.z * Math.sqrt(fire));
          t.mesh.position.copyFrom(t.dir).scaleInPlace(t.reach + elapsed * 2.2 * scale);
        }
        const swell = Math.max(0, Math.min(1, (elapsed - 0.06) / 0.22));
        const thin = Math.max(0, Math.min(1, remaining / 0.6));
        const smoke = Math.max(0.001, swell * (0.45 + 0.55 * thin) * Math.min(1, remaining / 0.15));
        for (const s of smokes) {
          s.mesh.scaling.copyFrom(s.size).scaleInPlace(smoke);
          s.mesh.position.copyFrom(s.dir).scaleInPlace((0.7 + swell * 0.6 + elapsed * 0.5) * scale);
          s.mesh.position.y += s.rise * elapsed;
        }
        const chunkScale = Math.max(0.001, Math.min(1, remaining / 0.25));
        for (const chunk of chunks) {
          chunk.velocity.y -= 14 * dt;
          chunk.mesh.position.addInPlace(chunk.velocity.scale(dt));
          if (chunk.mesh.position.y < floorY) {
            chunk.mesh.position.y = floorY;
            chunk.velocity.setAll(0);
          } else {
            chunk.mesh.rotation.addInPlace(chunk.spin.scale(dt));
          }
          chunk.mesh.scaling.setAll(chunkScale);
        }
      },
      dispose: () => {
        coreMat.dispose();
        lobeMat.dispose();
        hotMat.dispose();
        smokeMat.dispose();
        darkSmokeMat.dispose();
        dustMat.dispose();
        sootMat.dispose();
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
