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

export class ProceduralAnimator {
  private _body: ArticulatedBody;
  private _state = AnimState.Idle;
  private _time = 0;
  private _attackTimer = 0;
  private _attackDuration = 0.4;
  private _wobblePhase: number; // random offset per unit
  attackStyle: AttackStyle = "humanoid";

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

  triggerAttack(windupTime: number): void {
    this._state = AnimState.Attacking;
    this._attackTimer = 0;
    this._attackDuration = windupTime + 0.25;
  }

  /** Brief flinch on hit — snaps torso/head back then recovers. */
  triggerFlinch(): void {
    if (this._state === AnimState.Dead) return;
    this._flinchTimer = 0.2;
  }

  private _flinchTimer = 0;

  update(dt: number): void {
    this._time += dt;

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
      const intensity = Math.max(0, this._flinchTimer / 0.2);
      const b = this._body;
      // Snap torso backward and to the side
      b.torso.rotation.x -= 0.35 * intensity;
      b.torso.rotation.z += 0.15 * intensity;
      // Head whips back
      b.neck.rotation.x -= 0.4 * intensity;
      // Arms flail out
      b.leftShoulder.rotation.z -= 0.3 * intensity;
      b.rightShoulder.rotation.z += 0.3 * intensity;
    }
  }

  private _animateIdle(_dt: number): void {
    const t = this._time + this._wobblePhase;
    const b = this._body;
    const wobble = 0.03; // subtle idle sway

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

  private _animateWalk(_dt: number): void {
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
    const armSwing = 0.5;
    b.leftShoulder.rotation.x = Math.sin(t * speed + Math.PI) * armSwing;
    b.rightShoulder.rotation.x = Math.sin(t * speed) * armSwing;
    b.leftElbow.rotation.x = -0.3 + Math.sin(t * speed + Math.PI) * 0.2;
    b.rightElbow.rotation.x = -0.3 + Math.sin(t * speed) * 0.2;

    // Floppy arm Z rotation (TABS signature wobble)
    b.leftShoulder.rotation.z = Math.sin(t * speed * 1.3) * wobble * 2;
    b.rightShoulder.rotation.z = Math.sin(t * speed * 1.3 + 1) * wobble * 2;

    // Hip bounce
    b.hip.rotation.z = Math.sin(t * speed) * 0.04;
  }

  private _animateAttack(dt: number): void {
    if (this.attackStyle === "mammoth") {
      this._animateAttackMammoth(dt);
      return;
    }
    this._animateAttackHumanoid(dt);
  }

  private _animateAttackHumanoid(dt: number): void {
    this._attackTimer += dt;
    const b = this._body;
    const t = this._time + this._wobblePhase;
    const progress = Math.min(this._attackTimer / this._attackDuration, 1);

    if (progress < 0.5) {
      // Wind-up: pull arm back
      const windUp = progress * 2; // 0 to 1
      b.rightShoulder.rotation.x = -1.5 * windUp;
      b.rightShoulder.rotation.z = 0.3 * windUp;
      b.rightElbow.rotation.x = -0.8 * windUp;
      // Lean back
      b.torso.rotation.x = -0.15 * windUp;
    } else {
      // Swing forward
      const swing = (progress - 0.5) * 2; // 0 to 1
      const eased = 1 - Math.pow(1 - swing, 3); // ease-out cubic
      b.rightShoulder.rotation.x = -1.5 + 2.8 * eased;
      b.rightShoulder.rotation.z = 0.3 - 0.3 * eased;
      b.rightElbow.rotation.x = -0.8 + 0.8 * eased;
      // Lean forward with swing
      b.torso.rotation.x = -0.15 + 0.35 * eased;
    }

    // Left arm floppy reaction
    b.leftShoulder.rotation.x = Math.sin(t * 6) * 0.15;
    b.leftShoulder.rotation.z = Math.sin(t * 7 + 1) * 0.1;

    // Legs planted with wobble
    b.leftHip.rotation.x = Math.sin(t * 4) * 0.05;
    b.rightHip.rotation.x = 0.15; // step forward
    b.leftKnee.rotation.x = 0;
    b.rightKnee.rotation.x = 0.1;

    // Head tracks forward
    b.neck.rotation.x = 0.1;
    b.neck.rotation.z = Math.sin(t * 5) * 0.05;

    if (progress >= 1) {
      this._state = AnimState.Idle;
    }
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
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 8,
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
