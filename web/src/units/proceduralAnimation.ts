import { Matrix, Quaternion, Vector3, type Mesh, type TransformNode } from "@babylonjs/core";
import type { ArticulatedBody } from "./bodyBuilder";

export enum AnimState {
  Idle,
  Walking,
  Attacking,
  Dead,
}

/**
 * TABS-style procedural animation: wobbly sine-wave driven joints.
 * All rotation values are in radians.
 */
export type AttackStyle = "humanoid" | "mammoth";
export type WalkStyle = "humanoid" | "quadruped";
export type AttackMotion =
  | "strike"
  | "heavy_swing"
  | "blade_slash"
  | "thrust"
  | "throw"
  | "bow_draw_release"
  | "crossbow_snap"
  | "firearm_recoil"
  | "reload"
  | "crank"
  | "brace"
  | "carry"
  | "breath";
export type LocomotionBias = "none" | "heavy_carry" | "aimed" | "braced";
/** A weapon that turns in the fist: the turn and the offset it was strapped on with, and for a bow the spin about its length and where its middle sits from the fist. */
type CarriedProp = { node: TransformNode; rest: Quaternion; grip: Vector3; spin?: Quaternion; seat?: Vector3; plant?: number };
export type ReleaseTimingProfile =
  | "default"
  | "melee_commit"
  | "thrust_extend"
  | "bow_release"
  | "crossbow_release"
  | "firearm_recoil"
  | "throw_release";

/*
 * The shield press, rebuilt. Spec, read off the reference:
 *   tabs_screenshot_06 (a shield wall closing, two ranks deep): no two men carry the trunk at one angle; the chests are pitched forward of the hips by anything from about 10 to
 *   about 30 degrees and the heads are not levelled back, each sits on its trunk at its own tilt. Every man is at his own point of a stride, one knee forward and bent. The boards
 *   stand at different turns and tilts, following the shoulders behind them. Six spears show, all in the rear rank, and every one of them is RAISED: the shafts stand above the
 *   helmets at pitches between about 60 and 85 degrees above level, parallel, none crossing another and none crossing a head. No spear in the wall lies level.
 *   trailer_3_sheet_01 r3c1 (five spearmen with the spear up to strike): the fist is at the ear, above the shoulder, the elbow carried out behind, the trunk leant a little back,
 *   the shaft beside the cheek; five shafts at five slightly different pitches.
 * So:
 *   Trunk: a braced man's trunk pitch is his own, BRACE_PITCH_MIN..MAX forward of the hips, and it is his whatever he is doing under it (stepping in, standing, striking): the
 *   walk's lean and the shove's cap no longer bring a rank to one angle. His head follows the trunk by his own share and is tucked or lifted on top of that. The lead shoulder is
 *   turned into the board, and the board turns and tilts with it.
 *   Spears: one line per wall. From the moment a man is slotted into a wall his spear stands on the wall's heading at SPEAR_WALL_UP above level, the same for every man in it,
 *   front rank and rear, whichever way his own body is turned: so the shafts are parallel and none crosses another or a head, and its butt drops beside his own hip. The stroke
 *   runs the shaft through the fist along that line and back; it never tips the shaft down. A front man's spear is not levelled or dipped either: no wall spear in the reference lies level, and a shaft half as tall again
 *   as the man, pointed at an enemy under a pace away, either runs on through him or is pushed back through the fist into the man behind. He holds it couched low instead, the
 *   fist at his waist in front of him and gripped near the butt, SPEAR_FRONT_GRIP_MIN..MAX of its length from it, and raised on the same line as the rear rank's spears, so the
 *   point stands over the enemy's head and the short end below the fist points down behind him to his heel, through nobody.
 *   Each works his stroke on his own beat: drawn back SPEAR_DRAW of a lunge, thrown SPEAR_LUNGE metres along the wall's raised line, brought back.
 *   Legs: a braced man is on his feet, not sat on his heels. The deepest crouch folds the knees BRACE_CROUCH_DEEP at most and the step of the drive leg is BRACE_STEP_MIN..MAX.
 */
const BRACE_PITCH_MIN = 0.14;
const BRACE_PITCH_MAX = 0.56;
const SPEAR_LUNGE = 0.45;
const SPEAR_DRAW = -0.4;
const SPEAR_WALL_UP = 1.48;
const SPEAR_FRONT_GRIP_MIN = 0.2;
const SPEAR_FRONT_GRIP_MAX = 0.28;
// The front rank's boards in a wall in contact (see _lapBoard): how far ahead of the rank's line their plane stands, and the one turn off square every board in it takes.
const BOARD_PLANE_REACH = 0.42;
const BOARD_LAP = 0.22;
const BOARD_PLANE_MAX_OUT = 0.7;
/** The front man's couched spear arm: the upper arm hangs forward of plumb by this much and the elbow folds the forearm up to carry the fist at the waist. */
const SPEAR_COUCH_RAISE = -0.45;
const SPEAR_COUCH_ELBOW = -1.25;
const BRACE_CROUCH_DEEP = 0.7;
const BRACE_STEP_MIN = 0.22;
const BRACE_STEP_MAX = 0.5;
/*
 * The bowman's shot. Spec, read off trailer_3_sheet_01 r1c1 (an archer with the bow up): the stave stands upright in the fist of the leading arm, out in front of the face
 * at the end of that arm, its two limbs above and below the fist; the other hand is at the string by the chest or cheek; he stands part side-on with the bow shoulder to his mark.
 * So: he turns BOW_TURN_MIN..MAX off the line of the shot, his own amount, and leans back off the bow by his own amount; and the stave does not go back to hanging from the hand
 * while he shoots, as it did: it is turned in the fist to stand upright, canted a little toward the mark, for as long as the bow arm is up (see _carryProp).
 */
const BOW_TURN_MIN = 0.95;
const BOW_TURN_MAX = 1.3;
/** A caster does not hold his rod from a squat: of whatever crouch his rest stance has, he keeps this share. */
const CASTER_CROUCH = 0.3;
/** A heavy weapon's arc in the fist, radians from straight up: cocked up and back over the shoulder, landed forward and down on the mark. */
const CLUB_COCK = -0.4;
const CLUB_LAND = 1.8;
// The press blow (see _pressBlow): the beat a clubber in contact strikes on, and the shares of it spent dropping, landed on the head and heaving back to the cock.
const PRESS_BLOW_BEAT_MIN = 1.5;
const PRESS_BLOW_BEAT_MAX = 2.4;
const PRESS_BLOW_DROP = 0.1;
const PRESS_BLOW_HOLD = 0.16;
const PRESS_BLOW_BACK = 0.16;

export class ProceduralAnimator {
  private _body: ArticulatedBody;
  private _state = AnimState.Idle;
  private _time = 0;
  private _attackTimer = 0;
  private _attackDuration = 0.4;
  private _attackMotion: AttackMotion = "strike";
  private _wobblePhase: number; // random offset per unit
  attackStyle: AttackStyle = "humanoid";
  walkStyle: WalkStyle = "humanoid";
  defaultAttackMotion: AttackMotion = "strike";
  locomotionBias: LocomotionBias = "none";
  releaseTimingProfile: ReleaseTimingProfile = "default";

  // Death ragdoll state
  private _deathAngularVelocities: number[] = [];
  private _deathJointAngles: number[] = [];
  private _deathRestAngles: number[] = [];
  private _deathAirAngles: number[] = [];
  private _deathDamping = 0.97;

  constructor(body: ArticulatedBody) {
    this._body = body;
    this._wobblePhase = Math.random() * Math.PI * 2;
  }

  get state(): AnimState { return this._state; }

  setState(state: AnimState): void {
    if (this._state === state) return;
    this._state = state;
    if (state === AnimState.Dead) {
      this._initDeathRagdoll();
    }
  }

  triggerAttack(windupTime: number, motion?: AttackMotion): void {
    this._state = AnimState.Attacking;
    this._attackTimer = 0;
    this._attackDuration = windupTime + 0.25;
    this._attackMotion = motion ?? this.defaultAttackMotion;
  }

  /** Brief flinch on hit — snaps torso/head back then recovers. */
  triggerFlinch(): void {
    if (this._state === AnimState.Dead) return;
    this._flinchTimer = 0.35;
    this._squashTimer = 0.15;
  }

  /** Toppled/downed living bodies go limp: 1 crumples the joints, 0 returns to the animated pose. */
  setLimp(limp: boolean): void {
    this._limpTarget = limp ? 1 : 0;
  }

  /** A body in flight takes its own air shape instead of the flat crumple it will land in. */
  /** Which face a corpse comes to rest on: `up` > 0 on its back, < 0 on its front. Its rest pose then stands folds up off the ground on the open side. */
  setLandedFace(up: number): void {
    const landed = up > 0.5 ? 1 : up < -0.5 ? -1 : 0;
    if (landed === 0 || landed === this._landedFace || this._state !== AnimState.Dead || this.walkStyle === "quadruped") return;
    this._landedFace = landed;
    this._writeDeathRest(landed);
  }

  setAirborne(airborne: boolean): void {
    this._airTarget = airborne ? 1 : 0;
  }

  /** Melee contact: called every decision while in reach; the shove pose decays on its own once the calls stop. */
  leanIntoShove(): void {
    this._shoveTimer = 0.5;
  }

  private _shoveTimer = 0;

  /** An enemy is close enough to close with (a few strides): a heavy weapon comes up to its cocked hold over the shoulder and stays there until the calls stop. */
  readyBlow(striking = false): void {
    this._readyTimer = 0.6;
    if (striking) this._strikeTimer = 0.6;
  }
  private _strikeTimer = 0;
  private _readyTimer = 0;
  private _ready = 0;

  /** A wall man's enemy, called every decision while the wall closes on him or fights him: the spear comes to its fighting hold (see _carrySpear), a front man's pointed down at that man, a rear man's raised over the rank ahead, until the calls stop. */
  levelSpearAt(enemyGround: Vector3, enemyRadius = 0.3, rearRank = false): void {
    this._spearAim.copyFrom(enemyGround);
    this._spearAimRadius = enemyRadius;
    this._spearRear = rearRank;
    this._spearAimTimer = 0.6;
  }
  private _spearAim = new Vector3();
  /** Slotted into a shield wall, called every step while he stands in it: his spear goes up on the wall's heading at SPEAR_WALL_UP (see _carrySpear), until the calls stop. */
  holdSpearInWall(heading: number, boardPlane: number | null = null): void {
    this._wallHeading = heading;
    this._wallTimer = 0.3;
    this._boardPlane = boardPlane;
  }
  // A front-rank man's wall line along the heading (see _lapBoard), null in a rear rank; how far his board has gone over from his hand to it (0 to 1); and where it was strapped on.
  private _boardPlane: number | null = null;
  private _boardLap = 0;
  private _boardRest: Vector3 | null = null;
  // The heading of the wall he stands in, shared by every man in it, and how far his spear has gone over to the wall's line (0 to 1).
  private _wallHeading = 0;
  private _wallTimer = 0;
  private _wallHold = 0;
  private _spearDir = new Vector3();
  private _spearAimRadius = 0.3;
  // Whether he stands in a rear rank, and how far his hold has gone over from the front man's to the rear man's (0 to 1).
  private _spearRear = false;
  private _spearRearHold = 0;
  // How far the bow arm is up in a shot (0 to 1): the stave is stood upright in the fist by this much (see _carryProp).
  private _bowUp = 0;
  // The stroke (see _carrySpear): where in it the man is, from SPEAR_DRAW (drawn back) through 0 (the hold) to 1 (full lunge), and how near the enemy is to being in reach, 0 to 1.
  private _spearThrust = 0;
  private _spearNear = 0;
  /**
   * A clubber's blow in the press, on his own beat of PRESS_BLOW_BEAT_MIN..MAX seconds (hashed from the wobble phase, so a press is staggered): 0 while the club is cocked,
   * then the drop onto the man in front over PRESS_BLOW_DROP of the beat, slow off the cock and fastest at the bottom, 1 held there on the head over PRESS_BLOW_HOLD,
   * then heaved back up to the cock. About a quarter of the press is dropping or landed in any frame (trailer_3_sheet_01 r2c3: the club over and down on a head).
   */
  private _pressBlow(): number {
    const h = Math.sin(this._wobblePhase * 91.7) * 43758.5453;
    const own = h - Math.floor(h);
    const beat = PRESS_BLOW_BEAT_MIN + (PRESS_BLOW_BEAT_MAX - PRESS_BLOW_BEAT_MIN) * own;
    const u = (this._time / beat + own * 3.7) % 1;
    const start = 1 - PRESS_BLOW_DROP - PRESS_BLOW_HOLD - PRESS_BLOW_BACK;
    if (u < start) return 0;
    if (u < start + PRESS_BLOW_DROP) {
      const x = (u - start) / PRESS_BLOW_DROP;
      return x * x;
    }
    if (u < start + PRESS_BLOW_DROP + PRESS_BLOW_HOLD) return 1;
    const x = (u - start - PRESS_BLOW_DROP - PRESS_BLOW_HOLD) / PRESS_BLOW_BACK;
    return 1 - x * x * (3 - 2 * x);
  }

  /** One stroke of a levelled spear on the man's own beat: a slow draw back, a lunge in an eighth of the beat, and a recovery to the hold. */
  private _thrustStroke(): number {
    const br = (this._bracePose ??= this._buildBracePose());
    const u = (this._time * br.thrustRate + br.thrustPhase) % 1;
    const ease = (x: number): number => x * x * (3 - 2 * x);
    if (u < 0.45) return SPEAR_DRAW * ease(u / 0.45);
    if (u < 0.58) return SPEAR_DRAW + (1 - SPEAR_DRAW) * ease((u - 0.45) / 0.13);
    return 1 - ease((u - 0.58) / 0.42);
  }
  private _spearAimTimer = 0;
  private _spearLevel = 0;
  private _chestRise: number | null = null;
  private _shove = 0;
  // A heavy weapon's arc in the fist, radians from straight up (negative behind, positive in front), and how far it overrides the carry; written by the heavy
  // swing and the press, zeroed every frame.
  private _clubArc = 0;
  private _clubHold = 0;
  // Per-unit shove pose so a rank in contact does not share one silhouette. Hashed from the wobble
  // phase rather than drawn fresh, so spawning consumes no extra random numbers.
  private _shovePose: { pitch: number; roll: number; stance: number; knee: number; rate: number; spread: number; elbow: number; trail: number; stride: number } | null = null;
  private _buildShovePose(): { pitch: number; roll: number; stance: number; knee: number; rate: number; spread: number; elbow: number; trail: number; stride: number } {
    const h = (n: number): number => {
      const v = Math.sin(this._wobblePhase * 12.9898 + n * 78.233) * 43758.5453;
      return v - Math.floor(v);
    };
    return {
      // A third of a rank presses upright or leaning a touch back, the rest lean in by their own amount: at 0.2-0.35 for all, every presser met the 0.6 cap and the rank folded at one angle.
      pitch: h(1) < 0.34 ? -0.08 + h(11) * 0.12 : 0.1 + h(11) * 0.25,
      roll: (h(2) - 0.5) * 0.4,
      stance: (h(3) < 0.5 ? -1 : 1) * (0.12 + h(4) * 0.15),
      knee: 0.12 + h(5) * 0.2,
      rate: 5 + h(6) * 4,
      spread: 0.15 + h(7) * 0.3,
      elbow: 0.7 + h(8) * 0.5,
      trail: 0.12 + h(9) * 0.2,
      stride: 0.6 + h(10) * 0.25, // at 0.45-0.65 a charging rank took short steps under its lean
    };
  }
  // Per-man brace behind a board, so a wall in contact is men and not one man stamped out. Each stands in one of three ways, his own: crouched low under the rim on
  // folded legs, stood tall with the board held high, or shoulder driven into it. Within that he has his own board arm, the board's own turn and tilt in his grip, his own
  // height and elevation of spear, the way his head is turned, and his own beat of shifting his weight from foot to foot. Hashed from the wobble phase like the shove pose.
  private _bracePose: ReturnType<ProceduralAnimator["_buildBracePose"]> | null = null;
  private _braceSink = 0;
  private _hipRest: number | null = null;
  private _buildBracePose() {
    const h = (n: number): number => {
      const v = Math.sin(this._wobblePhase * 12.9898 + n * 78.233) * 43758.5453;
      return v - Math.floor(v);
    };
    const pick = h(101);
    const stand = pick < 0.35
      ? { crouch: BRACE_CROUCH_DEEP - 0.28 + h(103) * 0.28, raise: -0.45 - h(104) * 0.15 }
      : pick < 0.7
        ? { crouch: 0.05 + h(103) * 0.15, raise: -0.85 - h(104) * 0.2 }
        : { crouch: 0.25 + h(103) * 0.25, raise: -0.62 - h(104) * 0.16 };
    return {
      ...stand,
      // Trunk and head (see the spec at the head of this file): his own pitch into the board, the share of it his head is carried back up by, and the pitch of his spear
      // above level when he stands in a rear rank and below it when he stands in the front one.
      pitch: BRACE_PITCH_MIN + h(102) * (BRACE_PITCH_MAX - BRACE_PITCH_MIN),
      headLevel: 0.1 + h(124) * 0.7,
      spearGrip: SPEAR_FRONT_GRIP_MIN + h(127) * (SPEAR_FRONT_GRIP_MAX - SPEAR_FRONT_GRIP_MIN),
      out: 0.15 + h(105) * 0.3,
      elbow: -0.9 - h(106) * 0.45,
      kneeBias: (h(107) - 0.5) * 0.16,
      cant: (h(108) - 0.5) * 0.24,
      look: (h(109) - 0.5) * 0.7,
      boardYaw: (h(110) - 0.5) * 0.44,
      boardTilt: (h(111) - 0.5) * 0.32,
      boardRoll: (h(112) - 0.5) * 0.4,
      spearDip: (h(113) - 0.5) * 0.14,
      spearRaise: -2.2 + (h(114) - 0.5) * 0.5,
      spearElbow: -1.2 + (h(115) - 0.5) * 0.4,
      shiftRate: 1.2 + h(116) * 1.4,
      shiftPhase: h(117) * Math.PI * 2,
      thrustRate: 0.9 + h(118) * 0.5,
      thrustPhase: h(119),
      // Drive leg: he pushes off one leg, his own. That foot is planted behind him on a straight leg and the other is stepped in under the board on a bent knee,
      // by his own length of step; a man sunk low on folded legs steps shorter. The trunk turns the lead shoulder into the board and the head is tucked behind
      // the rim or lifted to look over it.
      lead: h(120) < 0.5 ? -1 : 1,
      lunge: (BRACE_STEP_MIN + h(121) * (BRACE_STEP_MAX - BRACE_STEP_MIN)) * (1 - Math.min(0.5, stand.crouch * 0.5)),
      twist: 0.1 + h(122) * 0.4,
      tuck: -0.2 + h(123) * 0.6,
    };
  }
  private _flinchTimer = 0;
  private _squashTimer = 0;
  private _limpTarget = 0;
  private _limp = 0;
  private _landedFace = 0;
  // Per-unit crumple shape so a pile of fallen bodies does not share one pose.
  private readonly _limpPose = this._buildLimpPose();

