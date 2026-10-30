import {
  Scene, Vector3, MeshBuilder, Color3, Mesh, TransformNode, Node,
  PBRMetallicRoughnessMaterial, ParticleSystem, VertexBuffer, Ray,
  StandardMaterial, DynamicTexture, Quaternion,
} from "@babylonjs/core";
import type { RuntimeUnit } from "../units/runtimeUnit";
import type { VisualEffects } from "./visualEffects";
import type { ImpactPresentation } from "./impactPresentation";
import { getMaterialFactory } from "../units/materialFactory";
import { TEAM_COLORS } from "../data/factionColors";
import { createTrail } from "./particleFactory";
import { buildFlyingSword, buildFacetedBoulder } from "../units/propBuilder";
import { CATAPULT_BOULDER } from "../units/vehicleBuilder";
import { buildSnake } from "../units/ancientDress";
// The snake archer's flying snake, head to tail (m; ancient.snake_archer.png: about as long as a man is tall to his chest)
const FLYING_SNAKE_LONG = 1.1;

/*
 * [S] a flying crow (342; farmer.scarecrow.png: the scarecrow's crows fly at the enemy as big black birds, wings spread and beating). In metres: body
 * FLYING_CROW.long long, .wide across, .tall deep; head .head across on its front end; grey beak .beak long; each wing a flat blade .span out from the
 * shoulder, .chord wide at the root, with .fingers primary feathers .feather long splayed past its tip; tail .tail long fanned .fan wide. Black
 * CROW_FLY_BLACK self-lit .glow so it reads black, not team colour; wings beat .beat rad about a .lift raise at .rate rad/s.
 */
const FLYING_CROW = { long: 0.34, wide: 0.17, tall: 0.17, head: 0.13, beak: 0.08, span: 0.34, chord: 0.2, flat: 0.12, fingers: 4, feather: 0.1, tail: 0.16, fan: 0.16, glow: 0.12, beat: 0.28, lift: 0.04, rate: 15 };
const CROW_FLY_BLACK = new Color3(0.07, 0.07, 0.1);
/*
 * [S] the potion's splash (342; farmer.potion_seller.jpg, card: Potion Throw explosion radius 2.2, "upon impact, the Potion will splash and effect anyone in
 * the splash zone with drunkenness, making them green and confused; they may even splash themselves"). No blast and no fling: where it lands a burst of
 * DRUNK_SPLASH.puffs green puffs .size across runs out over the splash radius .radius and thins away over .life s, one big puff over the middle; every man in
 * the radius, of either side, takes the potion's small hurt with a push only .push of its own, and goes drunk for .seconds.
 */
const DRUNK_SPLASH = { radius: 2.2, puffs: 14, size: 0.9, life: 1.6, push: 0.15, seconds: 6 };
const DRUNK_GREEN = new Color3(0.35, 0.95, 0.25);

// The balloon arrow's ball (see _addBalloonBall): across (m), along the shaft from its middle (m), stretch along the shaft
const BALLOON_BALL = { size: 0.2, at: 0.27, long: 1.15 };
// The medieval archer's broadhead arrow (see _dressBroadhead): head across, along the shaft (m), flatness; shaft and head colours
const BROADHEAD = { wide: 0.17, long: 0.2, thick: 0.3, shaft: new Color3(0.62, 0.16, 0.1), iron: new Color3(0.08, 0.08, 0.09) };
// The Ice Archer's arrow (see _dressIceArrow): shaft along the flight, the ice crown at its end -- spikes off the shaft's end, .head the longest on the
// axis, .wide across at the foot; .spike of it for the ring round it, leaned .spikeOut; .barbs swept back .barb of .head; and, under the shaft behind the
// crown, a fringe of icicles: .icles tapered spikes hung perpendicular to the shaft, rooted .icleDrop below its line at .icleFrom back of the crown's foot
// and spread .icleSpan down it, each .icleLong long (uneven by .icleVary) and .icleWide at its root, raked .icleRake back along the flight, fanned
// .icleOut across it.
// [S] 401 the fringe is the frost: the 398-400 .frost tetra flakes read as beads strung along the shaft (critic 400), so the bead loop is gone and the
// icicles are denser - .icles 9 over a shorter span, nearly touching at their roots, so the arrow trails a solid jagged comb of ice.
const ICE_ARROW = {
  head: 0.34, wide: 0.2, spikes: 4, spike: 0.66, spikeOut: 0.42, barbs: 3, barb: 0.5,
  icles: 9, icleFrom: 0.16, icleSpan: 0.62, icleLong: 0.21, icleVary: 0.62, icleWide: 0.075, icleOut: 0.55, icleRake: 0.24, icleDrop: 0.02,
  shaft: new Color3(0.34, 0.6, 0.86), ice: new Color3(0.46, 0.74, 0.98),
};

/** [S] 413 the Firework Arrow in flight: tube long/wide (m), green bands, head and flame cones, the arc as a share of the distance (was .25: it flew over the frame). */
/** [S] 418 the Firework Arrow's blast round the man it strikes (_fireworkBurst). */
const FIREWORK_BLAST = { radius: 2.5, share: 1 };
const FIREWORK_ROCKET = { long: 0.5, wide: 0.13, bands: 3, head: 0.14, flame: 0.32, arc: 0.1, band: new Color3(0.3, 0.62, 0.22), dark: new Color3(0.16, 0.14, 0.14), fire: new Color3(1, 0.62, 0.15) };
/** [S] 412 the thrown shuriken (projectile "shuriken"): span, waist, thickness, hub across (m), tilt of its face off level toward the side camera. */
const SHURIKEN_FLIGHT = { span: 0.36, waist: 0.1, thick: 0.02, hub: 0.07, tilt: 0.7, steel: new Color3(0.2, 0.21, 0.24), hub_color: new Color3(0.5, 0.5, 0.54) };
/** [S] 416 the hwacha's rocket arrow ("rocket_arrow" shape): .long shaft .shaft across, a .tube x .wide paper tube with .bands green bands behind a dark
 * .head-long point, a .flame-long unlit flame (orange .fire round a pale .core) out of the tube's back, a smoke puff behind that. */
const HWACHA_ROCKET = {
  long: 0.7, shaft: 0.025, tube: 0.24, wide: 0.07, bands: 3, head: 0.09, flame: 0.42,
  wood: new Color3(0.55, 0.38, 0.2), paper: new Color3(0.8, 0.62, 0.4), green: new Color3(0.2, 0.55, 0.25), dark: new Color3(0.12, 0.12, 0.14),
  fire: new Color3(1, 0.55, 0.12), core: new Color3(1, 0.92, 0.6),
};
/** The Skeleton Archer's burning arrow head (_dressFireArrow): flame tongues, longest (m), across (m), splay off the shaft, colours, glow */
const FIRE_ARROW = { tongues: 4, long: 0.38, wide: 0.11, splay: 0.28, flame: new Color3(1, 0.42, 0.06), core: new Color3(1, 0.85, 0.3), dark: new Color3(0.1, 0.08, 0.07), glow: 0.9 };
/** The Pumpkin Catapult's jack-o'-lantern ("pumpkin" case): diameter (m), height of the width, ribbed lobes, skin, stem, carved-face glow */
const PUMPKIN_SHOT = { size: 0.55, squash: 0.8, lobes: 8, orange: new Color3(0.9, 0.38, 0.08), stem: new Color3(0.25, 0.3, 0.1), face: new Color3(1, 0.8, 0.2) };
export type ProjectileShape = "arrow" | "bolt" | "spear" | "harpoon" | "bomb" | "stone" | "firework" | "shuriken" | "rocket_arrow" | "crow" | "fireball" | "leaves" | "sword" | "shell" | "cannonball" | "davinci_ball" | "pumpkin" | "spirit_fire";

interface ActiveProjectile {
  mesh: TransformNode;
  /** A balloon arrow: its shooter's unit id (ProjectileSpawnOptions.balloons). */
  balloons?: string;
  origin: Vector3;
  target: RuntimeUnit;
  targetPos: Vector3;       // snapshot in case target dies mid-flight
  speed: number;
  damage: number;
  knockback: Vector3;
  splashRadius: number;
  attackerTeam: number;
  elapsed: number;
  flightTime: number;
  arcHeight: number;        // parabolic arc peak (0 = flat)
  allUnits: readonly RuntimeUnit[];
  shape: ProjectileShape;
  targetLift: number;
  trailSystem?: ParticleSystem;
  trailStarted?: boolean;
  /** Cannonball only: seconds since the last smoke puff was left behind it. */
  puffClock?: number;
  /** A thrown held prop: from its middle to the root of its head, for where it stands when it sticks. */
  half?: number;
  /** A harpoon's rope, from the gun's muzzle (tether) to the missile's tail, laid afresh every frame. */
  rope?: Mesh;
  tether?: TransformNode;
  /** Shown through its delay where it was spawned, point turned on the man, instead of hidden (a swordcaster's sword hangs over him before it flies). */
  hover?: boolean;
  /** A hovering sword: its whole hover, seconds. It is lifted out of the ring point up and turned onto the man over the first SWORD_TURN_IN of it. */
  hoverFor?: number;
  /** A hovering sword's rise: from the height it was lifted out of the ring at to this world height, over SWORD_RISE_IN of its hover. */
  riseFrom?: number;
  riseTo?: number;
  drunk?: string;
  /** A snake archer's snake: where it lands it is handed to the simulation as a live snake (snakeLand), not left standing as a shaft. */
  snake?: boolean;
  /** Dodged (Painter Dodge): it no longer follows its man and comes down where he stood; it strikes him only if he is still there. */
  loose?: boolean;
}

// A sword lifted out of the swordcaster's ring stands point up; it is turned onto the man over this long of its hover
const SWORD_TURN_IN = 0.3;
// ...and rises from its place in the ring to over his head (units/spooky.swordcaster: the airborne blade rides at head height above the ring) over this long,
// so it flies from up there and not from his shins
const SWORD_RISE_IN = 0.45;

/*
 * A thrown spear flies as a real missile (units/tribal.spear_thrower: a flat shoulder-height throw to range 17, the card's projectile speed 20): it leaves the
 * hand at LAUNCH speed and its arc is the gravity parabola solved for the low launch angle that carries it to the man under LAUNCH gravity, so a near target
 * gets a flat throw and only a far one a lob. Flight stays the straight lerp plus 4·A·t·(1−t) of the update, which is exact ballistic motion for A = g·T²/8.
 * Shapes not listed keep the fixed arc-per-metre lob of spawnProjectile. A man beyond the throw's reach (no solution) keeps that lob too.
 * `throw` (the card's force 220, against a club's 20): a man it strikes and leaves standing is thrown back off his feet along its line, as under a heavy blow
 * (RuntimeUnit.staggerFromBlow), the shaft stuck in him and going with him (_leaveAsLitter).
 * The stoner's boulder (units/tribal.stoner, tribal.stoner.jpg: a forward toss to range 12, the card's projectile speed 18) is launched the same way, but only
 * when it is the rock out of his hands (`held`: the throw's heldProp): a catapult's stone is the same shape and keeps its high lob.
 */
// [S] 427 ...and the pirate Cannon's ball (audit 422 c.1: "a steep lob, the ball already above the treeline with the smoke trail climbing at near 45
// degrees - TABS: a fast flat shot from a level muzzle"; card Weapons projectile speed 45, range 25; pirate.cannon.jpg): fired off the level barrel at the
// card's 45 m/s it is a near-flat line that sags only by gravity over its short flight (at 9 m, under 4 cm of rise), its smoke trail level behind it, in
// place of the old fixed lob at 10 m/s and .4 of the range high.
const LAUNCH: Partial<Record<ProjectileShape, { speed: number; gravity: number; throw?: number; held?: boolean }>> = {
  spear: { speed: 20, gravity: 9.8, throw: 220 },
  stone: { speed: 18, gravity: 9.8, held: true },
  cannonball: { speed: 45, gravity: 9.8 },
};

/** The low-angle ballistic solution from `from` to `to` at launch speed v under gravity g: flight time and the arc's peak above the straight line, or null when out of reach. */
function solveLowArc(from: Vector3, to: Vector3, v: number, g: number): { flightTime: number; arcHeight: number } | null {
  const d = Math.hypot(to.x - from.x, to.z - from.z);
  const h = to.y - from.y;
  if (d < 0.01) return null;
  const disc = v ** 4 - g * (g * d * d + 2 * h * v * v);
  if (disc < 0) return null;
  const theta = Math.atan((v * v - Math.sqrt(disc)) / (g * d));
  const flightTime = d / (v * Math.cos(theta));
  return { flightTime, arcHeight: g * flightTime * flightTime / 8 };
}

/** A soft smoke puff left hanging in a cannonball's wake. */
// A gun's muzzle smoke (see spawnMuzzleFlash): how many soft puffs make the cloud.
const MUZZLE_PUFFS = 7;
// [S] 426 a pistol's shot (spawnPistolShot): flash across (m) and life (s), puff size (m) and life (s), the ball's streak long and thick (m), speed (m/s)
const PISTOL_SHOT = { flash: 0.16, flashLife: 0.12, puff: 0.32, puffLife: 1.4, streak: 0.3, thick: 0.035, speed: 65 };

