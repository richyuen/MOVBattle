import { ArcRotateCamera, Vector3, Scene } from "@babylonjs/core";

export type GalleryCameraPresetId =
  | "faction_lineup_close"
  | "heroes_bosses_close"
  | "war_machine_wide_close"
  | "giants_wide_close"
  | "state_read_duel"
  | "vehicle_detail_close"
  | "crew_mount_readability"
  | "silhouette_lineup";

export interface CameraViewState {
  alpha: number;
  beta: number;
  radius: number;
  target: { x: number; y: number; z: number };
}

export interface GalleryCameraOverride {
  alpha?: number;
  beta?: number;
  radius?: number;
  target?: { x: number; y: number; z: number };
}

export class CameraController {
  readonly camera: ArcRotateCamera;
  readonly isTouchDevice: boolean;
  private _shakeOffset = Vector3.Zero();
  private _motionIntent = {
    panX: 0,
    panY: 0,
    rotate: 0,
    vertical: 0,
  };
  private readonly _panSpeed = 0.42;
  private readonly _rotationSpeed = 1.25;
  private readonly _verticalSpeed = 4.5;
  private readonly _minTargetY = -2.5;
  private readonly _maxTargetY = 8;
  private _transition: { from: CameraViewState; to: CameraViewState; elapsed: number; duration: number } | null = null;
  private _prebattleView: CameraViewState | null = null;
  private _prebattleBetaLimits: { lower: number | null; upper: number | null; radius: number | null } | null = null;

  constructor(scene: Scene, canvas: HTMLCanvasElement) {
    const isMobile = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    this.isTouchDevice = isMobile;

    this.camera = new ArcRotateCamera(
      "camera",
      -Math.PI / 2,   // alpha (yaw)
      Math.PI / 6,     // beta (pitch): steep, near top-down placement view with the far rim at the top of the frame
      88,              // radius (zoom): the island fills the frame, its end rims at the left and right edges
      Vector3.Zero(),  // target
      scene,
    );

    this.camera.lowerRadiusLimit = 8;
    this.camera.upperRadiusLimit = 120;
    this.camera.wheelPrecision = 8;

    if (isMobile) {
      // Mobile: fixed camera angle, one-finger pan, two-finger pinch zoom
      this.camera.pinchPrecision = 40;
      this.camera.useNaturalPinchZoom = true;

      // Disable default touch rotation by setting extreme angular sensibility
      this.camera.angularSensibilityX = 1e12;
      this.camera.angularSensibilityY = 1e12;
      // Disable built-in panning (we handle single-finger pan manually)
      this.camera.panningSensibility = 0;

      this.camera.lowerBetaLimit = this.camera.beta;
      this.camera.upperBetaLimit = this.camera.beta;

      this.camera.attachControl(canvas, true);

      // Manual single-finger panning
      let lastTouchX = 0;
      let lastTouchY = 0;
      let isPanning = false;

      canvas.addEventListener("touchstart", (e) => {
        if (e.touches.length === 1) {
          isPanning = true;
          lastTouchX = e.touches[0].clientX;
          lastTouchY = e.touches[0].clientY;
        } else {
          isPanning = false;
        }
      }, { passive: true });

      canvas.addEventListener("touchmove", (e) => {
        if (!isPanning || e.touches.length !== 1) {
          isPanning = false;
          return;
        }

        const dx = e.touches[0].clientX - lastTouchX;
        const dy = e.touches[0].clientY - lastTouchY;
        lastTouchX = e.touches[0].clientX;
        lastTouchY = e.touches[0].clientY;

        this.panByScreenDelta(dx, dy);
      }, { passive: true });

      canvas.addEventListener("touchend", () => {
        isPanning = false;
      }, { passive: true });
    } else {
      // Desktop: normal controls
      this.camera.lowerBetaLimit = 0.2;
      this.camera.upperBetaLimit = Math.PI / 2.2;
      this.camera.panningSensibility = 15;
      this.camera.angularSensibilityX = 500;
      this.camera.angularSensibilityY = 500;
      this.camera.pinchPrecision = 40;
      this.camera.useNaturalPinchZoom = true;
      this.camera.attachControl(canvas, true);
    }

    // Keyboard rotation (Q/E) handled via game input
  }
  private _applyPanOffsets(offsetX: number, offsetY: number): void {
    const cosA = Math.cos(this.camera.alpha);
    const sinA = Math.sin(this.camera.alpha);

    this.camera.target.x += offsetX * sinA + offsetY * cosA;
    this.camera.target.z += -offsetX * cosA + offsetY * sinA;
  }

