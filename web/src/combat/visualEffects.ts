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
// The burst as sprites (see the spec at VisualEffects._spawnFireball): fire sprite counts (white core, pale-yellow body, orange rim), seconds to full size and
// to gone, and the dust and smoke sprites under and over it with their lives.
const FIREBALL_CORE = 3;
const FIREBALL_BODY = 5;
const FIREBALL_RIM = 7;
const FIREBALL_GROW = 0.28;
const FIREBALL_LIFE = 0.9;
// How far behind the blast point, along the camera's line of sight, the fire sprites stand, per unit of fire scale.
const FIREBALL_BEHIND = 1.6;
// The fire's place in the see-through draw order (dust two below it, smoke one below): it is drawn last, over them.
const FIREBALL_ALPHA_INDEX = 1002;
const DUST_SPRITES = 10;
const DUST_LIFE = 1.8;
const SMOKE_SPRITES = 6;
const SMOKE_LIFE = 2.4;
const DOME_LIFE = 1.4;
const DOME_RISE = 0.15;
const DOME_FADE = 0.35;
const DOME_ALPHA = 0.5;
// The bone mage's spike row (see VisualEffects.spawnBoneSpikeRow): seconds between one spike and the next (the card's 0.025 s a bone), the pop-up and
// the sink-back times, how long the row stands, the overshoot of the pop; metres from the caster's feet to the first spike, past the mark to the last,
// between spikes and of sideways scatter; the nearest and farthest spikes' heights, the lean on toward the mark (rad) and the most spikes in a row.
const BONE_SPIKE_EVERY = 0.025;
const BONE_SPIKE_RISE = 0.08;
const BONE_SPIKE_SINK = 0.35;
const BONE_SPIKE_STAND = 1.6;
const BONE_SPIKE_OVERSHOOT = 0.18;
const BONE_SPIKE_START = 0.9;
const BONE_SPIKE_PAST = 0.4;
const BONE_SPIKE_STEP = 0.55;
const BONE_SPIKE_SIDE = 0.4;
const BONE_SPIKE_NEAR = 0.45;
const BONE_SPIKE_FAR = 1.35;
const BONE_SPIKE_LEAN = 0.22;
const BONE_SPIKE_MAX = 14;