interface TrailPuff {
  mesh: Mesh;
  /** Sideways roll off the muzzle, metres a second, slowing as the puff thins; none on a wake puff */
  drift?: Vector3;
  age: number;
  life: number;
  size: number;
  rise: number;
}

// Cannonball wake (ref trailer_3_sheet_03 r1c2): not a line but a string of soft round smoke puffs, one every TRAIL_PUFF_EVERY seconds of flight, each a camera-facing
// sprite with a feathered edge. It is born ball-sized (TRAIL_PUFF_BORN) and swells to TRAIL_PUFF_GROWN times that, rising slowly while it thins away over
// TRAIL_PUFF_LIFE, so the wake is thick and white at the gun end of the arc only a moment after the ball, and tapers to nothing behind it.
const TRAIL_PUFF_EVERY = 0.03;
const TRAIL_PUFF_BORN = 0.55;
const TRAIL_PUFF_GROWN = 2.6;
const TRAIL_PUFF_LIFE = 1.6;
const TRAIL_PUFF_CAP = 240;

interface MuzzleFlash {
  mesh: Mesh;
  remaining: number;
  /** Smoke blobs only: total life, used to swell, rise and hold opaque before fading. */
  smokeLife?: number;
  /** Smoke blobs only: metres a second it drifts off down the line of fire and out from the middle of its clump. */
  drift?: Vector3;
  ownsMaterial?: boolean;
}

interface ProjectileSpawnOptions {
  originLift?: number;
  targetLift?: number;
  /** The prop that was in the thrower's hand: what flies is a copy of it, at its size, not a missile from the catalogue below. */
  heldProp?: TransformNode;
  /** A harpoon gun's muzzle: a dark rope runs from it to the missile for as long as it flies (units/pirate.harpooner). */
  tether?: TransformNode;
  /** Shown through the delay, hanging where it was spawned with its point on the man, instead of hidden until it flies. */
  hover?: boolean;
  /** World size factor of the missile (a ring sword flies at the size it stood in the ring). */
  size?: number;
  /** A hovering sword rises to this world height while it hangs, and flies from there. */
  riseTo?: number;
  /** The arc's height per metre of flight in place of the shape's own (a leaf whirl kept low along the ground). */
  arc?: number;
  /** A balloon arrow, carrying its shooter's unit id: the man it strikes floats up under balloons of the shooter's colour (RuntimeUnit.floatOnBalloons). */
  balloons?: string;
  /** An arrow with a red shaft and a large black broadhead (the medieval archer's, _dressBroadhead). */
  broadhead?: boolean;
  /** An arrow flown as the snake archer's banded snake (ancientDress buildSnake), head first. */
  snake?: boolean;
  /** An arrow flown as the Ice Archer's: a pale ice shaft, a jagged ice head and a trail of frost behind it (_dressIceArrow). */
  iceArrow?: boolean;
  /** A burning arrow: flames round its head and a fire trail (FIRE_ARROW). */
  fireArrow?: boolean;
  /** A potion, carrying its thrower's unit id: it does not blow up but splashes green, and every man in the splash goes drunk (DRUNK_SPLASH, RuntimeUnit.getDrunk). */
  drunk?: string;
  /** [S] 427 A ground point the missile comes down on instead of the man (the Pirate Queen's Bomb Spin bombs, lobbed out all round her): it does not follow him. */
  at?: Vector3;
  /** Seconds of flight in place of the shape's own speed (a slow lob). */
  flight?: number;
}

interface MuzzleFlashOptions {
  originLift?: number;
}

function brighten(color: Color3, amount: number): Color3 {
  return Color3.Lerp(color, new Color3(0.95, 0.95, 0.98), amount);
}

function darken(color: Color3, amount: number): Color3 {
  return Color3.Lerp(color, new Color3(0.12, 0.12, 0.14), amount);
}

// Arrow, bolt and spear shafts are dark wood for both teams; only the head and the fletching carry the team colour.
const WOOD_SHAFT_COLOR = new Color3(0.3, 0.2, 0.11);
// The da Vinci tank's cannonball, across (m): half the pirate cannon's ball, sixteen barrels' worth
const DAVINCI_BALL = 0.24;
// A caster's fireball (units/legacy.wizard): about a head and a half across, a white-yellow heart in an orange shell, a flame tail half a man long
const FIREBALL_WIDE = 0.55;
const FIREBALL_TAIL = 0.8;
const FIREBALL_HEART = new Color3(1, 0.92, 0.55);
const FIREBALL_SHELL = new Color3(1, 0.45, 0.08);
/** The Candlehead's spirit fire ("spirit_fire"): pale-cyan heart, cyan shell, size of the fireball */
const SPIRIT_FIRE = { heart: new Color3(0.85, 1, 1), shell: new Color3(0.1, 0.85, 1), size: 1.15 };
// A bone mage's leaf whirl (units/tribal.bone_mage): a loose spinning knot of long pointed autumn leaves, each about a forearm long, red, rust and crimson
const LEAF_COUNT = 11;
// ...and the loft of his spike row (card Characteristics: "sending fragile units who were caught in the attack into the air", force 800; tribal.bone_mage.png):
// every man the row's hit catches is thrown up off his feet, `up` m/s, and `along` m/s on down the row's line, as a blast flings a body (RuntimeUnit.applyBlastLaunch,
// past the living-hit lift cap that keeps a plain missile's knock shallow)
const SPIKE_LOFT = { up: 10, along: 2.5 };
const LEAF_LONG = 0.5;
const LEAF_WIDE = 0.19;
const LEAF_WHIRL = 0.55; // radius of the knot round its line of flight
const LEAF_SPREAD = 1.2; // its length along the line of flight, trailing back
const LEAF_SPIN = 9; // rad/s of the whole knot about its line of flight
const LEAF_COLORS = [new Color3(0.74, 0.22, 0.13), new Color3(0.86, 0.43, 0.16), new Color3(0.52, 0.09, 0.14)];
// A harpoon's rope (units/pirate.harpooner): dark, thin as a finger, muzzle to harpoon
const HARPOON_ROPE_WIDE = 0.035;
const HARPOON_ROPE_COLOR = new Color3(0.13, 0.11, 0.1);
// A reeled man's end of the rope, m up off his root (where the harpoon stands in his chest)
const TOW_CHEST = 0.9;
// The harpoon itself: a short thick dark shaft (HARPOON_SHAFT_LONG, about twice a forearm) under a heavy dark iron head (HARPOON_HEAD_LONG x _WIDE, three
// shaft widths across), with HARPOON_BARBS barbs swept back off its root, a ring at the tail where the rope is tied; no team tint
const HARPOON_SHAFT_LONG = 0.5;
const HARPOON_SHAFT_WIDE = 0.05;
const HARPOON_HEAD_LONG = 0.24;
const HARPOON_HEAD_WIDE = 0.15;
const HARPOON_BARBS = 2;
const HARPOON_BARB_LONG = 0.17;
const HARPOON_BARB_SWEEP = 0.5; // rad back off the shaft
const HARPOON_SHAFT_COLOR = new Color3(0.2, 0.16, 0.13);
const HARPOON_IRON_COLOR = new Color3(0.16, 0.17, 0.19);

export class ProjectileSystem {
  private _scene: Scene;
  private _active: ActiveProjectile[] = [];
  private _flashes: MuzzleFlash[] = [];
  private _puffs: TrailPuff[] = [];
  private _puffMat: StandardMaterial | null = null;
  private _greenPuffMat: StandardMaterial | null = null;
  private _puffCount = 0;
  /** Spent arrows, bolts and spears left standing in the bodies they hit or in the ground, oldest first. */
  private _litter: { mesh: TransformNode; owner: RuntimeUnit | null }[] = [];
  private _matCache = new Map<string, PBRMetallicRoughnessMaterial>();
  onShake?: (intensity: number) => void;
  visualEffects?: VisualEffects;
  impactPresentation?: ImpactPresentation;

  constructor(scene: Scene) {
    this._scene = scene;
  }

  get activeCount(): number { return this._active.length; }

  /**
   * Painter Dodge (simulationSystem PAINTER_DODGE): the first missile in flight at `unit` (past its delay, not yet dodged) that will reach him within
   * `within` s, with its line of flight on the ground; null when none.
   */
  incomingAt(unit: RuntimeUnit, within: number): { dir: Vector3 } | null {
    for (const p of this._active) {
      if (p.target !== unit || p.loose || p.elapsed < 0 || p.drunk) continue;
      if (p.flightTime - p.elapsed > within) continue;
      const dir = new Vector3(p.targetPos.x - p.origin.x, 0, p.targetPos.z - p.origin.z);
      if (dir.lengthSquared() < 1e-6) continue;
      return { dir: dir.normalize() };
    }
    return null;
  }

  /**
   * [S] 417 Projectile Block (simulationSystem SAMURAI_BLOCK): the first missile in flight at `unit` (past its delay) that will reach him within
   * `within` s and is within `reach` m of him on the ground ([S] 418: at his blade's reach, not at the bow) is cut out of the air: gone without
   * striking. Returns where it was and its line of flight, or null when none.
   */
  deflectAt(unit: RuntimeUnit, within: number, reach = Infinity): { at: Vector3; dir: Vector3 } | null {
    for (let i = 0; i < this._active.length; i++) {
      const p = this._active[i];
      if (p.target !== unit || p.loose || p.elapsed < 0 || p.drunk || p.snake) continue;
      if (p.flightTime - p.elapsed > within) continue;
      const at = p.mesh.position.clone(); // the root is unparented: its live position, not the world matrix of the last render
      if (Math.hypot(at.x - unit.position.x, at.z - unit.position.z) > reach) continue;
      const dir = new Vector3(p.targetPos.x - p.origin.x, 0, p.targetPos.z - p.origin.z);
      if (dir.lengthSquared() < 1e-6) dir.set(0, 0, 1);
      if (p.trailSystem) { p.trailSystem.stop(); p.trailSystem.dispose(false); }
      p.rope?.dispose();
      p.mesh.dispose();
      this._active.splice(i, 1);
      return { at, dir: dir.normalize() };
    }
    return null;
  }

  /** Every missile flying at `unit` stops following him: each comes down where he stood (Painter Dodge). */
  loseTarget(unit: RuntimeUnit): void {
    for (const p of this._active) if (p.target === unit) p.loose = true;
  }

  private _getTeamProjectilePalette(team: number): { primary: Color3; bright: Color3; dark: Color3 } {
    const primary = (TEAM_COLORS[team] ?? new Color3(0.7, 0.7, 0.7)).clone();
    return {
      primary,
      bright: brighten(primary, 0.24),
      dark: darken(primary, 0.32),
    };
  }