  panByScreenDelta(dx: number, dy: number): void {
    const speed = this.camera.radius * 0.003;
    this._applyPanOffsets(dx * speed, dy * speed);
  }

  setMotionIntent(intent: Partial<{ panX: number; panY: number; rotate: number; vertical: number }>): void {
    if (intent.panX !== undefined) this._motionIntent.panX = intent.panX;
    if (intent.panY !== undefined) this._motionIntent.panY = intent.panY;
    if (intent.rotate !== undefined) this._motionIntent.rotate = intent.rotate;
    if (intent.vertical !== undefined) this._motionIntent.vertical = intent.vertical;
  }

  clearMotionIntent(): void {
    this._motionIntent.panX = 0;
    this._motionIntent.panY = 0;
    this._motionIntent.rotate = 0;
    this._motionIntent.vertical = 0;
  }

  captureViewState(): CameraViewState {
    return {
      alpha: this.camera.alpha,
      beta: this.camera.beta,
      radius: this.camera.radius,
      target: {
        x: this.camera.target.x,
        y: this.camera.target.y,
        z: this.camera.target.z,
      },
    };
  }

  restoreViewState(view: CameraViewState): void {
    this._transition = null;
    this.camera.alpha = view.alpha;
    this.camera.beta = view.beta;
    this.camera.radius = view.radius;
    this.camera.target.set(view.target.x, view.target.y, view.target.z);
    this._shakeOffset.setAll(0);
    this._shakeIntensity = 0;
  }

  applyGalleryPreset(presetId: GalleryCameraPresetId, override?: GalleryCameraOverride): CameraViewState {
    const preset = this._getGalleryPreset(presetId);
    const view: CameraViewState = {
      alpha: override?.alpha ?? preset.alpha,
      beta: override?.beta ?? preset.beta,
      radius: override?.radius ?? preset.radius,
      target: override?.target ?? preset.target,
    };
    // Gallery close-ups sit nearer and lower than the free camera's zoom floor and pitch limit
    this.camera.lowerRadiusLimit = Math.min(this.camera.lowerRadiusLimit ?? view.radius, view.radius);
    this.camera.upperBetaLimit = Math.max(this.camera.upperBetaLimit ?? view.beta, view.beta);
    this.restoreViewState(view);
    return view;
  }

  // ─── Battle swoop ───
  /** Swoop from the placement view down to a low, close TABS-style battle view on the clash line. */
  swoopToBattle(
    center: { x: number; z: number; halfSpan?: number; depth?: number; near?: { x: number; z: number; halfWidth?: number } },
    durationSeconds = 1.1,
  ): CameraViewState {
    if (!this._prebattleView) {
      this._prebattleView = this.captureViewState();
      this._prebattleBetaLimits = {
        lower: this.camera.lowerBetaLimit,
        upper: this.camera.upperBetaLimit,
        radius: this.camera.lowerRadiusLimit,
      };
    }
    // Armies that hold their ground (halfSpan > 0) must both fit: the frame is ~0.63 radius wide each side of the target.
    const spanRadius = ((center.halfSpan ?? 0) + 1.5) / 0.6;
    // The eye stands clear of the rank nearest to it, so the fight spreading sideways does not swallow the camera.
    // Five and a half metres off its feet: the rank comes on toward the eye as the fight spreads, and must not reach it.
    const clearRadius = (center.depth ?? 0) + 5.5;
    const to: CameraViewState = {
      alpha: -Math.PI / 2,
      beta: Math.PI / 1.9,    // eye just below unit head height, looking slightly up so sky fills the top third
      radius: Math.min(18, Math.max(6, spanRadius, clearRadius)), // four body lengths back from the nearest rank
      target: { x: center.x, y: 1.5, z: center.z },   // eye near 1 m, so the grass in front of the nearest rank stays a thin strip
    };
    // The battle view sits below the placement pitch limits and inside the zoom floor; widen them for the fight.
    this.camera.lowerRadiusLimit = Math.min(this.camera.lowerRadiusLimit ?? to.radius, to.radius);
    this.camera.upperBetaLimit = Math.max(this.camera.upperBetaLimit ?? to.beta, to.beta);
    this.camera.lowerBetaLimit = Math.min(this.camera.lowerBetaLimit ?? to.beta, to.beta);
    const from = this.captureViewState();
    const wrap = (angle: number) => Math.atan2(Math.sin(angle), Math.cos(angle));
    if (center.near) {
      // Standoff: stand close behind the holding formation and well off its firing axis, so the line recedes
      // across the foreground and the enemy it shoots at sits across the field as the background.
      const behind = Math.atan2(center.near.z - center.z, center.near.x - center.x);
      const toSide = wrap(to.alpha - behind);
      const side = Math.sign(toSide) * Math.min(Math.abs(toSide), 0.55);
      to.alpha = behind + side;
      to.target.x = center.x + (center.near.x - center.x) * 0.75;
      to.target.z = center.z + (center.near.z - center.z) * 0.75;
      // Eye distance at which a line end `across` the axis is whole in frame: its depth along the view must be
      // at least its sideways offset from the view axis (plus a body of margin) over the frame half-width.
      const ahead = Math.hypot(center.near.x - to.target.x, center.near.z - to.target.z);
      const fit = (across: number): number =>
        ahead * Math.cos(side) + across * Math.sin(side) + (Math.abs(across * Math.cos(side) - ahead * Math.sin(side)) + 1.2) / 0.6;
      const halfWidth = center.near.halfWidth ?? 0;
      to.radius = Math.min(14, Math.max(4.5, fit(halfWidth), fit(-halfWidth)));
      this.camera.lowerRadiusLimit = Math.min(this.camera.lowerRadiusLimit ?? to.radius, to.radius);
    } else {
      // Melee: the eye sits at head height and looks a touch down, so it sees past the nearest rank's
      // shoulders to the clash, and the horizon lies just above the middle of the frame with sky over it.
      const pitchUp = -0.04;
      to.beta = Math.PI / 2 + pitchUp;
      to.target.y = 1.6 + to.radius * Math.sin(pitchUp);
      this.camera.upperBetaLimit = Math.max(this.camera.upperBetaLimit ?? to.beta, to.beta);
      this.camera.lowerBetaLimit = Math.min(this.camera.lowerBetaLimit ?? to.beta, to.beta);
    }
    to.alpha = from.alpha + wrap(to.alpha - from.alpha); // swing the short way round
    this._transition = { from, to, elapsed: 0, duration: Math.max(0.01, durationSeconds) };
    return to;
  }

