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
   * Spawn a jagged lightning bolt from origin to target: a chain of short thin shards that kink hard
   * at every joint and taper toward the strike. Flat white and kept out of the glow layer, so it reads
   * as a solid cut-out shape instead of a blooming beam.
   */
  spawnLightning(origin: Vector3, target: Vector3): void {
    const root = new TransformNode("lightning", this._scene);
    // Mostly self-lit: the same white in sun and in shade, just under the bloom threshold
    const boltMat = getMaterialFactory().createUnique("cloth", new Color3(0.95, 0.96, 1));
    boltMat.emissiveColor = new Color3(0.55, 0.56, 0.6);
    boltMat.transparencyMode = 2;
    const glow = this._scene.getGlowLayerByName("glow");
    const shards: Mesh[] = [];

    const start = origin.clone();
    start.y += 1.5; // start from head height
    const endPoint = target.clone();
    endPoint.y += 0.8;
    const dir = endPoint.subtract(start);
    const len = dir.length();
    // Sideways axis of the zigzag: level and square to the bolt (any level axis when the bolt is vertical)
    const side = Vector3.Cross(dir, Vector3.Up());
    if (side.lengthSquared() < 1e-6) side.set(1, 0, 0);
    side.normalize();

    // Build the zigzag: short shards, each joint swinging to the opposite side of the last by about half
    // a shard's length, so even a short bolt is all corners
    const segments = Math.max(5, Math.min(14, Math.round(len / 0.7)));
    const points: Vector3[] = [start];
    const amp = Math.max(0.28, Math.min(0.5, (len / segments) * 0.6));
    let sign = Math.random() < 0.5 ? -1 : 1;
    for (let i = 1; i < segments; i++) {
      // Joints sit unevenly along the bolt: long and short shards alternate
      const base = Vector3.Lerp(start, endPoint, (i + (Math.random() - 0.5) * 0.5) / segments);
      base.addInPlace(side.scale(sign * amp * (0.6 + Math.random() * 0.4)));
      base.y += sign * amp * (0.4 + Math.random() * 0.5);
      points.push(base);
      sign = -sign;
    }
    points.push(endPoint);

    const addShard = (a: Vector3, b: Vector3, thickness: number): void => {
      const shard = MeshBuilder.CreateBox("lseg", {
        width: thickness, height: thickness, depth: Vector3.Distance(a, b) + thickness * 0.5,
      }, this._scene);
      shard.position = Vector3.Center(a, b);
      shard.lookAt(b);
      // Quarter roll: an edge faces the camera rather than a flat side, so each shard shows two shaded facets
      shard.rotation.z = Math.PI / 4;
      shard.material = boltMat;
      shard.parent = root;
      glow?.addExcludedMesh(shard);
      shards.push(shard);
    };

    // Thick at the caster, thin at the strike
    for (let i = 0; i < points.length - 1; i++) {
      addShard(points[i], points[i + 1], 0.07 - 0.04 * (i / (points.length - 2)));
    }

    // Branch bolt (smaller fork) kicking off the second joint
    const forkOrigin = points[2];
    const forkSide = Math.random() < 0.5 ? -1 : 1;
    const forkKnee = forkOrigin.add(dir.scale(0.4 / len)).add(side.scale(forkSide * 0.3));
    forkKnee.y += 0.2;
    const forkEnd = forkKnee.add(dir.scale(0.35 / len)).add(side.scale(forkSide * 0.1));
    forkEnd.y -= 0.3;
    addShard(forkOrigin, forkKnee, 0.035);
    addShard(forkKnee, forkEnd, 0.025);

    const totalDuration = 0.25;
    this._effects.push({
      root,
      remaining: totalDuration,
      update: (_dt, remaining) => {
        // Holds solid, then cuts out over the last third
        boltMat.alpha = Math.min(1, Math.max(0, remaining / (totalDuration * 0.35)));
      },
      dispose: () => {
        for (const shard of shards) glow?.removeExcludedMesh(shard);
        boltMat.dispose();
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

  // ══════════════════ HIT DEBRIS ══════════════════
  /** A few dark faceted chunks of mixed shape and size knocked loose by a hit: they tumble out, drop and shrink away. Lit and matte, so nothing glows. */
  spawnHitDebris(position: Vector3, intensity = 1): void {
    const root = new TransformNode("hitDebris", this._scene);
    root.position = position.clone();
    root.position.y += 0.9;
    const mats = [
      getMaterialFactory().createUnique("stone", new Color3(0.34, 0.1, 0.09)),
      getMaterialFactory().createUnique("stone", new Color3(0.2, 0.08, 0.07)),
    ];
    const floorY = -root.position.y + 0.05;

    const chunks: { mesh: TransformNode; size: number; velocity: Vector3; spin: Vector3 }[] = [];
    const count = Math.max(2, Math.round(3 * intensity));
    for (let i = 0; i < count; i++) {
      // Wedge, gem or slab: no two chunks of a hit share a shape
      const mesh = i % 3 === 2
        ? MeshBuilder.CreateBox("hitChunk", { width: 1, height: 0.45, depth: 0.7 }, this._scene)
        : MeshBuilder.CreatePolyhedron("hitChunk", { type: i % 3, size: 0.5 }, this._scene);
      mesh.material = mats[i % 2];
      mesh.parent = root;
      mesh.rotation.set(Math.random() * 6.28, Math.random() * 6.28, Math.random() * 6.28);
      const angle = (i / count) * Math.PI * 2 + Math.random() * 0.9;
      const speed = (1.3 + Math.random() * 1.5) * Math.min(1.3, intensity);
      chunks.push({
        mesh,
        // One big lump and the rest progressively smaller
        size: (0.16 - 0.035 * i) * (0.75 + Math.random() * 0.35),
        velocity: new Vector3(Math.cos(angle) * speed, 1.6 + Math.random() * 1.6, Math.sin(angle) * speed),
        spin: new Vector3(4 + Math.random() * 6, Math.random() * 4, 4 + Math.random() * 6),
      });
    }

    this._effects.push({
      root,
      remaining: 0.7,
      update: (dt, remaining) => {
        const fade = Math.min(1, remaining / 0.2);
        for (const chunk of chunks) {
          chunk.velocity.y -= 14 * dt;
          chunk.mesh.position.addInPlace(chunk.velocity.scale(dt));
          if (chunk.mesh.position.y < floorY) {
            chunk.mesh.position.y = floorY;
            chunk.velocity.setAll(0);
            chunk.spin.setAll(0);
          }
          chunk.mesh.rotation.addInPlace(chunk.spin.scale(dt));
          chunk.mesh.scaling.setAll(Math.max(0.001, chunk.size * fade));
        }
      },
      dispose: () => { for (const m of mats) m.dispose(); },
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
  /** A fireball that swells over the crater and burns out, a head-sized white smoke puff, the dark ball and one fat tan dust burst at the crater, with a few small clods, that outlasts the smoke. No particles. */
  spawnExplosionBurst(position: Vector3, scale = 1): void {
    const root = new TransformNode("explosionBurst", this._scene);
    root.position = position.clone();
    root.position.y += 0.6 * scale;

    // Lit matte materials: fully emissive ones trip the bloom threshold and wash out to white.
    const mats = getMaterialFactory();
    // The fireball is mostly self-lit: a saturated yellow body over a deep orange base, in sun and in shade.
    const flashMat = mats.createUnique("cloth", new Color3(1, 0.85, 0.32));
    flashMat.emissiveColor = new Color3(0.6, 0.5, 0.16);
    const flameMat = mats.createUnique("cloth", new Color3(1, 0.42, 0.06));
    flameMat.emissiveColor = new Color3(0.6, 0.24, 0.03);
    const glow = this._scene.getGlowLayerByName("glow");
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
    // Fireball: one big yellow mass about two bodies tall with a small yellow knob on its crown, and orange lobes
    // of mixed size half sunk into the foot of its flanks, so it is a single lumpy silhouette that burns yellow
    // on top and orange at the base, and not a ring of equal balls.
    const fireScale = Math.min(scale, 2.5);
    const fire: { mesh: TransformNode; size: number }[] = [];
    const lobeSizes = [2.2, 1.05, 0.6, 0.9, 0.5, 0.75];
    const lobeHeights = [0.55, 0.05, 0.3, -0.15, 1.1, -0.05];
    for (let i = 0; i < lobeSizes.length; i++) {
      const lobe = blob("burstFlash", 2, i === 0 || i === 4 ? flashMat : flameMat);
      const angle = i * 2.4 + 0.6;
      const reach = (i === 0 ? 0 : 1.1 - lobeSizes[i] * 0.3) * fireScale;
      lobe.position.set(Math.cos(angle) * reach, lobeHeights[i] * fireScale, Math.sin(angle) * reach);
      lobe.rotation.set(i * 1.3, i * 2.1, 0);
      glow?.addExcludedMesh(lobe as Mesh);
      fire.push({ mesh: lobe, size: lobeSizes[i] * fireScale });
    }

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

    // Dust: one fat mound of overlapping tan lobes heaved up out of the crater, a big one in the middle and
    // smaller ones crowded against it, so the hit reads as a single burst from any side.
    const dustScale = Math.min(scale, 1.4);
    const mound: { mesh: TransformNode; size: number }[] = [];
    for (let i = 0; i < 6; i++) {
      const lobe = blob("burstDust", 2, dustMat);
      const angle = (i / 5) * Math.PI * 2 + Math.random() * 0.6;
      const reach = (i === 0 ? 0 : 0.3 + Math.random() * 0.2) * dustScale;
      const size = (i === 0 ? 0.85 : 0.4 + Math.random() * 0.25) * dustScale;
      lobe.position.set(Math.cos(angle) * reach, floorY + size * 0.3, Math.sin(angle) * reach);
      mound.push({ mesh: lobe, size });
    }
    // A few clods of mixed size thrown clear of it, landing close by and lying there.
    const chunks: { mesh: TransformNode; size: number; velocity: Vector3 }[] = [];
    for (let i = 0; i < 5; i++) {
      const chunk = blob("burstDust", 2, dustMat);
      const angle = (i / 5) * Math.PI * 2 + Math.random() * 1.1;
      const speed = (0.9 + Math.random() * 1.3) * scale;
      chunk.position.y = floorY + 0.35;
      chunks.push({
        mesh: chunk,
        size: (0.09 + Math.random() * Math.random() * 0.2) * scale,
        velocity: new Vector3(Math.cos(angle) * speed, 3 + Math.random() * 2.4, Math.sin(angle) * speed),
      });
    }

    const flashDuration = 0.5;
    const smokeDuration = 1.1;
    const totalDuration = 1.9;
    this._effects.push({
      root,
      remaining: totalDuration,
      update: (dt, remaining) => {
        const elapsed = totalDuration - remaining;
        const fade = Math.max(0.001, Math.min(1, remaining / 0.35));
        // The fireball swells fast, holds, and has burnt out before the bodies it threw have peaked.
        const burn = Math.min(1, elapsed / 0.08 + 0.3) * Math.max(0, Math.min(1, (flashDuration - elapsed) / 0.18));
        for (const lobe of fire) {
          lobe.mesh.position.y += 0.9 * dt;
          lobe.mesh.scaling.setAll(Math.max(0.001, lobe.size * burn));
        }
        const swell = 0.45 + 0.55 * Math.min(1, elapsed / 0.2);
        // The puff is gone while the clods it kicked up are still settling.
        const smokeFade = Math.max(0.001, Math.min(1, (smokeDuration - elapsed) / 0.35));
        for (const lobe of lobes) {
          lobe.mesh.position.y += lobe.rise * dt;
          lobe.mesh.scaling.setAll(lobe.size * swell * smokeFade);
        }
        // The mound heaves up fast, then sags flat as it settles.
        const heave = 0.35 + 0.65 * Math.min(1, elapsed / 0.14);
        const sag = 0.75 - 0.3 * Math.min(1, elapsed / totalDuration);
        for (const lobe of mound) {
          const size = lobe.size * heave * fade;
          lobe.mesh.scaling.set(size, size * sag, size);
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
        flameMat.dispose();
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