  /**
   * Spawn a visible projectile that flies from origin to target.
   */
  spawnProjectile(
    shape: ProjectileShape,
    origin: Vector3,
    target: RuntimeUnit,
    damage: number,
    knockback: Vector3,
    splashRadius: number,
    attackerTeam: number,
    allUnits: readonly RuntimeUnit[],
    originOffset?: Vector3,
    delay = 0,
    options: ProjectileSpawnOptions = {},
  ): void {
    const targetPos = (options.at ?? target.position).clone();
    const launchOrigin = originOffset ? origin.add(originOffset) : origin;
    const dist = Vector3.Distance(launchOrigin, targetPos);

    // Speed and arc vary by projectile type
    let speed: number;
    let arcHeight: number;
    switch (shape) {
      case "arrow":   speed = 35; arcHeight = dist * 0.08; break;
      case "bolt":    speed = 30; arcHeight = dist * 0.06; break;
      case "spear":   speed = 18; arcHeight = dist * 0.15; break;
      case "bomb":    speed = 12; arcHeight = dist * 0.35; break;
      case "pumpkin": speed = 12; arcHeight = dist * 0.35; break;
      case "shell":   speed = 46; arcHeight = dist * 0.015; break;
      case "stone":   speed = 10; arcHeight = dist * 0.4;  break;
      case "cannonball": speed = 45; arcHeight = dist * 0.02; break; // fallback past the reach of LAUNCH.cannonball
      case "davinci_ball": speed = 30; arcHeight = dist * 0.06; break;
      case "firework": speed = 22; arcHeight = dist * FIREWORK_ROCKET.arc; break;
      case "shuriken": speed = 28; arcHeight = dist * 0.05; break;
      case "rocket_arrow": speed = 30; arcHeight = dist * 0.03; break;
      case "crow": speed = 18; arcHeight = dist * 0.15; break;
      case "fireball": speed = 20; arcHeight = dist * 0.1; break;
      case "spirit_fire": speed = 20; arcHeight = dist * 0.1; break;
      case "leaves": speed = 12; arcHeight = dist * 0.12; break;
      case "sword": speed = 16; arcHeight = dist * 0.04; break;
      case "harpoon": speed = 18; arcHeight = dist * 0.1; break;
    }
    if (options.arc !== undefined) arcHeight = dist * options.arc;

    let flightTime = Math.max(0.1, options.flight ?? dist / speed);
    if (options.flight) speed = dist / flightTime;
    // A launched missile (LAUNCH): its arc is the gravity parabola of a throw at its own speed, solved for the low angle that reaches the man
    const launch = LAUNCH[shape];
    if (launch && (!launch.held || options.heldProp)) {
      const from = launchOrigin.clone();
      from.y += options.originLift ?? 1.0;
      const to = targetPos.clone();
      to.y += options.targetLift ?? 0.5;
      const solved = solveLowArc(from, to, launch.speed, launch.gravity);
      if (solved) {
        flightTime = solved.flightTime;
        arcHeight = solved.arcHeight;
        speed = dist / flightTime;
      }
    }
    const palette = this._getTeamProjectilePalette(attackerTeam);
    const held = options.heldProp ? this._buildHeldMissile(options.heldProp, shape) : null;
    const mesh = held?.root ?? this._buildProjectileMesh(shape, palette, attackerTeam);
    mesh.position = launchOrigin.clone();
    mesh.position.y += options.originLift ?? 1.0;
    if (options.size) mesh.scaling.setAll(options.size);
    if (options.balloons && shape === "arrow" && !held) this._addBalloonBall(mesh, palette.primary, attackerTeam);
    if (options.broadhead && shape === "arrow" && !held) this._dressBroadhead(mesh);
    if (options.snake && shape === "arrow" && !held) this._dressSnake(mesh);
    if (options.iceArrow && shape === "arrow" && !held) this._dressIceArrow(mesh);
    if (options.fireArrow && shape === "arrow" && !held) this._dressFireArrow(mesh);
    if (held) {
      // Laid on its line of flight from the frame it leaves the hand, not drawn pointing north until the first flight step turns it
      const dir = targetPos.add(new Vector3(0, options.targetLift ?? 0.5, 0)).subtract(mesh.position);
      mesh.rotation.y = Math.atan2(dir.x, dir.z);
      mesh.rotation.x = -Math.atan2(dir.y + 4 * arcHeight, Math.hypot(dir.x, dir.z)); // the arc's own climb off the hand
    }

    // Add particle trail for specific projectile types
    let trailSystem: ParticleSystem | undefined;
    let trailStarted = false;
    const trailMesh = mesh.getChildMeshes()[0] as Mesh | undefined;
    if (trailMesh) {
      switch (shape) {
        case "fireball":
          trailSystem = createTrail(this._scene, trailMesh, FIREBALL_SHELL, 10);
          break;
        case "spirit_fire":
          trailSystem = createTrail(this._scene, trailMesh, SPIRIT_FIRE.shell, 10);
          break;
        case "rocket_arrow":
          trailSystem = createTrail(this._scene, trailMesh, palette.primary, 15);
          trailSystem.minSize = 0.03;
          trailSystem.maxSize = 0.08;
          break;
        case "firework":
          trailSystem = createTrail(this._scene, trailMesh, palette.primary, 10);
          break;
        case "bomb":
          trailSystem = createTrail(this._scene, trailMesh, palette.primary, 5);
          trailSystem.minSize = 0.01;
          trailSystem.maxSize = 0.03;
          break;
      }
    }
    if (trailSystem && delay <= 0) {
      trailSystem.start();
      trailStarted = true;
    }

    this._active.push({
      mesh, origin: mesh.position.clone(), target, targetPos,
      speed, damage, knockback, splashRadius, attackerTeam,
      elapsed: -delay, flightTime, arcHeight, allUnits, shape,
      targetLift: options.targetLift ?? 0.5,
      balloons: options.balloons, drunk: options.drunk, snake: options.snake && shape === "arrow" && !held,
      trailSystem, trailStarted,
      half: held?.half,
      rope: options.tether ? this._buildRope() : undefined,
      tether: options.tether,
      hover: options.hover,
      hoverFor: options.hover ? delay : undefined,
      riseFrom: options.hover && options.riseTo !== undefined ? mesh.position.y : undefined,
      riseTo: options.hover ? options.riseTo : undefined,
      loose: options.at ? true : undefined,
    });
    const spawned = this._active[this._active.length - 1];
    if (spawned.rope) this._layRope(spawned);
  }

  /** A harpoon's rope: a thin dark line whose length runs along its local z, so it can be laid muzzle to missile by position, lookAt and z scale. */
  private _buildRope(): Mesh {
    const rope = MeshBuilder.CreateCylinder("harpoonRope", { height: 1, diameter: HARPOON_ROPE_WIDE, tessellation: 4 }, this._scene);
    rope.rotation.x = Math.PI / 2;
    rope.bakeCurrentTransformIntoVertices();
    rope.material = this._getMat("harpoon_rope", HARPOON_ROPE_COLOR);
    this._scene.getGlowLayerByName("glow")?.addExcludedMesh(rope);
    return rope;
  }

  private _layRope(p: ActiveProjectile): void {
    if (!p.rope) return;
    // Tied to the muzzle where the gun is now: the sim steps without drawing, so the muzzle's cached world place is brought up to this step first, else the
    // rope's tail hangs back where the muzzle was at the release
    let from = p.origin;
    if (p.tether && !p.tether.isDisposed()) {
      const chain: TransformNode[] = [];
      for (let n: Node | null = p.tether; n; n = n.parent) if (n instanceof TransformNode) chain.unshift(n);
      for (const n of chain) n.computeWorldMatrix(true);
      from = p.tether.getAbsolutePosition();
    }
    const to = p.mesh.position;
    const len = Vector3.Distance(from, to);
    if (len < 0.01) { p.rope.setEnabled(false); return; }
    p.rope.setEnabled(true);
    p.rope.position.copyFrom(from).addInPlace(to).scaleInPlace(0.5);
    p.rope.lookAt(to);
    p.rope.scaling.set(1, 1, len);
  }

  /**
   * Spawn a muzzle flash at the given position (for guns).
   */
  /** Set by the simulation: records a mechanic a missile set off (a balloon arrow's float) in its ability log, under the shooter's unit id. */
  abilityHook: ((unitId: string, kind: string, at: Vector3) => void) | null = null;
  /** Set by the simulation: a snake archer's snake has come down at `at` (on its man or the ground), flown from `from`; it goes on as a live snake there. */
  snakeLand: ((at: Vector3, from: Vector3, team: number) => void) | null = null;
  /** Set by the simulation: a harpoon on its rope has struck `target`; the shooter (the gun whose muzzle is `tether`) reels him in. Returns how long the
   *  rope stays taut from the muzzle to him, seconds (0: no reel). */
  reelIn: ((target: RuntimeUnit, tether: TransformNode) => number) | null = null;
  /** [S] 425 Ropes of harpoons that struck: muzzle to the man being reeled in, laid afresh every step until `left` runs out (units/pirate.harpooner). */
  private _tows: { rope: Mesh; tether: TransformNode; target: RuntimeUnit; left: number }[] = [];

  /** [S] 426 Pistol balls in flight (spawnPistolShot): the streak, where it set off, where it is going, seconds flown and to fly. */
  private _bullets: { mesh: Mesh; from: Vector3; to: Vector3; t: number; flight: number }[] = [];

  /**
   * [S] 426 A pistol's shot (card pirate.flintlock Weapons: projectile Flintlock Bullet, speed 65; re-audit 422 c.1: "a white sphere the size of his
   * torso floating ahead of the chest"): at the mouth of each pistol's bell (`muzzles`, world), a small yellow flash PISTOL_SHOT.flash m across for
   * .flashLife s, a small puff .puff m that hangs .puffLife s, and a pale streak .streak m long flying from the bell to the man's chest (`to`) at
   * .speed m/s. The shot's harm is dealt by the sim at the trigger; the streak is what the eye follows. [S] 428 `blast` scales the flash and puff
   * (the Captain's dragon pistol, DRAGON_BLAST.flash), the flash then living twice as long.
   */
  spawnPistolShot(muzzles: Vector3[], to: Vector3, blast = 1): void {
    const S = PISTOL_SHOT;
    for (const at of muzzles) {
      const dir = to.subtract(at);
      const dist = dir.length();
      if (dist < 0.01) continue;
      dir.scaleInPlace(1 / dist);
      const flash = MeshBuilder.CreateSphere("pistolFlash", { diameter: S.flash * blast, segments: 6 }, this._scene);
      flash.position = at.add(dir.scale(S.flash * blast * 0.4));
      flash.material = this._getMat("flash", new Color3(1, 0.85, 0.3), 0.8);
      this._flashes.push({ mesh: flash, remaining: S.flashLife * (blast > 1 ? 2 : 1) });
      this._leavePuff(at.add(dir.scale(S.puff * blast * 0.6)), { size: S.puff * blast, life: S.puffLife, rise: 0.1, drift: dir.scale(0.25) });
      const streak = MeshBuilder.CreateBox("pistolBullet", { width: S.thick, height: S.thick, depth: S.streak }, this._scene);
      streak.material = this._getMat("pistolBullet", new Color3(1, 0.95, 0.75), 1);
      streak.position = at.clone();
      streak.lookAt(to);
      this._bullets.push({ mesh: streak, from: at.clone(), to: to.clone(), t: 0, flight: dist / S.speed });
    }
  }

  spawnMuzzleFlash(origin: Vector3, direction: Vector3, scale = 1, options: MuzzleFlashOptions = {}): void {
    const flash = MeshBuilder.CreateSphere("flash", { diameter: 0.4 * scale, segments: 6 }, this._scene);
    flash.position = origin.clone();
    flash.position.y += options.originLift ?? 1.0;
    flash.position.addInPlace(direction.scale(0.3 * scale));

    const m = this._getMat("flash", new Color3(1, 0.85, 0.3), 0.8);
    flash.material = m;

    this._flashes.push({ mesh: flash, remaining: 0.12 + 0.04 * Math.max(0, scale - 1) });

    // Smoke puff (trailer_3_sheet_03 r1c1): a fat soft white cloud thrown out of the muzzle that hangs and drifts, made of MUZZLE_PUFFS feathered camera-facing
    // discs (the wake's soft puff) round one point just out from the flash, the first the biggest. Each swells, rolls off down the line of fire at its own pace
    // and a little out from the middle, rises, and thins away over about three seconds, so a gun line stands in its own drifting smoke. It replaces a clump of
    // faceted white balls that never lost their hard edges.
    const smokeLife = 3.0 + 0.5 * Math.max(0, scale - 1);
    const centre = flash.position.add(direction.scale(0.25 * scale));
    for (let i = 0; i < MUZZLE_PUFFS; i++) {
      const azimuth = Math.random() * Math.PI * 2;
      const off = i === 0 ? 0 : 0.18 * scale * (0.5 + Math.random() * 0.5);
      const at = centre.add(new Vector3(Math.cos(azimuth) * off, (Math.random() - 0.3) * off, Math.sin(azimuth) * off));
      const drift = direction.scale(0.15 + 0.35 * (i / (MUZZLE_PUFFS - 1))).addInPlace(at.subtract(centre).scale(0.4));
      drift.y = 0;
      this._leavePuff(at, {
        size: (i === 0 ? 0.85 : 0.45 + Math.random() * 0.3) * scale,
        life: smokeLife * (0.8 + Math.random() * 0.4),
        rise: 0.12 + Math.random() * 0.18,
        drift,
      });
    }
  }