  private _buildLimpPose() {
    // Half the bodies throw one arm up past the head, the rest fling it out wide; the other arm stays near the
    // side. Every arm lies in the plane of the torso and its elbow folds sideways within that plane, so a body
    // on its back or front rests its arms and fists on the ground instead of holding a forearm up in the air.
    const pick = Math.random();
    const overhead = pick < 0.5;
    const leftFlung = Math.floor(pick * 4) % 2 === 0;
    // A flung-wide arm is never more than a diagonal and its forearm always folds back toward the head, hard
    // half the time, the arm thrown past the head folds 40 to 90 degrees at the elbow as well, and the low arm
    // lies along the side, so no body rests as a T or with a straight arm. Derived from
    // `pick`, so the pose draws no more random numbers than before.
    const folded = Math.floor(pick * 8) % 2 === 0;
    const flungX = overhead ? -(2.95 + Math.random() * 0.4) : (Math.random() - 0.5) * 0.3;
    const flungZ = overhead ? 0.1 + Math.random() * 0.6 : folded ? 0.45 + Math.random() * 0.35 : 0.5 + Math.random() * 0.3;
    const flungElbowZ = overhead ? 0.7 + Math.random() * 0.87 : folded ? 1.3 + Math.random() * 0.6 : 1.0 + Math.random() * 0.6;
    const lowX = (Math.random() - 0.5) * 0.3;
    const lowZ = 0.05 + Math.random() * 0.2;
    // The arm at the side is crooked too: its elbow folds outward 40 to 90 degrees, so no corpse lies with a
    // straight arm. From `pick`; the draw it replaces is still taken, so the pose uses as many random numbers.
    Math.random();
    const lowElbowZ = 0.7 + (pick * 128 - Math.floor(pick * 128)) * 0.87;
    // One leg lies splayed out to the side and bent at the knee within the ground plane; the other stays straight.
    const leftSplayed = Math.floor(pick * 16) % 2 === 0;
    // The knee folds between 50 and 90 degrees, so the leg is plainly crooked and not a slightly parted straight one.
    const splayZ = 0.5 + (pick * 32 - Math.floor(pick * 32)) * 0.5;
    const splayKneeZ = 0.9 + (pick * 64 - Math.floor(pick * 64)) * 0.7;
    // That leg's knee also stands up off the ground: the thigh lifts and the shin drops back to the foot.
    const tent = 0.45 + (pick * 256 - Math.floor(pick * 256)) * 0.35;
    // Each arm swings up to 0.6 rad further out or in and the trunk twists up to 0.5 rad about the spine, so the
    // fallen do not all lie square in one prone shape. From `pick` again, so no further random numbers are drawn.
    const bit = (n: number): number => pick * n - Math.floor(pick * n) - 0.5;
    const leftSwing = bit(512) * 1.2;
    const rightSwing = bit(1024) * 1.2;
    return {
      leftFlung,
      leftSplayed,
      torsoX: Math.random() * 0.2,
      torsoY: bit(2048),
      torsoZ: (Math.random() - 0.5) * 0.7,
      neckX: (Math.random() - 0.5) * 1.1,
      leftArmX: leftFlung ? flungX : lowX,
      rightArmX: leftFlung ? lowX : flungX,
      leftArmZ: -Math.max(0.02, (leftFlung ? flungZ : lowZ) + leftSwing),
      rightArmZ: Math.max(0.02, (leftFlung ? lowZ : flungZ) + rightSwing),
      // Elbow angles are the resting angles themselves, not offsets: barely any forward fold.
      leftElbowX: -0.12,
      rightElbowX: -0.12,
      leftElbowZ: -(leftFlung ? flungElbowZ : lowElbowZ),
      rightElbowZ: leftFlung ? lowElbowZ : flungElbowZ,
      // The straight leg's thigh stays near the body's line and its knee barely folds, so it lies flat; only the
      // splayed leg tents.
      leftHipX: -0.25 + Math.random() * 0.5 - (leftSplayed ? tent : 0),
      rightHipX: -0.25 + Math.random() * 0.5 - (leftSplayed ? 0 : tent),
      leftKneeX: 0.05 + Math.random() * 0.55 + (leftSplayed ? tent * 1.6 : 0),
      rightKneeX: 0.05 + Math.random() * 0.55 + (leftSplayed ? 0 : tent * 1.6),
      leftHipZ: leftSplayed ? -splayZ : -0.05,
      rightHipZ: leftSplayed ? 0.05 : splayZ,
      leftKneeZ: leftSplayed ? splayKneeZ : 0,
      rightKneeZ: leftSplayed ? 0 : -splayKneeZ,
    };
  }

  private _airTarget = 0;
  private _air = 0;
  // Per-unit flight shape as [joint, x, y, z]: a third of the bodies jackknife at the waist, a third bow backward
  // with the arms past the head, a third sit in an L with the legs straight out. Arms stay in line with the trunk
  // while the legs scissor wide apart on knees that each give by about half a radian, so a launched body is a bent plank that forks at
  // the hips and not a four-pointed star. Hashed from the wobble phase like the shove pose, so it consumes no
  // random numbers.
  private _airPose: Array<[{ rotation: { x: number; y: number; z: number } }, number, number, number]> | null = null;
  private _buildAirPose(): Array<[{ rotation: { x: number; y: number; z: number } }, number, number, number]> {
    const h = (n: number): number => {
      const v = Math.sin(this._wobblePhase * 12.9898 + n * 78.233) * 43758.5453;
      return v - Math.floor(v);
    };
    const b = this._body;
    const twist = (h(23) - 0.5) * 2.4; // up to 1.2 rad either way about the spine, so flung bodies do not all face one way
    const roll = (h(24) < 0.5 ? -1 : 1) * (0.4 + h(50) * 0.3); // and 0.4 to 0.7 rad over to one side at the waist, so the bend shows chest-on too
    const pitch = (h(48) - 0.5) * 2.4; // and up to 1.2 rad nose-up or nose-down, so they do not all fly flat like planks
    const variant = Math.floor(h(21) * 3);
    // The pitch may not cancel a variant's own bend: a trunk left within 0.4 rad of straight on the hips is folded
    // 0.4 to 0.9 rad the way it already leaned, so every body in flight is bent at the waist and none is a plank.
    const fold = (x: number): number => (Math.abs(x) < 0.4 ? (x < 0 ? -1 : 1) * (0.4 + h(49) * 0.5) : x);
    // One arm leads the other by about 0.6 rad and each knee bends by its own 0.4 to 1.2 rad, so the two sides of a
    // body in flight never mirror each other and no leg flies straight as a plank.
    const lead = h(40) < 0.5 ? 0 : 1;
    const armGap = 0.5 + h(41) * 0.3;
    const leftArm = lead === 0 ? armGap : 0;
    const rightArm = lead === 0 ? 0 : armGap;
    const leftKnee = 0.4 + h(42) * 0.8;
    const rightKnee = 0.4 + ((h(42) + 0.35 + h(43) * 0.3) % 1) * 0.8;
    // One leg swings 0.25 to 0.6 rad ahead of or behind the other and both kick out to the side, one by 0.3 to 0.55 rad
    // and the other by half that, so the legs splay open without making a wide V.
    const hipGap = (h(44) < 0.5 ? -1 : 1) * (0.25 + h(45) * 0.35);
    const kick = 0.3 + h(47) * 0.25;
    const leftKick = -(h(46) < 0.5 ? kick : kick * 0.5);
    const rightKick = h(46) < 0.5 ? kick * 0.5 : kick;
    // The right arm flings 0.7 to 1.2 rad out from the side and the left 0.3 to 1.2, so the two rarely match, on elbows that give by half a
    // radian at most, so they splay near full stretch and do not tuck in against the trunk.
    const leftOut = 0.3 + h(51) * 0.9;
    const rightOut = 0.7 + h(52) * 0.5;
    const leftBend = -(0.1 + h(53) * 0.3 + rightArm * 0.4);
    const rightBend = -(0.1 + h(54) * 0.3 + leftArm * 0.4);
    if (variant === 0) {
      // Jackknife: folded hard at the waist, straight legs swung only a little way up toward the arms reaching for the toes
      const hip = 0.2 + h(30) * 0.3;
      return [
        [b.torso, fold(0.9 + h(25) * 0.5 + pitch), twist, roll],
        [b.neck, 0.4, 0, 0],
        [b.leftShoulder, -(1.0 + h(26) * 0.3 + leftArm), 0, -leftOut],
        [b.rightShoulder, -(1.0 + h(27) * 0.3 + rightArm), 0, rightOut],
        [b.leftElbow, leftBend, 0, 0],
        [b.rightElbow, rightBend, 0, 0],
        [b.leftHip, -hip, 0, leftKick],
        [b.rightHip, -(hip + hipGap), 0, rightKick],
        [b.leftKnee, leftKnee, 0, 0],
        [b.rightKnee, rightKnee, 0, 0],
      ];
    }
    if (variant === 1) {
      // Bow: spine bent backward, head thrown back, arms trailing straight past the head, heels kicked up behind
      const hip = 0.35 + h(32) * 0.3;
      return [
        [b.torso, fold(-(0.45 + h(25) * 0.3) + pitch), twist, roll],
        [b.neck, -0.5, 0, 0],
        [b.leftShoulder, -(2.9 + h(26) * 0.2 - leftArm), 0, -leftOut],
        [b.rightShoulder, -(2.9 + h(28) * 0.2 - rightArm), 0, rightOut],
        [b.leftElbow, leftBend, 0, 0],
        [b.rightElbow, rightBend, 0, 0],
        [b.leftHip, hip, 0, leftKick],
        [b.rightHip, hip + hipGap, 0, rightKick],
        [b.leftKnee, leftKnee, 0, 0],
        [b.rightKnee, rightKnee, 0, 0],
      ];
    }
    // Sit: thighs folded square to the trunk with the legs held out straight, arms trailing back along the sides
    const hip = 1.2 + h(25) * 0.3;
    return [
      [b.torso, fold(0.2 + h(26) * 0.3 + pitch), twist, roll],
      [b.neck, (h(27) - 0.5) * 0.6, 0, 0],
      [b.leftShoulder, 0.2 + h(28) * 0.2 + leftArm, 0, -leftOut],
      [b.rightShoulder, 0.2 + h(29) * 0.2 + rightArm, 0, rightOut],
      [b.leftElbow, leftBend, 0, 0],
      [b.rightElbow, rightBend, 0, 0],
      [b.leftHip, -hip, 0, leftKick],
      [b.rightHip, -(hip + hipGap), 0, rightKick],
      [b.leftKnee, leftKnee, 0, 0],
      [b.rightKnee, rightKnee, 0, 0],
    ];
  }

  // Pupil wobble state (googly eyes)
  private _pupilOffX = 0;
  private _pupilOffY = 0;
  private _pupilVelX = 0;
  private _pupilVelY = 0;
  private _prevNeckRotX = 0;
  private _prevNeckRotZ = 0;

