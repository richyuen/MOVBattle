import { Quaternion, Vector3, type TransformNode } from "@babylonjs/core";
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
export type ReleaseTimingProfile =
  | "default"
  | "melee_commit"
  | "thrust_extend"
  | "bow_release"
  | "crossbow_release"
  | "firearm_recoil"
  | "throw_release";

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
  private _shove = 0;
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
    if (this._shove > 0.01 && this._state !== AnimState.Dead && this.walkStyle !== "quadruped") {
      const b = this._body;
      const p = (this._shovePose ??= this._buildShovePose());
      const k = this._shove;
      const phase = (this._time + this._wobblePhase) * p.rate;
      // The walk already leans 0.55 rad; a presser still stepping in takes half the extra pitch.
      // A man behind a shield does not fold over it: he stands near upright and sinks at the knees instead.
      const wall = this._shieldBoard() !== null;
      b.torso.rotation.x += ((wall ? 0.1 : p.pitch) * (this._state === AnimState.Walking ? 0.5 : 1) + Math.sin(phase * 0.5) * 0.08) * k;
      // A swing pitches the torso itself; with the shove on top the lean stops at 0.6 rad, short of a fold at the waist.
      b.torso.rotation.x = Math.min(b.torso.rotation.x, 0.6);
      b.torso.rotation.z += ((wall ? p.roll * 0.3 : p.roll) + Math.cos(phase * 0.35) * 0.08) * k;
      b.neck.rotation.x -= (wall ? 0.1 : p.pitch) * 0.6 * k;
      // Thighs come forward under the pitched torso and the knees give a little, so the body breaks at the waist and stays tall on its legs.
      b.leftHip.rotation.x += (p.stance - 0.15) * k;
      b.rightHip.rotation.x -= (p.stance + 0.15) * k;
      b.leftKnee.rotation.x += (p.knee + 0.05) * k;
      b.rightKnee.rotation.x += (p.knee + 0.05) * k;
      if (this._state === AnimState.Idle) {
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
      if (wall) {
        // Brace: whatever the walk, the swing or the flail made of the shield arm, it locks out in front of the chest, upper arm forward and forearm
        // level across the body, and holds there while the weapon arm goes on working. The knees give a little more, so the head sits low behind the rim.
        const hold = k * (1 - Math.min(1, this._limp));
        b.leftShoulder.rotation.x += (-0.7 + Math.sin(phase * 0.5) * 0.06 - b.leftShoulder.rotation.x) * hold;
        b.leftShoulder.rotation.y += (0 - b.leftShoulder.rotation.y) * hold;
        b.leftShoulder.rotation.z += (0.3 - b.leftShoulder.rotation.z) * hold;
        b.leftElbow.rotation.x += (-1.1 - b.leftElbow.rotation.x) * hold;
        b.leftElbow.rotation.z += (0 - b.leftElbow.rotation.z) * hold;
        b.leftKnee.rotation.x += 0.15 * hold;
        b.rightKnee.rotation.x += 0.15 * hold;
        if (this._spearShaft()) {
          // Spear arm: no windmill and no underarm poke. The hand goes up beside the head, elbow cocked, and holds the shaft there over the rim of the
          // board (a rear man's over the shoulder of the man ahead); a thrust straightens the arm forward and down from that hold and comes back to it.
          const jab = this._state === AnimState.Attacking ? Math.sin(Math.min(1, this._attackTimer / this._attackDuration) * Math.PI) : 0;
          b.rightShoulder.rotation.x += (-2.2 + 0.5 * jab + Math.sin(phase * 0.5 + 1) * 0.05 - b.rightShoulder.rotation.x) * hold;
          b.rightShoulder.rotation.y += (0 - b.rightShoulder.rotation.y) * hold;
          b.rightShoulder.rotation.z += (0.2 - b.rightShoulder.rotation.z) * hold;
          b.rightElbow.rotation.x += (-1.2 + 0.9 * jab - b.rightElbow.rotation.x) * hold;
          b.rightElbow.rotation.z += (0 - b.rightElbow.rotation.z) * hold;
        }
      }
    }
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
      if (c.weapon) {
        b.rightShoulder.rotation.x += (c.weapon.raise + bob * c.bob - b.rightShoulder.rotation.x * 0.8) * carry;
        b.rightShoulder.rotation.z += (c.weapon.out - b.rightShoulder.rotation.z) * carry;
        b.rightElbow.rotation.x += (c.weapon.elbow - bob * c.bob * 1.5 - b.rightElbow.rotation.x) * carry;
      }
      if (c.board) {
        b.leftShoulder.rotation.x += (c.board.raise - bob * c.bob * 0.7 - b.leftShoulder.rotation.x * 0.8) * carry;
        b.leftShoulder.rotation.z += (c.board.out - b.leftShoulder.rotation.z) * carry;
        b.leftElbow.rotation.x += (c.board.elbow + bob * c.bob - b.leftElbow.rotation.x) * carry;
      }
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

    // ─── Googly-eye pupil wobble ───
    this._updatePupilWobble(dt);
  }

  // What each arm is carrying on the march and how this man holds it. A weapon is anything in the right hand but the mitt itself; a club over the shoulder, an aimed bow and a wall
  // carrier's upright spear already have their own holds. Looked up on first use, like the board, and hashed from the wobble phase like the gait.
  private _carry: { weapon: { raise: number; out: number; elbow: number } | null; board: { raise: number; out: number; elbow: number } | null; bob: number; beat: number } | null = null;
  private _buildCarry(): NonNullable<ProceduralAnimator["_carry"]> {
    const h = (n: number): number => {
      const v = Math.sin(this._wobblePhase * 12.9898 + n * 78.233) * 43758.5453;
      return v - Math.floor(v);
    };
    const held = (this.locomotionBias === "none" || this.locomotionBias === "braced") && !this._spearShaft()
      && this._body.rightHand.getChildren().some((n) => !/HandM$/.test(n.name));
    return {
      weapon: held ? { raise: -0.35 - h(81) * 0.5, out: 0.12 + h(82) * 0.28, elbow: -0.7 - h(83) * 0.6 } : null,
      board: this._shieldBoard() ? { raise: -0.3 - h(85) * 0.4, out: -0.15 + h(86) * 0.3, elbow: -0.8 - h(87) * 0.5 } : null,
      bob: 0.15 + h(84) * 0.15,
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
    const k = this._state === AnimState.Dead ? 0 : this._shove * (1 - Math.min(1, this._limp));
    if (k <= 0.01) {
      if (shield.rotationQuaternion) shield.rotationQuaternion = null;
      return;
    }
    const hand = this._body.leftHand;
    hand.computeWorldMatrix(true);
    const square = Quaternion.Inverse(hand.absoluteRotationQuaternion).multiply(Quaternion.RotationYawPitchRoll(this._body.root.rotation.y, 0, 0));
    shield.rotationQuaternion = Quaternion.Slerp(Quaternion.Identity(), square, Math.min(1, k * 1.5));
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
   * A shield man's spear does not ride his hand any more than his board does: it turns in the fist to one of two carries, whatever the arm is doing.
   * On the march it stands upright, point to the sky; in contact it comes down level along the wall's heading, point a little low, so the spears of
   * a wall and of the rank behind it lie parallel over the boards and do not fan or cross. The fist keeps its place on the shaft. Limp or dead, the
   * spear goes back to hanging from the hand.
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
    const level = Math.min(1, this._shove * 1.5);
    const carry = Quaternion.RotationYawPitchRoll(this._body.root.rotation.y, 0.06 + (Math.PI / 2 + 0.04) * level, 0);
    const turn = Quaternion.Slerp(rest, Quaternion.Inverse(hand.absoluteRotationQuaternion).multiply(carry), k);
    shaft.rotationQuaternion = turn;
    // The shaft's middle sits as far up the shaft from the fist as it was strapped on.
    const held = new Vector3(0, grip.length(), 0);
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

    // Clamp within eye radius
    const maxOff = 0.025 * (b.metrics.overallHeight / 1.4);
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

  // Per-unit standing rest: forward lean, which leg is the free one planted ahead, how far the pelvis drops on that side, where the head
  // is turned, and for each arm its hang off the ribs, its elbow's give and the reach, pace and phase of its swing. Hashed from the wobble phase like the shove pose, so it consumes no random numbers.
  private _idlePose: { lean: number; side: number; stride: number; tilt: number; turn: number; arms: Array<{ out: number; elbow: number; swing: number; rate: number; phase: number }> } | null = null;
  private _buildIdlePose(): NonNullable<ProceduralAnimator["_idlePose"]> {
    const h = (n: number): number => {
      const v = Math.sin(this._wobblePhase * 12.9898 + n * 78.233) * 43758.5453;
      return v - Math.floor(v);
    };
    const arm = (n: number) => ({ out: 0.08 + h(n) * 0.1, elbow: 0.4 + h(n + 1) * 0.4, swing: 0.14 + h(n + 2) * 0.18, rate: 0.9 + h(n + 3) * 0.7, phase: h(n + 4) * Math.PI * 2 });
    return {
      lean: 0.26 + h(41) * 0.14, // at 0.22-0.38 some rear men stood near vertical; at 0.32-0.52 idle heroes bowed and half squatted
      side: h(42) < 0.5 ? -1 : 1,
      stride: 0.2 + h(46) * 0.14,
      tilt: 0.11 + h(43) * 0.08,
      turn: (h(44) < 0.5 ? -1 : 1) * (0.2 + h(45) * 0.4),
      arms: [arm(70), arm(80)],
    };
  }

  private _animateIdleHumanoid(): void {
    const t = this._time + this._wobblePhase;
    const b = this._body;
    const wobble = 0.07; // TABS-style pronounced sway
    const p = (this._idlePose ??= this._buildIdlePose());
    const leftLeads = p.side < 0;

    // Weight on one leg: the pelvis drops on the side of the free leg and the chest rolls back the other way over the standing one, swaying about a slight forward slouch
    const tilt = (leftLeads ? 1 : -1) * p.tilt + Math.sin(t * 0.7) * 0.03;
    const sway = Math.sin(t * 1.5) * wobble;
    b.hip.rotation.z = tilt;
    b.torso.rotation.z = -tilt * 1.5 + sway;
    b.torso.rotation.x = p.lean + Math.sin(t * 1.2 + 1) * wobble * 0.5;

    // The head rides back toward level a quarter of a sway behind the chest, turned off to its own side
    b.neck.rotation.z = tilt * 0.5 + Math.sin(t * 1.5 - Math.PI / 2) * wobble * 1.2;
    b.neck.rotation.y = p.turn + Math.sin(t * 0.6 + p.turn * 9) * 0.12;
    b.neck.rotation.x = Math.sin(t * 1.3 + 2) * wobble * 0.8;

    // Arms hang from the shoulders under their own weight, plumb whatever the chest above them is doing, each a little
    // off the ribs on an elbow bent enough to keep the hand at the thigh, and each swings as its own pendulum with the forearm trailing the upper arm
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

    // Staggered stance: the free leg is planted ahead with its knee bent (twice the hip angle, which keeps that foot
    // on the ground under its dropped hip); the standing leg trails slightly behind, nearly straight.
    // Both knees give under the forward lean (knee twice the hip, so the feet stay put): nobody leans on locked legs
    const sag = p.lean * 0.2;
    const lead = -p.stride - sag;
    const trail = p.stride * 0.45 - sag;
    b.leftHip.rotation.x = (leftLeads ? lead : trail) + Math.sin(t * 0.9) * wobble;
    b.rightHip.rotation.x = (leftLeads ? trail : lead) + Math.sin(t * 0.9 + Math.PI) * wobble;
    // The legs stay upright under the tilted pelvis: the standing foot comes in under the body and the free foot rests out to its side
    b.leftHip.rotation.z = -tilt + (leftLeads ? -0.08 : 0.06);
    b.rightHip.rotation.z = -tilt + (leftLeads ? -0.06 : 0.08);
    b.leftKnee.rotation.x = leftLeads ? (p.stride + sag) * 2 : 0.1 + sag * 2;
    b.rightKnee.rotation.x = leftLeads ? 0.1 + sag * 2 : (p.stride + sag) * 2;
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
      roll: 0.04 + h(78) * 0.1,
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

  private _animateAttackHumanoid(dt: number): void {
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

  private _animateHeavySwing(dt: number): void {
    this._attackTimer += dt;
    const b = this._body;
    const progress = Math.min(this._attackTimer / this._attackDuration, 1);
    const commit = this._resolveReleasePoint(0.45);
    if (progress < commit) {
      const windUp = progress / Math.max(commit, 0.001);
      b.rightShoulder.rotation.x = -1.55 * windUp;
      b.rightShoulder.rotation.z = 0.52 * windUp;
      b.rightElbow.rotation.x = -0.95 * windUp;
      b.leftShoulder.rotation.x = -0.18 * windUp;
      b.leftShoulder.rotation.z = -0.16 * windUp;
      b.torso.rotation.x = -0.14 * windUp;
      b.torso.rotation.z = 0.14 * windUp;
      b.rightHip.rotation.x = 0.14 * windUp;
      b.leftHip.rotation.x = -0.06 * windUp;
      b.neck.rotation.z = 0.05 * windUp;
    } else {
      const swing = (progress - commit) / Math.max(1 - commit, 0.001);
      const eased = 1 - Math.pow(1 - swing, 3);
      b.rightShoulder.rotation.x = -1.55 + 2.45 * eased;
      b.rightShoulder.rotation.z = 0.52 - 0.78 * eased;
      b.rightElbow.rotation.x = -0.95 + 1.15 * eased;
      b.leftShoulder.rotation.x = -0.18 + 0.24 * eased;
      b.leftShoulder.rotation.z = -0.16 + 0.18 * eased;
      b.torso.rotation.x = -0.14 + 0.48 * eased;
      b.torso.rotation.z = 0.14 - 0.28 * eased;
      b.rightHip.rotation.x = 0.14 + 0.1 * eased;
      b.leftHip.rotation.x = -0.06 + 0.08 * eased;
      b.neck.rotation.x = 0.08 * eased;
      b.neck.rotation.z = 0.05 - 0.12 * eased;
    }
    b.leftElbow.rotation.x = -0.22;
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

  private _animateBowDrawRelease(dt: number): void {
    this._attackTimer += dt;
    const b = this._body;
    const progress = Math.min(this._attackTimer / this._attackDuration, 1);
    const releasePoint = this._resolveReleasePoint(0.72);
    const drawPoint = Math.max(0.28, releasePoint - 0.32);
    if (progress < drawPoint) {
      const draw = progress / Math.max(drawPoint, 0.001);
      b.leftShoulder.rotation.x = -0.42 * draw;
      b.leftShoulder.rotation.z = -0.22 * draw;
      b.leftElbow.rotation.x = -0.08 * draw;
      b.rightShoulder.rotation.x = -0.18 - 0.24 * draw;
      b.rightShoulder.rotation.z = 0.28 + 0.26 * draw;
      b.rightElbow.rotation.x = -0.25 - 0.72 * draw;
      b.torso.rotation.z = -0.12 * draw;
      b.torso.rotation.x = 0.04 * draw;
      b.neck.rotation.z = -0.06 * draw;
    } else if (progress < releasePoint) {
      b.leftShoulder.rotation.x = -0.42;
      b.leftShoulder.rotation.z = -0.22;
      b.leftElbow.rotation.x = -0.08;
      b.rightShoulder.rotation.x = -0.42;
      b.rightShoulder.rotation.z = 0.54;
      b.rightElbow.rotation.x = -0.97;
      b.torso.rotation.z = -0.12;
      b.torso.rotation.x = 0.08;
      b.neck.rotation.z = -0.08;
      b.rightHip.rotation.x = 0.08;
    } else {
      const release = (progress - releasePoint) / Math.max(1 - releasePoint, 0.001);
      const eased = 1 - Math.pow(1 - release, 3);
      b.leftShoulder.rotation.x = -0.42 + 0.12 * eased;
      b.leftShoulder.rotation.z = -0.22 + 0.1 * eased;
      b.rightShoulder.rotation.x = -0.42 + 0.78 * eased;
      b.rightShoulder.rotation.z = 0.54 - 0.52 * eased;
      b.rightElbow.rotation.x = -0.97 + 0.92 * eased;
      b.torso.rotation.z = -0.12 + 0.16 * eased;
      b.torso.rotation.x = 0.08 - 0.02 * eased;
      b.neck.rotation.z = -0.08 + 0.08 * eased;
    }
    b.leftHip.rotation.x = 0.03;
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
