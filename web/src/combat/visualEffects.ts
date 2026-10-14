import {
  Scene, Vector3, Quaternion, Mesh, MeshBuilder, Color3, TransformNode,
  PBRMetallicRoughnessMaterial, ParticleSystem, StandardMaterial, DynamicTexture,
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
// A spell dome (see VisualEffects.spawnSpellDome): its life in seconds, the share of it spent swelling and fading, and its see-through-ness.
// Shed gear (see VisualEffects.spawnGearLitter): how far off it lands, how far a board leans back off upright, and how far a weapon's grip end stands off the ground.
const GEAR_TOSS_MIN = 0.6;
const GEAR_TOSS_MAX = 1.1;
const GEAR_BOARD_LEAN = 0.35;
const GEAR_BLADE_RAISE = 0.28;
// The soft fire round a blast (see VisualEffects._spawnFireEnvelope): the fire sprites' life in seconds (smoke lives 2.2 times as long), and how many of each.
const ENVELOPE_LIFE = 0.8;
const ENVELOPE_FIRE = 9;
const ENVELOPE_SMOKE = 6;
// Near-white core sprites at the heart of a blast.
const ENVELOPE_CORE = 3;
const DOME_LIFE = 1.4;
const DOME_RISE = 0.15;
const DOME_FADE = 0.35;
const DOME_ALPHA = 0.5;

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
        if (e.particles) for (const ps of e.particles) { ps.stop(); ps.dispose(false); }
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

    this._spawnShockRing(endPoint);

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

  // ══════════════════ SHOCK RING ══════════════════
  /**
   * A solid white ring standing in the air round a magic strike and turned square to the camera (trailer_2_sheet_03
   * r2c1): one faceted band that widens from a body's width to more than a man's height, its band broadening with it,
   * opaque for most of its life and only faded over the last third, so it reads as one graphic shape and not a haze.
   * Outlives the bolt that made it.
   */
  private _spawnShockRing(at: Vector3): void {
    const root = new TransformNode("shockRing", this._scene);
    root.position.copyFrom(at);
    root.billboardMode = TransformNode.BILLBOARDMODE_ALL;
    const ringMat = getMaterialFactory().createUnique("cloth", new Color3(0.97, 0.99, 1));
    ringMat.emissiveColor = new Color3(1, 1, 1);
    ringMat.disableLighting = true;
    const glow = this._scene.getGlowLayerByName("glow");
    const ring = MeshBuilder.CreateTorus("shockRingBand", { diameter: 1, thickness: 0.16, tessellation: 18 }, this._scene);
    ring.rotation.x = Math.PI / 2; // its axis down the line of sight, so the camera sees the whole hoop
    ring.scaling.y = 0.35; // a flat band, not a tube
    ring.material = ringMat;
    ring.parent = root;
    glow?.addExcludedMesh(ring);
    const life = 0.7;
    const grow = (u: number): void => {
      // Fast out, slowing as it widens: 0.4 m across at the strike to 2.6 m
      const reach = 0.4 + 2.2 * (1 - (1 - u) * (1 - u));
      root.scaling.setAll(reach);
      const fade = u < 0.66 ? 1 : 1 - (u - 0.66) / 0.34;
      if (fade < 1) { ringMat.alpha = Math.max(0, fade); ringMat.transparencyMode = 2; }
    };
    grow(0);
    this._effects.push({
      root,
      remaining: life,
      update: (_dt, remaining) => grow(Math.min(1, 1 - remaining / life)),
      dispose: () => {
        glow?.removeExcludedMesh(ring);
        ringMat.dispose();
      },
    });
  }

  // ══════════════════ FIRE ENVELOPE ══════════════════
  /**
   * The soft fire round a blast (trailer_3_sheet_03 r1c2): the solid lobes are the heart, and round them a glowing mass of feathered camera-facing sprites,
   * orange at the core and rising, swelling and thinning away over ENVELOPE_LIFE, with grey smoke sprites that rise out of it slower and outlast it, so the
   * burst has a soft edge and drifts instead of being a cluster of hard balls.
   */
  private _spawnFireEnvelope(position: Vector3, scale: number): void {
    const root = new TransformNode("fireEnvelope", this._scene);
    const sprites: { mesh: Mesh; mat: StandardMaterial; born: number; grown: number; rise: Vector3; life: number; peak: number }[] = [];
    // Fire and core sprites are additive, so they glow over the smoke: blended normally over the grey smoke they came
    // out mustard and brown; added, they can only brighten, so the heart of the blast glows near white. (Drawn over everything, they washed out the guns in front.)
    const add = (fire: boolean, i: number, count: number, core = false): void => {
      const angle = (i / count) * Math.PI * 2 + Math.random() * 0.8;
      const out = (fire ? 0.5 : 0.3) * scale * (0.6 + Math.random() * 0.6);
      const mesh = MeshBuilder.CreatePlane(fire ? "envelopeFire" : "envelopeSmoke", { size: 1 }, this._scene);
      mesh.billboardMode = Mesh.BILLBOARDMODE_ALL;
      mesh.isPickable = false;
      mesh.parent = root;
      mesh.position.set(position.x + Math.cos(angle) * out, position.y + (fire ? 0.5 : 0.9) * scale + Math.random() * 0.5 * scale, position.z + Math.sin(angle) * out);
      const mat = this._envelopeMat(core ? new Color3(1, 0.95, 0.82) : fire ? new Color3(1, 0.62 + Math.random() * 0.15, 0.25) : new Color3(0.42, 0.4, 0.38), fire);
      mesh.material = mat;
      if (core) mesh.position.set(position.x + Math.cos(angle) * out * 0.3, position.y + 0.6 * scale, position.z + Math.sin(angle) * out * 0.3);
      this._scene.getGlowLayerByName("glow")?.addExcludedMesh(mesh);
      const born = (core ? 1.9 : fire ? 1.3 : 1.0) * scale * (0.8 + Math.random() * 0.5);
      sprites.push({
        mesh, mat, born, grown: born * (fire ? 1.8 : 2.6),
        rise: new Vector3(Math.cos(angle) * 0.4, fire ? 1.1 : 0.7, Math.sin(angle) * 0.4).scale(scale),
        life: (fire ? ENVELOPE_LIFE : ENVELOPE_LIFE * 2.2) * (0.8 + Math.random() * 0.4),
        peak: core ? 0.65 : fire ? 0.5 : 0.55,
      });
    };
    for (let i = 0; i < ENVELOPE_FIRE; i++) add(true, i, ENVELOPE_FIRE);
    for (let i = 0; i < ENVELOPE_CORE; i++) add(true, i, ENVELOPE_CORE, true);
    for (let i = 0; i < ENVELOPE_SMOKE; i++) add(false, i, ENVELOPE_SMOKE);
    let age = 0;
    const life = ENVELOPE_LIFE * 2.6;
    this._effects.push({
      root,
      remaining: life,
      update: (dt) => {
        age += dt;
        for (const sp of sprites) {
          const u = Math.min(1, age / sp.life);
          sp.mesh.scaling.setAll(sp.born + (sp.grown - sp.born) * (1 - (1 - u) * (1 - u)));
          sp.mesh.position.addInPlace(sp.rise.scale(dt * (1 - u)));
          // In fast at full strength, then thinning away over the rest of its life
          sp.mat.alpha = sp.peak * (u < 0.15 ? u / 0.15 : 1 - (u - 0.15) / 0.85);
        }
      },
      dispose: () => {
        for (const sp of sprites) {
          this._scene.getGlowLayerByName("glow")?.removeExcludedMesh(sp.mesh);
          sp.mat.dispose();
        }
      },
    });
  }

  /** A feathered sprite material in one colour: the shared soft disc texture, unlit, no depth write, faded by its own alpha. */
  private _envelopeMat(color: Color3, additive = false): StandardMaterial {
    if (!this._softDisc) {
      const tex = new DynamicTexture("softDiscTex", { width: 64, height: 64 }, this._scene, false);
      const ctx = tex.getContext() as unknown as CanvasRenderingContext2D;
      const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      g.addColorStop(0, "rgba(255,255,255,1)");
      g.addColorStop(0.5, "rgba(255,255,255,0.7)");
      g.addColorStop(1, "rgba(255,255,255,0)");
      ctx.clearRect(0, 0, 64, 64);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 64, 64);
      tex.hasAlpha = true;
      tex.update();
      this._softDisc = tex;
    }
    const m = new StandardMaterial("envelopeMat", this._scene);
    m.diffuseTexture = this._softDisc;
    m.useAlphaFromDiffuseTexture = true;
    m.disableLighting = true;
    m.emissiveColor = color;
    m.backFaceCulling = false;
    m.disableDepthWrite = true;
    if (additive) m.alphaMode = 1; // ALPHA_ADD
    return m;
  }
  private _softDisc: DynamicTexture | null = null;

  // ══════════════════ SPELL DOME ══════════════════
  /**
   * A magic strike's area as one graphic shape (tabs_screenshot_09): a whole hemisphere of one flat colour standing on the ground over the area the spell
   * hits, unlit and see-through, so the bodies inside show through it. It swells from the ground to its full radius in DOME_RISE, holds, and fades over its
   * last DOME_FADE share of DOME_LIFE, so it is caught whole in frame for most of a second.
   */
  spawnSpellDome(position: Vector3, radius: number, color = new Color3(0.93, 0.42, 0.62)): void {
    const root = new TransformNode("spellDome", this._scene);
    root.position.set(position.x, 0, position.z);
    const mat = getMaterialFactory().createUnique("cloth", color);
    mat.emissiveColor = color;
    mat.disableLighting = true;
    mat.backFaceCulling = false;
    mat.transparencyMode = 2;
    mat.alpha = DOME_ALPHA;
    const dome = MeshBuilder.CreateSphere("spellDomeShell", { diameter: 2, segments: 12, slice: 0.5 }, this._scene);
    dome.material = mat;
    dome.parent = root;
    dome.isPickable = false;
    this._scene.getGlowLayerByName("glow")?.addExcludedMesh(dome);
    const shape = (u: number): void => {
      const rise = Math.min(1, u / DOME_RISE);
      root.scaling.setAll(Math.max(0.05, radius * (1 - (1 - rise) * (1 - rise))));
      mat.alpha = DOME_ALPHA * (u < 1 - DOME_FADE ? 1 : Math.max(0, (1 - u) / DOME_FADE));
    };
    shape(0);
    this._effects.push({
      root,
      remaining: DOME_LIFE,
      update: (_dt, remaining) => shape(Math.min(1, 1 - remaining / DOME_LIFE)),
      dispose: () => {
        this._scene.getGlowLayerByName("glow")?.removeExcludedMesh(dome);
        mat.dispose();
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
  /**
   * A few dark-red faceted chunks of mixed shape and size knocked loose by a hit: they tumble out, drop, and then lie
   * where they land for the rest of the battle, squashed flat on the grass, so the melee floor collects them.
   * Lit and matte, so nothing glows. The oldest landed chunks are cleared past LITTER_CAP.
   */
  spawnHitDebris(position: Vector3, intensity = 1): void {
    const root = new TransformNode("hitDebris", this._scene);
    root.position = position.clone();
    root.position.y += 0.9;
    const mats = this._debrisMats();
    const floorY = -root.position.y + 0.05;

    const chunks: { mesh: Mesh; size: number; velocity: Vector3; spin: Vector3; landed: boolean }[] = [];
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
      // One big lump and the rest progressively smaller, big enough to read on the ground at battle distance
      const size = (0.26 - 0.04 * i) * (0.8 + Math.random() * 0.35);
      mesh.scaling.setAll(size);
      chunks.push({
        mesh,
        size,
        velocity: new Vector3(Math.cos(angle) * speed, 1.6 + Math.random() * 1.6, Math.sin(angle) * speed),
        spin: new Vector3(4 + Math.random() * 6, Math.random() * 4, 4 + Math.random() * 6),
        landed: false,
      });
    }

    const settle = (chunk: (typeof chunks)[number]): void => {
      chunk.landed = true;
      chunk.mesh.position.y = floorY + chunk.size * 0.15;
      // Lie flat: keep the yaw, drop the tumble, squash it into the grass
      chunk.mesh.rotation.set(0, chunk.mesh.rotation.y, 0);
      chunk.mesh.scaling.set(chunk.size * 1.15, chunk.size * 0.45, chunk.size * 1.15);
      // Hand it over to the battle floor in world space, frozen
      chunk.mesh.setParent(null);
      chunk.mesh.freezeWorldMatrix();
      this._litter.push(chunk.mesh);
      while (this._litter.length > VisualEffects.LITTER_CAP) this._litter.shift()!.dispose();
    };

    this._effects.push({
      root,
      remaining: 1.2,
      update: (dt) => {
        for (const chunk of chunks) {
          if (chunk.landed) continue;
          chunk.velocity.y -= 14 * dt;
          chunk.mesh.position.addInPlace(chunk.velocity.scale(dt));
          chunk.mesh.rotation.addInPlace(chunk.spin.scale(dt));
          if (chunk.mesh.position.y < floorY) settle(chunk);
        }
      },
      // Anything still in the air when the effect ends lands where it is
      dispose: () => { for (const chunk of chunks) if (!chunk.landed && !chunk.mesh.isDisposed()) settle(chunk); },
    });
  }

  // ══════════════════ SHED GEAR ══════════════════
  /**
   * A dead man's shield and weapon (RuntimeUnit.shedGear) lie loose beside him where they read over the grass (trailer_2_sheet_02 r1c2: a round shield on its
   * rim by the dead, a sword lying clear): each lands GEAR_TOSS_MIN..MAX off where it was held, on its own heading; a board stands leaning on its rim
   * GEAR_BOARD_LEAN off upright, a weapon lies along the ground with its grip end raised GEAR_BLADE_RAISE; then it is set down so its lowest point is on the
   * ground. Laid at once, not flown: effects stop with the battle, and gear still in the air at the result hung there. Kept as litter, the oldest cleared past a
   * quarter of LITTER_CAP.
   */
  spawnGearLitter(gear: TransformNode[]): void {
    for (const node of gear) {
      const angle = Math.random() * Math.PI * 2;
      const reach = GEAR_TOSS_MIN + Math.random() * (GEAR_TOSS_MAX - GEAR_TOSS_MIN);
      node.position.x += Math.cos(angle) * reach;
      node.position.z += Math.sin(angle) * reach;
      const board = /shield/.test(node.name);
      // A board's face is its local Z: leant back off upright. A weapon's length is its local Y: laid down along the ground but for its raised grip end.
      const pitch = board ? GEAR_BOARD_LEAN : Math.PI / 2 - GEAR_BLADE_RAISE;
      node.rotationQuaternion = Quaternion.RotationYawPitchRoll(Math.random() * Math.PI * 2, pitch, (Math.random() - 0.5) * 0.3);
      node.computeWorldMatrix(true);
      for (const child of node.getChildMeshes()) child.computeWorldMatrix(true);
      const lowest = node.getHierarchyBoundingVectors(true).min.y;
      node.position.y -= lowest;
      node.freezeWorldMatrix();
      this._gearLitter.push(node);
      while (this._gearLitter.length > VisualEffects.LITTER_CAP / 4) this._gearLitter.shift()!.dispose();
    }
  }
  private _gearLitter: TransformNode[] = [];

  /** Landed debris chunks, kept until the battle is cleared */
  private _litter: Mesh[] = [];
  private static readonly LITTER_CAP = 240;
  private _debrisMatPair?: PBRMetallicRoughnessMaterial[];

  /** The two dark blood reds every debris chunk shares, made once */
  private _debrisMats(): PBRMetallicRoughnessMaterial[] {
    if (!this._debrisMatPair) {
      this._debrisMatPair = [
        getMaterialFactory().createUnique("stone", new Color3(0.55, 0.07, 0.06)),
        getMaterialFactory().createUnique("stone", new Color3(0.38, 0.04, 0.04)),
      ];
    }
    return this._debrisMatPair;
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
  /** A lumpy two-tone fireball, fat yellow lobes each inside an orange shell with a few orange flecks thrown clear, that burns out piece by piece, a head-sized white smoke puff, the dark ball, a low bank of tan dust puffs billowing out along the ground wider than the fire and a spray of clods that outlasts the smoke. No particles. */
  spawnExplosionBurst(position: Vector3, scale = 1): void {
    this._spawnFireEnvelope(position, scale);
    const root = new TransformNode("explosionBurst", this._scene);
    root.position = position.clone();
    root.position.y += 0.6 * scale;

    // Lit matte materials, bar the fire. The fire is unlit and two-tone, each piece showing its own colour alone: golden yellow for the heart, orange for the
    // shell round it and a deeper orange for the flecks. No sunlight falls on any of it and none of it has any blue, so the tone curve cannot lift it to cream.
    const mats = getMaterialFactory();
    const coreMat = this._fxMat(Color3.Black(), new Color3(1.3, 0.6, 0));
    // The shell is drawn inside out, far side only: it stands as an orange rim round its yellow lobe from any angle and never covers it.
    const shellMat = this._fxMat(Color3.Black(), new Color3(1.0, 0.22, 0));
    shellMat.cullBackFaces = false;
    const fleckMat = this._fxMat(Color3.Black(), new Color3(0.85, 0.13, 0));
    const glow = this._scene.getGlowLayerByName("glow");
    const smokeMat = mats.createUnique("cloth", new Color3(0.86, 0.85, 0.82));
    smokeMat.emissiveColor = new Color3(0.14, 0.14, 0.13);
    // The dust shows its own colour alone, in three tans all well short of the bloom threshold: lit by the sun, any tan rendered as neutral grey rock.
    const dustMats = [new Color3(0.8, 0.6, 0.35), new Color3(0.68, 0.5, 0.28), new Color3(0.56, 0.4, 0.22)]
      .map((tan) => this._fxMat(Color3.Black(), tan));
    const ballMat = mats.createUnique("stone", new Color3(0.1, 0.1, 0.11));
    const clodMat = mats.createUnique("stone", new Color3(0.24, 0.2, 0.16));
    const floorY = -root.position.y + 0.08;

    const blob = (name: string, segments: number, mat: typeof coreMat): TransformNode => {
      const mesh = MeshBuilder.CreateSphere(name, { diameter: 1, segments }, this._scene);
      mesh.material = mat;
      mesh.parent = root;
      return mesh;
    };
    // Fireball: no ball and no star. Four fat squashed yellow lobes of unequal size for the heart, each pushed off the middle its own way and each wrapped in a
    // bigger orange shell of its own shape, so the mass is yellow in the middle and orange at every edge and in every dent between lobes. Round it a few
    // short orange flecks thrown clear, and stubby ones low along the ground for the skirt. The silhouette is a lumpy mass wider than it is tall, about a man and a half high for a shell.
    // Fixed layout, so every blast has the same shape.
    const fireScale = Math.min(scale * 1.2, 1.6);
    const fire: { mesh: Mesh; dir: Vector3; reach: number; size: number; length: number; wide: number; deep: number; life: number }[] = [];
    // The heart is not a ball: one big lobe up and to one side, a middling one low on the other, two small ones out at the edges. None sits on the middle,
    // none is as wide as it is deep, and each is a different size, so they stand as a lumpy mass with dents between them and do not merge into a globe.
    const LOBES = [
      { angle: 0.6, lift: 0.7, size: 0.95, reach: 0.34 },
      { angle: 2.9, lift: 0.3, size: 0.7, reach: 0.52 },
      { angle: 4.6, lift: 0.5, size: 0.52, reach: 0.48 },
      { angle: 5.6, lift: 0.15, size: 0.4, reach: 0.64 },
    ];
    const HEART = LOBES.length;
    const SPIKES = 3;
    const SHARDS = HEART + SPIKES + 5;
    for (let i = 0; i < SHARDS; i++) {
      const heart = i < HEART;
      const lobe = heart ? LOBES[i] : null;
      const skirt = i >= HEART + SPIKES;
      const jitter = (i * 0.618034) % 1; // spreads sizes and lives evenly without two neighbours alike
      const angle = lobe ? lobe.angle : i * 2.39996 + 0.6;
      // Each heart lobe leans its own way, spikes fan from steep to shallow, the skirt lies nearly flat
      const lift = lobe ? lobe.lift : skirt ? 0.08 + 0.2 * jitter : 0.3 + 0.6 * jitter;
      const flat = Math.sqrt(1 - lift * lift);
      const dir = new Vector3(Math.cos(angle) * flat, lift, Math.sin(angle) * flat);
      const mesh = MeshBuilder.CreatePolyhedron("burstFlash", { type: heart ? 2 + (i % 2) : i % 4, size: 0.5 }, this._scene);
      mesh.material = heart ? coreMat : skirt ? fleckMat : shellMat;
      mesh.parent = root;
      // Long axis along the line of flight, and a turn about it so no two facets catch the eye alike
      mesh.rotationQuaternion = Quaternion.FromUnitVectorsToRef(Vector3.Up(), dir, new Quaternion()).multiply(Quaternion.RotationAxis(Vector3.Up(), i * 1.3));
      glow?.addExcludedMesh(mesh); // none of it is in the glow layer: its halo washed over the whole burst and it read as see-through haze
      const size = (lobe ? lobe.size : skirt ? 0.3 + 0.2 * jitter : 0.2 + 0.14 * jitter) * fireScale;
      // The heart outlasts the flecks, and each piece goes out at its own moment: the burst breaks up, it does not shrink as one
      const life = heart ? 0.42 + 0.12 * jitter : 0.24 + 0.24 * jitter;
      fire.push({
        mesh,
        dir,
        // Flecks fly clear of the shells; the skirt stays under them
        reach: (lobe ? lobe.reach : skirt ? 0.55 + 0.35 * jitter : 0.95 + 0.3 * jitter) * fireScale,
        size,
        length: size * (heart ? 0.95 : skirt ? 1.2 + 0.4 * jitter : 1.0 + 0.3 * jitter),
        // A lobe is fat one way and squashed the other; a fleck is as deep as it is wide
        wide: heart ? 1.3 : 1,
        deep: heart ? 0.68 : 1,
        life,
      });
      if (lobe) {
        // Its shell: the same solid lying the same way, half as big again and a little further out, burning a moment longer than the lobe inside it
        const shell = MeshBuilder.CreatePolyhedron("burstShell", { type: 2 + (i % 2), size: 0.5 }, this._scene);
        shell.material = shellMat;
        shell.parent = root;
        shell.rotationQuaternion = mesh.rotationQuaternion.clone();
        glow?.addExcludedMesh(shell);
        fire.push({ mesh: shell, dir, reach: (lobe.reach + 0.06) * fireScale, size: size * 1.5, length: size * 1.4, wide: 1.3, deep: 0.8, life: life + 0.05 });
      }
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

    // Dust: not a ring of stones. A bank of fat squashed puffs lying on the ground under the fire, spread over a disc so each overlaps its neighbours
    // and the whole reads as one low cloud wider than the burst: big dark ones out at the rim, small pale ones heaped on the middle. It stands knee high.
    const dustScale = Math.min(scale, 1.4);
    const DUST_PUFFS = 14;
    const bank: { mesh: TransformNode; size: number; angle: number; reach: number; tall: number }[] = [];
    for (let i = 0; i < DUST_PUFFS; i++) {
      const spread = Math.sqrt((i + 0.5) / DUST_PUFFS); // even cover of the disc, so there is no hole in the middle and no gap at the rim
      const puff = blob("burstDust", 2, dustMats[i < 4 ? 0 : i % 2 === 0 ? 1 : 2]);
      puff.rotation.y = i * 1.3;
      glow?.addExcludedMesh(puff as Mesh);
      bank.push({
        mesh: puff,
        size: (0.7 + 0.5 * spread + 0.25 * ((i * 0.618034) % 1)) * dustScale,
        angle: i * 2.39996 + Math.random() * 0.4,
        reach: 2.3 * spread * dustScale,
        tall: 0.9 - 0.3 * spread,
      });
    }
    // Nine dark faceted clods of mixed shape and size thrown clear of it on high arcs, landing round the crater and lying there.
    const chunks: { mesh: TransformNode; size: number; velocity: Vector3 }[] = [];
    const CLODS = 9;
    for (let i = 0; i < CLODS; i++) {
      const chunk = i % 3 === 2
        ? MeshBuilder.CreateBox("burstClod", { width: 1, height: 0.6, depth: 0.75 }, this._scene)
        : MeshBuilder.CreatePolyhedron("burstClod", { type: i % 3, size: 0.5 }, this._scene);
      chunk.material = clodMat;
      chunk.parent = root;
      chunk.rotation.set(Math.random() * 6.28, Math.random() * 6.28, Math.random() * 6.28);
      const angle = (i / CLODS) * Math.PI * 2 + Math.random() * 1.1;
      const speed = (1.2 + Math.random() * 1.8) * scale;
      chunk.position.y = floorY + 0.35;
      chunks.push({
        mesh: chunk,
        size: (0.16 + Math.random() * Math.random() * 0.2) * scale,
        velocity: new Vector3(Math.cos(angle) * speed, 3.5 + Math.random() * 3, Math.sin(angle) * speed),
      });
    }

    const smokeDuration = 1.1;
    const totalDuration = 1.9;
    this._effects.push({
      root,
      remaining: totalDuration,
      update: (dt, remaining) => {
        const elapsed = totalDuration - remaining;
        const fade = Math.max(0.001, Math.min(1, remaining / 0.35));
        // The shards fly out fast and slow to a stop, each swelling as it goes and burning out at its own moment, all of them before the bodies they threw have peaked.
        const flight = 1 - Math.exp(-elapsed * 9);
        for (const shard of fire) {
          const burn = Math.min(1, elapsed / 0.06 + 0.3) * Math.max(0, Math.min(1, (shard.life - elapsed) / 0.14));
          shard.dir.scaleToRef(shard.reach * (0.35 + 1.1 * flight), shard.mesh.position);
          const girth = Math.max(0.001, shard.size * burn);
          shard.mesh.scaling.set(girth * shard.wide, Math.max(0.001, shard.length * burn), girth * shard.deep);
        }
        const swell = 0.45 + 0.55 * Math.min(1, elapsed / 0.2);
        // The puff is gone while the clods it kicked up are still settling.
        const smokeFade = Math.max(0.001, Math.min(1, (smokeDuration - elapsed) / 0.35));
        for (const lobe of lobes) {
          lobe.mesh.position.y += lobe.rise * dt;
          lobe.mesh.scaling.setAll(lobe.size * swell * smokeFade);
        }
        // The bank billows out fast and slows, each puff swelling as it goes, then thins from the rim inward and is gone 60% of the way through, before the clods stop.
        const roll = 1 - Math.exp(-elapsed * 6);
        for (const puff of bank) {
          const settle = Math.max(0.001, Math.min(1, (totalDuration * 0.6 - elapsed - 0.15 * puff.reach / dustScale) / 0.4));
          const reach = puff.reach * (0.3 + 0.7 * roll);
          const size = puff.size * (0.45 + 0.55 * roll) * settle;
          const height = size * puff.tall;
          puff.mesh.position.set(Math.cos(puff.angle) * reach, floorY + height * 0.3, Math.sin(puff.angle) * reach);
          puff.mesh.scaling.set(size, height, size);
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
        shellMat.dispose();
        fleckMat.dispose();
        smokeMat.dispose();
        for (const mat of dustMats) mat.dispose();
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
      if (e.particles) for (const ps of e.particles) { ps.stop(); ps.dispose(false); }
      e.root.dispose();
      e.dispose?.();
    }
    this._effects.length = 0;
    for (const m of this._litter) m.dispose();
    this._litter.length = 0;
    for (const g of this._gearLitter) g.dispose();
    this._gearLitter.length = 0;
  }
}
