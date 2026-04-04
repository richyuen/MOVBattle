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

  private _flinchTimer = 0;
  private _squashTimer = 0;

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

    // ─── Googly-eye pupil wobble ───
    this._updatePupilWobble(dt);
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

  private _animateIdleHumanoid(): void {
    const t = this._time + this._wobblePhase;
    const b = this._body;
    const wobble = 0.07; // TABS-style pronounced sway

    // Gentle torso sway
    b.torso.rotation.z = Math.sin(t * 1.5) * wobble;
    b.torso.rotation.x = Math.sin(t * 1.2 + 1) * wobble * 0.5;

    // Head bob
    b.neck.rotation.z = Math.sin(t * 1.8 + 0.5) * wobble * 1.2;
    b.neck.rotation.x = Math.sin(t * 1.3 + 2) * wobble * 0.8;

    // Arms hang with slight sway
    b.leftShoulder.rotation.x = Math.sin(t * 1.1) * wobble * 2;
    b.rightShoulder.rotation.x = Math.sin(t * 1.1 + Math.PI) * wobble * 2;
    b.leftElbow.rotation.x = -0.15 + Math.sin(t * 1.4) * wobble;
    b.rightElbow.rotation.x = -0.15 + Math.sin(t * 1.4 + Math.PI) * wobble;

    // Legs straight with micro wobble
    b.leftHip.rotation.x = Math.sin(t * 0.9) * wobble;
    b.rightHip.rotation.x = Math.sin(t * 0.9 + Math.PI) * wobble;
    b.leftKnee.rotation.x = 0;
    b.rightKnee.rotation.x = 0;

    // (no hip bounce — keeps units grounded)
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

  private _animateWalkHumanoid(): void {
    const t = this._time + this._wobblePhase;
    const b = this._body;
    const speed = 8; // cycle speed
    const wobble = 0.08; // constant wobble overlay

    // Torso leans forward and sways side to side
    b.torso.rotation.x = 0.08 + Math.sin(t * speed * 0.5) * wobble * 0.5;
    b.torso.rotation.z = Math.sin(t * speed * 0.5) * 0.06;

    // Head wobbles
    b.neck.rotation.z = Math.sin(t * speed * 0.7 + 1) * 0.08;
    b.neck.rotation.x = Math.sin(t * speed * 0.5 + 2) * 0.04;

    // Alternating leg swing (TABS-style exaggerated)
    const legSwing = 0.55;
    b.leftHip.rotation.x = Math.sin(t * speed) * legSwing;
    b.rightHip.rotation.x = Math.sin(t * speed + Math.PI) * legSwing;

    // Knees bend on back-swing
    b.leftKnee.rotation.x = Math.max(0, -Math.sin(t * speed)) * 0.6;
    b.rightKnee.rotation.x = Math.max(0, -Math.sin(t * speed + Math.PI)) * 0.6;

    // Arms swing opposite to legs
    const armSwing = 0.75;
    b.leftShoulder.rotation.x = Math.sin(t * speed + Math.PI) * armSwing;
    b.rightShoulder.rotation.x = Math.sin(t * speed) * armSwing;
    b.leftElbow.rotation.x = -0.3 + Math.sin(t * speed + Math.PI) * 0.2;
    b.rightElbow.rotation.x = -0.3 + Math.sin(t * speed) * 0.2;

    // Floppy arm Z rotation (TABS signature wobble)
    b.leftShoulder.rotation.z = Math.sin(t * speed * 1.3) * wobble * 3.5;
    b.rightShoulder.rotation.z = Math.sin(t * speed * 1.3 + 1) * wobble * 3.5;

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
      case "heavy_carry":
        b.torso.rotation.x += 0.06;
        b.rightShoulder.rotation.x = b.rightShoulder.rotation.x * 0.45 - 0.28;
        b.leftShoulder.rotation.x *= 0.82;
        b.rightElbow.rotation.x -= 0.16;
        break;
      case "aimed":
        b.torso.rotation.x += 0.04;
        b.rightShoulder.rotation.x = b.rightShoulder.rotation.x * 0.32 + 0.16;
        b.leftShoulder.rotation.x = b.leftShoulder.rotation.x * 0.28 - 0.18;
        b.leftElbow.rotation.x -= 0.12;
        b.rightElbow.rotation.x -= 0.06;
        b.torso.rotation.z += Math.sin(t * 4) * 0.02;
        break;
      case "braced":
        b.torso.rotation.x += 0.05;
        b.leftShoulder.rotation.x = b.leftShoulder.rotation.x * 0.4 - 0.08;
        b.rightShoulder.rotation.x = b.rightShoulder.rotation.x * 0.4 + 0.08;
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

  private _animateDead(dt: number): void {
    const joints = this._body.allJoints;

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

      // Gravity pull on limbs (joints below hip tend to droop)
      if (i > 0) { // skip root
        this._deathAngularVelocities[base] += 2.0 * dt; // gravity effect on X
      }

      // Apply to joint
      joints[i].rotation.x = this._deathJointAngles[base];
      joints[i].rotation.y = this._deathJointAngles[base + 1];
      joints[i].rotation.z = this._deathJointAngles[base + 2];
    }
  }
}