  // ─── Victory shot ───
  /** Drift from the battle view onto the survivors: a slow close shot, a human winner about half the height between the result bands. */
  frameSurvivors(
    box: { minX: number; maxX: number; minZ: number; maxZ: number; baseY: number; height: number; focus: { x: number; z: number } },
    durationSeconds = 2,
  ): CameraViewState | null {
    if (!this._prebattleView) return null;
    const from = this.captureViewState();
    const halfSpan = Math.hypot(box.maxX - box.minX, box.maxZ - box.minZ) / 2;
    // The bands cover the top and bottom of the frame, so a survivor gets ~0.28 radius of height either side of
    // the target. A giant among the survivors is not fitted: the shot stands 6.5 off the survivor nearest the middle of the group and aims 1.2 above the ground, so the giant crops and the humans are not specks under it.
    const giant = box.height > 4.2;
    const tall = Math.min(box.height, 4.2);
    const fitHeight = (tall * 0.5 + 0.7) / 0.28;
    const fitSpan = (halfSpan + 1.5) / 0.6;
    // A group too spread out for a close shot is not fitted: the camera goes to the survivor nearest its middle.
    const MAX_RADIUS = 11;
    const spread = fitSpan > MAX_RADIUS;
    const radius = giant ? 6.5 : Math.min(MAX_RADIUS, Math.max(4.5, fitHeight, spread ? 0 : fitSpan));
    const to: CameraViewState = {
      alpha: from.alpha,
      beta: Math.PI / 1.9,
      radius,
      target: {
        x: spread || giant ? box.focus.x : (box.minX + box.maxX) / 2,
        y: box.baseY + (giant ? 1.2 : Math.max(1, tall * 0.5)),
        z: spread || giant ? box.focus.z : (box.minZ + box.maxZ) / 2,
      },
    };
    this.camera.lowerRadiusLimit = Math.min(this.camera.lowerRadiusLimit ?? to.radius, to.radius);
    this.camera.upperBetaLimit = Math.max(this.camera.upperBetaLimit ?? to.beta, to.beta);
    this._transition = { from, to, elapsed: 0, duration: Math.max(0.01, durationSeconds) };
    return to;
  }

  /** Undo the battle swoop: restore the placement view, its pitch limits and its zoom floor. */
  returnToPlacementView(): void {
    this._transition = null;
    if (this._prebattleBetaLimits) {
      this.camera.lowerBetaLimit = this._prebattleBetaLimits.lower;
      this.camera.upperBetaLimit = this._prebattleBetaLimits.upper;
      this.camera.lowerRadiusLimit = this._prebattleBetaLimits.radius;
    }
    if (this._prebattleView) this.restoreViewState(this._prebattleView);
    this._prebattleView = null;
    this._prebattleBetaLimits = null;
  }