  update(dt: number): void {
    this._time += dt;

    if (this._state !== AnimState.Dead) {
      this._resetPose();
    }

    this._idleSink = 0;
    this._clubHold = 0;
    this._castLift = 0;
    this._castReach = 0;
    switch (this._state) {
      case AnimState.Idle:
        this._animateIdle(dt);
        break;
      case AnimState.Walking:
        this._animateWalk(dt);
        break;
      case AnimState.Attacking:
        this._animateAttack(dt);
        break;
      case AnimState.Dead:
        this._animateDead(dt);
        break;
    }

    // Flinch overlay (additive on top of current pose)
    if (this._flinchTimer > 0) {
      this._flinchTimer -= dt;
      const intensity = Math.max(0, this._flinchTimer / 0.35);
      const b = this._body;
      // Snap torso backward and to the side
      b.torso.rotation.x -= 0.55 * intensity;
      b.torso.rotation.z += 0.3 * intensity;
      // Head whips back
      b.neck.rotation.x -= 0.65 * intensity;
      // Arms flail out
      b.leftShoulder.rotation.z -= 0.5 * intensity;
      b.rightShoulder.rotation.z += 0.5 * intensity;
    }
    // Shove overlay (additive): torso pitched into the enemy, legs split and bent, heaving;
    // between swings the arms windmill out from the shoulders instead of hanging at the sides.
    this._shoveTimer -= dt;
    this._shove += ((this._shoveTimer > 0 ? 1 : 0) - this._shove) * Math.min(1, dt * 6);
    this._spearAimTimer -= dt;
    this._spearLevel += ((this._spearAimTimer > 0 ? 1 : 0) - this._spearLevel) * Math.min(1, dt * 5);
    this._spearRearHold += ((this._spearRear ? 1 : 0) - this._spearRearHold) * Math.min(1, dt * 4);
    this._wallTimer -= dt;
    this._wallHold += ((this._wallTimer > 0 ? 1 : 0) - this._wallHold) * Math.min(1, dt * 6);
    this._boardLap += ((this._wallTimer > 0 && this._boardPlane !== null ? 1 : 0) - this._boardLap) * Math.min(1, dt * 5);
    this._spearThrust = this._spearLevel > 0.01 && this._spearShaft() ? this._thrustStroke() * this._spearLevel * this._spearNear : 0;
    this._braceSink = 0;
    if (this._shove > 0.01 && this._state !== AnimState.Dead && this.walkStyle !== "quadruped") {
      const b = this._body;
      const p = (this._shovePose ??= this._buildShovePose());
      const k = this._shove;
      const phase = (this._time + this._wobblePhase) * p.rate;
      // The walk already leans 0.55 rad; a presser still stepping in takes half the extra pitch.
      const br = this._shieldBoard() ? (this._bracePose ??= this._buildBracePose()) : null;
      if (br) {
        // A man behind a board carries the trunk at his own pitch, whatever the walk, the stand or the strike under the shove had made of it, heaving on it a little;
        // and his head is his own on top of that, carried part of the way back up and tucked or lifted. Nothing here brings two men to one angle.
        const set = k * (1 - Math.min(1, this._limp));
        b.torso.rotation.x += (br.pitch + Math.sin(phase * 0.5) * 0.06 - b.torso.rotation.x) * set;
        b.neck.rotation.x += (-br.pitch * br.headLevel + br.tuck - b.neck.rotation.x) * set;
      } else {
        b.torso.rotation.x += (p.pitch * (this._state === AnimState.Walking ? 0.5 : 1) + Math.sin(phase * 0.5) * 0.08) * k;
        // A swing pitches the torso itself; with the shove on top the lean stops at 0.6 rad, short of a fold at the waist.
        b.torso.rotation.x = Math.min(b.torso.rotation.x, 0.6);
        b.neck.rotation.x -= p.pitch * 0.6 * k;
      }
      b.torso.rotation.z += ((br ? p.roll * 0.3 + br.cant : p.roll) + Math.cos(phase * 0.35) * 0.08) * k;
      // Thighs come forward under the pitched torso and the knees give a little, so the body breaks at the waist and stays tall on its legs.
      b.leftHip.rotation.x += (p.stance - 0.15) * k;
      b.rightHip.rotation.x -= (p.stance + 0.15) * k;
      b.leftKnee.rotation.x += (p.knee + 0.05) * k;
      b.rightKnee.rotation.x += (p.knee + 0.05) * k;
      if (this._state !== AnimState.Attacking && this.defaultAttackMotion === "heavy_swing" && (this._carry ??= this._buildCarry()).weapon?.prop) {
        // A clubber in the press, stood or stepping in, does not windmill or level his weapon arm: he keeps it cocked up over his shoulder and, on his own beat,
        // brings it down onto the man in front (see _pressBlow), holds it there a moment and heaves it back up, while the free arm still claws and shoves.
        const heave = Math.sin(phase * 0.5) * 0.12;
        const blow = this._pressBlow();
        b.rightShoulder.rotation.x += (-2.5 + heave + 3.0 * blow - b.rightShoulder.rotation.x) * k;
        b.rightShoulder.rotation.z += (0.3 - 0.4 * blow - b.rightShoulder.rotation.z) * k;
        b.rightElbow.rotation.x += (-1.3 + 1.15 * blow - b.rightElbow.rotation.x) * k;
        // The trunk goes over with the blow and the head with it
        b.torso.rotation.x += 0.45 * blow * k;
        b.neck.rotation.x += 0.15 * blow * k;
        b.leftShoulder.rotation.x += (-0.9 + Math.sin(phase) * 1.1) * k;
        b.leftShoulder.rotation.z -= (p.spread + Math.cos(phase) * 0.25) * k;
        b.leftElbow.rotation.x -= (1.0 + Math.sin(phase) * 0.6) * k;
        this._clubArc = CLUB_COCK * 0.9 + heave + (CLUB_LAND - CLUB_COCK * 0.9 - heave) * blow;
        this._clubHold = Math.max(this._clubHold, k);
      } else if (this._state === AnimState.Idle) {
        b.leftShoulder.rotation.x += (-0.9 + Math.sin(phase) * 1.1) * k;
        b.rightShoulder.rotation.x += (-0.9 + Math.sin(phase + Math.PI) * 1.1) * k;
        b.leftShoulder.rotation.z -= (p.spread + Math.cos(phase) * 0.25) * k;
        b.rightShoulder.rotation.z += (p.spread + Math.cos(phase + Math.PI) * 0.25) * k;
        b.leftElbow.rotation.x -= (1.0 + Math.sin(phase) * 0.6) * k;
        b.rightElbow.rotation.x -= (1.0 + Math.sin(phase + Math.PI) * 0.6) * k;
      } else {
        // Stepping in or swinging: the elbows stay bent, so no arm is a straight rod.
        b.leftElbow.rotation.x -= (p.elbow + 0.1) * k;
        b.rightElbow.rotation.x -= (p.elbow - 0.1) * k;
      }
      if (br) {
        // Brace: whatever the walk, the swing or the flail made of the shield arm, it locks out in front of the chest, upper arm forward and forearm
        // across the body, at the man's own height and reach, and holds there while the weapon arm goes on working.
        const hold = k * (1 - Math.min(1, this._limp));
        b.leftShoulder.rotation.x += (br.raise + Math.sin(phase * 0.5) * 0.06 - b.leftShoulder.rotation.x) * hold;
        b.leftShoulder.rotation.y += (0 - b.leftShoulder.rotation.y) * hold;
        b.leftShoulder.rotation.z += (br.out - b.leftShoulder.rotation.z) * hold;
        b.leftElbow.rotation.x += (br.elbow - b.leftElbow.rotation.x) * hold;
        b.leftElbow.rotation.z += (0 - b.leftElbow.rotation.z) * hold;
        // Legs: the thighs come forward by half of what the knees fold, so the feet stay under him, and the hips come down by what that takes off the legs' height.
        // He shifts his weight from foot to foot on his own beat: the unloaded knee gives and the trunk rocks over the other.
        const shift = Math.sin(this._time * br.shiftRate + br.shiftPhase);
        b.leftHip.rotation.x -= (br.crouch * 0.5 + shift * 0.06) * hold;
        b.rightHip.rotation.x -= (br.crouch * 0.5 - shift * 0.06) * hold;
        b.leftKnee.rotation.x += (br.crouch + br.kneeBias + Math.max(0, shift) * 0.2) * hold;
        b.rightKnee.rotation.x += (br.crouch - br.kneeBias + Math.max(0, -shift) * 0.2) * hold;
        b.torso.rotation.z += shift * 0.05 * hold;
        b.neck.rotation.y += br.look * hold;
        // Drive leg (see _buildBracePose): the lead thigh comes forward with its shin left upright under the knee, the drive leg goes back straight by the seven tenths
        // of that angle that keeps both feet on the ground, and the hips come down by what the split takes off the legs.
        const lunge = br.lunge * hold;
        const leadHip = br.lead < 0 ? b.leftHip : b.rightHip;
        const leadKnee = br.lead < 0 ? b.leftKnee : b.rightKnee;
        const driveHip = br.lead < 0 ? b.rightHip : b.leftHip;
        leadHip.rotation.x -= lunge;
        leadKnee.rotation.x += lunge;
        driveHip.rotation.x += lunge * 0.7;
        b.torso.rotation.y += br.lead * br.twist * hold;
        b.neck.rotation.y -= br.lead * br.twist * 0.6 * hold;
        this._hipRest ??= b.hip.position.y;
        this._braceSink = this._hipRest * ((1 - Math.cos(br.crouch * 0.5)) + (1 - Math.cos(br.lunge)) * 0.5) * hold;
        if (this._spearShaft()) {
          // Spear arm: no windmill and no underarm poke. The fist goes up to the ear, above the shoulder, with the elbow cocked out behind, and holds the shaft there;
          // a stroke straightens the arm forward along the shaft from that hold and comes back to it, the elbow cocking further as the shaft is drawn back.
          const jab = Math.max(this._state === AnimState.Attacking ? Math.sin(Math.min(1, this._attackTimer / this._attackDuration) * Math.PI) : 0, this._spearThrust);
          // A rear man's fist is at his ear; a front man's is couched at his waist (see the spec at the head of this file)
          const front = 1 - this._spearRearHold;
          b.rightShoulder.rotation.x += (br.spearRaise + (SPEAR_COUCH_RAISE - br.spearRaise) * front + 0.5 * jab + Math.sin(phase * 0.5 + 1) * 0.05 - b.rightShoulder.rotation.x) * hold;
          b.rightShoulder.rotation.y += (0 - b.rightShoulder.rotation.y) * hold;
          b.rightShoulder.rotation.z += (0.2 - b.rightShoulder.rotation.z) * hold;
          b.rightElbow.rotation.x += (br.spearElbow + (SPEAR_COUCH_ELBOW - br.spearElbow) * front + 0.9 * jab + 0.8 * Math.min(0, this._spearThrust) - b.rightElbow.rotation.x) * hold;
          b.rightElbow.rotation.z += (0 - b.rightElbow.rotation.z) * hold;
        }
      }
    }
    if (this._hipRest !== null) this._body.hip.position.y = this._hipRest - this._braceSink - this._idleSink;
    // Spear carry: a shield man on the march does not pump his spear arm. It hangs at his side with the elbow a little bent, the shaft stood up in the fist.
    if (this._state === AnimState.Walking && this._spearShaft()) {
      const b = this._body;
      const carry = (1 - Math.min(1, this._shove)) * (1 - Math.min(1, this._limp));
      b.rightShoulder.rotation.x += (Math.sin((this._time + this._wobblePhase) * 4) * 0.06 - b.rightShoulder.rotation.x) * carry;
      b.rightShoulder.rotation.z += (0.25 - b.rightShoulder.rotation.z) * carry;
      b.rightElbow.rotation.x += (-0.5 - b.rightElbow.rotation.x) * carry;
    }
    // Prop carry: an arm with a weapon or a board in its hand is not an empty arm on the march. It leaves the walk's pendulum for a hold of the man's own, weapon hand up in front
    // of the hip and board arm folded across the body, and the load drops on each footfall and is heaved back up between them, twice a stride, on his own beat.
    if (this._state === AnimState.Walking && this.walkStyle !== "quadruped") {
      const b = this._body;
      const c = (this._carry ??= this._buildCarry());
      const carry = (1 - Math.min(1, this._shove)) * (1 - Math.min(1, this._limp));
      const bob = Math.abs(Math.sin((this._time + this._wobblePhase) * (this._gait ??= this._buildGait()).rate + c.beat)) - 0.5;
      this._carryDip = bob * c.bob;
      // A caster marches with his rod in the hold he stands with
      const load = c.weapon ?? (c.ready?.cast ? c.ready : null);
      if (load) {
        b.rightShoulder.rotation.x += (load.raise + bob * c.bob - b.rightShoulder.rotation.x * 0.8) * carry;
        b.rightShoulder.rotation.z += (load.out - b.rightShoulder.rotation.z) * carry;
        b.rightElbow.rotation.x += (load.elbow - bob * c.bob * 1.5 - b.rightElbow.rotation.x) * carry;
      }
      if (c.board) {
        b.leftShoulder.rotation.x += (c.board.raise - bob * c.bob * 0.7 - b.leftShoulder.rotation.x * 0.8) * carry;
        b.leftShoulder.rotation.z += (c.board.out - b.leftShoulder.rotation.z) * carry;
        b.leftElbow.rotation.x += (c.board.elbow + bob * c.bob - b.leftElbow.rotation.x) * carry;
      }
    }
    // Closing on a man with a heavy weapon, out of contact: whatever the carry or the stand made of the weapon arm, it comes up to the cocked hold over the
    // shoulder that the press keeps (see _animateHeavySwing), so men stepping into a fight carry their clubs raised and not slanted or trailed.
    this._readyTimer -= dt;
    this._strikeTimer -= dt;
    this._ready += ((this._readyTimer > 0 ? 1 : 0) - this._ready) * Math.min(1, dt * 6);
    const cocked = this._ready * (1 - Math.min(1, this._shove)) * (1 - Math.min(1, this._limp));
    if (cocked > 0.01 && this._state !== AnimState.Attacking && this._state !== AnimState.Dead && this.walkStyle !== "quadruped" && this.defaultAttackMotion === "heavy_swing" && (this._carry ??= this._buildCarry()).weapon?.prop) {
      const b = this._body;
      const heave = Math.sin((this._time + this._wobblePhase) * 3) * 0.1;
      // Within striking distance he brings it down on his own beat, as a man in the press does
      const blow = this._strikeTimer > 0 ? this._pressBlow() : 0;
      b.rightShoulder.rotation.x += (-2.5 + heave + 3.0 * blow - b.rightShoulder.rotation.x) * cocked;
      b.rightShoulder.rotation.z += (0.3 - 0.4 * blow - b.rightShoulder.rotation.z) * cocked;
      b.rightElbow.rotation.x += (-1.3 + 1.15 * blow - b.rightElbow.rotation.x) * cocked;
      b.torso.rotation.x += 0.45 * blow * cocked;
      this._clubArc = this._clubHold > 0.01 ? this._clubArc : CLUB_COCK * 0.9 + heave + (CLUB_LAND - CLUB_COCK * 0.9 - heave) * blow;
      this._clubHold = Math.max(this._clubHold, cocked);
    }
    // Limp overlay (additive): bend spine, elbows and knees while toppled or downed
    this._limp += (this._limpTarget - this._limp) * Math.min(1, dt * 9);
    if (this._limp > 0.01 && this._state !== AnimState.Dead && this.walkStyle !== "quadruped") {
      const b = this._body;
      const p = this._limpPose;
      const k = this._limp;
      b.torso.rotation.x += p.torsoX * k;
      b.torso.rotation.y += p.torsoY * k;
      b.torso.rotation.z += p.torsoZ * k;
      b.neck.rotation.x += p.neckX * k;
      b.leftShoulder.rotation.x += p.leftArmX * k;
      b.rightShoulder.rotation.x += p.rightArmX * k;
      b.leftShoulder.rotation.z += p.leftArmZ * k;
      b.rightShoulder.rotation.z += p.rightArmZ * k;
      // Elbows blend to their resting fold rather than adding to the idle or walk bend already there.
      b.leftElbow.rotation.x += (p.leftElbowX - b.leftElbow.rotation.x) * k;
      b.rightElbow.rotation.x += (p.rightElbowX - b.rightElbow.rotation.x) * k;
      b.leftElbow.rotation.z += p.leftElbowZ * k;
      b.rightElbow.rotation.z += p.rightElbowZ * k;
      b.leftHip.rotation.x += p.leftHipX * k;
      b.rightHip.rotation.x += p.rightHipX * k;
      b.leftKnee.rotation.x += p.leftKneeX * k;
      b.rightKnee.rotation.x += p.rightKneeX * k;
    }
    // Air overlay: a limp body in flight blends from the crumple to its own flight shape, and back on landing
    this._air += (this._airTarget - this._air) * Math.min(1, dt * 9);
    if (this._air * this._limp > 0.01 && this._state !== AnimState.Dead && this.walkStyle !== "quadruped") {
      const a = this._air * Math.min(1, this._limp);
      for (const [joint, x, y, z] of (this._airPose ??= this._buildAirPose())) {
        joint.rotation.x += (x - joint.rotation.x) * a;
        joint.rotation.y += (y - joint.rotation.y) * a;
        joint.rotation.z += (z - joint.rotation.z) * a;
      }
      this._flailInAir(a);
    }
    // Waist break (additive): the legs carry the body's lean while the torso bends part-way back against it and
    // the head hangs the way the body is going, so a pressed, running or toppling body is an S, not one plank.
    if (this._state !== AnimState.Dead && this.walkStyle !== "quadruped") {
      const b = this._body;
      // A limp body keeps half the counter-bend, so its crumple still folds it forward at the waist.
      const k = 1 - 0.5 * Math.min(1, this._limp);
      const leanX = Math.max(-0.4, Math.min(0.4, b.root.rotation.x));
      const leanZ = Math.max(-0.4, Math.min(0.4, b.root.rotation.z));
      b.torso.rotation.x -= leanX * 0.8 * k;
      b.torso.rotation.z -= leanZ * 0.8 * k;
      b.neck.rotation.x += leanX * 0.6;
      b.neck.rotation.z += leanZ * 0.6;
    }
    // Squash-and-stretch on hit
    if (this._squashTimer > 0) {
      this._squashTimer -= dt;
      const t = Math.max(0, this._squashTimer / 0.15);
      const squash = Math.sin(t * Math.PI);
      const b = this._body;
      b.torso.scaling.y = 1 - 0.15 * squash;
      b.torso.scaling.x = 1 + 0.08 * squash;
      b.torso.scaling.z = 1 + 0.08 * squash;
    } else if (this._body.torso.scaling.y !== 1) {
      this._body.torso.scaling.setAll(1);
    }

    this._squareShield();
    this._carrySpear();
    this._carryProp(dt);

    // ─── Googly-eye pupil wobble ───
    this._updatePupilWobble(dt);
  }