  update(dt: number): void {
    // A reeled man's rope: from the muzzle where the gun is now to his chest where he is now (TOW_CHEST up off his feet)
    for (let i = this._tows.length - 1; i >= 0; i--) {
      const w = this._tows[i];
      w.left -= dt;
      if (w.left <= 0 || w.tether.isDisposed() || (w.target.isDead && !w.target.body.root.isEnabled())) {
        w.rope.dispose();
        this._tows.splice(i, 1);
        continue;
      }
      const chain: TransformNode[] = [];
      for (let n: Node | null = w.tether; n; n = n.parent) if (n instanceof TransformNode) chain.unshift(n);
      for (const n of chain) n.computeWorldMatrix(true);
      const from = w.tether.getAbsolutePosition().clone();
      // his chest mesh where his body is drawn (it tumbles off his root as he flies), not a point over his root
      const chest = w.target.body.torsoMesh;
      const at: Node[] = [];
      for (let n: Node | null = chest; n; n = n.parent) at.unshift(n);
      for (const n of at) if (n instanceof TransformNode) n.computeWorldMatrix(true);
      const to = chest && !chest.isDisposed() ? chest.getAbsolutePosition().clone() : w.target.position.add(new Vector3(0, TOW_CHEST, 0));
      const len = Vector3.Distance(from, to);
      w.rope.setEnabled(len > 0.01);
      if (len <= 0.01) continue;
      w.rope.position.copyFrom(from).addInPlace(to).scaleInPlace(0.5);
      w.rope.lookAt(to);
      w.rope.scaling.set(1, 1, len);
    }
    // Update projectiles
    for (let i = this._active.length - 1; i >= 0; i--) {
      const p = this._active[i];
      p.elapsed += dt;

      // Delayed projectile: hide until delay expires
      if (p.elapsed < 0 && p.hover) {
        // Hanging over the caster: lifted from its place in the ring to over his head, point turned on the man; it flies from where it has risen to
        if (!p.target.isDead) p.targetPos.copyFrom(p.target.position);
        if (p.riseFrom !== undefined && p.riseTo !== undefined) {
          const r = Math.min(1, Math.max(0, (p.elapsed + (p.hoverFor ?? 0)) / SWORD_RISE_IN));
          p.origin.y = p.riseFrom + (p.riseTo - p.riseFrom) * r * r * (3 - 2 * r);
        }
        const aim = p.targetPos.add(new Vector3(0, p.targetLift, 0)).subtract(p.origin);
        p.mesh.rotation.y = Math.atan2(aim.x, aim.z);
        // From point up, as it stood in the ring, round onto the man
        const u = Math.min(1, Math.max(0, (p.elapsed + (p.hoverFor ?? 0)) / SWORD_TURN_IN));
        const turned = u * u * (3 - 2 * u);
        p.mesh.rotation.x = -Math.PI / 2 + (Math.PI / 2 - Math.atan2(aim.y, Math.hypot(aim.x, aim.z))) * turned;
        p.mesh.position.copyFrom(p.origin);
        p.mesh.position.y += 0.06 * Math.sin(p.elapsed * 9);
        continue;
      }
      if (p.elapsed < 0) {
        if (p.mesh instanceof Mesh) p.mesh.isVisible = false;
        for (const child of p.mesh.getChildMeshes()) child.isVisible = false;
        continue;
      }
      if (p.trailSystem && !p.trailStarted) {
        p.trailSystem.start();
        p.trailStarted = true;
      }
      // Show on first frame after delay
      if (p.mesh instanceof Mesh) p.mesh.isVisible = true;
      for (const child of p.mesh.getChildMeshes()) child.isVisible = true;

      const t = Math.min(p.elapsed / p.flightTime, 1);

      // Update target position if target is alive (track moving targets), unless he dodged it
      if (!p.target.isDead && !p.loose) {
        p.targetPos.copyFrom(p.target.position);
      }

      // Lerp position with parabolic arc
      const dest = p.targetPos.clone();
      dest.y += p.targetLift;
      Vector3.LerpToRef(p.origin, dest, t, p.mesh.position);
      // Add arc
      const arc = 4 * p.arcHeight * t * (1 - t);
      p.mesh.position.y += arc;

      // Face direction of travel
      if (t < 0.99) {
        const nextT = Math.min(t + 0.05, 1);
        const nextPos = Vector3.Lerp(p.origin, dest, nextT);
        nextPos.y += 4 * p.arcHeight * nextT * (1 - nextT);
        const dir = nextPos.subtract(p.mesh.position);
        if (dir.lengthSquared() > 0.001) {
          const yaw = Math.atan2(dir.x, dir.z);
          const pitch = -Math.atan2(dir.y, Math.sqrt(dir.x * dir.x + dir.z * dir.z));
          p.mesh.rotation.y = yaw;
          p.mesh.rotation.x = pitch;
        }
      }

      if (p.rope) this._layRope(p);

      if (p.shape === "cannonball") {
        p.puffClock = (p.puffClock ?? TRAIL_PUFF_EVERY) + dt;
        while (p.puffClock >= TRAIL_PUFF_EVERY) {
          p.puffClock -= TRAIL_PUFF_EVERY;
          this._leavePuff(p.mesh.position);
        }
      }

      // Shuriken spin
      if (p.shape === "shuriken") {
        const spin = p.mesh.getChildren().find((c): c is TransformNode => c.name === "shurikenSpin");
        if (spin) spin.rotation.y += dt * 25;
        else p.mesh.rotation.z += dt * 25;
      }
      // Leaf whirl: the knot turns about its line of flight and every leaf tumbles on its own
      if (p.shape === "leaves") {
        const whirl = p.mesh.getChildren()[0] as TransformNode | undefined;
        if (whirl) whirl.rotation.z += dt * LEAF_SPIN;
        for (const leaf of whirl?.getChildMeshes(true) ?? []) leaf.rotation.x += dt * (leaf.metadata?.tumble ?? 5);
      }
      // Crow wing flapping
      if (p.shape === "crow") {
        // each wing turns on its shoulder pivot about the line of flight: up and down through FLYING_CROW.beat around a slight lift
        const flapAngle = Math.sin(p.elapsed * FLYING_CROW.rate) * FLYING_CROW.beat;
        for (const child of p.mesh.getChildren()) {
          if ((child as any).name?.startsWith("wing")) {
            const wing = child as TransformNode;
            const side = wing.position.x > 0 ? 1 : -1;
            wing.rotation.z = side * (FLYING_CROW.lift + flapAngle);
          }
        }
      }

      // Collision-based early hit detection (check against enemy collision spheres)
      let earlyHit = false;
      if (t < 1 && t > 0.15) { // skip first 15% to avoid self-hit
        const projPos = p.mesh.position;
        for (const unit of p.allUnits) {
          if (unit.isDead || unit.team === p.attackerTeam) continue;
          const hitRadius = unit.definition.collisionRadius + 0.3;
          if (projPos.subtract(unit.position).lengthSquared() <= hitRadius * hitRadius) {
            // Override target to the unit we actually hit
            p.target = unit;
            p.targetPos.copyFrom(unit.position);
            earlyHit = true;
            break;
          }
        }
      }

      // Arrival
      if (t >= 1 || earlyHit) {
        // a dodged missile strikes its man only if he is still where it comes down (a splash still catches whoever is in it)
        const away = p.target.position.subtract(p.targetPos);
        away.y = 0;
        const missed = !earlyHit && p.loose === true && p.splashRadius <= 0 && away.length() > p.target.definition.collisionRadius + 0.3;
        const struck = !p.target.isDead && !missed;
        if (missed) this.visualEffects?.spawnImpactDust(p.targetPos);
        else this._onImpact(p);
        if (p.trailSystem) { p.trailSystem.stop(); p.trailSystem.dispose(false); }
        // [S] 425 a harpoon in a man: its rope stays on him, taut from the muzzle, while the shooter reels him in (card Characteristics "reel in the enemy unit")
        const towFor = p.rope && p.tether && struck && !p.target.isDead && this.reelIn ? this.reelIn(p.target, p.tether) : 0;
        if (towFor > 0 && p.rope && p.tether) this._tows.push({ rope: p.rope, tether: p.tether, target: p.target, left: towFor });
        else p.rope?.dispose();
        p.mesh.getChildMeshes().find((m) => m.name === "streak")?.dispose(); // the streak is of the flight: a shaft left standing has none
        // [S] 387 a snake is not left lodged like a shaft: it drops at its man's feet and slithers on (SimulationSystem SNAKE_LIVE)
        if (p.snake && this.snakeLand) {
          this.snakeLand(p.mesh.position.clone(), p.origin, p.attackerTeam);
          p.mesh.dispose();
        } else if (!this._leaveAsLitter(p, struck)) p.mesh.dispose();
        this._active.splice(i, 1);
      }
    }

    // A shaft goes when the corpse it stands in is cleared away, so none is left hanging in the air.
    for (let i = this._litter.length - 1; i >= 0; i--) {
      const { mesh, owner } = this._litter[i];
      if (mesh.isDisposed() || (owner && owner.body.allMeshes[0]?.isVisible === false)) {
        mesh.dispose();
        this._litter.splice(i, 1);
      }
    }

    for (let i = this._puffs.length - 1; i >= 0; i--) {
      const q = this._puffs[i];
      q.age += dt;
      const u = q.age / q.life;
      if (u >= 1) {
        q.mesh.dispose();
        this._puffs.splice(i, 1);
        continue;
      }
      // Swells fast then slowly; full for the first fifth, then thins out
      q.mesh.scaling.setAll(q.size * (1 + (TRAIL_PUFF_GROWN - 1) * (1 - (1 - u) * (1 - u))));
      q.mesh.position.y += q.rise * dt;
      if (q.drift) q.mesh.position.addInPlace(q.drift.scale(dt * (1 - u)));
      q.mesh.visibility = u < 0.2 ? 0.85 : 0.85 * (1 - (u - 0.2) / 0.8) * (1 - (u - 0.2) / 0.8);
    }

    // Pistol balls (spawnPistolShot): on along the line from the bell, gone at the man
    for (let i = this._bullets.length - 1; i >= 0; i--) {
      const b = this._bullets[i];
      b.t += dt;
      if (b.t >= b.flight) {
        b.mesh.dispose();
        this._bullets.splice(i, 1);
        continue;
      }
      Vector3.LerpToRef(b.from, b.to, b.t / b.flight, b.mesh.position);
    }

    // Update flashes
    for (let i = this._flashes.length - 1; i >= 0; i--) {
      const f = this._flashes[i];
      f.remaining -= dt;
      if (f.smokeLife) {
        // Pop out fast, keep swelling slowly, stay opaque for four fifths of the life, then thin out
        const ratio = Math.max(0, f.remaining / f.smokeLife);
        f.mesh.scaling.setAll(0.55 + (1 - ratio * ratio * ratio) * 0.4);
        f.mesh.position.y += 0.3 * dt;
        if (f.drift) f.mesh.position.addInPlace(f.drift.scale(dt));
        (f.mesh.material as PBRMetallicRoughnessMaterial).alpha = Math.min(1, ratio * 5);
      } else {
        // Fade and expand
        const ratio = Math.max(0, f.remaining / 0.35);
        f.mesh.scaling.setAll(1 + (1 - ratio) * 1.5);
        if (f.mesh.material && "alpha" in f.mesh.material) {
          (f.mesh.material as PBRMetallicRoughnessMaterial).alpha = ratio * 0.7;
        }
      }
      if (f.remaining <= 0) {
        f.mesh.dispose(false, f.ownsMaterial === true);
        this._flashes.splice(i, 1);
      }
    }
  }

  /**
   * Shafts stay where they land. One that strikes a standing body is carried on along its own line of flight to the hide it meets first, of whatever the body is built
   * from: a man's chest, his thigh or his shield arm, a mammoth's flank or its skull. It is left standing out of that place with only its head sunk in, and goes on with
   * the part it struck. One whose mark is already down comes to earth where the mark stood and stands planted in the turf, steep, its head buried and its tail in the air.
   */
  private _leaveAsLitter(p: ActiveProjectile, struck: boolean): boolean {
    if (p.shape !== "arrow" && p.shape !== "bolt" && p.shape !== "spear") return false;
    const mesh = p.mesh;
    const half = p.half ?? (p.shape === "spear" ? 0.5 : p.shape === "arrow" ? 0.4 : 0.24); // from the shaft's middle to the root of its head
    const vary = (salt: number): number => {
      const v = Math.sin((p.origin.x + p.origin.z * 1.7 + this._litter.length) * 12.9898 + salt * 78.233) * 43758.5453;
      return v - Math.floor(v);
    };
    const along = (): Vector3 => {
      const level = Math.cos(mesh.rotation.x);
      return new Vector3(Math.sin(mesh.rotation.y) * level, -Math.sin(mesh.rotation.x), Math.cos(mesh.rotation.y) * level);
    };
    if (struck) {
      const body = p.target.body;
      // The body is asked where it stands now, not where it was last drawn
      body.root.computeWorldMatrix(true);
      for (const part of body.root.getDescendants(false)) part.computeWorldMatrix(true);
      const hide = body.allMeshes.filter((m) => m.isVisible && m.isEnabled());
      // Each shaft comes in at its own height and its own step across the body, so one hit many times bristles instead of carrying one bundle
      const flight = along();
      const span = Math.hypot(flight.x, flight.z) || 1;
      const across = (vary(2) - 0.5) * 0.36;
      const reach = p.target.definition.collisionRadius + 2;
      const from = mesh.position.subtract(flight.scale(reach));
      from.x += (-flight.z / span) * across;
      from.y += (vary(1) - 0.5) * 0.35;
      from.z += (flight.x / span) * across;
      const heart = (body.torso ?? body.root).getAbsolutePosition();
      // A line of flight that passes between the legs or over a shoulder is bent in to the chest
      const met = new Ray(from, flight, reach * 2).intersectsMeshes(hide)[0]
        ?? new Ray(from, heart.subtract(from).normalize(), reach * 2 + 2).intersectsMeshes(hide)[0];
      // Knocked off its line as it bites
      mesh.rotation.x += (vary(3) - 0.5) * 0.7;
      mesh.rotation.y += (vary(4) - 0.5) * 0.7;
      const bite = met?.pickedPoint ?? heart;
      mesh.position.copyFrom(bite).subtractInPlace(along().scale(half - 0.07));
      // Carried by the joint the struck part hangs from
      let holder = met?.pickedMesh?.parent ?? null;
      while (holder instanceof Mesh) holder = holder.parent;
      mesh.setParent((holder as TransformNode | null) ?? body.torso ?? body.root);
    } else {
      const lean = 1.0 + vary(3) * 0.35;
      mesh.rotation.x = lean;
      mesh.rotation.y += (vary(4) - 0.5) * 0.9;
      mesh.position.set(p.targetPos.x + (vary(1) - 0.5) * 0.8, Math.sin(lean) * half - 0.1, p.targetPos.z + (vary(2) - 0.5) * 0.8);
    }
    this._litter.push({ mesh, owner: struck ? p.target : null });
    if (this._litter.length > 60) this._litter.shift()!.mesh.dispose();
    return true;
  }