  /** Advance the swoop tween; called from update() and from the deterministic time stepper. */
  advanceTransition(dt: number): void {
    const t = this._transition;
    if (!t) return;
    t.elapsed += dt;
    const u = Math.min(1, t.elapsed / t.duration);
    const e = u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2;
    const lerp = (a: number, b: number) => a + (b - a) * e;
    this.camera.alpha = lerp(t.from.alpha, t.to.alpha);
    this.camera.beta = lerp(t.from.beta, t.to.beta);
    this.camera.radius = lerp(t.from.radius, t.to.radius);
    this.camera.target.set(
      lerp(t.from.target.x, t.to.target.x),
      lerp(t.from.target.y, t.to.target.y),
      lerp(t.from.target.z, t.to.target.z),
    );
    if (u >= 1) this._transition = null;
  }

  // ─── Screen Shake ───
  private _shakeIntensity = 0;
  private _shakeDamping = 0.92;

  shake(intensity: number): void {
    this._shakeIntensity = Math.max(this._shakeIntensity, intensity);
  }

  update(_dt: number): void {
    if (this._shakeOffset.lengthSquared() > 0) {
      this.camera.target.subtractInPlace(this._shakeOffset);
      this._shakeOffset.setAll(0);
    }
    this.advanceTransition(_dt);

    if (this._motionIntent.rotate !== 0) {
      this.camera.alpha += this._motionIntent.rotate * this._rotationSpeed * _dt;
    }

    if (this._motionIntent.panX !== 0 || this._motionIntent.panY !== 0) {
      const heldPanScale = this.camera.radius * this._panSpeed * _dt;
      this._applyPanOffsets(
        this._motionIntent.panX * heldPanScale,
        this._motionIntent.panY * heldPanScale,
      );
    }

    if (this._motionIntent.vertical !== 0) {
      const nextY = this.camera.target.y + this._motionIntent.vertical * this._verticalSpeed * _dt;
      this.camera.target.y = Math.min(this._maxTargetY, Math.max(this._minTargetY, nextY));
    }

    if (this._shakeIntensity > 0.001) {
      this._shakeOffset.x = (Math.random() - 0.5) * this._shakeIntensity;
      this._shakeOffset.y = (Math.random() - 0.5) * this._shakeIntensity * 0.5;
      this.camera.target.addInPlace(this._shakeOffset);
      this._shakeIntensity *= this._shakeDamping;
    } else {
      this._shakeIntensity = 0;
    }
  }

  private _getGalleryPreset(presetId: GalleryCameraPresetId): CameraViewState {
    switch (presetId) {
      case "faction_lineup_close":
        return {
          alpha: -Math.PI / 2.75,
          beta: Math.PI / 3.9,
          radius: 22,
          target: { x: 0, y: 1.35, z: 0 },
        };
      case "heroes_bosses_close":
        return {
          alpha: -Math.PI / 2.7,
          beta: Math.PI / 3.95,
          radius: 21,
          target: { x: 0, y: 1.75, z: 0 },
        };
      case "war_machine_wide_close":
        return {
          alpha: -Math.PI / 2.78,
          beta: Math.PI / 3.8,
          radius: 27,
          target: { x: 0, y: 1.8, z: 0 },
        };
      case "giants_wide_close":
        return {
          alpha: -Math.PI / 2.7,
          beta: Math.PI / 3.75,
          radius: 31,
          target: { x: 0, y: 2.6, z: 0 },
        };
      case "state_read_duel":
        return {
          alpha: -Math.PI / 2.85,
          beta: Math.PI / 3.9,
          radius: 22,
          target: { x: -1, y: 1.6, z: 0 },
        };
      case "vehicle_detail_close":
        return {
          alpha: -Math.PI / 2.74,
          beta: Math.PI / 3.7,
          radius: 18,
          target: { x: 0, y: 1.7, z: 0 },
        };
      case "crew_mount_readability":
        return {
          alpha: -Math.PI / 2.7,
          beta: Math.PI / 3.82,
          radius: 19,
          target: { x: 0, y: 1.75, z: 0 },
        };
      case "silhouette_lineup":
        return {
          alpha: -Math.PI / 2.8,
          beta: Math.PI / 4.15,
          radius: 20,
          target: { x: 0, y: 1.55, z: 0 },
        };
    }
  }
}