  // What each arm is carrying on the march and how this man holds it. A weapon is anything in the right hand but the mitt itself; an aimed bow and a wall carrier's upright
  // spear already have their own holds. Looked up on first use, like the board, and hashed from the wobble phase like the gait.
  // The weapon is carried in one of four attitudes, the man's own: shouldered (hand up at the collar, the head of it back over the shoulder), upright (hand in front of the
  // chest, the weapon stood up), across the chest (hand at the belt, the weapon slanted up to the other shoulder) or trailed (arm hung, the weapon low and behind him).
  // `tip` is where the weapon points in that attitude, in the body's own frame: x out to the weapon side, y up, z ahead.
  // A bowman has no carry. Standing, he has a ready hold instead, one of three and his own: at the port (the bow slanted across the chest, both hands on it), stood up in
  // front of him at half arm with the other hand at the string, or held low across the hips. With it goes his stance: feet staggered fore and aft by `stagger` on knees
  // giving by `give`, and the body turned `yaw` off the line to the enemy with the head left looking down it. `spin` turns a bow about its own length so the belly faces away
  // from him, and `seat` is where its middle sits from the fist, in the weapon's own frame.
  // A caster (an orbed staff or a bolt in the hand) has a ready hold too, `cast`, and keeps it standing, on the march and as the place his cast starts from and comes back to.
  // The staff is stood on the ground beside him or out in front and leant on, or cradled across the chest; the bolt is cocked by the head, held up overhead or low at the
  // side; the other hand is up in a gesture, on the hip or across on the shaft. He keeps his own stance under it, with more of his weight on the one hip. `plant` is half
  // the length of a staff that stands on the ground: the fist slides along it until its butt is down.
  private _carry: {
    weapon: { raise: number; out: number; elbow: number; tip: Vector3; prop: CarriedProp | null } | null;
    ready: { raise: number; out: number; elbow: number; tip: Vector3; prop: CarriedProp | null; left: { raise: number; out: number; elbow: number }; yaw: number; stagger: number; give: number; cast?: boolean } | null;
    board: { raise: number; out: number; elbow: number } | null; bob: number; beat: number;
  } | null = null;
  private _carryTurn = 0;
  private _carryDip = 0;
  // How far a cast has the staff or bolt off its hold: `_castLift` takes a planted staff off the ground, `_castReach` tips its head back (negative) and then at the enemy.
  private _castLift = 0;
  private _castReach = 0;
  /** True for a body that stands and casts from its own two-handed hold, so nothing outside should spread its arms for it. */
  get castsFromHold(): boolean {
    return (this._carry ??= this._buildCarry()).ready?.cast === true;
  }
  private _buildCarry(): NonNullable<ProceduralAnimator["_carry"]> {
    const h = (n: number): number => {
      const v = Math.sin(this._wobblePhase * 12.9898 + n * 78.233) * 43758.5453;
      return v - Math.floor(v);
    };
    // A caster's rod: a staff with an orb on it (a plain staff is a striking weapon) or a bolt.
    const rod = this.locomotionBias === "aimed" ? undefined
      : this._body.rightHand.getChildren().find((n): n is TransformNode => n.name === "bolt" || (n.name === "staff" && n.getChildren().some((c) => c.name === "orb")));
    const held = this.locomotionBias !== "aimed" && !rod && !this._spearShaft() && this._body.rightHand.getChildren().some((n) => !/HandM$/.test(n.name));
    // A club, a sword or a hafted head turns in the fist to the attitude; anything else only rides the arm.
    const node = this._body.rightHand.getChildren().find((n): n is TransformNode => /^(club|blade|gsblade|katana|handle|pickaxeHandle)$/.test(n.name));
    const prop = node ? { node, rest: Quaternion.FromEulerAngles(node.rotation.x, node.rotation.y, node.rotation.z), grip: node.position.clone() } : null;
    const side = Math.sign(this._body.rightShoulder.position.x) || 1;
    const lean = (x: number, y: number, z: number): Vector3 => new Vector3((x + (h(93) - 0.5) * 0.3) * side, y + (h(94) - 0.5) * 0.3, z + (h(95) - 0.5) * 0.3).normalize();
    const pick = h(92);
    const attitude = pick < 0.3
      ? { raise: -0.9 - h(81) * 0.3, out: 0.15 + h(82) * 0.2, elbow: -1.9 - h(83) * 0.3, tip: lean(0.25, 0.45, -0.85) }
      : pick < 0.55
        ? { raise: -0.5 - h(81) * 0.3, out: 0.2 + h(82) * 0.2, elbow: -1.2 - h(83) * 0.3, tip: lean(0.1, 1, 0.1) }
        : pick < 0.8
          ? { raise: -0.45 - h(81) * 0.25, out: 0.02 + h(82) * 0.1, elbow: -1.4 - h(83) * 0.3, tip: lean(-0.8, 0.55, 0.2) }
          : { raise: 0.3 + h(81) * 0.2, out: 0.15 + h(82) * 0.15, elbow: -0.15 - h(83) * 0.2, tip: lean(0.2, -0.4, -0.9) };
    const bow = this._body.rightHand.getChildren().find((n): n is TransformNode => n.name === "bow");
    const hang = bow ? Quaternion.FromEulerAngles(bow.rotation.x, bow.rotation.y, bow.rotation.z) : null;
    const stave = bow && hang ? { node: bow, rest: hang, grip: bow.position.clone(), spin: Quaternion.RotationYawPitchRoll(Math.PI, 0, 0), seat: new Vector3(0, 0, bow.position.length() * 0.3) } : null;
    const stand = h(96);
    const hold = stand < 0.38
      ? { raise: -0.5 - h(81) * 0.2, out: -0.12 - h(82) * 0.12, elbow: -1.45 - h(83) * 0.3, tip: lean(-0.55, 0.8, 0.15), left: { raise: -0.75 - h(97) * 0.2, out: -0.3 - h(98) * 0.15, elbow: -1.15 - h(99) * 0.3 } }
      : stand < 0.72
        ? { raise: -0.85 - h(81) * 0.25, out: 0.02 + h(82) * 0.12, elbow: -0.35 - h(83) * 0.25, tip: lean(0.05, 1, 0.2), left: { raise: -0.65 - h(97) * 0.2, out: -0.35 - h(98) * 0.15, elbow: -1.5 - h(99) * 0.3 } }
        : { raise: -0.1 - h(81) * 0.2, out: 0.05 + h(82) * 0.12, elbow: -0.75 - h(83) * 0.3, tip: lean(-0.75, 0.5, 0.3), left: { raise: -0.35 - h(97) * 0.2, out: -0.2 - h(98) * 0.15, elbow: -0.95 - h(99) * 0.3 } };
    const armed = this.locomotionBias === "aimed" && this._body.rightHand.getChildren().some((n) => !/HandM$/.test(n.name));
    const staff = rod?.name === "staff";
    const rodHold = !rod ? null : staff
      ? stand < 0.45
        ? { raise: -0.7 - h(81) * 0.2, out: 0.3 + h(82) * 0.15, elbow: -1.0 - h(83) * 0.3, tip: lean(0.12, 1.6, 0.05), left: { raise: -1.3 - h(97) * 0.3, out: 0.35 + h(98) * 0.2, elbow: -1.3 - h(99) * 0.3 }, plant: true }
        : stand < 0.75
          ? { raise: -1.05 - h(81) * 0.2, out: 0.1 + h(82) * 0.1, elbow: -0.45 - h(83) * 0.25, tip: lean(0, 1.6, -0.25), left: { raise: 0.3 + h(97) * 0.2, out: 0.5 + h(98) * 0.2, elbow: -1.5 - h(99) * 0.4 }, plant: true }
          : { raise: -0.45 - h(81) * 0.2, out: -0.05 - h(82) * 0.1, elbow: -1.5 - h(83) * 0.3, tip: lean(-0.45, 0.85, 0.1), left: { raise: -0.7 - h(97) * 0.2, out: -0.3 - h(98) * 0.15, elbow: -1.2 - h(99) * 0.3 }, plant: false }
      : stand < 0.4
        ? { raise: -2.3 - h(81) * 0.3, out: 0.35 + h(82) * 0.15, elbow: -1.5 - h(83) * 0.3, tip: lean(0.05, 0.45, 0.9), left: { raise: -1.2 - h(97) * 0.3, out: 0.1 + h(98) * 0.2, elbow: -0.3 - h(99) * 0.3 }, plant: false }
        : stand < 0.7
          ? { raise: -2.8 - h(81) * 0.2, out: 0.3 + h(82) * 0.15, elbow: -0.5 - h(83) * 0.3, tip: lean(0, 1, 0.25), left: { raise: -1.35 - h(97) * 0.3, out: 0.15 + h(98) * 0.2, elbow: -0.3 - h(99) * 0.3 }, plant: false }
          : { raise: -0.3 - h(81) * 0.2, out: 0.25 + h(82) * 0.15, elbow: -0.9 - h(83) * 0.3, tip: lean(0.1, 0.25, 0.95), left: { raise: -1.4 - h(97) * 0.3, out: 0.4 + h(98) * 0.2, elbow: -1.2 - h(99) * 0.3 }, plant: false };
    const rodProp = rod && rodHold ? {
      node: rod, rest: Quaternion.FromEulerAngles(rod.rotation.x, rod.rotation.y, rod.rotation.z), grip: rod.position.clone(),
      plant: rodHold.plant ? (rod as Mesh).getBoundingInfo().boundingBox.extendSize.y * rod.scaling.y : undefined,
    } : null;
    return {
      weapon: held ? { ...attitude, prop } : null,
      ready: armed ? { ...hold, prop: stave, yaw: 0.6 + h(89) * 0.35, stagger: 0.4 + h(90) * 0.2, give: 0.1 + h(91) * 0.16 }
        : rodHold ? { ...rodHold, prop: rodProp, yaw: 0.1 + h(89) * 0.25, stagger: 0, give: 0, cast: true } : null,
      board: this._shieldBoard() ? { raise: -0.3 - h(85) * 0.4, out: -0.15 + h(86) * 0.3, elbow: -0.8 - h(87) * 0.5 } : null,
      bob: 0.08 + h(84) * 0.1,
      beat: h(88) * Math.PI,
    };
  }


  // The board strapped to the shield hand, if this body carries one big enough to stand behind (a buckler is not). Looked up on first use: props go on after the animator is made.
  private _shield: TransformNode | null | undefined = undefined;
  private _shieldBoard(): TransformNode | null {
    if (this._shield === undefined) {
      this._shield = this._body.leftHand.getChildren().find((n): n is TransformNode => /shield$/.test(n.name)) ?? null;
    }
    return this._shield;
  }

  /**
   * In contact the shield stops riding the hand: it turns in the grip until it stands upright with its face square to the way the body is heading,
   * whatever the arm, the torso and the body's lean are doing under it, so a rank of them is one wall of boards and not boards pointing every way.
   * Runs after every pose overlay has written the joints; out of contact, limp or dead, the board goes back to hanging from the hand.
   */
  private _squareShield(): void {
    const shield = this._shieldBoard();
    if (!shield) return;
    const up = this._state === AnimState.Dead ? 0 : 1 - Math.min(1, this._limp);
    // A front-rank man in a wall holds his board on the wall's plane from the moment he is slotted, closing or in contact, not only while he shoves
    const lap = this._boardLap * up;
    const k = Math.max(this._shove * up, lap);
    const rest = (this._boardRest ??= shield.position.clone());
    if (k <= 0.01) {
      if (shield.rotationQuaternion) {
        shield.rotationQuaternion = null;
        shield.position.copyFrom(rest);
      }
      return;
    }
    const hand = this._body.leftHand;
    hand.computeWorldMatrix(true);
    // Square to the wall's heading, give or take the man's own turn, tilt and twist of it in his grip
    const br = (this._bracePose ??= this._buildBracePose());
    // ...and of the shoulders behind it: it turns with the lead shoulder and leans with the trunk
    const held = Quaternion.RotationYawPitchRoll(this._body.root.rotation.y + br.boardYaw + br.lead * br.twist * 0.7, br.boardTilt + br.pitch * 0.5, br.boardRoll);
    let world = held;
    if (lap > 0.01) world = Quaternion.Slerp(held, this._lapBoard(shield, hand, rest, br.boardRoll, lap), lap);
    else shield.position.copyFrom(rest);
    const square = Quaternion.Inverse(hand.absoluteRotationQuaternion).multiply(world);
    shield.rotationQuaternion = Quaternion.Slerp(Quaternion.Identity(), square, Math.min(1, k * 1.5));
  }

  /**
   * A front-rank board in a wall does not stand where his hand happens to be: it stands on the wall's plane, BOARD_PLANE_REACH ahead of the rank's line, on his own
   * line across it and at his own height, upright and turned BOARD_LAP off square to the wall the same way as every other board in it. Boards about 0.8 m across on slots
   * 0.54 apart, all turned one way, lap rim over rim: each board's one rim stands in front of its neighbour's, into one scaled surface (tabs_screenshot_06). Moves the board
   * there by `lap` and returns the world attitude it is turned to.
   */
  private _lapBoard(shield: TransformNode, hand: TransformNode, rest: Vector3, roll: number, lap: number): Quaternion {
    const heading = this._wallHeading;
    const fx = Math.sin(heading);
    const fz = Math.cos(heading);
    const strapped = Vector3.TransformCoordinates(rest, hand.getWorldMatrix());
    const root = this._body.root.absolutePosition;
    const scale = this._body.root.absoluteScaling.y || 1;
    // Out along the heading to the wall's plane from where the board is held, so its height and its place across the wall stay his own; and a hand's width toward his middle.
    // Pushed off the line, back or through, he keeps it there as far as his arm will carry it, BOARD_PLANE_MAX_OUT either side of where he holds it
    const out = Math.max(-BOARD_PLANE_MAX_OUT * scale, Math.min(BOARD_PLANE_MAX_OUT * scale, (this._boardPlane ?? 0) + BOARD_PLANE_REACH * scale - (strapped.x * fx + strapped.z * fz)));
    const across = (root.z * fx - root.x * fz) - (strapped.z * fx - strapped.x * fz);
    const target = new Vector3(strapped.x + fx * out - fz * across * 0.6, strapped.y, strapped.z + fz * out + fx * across * 0.6);
    Vector3.LerpToRef(strapped, target, lap, target);
    const local = Vector3.TransformCoordinates(target, Matrix.Invert(hand.getWorldMatrix()));
    shield.position.copyFrom(local);
    return Quaternion.RotationYawPitchRoll(heading + BOARD_LAP, 0.04, roll * 0.5);
  }

  /**
   * On the march the weapon does not ride the hand at the one angle it was strapped on with: it turns in the fist to the man's own carry attitude, whatever the arm is
   * doing under it, so a line of clubs is clubs on shoulders, stood up, slanted across chests and trailed, and not one club repeated level and parallel. The weapon's
   * middle sits as far along it from the fist as it was strapped on, and its head dips with the load's bob on each footfall. In contact, in a swing, limp or dead it
   * eases back to hanging from the hand as it was built.
   */
  private _carryProp(dt: number): void {
    const ready = this._carry?.ready;
    const weapon = this._carry?.weapon ?? ready;
    if (!weapon?.prop) return;
    const { node, rest, grip, spin, seat, plant } = weapon.prop;
    // A caster's rod stays in its hold on the march and through the cast. A bow leaves its ready hold to be shot, but not the fist's keeping: while the bow arm is up it is stood upright.
    const shooting = weapon === ready && ready?.cast !== true && this._state === AnimState.Attacking && this._attackMotion === "bow_draw_release" ? this._bowUp : 0;
    const kept = this._state === AnimState.Idle || (this._state === AnimState.Walking && weapon !== ready) || (ready?.cast === true && this._state !== AnimState.Dead) || shooting > 0;
    const club = weapon === this._carry?.weapon && this._state !== AnimState.Dead ? this._clubHold * (1 - Math.min(1, this._limp)) : 0;
    const marching = Math.max(club, kept ? (1 - Math.min(1, this._shove)) * (1 - Math.min(1, this._limp)) : 0);
    this._carryTurn = this._state === AnimState.Dead ? 0 : this._carryTurn + (marching - this._carryTurn) * Math.min(1, dt * 10);
    // A blow does not wait on the carry's easing: the head is on its arc from the first frame of the swing
    if (club > this._carryTurn) this._carryTurn = club;
    const k = this._carryTurn;
    if (k <= 0.01) {
      if (node.rotationQuaternion) {
        node.rotationQuaternion = null;
        node.position.copyFrom(grip);
      }
      return;
    }
    const hand = this._body.rightHand;
    hand.computeWorldMatrix(true);
    const tip = new Vector3(weapon.tip.x, weapon.tip.y - this._carryDip * 1.5, weapon.tip.z + this._castReach).normalize();
    // Swinging or cocked: the head of the weapon is on its arc over the man, a touch out to his weapon side
    if (club > 0.01) Vector3.LerpToRef(tip, new Vector3(0.12 * (Math.sign(this._body.rightShoulder.position.x) || 1), Math.cos(this._clubArc), Math.sin(this._clubArc)), Math.min(1, club), tip).normalize();
    // Shooting: upright in the fist, canted a little toward the mark
    if (shooting > 0) Vector3.LerpToRef(tip, new Vector3(0, 1, 0.12), shooting, tip).normalize();
    const attitude = Quaternion.RotationYawPitchRoll(this._body.root.rotation.y, 0, 0).multiply(Quaternion.FromUnitVectorsToRef(Vector3.UpReadOnly, tip, new Quaternion()));
    const turn = Quaternion.Slerp(rest, Quaternion.Inverse(hand.absoluteRotationQuaternion).multiply(spin ? attitude.multiply(spin) : attitude), k);
    node.rotationQuaternion = turn;
    const held = seat ? seat.clone() : new Vector3(0, grip.length(), 0);
    if (plant) {
      // Stood on the ground: the staff's middle sits as far above the fist as puts its butt at his feet, short of the fist running off either end of it
      const fist = (hand.absolutePosition.y - this._body.root.absolutePosition.y) / Math.max(0.001, hand.absoluteScaling.y);
      const stood = Math.max(-plant * 0.7, Math.min(plant * 0.7, plant - fist));
      held.y += (stood - held.y) * (1 - this._castLift);
    }
    held.rotateByQuaternionToRef(turn, held);
    Vector3.LerpToRef(grip, held, k, node.position);
  }