  private _onImpact(p: ActiveProjectile): void {
    if (p.drunk) {
      this._drunkSplash(p);
      return;
    }
    if (p.splashRadius > 0) {
      // Splash damage
      const radiusSq = p.splashRadius * p.splashRadius;
      for (const unit of p.allUnits) {
        if (unit.isDead || unit.team === p.attackerTeam) continue;
        const distanceSq = unit.position.subtract(p.targetPos).lengthSquared();
        if (distanceSq > radiusSq) continue;
        const distance = Math.sqrt(distanceSq);
        const falloff = p.splashRadius > 0 ? Math.max(0, 1 - distance / p.splashRadius) : 1;
        const delta = unit.applyDamage(p.damage, p.knockback);
        if (p.shape === "leaves") this._loftFromSpikes(p, unit);
        if (this.impactPresentation) {
          this.impactPresentation.recordImpact({
            source: "projectile",
            path: "projectile-splash",
            position: unit.position,
            target: unit,
            impactDelta: delta,
            damage: p.damage,
            impulse: p.knockback,
            radius: p.splashRadius,
            falloff,
            attackerTeam: p.attackerTeam,
          });
        }
      }
      this._flingFromBlast(p);
      // Spawn impact effect for explosive
      const explosionScale = p.shape === "shell" ? 1.8 : 1;
      if (p.shape === "davinci_ball") {
        // A da Vinci ball does not explode: it shatters into iron fragments where it lands
        this.visualEffects?.spawnShatter(p.mesh.position);
      } else if (this.impactPresentation) {
        this.impactPresentation.presentExplosion(p.targetPos, explosionScale);
      } else {
        this._spawnExplosion(p.targetPos, explosionScale);
      }
    } else {
      // Direct hit
      if (!p.target.isDead) {
        const delta = p.target.applyDamage(p.damage, p.knockback);
        // A thrown spear launches the man it sticks in (LAUNCH.throw): thrown back off his feet from where it was thrown, not merely nudged
        const launch = LAUNCH[p.shape];
        if (launch?.throw && !p.target.isDead) p.target.staggerFromBlow(p.origin, launch.throw);
        // A balloon arrow's ball swells into balloons on the man it strikes, and they float him up
        if (p.balloons) p.mesh.getChildMeshes().find((m) => m.name === "balloonBall")?.setEnabled(false);
        if (p.balloons && !p.target.isDead) {
          p.target.floatOnBalloons(this._getTeamProjectilePalette(p.attackerTeam).primary);
          this.abilityHook?.(p.balloons, "float", p.target.position);
        }
        if (p.shape === "leaves") this._loftFromSpikes(p, p.target);
        if (p.shape === "firework") this._fireworkBurst(p);
        if (this.impactPresentation) {
          this.impactPresentation.recordImpact({
            source: "projectile",
            path: "projectile-direct",
            position: p.target.position,
            target: p.target,
            impactDelta: delta,
            damage: p.damage,
            impulse: p.knockback,
            attackerTeam: p.attackerTeam,
          });
        } else {
          this.visualEffects?.spawnImpactDust(p.targetPos);
          this.visualEffects?.spawnHitDebris(p.targetPos);
        }
      }
    }
  }

  /**
   * [S] 418 the Firework Arrow bursts where it strikes (card Weapons: explosion radius 2.5, force 50): a spark ball (visualEffects FIREWORK_BURST), and
   * every other enemy within FIREWORK_BLAST.radius takes the arrow's damage scaled by .share and the blow's push.
   */
  private _fireworkBurst(p: ActiveProjectile): void {
    this.visualEffects?.spawnFireworkBurst(p.target.position.clone());
    this.abilityHook?.("dynasty.firework_archer", "burst", p.target.position); // the only unit that shoots a Firework Arrow (rosterManifest projectileHint)
    const r2 = FIREWORK_BLAST.radius * FIREWORK_BLAST.radius;
    for (const unit of p.allUnits) {
      if (unit === p.target || unit.isDead || unit.team === p.attackerTeam) continue;
      if (Vector3.DistanceSquared(unit.position, p.target.position) > r2) continue;
      unit.applyDamage(p.damage * FIREWORK_BLAST.share, p.knockback);
    }
  }

  /** The bone mage's spike row throws a man it catches up into the air and on down its line (SPIKE_LOFT), the dead ones included: the spikes burst up under him. */
  private _loftFromSpikes(p: ActiveProjectile, unit: RuntimeUnit): void {
    const along = new Vector3(p.targetPos.x - p.origin.x, 0, p.targetPos.z - p.origin.z);
    if (along.lengthSquared() < 0.0001) along.set(1, 0, 0);
    along.normalize();
    unit.applyBlastLaunch(along, SPIKE_LOFT.along, SPIKE_LOFT.up);
  }

  /** Throw every enemy body near the blast up and away from its centre, the dead ones included. */
  private _flingFromBlast(p: ActiveProjectile): void {
    // Rocket arrows and tank bolts carry a token splash; only real explosions throw bodies.
    if (p.splashRadius < 1.5) return;
    const radius = p.splashRadius + 1.2;
    const shotDir = new Vector3(p.knockback.x, 0, p.knockback.z);
    if (shotDir.lengthSquared() < 0.0001) shotDir.set(1, 0, 0);
    shotDir.normalize();
    for (const unit of p.allUnits) {
      if (unit.team === p.attackerTeam) continue;
      const delta = unit.position.subtract(p.targetPos);
      delta.y = 0;
      const distance = delta.length();
      if (distance > radius) continue;
      const falloff = 1 - distance / radius;
      // A body standing on the centre goes the way the shot was travelling.
      const outward = distance > 0.05 ? delta.scale(1 / distance) : shotDir;
      // Lift of 8-12 m/s under 22 m/s2 gravity: bodies near the centre clear head height. The sideways throw is
      // slow next to it, so a group goes up over the crater instead of being skittled out flat.
      unit.applyBlastLaunch(outward, 1 + 1.5 * falloff, 8 + 4 * falloff);
    }
  }

  private _spawnExplosion(pos: Vector3, scale = 1, includeShake = true): void {
    const boom = MeshBuilder.CreateSphere("boom", { diameter: 0.3 * scale, segments: 6 }, this._scene);
    boom.position = pos.clone();
    boom.position.y += 0.3;
    const m = getMaterialFactory().createUnique("unlit", new Color3(1, 0.6, 0.1));
    m.disableLighting = true;
    m.emissiveColor = new Color3(1, 0.5, 0.1);
    m.alpha = 0.8;
    m.transparencyMode = 2;
    boom.material = m;
    this._flashes.push({ mesh: boom, remaining: 0.4 + 0.12 * Math.max(0, scale - 1) });
    if (includeShake) this.onShake?.(0.12 * scale);
    this.visualEffects?.spawnPersistentSmoke(pos);
    this.visualEffects?.spawnGroundScorch(pos);
  }

  /**
   * [S] balloon arrow ball (333; card Appearance: "the arrows also have a team coloured ball behind the arrowhead, which disappear on hit and appear to
   * expand into balloons"; renaissance.balloon_archer.jpg). A balloon arrow carries a team sphere BALLOON_BALL.size across, BALLOON_BALL.at along the
   * shaft from its middle (just behind the head), a little squashed along the shaft; it is hidden the moment the arrow strikes, as the balloons swell.
   */
  /*
   * [S] the medieval archer's arrow (358; medieval.archer.blue.png: a red shaft and a large black broadhead, not a dark shaft with a small team tip). The shaft
   * recoloured BROADHEAD.shaft; the small tip replaced by a flat black barbed head BROADHEAD.wide across, .long along the shaft, .thick flat, at its front end.
   */
  private _dressBroadhead(root: TransformNode): void {
    const B = BROADHEAD;
    for (const child of root.getChildMeshes(true)) {
      if (child.name === "shaft") child.material = this._getMat("broadhead_shaft", B.shaft, 0.12);
      if (child.name === "tip") child.dispose();
    }
    const head = MeshBuilder.CreateCylinder("broadhead", { height: B.long, diameterTop: 0, diameterBottom: B.wide, tessellation: 4 }, this._scene);
    head.convertToFlatShadedMesh();
    head.rotation.x = Math.PI / 2;
    head.scaling.x = B.thick;
    head.position.z = 0.375 + B.long / 2;
    head.material = this._getMat("broadhead_iron", B.iron, 0.04);
    head.parent = root;
  }

  /**
   * [S] 397 the Ice Archer's arrow (viking.ice_archer.jpg: a long pale-blue arrow with a jagged ice head trailing frost; critic 396: a dark-brown shaft
   * with a small blue cone). The shaft is recoloured pale ice ICE_ARROW.shaft self-lit, the fletching whitened, and the small tip replaced by an ice
   * crown. [S] 398 the critic read that crown as a clean pyramid with four balls on the shaft, not a jagged head with a frost spray: the head is now
   * .spikes shards off the shaft's end, the longest .head long on the axis and the rest .spike of it, leaned .spikeOut of the way out from the base and
   * turned round it in a ring, each faceted with 4 sides and a different length, so the crown is irregular from every angle; .barbs shards are swept back
   * .barb of .head at the crown's foot; and behind them a spray of .frost tetra flakes, .frostSize at the crown's foot shrinking .frostShrink down a
   * .frostLong cone whose mouth opens .frostOpen wide, so the tail reads as frost and not as beads on the shaft.
   * [S] 400 the critic read that spray as beads strung along the shaft still, and TABS's frost as icicles hanging UNDER it: .icles tapered spikes now hang
   * off the shaft's underside behind the crown, perpendicular to it (raked .icleRake back), spread .icleSpan along the shaft with uneven lengths, each
   * .icleWide at its root and .icleLong long, so the fringe breaks the arrow's silhouette below the line.
   */
  /*
   * [S] 434 the Skeleton Archer's Fire Arrow (audit 434 skeleton_archer c.1: "a plain dark shaft with a blue tip, no flame - TABS: flaming Fire
   * Arrow"; card Weapons projectile Fire Arrow, Characteristics "a bow with flaming arrows"): the head wrapped in fire - FIRE_ARROW.tongues orange
   * flame cones from just behind the tip streaming back along the shaft, .long of a metre the longest, .wide across, splayed .splay round it, a
   * yellow core cone inside them, and a dark tip. Glowing, so it reads at field distance in flight.
   */
  private _dressFireArrow(root: TransformNode): void {
    const F = FIRE_ARROW;
    for (const child of root.getChildMeshes(true)) if (child.name === "tip") child.material = this._getMat("fireArrow_tip", F.dark);
    const outer = this._getMat("fireArrow_flame", F.flame, F.glow);
    const inner = this._getMat("fireArrow_core", F.core, F.glow);
    const head = 0.36; // just behind the tip, in the arrow's own frame (head first along +z)
    const cone = (name: string, len: number, wide: number, dir: Vector3, m: typeof outer): void => {
      const c = MeshBuilder.CreateCylinder(name, { height: len, diameterTop: 0, diameterBottom: wide, tessellation: 5 }, this._scene);
      c.convertToFlatShadedMesh();
      c.rotationQuaternion = Quaternion.Identity();
      Quaternion.FromUnitVectorsToRef(new Vector3(0, 1, 0), dir.normalize(), c.rotationQuaternion);
      c.position.set(0, 0, head).addInPlace(dir.normalize().scale(len * 0.5));
      c.material = m;
      c.parent = root;
    };
    for (let k = 0; k < F.tongues; k++) {
      const a = (k / F.tongues) * Math.PI * 2 + 0.3;
      cone("fireArrowFlame", F.long * (k % 2 ? 0.7 : 1), F.wide, new Vector3(Math.cos(a) * F.splay, Math.sin(a) * F.splay, -1), outer);
    }
    cone("fireArrowCore", F.long * 0.55, F.wide * 0.8, new Vector3(0, 0, -1), inner);
  }

