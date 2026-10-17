import { ArcRotateCamera, ArcRotateCameraPointersInput, Vector3, Scene } from "@babylonjs/core";

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

// Battle follow: how far the fight's middle may sit off the view's before the view slides after it, and how fast it slides.
const FOLLOW_SLACK = 0.6;
const FOLLOW_SPEED = 2.5;
// How fast the view goes to where flung bodies are landing (see followBattle): a throw lands in about a second
const LANDING_FOLLOW_SPEED = 6;
// Spectator low (see followBattle): bodies in the air at once that call for it, the eye's height off the grass, its pitch above level, how long it holds after
// the launch and how fast it eases in and out.
const LOW_LAUNCH = 3;
const LOW_EYE = 0.45;
const LOW_PITCH = 0.3;
const LOW_HOLD = 1.2;
const LOW_EASE = 4;
const FOLLOW_DROP = 0.9;
const FOLLOW_DROP_SPEED = 0.8;

/** A body on the field as the result shot sees it: where it stands or lies, its footprint radius, its base and height, and whether it is one of the winners. */
// The settled victory shot keeps turning round the survivors at this many radians a second (about 3 degrees), so the result is never a still frame.
const RESULT_DRIFT_RATE = 0.055;

export interface ShotBody { x: number; z: number; y: number; r: number; h: number; standing: boolean; survivor: boolean; giant: boolean; /** Unit vector along the ground the body's front points down. */ fx: number; fz: number }

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
  /** Where the melee swoop, and each follow step since, left the camera; null once anything else has moved it, and then it is the player's. */
  private _battleAim: CameraViewState | null = null;
  private _standoffAim: CameraViewState | null = null;
  private _battleDrop = 0;
  private _prebattleView: CameraViewState | null = null;
  private _prebattleBetaLimits: { lower: number | null; upper: number | null; radius: number | null; fov: number } | null = null;

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
      // Right-drag pans: at 15 a small flick threw the view across the field
      this.camera.panningSensibility = 90;
      this.camera.panningInertia = 0.8;
      // Pan along the ground, not the screen plane: from the tilted view, dragging up or down drove the aim point into the map
      this.camera.mapPanning = true;
      this.camera.angularSensibilityX = 500;
      this.camera.angularSensibilityY = 500;
      this.camera.pinchPrecision = 40;
      this.camera.useNaturalPinchZoom = true;
      this.camera.attachControl(canvas, true);
      // The left button paints units (see main.ts), as in TABS: the camera keeps middle-drag to rotate and right-drag to pan
      const pointers = this.camera.inputs.attached.pointers as ArcRotateCameraPointersInput | undefined;
      if (pointers) pointers.buttons = [1, 2];
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
    this._resultDrift = 0;
    this._battleAim = null;
    this._standoffAim = null;
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
    center: { x: number; z: number; halfSpan?: number; depth?: number; tall?: number; near?: { x: number; z: number; halfWidth?: number } },
    durationSeconds = 1.1,
  ): CameraViewState {
    if (!this._prebattleView) {
      this._prebattleView = this.captureViewState();
      this._prebattleBetaLimits = {
        lower: this.camera.lowerBetaLimit,
        upper: this.camera.upperBetaLimit,
        radius: this.camera.lowerRadiusLimit,
        fov: this.camera.fov,
      };
    }
    // Armies that hold their ground (halfSpan > 0) must both fit: the frame is ~0.63 radius wide each side of the target.
    const spanRadius = ((center.halfSpan ?? 0) + 1.5) / 0.6;
    // The eye stands clear of the rank nearest to it, so the fight spreading sideways does not swallow the camera.
    // Six metres off its feet: the rank comes on toward the eye as the fight spreads, and must not reach it. At five and a half a giant over the line ran out of the top and side of the frame, and at seven and a half the men were a quarter of the frame high.
    // A giant (over 3 m) rears and lifts its tusks to a third again its height: the eye stands back until that clears the top of the frame, and only then, so a field of men keeps the close six.
    const giant = (center.tall ?? 0) > 3 ? (center.tall ?? 0) * 1.35 : 0;
    const clearRadius = (center.depth ?? 0) + Math.max(6.0, giant / 0.58);
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
        ahead * Math.cos(side) + across * Math.sin(side) + (Math.abs(across * Math.cos(side) - ahead * Math.sin(side)) + 1.2) / 0.48; // 0.6 fitted the 0.8 lens: under the 0.65 one the crews at the ends of the line were cut by the frame edges
      const halfWidth = center.near.halfWidth ?? 0;
      to.radius = Math.min(14, Math.max(4.5, fit(halfWidth), fit(-halfWidth)));
      this.camera.fov = 0.65; // at the placement 0.8 the crews were a sixth of the frame high under more than half a frame of sky
      // The eye sits 0.3 lower than over a melee and never under half a metre: from 1.5 less the pitch the near crews were seen from above their caps
      to.target.y = Math.max(1.2, 0.5 - to.radius * Math.cos(to.beta));
      this.camera.lowerRadiusLimit = Math.min(this.camera.lowerRadiusLimit ?? to.radius, to.radius);
    } else {
      // Melee: the eye sits at head height and looks a touch up, so the ground is the bottom third of the
      // frame under the nearest rank's feet, and the fight and the giants over it stand against the sky.
      this.camera.fov = 0.65; // at the placement 0.8 the front rank was a quarter of the frame high under half a frame of sky
      to.alpha = -Math.PI / 3; // a sixth of a turn round toward one end of the line, so the ranks recede across the frame: dead side-on the fight was a flat frieze, and twelve degrees round did not show
      const pitchUp = 0.2; // at 0.12 the horizon sat above the middle of the frame, the bottom fifth was bare grass and a giant rearing over the line ran out of the top
      to.beta = Math.PI / 2 + pitchUp;
      to.target.y = 1.6 + to.radius * Math.sin(pitchUp);
      this.camera.upperBetaLimit = Math.max(this.camera.upperBetaLimit ?? to.beta, to.beta);
      this.camera.lowerBetaLimit = Math.min(this.camera.lowerBetaLimit ?? to.beta, to.beta);
    }
    to.alpha = from.alpha + wrap(to.alpha - from.alpha); // swing the short way round
    this._battleAim = center.near ? null : to;
    // A standoff view does not follow the lines, but it does go to a landing (see followBattle)
    this._standoffAim = center.near ? to : null;
    this._battleDrop = 0;
    this._resultDrift = 0;
    this._transition = { from, to, elapsed: 0, duration: Math.max(0.01, durationSeconds) };
    return to;
  }

  // ─── Victory shot ───
  /** Drift from the battle view onto the survivors: a slow close shot, a human winner about half the height between the result bands. */
  frameSurvivors(
    box: { minX: number; maxX: number; minZ: number; maxZ: number; baseY: number; height: number; focus: { x: number; z: number }; giant?: { x: number; z: number }; group?: { x: number; z: number }; bodies?: ShotBody[] },
    durationSeconds = 2,
  ): CameraViewState | null {
    if (!this._prebattleView) return null;
    if (this._prebattleBetaLimits) this.camera.fov = this._prebattleBetaLimits.fov; // the fits below are for the placement lens
    this._battleAim = null;
    this._standoffAim = null;
    const from = this.captureViewState();
    const halfSpan = Math.hypot(box.maxX - box.minX, box.maxZ - box.minZ) / 2;
    // The bands cover the top and bottom of the frame, so a survivor gets ~0.28 radius of height either side of
    // the target. A giant among the survivors is not fitted: the shot stands 4.5 to 6 off the human-sized survivor farthest from it and aims 0.8 above the ground, so the giant crops and the humans are not specks under it.
    const giant = box.height > 4.2;
    const tall = Math.min(box.height, 4.2);
    const fitHeight = (tall * 0.5 + 0.7) / 0.28;
    const fitSpan = (halfSpan + 1.5) / 0.6;
    // A group too spread out for a close shot is not fitted: the camera goes to the survivor nearest its middle.
    const MAX_RADIUS = 11;
    const spread = fitSpan > MAX_RADIUS;
    // With the giant's place known the eye stands between it and the focus, its back to the giant: as far off the focus as leaves the giant 2.5 clear behind it,
    // from the 4.5 at which a man is whole between the bands up to 6, and aimed a little under his middle: at 3 the eye stood inside the crowd and one back filled the frame.
    const giantOff = giant && box.giant ? Math.hypot(box.giant.x - box.focus.x, box.giant.z - box.focus.z) : 0;
    const giantRadius = Math.min(6, Math.max(4.5, giantOff - 2.5));
    const radius = giant ? giantRadius : Math.min(MAX_RADIUS, Math.max(4.5, fitHeight, spread ? 0 : fitSpan));
    // A giant too near the focus to stand 4.5 clear behind the eye is not behind it at all: its tusks and legs came round into the frame. The eye goes a quarter turn round the focus and stands side-on to the giant,
    // and aims GIANT_SHY past the men on the side away from it, so its near leg and tusk are off the edge of the frame and not the near third of it. Turning further round, either way, only brought more of it in.
    const sideOn = giant && giantOff > 0.01 && giantOff - 4.5 < 3;
    const farSide = sideOn ? 0.5 * Math.PI : 0;
    const GIANT_SHY = 1.0; // at 1.5 the giant was gone but the men stood in the near third of the frame beside an empty field
    const shy = sideOn && box.giant ? { x: (box.focus.x - box.giant.x) / giantOff * GIANT_SHY, z: (box.focus.z - box.giant.z) / giantOff * GIANT_SHY } : { x: 0, z: 0 };
    const awayFromGiant = giant && box.giant && giantOff > 0.01 ? Math.atan2(box.giant.z - box.focus.z, box.giant.x - box.focus.x) + farSide : from.alpha;
    const to: CameraViewState = {
      alpha: from.alpha + Math.atan2(Math.sin(awayFromGiant - from.alpha), Math.cos(awayFromGiant - from.alpha)), // swing the short way round
      // Beside a giant the eye stands a little above the men and looks down on them, so the ranks behind the nearest man show over him: from below, his torso covered them. Only a little: steeper, the grass filled the frame and left no sky over them.
      // And it aims at the middle of the men standing round the focus, not at the one man, who put the rest of them off to one side and cut by the edge.
      beta: giant ? Math.PI / 2.1 : Math.PI / 1.9,
      radius,
      target: {
        x: giant ? (box.group ?? box.focus).x + shy.x : spread ? box.focus.x : (box.minX + box.maxX) / 2,
        y: box.baseY + (giant ? 0.8 : Math.max(1, tall * 0.5)),
        z: giant ? (box.group ?? box.focus).z + shy.z : spread ? box.focus.z : (box.minZ + box.maxZ) / 2,
      },
    };
    if (box.bodies) {
      this._pickSubject(to, box.bodies);
      to.alpha = from.alpha + Math.atan2(Math.sin(to.alpha - from.alpha), Math.cos(to.alpha - from.alpha)); // still the short way round
    }
    this.camera.lowerRadiusLimit = Math.min(this.camera.lowerRadiusLimit ?? to.radius, to.radius);
    this.camera.upperBetaLimit = Math.max(this.camera.upperBetaLimit ?? to.beta, to.beta);
    this._transition = { from, to, elapsed: 0, duration: Math.max(0.01, durationSeconds) };
    // Once the swoop is down the shot does not freeze: it keeps turning slowly round the survivors (see advanceTransition)
    this._resultDrift = RESULT_DRIFT_RATE * (to.alpha >= from.alpha ? 1 : -1);
    return to;
  }

  /**
   * The shot fitted above is only the first subject tried. Every knot of surviving men is one the shot could take instead, and so is every surviving giant, fitted whole
   * between the bands. Each is tried from twelve places round it, and a place is scored by every body on the field, at any depth, that its frame would cut:
   * one partly inside the side edges and the result bands and partly out, weighed by how big it stands there. The subject and place that cut least win;
   * the fitted shot is kept unless another is plainly cleaner. A winner counts for the shot by the face he shows it: whole from the front, less side-on, and
   * against it from behind, so of two clean places the one the survivors and the giant's head look toward wins. A winning giant cut by a band or an edge is a
   * headless wall and costs more than any other cut body.
   */
  private _pickSubject(to: CameraViewState, bodies: ShotBody[]): void {
    const BAND = 0.28; // the height either side of the aim that the result bands leave, per unit of distance
    const STEPS = 12;
    const FACE_SIDE = 0.4; // what a winner seen side-on counts for, of the 1 he counts face-on; his back counts 0.2 against
    const HEADLESS = 2; // added to the cut of a winning giant
    const CORPSE_CUT = 0.15; // what a cut corpse counts for, of a cut standing body
    const halfWidth = Math.tan(this.camera.fov / 2) * this.camera.getEngine().getAspectRatio(this.camera);
    const score = (view: CameraViewState): number => {
      const reach = view.radius * Math.sin(view.beta);
      const eyeX = view.target.x + Math.cos(view.alpha) * reach;
      const eyeZ = view.target.z + Math.sin(view.alpha) * reach;
      const eyeY = view.target.y + view.radius * Math.cos(view.beta);
      const pitch = (view.target.y - eyeY) / reach;
      let cuts = 0;
      let shown = 0;
      let giants = 0;
      for (const b of bodies) {
        const dx = b.x - eyeX;
        const dz = b.z - eyeZ;
        const along = -(dx * Math.cos(view.alpha) + dz * Math.sin(view.alpha)); // distance down the line of sight
        const aside = Math.abs(dx * Math.sin(view.alpha) - dz * Math.cos(view.alpha));
        if (along + b.r < 0.3) continue; // behind the lens
        if (Math.hypot(dx, dz) < b.r + 0.8) {
          cuts += 6; // the lens stands in it
          continue;
        }
        const depth = Math.max(along, 0.3);
        if ((aside - b.r) / depth > halfWidth) continue; // off the side of the frame
        const top = (b.y + b.h - eyeY) / depth - pitch;
        const foot = (b.y - eyeY) / depth - pitch;
        if (foot > BAND || top < -BAND) continue; // wholly behind a band
        const size = Math.min(1, Math.max(b.h, b.r * 2) / depth / (BAND * 2)); // its share of the height between the bands
        if ((aside + b.r) / depth <= halfWidth && top <= BAND && foot >= -BAND) {
          // Whole in the frame: a winner is what the shot is of, and anyone else standing this side of the subject is in its way
          // front: 1 looking straight at the lens, -1 with his back to it
          const front = ((eyeX - b.x) * b.fx + (eyeZ - b.z) * b.fz) / Math.max(0.01, Math.hypot(dx, dz));
          // The men together count for 1.5 at most; a giant counts on top of them, so a crowd round its feet does not drown out which way its head points
          if (b.survivor && b.giant) giants += Math.min(1.5, size * 2) * (FACE_SIDE + (1 - FACE_SIDE) * front);
          else if (b.survivor) shown += Math.min(0.25, size) * (FACE_SIDE + (1 - FACE_SIDE) * front);
          else if (b.standing && along < reach * 0.6) cuts += size;
          continue;
        }
        // A corpse run off by an edge or the lower band is ground litter and counts little; at full weight the dead heaped before a giant kept every place in front of it out
        cuts += (0.3 + 3 * size) * (b.standing ? 1 : CORPSE_CUT) + (b.survivor && b.giant ? HEADLESS : 0);
      }
      return cuts - Math.max(-1.5, Math.min(1.5, shown)) - giants;
    };
    const subjects: { x: number; y: number; z: number; radius: number; beta: number }[] = [];
    const men = bodies.filter((b) => b.survivor && !b.giant);
    const stride = Math.max(1, Math.ceil(men.length / 16));
    for (let i = 0; i < men.length; i += stride) {
      // The men within 3 of this one are a knot: aimed at their middle, from as far off as holds them all and never nearer than a man stands whole
      const knot = men.filter((m) => Math.hypot(m.x - men[i].x, m.z - men[i].z) <= 3);
      const x = knot.reduce((sum, m) => sum + m.x, 0) / knot.length;
      const z = knot.reduce((sum, m) => sum + m.z, 0) / knot.length;
      const half = Math.max(...knot.map((m) => Math.hypot(m.x - x, m.z - z)));
      subjects.push({ x, y: to.target.y, z, radius: Math.max(4.5, (half + 1.5) / 0.6), beta: to.beta });
    }
    for (const g of bodies) {
      // A giant is a subject too, shot from a man's waist looking up at it: the eye stands 1 off the ground, far enough back that the giant's top is just under
      // the upper band and its whole length inside the edges, and aims GIANT_PITCH above level. From mid-height, level, the lower band cut the feet off every
      // man and corpse standing this side of the giant; from down here the ground is in the frame from 6 in front of the lens.
      if (!g.survivor || !g.giant) continue;
      const GIANT_PITCH = 0.12;
      const back = Math.max((g.h - 1) / (BAND - 0.04 + GIANT_PITCH), (g.r + 1.5) / 0.6);
      subjects.push({ x: g.x, y: g.y + 1 + GIANT_PITCH * back, z: g.z, radius: back * Math.hypot(1, GIANT_PITCH), beta: Math.PI / 2 + Math.atan(GIANT_PITCH) });
    }
    let best = to;
    let bestScore = score(to) - 0.2;
    for (const s of subjects) {
      // Out from the fitted place both ways, so of two equally clean places the smaller swing is found first and kept
      for (let i = 0; i < STEPS; i++) {
        const view: CameraViewState = { alpha: to.alpha + Math.ceil(i / 2) * (i % 2 === 0 ? -1 : 1) * (2 * Math.PI / STEPS), beta: s.beta, radius: s.radius, target: { x: s.x, y: s.y, z: s.z } };
        const found = score(view);
        if (found < bestScore) {
          best = view;
          bestScore = found;
        }
      }
    }
    to.alpha = best.alpha;
    to.beta = best.beta;
    to.radius = best.radius;
    to.target = best.target;
  }

  // ─── Battle follow ───
  /** The fight walks off from where the lines first met: slide the melee view sideways after its middle, a man's width of slack and FOLLOW_SPEED a second at most, for as long as the player leaves the camera where the swoop put it. */
  followBattle(focus: { x: number; z: number; landing?: { x: number; z: number }; launched?: number }, dt: number): void {
    // While flung bodies are coming down the view goes to where they land, the standoff view too, faster than it follows the lines
    const aim = this._battleAim ?? (focus.landing ? this._standoffAim : null);
    if (!aim || this._transition) return;
    const cam = this.camera;
    const moved =
      Math.abs(cam.alpha - aim.alpha) > 0.001 ||
      Math.abs(cam.beta - this._lowBeta - aim.beta) > 0.001 ||
      Math.abs(cam.radius - aim.radius) > 0.01 ||
      Math.abs(cam.target.x - this._shakeOffset.x - aim.target.x) > 0.01 ||
      Math.abs(cam.target.y - this._shakeOffset.y - this._lowRise - aim.target.y) > 0.01 ||
      Math.abs(cam.target.z - this._shakeOffset.z - aim.target.z) > 0.01;
    if (moved) {
      this._battleAim = null;
      this._standoffAim = null;
      this._lowBeta = 0;
      this._lowRise = 0;
      this._lowHold = 0;
      this._lowBlend = 0;
      return;
    }
    // After the swoop the view sinks FOLLOW_DROP, its pitch unchanged: the horizon stays where it was and the feet of the nearest rank come up into the frame.
    const drop = aim === this._battleAim ? Math.min(FOLLOW_DROP - this._battleDrop, FOLLOW_DROP_SPEED * dt) : 0;
    if (drop > 0) {
      this._battleDrop += drop;
      aim.target.y -= drop;
      cam.target.y -= drop;
    }
    // Spectator low (trailer_3_sheet_03 r1c2, trailer_3_sheet_01 r1c2): when a blast throws LOW_LAUNCH or more bodies at once the lens drops to LOW_EYE above
    // the grass and pitches LOW_PITCH up, so the launch is seen from underneath against the sky; it holds there LOW_HOLD after the last body is in the air and
    // eases back. Kept as an offset over the aim, so following and the viewer's own moves work as before.
    if ((focus.launched ?? 0) >= LOW_LAUNCH) this._lowHold = LOW_HOLD;
    this._lowHold = Math.max(0, this._lowHold - dt);
    this._lowBlend += ((this._lowHold > 0 ? 1 : 0) - this._lowBlend) * Math.min(1, dt * LOW_EASE);
    const lowBeta = Math.PI / 2 + LOW_PITCH;
    const beta = (lowBeta - aim.beta) * this._lowBlend;
    const rise = (LOW_EYE - aim.radius * Math.cos(lowBeta) - aim.target.y) * this._lowBlend;
    if (this._lowBlend > 0.001) this.camera.upperBetaLimit = Math.max(this.camera.upperBetaLimit ?? lowBeta, lowBeta);
    cam.beta += beta - this._lowBeta;
    cam.target.y += rise - this._lowRise;
    this._lowBeta = beta;
    this._lowRise = rise;

    const goal = focus.landing ?? focus;
    const dx = goal.x - aim.target.x;
    const dz = goal.z - aim.target.z;
    const off = Math.hypot(dx, dz);
    if (off <= FOLLOW_SLACK) return;
    const step = Math.min(off - FOLLOW_SLACK, (focus.landing ? LANDING_FOLLOW_SPEED : FOLLOW_SPEED) * dt) / off;
    aim.target.x += dx * step;
    aim.target.z += dz * step;
    cam.target.x += dx * step;
    cam.target.z += dz * step;
  }

  /** Undo the battle swoop: restore the placement view, its pitch limits and its zoom floor. */
  returnToPlacementView(): void {
    this._transition = null;
    this._resultDrift = 0;
    if (this._prebattleBetaLimits) {
      this.camera.lowerBetaLimit = this._prebattleBetaLimits.lower;
      this.camera.upperBetaLimit = this._prebattleBetaLimits.upper;
      this.camera.lowerRadiusLimit = this._prebattleBetaLimits.radius;
      this.camera.fov = this._prebattleBetaLimits.fov;
    }
    if (this._prebattleView) this.restoreViewState(this._prebattleView);
    this._prebattleView = null;
    this._prebattleBetaLimits = null;
  }

  /** Advance the swoop tween; called from update() and from the deterministic time stepper. */
  advanceTransition(dt: number): void {
    const t = this._transition;
    if (!t) {
      // The victory shot, settled, keeps orbiting its subject in the direction it swooped, a few degrees a second, as the reference result camera keeps panning
      if (this._resultDrift !== 0) this.camera.alpha += this._resultDrift * dt;
      return;
    }
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

  // Spectator low (see followBattle): seconds left to hold it, how far in it is (0 to 1), and the pitch and lift it has put on the camera over the aim
  private _lowHold = 0;
  private _lowBlend = 0;
  private _lowBeta = 0;
  private _lowRise = 0;

  // The victory shot's slow orbit once its swoop has settled, radians a second (signed); 0 when there is none
  private _resultDrift = 0;

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

    // A viewer who takes the camera stops the victory drift
    if (this._motionIntent.rotate !== 0 || this._motionIntent.panX !== 0 || this._motionIntent.panY !== 0 || this._motionIntent.vertical !== 0) this._resultDrift = 0;
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
