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
   * Spawn a jagged lightning bolt from origin to target: a chain of short thick shards that kink hard
   * at every joint and taper toward the strike. Flat blue-white on a cyan rim, opaque for its whole life, and kept out of the glow layer, so it reads
   * as a solid cut-out shape instead of a blooming beam.
   */
  spawnLightning(origin: Vector3, target: Vector3): void {
    const root = new TransformNode("lightning", this._scene);
    // Unlit: one flat blue-white on every face, in sun and in shade, so the bolt is a cut-out shape and not shaded bars
    const boltMat = getMaterialFactory().createUnique("cloth", new Color3(0.96, 0.99, 1));
    boltMat.emissiveColor = new Color3(1, 1, 1);
    boltMat.disableLighting = true;
    boltMat.backFaceCulling = false;
    boltMat.transparencyMode = 0;
    // Flat cyan, for the wider shard that backs each white one and shows round it as a rim
    const rimMat = getMaterialFactory().createUnique("cloth", new Color3(0, 0.55, 0.9));
    rimMat.emissiveColor = new Color3(0, 0.55, 0.9);
    rimMat.disableLighting = true;
    rimMat.backFaceCulling = false;
    const glow = this._scene.getGlowLayerByName("glow");
    const shards: Mesh[] = [];

    const start = origin.clone();
    start.y += 1.5; // start from head height
    const endPoint = target.clone();
    endPoint.y += 0.8;
    const dir = endPoint.subtract(start);
    const len = dir.length();
    // Sideways axis of the zigzag: square to the bolt and to the camera's line of sight, so the corners lie flat
    // to the screen and never edge-on (level and square to the bolt when there is no camera or it looks down the bolt)
    const eye = this._scene.activeCamera?.globalPosition;
    const side = Vector3.Cross(dir, eye ? eye.subtract(Vector3.Center(start, endPoint)) : Vector3.Up());
    if (side.lengthSquared() < 1e-6) side.copyFrom(Vector3.Cross(dir, Vector3.Up()));
    if (side.lengthSquared() < 1e-6) side.set(1, 0, 0);
    side.normalize();

    // Build the zigzag: a few long shards of very unequal length and width, each joint thrown a different distance
    // off the line: a handful of irregular slabs, not an even sawtooth
    // No shard longer than about 1.2: a long bolt gets more kinks, not longer straight arms
    const segments = Math.max(4, Math.min(24, Math.ceil(len / 1.2)));
    const points: Vector3[] = [start];
    const amp = Math.max(0.45, Math.min(0.6, (len / segments) * 0.6));
    let sign = Math.random() < 0.5 ? -1 : 1;
    for (let i = 1; i < segments; i++) {
      // Joints sit unevenly along the bolt: long and short shards alternate
      const base = Vector3.Lerp(start, endPoint, (i + (Math.random() - 0.5) * 0.8) / segments);
      // Thrown anywhere from barely to well off the line
      base.addInPlace(side.scale(sign * amp * (0.15 + Math.random() * 1.1)));
      points.push(base);
      // Usually, not always, to the other side of the last joint
      if (Math.random() < 0.65) sign = -sign;
    }
    points.push(endPoint);

    const addShard = (a: Vector3, b: Vector3, thickness: number): void => {
      // A flat four-sided blade, not a parallel-sided beam: broad where it leaves the last joint and pinched almost to a point
      // at the next, so the bolt is a chain of wedges that steps in width at every kink
      const shard = MeshBuilder.CreateCylinder("lseg", {
        height: Vector3.Distance(a, b) + thickness * 0.5, diameterBottom: thickness * 3.2, diameterTop: thickness * 0.3, tessellation: 4,
      }, this._scene);
      shard.position = Vector3.Center(a, b);
      // The spike's length is its own Y: the quarter pitch lays that along the aim, thin end at b
      shard.lookAt(b, 0, Math.PI / 2, 0);
      // Pressed to a quarter of its depth across whichever of its two cross axes points more at the camera, so
      // it shows its broad face and is one flat cut-out polygon with no shaded rim
      shard.computeWorldMatrix(true);
      const toEye = eye ? eye.subtract(shard.position) : Vector3.Zero();
      if (Math.abs(Vector3.Dot(shard.getDirection(Vector3.Right()), toEye)) > Math.abs(Vector3.Dot(shard.getDirection(Vector3.Forward()), toEye))) {
        shard.scaling.x = 0.25;
      } else {
        shard.scaling.z = 0.25;
      }
      shard.material = boltMat;
      glow?.addExcludedMesh(shard); // no halo off the white blade: it would wash the cyan rim beside it out to white
      shard.parent = root;
      shards.push(shard);
      // Cyan rim: the same blade 1.6 times as broad, a hair behind the white one as the camera sees it
      const rim = shard.clone("lrim");
      rim.scaling.set(shard.scaling.x === 0.25 ? 0.25 : 1.6, 1.05, shard.scaling.z === 0.25 ? 0.25 : 1.6);
      if (eye) rim.position.subtractInPlace(toEye.normalize().scale(0.04));
      rim.material = rimMat;
      glow?.addExcludedMesh(rim);
      shards.push(rim);
    };

    // Thick at the caster, thin at the strike, each shard anywhere from half to twice that
    for (let i = 0; i < points.length - 1; i++) {
      addShard(points[i], points[i + 1], (0.08 - 0.045 * (i / (points.length - 2))) * (0.5 + Math.random() * 1.7));
    }

    // Branch bolt (smaller fork) kicking off the second joint
    const forkOrigin = points[2];
    const forkSide = Math.random() < 0.5 ? -1 : 1;
    const forkKnee = forkOrigin.add(dir.scale(0.4 / len)).add(side.scale(forkSide * 0.3));
    forkKnee.y += 0.2;
    const forkEnd = forkKnee.add(dir.scale(0.35 / len)).add(side.scale(forkSide * 0.1));
    forkEnd.y -= 0.3;
    addShard(forkOrigin, forkKnee, 0.04);
    addShard(forkKnee, forkEnd, 0.0275);

    // No strike flash and no fade: the bolt is solid for its whole life and then gone, so it is never a see-through shape
    this._effects.push({
      root,
      remaining: 0.25,
      update: () => {},
      dispose: () => {
        for (const shard of shards) glow?.removeExcludedMesh(shard);
        boltMat.dispose();
        rimMat.dispose();
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

    // Lit matte materials, bar the flames: fully emissive ones trip the bloom threshold and wash out to white. The inner flame and the fringe are unlit
    // and show their own colour alone, set well short of white in green and blue: the tone curve lifts both, and sunlight on top clipped them to cream.
    const mats = getMaterialFactory();
    // The fireball is mostly self-lit and graded from the inside out: a white-hot heart and a pale yellow inner
    // flame, both lit past white so they burn out to cream on screen, and a soft orange fringe. The inner flame sits between heart and fringe in hue, so it is a step of the grade and not a lemon patch.
    const coreMat = mats.createUnique("cloth", new Color3(1, 0.85, 0.3));
    coreMat.emissiveColor = new Color3(2.0, 1.95, 1.6);
    const flashMat = mats.createUnique("unlit", new Color3(1, 0.7, 0.2));
    flashMat.emissiveColor = new Color3(3.4, 3.4, 1.2);
    const flameMat = mats.createUnique("unlit", new Color3(1, 0.38, 0.02));
    flameMat.emissiveColor = new Color3(1.7, 1.25, 0.6);
    // The foot of the ball is a deeper orange than the fringe, whose own colour burns out to peach beside the heart.
    const footMat = mats.createUnique("unlit", new Color3(1, 0.38, 0.02));
    footMat.emissiveColor = new Color3(1.6, 0.45, 0.1);
    const glow = this._scene.getGlowLayerByName("glow");
    const smokeMat = mats.createUnique("cloth", new Color3(0.86, 0.85, 0.82));
    smokeMat.emissiveColor = new Color3(0.14, 0.14, 0.13);
    // The fireball heart's pale yellow and part self-lit, so the dust is the foot of the blast and not a grey boulder under it
    const dustMat = mats.createUnique("stone", new Color3(1, 0.93, 0.7));
    dustMat.emissiveColor = new Color3(0.32, 0.28, 0.17);
    const ballMat = mats.createUnique("stone", new Color3(0.1, 0.1, 0.11));
    const clodMat = mats.createUnique("stone", new Color3(0.24, 0.2, 0.16));
    const floorY = -root.position.y + 0.08;

    const blob = (name: string, segments: number, mat: typeof flashMat): TransformNode => {
      const mesh = MeshBuilder.CreateSphere(name, { diameter: 1, segments }, this._scene);
      mesh.material = mat;
      mesh.parent = root;
      return mesh;
    };
    // Fireball: a small pale heart with orange lobes standing out of its flanks to make the rim, and short round
    // tongues of flame swelling up and out of it, so the silhouette is one soft lumpy ball. All of it is round
    // enough to show no facets, and a shell's can grow to about two men tall.
    const fireScale = Math.min(scale * 1.2, 2.0); // at twice the blast scale and up to 3.6 a shell burst was a house-sized ball on two domes wider than the gun
    const fire: { mesh: TransformNode; size: number; length?: number }[] = [];
    const lobeSizes = [1.0, 1.0, 0.5, 0.9, 0.45, 0.6];
    // None sits above the heart's shoulder: lumps on one ball, not caps over it. The flank lobes are the pale inner flame, bar the two foot lobes: they are a deep orange, both sunk to near their middle in the ground so the orange is a low foot and not half the ball, the lowest and stood out clear of the heart, so the ball stands on a warm foot and is not one pale tone to the ground
    const lobeHeights = [0.5, -0.25, 0.55, -0.3, 0.6, 0.35];
    for (let i = 0; i < lobeSizes.length; i++) {
      const lobe = blob("burstFlash", 6, i === 0 ? coreMat : i === 1 || i === 3 ? footMat : flashMat);
      const angle = i * 2.4 + 0.6;
      const reach = (i === 0 ? 0 : i === 3 ? 0.4 : 0.45 - lobeSizes[i] * 0.3) * fireScale;
      lobe.position.set(Math.cos(angle) * reach, lobeHeights[i] * fireScale, Math.sin(angle) * reach);
      lobe.rotation.set(i * 1.3, i * 2.1, 0);
      glow?.addExcludedMesh(lobe as Mesh); // none of it is in the glow layer: its halo washed over the whole ball and it read as see-through haze
      fire.push({ mesh: lobe, size: lobeSizes[i] * fireScale });
    }
    // Tongues: fat egg-shaped lobes rooted in the heart, one nearly straight up and the rest fanned out at
    // mixed lengths and leans, none lying flat. Fixed layout, so every blast has the same flame shape.
    const tongueLengths = [0.95, 0.75, 0.85, 0.7, 0.85, 0.65, 0.75];
    const tongueWidths = [0.95, 0.8, 0.85, 0.7, 0.8, 0.65, 0.75];
    const tongueLeans = [0.1, 0.7, 0.9, 0.5, 0.9, 0.8, 0.85];
    for (let i = 0; i < tongueLengths.length; i++) {
      const tongue = MeshBuilder.CreateSphere("burstFlash", { diameter: 1, segments: 6 }, this._scene);
      tongue.position.y = 0.5;
      tongue.bakeCurrentTransformIntoVertices();
      tongue.material = i % 2 === 0 ? flashMat : flameMat;
      tongue.parent = root;
      tongue.position.y = 0.3 * fireScale;
      tongue.rotation.set(0, i * 2.4 + 0.3, tongueLeans[i]);
      glow?.addExcludedMesh(tongue);
      fire.push({ mesh: tongue, size: tongueWidths[i] * fireScale, length: tongueLengths[i] * fireScale });
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

    // Dust: one fat mound of pale lobes sunk into each other, heaved up out of the crater, a big one in the middle and
    // smaller ones crowded against it, so the hit reads as a single burst from any side.
    const dustScale = Math.min(scale, 1.4);
    const mound: { mesh: TransformNode; size: number }[] = [];
    for (let i = 0; i < 6; i++) {
      const lobe = blob("burstDust", 2, dustMat);
      const angle = (i / 5) * Math.PI * 2 + Math.random() * 0.6;
      const reach = (i === 0 ? 0 : 0.14 + Math.random() * 0.1) * dustScale;
      const size = (i === 0 ? 0.85 : 0.4 + Math.random() * 0.25) * dustScale;
      lobe.position.set(Math.cos(angle) * reach, floorY + size * 0.12, Math.sin(angle) * reach);
      mound.push({ mesh: lobe, size });
    }
    // Six dark faceted clods of mixed shape and size thrown clear of it, landing close by and lying there.
    const chunks: { mesh: TransformNode; size: number; velocity: Vector3 }[] = [];
    for (let i = 0; i < 6; i++) {
      const chunk = i % 3 === 2
        ? MeshBuilder.CreateBox("burstClod", { width: 1, height: 0.6, depth: 0.75 }, this._scene)
        : MeshBuilder.CreatePolyhedron("burstClod", { type: i % 3, size: 0.5 }, this._scene);
      chunk.material = clodMat;
      chunk.parent = root;
      chunk.rotation.set(Math.random() * 6.28, Math.random() * 6.28, Math.random() * 6.28);
      const angle = (i / 6) * Math.PI * 2 + Math.random() * 1.1;
      const speed = (0.9 + Math.random() * 1.3) * scale;
      chunk.position.y = floorY + 0.35;
      chunks.push({
        mesh: chunk,
        size: (0.16 + Math.random() * Math.random() * 0.2) * scale,
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
          const girth = Math.max(0.001, lobe.size * burn);
          lobe.mesh.scaling.set(girth, Math.max(0.001, (lobe.length ?? lobe.size) * burn), girth);
        }
        const swell = 0.45 + 0.55 * Math.min(1, elapsed / 0.2);
        // The puff is gone while the clods it kicked up are still settling.
        const smokeFade = Math.max(0.001, Math.min(1, (smokeDuration - elapsed) / 0.35));
        for (const lobe of lobes) {
          lobe.mesh.position.y += lobe.rise * dt;
          lobe.mesh.scaling.setAll(lobe.size * swell * smokeFade);
        }
        // The mound heaves up fast, sags as it settles, and has shrunk away 40% of the way through, well before the clods stop.
        const heave = 0.35 + 0.65 * Math.min(1, elapsed / 0.14);
        const sag = 0.7 - 0.2 * Math.min(1, elapsed / totalDuration);
        const settle = Math.max(0.001, Math.min(1, (totalDuration * 0.4 - elapsed) / 0.4));
        for (const lobe of mound) {
          const size = lobe.size * heave * settle;
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
          chunk.mesh.scaling.setAll(size);
        }
      },
      dispose: () => {
        coreMat.dispose();
        flashMat.dispose();
        flameMat.dispose();
        footMat.dispose();
        smokeMat.dispose();
        dustMat.dispose();
        ballMat.dispose();
        clodMat.dispose();
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