  private _dressIceArrow(root: TransformNode): void {
    const I = ICE_ARROW;
    for (const child of root.getChildMeshes(true)) {
      if (child.name === "shaft") child.material = this._getMat("iceArrow_shaft", I.shaft, 0.22);
      if (child.name === "tip") child.dispose();
      if (child.name === "fletch") child.material = this._getMat("iceArrow_fletch", I.ice, 0.16);
    }
    const ice = this._getMat("iceArrow_head", I.ice, 0.26);
    const foot = 0.375; // the shaft's end, in the arrow's own frame (head first along +z)
    const shard = (name: string, len: number, wide: number, dir: Vector3, at: Vector3): void => {
      const spike = MeshBuilder.CreateCylinder(name, { height: len, diameterTop: 0, diameterBottom: wide, tessellation: 4 }, this._scene);
      spike.convertToFlatShadedMesh();
      spike.rotationQuaternion = Quaternion.Identity();
      Quaternion.FromUnitVectorsToRef(new Vector3(0, 1, 0), dir.normalize(), spike.rotationQuaternion);
      spike.position.copyFrom(at.add(dir.normalize().scale(len * 0.5)));
      spike.material = ice;
      spike.parent = root;
    };
    for (let k = 0; k < I.spikes; k++) {
      const a = 0.7 + k * 2.39 + (k % 2) * 0.4;
      const axis = k === 0;
      const lean = axis ? 0 : I.spikeOut;
      const dir = new Vector3(Math.cos(a) * lean, Math.sin(a) * lean * 0.8, 1);
      const len = axis ? I.head : I.head * I.spike * (0.72 + 0.24 * ((k * 5) % 3) / 2);
      shard("iceArrowHead", len, I.wide * (axis ? 0.52 : 0.4), dir, new Vector3(Math.cos(a) * I.wide * lean * 0.7, Math.sin(a) * I.wide * lean * 0.55, foot - 0.02));
    }
    for (let b = 0; b < I.barbs; b++) {
      const a = 1.6 + b * 2.1;
      const back = new Vector3(Math.cos(a), Math.sin(a) * 0.8, -0.55);
      shard("iceArrowBarb", I.head * I.barb, I.wide * 0.3, back, new Vector3(Math.cos(a) * I.wide * 0.32, Math.sin(a) * I.wide * 0.26, foot - 0.03));
    }
    // [S] 400 the icicles under the shaft (spec at ICE_ARROW): each one hangs off the shaft's underside behind the crown, raked back along the flight
    // [S] 401 denser and longer, and the bead flakes are gone (critic 400): nine icicles root nearly touching along the shaft, so the fringe is a comb
    for (let i = 0; i < I.icles; i++) {
      const t = I.icles > 1 ? i / (I.icles - 1) : 0;
      const side = i % 2 ? 1 : -1;
      const len = I.icleLong * (1 - I.icleVary * 0.5 + I.icleVary * ((i * 7) % 5) / 4);
      const dir = new Vector3(side * I.icleOut * 0.4, -1, -I.icleRake);
      shard("iceArrowIcic", len, I.icleWide * (0.72 + 0.28 * ((i * 3) % 3) / 2), dir,
        new Vector3(side * I.icleWide * 0.5, -I.icleDrop - I.icleWide * 0.25, foot - I.icleFrom - t * I.icleSpan));
    }
  }

  /** [S] 385 the snake archer's arrow flies as his snake (ancientDress SNAKE): shaft, tip and fletching gone, the snake laid along +z head first. */
  private _dressSnake(root: TransformNode): void {
    for (const child of root.getChildMeshes(true)) {
      if (child.name === "shaft" || child.name === "tip" || child.name === "fletch") child.dispose();
    }
    const snake = buildSnake(this._scene, "flyingSnake", FLYING_SNAKE_LONG);
    snake.parent = root;
    snake.rotation.x = Math.PI / 2;
    snake.position.z = -FLYING_SNAKE_LONG / 2;
  }

  private _addBalloonBall(root: TransformNode, color: Color3, team: number): void {
    const ball = MeshBuilder.CreateSphere("balloonBall", { diameter: BALLOON_BALL.size, segments: 6 }, this._scene);
    ball.scaling.z = BALLOON_BALL.long;
    ball.position.z = BALLOON_BALL.at;
    ball.material = this._getMat(`balloon_ball_${team}`, color);
    ball.parent = root;
  }