  // The spear in a shield man's weapon hand, with the turn and the offset it was strapped on with. Looked up on first use, like the board.
  private _spear: { shaft: TransformNode; rest: Quaternion; grip: Vector3 } | null | undefined = undefined;
  private _spearShaft(): { shaft: TransformNode; rest: Quaternion; grip: Vector3 } | null {
    if (this._spear === undefined) {
      const shaft = this._shieldBoard() ? this._body.rightHand.getChildren().find((n): n is TransformNode => /shaft$/.test(n.name)) : undefined;
      this._spear = shaft ? { shaft, rest: Quaternion.FromEulerAngles(shaft.rotation.x, shaft.rotation.y, shaft.rotation.z), grip: shaft.position.clone() } : null;
    }
    return this._spear;
  }

  /**
   * A shield man's spear does not ride his hand any more than his board does: it turns in the fist to his carry, whatever the arm is doing (see the spec at the head of this file).
   * On the march out of a wall it stands upright, point to the sky. Slotted into a wall, or shoving, it goes to the hold: SPEAR_WALL_UP above level on the wall's heading, one
   * line for the whole wall, front rank (couched near the butt) and rear alike. He works it in strokes on his own beat, the shaft running through the fist along that line. Limp or dead, the spear goes back to hanging from the hand.
   */
  private _carrySpear(): void {
    const spear = this._spearShaft();
    if (!spear) return;
    const { shaft, rest, grip } = spear;
    const k = this._state === AnimState.Dead ? 0 : 1 - Math.min(1, this._limp);
    if (k <= 0.01) {
      if (shaft.rotationQuaternion) {
        shaft.rotationQuaternion = null;
        shaft.position.copyFrom(grip);
      }
      return;
    }
    const hand = this._body.rightHand;
    hand.computeWorldMatrix(true);
    // Shoving with no man handed to him he still brings it to his hold, and standing in a wall he holds it there from the moment he is slotted.
    const level = Math.max(this._spearLevel, Math.min(1, this._shove * 1.5), this._wallHold);
    const root = this._body.root;
    const br = (this._bracePose ??= this._buildBracePose());
    const handScale = Math.max(0.001, hand.absoluteScaling.y);
    // The shaft from the fist to its point and from the fist to its butt, as it was strapped on, in the hand's own measure
    const tip = shaft.getChildMeshes(true)[0];
    const aheadOfFist = grip.length() + (tip ? tip.position.y + tip.getBoundingInfo().boundingBox.maximum.y : 0) * shaft.scaling.y;
    const behindFist = (shaft as Mesh).getBoundingInfo().boundingBox.maximum.y * shaft.scaling.y - grip.length();
    this._spearNear = 0;
    // A front man takes the couched grip near the butt: the shaft runs forward through the fist by what that takes
    const toGrip = ((aheadOfFist + behindFist) * (1 - br.spearGrip) - aheadOfFist) * (1 - this._spearRearHold) * level;
    // The stroke's run through the fist, in the hand's measure
    const run = this._spearThrust * SPEAR_LUNGE / handScale;
    if (this._spearAimTimer > 0) {
      // In reach, or a stride and a half short of it: only then does he strike
      const from = hand.absolutePosition;
      const front = Math.hypot(this._spearAim.x - from.x, this._spearAim.z - from.z) - this._spearAimRadius;
      this._spearNear = Math.max(0, Math.min(1, aheadOfFist * handScale + SPEAR_LUNGE + 1.5 - front));
    }
    // The shaft's line in the world: on the march upright, a touch forward; at the hold SPEAR_WALL_UP above level on the wall's heading, not his body's, so every shaft in
    // the wall is parallel to every other, front rank and rear, and the stroke slides along it. No roll and no pitch of his own.
    const ownYaw = root.rotation.y;
    const yaw = ownYaw + Math.atan2(Math.sin(this._wallHeading - ownYaw), Math.cos(this._wallHeading - ownYaw)) * this._wallHold;
    const up = Math.PI / 2 - 0.06 + (SPEAR_WALL_UP - Math.PI / 2 + 0.06) * level;
    const d = this._spearDir.set(Math.sin(yaw) * Math.cos(up), Math.sin(up), Math.cos(yaw) * Math.cos(up));
    // Set directly through the fist's whole world matrix: the trunk's on-hit squash scales it unevenly and shears the arm, and a rotation composed in the fist's frame
    // would come out up to 0.4 rad off the line in the world.
    const along = Vector3.TransformNormal(d, Matrix.Invert(hand.getWorldMatrix())).normalize();
    const turn = Quaternion.Slerp(rest, Quaternion.FromUnitVectorsToRef(Vector3.Up(), along, new Quaternion()), k);
    shaft.rotationQuaternion = turn;
    // The shaft's middle sits as far up the shaft from the fist as it was strapped on, and runs through the fist with the stroke.
    const held = new Vector3(0, grip.length() + toGrip + run, 0);
    held.rotateByQuaternionToRef(turn, held);
    Vector3.LerpToRef(grip, held, k, shaft.position);
  }

  private _resetPose(): void {
    for (const joint of this._body.allJoints) {
      joint.rotation.setAll(0);
    }
    this._body.torso.scaling.setAll(1);
  }

  private _updatePupilWobble(dt: number): void {
    const b = this._body;
    if (!b.leftPupil || !b.rightPupil) return;

    const neckRotX = b.neck.rotation.x;
    const neckRotZ = b.neck.rotation.z;

    // Head angular velocity drives pupil inertia (pupils lag behind)
    const angVelX = (neckRotX - this._prevNeckRotX) / Math.max(dt, 0.001);
    const angVelZ = (neckRotZ - this._prevNeckRotZ) / Math.max(dt, 0.001);
    this._prevNeckRotX = neckRotX;
    this._prevNeckRotZ = neckRotZ;

    // Impulse: pupils drift opposite to head rotation
    this._pupilVelX += -angVelZ * 0.012;
    this._pupilVelY += -angVelX * 0.012;

    // Spring back to center
    const spring = 18;
    const damping = 6;
    this._pupilVelX += (-spring * this._pupilOffX - damping * this._pupilVelX) * dt;
    this._pupilVelY += (-spring * this._pupilOffY - damping * this._pupilVelY) * dt;

    this._pupilOffX += this._pupilVelX * dt;
    this._pupilOffY += this._pupilVelY * dt;

    // Clamp to the white of the eye disc
    const maxOff = b.metrics.pupilTravel ?? 0.025 * (b.metrics.overallHeight / 1.4);
    const dist = Math.sqrt(this._pupilOffX * this._pupilOffX + this._pupilOffY * this._pupilOffY);
    if (dist > maxOff) {
      const ratio = maxOff / dist;
      this._pupilOffX *= ratio;
      this._pupilOffY *= ratio;
    }

    // On death, drift pupils outward for "knocked out" look
    if (this._state === AnimState.Dead) {
      const drift = 0.6;
      this._pupilOffX += (-maxOff * drift - this._pupilOffX) * dt * 2;
      this._pupilOffY += (maxOff * drift - this._pupilOffY) * dt * 2;
    }

    b.leftPupil.position.x = this._pupilOffX;
    b.leftPupil.position.y = this._pupilOffY;
    b.rightPupil.position.x = this._pupilOffX;
    b.rightPupil.position.y = this._pupilOffY;
  }

  private _animateIdle(_dt: number): void {
    if (this.walkStyle === "quadruped") {
      this._animateIdleQuadruped();
      return;
    }
    this._animateIdleHumanoid();
  }

  // Per-unit standing rest. A man does not stand to attention: he takes one of three stances of his own (hip-shot on one straight leg with a hand at the hip, sunk on both
  // bent knees with the hips let down and the free hand out in front, or at ease on easy knees with the free arm hung back), and on top of it his lean, which leg is the free one,
  // where the head is turned, and for an arm with nothing to hold its hang off the ribs and the reach, pace and phase of its swing. Hashed from the wobble phase like the shove pose, so it consumes no random numbers.
  private _idlePose: {
    lean: number; side: number; stride: number; tilt: number; turn: number; crouch: number; chin: number; cock: number;
    off: { raise: number; out: number; elbow: number };
    arms: Array<{ out: number; elbow: number; swing: number; rate: number; phase: number }>;
  } | null = null;
  private _idleSink = 0;
  private _buildIdlePose(): NonNullable<ProceduralAnimator["_idlePose"]> {
    const h = (n: number): number => {
      const v = Math.sin(this._wobblePhase * 12.9898 + n * 78.233) * 43758.5453;
      return v - Math.floor(v);
    };
    const arm = (n: number) => ({ out: 0.08 + h(n) * 0.1, elbow: 0.4 + h(n + 1) * 0.4, swing: 0.14 + h(n + 2) * 0.18, rate: 0.9 + h(n + 3) * 0.7, phase: h(n + 4) * Math.PI * 2 });
    const pick = h(121);
    const stance = pick < 0.35
      ? { tilt: 0.17 + h(43) * 0.1, stride: 0.24 + h(46) * 0.14, crouch: 0.02 + h(122) * 0.08, chin: 0.05, cock: 0.14 + h(126) * 0.1, off: { raise: 0.3 + h(123) * 0.2, out: 0.5 + h(124) * 0.2, elbow: -1.5 - h(125) * 0.4 } }
      : pick < 0.7
        ? { tilt: 0.05 + h(43) * 0.06, stride: 0.1 + h(46) * 0.1, crouch: 0.25 + h(122) * 0.2, chin: -0.22, cock: 0.02 + h(126) * 0.06, off: { raise: -0.45 - h(123) * 0.3, out: 0.12 + h(124) * 0.2, elbow: -0.8 - h(125) * 0.5 } }
        : { tilt: 0.1 + h(43) * 0.07, stride: 0.14 + h(46) * 0.1, crouch: 0.16 + h(122) * 0.16, chin: -0.08, cock: -0.08 - h(126) * 0.08, off: { raise: 0.28 + h(123) * 0.22, out: 0.06 + h(124) * 0.12, elbow: -0.2 - h(125) * 0.3 } };
    return {
      lean: 0.26 + h(41) * 0.14, // at 0.22-0.38 some rear men stood near vertical; at 0.32-0.52 idle heroes bowed and half squatted
      side: h(42) < 0.5 ? -1 : 1,
      turn: (h(44) < 0.5 ? -1 : 1) * (0.2 + h(45) * 0.4),
      ...stance,
      arms: [arm(70), arm(80)],
    };
  }

  private _animateIdleHumanoid(): void {
    const t = this._time + this._wobblePhase;
    const b = this._body;
    const wobble = 0.07; // TABS-style pronounced sway
    const p = (this._idlePose ??= this._buildIdlePose());
    const leftLeads = p.side < 0;
    // The stance is a man's own while nobody is on him: in a press the shove and the brace take the arms and legs over
    const ease = 1 - Math.min(1, this._shove);
    const c = (this._carry ??= this._buildCarry());
    const hold = ease * (1 - Math.min(1, this._limp));
    const ready = c.ready;

    // Weight on one leg: the pelvis drops on the side of the free leg and the chest rolls back the other way over the standing one, swaying about a slight forward slouch
    const tilt = (leftLeads ? 1 : -1) * (ready?.cast ? p.tilt + 0.08 : p.tilt * (ready ? 0.4 : 1)) + Math.sin(t * 0.7) * 0.03;
    const sway = Math.sin(t * 1.5) * wobble;
    b.hip.rotation.z = tilt;
    b.torso.rotation.z = -tilt * 1.5 + sway;
    b.torso.rotation.x = p.lean + Math.sin(t * 1.2 + 1) * wobble * 0.5;

    // The head rides back toward level a quarter of a sway behind the chest, turned off to its own side, cocked over one shoulder or carried up off a sunk chest as the stance has it
    b.neck.rotation.z = tilt * 0.5 + (leftLeads ? -1 : 1) * p.cock + Math.sin(t * 1.5 - Math.PI / 2) * wobble * 1.2;
    b.neck.rotation.y = p.turn + Math.sin(t * 0.6 + p.turn * 9) * 0.12;
    b.neck.rotation.x = p.chin * ease + Math.sin(t * 1.3 + 2) * wobble * 0.8;
    // A bowman at the ready stands half side-on: hips and chest turned off the line with his leading shoulder to the enemy, and the head left looking down it
    if (ready) {
      const yaw = (leftLeads ? 1 : -1) * ready.yaw * hold + Math.sin(t * 0.5 + ready.yaw * 7) * 0.05;
      b.hip.rotation.y = yaw * 0.45;
      b.torso.rotation.y = yaw * 0.55;
      b.neck.rotation.y = p.turn * 0.35 - yaw * 0.85 + Math.sin(t * 0.6 + p.turn * 9) * 0.12;
    }

    // An arm with nothing to do hangs from the shoulder under its own weight, plumb whatever the chest above it is doing, a little
    // off the ribs on an elbow bent enough to keep the hand at the thigh, and swings as its own pendulum with the forearm trailing the upper arm
    const roll = b.hip.rotation.z + b.torso.rotation.z;
    const [left, right] = p.arms;
    const leftSwing = Math.sin(t * left.rate + left.phase);
    const rightSwing = Math.sin(t * right.rate + right.phase);
    b.leftShoulder.rotation.x = -b.torso.rotation.x * 0.7 + leftSwing * left.swing;
    b.rightShoulder.rotation.x = -b.torso.rotation.x * 0.7 + rightSwing * right.swing;
    b.leftShoulder.rotation.z = -roll - left.out;
    b.rightShoulder.rotation.z = -roll + right.out;
    b.leftElbow.rotation.x = -left.elbow - (0.5 + 0.5 * Math.sin(t * left.rate + left.phase - 0.9)) * left.swing;
    b.rightElbow.rotation.x = -right.elbow - (0.5 + 0.5 * Math.sin(t * right.rate + right.phase - 0.9)) * right.swing;
    // ...but neither arm of a standing man is left to hang plumb beside the other. The weapon hand keeps the hold he marches with (shouldered, stood up, slanted across the chest or
    // trailed), a board arm stays folded across the body, and an empty hand goes where his stance puts it; each still breathes on its own pendulum. An aimed weapon takes both hands:
    // the bow hand holds it at the ready and the other comes across to it.
    this._carryDip = 0;
    const grip = c.weapon ?? ready;
    if (grip) {
      // A hand on a staff stood on the ground does not swing with the arm's pendulum
      const breathe = ready?.prop?.plant ? 0 : rightSwing * right.swing * 0.3;
      b.rightShoulder.rotation.x += (grip.raise + breathe - b.rightShoulder.rotation.x) * hold;
      b.rightShoulder.rotation.z += (grip.out - b.rightShoulder.rotation.z) * hold;
      b.rightElbow.rotation.x += (grip.elbow - b.rightElbow.rotation.x) * hold;
    }
    const off = c.board ?? ready?.left ?? (this.locomotionBias !== "aimed" ? p.off : null);
    if (off) {
      b.leftShoulder.rotation.x += (off.raise + leftSwing * left.swing * 0.3 - b.leftShoulder.rotation.x) * hold;
      b.leftShoulder.rotation.z += (-off.out - b.leftShoulder.rotation.z) * hold;
      b.leftElbow.rotation.x += (off.elbow - (0.5 + 0.5 * leftSwing) * left.swing * 0.3 - b.leftElbow.rotation.x) * hold;
    }

    // Staggered stance: the free leg is planted ahead with its knee bent (twice the hip angle, which keeps that foot
    // on the ground under its dropped hip); the standing leg trails slightly behind, nearly straight.
    // Both knees give under the forward lean (knee twice the hip, so the feet stay put): nobody leans on locked legs.
    // A sunk stance folds both knees further, the thighs coming forward by half of it, and lets the hips down by what that takes off the legs' height.
    const crouch = p.crouch * ease * (ready?.cast ? CASTER_CROUCH : 1);
    const sag = p.lean * 0.2 + crouch * 0.5;
    const lead = -p.stride - sag;
    const trail = p.stride * 0.45 - sag;
    b.leftHip.rotation.x = (leftLeads ? lead : trail) + Math.sin(t * 0.9) * wobble;
    b.rightHip.rotation.x = (leftLeads ? trail : lead) + Math.sin(t * 0.9 + Math.PI) * wobble;
    // The legs stay upright under the tilted pelvis: the standing foot comes in under the body and the free foot rests out to its side
    b.leftHip.rotation.z = -tilt + (leftLeads ? -0.08 : 0.06);
    b.rightHip.rotation.z = -tilt + (leftLeads ? -0.06 : 0.08);
    b.leftKnee.rotation.x = leftLeads ? (p.stride + sag) * 2 : 0.1 + sag * 2;
    b.rightKnee.rotation.x = leftLeads ? 0.1 + sag * 2 : (p.stride + sag) * 2;
    this._hipRest ??= b.hip.position.y;
    this._idleSink = this._hipRest * (1 - Math.cos(crouch * 0.5));
    // Ready stance: the feet are staggered fore and aft, not set side by side under the hips. The leading leg reaches out ahead on a knee that gives, the other is set
    // back nearly straight with its heel behind him, and the hips come down by what the spread takes off the legs' height. A caster keeps the stance he has.
    if (ready && !ready.cast) {
      const reach = ready.stagger * ease;
      const give = ready.give * ease + p.lean * 0.2;
      const ahead = -reach - give + Math.sin(t * 0.9) * wobble * 0.5;
      const behind = reach * 0.9 - give * 0.3 + Math.sin(t * 0.9 + Math.PI) * wobble * 0.5;
      b.leftHip.rotation.x = leftLeads ? ahead : behind;
      b.rightHip.rotation.x = leftLeads ? behind : ahead;
      b.leftKnee.rotation.x = leftLeads ? give * 2 + 0.1 : 0.15 + give * 0.6;
      b.rightKnee.rotation.x = leftLeads ? 0.15 + give * 0.6 : give * 2 + 0.1;
      this._idleSink = this._hipRest * (1 - Math.cos(reach) * Math.cos(give));
    }
  }