/** Where the bone mage's row begins: the first spike's ground point, BONE_SPIKE_START ahead of the caster's feet toward his mark (nearer for a close one). */
export function boneSpikeRowNear(from: Vector3, to: Vector3): Vector3 {
  const dx = to.x - from.x, dz = to.z - from.z;
  const span = Math.hypot(dx, dz);
  if (span < 0.01) return from.clone();
  const start = Math.min(BONE_SPIKE_START, span * 0.3);
  return new Vector3(from.x + (dx / span) * start, from.y, from.z + (dz / span) * start);
}

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

  // ══════════════════ FIREBALL ══════════════════
  /*
   * A cannon or bomb burst, rebuilt as sprites (220). Spec, read off the reference:
   *   trailer_3_sheet_03 r1c1, r1c2: one soft, overexposed fireball about two men across, its heart clipped to white, cream-yellow through the body and pale
   *   orange only at the feathered rim; no hard edge, no outline and no solid shape anywhere in it; the flung bodies stand dark against it. r2c1: by the
   *   time the bodies land the fire is gone and only smoke and dust hang over the crater.
   * So:
   *   Fireball: FIREBALL_CORE near-white, FIREBALL_BODY pale-yellow and FIREBALL_RIM pale-orange feathered camera-facing discs, all additive so where they
   *   overlap the heart clips to white; the core small and central, the body round it, the rim widest and outermost. Each swells to full size by
   *   FIREBALL_GROW and is gone by FIREBALL_LIFE (about a second), so it is at its brightest while the bodies are thrown and out before they land.
   *   Dust: DUST_SPRITES feathered tan discs blended normally on the ground, billowing out low and wide under the fire and thinning over DUST_LIFE.
   *   Smoke: SMOKE_SPRITES feathered grey discs rising slowly out of the fire and outlasting it.
   *   No solid lobes, shells, flecks, smoke balls or dust domes: every soft part is a sprite. The shot ball and the clods stay solid: they are things.
   */
  private _spawnFireball(position: Vector3, scale: number): void {
    const root = new TransformNode("fireball", this._scene);
    const glow = this._scene.getGlowLayerByName("glow");
    const fire = Math.min(scale * 1.2, 1.6);
    const dust = Math.min(scale, 1.4);
    type Sprite = { mesh: Mesh; mat: StandardMaterial; born: number; grown: number; grow: number; drift: Vector3; life: number; peak: number };
    const sprites: Sprite[] = [];
    const add = (name: string, color: Color3, additive: boolean, at: Vector3, born: number, grown: number, grow: number, drift: Vector3, life: number, peak: number): void => {
      const mesh = MeshBuilder.CreatePlane(name, { size: 1 }, this._scene);
      mesh.billboardMode = Mesh.BILLBOARDMODE_ALL;
      mesh.isPickable = false;
      mesh.parent = root;
      mesh.position.copyFrom(at);
      const mat = this._envelopeMat(color, additive);
      mesh.material = mat;
      // Draw order among see-through meshes: dust first, then smoke, then the additive fire over both, so the fireball is composited over the dust and not
      // buried under it (depth still tests against the solid scene, so the guns and men in front stay in front)
      mesh.alphaIndex = additive ? FIREBALL_ALPHA_INDEX : name === "burstSmoke" ? FIREBALL_ALPHA_INDEX - 1 : FIREBALL_ALPHA_INDEX - 2;
      glow?.addExcludedMesh(mesh);
      sprites.push({ mesh, mat, born, grown, grow, drift, life, peak });
    };
    const ring = (count: number, out: number, lift: number, k: number): Vector3 => {
      const angle = (k / count) * Math.PI * 2 + Math.random() * 0.7;
      const reach = out * (0.6 + Math.random() * 0.5);
      return new Vector3(position.x + Math.cos(angle) * reach, position.y + lift, position.z + Math.sin(angle) * reach);
    };
    const still = Vector3.Zero();
    // The fire stands behind the men it throws, as the camera sees it: its sprites are set back FIREBALL_BEHIND along the line of sight, so a body in the
    // burst occludes the glow and reads dark against it (trailer_3_sheet_03 r1c2) instead of being washed pale by the additive light in front of it
    const eye = this._scene.activeCamera?.globalPosition;
    const back = eye ? position.subtract(eye) : Vector3.Zero();
    back.y = 0;
    if (back.lengthSquared() > 1e-6) back.normalize().scaleInPlace(FIREBALL_BEHIND * fire);
    const behind = (at: Vector3): Vector3 => at.addInPlace(back);
    for (let k = 0; k < FIREBALL_RIM; k++) {
      const at = behind(ring(FIREBALL_RIM, 0.75 * fire, (0.6 + Math.random() * 0.6) * fire, k));
      add("fireRim", new Color3(1, 0.62, 0.3), true, at, 0.6 * fire, 2.0 * fire, FIREBALL_GROW, new Vector3(0, 0.5 * fire, 0), FIREBALL_LIFE * (0.8 + Math.random() * 0.3), 0.55);
    }
    for (let k = 0; k < FIREBALL_BODY; k++) {
      const at = behind(ring(FIREBALL_BODY, 0.4 * fire, (0.7 + Math.random() * 0.4) * fire, k));
      add("fireBody", new Color3(1, 0.9, 0.6), true, at, 0.5 * fire, 1.7 * fire, FIREBALL_GROW, new Vector3(0, 0.4 * fire, 0), FIREBALL_LIFE * (0.75 + Math.random() * 0.25), 0.7);
    }
    for (let k = 0; k < FIREBALL_CORE; k++) {
      const at = behind(ring(FIREBALL_CORE, 0.12 * fire, 0.8 * fire, k));
      add("fireCore", new Color3(1, 0.98, 0.92), true, at, 0.4 * fire, 1.3 * fire, FIREBALL_GROW * 0.8, still, FIREBALL_LIFE * 0.6, 0.95);
    }
    for (let k = 0; k < DUST_SPRITES; k++) {
      const spread = Math.sqrt((k + 0.5) / DUST_SPRITES);
      const at = ring(DUST_SPRITES, 1.2 * spread * dust, 0.25 * dust, k);
      const away = at.subtract(position);
      away.y = 0;
      const tan = new Color3(0.78, 0.62, 0.42).scale(0.85 + 0.25 * Math.random());
      add("burstDust", tan, false, at, 0.8 * dust, 2.2 * dust, 0.5, away.scale(1.2), DUST_LIFE * (0.75 + Math.random() * 0.4), 0.8);
    }
    for (let k = 0; k < SMOKE_SPRITES; k++) {
      const at = ring(SMOKE_SPRITES, 0.5 * fire, 1.1 * fire, k);
      add("burstSmoke", new Color3(0.55, 0.53, 0.5), false, at, 0.7 * fire, 2.4 * fire, 1.2, new Vector3(0, 0.55, 0), SMOKE_LIFE * (0.8 + Math.random() * 0.4), 0.55);
    }
    let age = 0;
    this._effects.push({
      root,
      remaining: SMOKE_LIFE * 1.25,
      update: (dt) => {
        age += dt;
        for (const sp of sprites) {
          const u = Math.min(1, age / sp.life);
          const g = Math.min(1, age / sp.grow);
          sp.mesh.scaling.setAll(Math.max(0.001, sp.born + (sp.grown - sp.born) * (1 - (1 - g) * (1 - g))));
          sp.mesh.position.addInPlace(sp.drift.scale(dt * (1 - u)));
          // In at full strength fast, then thinning away over the rest of its life
          sp.mat.alpha = u >= 1 ? 0 : sp.peak * (u < 0.12 ? u / 0.12 : 1 - (u - 0.12) / 0.88);
        }
      },
      dispose: () => {
        for (const sp of sprites) {
          glow?.removeExcludedMesh(sp.mesh);
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

  // ══════════════════ BONE SPIKES (bone mage) ══════════════════
  /**
   * The bone mage's spell (units/tribal.bone_mage, card Characteristics: "a chain of spikey osseous will burst through the ground", one bone every 0.025 s):
   * a row of pale faceted spikes erupts out of the turf along the line from the caster to his mark, each one BONE_SPIKE_EVERY after the last, the nearest a
   * knee high and the farthest above a man's head (BONE_SPIKE_NEAR..FAR), each leaning a little on toward the mark. Each spike pops up over BONE_SPIKE_RISE with a
   * small overshoot, stands for the row's life and sinks back into the ground over BONE_SPIKE_SINK. Deterministic: every jitter is hashed from the spike's index.
   */
  spawnBoneSpikeRow(from: Vector3, to: Vector3): void {
    const dx = to.x - from.x, dz = to.z - from.z;
    const span = Math.hypot(dx, dz);
    if (span < 0.5) return;
    const ux = dx / span, uz = dz / span;
    // The row starts a stride ahead of the caster's feet and runs a little past the mark
    const start = Math.min(BONE_SPIKE_START, span * 0.3);
    const length = span - start + BONE_SPIKE_PAST;
    const count = Math.max(4, Math.min(BONE_SPIKE_MAX, Math.round(length / BONE_SPIKE_STEP)));
    const root = new TransformNode("boneSpikes", this._scene);
    const bone = getMaterialFactory().get("bone", new Color3(0.93, 0.9, 0.8), { emissiveIntensity: 0.12 });
    const hash = (i: number, salt: number): number => {
      const v = Math.sin(i * 12.9898 + salt * 78.233 + from.x * 0.37) * 43758.5453;
      return v - Math.floor(v);
    };
    const pivots: TransformNode[] = [];
    for (let i = 0; i < count; i++) {
      const u = count > 1 ? i / (count - 1) : 1;
      const along = start + u * length;
      const across = (hash(i, 1) - 0.5) * BONE_SPIKE_SIDE;
      const h = BONE_SPIKE_NEAR + (BONE_SPIKE_FAR - BONE_SPIKE_NEAR) * u * (0.8 + hash(i, 2) * 0.4);
      const pivot = new TransformNode(`boneSpike${i}`, this._scene);
      pivot.parent = root;
      pivot.position.set(from.x + ux * along - uz * across, from.y, from.z + uz * along + ux * across);
      // Leaning on toward the mark, with its own slant to either side
      pivot.rotation.set(0, Math.atan2(ux, uz), 0);
      pivot.rotation.x = BONE_SPIKE_LEAN + (hash(i, 3) - 0.5) * 0.2;
      pivot.rotation.z = (hash(i, 4) - 0.5) * 0.3;
      const spike = MeshBuilder.CreateCylinder("boneSpike", { height: h, diameterTop: 0, diameterBottom: 0.14 + 0.1 * u, tessellation: 5 }, this._scene);
      spike.position.y = h / 2;
      spike.rotation.y = hash(i, 5) * Math.PI;
      spike.material = bone;
      spike.convertToFlatShadedMesh();
      spike.parent = pivot;
      pivot.scaling.y = 0.001;
      pivots.push(pivot);
    }
    const life = BONE_SPIKE_EVERY * count + BONE_SPIKE_RISE + BONE_SPIKE_STAND + BONE_SPIKE_SINK;
    const pose = (elapsed: number): void => {
      const sinkFrom = life - BONE_SPIKE_SINK;
      for (let i = 0; i < pivots.length; i++) {
        const t = elapsed - i * BONE_SPIKE_EVERY;
        let k: number;
        if (t <= 0) k = 0.001;
        else if (t < BONE_SPIKE_RISE) {
          const r = t / BONE_SPIKE_RISE;
          k = r * (2 - r) * (1 + BONE_SPIKE_OVERSHOOT * Math.sin(r * Math.PI)); // out fast, a touch past full, settling
        } else if (elapsed < sinkFrom) k = 1;
        else k = Math.max(0.001, 1 - (elapsed - sinkFrom) / BONE_SPIKE_SINK);
        pivots[i].scaling.y = k;
      }
    };
    pose(0.016);
    this._effects.push({ root, remaining: life, update: (_dt, remaining) => pose(life - remaining) });
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
    // The fire, dust and smoke are sprites (see the spec at _spawnFireball); only the shot ball and the clods it kicks up are solid
    this._spawnFireball(position, scale);
    const root = new TransformNode("explosionBurst", this._scene);
    root.position = position.clone();
    root.position.y += 0.6 * scale;
    const mats = getMaterialFactory();
    const ballMat = mats.createUnique("stone", new Color3(0.1, 0.1, 0.11));
    const clodMat = mats.createUnique("stone", new Color3(0.24, 0.2, 0.16));
    const floorY = -root.position.y + 0.08;

    // The shot itself: a dark ball that hops out of the burst and comes to rest.
    const ball = MeshBuilder.CreateSphere("burstBall", { diameter: 1, segments: 4 }, this._scene);
    ball.material = ballMat;
    ball.parent = root;
    const ballSize = 0.34 * scale;
    ball.scaling.setAll(ballSize);
    const ballFloor = floorY + ballSize * 0.5;
    const ballAngle = Math.random() * Math.PI * 2;
    const ballVelocity = new Vector3(Math.cos(ballAngle) * 1.6 * scale, 3.4, Math.sin(ballAngle) * 1.6 * scale);

    // Nine dark faceted clods of mixed shape and size thrown clear on high arcs, landing round the crater and lying there.
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

    const totalDuration = 1.9;
    this._effects.push({
      root,
      remaining: totalDuration,
      update: (dt, remaining) => {
        const fade = Math.max(0.001, Math.min(1, remaining / 0.35));
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
          chunk.mesh.scaling.setAll(chunk.size * fade);
        }
      },
      dispose: () => {
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