  private _buildProjectileMesh(
    shape: ProjectileShape,
    palette: { primary: Color3; bright: Color3; dark: Color3 },
    attackerTeam: number,
  ): TransformNode {
    const root = new TransformNode("proj", this._scene);

    switch (shape) {
      case "arrow": {
        const shaft = MeshBuilder.CreateCylinder("shaft", { height: 0.75, diameter: 0.035, tessellation: 4 }, this._scene); // at 0.5 by 0.025 a shaft left standing in a body did not show across the field
        shaft.rotation.x = Math.PI / 2;
        shaft.material = this._getMat("wood_shaft", WOOD_SHAFT_COLOR);
        shaft.parent = root;
        const tip = MeshBuilder.CreateCylinder("tip", { height: 0.1, diameterTop: 0, diameterBottom: 0.055, tessellation: 4 }, this._scene);
        tip.rotation.x = Math.PI / 2;
        tip.position.z = 0.42;
        tip.material = this._getMat(`arrow_tip_${attackerTeam}`, palette.bright);
        tip.parent = root;
        // Fletching
        const fletch = MeshBuilder.CreateBox("fletch", { width: 0.11, height: 0.008, depth: 0.09 }, this._scene);
        fletch.position.z = -0.32;
        fletch.material = this._getMat(`fletch_${attackerTeam}`, palette.primary);
        fletch.parent = root;
        this._addStreak(root, 0.375, 1.6);
        break;
      }
      case "bolt": {
        const shaft = MeshBuilder.CreateCylinder("shaft", { height: 0.4, diameter: 0.04, tessellation: 4 }, this._scene);
        shaft.rotation.x = Math.PI / 2;
        shaft.material = this._getMat("wood_shaft", WOOD_SHAFT_COLOR);
        shaft.parent = root;
        const tip = MeshBuilder.CreateCylinder("tip", { height: 0.1, diameterTop: 0, diameterBottom: 0.06, tessellation: 4 }, this._scene);
        tip.rotation.x = Math.PI / 2;
        tip.position.z = 0.24;
        tip.material = this._getMat(`bolt_tip_${attackerTeam}`, palette.primary);
        tip.parent = root;
        break;
      }
      case "spear": {
        const shaft = MeshBuilder.CreateCylinder("shaft", { height: 0.9, diameter: 0.03, tessellation: 6 }, this._scene);
        shaft.rotation.x = Math.PI / 2;
        shaft.material = this._getMat("wood_shaft", WOOD_SHAFT_COLOR);
        shaft.parent = root;
        const tip = MeshBuilder.CreateCylinder("tip", { height: 0.14, diameterTop: 0, diameterBottom: 0.05, tessellation: 4 }, this._scene);
        tip.rotation.x = Math.PI / 2;
        tip.position.z = 0.5;
        tip.material = this._getMat(`spear_tip_${attackerTeam}`, palette.primary);
        tip.parent = root;
        this._addStreak(root, 0.45, 1.4);
        break;
      }
      case "harpoon": {
        // A harpooner's missile (units/pirate.harpooner), its +z the point: shaft centred on the root, the head on its front end, barbs swept back off the head's root
        const shaftMat = this._getMat("harpoon_shaft", HARPOON_SHAFT_COLOR);
        const ironMat = this._getMat("harpoon_iron", HARPOON_IRON_COLOR, 0.05);
        const shaft = MeshBuilder.CreateCylinder("harpoon_shaft", { height: HARPOON_SHAFT_LONG, diameter: HARPOON_SHAFT_WIDE, tessellation: 6 }, this._scene);
        shaft.rotation.x = Math.PI / 2;
        shaft.material = shaftMat;
        shaft.parent = root;
        const front = HARPOON_SHAFT_LONG / 2;
        // The head: a heavy flat four-sided leaf, broad in the upright plane of its flight so its face is turned to a side-on eye
        const head = MeshBuilder.CreateCylinder("harpoon_head", { height: HARPOON_HEAD_LONG, diameterTop: 0, diameterBottom: HARPOON_HEAD_WIDE, tessellation: 4 }, this._scene);
        head.rotation.x = Math.PI / 2;
        head.scaling.set(0.4, 1, 1);
        head.position.z = front + HARPOON_HEAD_LONG / 2;
        head.material = ironMat;
        head.parent = root;
        const socket = MeshBuilder.CreateCylinder("harpoon_socket", { height: 0.07, diameterTop: HARPOON_SHAFT_WIDE * 1.6, diameterBottom: HARPOON_SHAFT_WIDE * 1.2, tessellation: 6 }, this._scene);
        socket.rotation.x = Math.PI / 2;
        socket.position.z = front - 0.02;
        socket.material = ironMat;
        socket.parent = root;
        // Barbs: flat iron spikes from the head's root, pointing back and out above and below, in the head's broad plane
        for (let i = 0; i < HARPOON_BARBS; i++) {
          const side = i % 2 === 0 ? 1 : -1;
          const barb = MeshBuilder.CreateCylinder("harpoon_barb", { height: HARPOON_BARB_LONG, diameterTop: 0, diameterBottom: 0.045, tessellation: 4 }, this._scene);
          barb.scaling.set(0.5, 1, 1);
          // Its tip (+y) turned to point back along -z, tilted out by the sweep
          barb.rotation.x = -Math.PI / 2 + side * HARPOON_BARB_SWEEP;
          barb.position.set(0, side * (HARPOON_HEAD_WIDE * 0.35 + Math.sin(HARPOON_BARB_SWEEP) * HARPOON_BARB_LONG * 0.5), front - Math.cos(HARPOON_BARB_SWEEP) * HARPOON_BARB_LONG * 0.5 + 0.03);
          barb.material = ironMat;
          barb.parent = root;
        }
        // The rope's ring at the tail
        const ring = MeshBuilder.CreateTorus("harpoon_ring", { diameter: 0.08, thickness: 0.022, tessellation: 8 }, this._scene);
        ring.rotation.z = Math.PI / 2;
        ring.position.z = -front - 0.03;
        ring.material = ironMat;
        ring.parent = root;
        this._addStreak(root, front, 1.2);
        break;
      }
      case "bomb": {
        const body = MeshBuilder.CreateSphere("bomb", { diameter: 0.2, segments: 8 }, this._scene);
        body.material = this._ironMat();
        body.parent = root;
        this._addStreak(root, 0.1, 1.2, 0.07);
        const fuse = MeshBuilder.CreateCylinder("fuse", { height: 0.1, diameter: 0.015, tessellation: 4 }, this._scene);
        fuse.position.y = 0.12;
        fuse.material = this._getMat("fuse", new Color3(0.85, 0.6, 0.2), 0.4);
        fuse.parent = root;
        // Spark
        const spark = MeshBuilder.CreateSphere("spark", { diameter: 0.05, segments: 4 }, this._scene);
        spark.position.y = 0.18;
        spark.material = this._getMat("spark", new Color3(1, 0.8, 0.2), 0.7);
        spark.parent = root;
        break;
      }
      case "pumpkin": {
        // [S] 434 the Pumpkin Catapult's payload (audit 434 pumpkin_catapult c.1: "a black bomb with a fuse - TABS: big orange jack-o'-lantern
        // pumpkin"; spooky.pumpkin_catapult.jpg): a squat orange pumpkin of PUMPKIN_SHOT.lobes ribbed lobes round a core, a green-brown stem on top,
        // and a carved face (two triangle eyes and a jagged mouth, glowing yellow) on each side so a side-on camera sees one.
        const P = PUMPKIN_SHOT;
        const orange = this._getMat("pumpkin_skin", P.orange, 0.12);
        const core = MeshBuilder.CreateSphere("pumpkin", { diameter: P.size, segments: 6 }, this._scene);
        core.scaling.y = P.squash;
        core.material = orange;
        core.parent = root;
        for (let i = 0; i < P.lobes; i++) {
          const a = (i / P.lobes) * Math.PI * 2;
          const lobe = MeshBuilder.CreateSphere("pumpkinLobe", { diameter: P.size * 0.5, segments: 4 }, this._scene);
          lobe.scaling.set(1, P.squash * 1.9, 1);
          lobe.position.set(Math.cos(a) * P.size * 0.27, 0, Math.sin(a) * P.size * 0.27);
          lobe.material = orange;
          lobe.parent = root;
        }
        const stem = MeshBuilder.CreateCylinder("pumpkinStem", { height: P.size * 0.22, diameterTop: P.size * 0.07, diameterBottom: P.size * 0.12, tessellation: 5 }, this._scene);
        stem.position.y = P.size * P.squash * 0.5 + P.size * 0.06;
        stem.rotation.z = 0.25;
        stem.material = this._getMat("pumpkin_stem", P.stem, 0.1);
        stem.parent = root;
        const glow = this._getMat("pumpkin_face", P.face, 0.9);
        for (const side of [-1, 1]) {
          const x = side * (P.size * 0.5 + P.size * 0.01);
          for (const ez of [-1, 1]) {
            const eye = MeshBuilder.CreateCylinder("pumpkinEye", { height: P.size * 0.03, diameter: P.size * 0.17, tessellation: 3 }, this._scene);
            eye.rotation.z = Math.PI / 2;
            eye.position.set(x, P.size * 0.08, ez * P.size * 0.13);
            eye.material = glow;
            eye.parent = root;
          }
          const mouth = MeshBuilder.CreateBox("pumpkinMouth", { width: P.size * 0.03, height: P.size * 0.07, depth: P.size * 0.36 }, this._scene);
          mouth.position.set(x, -P.size * 0.1, 0);
          mouth.material = glow;
          mouth.parent = root;
        }
        break;
      }
      case "shell": {
        const shell = MeshBuilder.CreateCylinder("shell", { height: 0.46, diameter: 0.22, tessellation: 14 }, this._scene);
        shell.rotation.x = Math.PI / 2;
        shell.material = this._getMat(`shell_body_${attackerTeam}`, palette.dark, 0.04);
        shell.parent = root;
        const cap = MeshBuilder.CreateCylinder("shell_cap", { height: 0.18, diameterTop: 0, diameterBottom: 0.22, tessellation: 14 }, this._scene);
        cap.rotation.x = Math.PI / 2;
        cap.position.z = 0.28;
        cap.material = this._getMat(`shell_cap_mat_${attackerTeam}`, palette.primary, 0.06);
        cap.parent = root;
        break;
      }
      case "stone": {
        // The catapult's boulder (the only unthrown-by-hand stone): the bucket's faceted grey-brown rock at its size, no team tint
        const stone = buildFacetedBoulder(this._scene, "stone", CATAPULT_BOULDER);
        stone.parent = root;
        break;
      }
      case "cannonball": {
        // A cannon's shot: a fat iron ball, faceted, black against sky and grass alike whichever side fired it, with a white streak behind it for as long as it flies
        const ball = MeshBuilder.CreateSphere("cannonball", { diameter: 0.46, segments: 3 }, this._scene);
        ball.convertToFlatShadedMesh();
        ball.material = this._ironMat();
        ball.parent = root;
        this._scene.getGlowLayerByName("glow")?.addExcludedMesh(ball);
        this._addStreak(root, 0.23, 2.2, 0.14);
        break;
      }
      case "davinci_ball": {
        // The da Vinci tank's shot (card Characteristics: cannonballs that shatter into fragments on impact): a small faceted iron ball, black whichever side
        // fired it, with a short white streak behind it (see visualEffects.spawnShatter for the burst)
        const ball = MeshBuilder.CreateSphere("davinciBall", { diameter: DAVINCI_BALL, segments: 3 }, this._scene);
        ball.convertToFlatShadedMesh();
        ball.material = this._ironMat();
        ball.parent = root;
        this._scene.getGlowLayerByName("glow")?.addExcludedMesh(ball);
        this._addStreak(root, DAVINCI_BALL * 0.5, 1.3, 0.09);
        break;
      }
      case "firework": {
        // [S] 413 the Firework Arrow (audit 411 c.1: "nothing in the air - TABS: a rocket tube flying with a spark/smoke trail";
        // dynasty.firework_archer.red.png: a fat team-coloured tube with green bands round it, a dark arrowhead out of its front): FIREWORK_ROCKET.long
        // and .wide, .bands green rings, a dark head cone .head long, and a flame cone .flame long out of its tail, along +z (its line of flight)
        const F = FIREWORK_ROCKET;
        const tube = MeshBuilder.CreateCylinder("rocket", { height: F.long, diameter: F.wide, tessellation: 8 }, this._scene);
        tube.rotation.x = Math.PI / 2;
        tube.material = this._getMat(`rocket_body_${attackerTeam}`, palette.primary, 0.15);
        tube.parent = root;
        const green = this._getMat("rocket_band", F.band, 0.12);
        for (let i = 0; i < F.bands; i++) {
          const ring = MeshBuilder.CreateCylinder("rocketBand", { height: F.long * 0.07, diameter: F.wide * 1.15, tessellation: 8 }, this._scene);
          ring.rotation.x = Math.PI / 2;
          ring.position.z = -F.long * 0.4 + (F.long * 0.8 * i) / Math.max(1, F.bands - 1);
          ring.material = green;
          ring.parent = root;
        }
        const head = MeshBuilder.CreateCylinder("rocketHead", { height: F.head, diameterTop: 0, diameterBottom: F.wide * 0.7, tessellation: 4 }, this._scene);
        head.rotation.x = Math.PI / 2;
        head.position.z = F.long * 0.5 + F.head * 0.5;
        head.material = this._getMat("rocket_head", F.dark, 0.05);
        head.parent = root;
        const flame = MeshBuilder.CreateCylinder("trail", { height: F.flame, diameterTop: F.wide * 0.9, diameterBottom: 0, tessellation: 6 }, this._scene);
        flame.rotation.x = Math.PI / 2;
        flame.position.z = -F.long * 0.5 - F.flame * 0.5;
        flame.material = this._getMat("rocket_flame", F.fire, 0.9);
        flame.parent = root;
        break;
      }
      case "shuriken": {
        // [S] 412 a large dark-grey four-point star (audit 411 c.1: "small pale-blue six-petal discs - TABS: large dark-grey four-point stars";
        // dynasty.ninja.png): two flat rhombi SHURIKEN_FLIGHT.span long and .waist wide crossed square, dark steel with a pale hub, lying flat and
        // spinning in its own plane on a child node (shurikenSpin), so a side-on camera sees the star's face tilted .tilt toward it
        const S = SHURIKEN_FLIGHT;
        const steel = this._getMat("shuriken_steel", S.steel, 0.08);
        const spin = new TransformNode("shurikenSpin", this._scene);
        spin.parent = root;
        spin.rotation.x = S.tilt;
        for (const turn of [0, Math.PI / 2]) {
          const point = MeshBuilder.CreateCylinder("blade", { height: S.thick, diameter: S.span, tessellation: 4 }, this._scene);
          point.scaling.z = S.waist / S.span;
          point.rotation.y = turn;
          point.material = steel;
          point.parent = spin;
        }
        const hub = MeshBuilder.CreateCylinder("hub", { height: S.thick * 1.6, diameter: S.hub, tessellation: 8 }, this._scene);
        hub.material = this._getMat("shuriken_hub", S.hub_color, 0.1);
        hub.parent = spin;
        break;
      }
      case "rocket_arrow": {
        // [S] 416 the hwacha's singijeon (audit 411 c.1: "thin blue shafts with a white glow ball - TABS: orange-yellow flame jets with green-banded
        // rocket tubes"; dynasty.hwacha.jpg): a long thin shaft with a fat light-brown rocket tube lashed behind a dark pointed head, HWACHA_ROCKET.bands
        // green bands round the tube, and out of the tube's back an unlit orange-yellow flame cone with a white core and a grey smoke puff behind it
        const K = HWACHA_ROCKET;
        const mf = getMaterialFactory();
        const shaftMesh = MeshBuilder.CreateCylinder("shaft", { height: K.long, diameter: K.shaft, tessellation: 5 }, this._scene);
        shaftMesh.rotation.x = Math.PI / 2;
        shaftMesh.material = this._getMat("hwacha_shaft", K.wood);
        shaftMesh.parent = root;
        const tube = MeshBuilder.CreateCylinder("rocketTube", { height: K.tube, diameter: K.wide, tessellation: 7 }, this._scene);
        tube.rotation.x = Math.PI / 2;
        tube.position.z = K.long * 0.5 - K.head - K.tube * 0.5;
        tube.material = this._getMat("hwacha_tube", K.paper);
        tube.parent = root;
        for (let i = 0; i < K.bands; i++) {
          const band = MeshBuilder.CreateCylinder("rocketBand", { height: K.tube * 0.12, diameter: K.wide * 1.12, tessellation: 7 }, this._scene);
          band.rotation.x = Math.PI / 2;
          band.position.z = tube.position.z + (i / Math.max(1, K.bands - 1) - 0.5) * K.tube * 0.7;
          band.material = this._getMat("hwacha_band", K.green);
          band.parent = root;
        }
        const tip = MeshBuilder.CreateCylinder("tip", { height: K.head, diameterTop: 0, diameterBottom: K.wide * 0.9, tessellation: 4 }, this._scene);
        tip.rotation.x = Math.PI / 2;
        tip.position.z = K.long * 0.5 - K.head * 0.5;
        tip.material = this._getMat("hwacha_head", K.dark);
        tip.parent = root;
        const tail = tube.position.z - K.tube * 0.5;
        const flame = MeshBuilder.CreateCylinder("trail", { height: K.flame, diameterTop: K.wide * 1.4, diameterBottom: 0, tessellation: 6 }, this._scene);
        flame.rotation.x = Math.PI / 2;
        flame.position.z = tail - K.flame * 0.5;
        flame.material = mf.get("unlit", K.fire, { emissive: K.fire, alpha: 0.85 });
        flame.parent = root;
        const core = MeshBuilder.CreateCylinder("trailCore", { height: K.flame * 0.6, diameterTop: K.wide * 0.7, diameterBottom: 0, tessellation: 6 }, this._scene);
        core.rotation.x = Math.PI / 2;
        core.position.z = tail - K.flame * 0.3;
        core.material = mf.get("unlit", K.core, { emissive: K.core });
        core.parent = root;
        const smoke = MeshBuilder.CreateIcoSphere("smoke", { radius: K.wide * 1.3, subdivisions: 1, flat: true }, this._scene);
        smoke.position.z = tail - K.flame - K.wide;
        smoke.material = mf.get("unlit", new Color3(0.82, 0.82, 0.8), { alpha: 0.5 });
        smoke.parent = root;
        const glowLayer = this._scene.getGlowLayerByName("glow");
        for (const m of [flame, core, smoke]) glowLayer?.addExcludedMesh(m);
        break;
      }
      case "crow": {
        // [S] a flying crow (342; farmer.scarecrow.png, card: Crow Throw, projectile Crow): spec at FLYING_CROW
        this._buildFlyingCrow(root);
        break;
      }
      case "spirit_fire":
      case "fireball": {
        // [S] 434 "spirit_fire": the Candlehead's Candle Fire (audit 434 candlehead c.1: "two dark javelin shafts with blue points - TABS: cyan
        // spirit-fire ball thrown from the hand candle"; spooky.candlehead.jpg): the fireball's build in SPIRIT_FIRE's pale-cyan heart and cyan shell
        const spirit = shape === "spirit_fire";
        const HEART = spirit ? SPIRIT_FIRE.heart : FIREBALL_HEART, SHELL = spirit ? SPIRIT_FIRE.shell : FIREBALL_SHELL, WIDE = FIREBALL_WIDE * (spirit ? SPIRIT_FIRE.size : 1);
        // A wizard's fireball (units/legacy.wizard): fire in no team's colour, a self-lit faceted ball, a white-yellow heart inside an orange shell, with a
        // short tapering flame behind it on the line of flight, big enough (FIREBALL_WIDE) to read as a glowing thing at the throw_casters distance
        const mf = getMaterialFactory();
        const heart = MeshBuilder.CreateIcoSphere("fireball", { radius: WIDE * 0.3, subdivisions: 1, flat: true }, this._scene);
        heart.material = mf.get("unlit", HEART, { emissive: HEART });
        heart.parent = root;
        const shell = MeshBuilder.CreateIcoSphere("fireball_shell", { radius: WIDE * 0.5, subdivisions: 1, flat: true }, this._scene);
        shell.rotation.set(0.6, 0.9, 0.3); // its facets turned off the heart's
        shell.material = mf.get("unlit", SHELL, { emissive: SHELL });
        shell.parent = root;
        const tail = MeshBuilder.CreateCylinder("fireball_tail", { height: FIREBALL_TAIL, diameterTop: WIDE * 0.8, diameterBottom: 0, tessellation: 6 }, this._scene);
        tail.rotation.x = Math.PI / 2;
        tail.position.z = -FIREBALL_TAIL / 2;
        tail.material = mf.get("unlit", SHELL, { emissive: SHELL, alpha: 0.45 });
        tail.parent = root;
        // No part blooms: lit through the glow layer the ball washed out into a pale yellow disc with no orange shell and no facets
        const glowLayer = this._scene.getGlowLayerByName("glow");
        glowLayer?.addExcludedMesh(heart);
        glowLayer?.addExcludedMesh(shell);
        glowLayer?.addExcludedMesh(tail);
        break;
      }
      case "leaves": {
        // A bone mage's missile (units/tribal.bone_mage): no bolt, a whirl of long pointed leaves in no team's colour, each a flat two-sided diamond
        // drawn out to a point at both ends with a dark stem, scattered round the line of flight (golden angle) and trailing back along it
        const whirl = new TransformNode("leaf_whirl", this._scene);
        whirl.parent = root;
        const glowLayer = this._scene.getGlowLayerByName("glow");
        const stemMat = this._getMat("leaf_stem", new Color3(0.3, 0.12, 0.08));
        for (let i = 0; i < LEAF_COUNT; i++) {
          const u = (i + 0.5) / LEAF_COUNT;
          const around = i * 2.39996;
          const reach = LEAF_WHIRL * (0.35 + 0.65 * Math.sqrt(((i * 7) % LEAF_COUNT + 0.5) / LEAF_COUNT));
          const leaf = MeshBuilder.CreateDisc("leaf", { radius: 0.5, tessellation: 4, sideOrientation: Mesh.DOUBLESIDE }, this._scene);
          leaf.scaling.set(LEAF_WIDE, LEAF_LONG, 1);
          leaf.position.set(Math.cos(around) * reach, Math.sin(around) * reach, 0.25 - u * LEAF_SPREAD);
          leaf.rotation.set(around * 1.7, around, around * 0.6);
          leaf.metadata = { tumble: 3 + (i % 4) * 2.2 };
          leaf.material = this._getMat(`leaf_${i % LEAF_COLORS.length}`, LEAF_COLORS[i % LEAF_COLORS.length], 0.2);
          leaf.parent = whirl;
          glowLayer?.addExcludedMesh(leaf);
          const stem = MeshBuilder.CreateCylinder("leaf_stem", { height: 0.35, diameter: 0.12, tessellation: 3 }, this._scene);
          stem.scaling.z = 0.25; // the leaf disc has no depth to scale it by
          stem.position.y = -0.62; // in the leaf's own unit square, so it scales with it: a short stalk off its lower point
          stem.material = stemMat;
          stem.parent = leaf;
        }
        break;
      }
      case "sword": {
        // A swordcaster's missile: the same sword that stood in his ring (propBuilder buildFlyingSword), in no team's colour, its +z the point
        buildFlyingSword(this._scene, root);
        break;
      }
    }

    return root;
  }