  private _animateIdleQuadruped(): void {
    const t = this._time + this._wobblePhase;
    const b = this._body;
    const wobble = 0.02;

    // Gentle body breathing sway
    b.torso.rotation.z = Math.sin(t * 1.2) * wobble;
    b.torso.rotation.x = Math.sin(t * 0.9 + 1) * wobble * 0.5;

    // Head sways gently
    b.neck.rotation.x = Math.sin(t * 1.0 + 0.5) * wobble * 1.5;
    b.neck.rotation.z = Math.sin(t * 1.4 + 2) * wobble;

    // All four legs nearly still — just micro-shifts
    b.leftShoulder.rotation.x = Math.sin(t * 0.8) * wobble;
    b.rightShoulder.rotation.x = Math.sin(t * 0.8 + Math.PI) * wobble;
    b.leftHip.rotation.x = Math.sin(t * 0.7 + 1) * wobble;
    b.rightHip.rotation.x = Math.sin(t * 0.7 + 1 + Math.PI) * wobble;
    b.leftElbow.rotation.x = 0;
    b.rightElbow.rotation.x = 0;
    b.leftKnee.rotation.x = 0;
    b.rightKnee.rotation.x = 0;
  }

  private _animateWalk(_dt: number): void {
    if (this.walkStyle === "quadruped") {
      this._animateWalkQuadruped();
      return;
    }
    this._animateWalkHumanoid();
  }

  // Per-unit gait, so a column on the march is not one walk cycle caught at different moments: each man steps at his own cadence, brings the free leg through with the knee
  // folded and lifted to his own height (0.6-1.1 rad: to 1.5 the deep end was a crouched scuttle), steps longer on one side than the other, sinks to his own depth on the standing leg and swings his arms to his own reach, a beat off his legs.
  // Hashed from the wobble phase like the shove pose, so it consumes no random numbers.
  // The trunk is his own too: one shoulder carried lower than the other, the shoulders rolled over each standing leg by his own amount, the chest dipped on each footfall
  // and heaved back up, and the head set chin up or chin down on the neck and nodding behind the chest, a beat late.
  private _gait: { rate: number; lift: number; limp: number; sink: number; armLag: number; armSwing: number; slump: number; roll: number; nod: number; nodLag: number; chin: number; head: number; headLag: number } | null = null;
  private _buildGait(): NonNullable<ProceduralAnimator["_gait"]> {
    const h = (n: number): number => {
      const v = Math.sin(this._wobblePhase * 12.9898 + n * 78.233) * 43758.5453;
      return v - Math.floor(v);
    };
    return {
      rate: 6.8 + h(71) * 2.6,
      lift: 0.6 + h(72) * 0.5,
      limp: (h(73) - 0.5) * 0.36,
      sink: 0.05 + h(74) * 0.22,
      armLag: (h(75) - 0.5) * 1.4,
      armSwing: 0.5 + h(76) * 0.45,
      slump: (h(77) - 0.5) * 0.16,
      roll: 0.08 + h(78) * 0.12,
      nod: 0.03 + h(79) * 0.05,
      nodLag: h(80) * Math.PI,
      chin: -0.28 + h(89) * 0.32,
      head: 0.04 + h(90) * 0.1,
      headLag: 0.4 + h(91) * 1.2,
    };
  }

  private _animateWalkHumanoid(): void {
    const t = this._time + this._wobblePhase;
    const b = this._body;
    const gait = (this._gait ??= this._buildGait());
    const speed = gait.rate; // cycle speed
    const wobble = 0.08; // constant wobble overlay

    // Torso leans forward and sways side to side. Each man runs at his own lean, 0.28-0.54 (at 0.16-0.46 the shallow end ran near upright), hashed from the wobble phase like the idle slouch: at one 0.38 a charging rank was the same man stamped down its length
    const leanHash = Math.sin(this._wobblePhase * 12.9898 + 51 * 78.233) * 43758.5453;
    // The trunk moves on the step, not on a clock of its own: the chest dips twice a stride, on the footfalls, and the shoulders roll once a stride over the standing leg, about the man's own dropped shoulder.
    const stride = t * speed;
    const dip = Math.cos(stride * 2 + gait.nodLag);
    const shoulderRoll = gait.slump + Math.sin(stride) * gait.roll;
    b.torso.rotation.x = 0.28 + (leanHash - Math.floor(leanHash)) * 0.26 + dip * gait.nod;
    b.torso.rotation.z = shoulderRoll;

    // The head rides the roll part of the way back to level and wobbles on top of it
    b.neck.rotation.z = -shoulderRoll * 0.6 + Math.sin(t * speed * 0.7 + 1) * 0.05;
    // Each man carries his chin at his own height against the forward lean (0.28 up to 0.04 down), and the head nods after the chest.
    b.neck.rotation.x = gait.chin + Math.cos(stride * 2 + gait.nodLag - gait.headLag) * gait.head;

    // Alternating leg swing (TABS-style exaggerated)
    const legSwing = (this._shovePose ??= this._buildShovePose()).stride; // per-unit (0.6-0.85 rad), so a charge does not share one stride length
    // Both legs trail behind the hips, so the body tilts into the run from the feet up and the torso does not fold over upright legs. Per-unit (0.12-0.32 rad), so a charge does not share one lean.
    const trail = (this._shovePose ??= this._buildShovePose()).trail;
    // A step has two halves. Going back the leg is the standing leg: straight but for the man's own sink at the knee. Coming forward it is the free leg: the knee folds
    // and the thigh lifts as it passes under the hips, and it straightens again to reach the ground out in front. So a marcher is one straight leg and one bent, never a pair of compasses.
    const leftStep = t * speed;
    const rightStep = leftStep + Math.PI;
    const leftFold = Math.max(0, -Math.cos(leftStep));
    const rightFold = Math.max(0, -Math.cos(rightStep));
    b.leftHip.rotation.x = trail + Math.sin(leftStep) * legSwing * (1 + gait.limp) - leftFold * gait.lift * 0.35;
    b.rightHip.rotation.x = trail + Math.sin(rightStep) * legSwing * (1 - gait.limp) - rightFold * gait.lift * 0.35;
    b.leftKnee.rotation.x = gait.sink + leftFold * gait.lift;
    b.rightKnee.rotation.x = gait.sink + rightFold * gait.lift;

    // Arms swing opposite to legs, each man's a beat ahead of or behind his step
    const armStep = leftStep + gait.armLag;
    b.leftShoulder.rotation.x = Math.sin(armStep + Math.PI) * gait.armSwing;
    b.rightShoulder.rotation.x = Math.sin(armStep) * gait.armSwing;
    // Per-unit elbow bend (0.7-1.2 rad), so a rank on the move does not share one arm shape.
    const elbow = (this._shovePose ??= this._buildShovePose()).elbow;
    b.leftElbow.rotation.x = -elbow + Math.sin(armStep + Math.PI) * 0.2;
    b.rightElbow.rotation.x = -elbow + Math.sin(armStep) * 0.2;

    // Floppy arm Z rotation (TABS signature wobble)
    b.leftShoulder.rotation.z = -0.3 + Math.sin(t * speed * 1.3) * wobble * 3.5; // held 0.3 out from the ribs under the wobble: about zero the signed sine swung the arm in through the torso
    b.rightShoulder.rotation.z = 0.3 + Math.sin(t * speed * 1.3 + 1) * wobble * 3.5;

    // Hip bounce
    b.hip.rotation.z = Math.sin(t * speed) * 0.04;
    this._applyWalkBias(t);
  }

  /** Quadruped walk: diagonal pairs move together (trot gait). */
  private _animateWalkQuadruped(): void {
    const t = this._time + this._wobblePhase;
    const b = this._body;
    const speed = 5; // slower, heavier cycle
    const legSwing = 0.3; // shorter swing for thick legs

    // Diagonal trot: front-left + back-right, then front-right + back-left
    // Front legs (mapped to shoulders)
    b.leftShoulder.rotation.x = Math.sin(t * speed) * legSwing;
    b.rightShoulder.rotation.x = Math.sin(t * speed + Math.PI) * legSwing;
    // Front knees bend on back-swing
    b.leftElbow.rotation.x = Math.max(0, -Math.sin(t * speed)) * 0.25;
    b.rightElbow.rotation.x = Math.max(0, -Math.sin(t * speed + Math.PI)) * 0.25;

    // Back legs (mapped to hips)
    b.leftHip.rotation.x = Math.sin(t * speed + Math.PI) * legSwing;
    b.rightHip.rotation.x = Math.sin(t * speed) * legSwing;
    // Back knees
    b.leftKnee.rotation.x = Math.max(0, -Math.sin(t * speed + Math.PI)) * 0.25;
    b.rightKnee.rotation.x = Math.max(0, -Math.sin(t * speed)) * 0.25;

    // Body sway — subtle side-to-side rock synced with gait
    b.torso.rotation.z = Math.sin(t * speed) * 0.03;
    // Slight forward lean
    b.torso.rotation.x = 0.04 + Math.sin(t * speed * 2) * 0.015;

    // Head bobs gently — slightly out of phase for natural feel
    b.neck.rotation.x = Math.sin(t * speed * 2 + 1) * 0.06;
    b.neck.rotation.z = Math.sin(t * speed + 0.5) * 0.04;

    // Hip slight vertical bounce
    b.hip.rotation.x = Math.sin(t * speed * 2) * 0.02;
  }

  private _applyWalkBias(t: number): void {
    const b = this._body;
    switch (this.locomotionBias) {
      case "heavy_carry": {
        // Per-unit carry: each body holds its weapon arm at its own height, fold and angle off the ribs, hashed from
        // the wobble phase like the idle pose, so a rank on the march is a ragged line of clubs and not one repeated pose
        const h = (n: number): number => {
          const v = Math.sin(this._wobblePhase * 12.9898 + n * 78.233) * 43758.5453;
          return v - Math.floor(v);
        };
        b.torso.rotation.x += 0.06;
        b.rightShoulder.rotation.x = b.rightShoulder.rotation.x * 0.7 - 1.2 + (h(61) - 0.5) * 0.9;
        b.rightShoulder.rotation.z += (h(62) - 0.5) * 0.7;
        b.leftShoulder.rotation.x *= 0.82;
        // The elbow folds a little, to make a right angle with the raised upper arm between them, so the club stands upright off the forearm: folded further it tipped back over the shoulder to level
        b.rightElbow.rotation.x -= 0.4 + (h(63) - 0.5) * 0.4;
        break;
      }
      case "aimed":
        b.torso.rotation.x += 0.04;
        b.rightShoulder.rotation.x = b.rightShoulder.rotation.x * 0.65 + 0.16;
        b.leftShoulder.rotation.x = b.leftShoulder.rotation.x * 0.6 - 0.18;
        b.leftElbow.rotation.x -= 0.12;
        b.rightElbow.rotation.x -= 0.06;
        b.torso.rotation.z += Math.sin(t * 4) * 0.02;
        break;
      case "braced":
        b.torso.rotation.x += 0.05;
        b.leftShoulder.rotation.x = b.leftShoulder.rotation.x * 0.65 - 0.08;
        b.rightShoulder.rotation.x = b.rightShoulder.rotation.x * 0.65 + 0.08;
        b.leftElbow.rotation.x -= 0.08;
        b.rightElbow.rotation.x -= 0.12;
        break;
      default:
        break;
    }
  }

  private _resolveReleasePoint(defaultPoint: number): number {
    switch (this.releaseTimingProfile) {
      case "melee_commit":
        return 0.44;
      case "thrust_extend":
        return 0.5;
      case "bow_release":
        return 0.72;
      case "crossbow_release":
        return 0.55;
      case "firearm_recoil":
        return 0.5;
      case "throw_release":
        return 0.45;
      default:
        return defaultPoint;
    }
  }

  private _animateAttack(dt: number): void {
    if (this._attackMotion === "reload" || this._attackMotion === "crank" || this._attackMotion === "brace" || this._attackMotion === "carry" || this._attackMotion === "breath") {
      this._animateUtilityAction(dt);
      return;
    }
    if (this.attackStyle === "mammoth") {
      this._animateAttackMammoth(dt);
      return;
    }
    switch (this._attackMotion) {
      case "heavy_swing":
        this._animateHeavySwing(dt);
        return;
      case "blade_slash":
        this._animateBladeSlash(dt);
        return;
      case "thrust":
        this._animateThrust(dt);
        return;
      case "throw":
        this._animateThrow(dt);
        return;
      case "bow_draw_release":
        this._animateBowDrawRelease(dt);
        return;
      case "crossbow_snap":
        this._animateCrossbowSnap(dt);
        return;
      case "firearm_recoil":
        this._animateFirearmRecoil(dt);
        return;
      default:
        break;
    }
    this._animateAttackHumanoid(dt);
  }

  private _animateUtilityAction(dt: number): void {
    this._attackTimer += dt;
    const b = this._body;
    const t = this._time + this._wobblePhase;
    const progress = Math.min(this._attackTimer / this._attackDuration, 1);
    const pulse = Math.sin(progress * Math.PI);
    const settle = 1 - progress;

    switch (this._attackMotion) {
      case "reload":
        b.torso.rotation.x = -0.05 + pulse * 0.08;
        b.rightShoulder.rotation.x = -0.18 + pulse * 0.28;
        b.rightElbow.rotation.x = -0.42 + pulse * 0.22;
        b.leftShoulder.rotation.x = -0.1 + pulse * 0.12;
        b.leftElbow.rotation.x = -0.24 + pulse * 0.1;
        b.neck.rotation.x = pulse * 0.05;
        break;
      case "crank": {
        const cycle = progress * Math.PI * 2.0;
        b.torso.rotation.z = Math.sin(cycle) * 0.06;
        b.rightShoulder.rotation.x = -0.2 + Math.sin(cycle) * 0.22;
        b.rightElbow.rotation.x = -0.38 + Math.cos(cycle) * 0.18;
        b.leftShoulder.rotation.x = -0.16 + Math.sin(cycle + Math.PI) * 0.12;
        b.leftElbow.rotation.x = -0.3 + Math.cos(cycle + Math.PI) * 0.1;
        b.neck.rotation.z = Math.sin(cycle * 0.5) * 0.04;
        break;
      }
      case "brace":
        b.torso.rotation.x = 0.1 + pulse * 0.08;
        b.leftShoulder.rotation.x = -0.12 + pulse * 0.08;
        b.rightShoulder.rotation.x = -0.12 + pulse * 0.08;
        b.leftElbow.rotation.x = -0.22;
        b.rightElbow.rotation.x = -0.22;
        b.leftHip.rotation.x = 0.08 * pulse;
        b.rightHip.rotation.x = 0.08 * pulse;
        break;
      case "carry":
        b.torso.rotation.x = 0.06 + pulse * 0.04;
        b.leftShoulder.rotation.x = -0.18;
        b.rightShoulder.rotation.x = -0.18;
        b.leftElbow.rotation.x = -0.34 + pulse * 0.08;
        b.rightElbow.rotation.x = -0.34 + pulse * 0.08;
        b.torso.rotation.z = Math.sin(t * 6) * 0.04 * settle;
        break;
      case "breath":
        b.torso.rotation.x = 0.08 + pulse * 0.12;
        b.neck.rotation.x = 0.14 + pulse * 0.18;
        b.leftShoulder.rotation.x = -0.08;
        b.rightShoulder.rotation.x = -0.08;
        b.leftElbow.rotation.x = -0.16;
        b.rightElbow.rotation.x = -0.16;
        break;
      default:
        break;
    }

    b.leftShoulder.rotation.z += Math.sin(t * 4.5) * 0.04 * settle;
    b.rightShoulder.rotation.z += Math.sin(t * 4.5 + 1.2) * 0.04 * settle;
    b.neck.rotation.z += Math.sin(t * 3.8) * 0.03 * settle;

    if (progress >= 1) {
      this._attackMotion = "strike";
      this._state = AnimState.Idle;
    }
  }