  // A brief white streak off the back of a thrown shaft: a thin spike of its own, tapering to nothing behind it. Particles left along the path were lost against the pale sky.
  /**
   * A thrower's missile is the prop he held (trailer_3_sheet_01 r3c3, units/tribal.spear_thrower): a copy of the hand's prop, its own meshes, colours and world size,
   * its long axis (the prop's +y, head up) laid along the flight's +z, with the spear's white streak behind it. The sim hides the held one as this leaves the hand.
   */
  private _buildHeldMissile(prop: TransformNode, shape: ProjectileShape): { root: TransformNode; half: number } {
    const root = new TransformNode("proj", this._scene);
    prop.computeWorldMatrix(true);
    const scale = prop.absoluteScaling.clone();
    const copy = prop instanceof Mesh ? prop.clone(`${prop.name}_thrown`, root) : prop.clone(`${prop.name}_thrown`, root);
    let half = 0.5;
    if (copy) {
      copy.setEnabled(true);
      copy.position.setAll(0);
      copy.rotationQuaternion = null;
      copy.rotation.set(Math.PI / 2, 0, 0);
      copy.scaling.copyFrom(scale);
      for (const m of copy.getChildMeshes(false)) m.setEnabled(true);
      if (copy instanceof Mesh) {
        copy.refreshBoundingInfo();
        half = copy.getBoundingInfo().boundingBox.extendSize.y * scale.y;
      }
    }
    if (shape === "spear") this._addStreak(root, half, 1.4);
    return { root, half };
  }

  private _addStreak(root: TransformNode, shaftHalf: number, length: number, width = 0.02): void {
    const streak = MeshBuilder.CreateCylinder("streak", { height: length, diameterTop: width, diameterBottom: 0, tessellation: 4 }, this._scene);
    streak.rotation.x = Math.PI / 2;
    streak.position.z = -(shaftHalf + length / 2);
    streak.material = getMaterialFactory().get("wood", new Color3(1, 1, 1), { emissiveIntensity: 0.3, alpha: 0.5 });
    streak.parent = root;
  }

  /** Shot and bomb iron: near black and in no team's colour, which under the blue sky light read navy. */
  private _ironMat(): PBRMetallicRoughnessMaterial {
    let m = this._matCache.get("iron_shot");
    if (!m) {
      m = getMaterialFactory().get("stone", new Color3(0.045, 0.045, 0.05));
      this._matCache.set("iron_shot", m);
    }
    return m;
  }

  /** A flying crow under `root`, its +z the beak: spec at FLYING_CROW. Wings hang on pivots named "wing" so the flight update can beat them. */
  private _buildFlyingCrow(root: TransformNode): void {
    const C = FLYING_CROW;
    const black = this._getMat("crow_black", CROW_FLY_BLACK, C.glow);
    const grey = this._getMat("crow_beak_grey", new Color3(0.36, 0.35, 0.38), 0.12);
    const white = this._getMat("crow_eye_white", new Color3(0.95, 0.95, 0.92), 0.4);
    const part = (m: Mesh, mt: PBRMetallicRoughnessMaterial, parent: TransformNode, x: number, y: number, z: number): Mesh => {
      m.material = mt;
      m.position.set(x, y, z);
      m.parent = parent;
      return m;
    };
    // plump body along the line of flight, a round head on its front end, grey beak, two white bead eyes
    const body = part(MeshBuilder.CreateIcoSphere("crowbody", { radius: 0.5, subdivisions: 1, flat: true }, this._scene), black, root, 0, 0, 0);
    body.scaling.set(C.wide, C.tall, C.long);
    const headZ = C.long * 0.5 + C.head * 0.2;
    part(MeshBuilder.CreateIcoSphere("crowhead", { radius: C.head * 0.5, subdivisions: 1, flat: true }, this._scene), black, root, 0, C.tall * 0.22, headZ);
    const beak = part(MeshBuilder.CreateCylinder("crowbeak", { height: C.beak, diameterTop: 0, diameterBottom: C.head * 0.4, tessellation: 4 }, this._scene), grey, root, 0, C.tall * 0.18, headZ + C.head * 0.42 + C.beak * 0.4);
    beak.rotation.x = Math.PI / 2;
    for (const side of [-1, 1]) {
      part(MeshBuilder.CreateSphere("croweye", { diameter: C.head * 0.24, segments: 4 }, this._scene), white, root, side * C.head * 0.4, C.tall * 0.3, headZ + C.head * 0.18);
      // a spread wing: a broad flat blade, wide at the shoulder and fingered at the tip, out from a shoulder pivot
      const pivot = new TransformNode("wing", this._scene);
      pivot.parent = root;
      pivot.position.set(side * C.wide * 0.35, C.tall * 0.2, C.long * 0.05);
      const blade = MeshBuilder.CreateCylinder("wingblade", { height: C.span, diameterTop: C.chord * 0.45, diameterBottom: C.chord, tessellation: 4 }, this._scene);
      blade.rotation.z = -side * Math.PI / 2; // its height along the span, the wide end at the shoulder
      blade.scaling.x = C.flat;
      part(blade, black, pivot, side * C.span * 0.5, 0, -C.chord * 0.15);
      for (let f = 0; f < C.fingers; f++) {
        // primary feathers splayed past the tip
        const feather = MeshBuilder.CreateBox("wingfeather", { width: C.feather, height: C.flat * C.chord * 0.3, depth: C.chord * 0.14 }, this._scene);
        part(feather, black, pivot, side * (C.span + C.feather * 0.35), 0, -C.chord * 0.15 + (f - (C.fingers - 1) / 2) * C.chord * 0.16);
        feather.rotation.y = side * (f - (C.fingers - 1) / 2) * 0.22;
      }
    }
    // fanned tail behind
    const tail = part(MeshBuilder.CreateCylinder("crowtail", { height: C.tail, diameterTop: 0, diameterBottom: C.fan, tessellation: 4 }, this._scene), black, root, 0, C.tall * 0.05, -C.long * 0.5 - C.tail * 0.35);
    tail.rotation.x = Math.PI / 2; // point toward the body, the fan behind
    tail.scaling.z = 0.25;
    for (const m of root.getChildMeshes()) (m as Mesh).convertToFlatShadedMesh();
  }

  private _getMat(key: string, color: Color3, emissive = 0): PBRMetallicRoughnessMaterial {
    let m = this._matCache.get(key);
    if (m) return m;
    const mf = getMaterialFactory();
    m = emissive > 0
      ? mf.get("wood", color, { emissiveIntensity: emissive })
      : mf.get("wood", color);
    this._matCache.set(key, m);
    return m;
  }

  /** One soft wake puff at a ball's position: a feathered white disc that always faces the camera. Shared texture and material; each puff fades by its own visibility. */
  /** The potion's splash (DRUNK_SPLASH): green puffs out over the radius, and every man in it hurt a little and drunk. */
  private _drunkSplash(p: ActiveProjectile): void {
    const D = DRUNK_SPLASH;
    const at = p.targetPos.clone();
    at.y = Math.max(0.3, at.y);
    this._leavePuff(at, { size: D.size * 1.8, life: D.life, rise: 0.25, green: true });
    for (let i = 0; i < D.puffs; i++) {
      const a = (i / D.puffs) * Math.PI * 2;
      const out = new Vector3(Math.sin(a), 0.35, Math.cos(a)).scale(D.radius * 1.4);
      this._leavePuff(at.add(new Vector3(Math.sin(a) * 0.3, 0, Math.cos(a) * 0.3)), { size: D.size * (0.7 + (i % 3) * 0.2), life: D.life, rise: 0.1, drift: out, green: true });
    }
    let struck = false;
    for (const unit of p.allUnits) {
      if (unit.isDead) continue;
      const d = unit.position.subtract(p.targetPos);
      d.y = 0;
      if (d.length() > D.radius) continue;
      unit.applyDamage(p.damage, p.knockback.scale(D.push));
      if (unit.isDead) continue;
      unit.getDrunk(D.seconds);
      struck = true;
    }
    if (struck) this.abilityHook?.(p.drunk!, "status:drunk", p.targetPos);
  }

  private _leavePuff(at: Vector3, opts: { size?: number; life?: number; rise?: number; drift?: Vector3; green?: boolean } = {}): void {
    if (!this._puffMat) {
      const tex = new DynamicTexture("trailPuffTex", { width: 64, height: 64 }, this._scene, false);
      const ctx = tex.getContext() as unknown as CanvasRenderingContext2D;
      const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      g.addColorStop(0, "rgba(255,255,255,1)");
      g.addColorStop(0.45, "rgba(255,255,255,0.85)");
      g.addColorStop(1, "rgba(255,255,255,0)");
      ctx.clearRect(0, 0, 64, 64);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 64, 64);
      tex.hasAlpha = true;
      tex.update();
      const m = new StandardMaterial("trailPuffMat", this._scene);
      m.diffuseTexture = tex;
      m.useAlphaFromDiffuseTexture = true;
      m.disableLighting = true;
      m.emissiveColor = new Color3(0.9, 0.9, 0.88);
      m.backFaceCulling = false;
      m.disableDepthWrite = true;
      this._puffMat = m;
    }
    if (opts.green && !this._greenPuffMat) {
      // its own material on the same feathered texture (a clone would copy the dynamic texture blank, and never be ready)
      const g = new StandardMaterial("drunkPuffMat", this._scene);
      g.diffuseTexture = this._puffMat.diffuseTexture;
      g.useAlphaFromDiffuseTexture = true;
      g.disableLighting = true;
      g.emissiveColor = DRUNK_GREEN.clone();
      g.backFaceCulling = false;
      g.disableDepthWrite = true;
      this._greenPuffMat = g;
    }
    // Hashed, not drawn from Math.random, so the wake does not shift the battle's random stream
    const n = this._puffCount++;
    const h = (k: number): number => { const v = Math.sin(n * 12.9898 + k * 78.233) * 43758.5453; return v - Math.floor(v); };
    const puff = MeshBuilder.CreatePlane("trailPuff", { size: 1 }, this._scene);
    puff.billboardMode = Mesh.BILLBOARDMODE_ALL;
    puff.material = opts.green ? this._greenPuffMat! : this._puffMat;
    puff.isPickable = false;
    puff.position.set(at.x + (h(1) - 0.5) * 0.12, at.y + (h(2) - 0.5) * 0.12, at.z + (h(3) - 0.5) * 0.12);
    const size = opts.size ?? TRAIL_PUFF_BORN * (0.8 + h(4) * 0.4);
    puff.scaling.setAll(size);
    this._scene.getGlowLayerByName("glow")?.addExcludedMesh(puff);
    this._puffs.push({ mesh: puff, age: 0, life: opts.life ?? TRAIL_PUFF_LIFE * (0.8 + h(5) * 0.4), size, rise: opts.rise ?? 0.15 + h(6) * 0.2, drift: opts.drift });
    if (this._puffs.length > TRAIL_PUFF_CAP) this._puffs.shift()!.mesh.dispose();
  }

  dispose(): void {
    for (const p of this._active) {
      if (p.trailSystem) { p.trailSystem.stop(); p.trailSystem.dispose(false); }
      p.rope?.dispose();
      p.mesh.dispose();
    }
    for (const f of this._flashes) f.mesh.dispose();
    for (const b of this._bullets) b.mesh.dispose();
    this._bullets.length = 0;
    for (const w of this._tows) w.rope.dispose();
    this._tows.length = 0;
    for (const l of this._litter) l.mesh.dispose();
    for (const q of this._puffs) q.mesh.dispose();
    this._puffs.length = 0;
    this._litter.length = 0;
    this._active.length = 0;
    this._flashes.length = 0;
  }
}