  /**
   * A cast is not a club swing from attention. The caster keeps his stance and his hold and works from them: the rod comes up off the ground and back over the shoulder
   * with the chest turned and leant away and the other hand thrown up and out at the enemy, then the rod is driven forward at him, arm near straight and the chest
   * after it, the other arm flung back, and he settles to the hold again.
   */
  private _animateCast(dt: number): void {
    this._attackTimer += dt;
    const b = this._body;
    const progress = Math.min(this._attackTimer / this._attackDuration, 1);
    this._animateIdleHumanoid();
    const step = (from: number, to: number): number => {
      const u = Math.max(0, Math.min(1, (progress - from) / (to - from)));
      return u * u * (3 - 2 * u);
    };
    const wind = step(0, 0.5) * (1 - step(0.55, 0.68));
    const drive = step(0.55, 0.68) * (1 - step(0.82, 1));
    const k = 1 - Math.min(1, this._limp);
    const to = (joint: TransformNode, axis: "x" | "y" | "z", back: number, ahead: number): void => {
      joint.rotation[axis] += (back - joint.rotation[axis]) * wind * k;
      joint.rotation[axis] += (ahead - joint.rotation[axis]) * drive * k;
    };
    to(b.rightShoulder, "x", Math.max(-3.0, Math.min(b.rightShoulder.rotation.x, -1.2) - 0.9), -1.45);
    to(b.rightShoulder, "z", 0.4, 0.05);
    to(b.rightElbow, "x", -1.7, -0.15);
    to(b.leftShoulder, "x", -1.5, 0.55);
    to(b.leftShoulder, "z", -0.2, -0.55);
    to(b.leftElbow, "x", -0.45, -0.35);
    b.torso.rotation.x += (-0.24 * wind + 0.3 * drive) * k;
    b.torso.rotation.y += (0.32 * wind - 0.28 * drive) * k;
    b.neck.rotation.y -= (0.25 * wind - 0.2 * drive) * k;
    b.neck.rotation.x += 0.1 * drive * k;
    // The legs take it as a stride, not a squat: on the wind-up the weight goes back onto the rod-side leg, which folds a little while the other foot is set out ahead,
    // and the drive goes forward through that leading leg, its knee giving under him as the rear leg straightens out behind and pushes.
    to(b.leftHip, "x", -0.3, -0.52);
    to(b.leftKnee, "x", 0.18, 0.5);
    to(b.rightHip, "x", 0.1, 0.42);
    to(b.rightKnee, "x", 0.3, 0.06);
    to(b.leftHip, "z", 0, 0);
    to(b.rightHip, "z", 0, 0);
    this._castLift = Math.max(wind, drive);
    this._castReach = -0.45 * wind + 1.1 * drive;
    if (progress >= 1) this._state = AnimState.Idle;
  }

  private _animateAttackHumanoid(dt: number): void {
    if ((this._carry ??= this._buildCarry()).ready?.cast) {
      this._animateCast(dt);
      return;
    }
    this._attackTimer += dt;
    const b = this._body;
    const t = this._time + this._wobblePhase;
    const progress = Math.min(this._attackTimer / this._attackDuration, 1);
    const pulse = Math.sin(progress * Math.PI);
    const settle = 1 - progress;

    if (progress < 0.5) {
      const windUp = progress * 2;
      b.rightShoulder.rotation.x = -2.0 * windUp;
      b.rightShoulder.rotation.z = 0.3 * windUp;
      b.rightElbow.rotation.x = -0.8 * windUp;
      b.torso.rotation.x = -0.25 * windUp;
    } else {
      const swing = (progress - 0.5) * 2;
      const eased = 1 - Math.pow(1 - swing, 3);
      b.rightShoulder.rotation.x = -2.0 + 3.6 * eased;
      b.rightShoulder.rotation.z = 0.3 - 0.3 * eased;
      b.rightElbow.rotation.x = -0.8 + 0.8 * eased;
      b.torso.rotation.x = -0.25 + 0.65 * eased;
    }

    b.leftShoulder.rotation.x += Math.sin(t * 6) * 0.08 * settle;
    b.leftShoulder.rotation.z += Math.sin(t * 7 + 1) * 0.06 * settle;

    b.leftHip.rotation.x = Math.sin(t * 4) * 0.05;
    b.rightHip.rotation.x = 0.12 + pulse * 0.06;
    b.leftKnee.rotation.x = pulse * 0.04;
    b.rightKnee.rotation.x = 0.08 + pulse * 0.06;

    b.neck.rotation.x += 0.08 + pulse * 0.03;
    b.neck.rotation.z += Math.sin(t * 5) * 0.05 * settle;

    if (progress >= 1) {
      this._state = AnimState.Idle;
    }
  }

  /**
   * Heavy swing (club, mace, hammer, pan): an overhead blow, not a level shove of the arm (ref trailer_3_sheet_01 r2c3).
   * - Wind-up (0 -> commit): the weapon arm goes up past the head, shoulder to -2.75 rad (nearly vertical) with the elbow folded 1.25, so the fist is
   *   above and behind the crown; the trunk arches back 0.25 and twists 0.2 onto the weapon side; the head lifts to the mark. The head of the club points
   *   up and back over the shoulder, its arc angle CLUB_COCK (-0.4 rad from vertical, behind: at 0.85 a side view read it as level).
   * - Drop (commit -> 45% of what is left): a committed downswing, eased in hard. Shoulder to +0.5 (fist below and ahead of the chest), elbow out to -0.15,
   *   trunk folds forward 0.55 over a front knee bent 0.35; the club's arc runs through vertical to CLUB_LAND (+1.8 rad, head forward and a little down, at the
   *   target's chest: at 2.05 it was driven into the turf).
   * - Recover (the rest): he heaves it back up two thirds of the way to the cock, so a press between blows is clubs held up, not clubs left lying forward.
   * The club's arc is handed to _carryProp through _clubArc/_clubHold and turned in the fist there; the arm alone could not stand it up overhead.
   */
  private _animateHeavySwing(dt: number): void {
    this._attackTimer += dt;
    const b = this._body;
    const progress = Math.min(this._attackTimer / this._attackDuration, 1);
    const commit = this._resolveReleasePoint(0.45);
    const drop = commit + (1 - commit) * 0.45;
    const side = Math.sign(b.rightShoulder.position.x) || 1;
    if (progress < commit) {
      const w = progress / Math.max(commit, 0.001);
      const windUp = w * (2 - w); // eased out: up fast, slowing into the cock
      b.rightShoulder.rotation.x = -2.75 * windUp;
      b.rightShoulder.rotation.z = 0.3 * windUp;
      b.rightElbow.rotation.x = -1.25 * windUp;
      b.leftShoulder.rotation.x = -0.7 * windUp;
      b.leftShoulder.rotation.z = -0.35 * windUp;
      b.leftElbow.rotation.x = -0.5 * windUp;
      b.torso.rotation.x = -0.25 * windUp;
      b.torso.rotation.y = 0.2 * side * windUp;
      b.neck.rotation.x = -0.12 * windUp;
      b.rightHip.rotation.x = 0.18 * windUp;
      b.leftHip.rotation.x = -0.22 * windUp;
      b.leftKnee.rotation.x = 0.12 * windUp;
      this._clubArc = CLUB_COCK * windUp;
    } else {
      const swing = Math.min(1, (progress - commit) / Math.max(drop - commit, 0.001));
      const eased = swing * swing * (3 - 2 * swing) * 0.4 + swing * swing * 0.6; // slow off the cock, fastest at the bottom
      const back = progress > drop ? (progress - drop) / Math.max(1 - drop, 0.001) : 0;
      const e = eased - back * (2 - back) * 0.65;
      b.rightShoulder.rotation.x = -2.75 + 3.25 * e;
      b.rightShoulder.rotation.z = 0.3 - 0.4 * e;
      b.rightElbow.rotation.x = -1.25 + 1.1 * e;
      b.leftShoulder.rotation.x = -0.7 + 0.9 * e;
      b.leftShoulder.rotation.z = -0.35 + 0.1 * e;
      b.leftElbow.rotation.x = -0.5 + 0.1 * e;
      b.torso.rotation.x = -0.25 + 0.8 * e;
      b.torso.rotation.y = (0.2 - 0.35 * e) * side;
      b.neck.rotation.x = -0.12 + 0.1 * e;
      b.rightHip.rotation.x = 0.18 + 0.12 * e;
      b.leftHip.rotation.x = -0.22 - 0.2 * e;
      b.leftKnee.rotation.x = 0.12 + 0.23 * e;
      this._clubArc = CLUB_COCK + (CLUB_LAND - CLUB_COCK) * e;
    }
    this._clubHold = 1;
    b.rightKnee.rotation.x = 0.12;
    if (progress >= 1) this._state = AnimState.Idle;
  }

  private _animateBladeSlash(dt: number): void {
    this._attackTimer += dt;
    const b = this._body;
    const progress = Math.min(this._attackTimer / this._attackDuration, 1);
    const commit = this._resolveReleasePoint(0.4);
    if (progress < commit) {
      const windUp = progress / Math.max(commit, 0.001);
      b.rightShoulder.rotation.x = -0.85 * windUp;
      b.rightShoulder.rotation.z = -0.55 * windUp;
      b.rightElbow.rotation.x = -0.48 * windUp;
      b.leftShoulder.rotation.x = 0.18 * windUp;
      b.leftShoulder.rotation.z = 0.12 * windUp;
      b.torso.rotation.z = 0.24 * windUp;
      b.torso.rotation.x = -0.08 * windUp;
      b.rightHip.rotation.x = 0.08 * windUp;
      b.leftHip.rotation.x = -0.04 * windUp;
    } else {
      const swing = (progress - commit) / Math.max(1 - commit, 0.001);
      const eased = 1 - Math.pow(1 - swing, 2.6);
      b.rightShoulder.rotation.x = -0.85 + 1.2 * eased;
      b.rightShoulder.rotation.z = -0.55 + 1.05 * eased;
      b.rightElbow.rotation.x = -0.48 + 0.62 * eased;
      b.leftShoulder.rotation.x = 0.18 - 0.32 * eased;
      b.leftShoulder.rotation.z = 0.12 - 0.24 * eased;
      b.torso.rotation.z = 0.24 - 0.44 * eased;
      b.torso.rotation.x = -0.08 + 0.24 * eased;
      b.neck.rotation.z = -0.08 * eased;
    }
    b.leftElbow.rotation.x = -0.18;
    b.rightKnee.rotation.x = 0.08;
    if (progress >= 1) this._state = AnimState.Idle;
  }

  private _animateThrust(dt: number): void {
    this._attackTimer += dt;
    const b = this._body;
    const progress = Math.min(this._attackTimer / this._attackDuration, 1);
    const extend = this._resolveReleasePoint(0.5);
    if (progress < extend) {
      const windUp = progress / Math.max(extend, 0.001);
      b.rightShoulder.rotation.x = -0.42 * windUp;
      b.rightShoulder.rotation.z = 0.08 * windUp;
      b.rightElbow.rotation.x = -0.3 * windUp;
      b.leftShoulder.rotation.x = -0.3 * windUp;
      b.leftElbow.rotation.x = -0.12 * windUp;
      b.torso.rotation.x = 0.04 * windUp;
      b.torso.rotation.z = 0.1 * windUp;
      b.rightHip.rotation.x = 0.16 * windUp;
      b.rightKnee.rotation.x = 0.08 * windUp;
    } else {
      const thrust = (progress - extend) / Math.max(1 - extend, 0.001);
      const eased = 1 - Math.pow(1 - thrust, 3);
      b.rightShoulder.rotation.x = -0.42 + 1.18 * eased;
      b.rightShoulder.rotation.z = 0.08 - 0.18 * eased;
      b.rightElbow.rotation.x = -0.3 + 0.52 * eased;
      b.leftShoulder.rotation.x = -0.3 + 0.56 * eased;
      b.leftElbow.rotation.x = -0.12 - 0.12 * eased;
      b.torso.rotation.x = 0.04 + 0.26 * eased;
      b.torso.rotation.z = 0.1 - 0.12 * eased;
      b.rightHip.rotation.x = 0.16 + 0.08 * eased;
      b.neck.rotation.x = 0.06 * eased;
    }
    if (progress >= 1) this._state = AnimState.Idle;
  }

  private _animateThrow(dt: number): void {
    this._attackTimer += dt;
    const b = this._body;
    const progress = Math.min(this._attackTimer / this._attackDuration, 1);
    const releasePoint = this._resolveReleasePoint(0.45);
    if (progress < releasePoint) {
      const windUp = progress / Math.max(releasePoint, 0.001);
      b.rightShoulder.rotation.x = -1.2 * windUp;
      b.rightShoulder.rotation.z = 0.35 * windUp;
      b.rightElbow.rotation.x = -0.65 * windUp;
      b.leftShoulder.rotation.x = -0.08 * windUp;
      b.torso.rotation.x = -0.12 * windUp;
      b.torso.rotation.z = 0.1 * windUp;
      b.rightHip.rotation.x = 0.12 * windUp;
    } else {
      const release = (progress - releasePoint) / Math.max(1 - releasePoint, 0.001);
      const eased = 1 - Math.pow(1 - release, 3);
      b.rightShoulder.rotation.x = -1.2 + 1.9 * eased;
      b.rightShoulder.rotation.z = 0.35 - 0.45 * eased;
      b.rightElbow.rotation.x = -0.65 + 0.9 * eased;
      b.leftShoulder.rotation.x = -0.08 + 0.24 * eased;
      b.torso.rotation.x = -0.12 + 0.34 * eased;
      b.torso.rotation.z = 0.1 - 0.16 * eased;
      b.neck.rotation.x = 0.06 * eased;
    }
    b.leftElbow.rotation.x = -0.12;
    if (progress >= 1) this._state = AnimState.Idle;
  }

  /**
   * A bowman does not shoot from attention with the bow at his hip. He shoots from his ready stance, turned further until he stands side-on with the bow shoulder to the enemy
   * (BOW_TURN off the line, shared between hips and chest, the head left looking down the arrow): the bow arm comes up straight and level along the line of the shot, the
   * other hand comes across to the string and draws it back to the cheek with the elbow carried out behind at shoulder height, the chest leans back off the bow, the leg
   * under the bow is set ahead on a knee that gives and the other is dropped back straight. At the loose the string hand flies back off the cheek and the chest follows the
   * arrow a little; he holds the bow up a moment and lets it down to the ready.
   */
  private _animateBowDrawRelease(dt: number): void {
    this._attackTimer += dt;
    const b = this._body;
    const progress = Math.min(this._attackTimer / this._attackDuration, 1);
    const releasePoint = this._resolveReleasePoint(0.72);
    const drawPoint = Math.max(0.28, releasePoint - 0.32);
    this._animateIdleHumanoid();
    const step = (from: number, to: number): number => {
      const u = Math.max(0, Math.min(1, (progress - from) / Math.max(0.001, to - from)));
      return u * u * (3 - 2 * u);
    };
    const up = step(0, drawPoint * 0.5) * (1 - step(releasePoint + (1 - releasePoint) * 0.55, 1));
    const draw = step(drawPoint * 0.4, drawPoint);
    const loose = step(releasePoint, releasePoint + (1 - releasePoint) * 0.3);
    const k = up * (1 - Math.min(1, this._limp));
    this._bowUp = k;
    // His own turn, lean and height of the string elbow, hashed from the wobble phase like every other stance
    const h = (n: number): number => {
      const v = Math.sin(this._wobblePhase * 12.9898 + n * 78.233) * 43758.5453;
      return v - Math.floor(v);
    };
    const BOW_TURN = BOW_TURN_MIN + h(131) * (BOW_TURN_MAX - BOW_TURN_MIN);
    const lean = 0.06 + h(132) * 0.16;
    const elbowHigh = (h(133) - 0.5) * 0.4;
    const set = (joint: TransformNode, axis: "x" | "y" | "z", value: number): void => {
      joint.rotation[axis] += (value - joint.rotation[axis]) * k;
    };
    // Side-on, bow shoulder leading
    set(b.hip, "y", -BOW_TURN * 0.45);
    set(b.torso, "y", -BOW_TURN * 0.55);
    set(b.neck, "y", BOW_TURN * 0.9);
    set(b.neck, "x", 0.04);
    set(b.neck, "z", 0);
    set(b.torso, "x", -0.02 - lean * draw + 0.1 * loose);
    set(b.torso, "z", 0.1 * draw - 0.06 * loose);
    // Bow arm: straight and level down the line of the shot
    set(b.rightShoulder, "x", -Math.PI / 2);
    set(b.rightShoulder, "y", 0);
    set(b.rightShoulder, "z", BOW_TURN);
    set(b.rightElbow, "x", -0.1);
    // String arm: across to the bow, back to the cheek, off it at the loose
    set(b.leftShoulder, "x", -1.5 + elbowHigh);
    set(b.leftShoulder, "y", 0);
    set(b.leftShoulder, "z", 0.6 - 0.9 * draw - 0.55 * loose);
    set(b.leftElbow, "x", -2.2 + 1.2 * loose);
    // Legs: the leg under the bow ahead on a giving knee, the other dropped back straight
    set(b.rightHip, "x", -0.3 - 0.06 * draw);
    set(b.rightKnee, "x", 0.34);
    set(b.leftHip, "x", 0.36);
    set(b.leftKnee, "x", 0.1);
    if (progress >= 1) this._state = AnimState.Idle;
  }

  private _animateCrossbowSnap(dt: number): void {
    this._attackTimer += dt;
    const b = this._body;
    const progress = Math.min(this._attackTimer / this._attackDuration, 1);
    const releasePoint = this._resolveReleasePoint(0.55);
    if (progress < releasePoint) {
      const brace = progress / Math.max(releasePoint, 0.001);
      b.leftShoulder.rotation.x = -0.28 - 0.08 * brace;
      b.leftShoulder.rotation.z = -0.12;
      b.leftElbow.rotation.x = -0.22 - 0.06 * brace;
      b.rightShoulder.rotation.x = -0.26 - 0.1 * brace;
      b.rightShoulder.rotation.z = 0.16 + 0.06 * brace;
      b.rightElbow.rotation.x = -0.45 - 0.1 * brace;
      b.torso.rotation.x = 0.05 + 0.03 * brace;
      b.torso.rotation.z = -0.04 * brace;
    } else {
      const snap = (progress - releasePoint) / Math.max(1 - releasePoint, 0.001);
      const eased = 1 - Math.pow(1 - snap, 2.5);
      b.leftShoulder.rotation.x = -0.36 + 0.18 * eased;
      b.leftShoulder.rotation.z = -0.12 + 0.06 * eased;
      b.leftElbow.rotation.x = -0.28 + 0.14 * eased;
      b.rightShoulder.rotation.x = -0.36 + 0.34 * eased;
      b.rightShoulder.rotation.z = 0.22 - 0.16 * eased;
      b.rightElbow.rotation.x = -0.55 + 0.32 * eased;
      b.torso.rotation.x = 0.08 - 0.02 * eased;
      b.torso.rotation.z = -0.04 + 0.06 * eased;
    }
    b.rightHip.rotation.x = 0.04;
    if (progress >= 1) this._state = AnimState.Idle;
  }

  private _animateFirearmRecoil(dt: number): void {
    this._attackTimer += dt;
    const b = this._body;
    const progress = Math.min(this._attackTimer / this._attackDuration, 1);
    const recoilPoint = this._resolveReleasePoint(0.5);
    if (progress < recoilPoint) {
      const aim = progress / Math.max(recoilPoint, 0.001);
      b.leftShoulder.rotation.x = -0.24 - 0.08 * aim;
      b.leftShoulder.rotation.z = -0.12;
      b.leftElbow.rotation.x = -0.22 - 0.06 * aim;
      b.rightShoulder.rotation.x = -0.22 - 0.1 * aim;
      b.rightShoulder.rotation.z = 0.2 + 0.04 * aim;
      b.rightElbow.rotation.x = -0.5 - 0.08 * aim;
      b.torso.rotation.x = 0.06 + 0.03 * aim;
      b.neck.rotation.x = 0.04 * aim;
    } else {
      const recoil = (progress - recoilPoint) / Math.max(1 - recoilPoint, 0.001);
      const eased = 1 - Math.pow(1 - recoil, 2.8);
      b.leftShoulder.rotation.x = -0.32 + 0.12 * eased;
      b.leftShoulder.rotation.z = -0.12 + 0.04 * eased;
      b.leftElbow.rotation.x = -0.28 + 0.1 * eased;
      b.rightShoulder.rotation.x = -0.32 + 0.26 * eased;
      b.rightShoulder.rotation.z = 0.24 - 0.08 * eased;
      b.rightElbow.rotation.x = -0.58 + 0.2 * eased;
      b.torso.rotation.x = 0.09 - 0.05 * eased;
      b.torso.rotation.z = -0.08 * Math.sin(recoil * Math.PI) * (1 - recoil * 0.2);
      b.neck.rotation.x = 0.04 + 0.04 * eased;
    }
    b.rightHip.rotation.x = 0.08;
    if (progress >= 1) this._state = AnimState.Idle;
  }

  /** Mammoth stomp/charge: rear up, slam down, shake on impact. */
  private _animateAttackMammoth(dt: number): void {
    this._attackTimer += dt;
    const b = this._body;
    const progress = Math.min(this._attackTimer / this._attackDuration, 1);

    if (progress < 0.3) {
      // Rear up: tilt whole body backward, raise front
      const rearUp = progress / 0.3;
      const eased = 1 - Math.pow(1 - rearUp, 2);
      b.torso.rotation.x = -0.35 * eased;
      b.neck.rotation.x = -0.25 * eased;
      // Front legs lift
      b.leftShoulder.rotation.x = -0.5 * eased;
      b.rightShoulder.rotation.x = -0.5 * eased;
    } else if (progress < 0.5) {
      // Slam down: fast forward tilt
      const slam = (progress - 0.3) / 0.2;
      const eased = 1 - Math.pow(1 - slam, 3);
      b.torso.rotation.x = -0.35 + 0.7 * eased;
      b.neck.rotation.x = -0.25 + 0.6 * eased;
      // Front legs slam down
      b.leftShoulder.rotation.x = -0.5 + 0.7 * eased;
      b.rightShoulder.rotation.x = -0.5 + 0.7 * eased;
    } else {
      // Recovery: shake and settle back to neutral
      const recover = (progress - 0.5) / 0.5;
      const shake = Math.sin(recover * Math.PI * 6) * 0.12 * (1 - recover);
      b.torso.rotation.x = 0.35 * (1 - recover) + shake;
      b.torso.rotation.z = shake * 0.8;
      b.neck.rotation.x = 0.35 * (1 - recover);
      b.neck.rotation.z = -shake;
      b.leftShoulder.rotation.x = 0.2 * (1 - recover);
      b.rightShoulder.rotation.x = 0.2 * (1 - recover);
    }

    if (progress >= 1) {
      // Reset rotations
      b.torso.rotation.x = 0;
      b.torso.rotation.z = 0;
      b.neck.rotation.x = 0;
      b.neck.rotation.z = 0;
      b.leftShoulder.rotation.x = 0;
      b.rightShoulder.rotation.x = 0;
      this._state = AnimState.Idle;
    }
  }

  private _initDeathRagdoll(): void {
    const joints = this._body.allJoints;
    this._deathJointAngles = [];
    this._deathAngularVelocities = [];
    // Corpses come to rest crumpled in the same per-unit limp pose a downed body uses, until they land and it is known which face is up.
    this._deathRestAngles = new Array(joints.length * 3).fill(0);
    this._landedFace = 0;
    if (this.walkStyle !== "quadruped") {
      this._writeDeathRest(0);
      // A corpse still in the air sags toward its flight shape and only crumples once it lands.
      this._deathAirAngles = this._deathRestAngles.slice();
      for (const [joint, x, y, z] of (this._airPose ??= this._buildAirPose())) {
        const index = joints.indexOf(joint as (typeof joints)[number]);
        if (index < 0) continue;
        this._deathAirAngles[index * 3] = x;
        this._deathAirAngles[index * 3 + 1] = y;
        this._deathAirAngles[index * 3 + 2] = z;
      }
    } else {
      this._deathAirAngles = this._deathRestAngles;
    }

    for (let i = 0; i < joints.length; i++) {
      // Current angle + random spin
      this._deathJointAngles.push(
        joints[i].rotation.x,
        joints[i].rotation.y,
        joints[i].rotation.z,
      );
      // Random angular velocity (TABS-style floppy)
      this._deathAngularVelocities.push(
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 12,
      );
    }
  }

  /**
   * Rest angles of a corpse. Not yet landed (0) it is the per-unit limp pose, every fold in the plane of the body. Landed on its back (1) or its
   * front (-1), the folds that can stand up off the ground on the open side replace the flat ones, so the body is not a flat strip.
   */
  private _writeDeathRest(landed: number): void {
    const joints = this._body.allJoints;
    const b = this._body;
    const p = this._limpPose;
    const rest = (joint: unknown, x: number, z = 0, y = 0): void => {
      const index = joints.indexOf(joint as (typeof joints)[number]);
      if (index < 0) return;
      this._deathRestAngles[index * 3] = x;
      this._deathRestAngles[index * 3 + 1] = y;
      this._deathRestAngles[index * 3 + 2] = z;
    };
    rest(b.torso, p.torsoX, p.torsoZ, p.torsoY);
    rest(b.neck, p.neckX);
    rest(b.leftShoulder, p.leftArmX, p.leftArmZ);
    rest(b.rightShoulder, p.rightArmX, p.rightArmZ);
    rest(b.leftElbow, p.leftElbowX, p.leftElbowZ);
    rest(b.rightElbow, p.rightElbowX, p.rightElbowZ);
    rest(b.leftHip, p.leftHipX, p.leftHipZ);
    rest(b.rightHip, p.rightHipX, p.rightHipZ);
    rest(b.leftKnee, p.leftKneeX, p.leftKneeZ);
    rest(b.rightKnee, p.rightKneeX, p.rightKneeZ);
    if (landed === 0) return;
    // Everything below comes from the body's own limp numbers: no random draws, and a corpse thrown again lands in its own shape.
    const u = p.torsoX * 5; // 0..1
    const roll = p.torsoY < 0 ? -1 : 1;
    const both = u > 0.66;
    const raised = u < 0.4;
    // The leg that lay splayed is the one that stands up, and the arm that lay at the side is the one that lifts. Left is -x.
    const leg = p.leftSplayed ? -1 : 1;
    const [upHip, upKnee, otherHip, otherKnee] = p.leftSplayed
      ? [b.leftHip, b.leftKnee, b.rightHip, b.rightKnee]
      : [b.rightHip, b.rightKnee, b.leftHip, b.leftKnee];
    const arm = p.leftFlung ? 1 : -1;
    const [upShoulder, upElbow] = p.leftFlung ? [b.rightShoulder, b.rightElbow] : [b.leftShoulder, b.leftElbow];
    // The head lolls over onto one cheek whichever way up the body is.
    rest(b.neck, p.neckX, 0, roll * (0.7 + 0.4 * u));
    if (landed > 0) {
      // On its back. One knee stands propped: the thigh up at 55 to 70 degrees and the shin straight back down to the foot. One body in three props
      // the other knee half as high. The arm from the side lies across the chest, elbow lifted off the ground and forearm over the ribs,
      // and two bodies in five lie with head and shoulders lifted, folded at the waist.
      const thigh = 0.95 + 0.3 * u;
      rest(upHip, -thigh, leg * 0.08);
      rest(upKnee, thigh * 2);
      if (both) {
        rest(otherHip, -0.6, -leg * 0.15);
        rest(otherKnee, 1.2);
      }
      rest(upShoulder, -0.1, arm * 0.5, -arm * 1.57);
      rest(upElbow, -1.7);
      if (raised) rest(b.torso, 0.3 + 0.6 * u, p.torsoZ, p.torsoY);
    } else {
      // On its front nothing may fold forward, which is into the ground. One shin stands kicked up from the knee, in one body in three both do. The arm
      // from the side is a wing: elbow up over the back, hand down by the ribs. Two bodies in five lie arched, chest and head off the ground.
      rest(upHip, 0, leg * 0.1);
      rest(upKnee, 1.3 + 0.4 * u);
      rest(otherHip, 0.05, -leg * 0.05);
      rest(otherKnee, both ? 0.9 : 0.1);
      rest(upShoulder, 0.7, arm * 0.6);
      rest(upElbow, -1.3);
      rest(b.torso, raised ? -0.3 : 0, p.torsoZ, p.torsoY);
    }
  }

  private _animateDead(dt: number): void {
    const joints = this._body.allJoints;
    const air = this._air;
    const restAt = (index: number): number =>
      this._deathRestAngles[index] + (this._deathAirAngles[index] - this._deathRestAngles[index]) * air;

    for (let i = 0; i < joints.length; i++) {
      const base = i * 3;

      // Apply angular velocity
      this._deathJointAngles[base] += this._deathAngularVelocities[base] * dt;
      this._deathJointAngles[base + 1] += this._deathAngularVelocities[base + 1] * dt;
      this._deathJointAngles[base + 2] += this._deathAngularVelocities[base + 2] * dt;

      // Dampen
      this._deathAngularVelocities[base] *= this._deathDamping;
      this._deathAngularVelocities[base + 1] *= this._deathDamping;
      this._deathAngularVelocities[base + 2] *= this._deathDamping;

      // Flop first, then sag into the crumpled rest pose and stay there; a corpse in flight takes its shape at once
      const sag = Math.min(1, dt * (3.5 + 8 * air));
      this._deathJointAngles[base] += (restAt(base) - this._deathJointAngles[base]) * sag;
      this._deathJointAngles[base + 1] += (restAt(base + 1) - this._deathJointAngles[base + 1]) * sag;
      this._deathJointAngles[base + 2] += (restAt(base + 2) - this._deathJointAngles[base + 2]) * sag;

      // Apply to joint
      joints[i].rotation.x = this._deathJointAngles[base];
      joints[i].rotation.y = this._deathJointAngles[base + 1];
      joints[i].rotation.z = this._deathJointAngles[base + 2];
    }
    // A dead body thrashes half as hard as a live one
    if (air > 0.01 && this.walkStyle !== "quadruped") this._flailInAir(air * 0.5);
  }

  /** A body in flight never holds its shape: arms and legs thrash either way about the flight pose, each limb at its own rate, with no fold held on top, so it flies open and not curled. */
  private _flailInAir(amount: number): void {
    const b = this._body;
    const t = this._time * 1.6 + this._wobblePhase;
    // One arm is thrown ahead and the other trails, which one differing per body, so a flyer is lopsided and not a spread-eagle star
    const lead = Math.sin(this._wobblePhase * 5.3) < 0 ? -0.6 : 0.6;
    b.leftShoulder.rotation.x += (Math.sin(t * 9.1) * 0.7 + lead) * amount;
    b.rightShoulder.rotation.x += (Math.sin(t * 7.3 + 2.1) * 0.7 - lead) * amount;
    b.leftElbow.rotation.x -= 0.45 * Math.sin(t * 11.7 + 0.8) * amount;
    b.rightElbow.rotation.x -= 0.45 * Math.sin(t * 10.3 + 3.4) * amount;
    b.leftHip.rotation.x += Math.sin(t * 6.7 + 1.2) * 0.45 * amount;
    b.rightHip.rotation.x += Math.sin(t * 8.3 + 4.0) * 0.45 * amount;
    b.leftKnee.rotation.x += 0.5 * Math.sin(t * 9.7 + 2.6) * amount;
    b.rightKnee.rotation.x += 0.5 * Math.sin(t * 12.1 + 5.2) * amount;
    // The waist breaks too, slowly and either way: each body has its own lean, forward or back, and rocks about it,
    // so a flung line is some jack-knifed, some arched and some straight, never a row of the same flat plank
    const fold = (Math.sin(this._wobblePhase * 3.7) * 0.8 + Math.sin(t * 3.1) * 0.45) * amount;
    b.torso.rotation.x += fold;
    b.neck.rotation.x -= fold * 0.4;
  }
}
