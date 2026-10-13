import {
  Engine, Scene, HemisphericLight, DirectionalLight, Vector3, Color3, Color4,
  PointerEventTypes, ShadowGenerator, MeshBuilder, Mesh, StandardMaterial, VertexBuffer,
} from "@babylonjs/core";
import { DefaultRenderingPipeline } from "@babylonjs/core/PostProcesses/RenderPipeline/Pipelines/defaultRenderingPipeline";
import { SSAO2RenderingPipeline } from "@babylonjs/core/PostProcesses/RenderPipeline/Pipelines/ssao2RenderingPipeline";
import { GlowLayer } from "@babylonjs/core/Layers/glowLayer";
import { ImageProcessingConfiguration } from "@babylonjs/core/Materials/imageProcessingConfiguration";

import { GameStateMachine, GameState } from "./core/gameState";
import { BudgetSystem } from "./core/budgetSystem";
import { BATTLE_CONFIG } from "./core/battleConfig";
import type { BattleResult } from "./core/battleResult";

import { ALL_UNITS, getUnit } from "./data/unitDefinitions";
import type { UnitDefinition } from "./data/unitDefinitions";
import { FactionId, FACTION_NAMES } from "./data/factionColors";
import { FACTION_GLYPH_PATHS, isSolidGlyph, unitGlyphPath } from "./ui/trayGlyphs";
import {
  advanceCampaignSession,
  createCampaignSession,
  getCurrentCampaignDefinition,
  getCurrentCampaignScenario,
  listCampaigns as listCampaignDefinitions,
} from "./campaign/campaignController";
import { validateCampaignDefinitionsStructure } from "./campaign/campaignData";
import type {
  CampaignDefinition,
  CampaignId,
  CampaignPlacementSpec,
  CampaignScenarioDefinition,
  CampaignSessionState,
} from "./campaign/campaignTypes";

import { SimulationSystem } from "./combat/simulationSystem";
import type { SpawnUnitOptions } from "./combat/simulationSystem";
import { ProjectileSystem } from "./combat/projectileSystem";
import { VisualEffects } from "./combat/visualEffects";
import {
  IMPACT_PATHS,
  IMPACT_TIER_RANK,
  ImpactPresentation,
  type ImpactPath,
  type ImpactTier,
} from "./combat/impactPresentation";
import { UnitFactory } from "./units/unitFactory";
import { RuntimeUnit } from "./units/runtimeUnit";
import { getLinkedActorPreset, type LinkedActorSpec } from "./units/linkedActorPresets";
import { getUnitVisual } from "./units/unitVisuals";
import {
  getScenario,
  listScenarioNames,
  type ScenarioAction,
  type ScenarioCapturePhase,
  type ScenarioGallerySpec,
  type ScenarioSpec,
} from "./testing/scenarios";

import { initMaterialFactory } from "./units/materialFactory";
import {
  DEFAULT_BATTLE_MAP_ID,
  loadBattleMap,
  type BattleMapId,
  type BattleMapInstance,
  setPlacementGuidesVisible,
} from "./map/mapBuilder";
import type { Obstacle } from "./map/obstacles";
import { isPointInsideHazard } from "./map/hazards";
import { PlacementValidator } from "./map/placementValidator";
import {
  CameraController,
  type CameraViewState,
} from "./ui/cameraController";

// ─── DOM references ───
const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;
const budgetAEl = document.getElementById("budgetA")!;
const budgetAmountEl = document.getElementById("budgetAmount")!;
const budgetUnitsEl = document.getElementById("budgetUnits")!;
// Side the budget counter shows: the half the player last placed on.
let budgetHudTeam = 0;
const selectedUnitEl = document.getElementById("selectedUnit")!;
const statusTextEl = document.getElementById("statusText")!;
const campaignStatusEl = document.getElementById("campaignStatus")!;
const factionTabsEl = document.getElementById("factionTabs")!;
const unitGridEl = document.getElementById("unitGrid")!;
const factionLabelEl = document.getElementById("factionLabel")!;
const unitSearchEl = document.getElementById("unitSearch") as HTMLInputElement;
const campaignOverlayEl = document.getElementById("campaignOverlay")!;
const campaignListEl = document.getElementById("campaignList")!;
const campaignScenarioListEl = document.getElementById("campaignScenarioList")!;
const campaignScenarioSubtitleEl = document.getElementById("campaignScenarioSubtitle")!;
const resultOverlayEl = document.getElementById("resultOverlay")!;
const resultTitleEl = document.getElementById("resultTitle")!;
const resultDetailEl = document.getElementById("resultDetail")!;
const titleIntroEl = document.getElementById("titleIntro");
const bodyEl = document.body;
const btnCampaignEl = document.getElementById("btnCampaign") as HTMLButtonElement | null;
const btnUnlimitedEl = document.getElementById("btnUnlimited") as HTMLButtonElement | null;
const mapNameEl = document.getElementById("mapName");
const btnResultPrimaryEl = document.getElementById("btnResultPrimary") as HTMLButtonElement | null;
const btnResultSecondaryEl = document.getElementById("btnResultSecondary") as HTMLButtonElement | null;
const btnLeaveCampaignEl = document.getElementById("btnLeaveCampaign") as HTMLButtonElement | null;
const btnCloseCampaignEl = document.getElementById("btnCloseCampaign") as HTMLButtonElement | null;
const touchCameraControlsEl = document.getElementById("touchCameraControls");
const btnTouchRotateLeftEl = document.getElementById("btnTouchRotateLeft") as HTMLButtonElement | null;
const btnTouchRotateRightEl = document.getElementById("btnTouchRotateRight") as HTMLButtonElement | null;
const btnTouchCameraDownEl = document.getElementById("btnTouchCameraDown") as HTMLButtonElement | null;
const btnTouchCameraUpEl = document.getElementById("btnTouchCameraUp") as HTMLButtonElement | null;

// ─── Engine & Scene ───
const engine = new Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });
const scene = new Scene(engine);
scene.clearColor = new Color4(0.14, 0.62, 0.46, 1);

// Material factory (PBR cache — must init before any unit/map creation)
initMaterialFactory(scene);

// Lights
const hemi = new HemisphericLight("hemi", new Vector3(0, 1, 0.3), scene);
hemi.intensity = 0.45;
hemi.groundColor = new Color3(0.25, 0.22, 0.18);
// The sky fill leans blue, so shade lit by it alone is a cool red-brown and not blood red
hemi.diffuse = new Color3(0.7, 0.9, 1.6);
// The sun stands about 55 degrees up, so a tree's shadow is shorter than the tree and does not reach across the field.
const dir = new DirectionalLight("dir", new Vector3(-0.305, -0.762, 0.457), scene);
dir.intensity = 0.9;
// The sun stands off beyond the tree ring with its own depth range. Left at its default spot just above the field,
// everything taller than a trunk base sits behind the shadow camera and never reaches the shadow map.
dir.position = dir.direction.scale(-100);
dir.shadowMinZ = 10;
dir.shadowMaxZ = 220;

// Fog — depth fade to sky color
scene.fogMode = Scene.FOGMODE_LINEAR;
scene.fogColor = new Color3(0.62, 0.86, 0.76);
scene.fogStart = 70;
scene.fogEnd = 170;
// The haze starts behind the fight, not at a fixed distance from the eye: pulled back to the placement view,
// the board would otherwise sit a third of the way into the fog and both teams wash out to its colour.
scene.onBeforeRenderObservable.add(() => {
  const pullBack = Math.max(0, ((scene.activeCamera as { radius?: number } | null)?.radius ?? 0) - 14);
  scene.fogStart = 70 + pullBack;
  scene.fogEnd = 170 + pullBack;
});

// Shadows
const shadowGen = new ShadowGenerator(2048, dir);
// Depth-compared and lightly filtered: the map spans the whole tree ring, and a blurred exponential map over that
// span smears a unit-sized shadow away to nothing.
shadowGen.usePercentageCloserFiltering = true;
shadowGen.filteringQuality = ShadowGenerator.QUALITY_HIGH;
// Shadows keep a twenty-fifth of the sun (darkness is the light left in them), the sky fill and the grass's own glow lifting them to about half the lit ground: at an eighth they stayed three quarters of it,
// a faint red stain and not a shadow.
shadowGen.darkness = 0.04;
shadowGen.bias = 0.0004;
shadowGen.normalBias = 0.02;

// Camera
const camCtrl = new CameraController(scene, canvas);
bodyEl.classList.toggle("touch-device", camCtrl.isTouchDevice);

type CameraMotionAction =
  | "rotateLeft"
  | "rotateRight"
  | "moveUp"
  | "moveDown";

const heldCameraKeys = new Set<string>();
const heldCameraActions = new Set<CameraMotionAction>();
const CAMERA_MOVEMENT_KEYS = new Set(["KeyW", "KeyA", "KeyS", "KeyD", "KeyQ", "KeyE", "KeyZ", "KeyC"]);

function isTextEntryTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return target instanceof HTMLInputElement
    || target instanceof HTMLTextAreaElement
    || target instanceof HTMLSelectElement
    || target.isContentEditable;
}

function syncCameraMotionIntent(): void {
  const panX = (heldCameraKeys.has("KeyA") ? 1 : 0)
    - (heldCameraKeys.has("KeyD") ? 1 : 0);
  const panY = (heldCameraKeys.has("KeyS") ? 1 : 0)
    - (heldCameraKeys.has("KeyW") ? 1 : 0);
  const rotate = (heldCameraKeys.has("KeyQ") ? 1 : 0)
    - (heldCameraKeys.has("KeyE") ? 1 : 0)
    + (heldCameraActions.has("rotateRight") ? 1 : 0)
    - (heldCameraActions.has("rotateLeft") ? 1 : 0);
  const vertical = (heldCameraKeys.has("KeyC") ? 1 : 0)
    - (heldCameraKeys.has("KeyZ") ? 1 : 0)
    + (heldCameraActions.has("moveUp") ? 1 : 0)
    - (heldCameraActions.has("moveDown") ? 1 : 0);

  camCtrl.setMotionIntent({
    panX: Math.max(-1, Math.min(1, panX)),
    panY: Math.max(-1, Math.min(1, panY)),
    rotate: Math.max(-1, Math.min(1, rotate)),
    vertical: Math.max(-1, Math.min(1, vertical)),
  });
}

function setCameraActionActive(action: CameraMotionAction, active: boolean): void {
  if (active) {
    heldCameraActions.add(action);
  } else {
    heldCameraActions.delete(action);
  }
  syncCameraMotionIntent();
}

function clearHeldCameraMotion(): void {
  heldCameraKeys.clear();
  heldCameraActions.clear();
  btnTouchRotateLeftEl?.classList.remove("is-active");
  btnTouchRotateRightEl?.classList.remove("is-active");
  btnTouchCameraDownEl?.classList.remove("is-active");
  btnTouchCameraUpEl?.classList.remove("is-active");
  camCtrl.clearMotionIntent();
}

function bindHeldCameraButton(button: HTMLButtonElement | null, action: CameraMotionAction): void {
  if (!button) return;
  const setPressed = (active: boolean) => {
    button.classList.toggle("is-active", active);
    setCameraActionActive(action, active);
  };
  const activate = (event: PointerEvent) => {
    event.preventDefault();
    button.setPointerCapture(event.pointerId);
    setPressed(true);
  };
  const deactivate = (event: Event) => {
    event.preventDefault();
    setPressed(false);
  };

  button.addEventListener("pointerdown", activate);
  button.addEventListener("pointerup", deactivate);
  button.addEventListener("pointercancel", deactivate);
  button.addEventListener("lostpointercapture", deactivate);
  button.addEventListener("contextmenu", (event) => event.preventDefault());
}

touchCameraControlsEl?.classList.toggle("enabled", camCtrl.isTouchDevice);
bindHeldCameraButton(btnTouchRotateLeftEl, "rotateLeft");
bindHeldCameraButton(btnTouchRotateRightEl, "rotateRight");
bindHeldCameraButton(btnTouchCameraDownEl, "moveDown");
bindHeldCameraButton(btnTouchCameraUpEl, "moveUp");

// Bloom post-processing
const pipeline = new DefaultRenderingPipeline("default", true, scene, [camCtrl.camera]);
pipeline.bloomEnabled = true;
pipeline.bloomThreshold = 0.65;
pipeline.bloomWeight = 0.15; // slight: at 0.4 every sunlit white, clouds and snow crests first, carried a wide white rim
pipeline.bloomKernel = 64;
pipeline.bloomScale = 0.5;
pipeline.fxaaEnabled = true;

// Color grading / tone mapping
pipeline.imageProcessingEnabled = true;
pipeline.imageProcessing.toneMappingEnabled = true;
pipeline.imageProcessing.toneMappingType = ImageProcessingConfiguration.TONEMAPPING_ACES;
pipeline.imageProcessing.vignetteEnabled = true;
pipeline.imageProcessing.vignetteWeight = 0.3;
pipeline.imageProcessing.vignetteStretch = 0.5;
pipeline.imageProcessing.exposure = 1.05;
pipeline.imageProcessing.contrast = 1.1;

// SSAO — soft contact shadows in crevices
const ssao = new SSAO2RenderingPipeline("ssao", scene, {
  ssaoRatio: 0.5,
  blurRatio: 0.5,
});
ssao.radius = 1.5;
ssao.totalStrength = 0.8;
ssao.samples = 16;
ssao.maxZ = 100;
scene.postProcessRenderPipelineManager.attachCamerasToRenderPipeline("ssao", camCtrl.camera);

// Glow layer — FxPreset units with emissive glow
const glowLayer = new GlowLayer("glow", scene, {
  mainTextureFixedSize: 512,
  blurKernelSize: 32,
});
glowLayer.intensity = 0.6;

// Sky dome: the sandbox backdrop grades from a light pastel teal overhead to a pale horizon, the fog's colour, so the far
// trees fade into what is behind them. Unlit, fog-free and out of the glow layer; campaign themes switch it off.
const skyDome = MeshBuilder.CreateSphere("skyDome", { diameter: 2000, segments: 24, sideOrientation: Mesh.BACKSIDE }, scene);
{
  const positions = skyDome.getVerticesData(VertexBuffer.PositionKind) ?? [];
  const colors: number[] = [];
  for (let i = 0; i < positions.length; i += 3) {
    // Fully deep, (0.33, 0.74, 0.65), by about 44 degrees up: a pastel teal, only a shade under the horizon side
    const t = Math.min(1, Math.max(0, positions[i + 1] / 700));
    // Horizon haze: below about 25 degrees up the teal pales toward mint cream, so the sky lightens behind the treeline
    const haze = 0.6 * Math.max(0, 1 - Math.max(0, positions[i + 1]) / 420);
    const mint = [0.74, 0.98, 0.87];
    colors.push(...[0.43 - 0.20 * t, 0.86 - 0.04 * t, 0.74 - 0.04 * t].map((c, k) => c + (mint[k] - c) * haze), 1);
  }
  skyDome.setVerticesData(VertexBuffer.ColorKind, colors);
  const skyMat = new StandardMaterial("skyDome", scene);
  skyMat.diffuseColor = Color3.Black();
  skyMat.specularColor = Color3.Black();
  skyMat.emissiveColor = Color3.White();
  skyMat.disableLighting = true;
  skyMat.fogEnabled = false;
  skyDome.material = skyMat;
  skyDome.infiniteDistance = true;
  skyDome.applyFog = false;
  skyDome.isPickable = false;
  glowLayer.addExcludedMesh(skyDome);
}

// ─── Game systems ───
const stateMachine = new GameStateMachine();
const simulation = new SimulationSystem();
const projectileSystem = new ProjectileSystem(scene);
const visualEffects = new VisualEffects(scene);
const impactPresentation = new ImpactPresentation();
impactPresentation.visualEffects = visualEffects;
impactPresentation.onShake = (intensity) => camCtrl.shake(intensity);
simulation.projectileSystem = projectileSystem;
simulation.visualEffects = visualEffects;
simulation.impactPresentation = impactPresentation;
projectileSystem.onShake = (intensity) => camCtrl.shake(intensity);
projectileSystem.visualEffects = visualEffects;
projectileSystem.impactPresentation = impactPresentation;
const unitFactory = new UnitFactory(scene);
unitFactory.shadowGenerator = shadowGen;
let activeMapInstance: BattleMapInstance = loadBattleMap(scene, DEFAULT_BATTLE_MAP_ID);
RuntimeUnit.obstacles = buildRuntimeObstacles(activeMapInstance);
RuntimeUnit.hazards = activeMapInstance.hazards;
let placementValidator = new PlacementValidator(activeMapInstance.placementZones ?? activeMapInstance.zones, activeMapInstance.obstacles, activeMapInstance.hazards);
simulation.configureNavigation(
  activeMapInstance.zones,
  activeMapInstance.obstacles,
  activeMapInstance.hazards,
);

let budgetSystem = new BudgetSystem(
  BATTLE_CONFIG.teamABudget, BATTLE_CONFIG.teamBBudget, BATTLE_CONFIG.maxUnitsPerTeam,
);

let selectedUnitId = "tribal.clubber";
let selectedRosterIndex = 0;
const placedUnits: RuntimeUnit[] = [];
let countdownTimer: ReturnType<typeof setTimeout> | null = null;
let statusTimer: ReturnType<typeof setTimeout> | null = null;
let removeMode = false;
let worldTimeSeconds = 0;
let activeScenario: ScenarioSpec | null = null;
let campaignSession: CampaignSessionState | null = null;
let selectedCampaignId: CampaignId | null = null;
let selectedCampaignScenarioId: string | null = null;
const lockedCampaignRootIds = new Set<number>();
let pendingCampaignResolutionTimer: ReturnType<typeof setTimeout> | null = null;
let pendingCampaignResultAction: "retry" | "advance" = "retry";
let lastBattleRecap: BattleRecap | null = null;
let galleryCaptureSession: {
  scenarioId: string;
  cameraBeforeGallery: CameraViewState;
} | null = null;
RuntimeUnit.timeNowSeconds = () => worldTimeSeconds;

interface TitleIntroState {
  active: boolean;
  started: boolean;
  loadReady: boolean;
  renderReady: boolean;
  cleanupTimer: ReturnType<typeof setTimeout> | null;
}

const TITLE_INTRO_DURATION_MS = 3200;

let titleIntro: TitleIntroState | null = titleIntroEl
  ? {
      active: true,
      started: false,
      loadReady: false,
      renderReady: false,
      cleanupTimer: null,
    }
  : null;

function tryStartTitleIntro(): void {
  if (!titleIntro?.active || titleIntro.started) return;
  if (!titleIntro.loadReady || !titleIntro.renderReady) return;
  if (!titleIntroEl?.isConnected) {
    dismissTitleIntro();
    return;
  }

  titleIntro.started = true;
  titleIntroEl.classList.add("title-intro-playing");
  titleIntro.cleanupTimer = setTimeout(() => dismissTitleIntro(), TITLE_INTRO_DURATION_MS);
}

function markTitleIntroRenderReady(): void {
  if (!titleIntro?.active) return;
  titleIntro.renderReady = true;
  tryStartTitleIntro();
}

function markTitleIntroLoadReady(): void {
  if (!titleIntro?.active) return;
  titleIntro.loadReady = true;
  scene.onAfterRenderObservable.addOnce(markTitleIntroRenderReady);
}

function scheduleTitleIntroStart(): void {
  if (!titleIntro) return;
  if (document.readyState === "complete") {
    markTitleIntroLoadReady();
  } else {
    window.addEventListener("load", markTitleIntroLoadReady, { once: true });
  }
}

function dismissTitleIntro(): void {
  if (!titleIntro) return;
  titleIntro.active = false;
  window.removeEventListener("load", markTitleIntroLoadReady);
  if (titleIntro.cleanupTimer) {
    clearTimeout(titleIntro.cleanupTimer);
  }
  titleIntroEl?.remove();
  titleIntro = null;
}

scheduleTitleIntroStart();

function rotateOffsetByYaw(offset: Vector3, yaw: number): Vector3 {
  const sin = Math.sin(yaw);
  const cos = Math.cos(yaw);
  return new Vector3(
    offset.x * cos + offset.z * sin,
    offset.y,
    -offset.x * sin + offset.z * cos,
  );
}

function getCompositeRoot(unit: RuntimeUnit): RuntimeUnit {
  let current = unit;
  while (current.linkedParent) {
    current = current.linkedParent;
  }
  return current;
}

function collectCompositeUnits(root: RuntimeUnit, bucket = new Set<RuntimeUnit>()): Set<RuntimeUnit> {
  if (bucket.has(root)) return bucket;
  bucket.add(root);
  for (const child of root.linkedChildren) {
    collectCompositeUnits(child, bucket);
  }
  return bucket;
}

function removeRuntimeUnitTree(rootUnit: RuntimeUnit, refund = false): void {
  const root = getCompositeRoot(rootUnit);
  const units = [...collectCompositeUnits(root)];
  for (const unit of units) {
    simulation.unregisterUnit(unit);
  }
  for (const unit of units) {
    const idx = placedUnits.indexOf(unit);
    if (idx >= 0) placedUnits.splice(idx, 1);
  }
  for (const unit of [...units].reverse()) {
    unit.dispose();
  }
  if (refund) {
    budgetSystem.refund(root.team, root.definition.cost);
    updateBudgetDisplay();
  }
}

function spawnLinkedActorsForParent(parent: RuntimeUnit): void {
  const preset = getLinkedActorPreset(parent.definition.id);
  if (!preset) return;

  for (const actor of preset.actors) {
    spawnLinkedActor(parent, actor, preset.parentRoleLabel);
  }
}

function applyLinkedParentSemantics(unit: RuntimeUnit): void {
  const preset = getLinkedActorPreset(unit.definition.id);
  if (!preset || unit.linkedParent) return;
  unit.setDecorativeStandinsSuppressed(true);
  if (preset.disableParentEmitter) {
    unit.setPrimaryEmitterEnabled(false);
  }
}

function spawnLinkedActor(parent: RuntimeUnit, actor: LinkedActorSpec, parentRoleLabel?: string): RuntimeUnit | null {
  const initialPosition = parent.position.add(rotateOffsetByYaw(actor.offset, parent.body.root.rotation.y));
  const child = spawnRuntimeUnit(parent.definition.id, parent.team, initialPosition, {
    role: actor.relation === "attachment" ? "attachment" : actor.relation,
    countsTowardVictory: actor.semantics.victoryRouting === "self",
    linkedParent: parent,
    linkedRelation: actor.relation,
    visualOverride: actor.visual,
    suppressDecorativeOperators: true,
    forceArticulatedBody: true,
  });
  if (!child) return null;

  child.configureAnchoredLink({
    roleLabel: actor.label,
    parentRoleLabel,
    offset: actor.offset,
    attackOriginOffset: actor.attackOriginOffset,
    smokeOriginOffset: actor.smokeOriginOffset,
    impactOriginOffset: actor.impactOriginOffset,
    syncFacing: actor.syncFacing,
    targetable: actor.semantics.targetable,
    combatEmitter: actor.semantics.combatEmitter,
    damageRouting: actor.semantics.damageRouting,
    victoryRouting: actor.semantics.victoryRouting,
    moveMode: actor.semantics.moveMode,
    cleanupPolicy: actor.semantics.cleanupPolicy,
    detachOnParentDeath: actor.semantics.detachOnParentDeath,
    actionPreset: actor.semantics.actionPreset,
    contributionChannels: actor.semantics.contributionChannels,
    healthOverride: actor.semantics.healthOverride,
    impactOrigin: actor.semantics.impactOrigin,
  });
  parent.detachLinkedChild(child);
  parent.attachLinkedChild(child, actor.relation);
  if (actor.hideBaseBody) {
    child.setBaseBodyVisible(false);
  }
  child.setHealthBarVisible(false);
  return child;
}

function spawnRuntimeUnit(
  unitId: string,
  team: number,
  position: Vector3,
  options: SpawnUnitOptions = {},
): RuntimeUnit | null {
  const def = getUnit(unitId);
  if (!def) return null;
  const preset = !options.linkedParent ? getLinkedActorPreset(def.id) : undefined;
  const visualOverride = options.visualOverride ?? (
    preset?.suppressParentSpecial ? { ...getUnitVisual(def.id), special: "none" as const } : undefined
  );
  const unit = unitFactory.spawn(def, team, position, {
    visualOverride,
    suppressDecorativeOperators: options.suppressDecorativeOperators ?? Boolean(preset),
    forceArticulatedBody: options.forceArticulatedBody,
  });
  const role = options.role ?? "placed";
  const countsTowardVictory = options.countsTowardVictory ?? (role === "placed" || role === "summoned");
  unit.setSpawnRole(role, countsTowardVictory);
  unit.setDecorativeStandinsSuppressed(options.suppressDecorativeOperators ?? Boolean(preset));
  if (options.expireAfterSeconds !== undefined) {
    unit.setLifetime(options.expireAfterSeconds, worldTimeSeconds);
  }
  if (options.linkedParent && options.linkedRelation) {
    options.linkedParent.attachLinkedChild(unit, options.linkedRelation);
  }
  placedUnits.push(unit);
  simulation.registerUnit(unit);
  if (preset && !options.linkedParent) {
    applyLinkedParentSemantics(unit);
    spawnLinkedActorsForParent(unit);
  }
  return unit;
}

simulation.spawnUnitById = spawnRuntimeUnit;

const btnRemoveEl = document.getElementById("btnRemove") as HTMLButtonElement | null;

// ─── HUD ───
function updateBudgetDisplay(): void {
  const team = isCampaignModeActive() ? 0 : budgetHudTeam;
  budgetAEl.classList.toggle("team-b", team === 1);
  // Sandbox counts up what the side has spent, from 0, as TABS does: its budget is too deep to read as a countdown. A campaign scenario counts down what is left of its own.
  const sandboxBudget = team === 0 ? BATTLE_CONFIG.teamABudget : BATTLE_CONFIG.teamBBudget;
  const amount = isCampaignModeActive() ? budgetSystem.getRemaining(team) : sandboxBudget - budgetSystem.getRemaining(team);
  budgetAmountEl.textContent = campaignSession?.unlimited ? "∞" : `${amount}`;
  budgetUnitsEl.textContent = `${placedUnits.filter((unit) => !unit.linkedParent && unit.team === team).length}`;
  updateCampaignStatusDisplay();
}

function updateSelectedUnitDisplay(): void {
  const def = getUnit(selectedUnitId);
  if (def) {
    selectedUnitEl.textContent = "";
  } else {
    selectedUnitEl.textContent = "Remove Mode";
  }
}

function showStatus(msg: string): void {
  statusTextEl.textContent = msg;
  if (statusTimer) clearTimeout(statusTimer);
  statusTimer = setTimeout(() => { statusTextEl.textContent = ""; }, 2500);
}

function clearPendingCampaignResolution(): void {
  if (!pendingCampaignResolutionTimer) return;
  clearTimeout(pendingCampaignResolutionTimer);
  pendingCampaignResolutionTimer = null;
}

function loadMapById(mapId: BattleMapId): void {
  if (activeMapInstance.id === mapId) return;
  activeMapInstance.dispose?.();
  activeMapInstance = loadBattleMap(scene, mapId);
  RuntimeUnit.obstacles = buildRuntimeObstacles(activeMapInstance);
  RuntimeUnit.hazards = activeMapInstance.hazards;
  placementValidator = new PlacementValidator(activeMapInstance.placementZones ?? activeMapInstance.zones, activeMapInstance.obstacles, activeMapInstance.hazards);
  simulation.configureNavigation(
    activeMapInstance.zones,
    activeMapInstance.obstacles,
    activeMapInstance.hazards,
  );
  updateCampaignStatusDisplay();
}

function buildRuntimeObstacles(mapInstance: BattleMapInstance): Obstacle[] {
  const hazardObstacles: Obstacle[] = mapInstance.hazards.map((hazard) => (
    hazard.shape === "box"
      ? {
          type: "box",
          center: hazard.center.clone(),
          halfX: hazard.halfX,
          halfZ: hazard.halfZ,
        }
      : {
          type: "cylinder",
          center: hazard.center.clone(),
          radius: hazard.radius,
        }
  ));
  return [
    ...mapInstance.obstacles,
    ...hazardObstacles,
  ];
}

function getActiveCampaignDefinition(): CampaignDefinition | null {
  return getCurrentCampaignDefinition(campaignSession);
}

function isCampaignModeActive(): boolean {
  return campaignSession !== null;
}

function isCampaignUnitLocked(unit: RuntimeUnit): boolean {
  return lockedCampaignRootIds.has(getCompositeRoot(unit).runtimeId);
}

function getActiveCampaignScenarioDefinition(): CampaignScenarioDefinition | null {
  return getCurrentCampaignScenario(campaignSession);
}

function getAllowedUnitIds(): Set<string> | null {
  if (!campaignSession || campaignSession.unlimited) return null;
  const activeScenario = getActiveCampaignScenarioDefinition();
  if (!activeScenario) return null;
  return new Set(activeScenario.restrictions.allowedUnitIds);
}

function getSelectableFactionUnits(faction: FactionId): UnitDefinition[] {
  const query = unitSearchEl.value.trim().toLowerCase();
  const allowed = getAllowedUnitIds();
  return ALL_UNITS.filter((unit) => {
    if (unit.faction !== faction) return false;
    if (allowed && !allowed.has(unit.id)) return false;
    if (!query) return true;
    return unit.displayName.toLowerCase().includes(query) || unit.id.toLowerCase().includes(query);
  });
}

function syncSelectedUnitToRoster(): void {
  const allowed = getAllowedUnitIds();
  if (allowed && !allowed.has(selectedUnitId)) {
    const next = ALL_UNITS.find((unit) => allowed.has(unit.id));
    if (next) {
      selectedUnitId = next.id;
      activeFaction = next.faction;
    }
  }
}

function updateCampaignStatusDisplay(): void {
  const activeCampaign = getActiveCampaignDefinition();
  const activeScenario = getActiveCampaignScenarioDefinition();
  btnCampaignEl?.classList.toggle("active", campaignOverlayEl.classList.contains("visible"));
  if (btnUnlimitedEl) {
    btnUnlimitedEl.classList.toggle("active", Boolean(campaignSession?.unlimited));
    btnUnlimitedEl.disabled = !campaignSession;
    btnUnlimitedEl.textContent = campaignSession?.unlimited ? "Unlimited: On" : "Unlimited: Off";
  }
  if (mapNameEl) mapNameEl.textContent = campaignSession ? "" : activeMapInstance.displayName;
  if (!activeCampaign || !activeScenario) {
    campaignStatusEl.textContent = "";
    return;
  }
  const modeLabel = campaignSession?.unlimited ? "Unlimited" : `Budget ${activeScenario.restrictions.budget}`;
  const ordinal = (campaignSession?.scenarioIndex ?? 0) + 1;
  campaignStatusEl.textContent = `${activeCampaign.displayName} — ${ordinal}/${activeCampaign.scenarios.length}: ${activeScenario.displayName} (${modeLabel})`;
}

function populateCampaignScenarioList(campaignId: CampaignId | null): void {
  campaignScenarioListEl.innerHTML = "";
  if (!campaignId) {
    campaignScenarioSubtitleEl.textContent = "Select a campaign to see its scenario ladder.";
    return;
  }
  const campaign = listCampaignDefinitions().find((entry) => entry.id === campaignId);
  if (!campaign) {
    campaignScenarioSubtitleEl.textContent = "Select a campaign to see its scenario ladder.";
    return;
  }
  campaignScenarioSubtitleEl.textContent = campaign.description;
  const defaultScenarioId = selectedCampaignScenarioId
    ?? (campaignSession?.campaignId === campaign.id
      ? campaignSession?.scenarioId
      : campaign.scenarios[0]?.id);
  if (defaultScenarioId) {
    selectedCampaignScenarioId = defaultScenarioId;
  }

  for (const scenario of campaign.scenarios) {
    const btn = document.createElement("button");
    btn.className = "campaign-scenario-item";
    btn.classList.toggle("active", selectedCampaignScenarioId === scenario.id);
    btn.innerHTML = `
      <div class="campaign-scenario-title">${scenario.displayName}</div>
      <div class="campaign-scenario-desc">${scenario.description}</div>
    `;
    btn.addEventListener("click", () => {
      const nextSession = createCampaignSession(campaign.id, campaignSession?.unlimited ?? false, scenario.id);
      if (!nextSession) return;
      campaignSession = nextSession;
      selectedCampaignScenarioId = scenario.id;
      toggleCampaignOverlay(false);
      loadCampaignScenario("Campaign ready.");
    });
    campaignScenarioListEl.appendChild(btn);
  }
}

function populateCampaignList(): void {
  campaignListEl.innerHTML = "";
  const campaigns = listCampaignDefinitions();
  if (!selectedCampaignId && campaigns.length > 0) {
    selectedCampaignId = campaigns[0].id;
    selectedCampaignScenarioId = campaigns[0].scenarios[0]?.id ?? null;
  }
  for (const campaign of campaigns) {
    const btn = document.createElement("button");
    btn.className = "campaign-item";
    btn.classList.toggle("active", selectedCampaignId === campaign.id);
    btn.innerHTML = `
      <div class="campaign-item-title">${campaign.displayName}</div>
      <div class="campaign-item-desc">${campaign.description}</div>
    `;
    btn.addEventListener("click", () => {
      selectedCampaignId = campaign.id;
      selectedCampaignScenarioId = campaign.scenarios[0]?.id ?? null;
      populateCampaignList();
      populateCampaignScenarioList(campaign.id);
    });
    campaignListEl.appendChild(btn);
  }
  populateCampaignScenarioList(selectedCampaignId);
}

function toggleCampaignOverlay(visible: boolean): void {
  campaignOverlayEl.classList.toggle("visible", visible);
  campaignOverlayEl.setAttribute("aria-hidden", visible ? "false" : "true");
  if (visible) {
    selectedCampaignId = campaignSession?.campaignId ?? selectedCampaignId;
    selectedCampaignScenarioId = campaignSession?.scenarioId ?? selectedCampaignScenarioId;
    populateCampaignList();
  }
  updateCampaignStatusDisplay();
}

function clearLockedCampaignUnits(): void {
  lockedCampaignRootIds.clear();
}

function applyCampaignPlacements(placements: CampaignPlacementSpec[]): void {
  clearLockedCampaignUnits();
  for (const placement of placements) {
    const spawned = spawnHarnessUnit(
      placement.unitId,
      placement.team,
      placement.position,
      {
        role: "placed",
        countsTowardVictory: true,
      },
    );
    if (!spawned) continue;
    if (placement.locked) {
      lockedCampaignRootIds.add(spawned.runtimeId);
    }
  }
}

function setGalleryCaptureMode(enabled: boolean): void {
  bodyEl.classList.toggle("capture-mode", enabled);
}

function renderStaticFrames(frameCount = 2): void {
  // Freshly spawned units have never been stepped and would render in the zeroed rest pose; settle them into idle
  for (const unit of placedUnits) unit.animator.update(0);
  for (let i = 0; i < frameCount; i++) {
    camCtrl.update(0);
    scene.render();
  }
}

function closeGalleryCaptureSession(restoreCamera = true): void {
  setGalleryCaptureMode(false);
  if (restoreCamera && galleryCaptureSession) {
    camCtrl.restoreViewState(galleryCaptureSession.cameraBeforeGallery);
  }
  galleryCaptureSession = null;
}

function openGalleryCaptureSession(scenario: ScenarioSpec): void {
  if (!galleryCaptureSession) {
    galleryCaptureSession = {
      scenarioId: scenario.name,
      cameraBeforeGallery: camCtrl.captureViewState(),
    };
  } else {
    galleryCaptureSession.scenarioId = scenario.name;
  }
}

function selectUnit(id: string): void {
  selectedUnitId = id;
  selectedRosterIndex = ALL_UNITS.findIndex((u) => u.id === id);
  updateSelectedUnitDisplay();

  // Switch faction tab if needed
  const def = getUnit(id);
  if (def && def.faction !== activeFaction) {
    setFaction(def.faction);
  }

  // Update panel selection
  document.querySelectorAll(".unit-btn").forEach((el) => {
    el.classList.toggle("selected", (el as HTMLElement).dataset.id === id);
  });
}

function selectRelativeUnit(offset: number): void {
  const factionUnits = getFilteredFactionUnits();
  if (factionUnits.length === 0) return;
  const currentIndex = Math.max(0, factionUnits.findIndex((u) => u.id === selectedUnitId));
  const nextIndex = (currentIndex + offset + factionUnits.length) % factionUnits.length;
  selectUnit(factionUnits[nextIndex].id);
}

function toggleRemoveMode(): void {
  removeMode = !removeMode;
  btnRemoveEl?.classList.toggle("remove-active", removeMode);
  if (removeMode) {
    showStatus("Remove mode: tap a unit to remove it.");
  } else {
    showStatus("");
  }
}

const FACTION_TAB_COLORS: Record<number, string> = {
  [FactionId.Tribal]: "#8d5a33",
  [FactionId.Farmer]: "#d9c73e",
  [FactionId.Medieval]: "#4070d9",
  [FactionId.Ancient]: "#ccb888",
  [FactionId.Viking]: "#33bfcf",
  [FactionId.Dynasty]: "#d93333",
  [FactionId.Renaissance]: "#2a3570",
  [FactionId.Pirate]: "#808080",
  [FactionId.Spooky]: "#9c7fcc",
  [FactionId.WildWest]: "#b7722c",
  [FactionId.Legacy]: "#b9b9b9",
  [FactionId.Good]: "#e6c75a",
  [FactionId.Evil]: "#7d3434",
  [FactionId.Secret]: "#c8c8c8",
};

let activeFaction = ALL_UNITS[0]?.faction ?? FactionId.Tribal;

function setFaction(faction: FactionId): void {
  activeFaction = faction;
  factionLabelEl.textContent = FACTION_NAMES[faction] ?? "";
  populateUnitGrid();
  // Update tab highlight
  document.querySelectorAll(".faction-tab").forEach((el) => {
    const tab = el as HTMLElement;
    const fid = Number(tab.dataset.faction);
    tab.classList.toggle("active", fid === faction);
    tab.style.borderBottomColor = fid === faction ? (FACTION_TAB_COLORS[fid] ?? "#fff") : "transparent";
  });
}

function getFilteredFactionUnits(): UnitDefinition[] {
  return getSelectableFactionUnits(activeFaction);
}

function populateUnitGrid(): void {
  unitGridEl.innerHTML = "";
  const factionUnits = getFilteredFactionUnits();
  for (const def of factionUnits) {
    const btn = document.createElement("button");
    btn.className = "unit-btn";
    btn.dataset.id = def.id;
    const glyph = unitGlyphPath(def.id, getUnitVisual(def.id));
    btn.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true"><path${isSolidGlyph(glyph) ? ' class="solid"' : ""} d="${glyph}"/></svg>`;
    const label = document.createElement("span");
    label.textContent = def.displayName;
    btn.appendChild(label);
    btn.title = `${def.displayName} (${def.cost})`;
    if (def.id === selectedUnitId) btn.classList.add("selected");
    btn.addEventListener("click", () => selectUnit(def.id));
    unitGridEl.appendChild(btn);
  }

  if (factionUnits.length === 0) {
    const empty = document.createElement("div");
    empty.className = "unit-empty";
    empty.textContent = "No units match this search.";
    unitGridEl.appendChild(empty);
  }
}

// Build faction tabs + unit grid
function buildUnitPanel(): void {
  factionTabsEl.innerHTML = "";
  syncSelectedUnitToRoster();
  // Collect unique factions in order they appear
  const seen = new Set<FactionId>();
  for (const def of ALL_UNITS) {
    if (seen.has(def.faction)) continue;
    seen.add(def.faction);
    const factionUnits = getSelectableFactionUnits(def.faction);
    const hasUnits = factionUnits.length > 0;

    const tab = document.createElement("button");
    tab.className = "faction-tab";
    tab.dataset.faction = String(def.faction);
    const factionName = FACTION_NAMES[def.faction] ?? `Faction ${def.faction}`;
    const factionGlyph = FACTION_GLYPH_PATHS[def.faction];
    if (factionGlyph) {
      tab.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${factionGlyph}"/></svg>`;
      tab.title = factionName;
      tab.setAttribute("aria-label", factionName);
    } else {
      tab.textContent = factionName;
    }
    tab.disabled = !hasUnits;
    if (!hasUnits) tab.style.opacity = "0.35";
    tab.addEventListener("click", () => setFaction(def.faction));
    factionTabsEl.appendChild(tab);
  }
  if (getSelectableFactionUnits(activeFaction).length === 0) {
    const fallback = ALL_UNITS.find((unit) => getSelectableFactionUnits(unit.faction).length > 0);
    if (fallback) {
      activeFaction = fallback.faction;
    }
  }
  setFaction(activeFaction);
}

buildUnitPanel();
updateBudgetDisplay();
updateSelectedUnitDisplay();
updateCampaignStatusDisplay();
unitSearchEl.addEventListener("input", () => populateUnitGrid());
btnCampaignEl?.addEventListener("click", () => toggleCampaignOverlay(true));
btnUnlimitedEl?.addEventListener("click", () => {
  if (!campaignSession) {
    showStatus("Load a campaign scenario first.");
    return;
  }
  setCampaignUnlimited(!campaignSession.unlimited);
});
btnResultPrimaryEl?.addEventListener("click", () => {
  if (campaignSession && pendingCampaignResultAction === "advance") {
    clearPendingCampaignResolution();
    advanceCampaignAfterVictory();
    return;
  }
  playAgain();
});
btnResultSecondaryEl?.addEventListener("click", () => {
  if (campaignSession) {
    if (pendingCampaignResultAction === "advance") {
      playAgain();
      return;
    }
    leaveCampaignMode();
    return;
  }
  resetBattle();
});
btnLeaveCampaignEl?.addEventListener("click", () => leaveCampaignMode());
btnCloseCampaignEl?.addEventListener("click", () => toggleCampaignOverlay(false));
campaignOverlayEl.addEventListener("click", (event) => {
  if (event.target === campaignOverlayEl) {
    toggleCampaignOverlay(false);
  }
});

// ─── Placement ───
function tryPlaceUnit(screenX: number, screenY: number): void {
  if (stateMachine.currentState !== GameState.Placement) return;

  const def = getUnit(selectedUnitId);
  if (!def) {
    // Remove mode: try to remove
    tryRemoveUnit(screenX, screenY);
    return;
  }

  // Raycast from screen to ground
  const pickResult = scene.pick(screenX, screenY);
  if (!pickResult || !pickResult.hit || !pickResult.pickedPoint) {
    showStatus("Unable to project placement point.");
    return;
  }

  const worldPoint = pickResult.pickedPoint;
  worldPoint.y = 0;

  // Auto-detect team from placement position: left half = Team A (0), right half = Team B (1)
  const team = worldPoint.x < 0 ? 0 : 1;
  if (budgetHudTeam !== team) {
    budgetHudTeam = team;
    updateBudgetDisplay();
  }
  if (campaignSession && team === 1) {
    showStatus("Campaign enemies are locked.");
    return;
  }

  if (!campaignSession?.unlimited && !budgetSystem.canAddUnit(team, simulation.getLivingCount(team))) {
    showStatus("Team unit cap reached.");
    return;
  }

  const reason = placementValidator.validate(team, worldPoint, def.collisionRadius, placedUnits);
  if (reason) {
    showStatus(reason);
    return;
  }

  if (!campaignSession?.unlimited && !budgetSystem.trySpend(team, def.cost)) {
    showStatus("Not enough budget.");
    return;
  }

  spawnRuntimeUnit(def.id, team, worldPoint);
  updateBudgetDisplay();
}

function tryRemoveUnit(screenX: number, screenY: number): void {
  if (stateMachine.currentState !== GameState.Placement) return;

  const pickResult = scene.pick(screenX, screenY);
  if (!pickResult || !pickResult.hit || !pickResult.pickedMesh) return;

  const meta = pickResult.pickedMesh.metadata;
  if (!meta || !meta.runtimeUnit) return;

  const ru = meta.runtimeUnit as RuntimeUnit;
  const root = getCompositeRoot(ru);
  if (root.isDead) return;
  if (campaignSession && isCampaignUnitLocked(root)) {
    showStatus("Campaign units cannot be removed.");
    return;
  }

  removeRuntimeUnitTree(root, true);
}

// ─── Battle lifecycle ───
function startBattle(immediate = false): void {
  dismissTitleIntro();
  if (stateMachine.currentState !== GameState.Placement) return;

  const teamACount = simulation.getLivingCount(0);
  const teamBCount = simulation.getLivingCount(1);
  if (teamACount === 0 || teamBCount === 0) {
    showStatus("Both teams need at least one unit.");
    return;
  }

  stateMachine.setState(GameState.Countdown);
  showStatus("Battle starting...");

  if (immediate) {
    enterSimulation();
    return;
  }

  countdownTimer = setTimeout(() => {
    enterSimulation();
    countdownTimer = null;
  }, BATTLE_CONFIG.countdownSeconds * 1000);
}

function enterSimulation(): void {
  simulation.beginSimulation(worldTimeSeconds);
  stateMachine.setState(GameState.Simulation);
  bodyEl.classList.add("in-battle");
  setPlacementGuidesVisible(scene, false);
  // Countdown -> Simulation: swoop from the oblique placement view down to the clash line.
  if (!galleryCaptureSession) camCtrl.swoopToBattle(computeBattleFocus());
  showStatus("Fight!");
}

/** Engage range from which a unit shoots from where it stands rather than closing to melee. */
const STANDOFF_ENGAGE_RANGE = 7;

/** Midpoint between the two teams' living formations, where the front lines will meet. */
function computeBattleFocus(): { x: number; z: number; halfSpan: number; depth: number; near?: { x: number; z: number; halfWidth: number } } {
  const sums = [{ x: 0, z: 0, n: 0, ranged: 0 }, { x: 0, z: 0, n: 0, ranged: 0 }];
  for (const unit of placedUnits) {
    if (unit.linkedParent || unit.isDead) continue;
    const s = sums[unit.team === 0 ? 0 : 1];
    s.x += unit.position.x;
    s.z += unit.position.z;
    s.n += 1;
    if (unit.definition.engageRange >= STANDOFF_ENGAGE_RANGE) s.ranged += 1;
  }
  const a = sums[0].n ? { x: sums[0].x / sums[0].n, z: sums[0].z / sums[0].n } : { x: 0, z: 0 };
  const b = sums[1].n ? { x: sums[1].x / sums[1].n, z: sums[1].z / sums[1].n } : { x: 0, z: 0 };
  // A mostly-ranged army holds its ground instead of closing, so the frame has to span both formations.
  const standoff = sums.some((s) => s.n > 0 && s.ranged * 2 > s.n);
  // The camera stands behind the more ranged army, so its line is the foreground and the enemy the background.
  const ratio = (s: { n: number; ranged: number }) => (s.n ? s.ranged / s.n : 0);
  const nearTeam = ratio(sums[1]) > ratio(sums[0]) ? 1 : 0;
  const nearCentre = nearTeam === 1 ? b : a;
  // How far the holding line reaches either side of its centre, across the axis between the armies.
  const axisLength = Math.hypot(b.x - a.x, b.z - a.z) || 1;
  let halfWidth = 0;
  for (const unit of placedUnits) {
    if (unit.linkedParent || unit.isDead || (unit.team === 0 ? 0 : 1) !== nearTeam) continue;
    const across = ((unit.position.x - nearCentre.x) * (b.z - a.z) - (unit.position.z - nearCentre.z) * (b.x - a.x)) / axisLength;
    halfWidth = Math.max(halfWidth, Math.abs(across));
  }
  const near = standoff ? { ...nearCentre, halfWidth } : undefined;
  // How far the formations reach toward the side-on battle camera (-z) from the clash point.
  const focusZ = (a.z + b.z) / 2;
  let depth = 0;
  for (const unit of placedUnits) {
    if (unit.linkedParent || unit.isDead) continue;
    depth = Math.max(depth, focusZ - unit.position.z);
  }
  return { x: (a.x + b.x) / 2, z: focusZ, halfSpan: standoff ? Math.abs(a.x - b.x) / 2 : 0, depth, near };
}

function resetBattle(options: {
  preserveGallerySession?: boolean;
  preserveCampaignSession?: boolean;
  restoreSandboxMap?: boolean;
  suppressStatus?: boolean;
} = {}): void {
  dismissTitleIntro();
  lastBattleRecap = null;
  clearPendingCampaignResolution();
  if (campaignSession && !options.preserveCampaignSession) {
    reloadCurrentCampaignScenario("Scenario reset.");
    return;
  }
  if (countdownTimer) {
    clearTimeout(countdownTimer);
    countdownTimer = null;
  }

  simulation.endSimulation(worldTimeSeconds);
  projectileSystem.dispose();
  visualEffects.dispose();
  impactPresentation.reset();

  const roots = placedUnits.filter((unit) => !unit.linkedParent);
  for (const unit of roots) {
    removeRuntimeUnitTree(unit);
  }
  placedUnits.length = 0;

  budgetSystem = new BudgetSystem(
    BATTLE_CONFIG.teamABudget, BATTLE_CONFIG.teamBBudget, BATTLE_CONFIG.maxUnitsPerTeam,
  );

  removeMode = false;
  btnRemoveEl?.classList.remove("remove-active");
  camCtrl.returnToPlacementView();
  bodyEl.classList.remove("in-battle");
  setPlacementGuidesVisible(scene, true);
  stateMachine.setState(GameState.Placement);
  activeScenario = null;
  if (!options.preserveCampaignSession) {
    clearLockedCampaignUnits();
  }
  if (options.restoreSandboxMap && activeMapInstance.id !== DEFAULT_BATTLE_MAP_ID) {
    loadMapById(DEFAULT_BATTLE_MAP_ID);
  }
  updateBudgetDisplay();
  resultOverlayEl.classList.remove("visible");
  if (!options.preserveGallerySession) {
    closeGalleryCaptureSession(true);
  }
  if (!options.suppressStatus) {
    showStatus("");
  }
}

function checkVictory(): void {
  if (stateMachine.currentState !== GameState.Simulation || !simulation.isRunning) return;

  const teamALiving = simulation.getLivingCount(0);
  const teamBLiving = simulation.getLivingCount(1);

  const timedOut = BATTLE_CONFIG.optionalTimeLimitSeconds > 0 &&
    simulation.battleDuration >= BATTLE_CONFIG.optionalTimeLimitSeconds;
  const battleDone = timedOut || teamALiving === 0 || teamBLiving === 0;
  if (!battleDone) return;

  let winner = 0;
  let isDraw = false;
  if (teamALiving > teamBLiving) winner = 0;
  else if (teamBLiving > teamALiving) winner = 1;
  else isDraw = true;

  simulation.endSimulation(worldTimeSeconds);
  stateMachine.setState(GameState.Result);

  const result: BattleResult = {
    winner,
    isDraw,
    durationSeconds: simulation.battleDuration,
    teamALiving,
    teamBLiving,
  };

  if (!galleryCaptureSession) frameSurvivorsForResult(isDraw ? null : winner);
  showResult(result);
}

/** Victory shot: turn the battle camera onto the winner's living units (both teams' on a draw). */
function frameSurvivorsForResult(winner: number | null): void {
  const box: Parameters<typeof camCtrl.frameSurvivors>[0] = { minX: Infinity, maxX: -Infinity, minZ: Infinity, maxZ: -Infinity, baseY: Infinity, height: 0, focus: { x: 0, z: 0 } };
  const spots: { x: number; z: number }[] = [];
  const giantSpots: { x: number; z: number }[] = [];
  for (const unit of placedUnits) {
    if (unit.linkedParent || unit.isDead || (winner !== null && unit.team !== winner)) continue;
    const bounds = unit.body.root.getHierarchyBoundingVectors();
    // A survivor over 4.2 tall is not somewhere to point the shot: the focus is picked among the human-sized ones.
    (bounds.max.y - unit.position.y > 4.2 ? giantSpots : spots).push({ x: unit.position.x, z: unit.position.z });
    box.minX = Math.min(box.minX, unit.position.x);
    box.maxX = Math.max(box.maxX, unit.position.x);
    box.minZ = Math.min(box.minZ, unit.position.z);
    box.maxZ = Math.max(box.maxZ, unit.position.z);
    box.baseY = Math.min(box.baseY, unit.position.y);
    box.height = Math.max(box.height, bounds.max.y - unit.position.y);
  }
  if (box.height <= 0) return;
  const besideGiant = spots.length > 0 && giantSpots.length > 0;
  if (spots.length === 0) spots.push(...giantSpots);
  // Focus: the survivor standing nearest the middle of the group, for when the group is too spread to frame whole.
  const midX = spots.reduce((sum, s) => sum + s.x, 0) / spots.length;
  const midZ = spots.reduce((sum, s) => sum + s.z, 0) / spots.length;
  box.focus = spots.reduce((best, s) => (Math.hypot(s.x - midX, s.z - midZ) < Math.hypot(best.x - midX, best.z - midZ) ? s : best));
  // Beside a giant the shot is a wall of its flank: with one among the survivors, the focus is the human-sized one standing farthest from any giant.
  if (besideGiant) {
    const clear = (s: { x: number; z: number }) => Math.min(...giantSpots.map((g) => Math.hypot(s.x - g.x, s.z - g.z)));
    box.focus = spots.reduce((best, s) => (clear(s) > clear(best) ? s : best));
    // The shot is taken from the giant's side of that survivor, looking away from it: the nearest giant is behind the eye and not across the frame.
    const focus = box.focus;
    box.giant = giantSpots.reduce((best, g) => (Math.hypot(g.x - focus.x, g.z - focus.z) < Math.hypot(best.x - focus.x, best.z - focus.z) ? g : best));
    // The men within 3 of that survivor are the group the shot is centred on.
    const near = spots.filter((s) => Math.hypot(s.x - focus.x, s.z - focus.z) <= 3);
    box.group = { x: near.reduce((sum, s) => sum + s.x, 0) / near.length, z: near.reduce((sum, s) => sum + s.z, 0) / near.length };
  }
  camCtrl.frameSurvivors(box);
}

function formatTeamLabel(team: number | null): string {
  if (team === 0) return "Team A";
  if (team === 1) return "Team B";
  return "Draw";
}

function getRootRuntimeUnit(unit: RuntimeUnit): RuntimeUnit {
  let current = unit;
  while (current.linkedParent) current = current.linkedParent;
  return current;
}

function getRootPlacementIndex(root: RuntimeUnit): number {
  const roots = placedUnits.filter((unit) => !unit.linkedParent);
  const index = roots.indexOf(root);
  return index >= 0 ? index : Number.MAX_SAFE_INTEGER;
}

function selectPeakImpactPath(unitDebug: {
  peakByPath: Partial<Record<ImpactPath, ImpactTier>>;
  countsByPath: Partial<Record<ImpactPath, number>>;
}): { path: ImpactPath; tier: ImpactTier; eventCount: number } | null {
  let best: { path: ImpactPath; tier: ImpactTier; eventCount: number } | null = null;
  for (const path of IMPACT_PATHS) {
    const tier = unitDebug.peakByPath[path];
    if (!tier || tier === "none") continue;
    const eventCount = unitDebug.countsByPath[path] ?? 0;
    if (
      !best
      || IMPACT_TIER_RANK[tier] > IMPACT_TIER_RANK[best.tier]
      || (IMPACT_TIER_RANK[tier] === IMPACT_TIER_RANK[best.tier] && eventCount > best.eventCount)
    ) {
      best = { path, tier, eventCount };
    }
  }
  return best;
}

function buildBattleRecap(result: BattleResult): BattleRecap {
  const outcomeLabel = result.isDraw ? "Draw" : `${formatTeamLabel(result.winner)} Wins`;
  const impactDebug = impactPresentation.getDebugSnapshot();
  const runtimeUnits = new Map(placedUnits.map((unit) => [unit.runtimeId, unit]));
  const candidates = impactDebug.units
    .map((debug) => {
      const unit = runtimeUnits.get(debug.runtimeId);
      if (!unit) return null;
      const path = selectPeakImpactPath(debug);
      if (!path) return null;
      const root = getRootRuntimeUnit(unit);
      return {
        debug,
        unit,
        root,
        rootIndex: getRootPlacementIndex(root),
        path,
      };
    })
    .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry));

  candidates.sort((a, b) => (
    IMPACT_TIER_RANK[b.debug.peakImpactTier] - IMPACT_TIER_RANK[a.debug.peakImpactTier]
    || b.debug.impactEventCount - a.debug.impactEventCount
    || a.rootIndex - b.rootIndex
    || a.unit.runtimeId - b.unit.runtimeId
  ));

  const best = candidates[0] ?? null;
  const mostImpactedTarget = best ? {
    unitId: best.unit.definition.id,
    displayName: best.unit.definition.displayName,
    runtimeId: best.unit.runtimeId,
    team: best.unit.team as 0 | 1,
    alive: !best.unit.isDead,
    linkedParentId: best.unit.linkedParent?.runtimeId ?? null,
    rootRuntimeId: best.root.runtimeId,
    rootUnitId: best.root.definition.id,
    path: best.path.path,
    tier: best.path.tier,
    eventCount: best.path.eventCount,
  } : null;

  const summaryLines = [
    `Time: ${result.durationSeconds.toFixed(1)}s`,
    `Recap: ${outcomeLabel}.`,
    `Remaining: Team A ${result.teamALiving}, Team B ${result.teamBLiving}`,
    mostImpactedTarget
      ? `Most impacted: ${mostImpactedTarget.displayName} (${formatTeamLabel(mostImpactedTarget.team)}) took ${mostImpactedTarget.eventCount} ${mostImpactedTarget.path} ${mostImpactedTarget.eventCount === 1 ? "event" : "events"} peaking at ${mostImpactedTarget.tier}.`
      : "Most impacted: No major impact was recorded.",
  ];

  return {
    outcome: {
      label: outcomeLabel,
      winner: result.isDraw ? null : result.winner,
      isDraw: result.isDraw,
      durationSeconds: result.durationSeconds,
    },
    survivors: {
      teamA: result.teamALiving,
      teamB: result.teamBLiving,
      source: "BattleResult.teamLivingFields",
    },
    mostImpactedTarget,
    summaryLines,
  };
}

function showResult(result: BattleResult): void {
  lastBattleRecap = buildBattleRecap(result);
  if (btnResultPrimaryEl) {
    btnResultPrimaryEl.textContent = campaignSession
      ? (!result.isDraw && result.winner === 0 ? "Next Scenario" : "Retry")
      : "Continue";
  }
  if (btnResultSecondaryEl) {
    btnResultSecondaryEl.textContent = campaignSession
      ? (!result.isDraw && result.winner === 0 ? "Replay" : "Sandbox")
      : "Reset";
    // Sandbox shows the one continue prompt, as TABS does; R still resets
    btnResultSecondaryEl.style.display = campaignSession ? "" : "none";
  }
  // TABS shows one word; only a lost campaign battle reads as a defeat
  resultTitleEl.textContent = result.isDraw ? "Draw" : (campaignSession && result.winner !== 0 ? "Defeat!" : "Victory!");
  resultDetailEl.textContent = lastBattleRecap.summaryLines.join("\n");
  resultOverlayEl.classList.add("visible");
  if (campaignSession) {
    const isPlayerVictory = !result.isDraw && result.winner === 0;
    pendingCampaignResultAction = isPlayerVictory ? "advance" : "retry";
    const outcomeText = isPlayerVictory
      ? "Click Next Scenario to continue, or Replay to run this battle again."
      : "Click Retry to replay this campaign battle.";
    resultDetailEl.textContent += `\n${outcomeText}`;
    clearPendingCampaignResolution();
  }
}

function playAgain(): void {
  lastBattleRecap = null;
  if (campaignSession) {
    reloadCurrentCampaignScenario("Campaign battle reloaded.");
    return;
  }
  resultOverlayEl.classList.remove("visible");

  for (let i = placedUnits.length - 1; i >= 0; i--) {
    const unit = placedUnits[i];
    if (unit.spawnRole !== "summoned" && !unit.linkedParent) continue;
    simulation.unregisterUnit(unit);
    unit.dispose();
    placedUnits.splice(i, 1);
  }

  // Reset all units back to their original positions
  for (const unit of placedUnits) {
    if (unit.linkedParent) continue;
    unit.resetToSpawn();
    simulation.registerUnit(unit);
    applyLinkedParentSemantics(unit);
    spawnLinkedActorsForParent(unit);
  }

  // Rebuild budget from scratch, then subtract placed unit costs
  budgetSystem = new BudgetSystem(
    BATTLE_CONFIG.teamABudget, BATTLE_CONFIG.teamBBudget, BATTLE_CONFIG.maxUnitsPerTeam,
  );
  for (const unit of placedUnits) {
    if (unit.linkedParent) continue;
    budgetSystem.trySpend(unit.team, unit.definition.cost);
  }

  projectileSystem.dispose();
  visualEffects.dispose();
  impactPresentation.reset();

  removeMode = false;
  btnRemoveEl?.classList.remove("remove-active");
  camCtrl.returnToPlacementView();
  bodyEl.classList.remove("in-battle");
  setPlacementGuidesVisible(scene, true);
  stateMachine.setState(GameState.Placement);
  updateBudgetDisplay();
  showStatus("Ready for another round!");
}

function loadCampaignScenario(statusMessage?: string): void {
  const activeCampaign = getActiveCampaignDefinition();
  const activeScenario = getActiveCampaignScenarioDefinition();
  if (!campaignSession || !activeCampaign || !activeScenario) return;
  lastBattleRecap = null;
  selectedCampaignId = activeCampaign.id;
  selectedCampaignScenarioId = activeScenario.id;
  clearPendingCampaignResolution();
  resetBattle({
    preserveCampaignSession: true,
    suppressStatus: true,
  });
  loadMapById(activeScenario.mapId);
  budgetSystem = new BudgetSystem(
    campaignSession.unlimited ? Number.MAX_SAFE_INTEGER : activeScenario.restrictions.budget,
    0,
    BATTLE_CONFIG.maxUnitsPerTeam,
  );
  applyCampaignPlacements(activeScenario.placements);
  buildUnitPanel();
  updateBudgetDisplay();
  updateSelectedUnitDisplay();
  resultOverlayEl.classList.remove("visible");
  showStatus(statusMessage ?? `${activeCampaign.displayName}: ${activeScenario.displayName}`);
}

function reloadCurrentCampaignScenario(statusMessage?: string): void {
  if (!campaignSession) return;
  loadCampaignScenario(statusMessage);
}

function advanceCampaignAfterVictory(): void {
  if (!campaignSession) return;
  const nextSession = advanceCampaignSession(campaignSession);
  const advanced = nextSession.campaignIndex !== campaignSession.campaignIndex;
  const sameCampaignAdvance = nextSession.campaignId === campaignSession.campaignId
    && nextSession.scenarioIndex !== campaignSession.scenarioIndex;
  campaignSession = nextSession;
  loadCampaignScenario(
    advanced
      ? `Advanced to ${getActiveCampaignDefinition()?.displayName}.`
      : sameCampaignAdvance
        ? `Advanced to ${getActiveCampaignScenarioDefinition()?.displayName}.`
        : "Final campaign cleared. Replaying the final battle.",
  );
}

function setCampaignUnlimited(enabled: boolean): void {
  if (!campaignSession) return;
  if (campaignSession.unlimited === enabled) return;
  campaignSession = { ...campaignSession, unlimited: enabled };
  buildUnitPanel();
  updateBudgetDisplay();
  if (!enabled) {
    reloadCurrentCampaignScenario("Unlimited disabled. Scenario reloaded.");
    return;
  }
  showStatus("Unlimited enabled.");
}

function leaveCampaignMode(): void {
  clearPendingCampaignResolution();
  toggleCampaignOverlay(false);
  campaignSession = null;
  clearLockedCampaignUnits();
  selectedCampaignId = null;
  selectedCampaignScenarioId = null;
  resetBattle({
    preserveCampaignSession: true,
    restoreSandboxMap: true,
    suppressStatus: true,
  });
  budgetSystem = new BudgetSystem(
    BATTLE_CONFIG.teamABudget,
    BATTLE_CONFIG.teamBBudget,
    BATTLE_CONFIG.maxUnitsPerTeam,
  );
  buildUnitPanel();
  updateBudgetDisplay();
  updateSelectedUnitDisplay();
  showStatus("Returned to sandbox.");
}

function buildSuggestedCampaignPlayerPlacements(scenario: CampaignScenarioDefinition): CampaignPlacementSpec[] {
  const candidateUnits = scenario.restrictions.allowedUnitIds
    .map((unitId) => getUnit(unitId))
    .filter((unit): unit is UnitDefinition => unit !== undefined)
    .sort((a, b) => a.cost - b.cost);
  if (candidateUnits.length === 0) return [];

  const uniqueCandidates: UnitDefinition[] = [];
  for (const unit of candidateUnits) {
    if (uniqueCandidates.some((candidate) => candidate.id === unit.id)) continue;
    uniqueCandidates.push(unit);
    if (uniqueCandidates.length >= 3) break;
  }

  const teamZones = activeMapInstance.zones
    .filter((zone) => zone.team === 0)
    .sort((a, b) => a.center.z - b.center.z);
  if (teamZones.length === 0) return [];

  const targetBudget = Math.max(240, Math.min(scenario.restrictions.budget, 1200));
  const placementsOut: CampaignPlacementSpec[] = [];
  let spent = 0;
  let placementIndex = 0;

  for (const zone of teamZones) {
    const unit = uniqueCandidates[placementIndex % uniqueCandidates.length];
    if (spent + unit.cost > targetBudget && placementsOut.length > 0) break;
    placementsOut.push({
      unitId: unit.id,
      team: 0,
      position: {
        x: zone.center.x + zone.size.x * 0.18,
        z: zone.center.z,
      },
      locked: false,
    });
    spent += unit.cost;
    placementIndex += 1;
  }

  const primaryZone = teamZones[Math.floor(teamZones.length / 2)] ?? teamZones[0];
  const offsets = [-10, -5, 0, 5, 10];
  let offsetIndex = 0;
  while (spent < targetBudget && placementsOut.length < 7) {
    const unit = uniqueCandidates[placementIndex % uniqueCandidates.length];
    if (spent + unit.cost > targetBudget && placementsOut.length >= 3) break;
    placementsOut.push({
      unitId: unit.id,
      team: 0,
      position: {
        x: primaryZone.center.x + primaryZone.size.x * 0.1,
        z: primaryZone.center.z + offsets[offsetIndex % offsets.length],
      },
      locked: false,
    });
    spent += unit.cost;
    placementIndex += 1;
    offsetIndex += 1;
  }

  return placementsOut;
}

function getCampaignScenarioHazardOverlaps(scenario: CampaignScenarioDefinition): string[] {
  const failures: string[] = [];
  for (const placement of scenario.placements) {
    const unit = getUnit(placement.unitId);
    if (!unit) {
      failures.push(`Unknown unit in placement: ${placement.unitId}`);
      continue;
    }
    const point = new Vector3(placement.position.x, placement.position.y ?? 0, placement.position.z);
    const inHazard = activeMapInstance.hazards.find((hazard) => isPointInsideHazard(point, hazard, unit.collisionRadius * 0.35));
    if (inHazard) {
      failures.push(`${scenario.id}:${placement.unitId} overlaps ${inHazard.kind} at spawn`);
    }
  }
  return failures;
}

function validateCurrentCampaignScenario() {
  const campaign = getActiveCampaignDefinition();
  const scenario = getActiveCampaignScenarioDefinition();
  if (!campaign || !scenario || !campaignSession) {
    return {
      valid: false,
      reason: "No active campaign scenario loaded.",
    };
  }

  const hazardOverlaps = getCampaignScenarioHazardOverlaps(scenario);
  return {
    valid: hazardOverlaps.length === 0,
    campaignId: campaign.id,
    campaignName: campaign.displayName,
    scenarioId: scenario.id,
    scenarioName: scenario.displayName,
    scenarioIndex: campaignSession.scenarioIndex,
    scenarioCount: campaign.scenarios.length,
    budget: scenario.restrictions.budget,
    allowedUnitCount: scenario.restrictions.allowedUnitIds.length,
    lockedPlacementCount: scenario.placements.length,
    validationTier: scenario.validationTier ?? "smoke",
    validationTags: scenario.validationTags ?? [],
    hazardOverlaps,
  };
}

function countAliveUnitsInHazards(team: number): number {
  if (activeMapInstance.hazards.length === 0) return 0;
  return placedUnits.filter((unit) => (
    !unit.linkedParent
    && !unit.isDead
    && unit.team === team
    && activeMapInstance.hazards.some((hazard) => isPointInsideHazard(unit.position, hazard, Math.max(0.15, unit.definition.collisionRadius * 0.2)))
  )).length;
}

function runCampaignSmokeCheck(
  campaignId: CampaignId,
  scenarioId?: string,
  options: { advanceMs?: number; spawnPlayerSeed?: boolean } = {},
) {
  const nextSession = createCampaignSession(campaignId, campaignSession?.unlimited ?? false, scenarioId);
  if (!nextSession) {
    return { valid: false, reason: `Unknown campaign ${campaignId}` };
  }
  campaignSession = nextSession;
  loadCampaignScenario("Campaign loaded for smoke check.");
  const activeScenario = getActiveCampaignScenarioDefinition();
  if (!activeScenario) {
    return { valid: false, reason: "No active campaign scenario after load." };
  }

  const preflight = validateCurrentCampaignScenario();
  const seededPlacements = options.spawnPlayerSeed === false
    ? []
    : buildSuggestedCampaignPlayerPlacements(activeScenario);
  for (const placement of seededPlacements) {
    spawnHarnessUnit(placement.unitId, placement.team, placement.position, {
      role: "placed",
      countsTowardVictory: true,
    });
  }

  const before = buildGameStatePayload();
  if (seededPlacements.length > 0) {
    startBattle(true);
  }
  const advanceMs = options.advanceMs ?? activeScenario.smokeAdvanceMs ?? 3000;
  if (advanceMs > 0) {
    advanceSimulationTime(advanceMs);
  }
  const after = buildGameStatePayload();
  const aliveA = after.units.filter((unit) => unit.team === 0 && unit.alive && unit.linkedParentId === null).length;
  const aliveB = after.units.filter((unit) => unit.team === 1 && unit.alive && unit.linkedParentId === null).length;
  const lakeOverlapA = countAliveUnitsInHazards(0);
  const lakeOverlapB = countAliveUnitsInHazards(1);

  return {
    valid: preflight.valid && lakeOverlapA === 0 && lakeOverlapB === 0,
    preflight,
    seededPlacements,
    before: {
      mode: before.mode,
      livingA: before.units.filter((unit) => unit.team === 0 && unit.alive && unit.linkedParentId === null).length,
      livingB: before.units.filter((unit) => unit.team === 1 && unit.alive && unit.linkedParentId === null).length,
    },
    after: {
      mode: after.mode,
      livingA: aliveA,
      livingB: aliveB,
      hazardOverlapA: lakeOverlapA,
      hazardOverlapB: lakeOverlapB,
    },
  };
}

function runCampaignScenarioDeterministicCheck(campaignId: CampaignId, scenarioId?: string) {
  return runCampaignSmokeCheck(campaignId, scenarioId, { spawnPlayerSeed: true });
}

function runCampaignProgressionCheck(campaignId: CampaignId) {
  const campaign = listCampaignDefinitions().find((entry) => entry.id === campaignId);
  if (!campaign) {
    return { valid: false, reason: `Unknown campaign ${campaignId}` };
  }

  const initialSession = createCampaignSession(campaignId, false);
  if (!initialSession) {
    return { valid: false, reason: `Failed to create campaign session for ${campaignId}` };
  }

  const progression: Array<{ campaignId: string; scenarioId: string; scenarioIndex: number }> = [];
  let session = initialSession;
  progression.push({
    campaignId: session.campaignId,
    scenarioId: session.scenarioId,
    scenarioIndex: session.scenarioIndex,
  });

  for (let i = 0; i < campaign.scenarios.length; i++) {
    const next = advanceCampaignSession(session);
    progression.push({
      campaignId: next.campaignId,
      scenarioId: next.scenarioId,
      scenarioIndex: next.scenarioIndex,
    });
    session = next;
  }

  const replaySession = createCampaignSession(campaignId, false, campaign.scenarios[Math.min(1, campaign.scenarios.length - 1)].id);
  const replayStable = Boolean(replaySession && replaySession.scenarioId === campaign.scenarios[Math.min(1, campaign.scenarios.length - 1)].id);
  const firstAdvance = progression[1];
  const finalAdvance = progression[progression.length - 1];

  return {
    valid: initialSession.scenarioIndex === 0
      && firstAdvance?.campaignId === campaignId
      && firstAdvance?.scenarioIndex === 1
      && replayStable
      && Boolean(finalAdvance),
    initial: progression[0],
    firstAdvance,
    finalAdvance,
    replayStable,
    progression,
  };
}

function spawnHarnessUnit(
  unitId: string,
  team: number,
  position: { x: number; y?: number; z: number },
  options: SpawnUnitOptions = {},
): RuntimeUnit | null {
  dismissTitleIntro();
  if (stateMachine.currentState !== GameState.Placement) return null;
  const unit = spawnRuntimeUnit(unitId, team, new Vector3(position.x, position.y ?? 0, position.z), options);
  updateBudgetDisplay();
  return unit;
}

function advanceSimulationTime(ms: number): void {
  const steps = Math.max(1, Math.round(ms / (1000 / 60)));
  for (let i = 0; i < steps; i++) {
    worldTimeSeconds += 1 / 60;
    camCtrl.advanceTransition(1 / 60);
    tick(1 / 60, worldTimeSeconds);
  }
  scene.render();
}

function findScenarioRootRuntime(unitId: string): RuntimeUnit | null {
  return placedUnits.find((unit) => unit.definition.id === unitId && !unit.linkedParent) ?? null;
}

function applyScenarioAction(action: ScenarioAction): void {
  if (action.kind === "damage-linked-role") {
    const parentUnitId = action.parentUnitId;
    const role = action.role;
    if (!parentUnitId || !role) {
      showStatus("Scenario action is missing parentUnitId or role.");
      return;
    }
    const root = findScenarioRootRuntime(parentUnitId);
    if (!root) {
      showStatus(`Scenario action missing root ${parentUnitId}.`);
      return;
    }
    const child = root.linkedChildren.find((candidate) => candidate.linkedRoleLabel === role);
    if (!child) {
      showStatus(`Scenario action missing role ${parentUnitId}:${role}.`);
      return;
    }
    child.applyDamage(action.damage, Vector3.Zero());
    return;
  }
  if (action.kind === "damage-root-unit") {
    const root = findScenarioRootRuntime(action.unitId ?? "");
    if (!root) {
      showStatus(`Scenario action missing root ${action.unitId}.`);
      return;
    }
    const impulse = action.impulse
      ? new Vector3(action.impulse.x, action.impulse.y ?? 0, action.impulse.z)
      : Vector3.Zero();
    root.applyDamage(action.damage, impulse);
  }
}

function applyScenarioActions(scenario: ScenarioSpec): void {
  for (const action of scenario.actions ?? []) {
    applyScenarioAction(action);
  }
}

function hydrateScenario(scenario: ScenarioSpec, options: { preserveGallerySession?: boolean } = {}): void {
  resetBattle(options);
  clearPendingCampaignResolution();
  campaignSession = null;
  clearLockedCampaignUnits();
  selectedCampaignId = null;
  selectedCampaignScenarioId = null;
  loadMapById(scenario.mapId ?? DEFAULT_BATTLE_MAP_ID);
  activeScenario = scenario;
  for (const unit of scenario.units) {
    spawnHarnessUnit(unit.unitId, unit.team, unit.position);
  }
  applyScenarioActions(scenario);
}

function runScenarioSpec(
  scenario: ScenarioSpec,
  options: {
    autoStart?: boolean;
    advanceMs?: number;
    preserveGallerySession?: boolean;
  } = {},
): ScenarioSpec {
  dismissTitleIntro();
  hydrateScenario(scenario, { preserveGallerySession: options.preserveGallerySession });
  const autoStart = options.autoStart ?? scenario.autoStart ?? false;
  const advanceMs = options.advanceMs ?? scenario.advanceMs ?? 0;

  if (autoStart) startBattle(true);
  if (advanceMs > 0) {
    advanceSimulationTime(advanceMs);
  }
  return scenario;
}

function runScenario(name: string): ScenarioSpec | null {
  const scenario = getScenario(name);
  if (!scenario) {
    showStatus(`Unknown scenario: ${name}`);
    return null;
  }
  return runScenarioSpec(scenario);
}

type GameTextState = ReturnType<typeof buildGameStatePayload>;
type GameTextUnitState = GameTextState["units"][number];

interface ScenarioAssertionResult {
  kind: string;
  value: string;
  passed: boolean;
  skipped?: boolean;
  details: string;
}

interface ScenarioCheckResult {
  scenario: string;
  passed: boolean;
  failures: string[];
  results: ScenarioAssertionResult[];
  state: GameTextState;
}

interface GalleryCaptureManifestEntry {
  scenario: string;
  presetId: string;
  capturePhase: ScenarioCapturePhase;
  artifactDirectory: string;
  artifactBaseName: string;
  expectedScreenshotPath: string;
  expectedManifestPath: string;
  hideUiDuringCapture: boolean;
  settledFrames: number;
  captureAdvanceMs: number;
  reviewModes: string[];
  reviewOrder: string[];
  status: "passed" | "failed";
}

interface GalleryValidationResult extends ScenarioCheckResult {
  capture: GalleryCaptureManifestEntry & {
    camera: CameraViewState;
  };
}

interface NumericExpectation {
  operator: "=" | ">=" | "<=";
  expected: number;
}

interface BattleRecap {
  outcome: {
    label: string;
    winner: number | null;
    isDraw: boolean;
    durationSeconds: number;
  };
  survivors: {
    teamA: number;
    teamB: number;
    source: "BattleResult.teamLivingFields";
  };
  mostImpactedTarget: null | {
    unitId: string;
    displayName: string;
    runtimeId: number;
    team: 0 | 1;
    alive: boolean;
    linkedParentId: number | null;
    rootRuntimeId: number;
    rootUnitId: string;
    path: ImpactPath;
    tier: ImpactTier;
    eventCount: number;
  };
  summaryLines: string[];
}

const impactPaths = new Set<ImpactPath>(IMPACT_PATHS);

const galleryManifest = new Map<string, GalleryCaptureManifestEntry>();

function buildGameStatePayload() {
  const activeCampaign = getActiveCampaignDefinition();
  const activeCampaignScenario = getActiveCampaignScenarioDefinition();
  const impactDebug = impactPresentation.getDebugSnapshot();
  return {
    coordinateSystem: "x:right, z:forward, y:up, origin:center line",
    mode: GameState[stateMachine.currentState],
    scenario: activeScenario?.name ?? null,
    campaign: campaignSession ? {
      campaignId: campaignSession.campaignId,
      scenarioId: campaignSession.scenarioId,
      scenarioIndex: campaignSession.scenarioIndex,
      campaignIndex: campaignSession.campaignIndex,
      scenarioCount: activeCampaign?.scenarios.length ?? 0,
      scenarioName: activeCampaignScenario?.displayName ?? null,
      unlimited: campaignSession.unlimited,
      mapId: activeMapInstance.id,
    } : null,
    activeFaction: FACTION_NAMES[activeFaction],
    selectedUnitId,
    budgets: {
      teamA: budgetSystem.getRemaining(0),
      teamB: budgetSystem.getRemaining(1),
    },
    resultOverlay: {
      visible: resultOverlayEl.classList.contains("visible"),
      title: resultTitleEl.textContent ?? "",
      detail: resultDetailEl.textContent ?? "",
      detailWhiteSpace: getComputedStyle(resultDetailEl).whiteSpace,
      primaryLabel: btnResultPrimaryEl?.textContent ?? "",
      secondaryLabel: btnResultSecondaryEl?.textContent ?? "",
      pendingCampaignResultAction,
    },
    map: {
      id: activeMapInstance.id,
      displayName: activeMapInstance.displayName,
      zones: activeMapInstance.zones.length,
      hazards: activeMapInstance.hazards.length,
      obstacles: activeMapInstance.obstacles.length,
    },
    units: placedUnits.map((unit) => {
      const unitImpactDebug = impactPresentation.getUnitDebug(unit);
      const attackEmitter = unit.getAttackEmitter();
      const impactEmitter = unit.getImpactEmitter();
      const attackOrigin = unit.getAttackOrigin(false);
      const smokeOrigin = unit.getSmokeOrigin(false);
      const impactOrigin = unit.getImpactOrigin(false);
      return {
        runtimeId: unit.runtimeId,
        id: unit.definition.id,
        name: unit.definition.displayName,
        team: unit.team,
        role: unit.spawnRole,
        compositeRole: unit.linkedRoleLabel,
        linkedParentRole: unit.linkedParentRoleLabel,
        anchored: unit.isAnchoredActor,
        targetable: unit.isTargetable,
        combatEmitter: unit.isCombatEmitter,
        impactOrigin: unit.isImpactOrigin,
        damageRouting: unit.damageRouting,
        victoryRouting: unit.victoryRouting,
        moveMode: unit.moveMode,
        cleanupPolicy: unit.cleanupPolicy,
        detachOnParentDeath: unit.detachOnParentDeath,
        actionPreset: unit.actionPreset,
        contributionChannels: unit.contributionChannels,
        physicsState: unit.physicsState,
        battleFeelState: unit.battleFeelState,
        balanceState: unit.balanceState,
        contactRole: unit.contactRole,
        attackCapability: unit.hasCapability("attack") ? "enabled" : "disabled",
        moveCapability: unit.hasCapability("move") ? "enabled" : "disabled",
        disabledByRole: [
          ...unit.getMissingContributionRoles("attack"),
          ...unit.getMissingContributionRoles("move"),
        ],
        physicsDisabled: unit.getPhysicsDisabledChannels(),
        attackEmitterRole: attackEmitter === unit ? "parent" : (attackEmitter.linkedRoleLabel ?? attackEmitter.definition.displayName),
        attackEmitterId: attackEmitter.runtimeId,
        attackOriginSource: attackOrigin.source,
        attackOriginSocket: attackOrigin.socket ?? null,
        impactEmitterRole: impactEmitter === unit ? "parent" : (impactEmitter.linkedRoleLabel ?? impactEmitter.definition.displayName),
        impactEmitterId: impactEmitter.runtimeId,
        impactOriginSource: impactOrigin.source,
        impactOriginSocket: impactOrigin.socket ?? null,
        smokeOriginSource: smokeOrigin.source,
        smokeOriginSocket: smokeOrigin.socket ?? null,
        decorativeStandinsSuppressed: unit.decorativeStandinsSuppressed,
        countsTowardVictory: unit.countsTowardVictory,
        linkedParentId: unit.linkedParent?.runtimeId ?? null,
        linkedRelation: unit.linkedRelation,
        linkedEntities: unit.linkedEntities,
        alive: !unit.isDead,
        hp: Math.round(unit.currentHealth),
        maxHp: Math.round(unit.maxHealth),
        healthBarVisible: Boolean(unit.healthBarMesh?.isVisible && unit.healthBarBg?.isVisible),
        healthBarFillRatio: Number((unit.healthBarMesh?.scaling.x ?? 0).toFixed(2)),
        staggered: unit.isStaggered,
        crowdPressure: Number(unit.crowdPressure.toFixed(2)),
        balancePressure: Number(unit.balancePressure.toFixed(2)),
        pressureLoad: Number(unit.pressureLoad.toFixed(2)),
        pressureLoaded: unit.isPressureLoaded,
        pressureTransferred: Number(unit.pressureTransferred.toFixed(2)),
        attackInterrupted: unit.attackInterrupted,
        attackInterruptedCount: unit.attackInterruptedCount,
        downedBlockActive: unit.downedBlockActive,
        downedSecondsRemaining: Number(unit.downedSecondsRemaining.toFixed(2)),
        lastContactRole: unit.lastContactRole,
        toppleDirection: unit.toppleDirectionTag,
        toppleForwardness: Number(unit.toppleForwardness.toFixed(2)),
        crowdPhysicsProfileId: unit.crowdPhysicsProfileId,
        horizontalSpeed: Number(unit.horizontalSpeed.toFixed(2)),
        airborne: unit.isAirborne,
        collisionPushTotal: Number(unit.collisionPushTotal.toFixed(2)),
        collisionPushPeak: Number(unit.collisionPushPeak.toFixed(2)),
        collisionContacts: unit.collisionContactCount,
        lastImpactTier: unitImpactDebug?.lastImpactTier ?? "none",
        peakImpactTier: unitImpactDebug?.peakImpactTier ?? "none",
        impactEventCount: unitImpactDebug?.impactEventCount ?? 0,
        lastImpactPath: unitImpactDebug?.lastImpactPath ?? null,
        impactPeakByPath: unitImpactDebug?.peakByPath ?? {},
        impactCountsByPath: unitImpactDebug?.countsByPath ?? {},
        y: Number(unit.position.y.toFixed(2)),
        x: Number(unit.position.x.toFixed(2)),
        z: Number(unit.position.z.toFixed(2)),
      };
    }),
    projectiles: projectileSystem.activeCount,
    impactDebug,
    battleRecap: lastBattleRecap,
  };
}

function buildGalleryManifestEntry(
  scenario: ScenarioSpec,
  gallery: ScenarioGallerySpec,
  passed: boolean,
): GalleryCaptureManifestEntry {
  const artifactDirectory = "output/gallery-validation";
  const artifactBaseName = gallery.artifactBaseName ?? scenario.name;
  return {
    scenario: scenario.name,
    presetId: gallery.presetId,
    capturePhase: gallery.capturePhase,
    artifactDirectory,
    artifactBaseName,
    expectedScreenshotPath: `${artifactDirectory}/${artifactBaseName}.png`,
    expectedManifestPath: `${artifactDirectory}/gallery-manifest.json`,
    hideUiDuringCapture: gallery.hideUiDuringCapture ?? true,
    settledFrames: gallery.settleFrames ?? 2,
    captureAdvanceMs: gallery.captureAdvanceMs ?? 0,
    reviewModes: gallery.reviewModes ?? ["default"],
    reviewOrder: gallery.reviewOrder ?? ["default"],
    status: passed ? "passed" : "failed",
  };
}

function parseUnitClauses(value: string): Array<{ unitId: string; clause: string }> {
  const parts = value.split(",").map((part) => part.trim()).filter(Boolean);
  const clauses: Array<{ unitId: string; clause: string }> = [];
  let currentUnitId: string | null = null;
  for (const part of parts) {
    const colonIndex = part.indexOf(":");
    if (colonIndex >= 0) {
      currentUnitId = part.slice(0, colonIndex).trim();
      clauses.push({ unitId: currentUnitId, clause: part.slice(colonIndex + 1).trim() });
    } else if (currentUnitId) {
      clauses.push({ unitId: currentUnitId, clause: part });
    }
  }
  return clauses;
}

function getScenarioRootUnits(state: GameTextState, unitId: string): GameTextUnitState[] {
  return state.units.filter((unit) => unit.id === unitId && unit.linkedParentId === null);
}

function getScenarioRoot(state: GameTextState, unitId: string): GameTextUnitState | null {
  return getScenarioRootUnits(state, unitId)[0] ?? null;
}

function getLinkedChildrenForRoot(state: GameTextState, root: GameTextUnitState): GameTextUnitState[] {
  return state.units.filter((unit) => unit.linkedParentId === root.runtimeId);
}

function getLinkedRoleForRoot(
  state: GameTextState,
  root: GameTextUnitState,
  role: string,
): GameTextUnitState | null {
  return getLinkedChildrenForRoot(state, root).find((unit) => unit.compositeRole === role) ?? null;
}

function evaluateReplayRestoreClauses(state: GameTextState, value: string): string[] {
  const clauses = parseUnitClauses(value);
  const failures: string[] = [];
  for (const { unitId, clause } of clauses) {
    const root = getScenarioRoot(state, unitId);
    if (!root) {
      failures.push(`Missing root unit ${unitId}`);
      continue;
    }
    const pairs = clause.split("+").map((entry) => entry.trim()).filter(Boolean);
    for (const pair of pairs) {
      const roleMatch = pair.match(/^([^=]+)=(alive|dead)$/);
      if (roleMatch) {
        const role = roleMatch[1].trim();
        const expectedAlive = roleMatch[2] === "alive";
        const linkedRole = getLinkedRoleForRoot(state, root, role);
        if (!linkedRole) {
          failures.push(`Missing role ${role} on ${unitId}`);
          continue;
        }
        if (linkedRole.alive !== expectedAlive) {
          failures.push(`${unitId}:${role} expected ${expectedAlive ? "alive" : "dead"} after replay, got ${linkedRole.alive ? "alive" : "dead"}`);
        }
        continue;
      }

      const capabilityMatch = pair.match(/^(attack|move)=(enabled|disabled)$/);
      if (capabilityMatch) {
        const capability = capabilityMatch[1];
        const expected = capabilityMatch[2];
        const actual = capability === "attack" ? root.attackCapability : root.moveCapability;
        if (actual !== expected) {
          failures.push(`${unitId}:${capability} expected ${expected} after replay, got ${actual}`);
        }
        continue;
      }

      failures.push(`Unsupported replay-restore clause: ${unitId}:${pair}`);
    }
  }
  return failures;
}

function parseNumericExpectation(clause: string): NumericExpectation | null {
  const match = clause.match(/(>=|<=|=)(-?\d+(?:\.\d+)?)$/);
  if (!match) return null;
  return {
    operator: match[1] as NumericExpectation["operator"],
    expected: Number(match[2]),
  };
}

function compareNumeric(actual: number, expectation: NumericExpectation): boolean {
  switch (expectation.operator) {
    case "=":
      return actual === expectation.expected;
    case ">=":
      return actual >= expectation.expected;
    case "<=":
      return actual <= expectation.expected;
  }
}

function getInitialUnitSpec(scenario: ScenarioSpec, unitId: string): { x: number; y?: number; z: number } | null {
  return scenario.units.find((unit) => unit.unitId === unitId)?.position ?? null;
}

function evaluateSpawnedChildCountClauses(state: GameTextState, value: string): string[] {
  const clauses = parseUnitClauses(value);
  const failures: string[] = [];
  for (const { unitId, clause } of clauses) {
    const expectation = parseNumericExpectation(clause);
    const relation = clause.replace(/(>=|<=|=)-?\d+(?:\.\d+)?$/, "").trim();
    if (!expectation || relation !== "spawned-child") {
      failures.push(`Unsupported spawned-child clause: ${unitId}:${clause}`);
      continue;
    }
    const root = getScenarioRoot(state, unitId);
    if (!root) {
      failures.push(`Missing root unit ${unitId}`);
      continue;
    }
    const actual = getLinkedChildrenForRoot(state, root)
      .filter((child) => child.linkedRelation === "spawned-child" && child.alive)
      .length;
    if (!compareNumeric(actual, expectation)) {
      failures.push(`${unitId}:${relation} expected ${expectation.operator}${expectation.expected}, got ${actual}`);
    }
  }
  return failures;
}

function evaluateCrowdMetricClauses(state: GameTextState, value: string): string[] {
  const clauses = parseUnitClauses(value);
  const failures: string[] = [];
  for (const { unitId, clause } of clauses) {
    const root = getScenarioRoot(state, unitId);
    if (!root) {
      failures.push(`Missing root unit ${unitId}`);
      continue;
    }

    const checks = clause.split("+").map((entry) => entry.trim()).filter(Boolean);
    for (const check of checks) {
      const match = check.match(/^([A-Za-z]+)(>=|<=|=)(-?\d+(?:\.\d+)?)$/);
      if (!match) {
        failures.push(`Unsupported crowd-metric clause: ${unitId}:${check}`);
        continue;
      }

      const metric = match[1];
      const expectation: NumericExpectation = {
        operator: match[2] as NumericExpectation["operator"],
        expected: Number(match[3]),
      };

      let actual: number | null = null;
      switch (metric) {
        case "collisionContactCount":
        case "collisionContacts":
          actual = root.collisionContacts;
          break;
        case "collisionPushPeak":
          actual = root.collisionPushPeak;
          break;
        case "collisionPushTotal":
          actual = root.collisionPushTotal;
          break;
        case "crowdPressure":
          actual = Number((root as { crowdPressure?: number }).crowdPressure ?? 0);
          break;
        case "balancePressure":
          actual = Number((root as { balancePressure?: number }).balancePressure ?? 0);
          break;
        case "pressureLoad":
          actual = Number((root as { pressureLoad?: number }).pressureLoad ?? 0);
          break;
        case "toppleForwardness":
          actual = Number((root as { toppleForwardness?: number }).toppleForwardness ?? 0);
          break;
        case "y":
          actual = Number((root as { y?: number }).y ?? 0);
          break;
        case "horizontalSpeed":
          actual = root.horizontalSpeed;
          break;
        default:
          failures.push(`Unsupported crowd metric ${metric} on ${unitId}`);
          break;
      }

      if (actual === null) continue;
      if (!compareNumeric(actual, expectation)) {
        failures.push(`${unitId}:${metric} expected ${expectation.operator}${expectation.expected}, got ${actual}`);
      }
    }
  }
  return failures;
}

function getEmitterRoleSet(state: GameTextState, root: GameTextUnitState): Set<string> {
  const roles = new Set<string>();
  if (root.combatEmitter) roles.add("parent");
  for (const child of getLinkedChildrenForRoot(state, root)) {
    if (child.combatEmitter && child.compositeRole) roles.add(child.compositeRole);
  }
  if (roles.size === 0) roles.add(root.attackEmitterRole);
  return roles;
}

function getImpactRoleSet(state: GameTextState, root: GameTextUnitState): Set<string> {
  const roles = new Set<string>();
  if (root.impactOrigin) roles.add("parent");
  for (const child of getLinkedChildrenForRoot(state, root)) {
    if (child.impactOrigin && child.compositeRole) roles.add(child.compositeRole);
  }
  if (roles.size === 0) roles.add(root.impactEmitterRole);
  return roles;
}

function isImpactTier(value: string): value is ImpactTier {
  return Object.prototype.hasOwnProperty.call(IMPACT_TIER_RANK, value);
}

function isImpactPath(value: string): value is ImpactPath {
  return impactPaths.has(value as ImpactPath);
}

function compareImpactTier(actual: ImpactTier, operator: ">=" | "<=", expected: ImpactTier): boolean {
  return operator === ">="
    ? IMPACT_TIER_RANK[actual] >= IMPACT_TIER_RANK[expected]
    : IMPACT_TIER_RANK[actual] <= IMPACT_TIER_RANK[expected];
}

function getUnitImpactTier(root: GameTextUnitState, path: string): ImpactTier {
  if (path === "any") return ((root as { peakImpactTier?: ImpactTier }).peakImpactTier ?? "none");
  const byPath = (root as { impactPeakByPath?: Partial<Record<ImpactPath, ImpactTier>> }).impactPeakByPath ?? {};
  return byPath[path as ImpactPath] ?? "none";
}

function getGlobalImpactTier(state: GameTextState, path: string): ImpactTier {
  if (path === "any") return state.impactDebug.peakTier;
  let peak: ImpactTier = "none";
  for (const unit of state.impactDebug.units) {
    const tier = unit.peakByPath[path as ImpactPath] ?? "none";
    if (IMPACT_TIER_RANK[tier] > IMPACT_TIER_RANK[peak]) peak = tier;
  }
  return peak;
}

function evaluateImpactTierAssertion(
  state: GameTextState,
  value: string,
  operator: ">=" | "<=",
): string[] {
  const match = value.match(/^([^:]+):([^<>=]+)(>=|<=)([A-Za-z]+)$/);
  if (!match || match[3] !== operator) return [`Unsupported impact-tier clause: ${value}`];
  const scope = match[1].trim();
  const path = match[2].trim();
  const expected = match[4].trim();
  if (!isImpactTier(expected)) return [`Unsupported impact tier: ${expected}`];
  if (path !== "any" && !isImpactPath(path)) return [`Unsupported impact path: ${path}`];
  const actual = scope === "global"
    ? getGlobalImpactTier(state, path)
    : (() => {
      const root = getScenarioRoot(state, scope);
      return root ? getUnitImpactTier(root, path) : null;
    })();
  if (actual === null) return [`Missing impact context for ${scope}`];
  return compareImpactTier(actual, operator, expected)
    ? []
    : [`${scope}:${path} expected impact tier ${operator} ${expected}, got ${actual}`];
}

function evaluateImpactCountAssertion(state: GameTextState, value: string): string[] {
  const match = value.match(/^([^:]+):([^<>=]+)>=(\d+)$/);
  if (!match) return [`Unsupported impact-count clause: ${value}`];
  const scope = match[1].trim();
  const tier = match[2].trim();
  const expected = Number(match[3]);
  let actual = 0;
  if (scope === "global") {
    if (tier === "any") actual = state.impactDebug.eventCount;
    else if (isImpactTier(tier)) actual = state.impactDebug.countsByTier[tier] ?? 0;
    else return [`Unsupported impact tier: ${tier}`];
  } else {
    const root = getScenarioRoot(state, scope);
    if (!root) return [`Missing impact count context for ${scope}`];
    actual = Number((root as { impactEventCount?: number }).impactEventCount ?? 0);
    if (tier !== "any") {
      const peakTier = (root as { peakImpactTier?: ImpactTier }).peakImpactTier ?? "none";
      actual = isImpactTier(tier) && IMPACT_TIER_RANK[peakTier] >= IMPACT_TIER_RANK[tier] ? actual : 0;
    }
  }
  return actual >= expected ? [] : [`${scope}:${tier} expected impact count >= ${expected}, got ${actual}`];
}

function evaluateImpactPathCountAssertion(state: GameTextState, value: string): string[] {
  const match = value.match(/^([^:]+):([^<>=]+)>=(\d+)$/);
  if (!match) return [`Unsupported impact-path-count clause: ${value}`];
  const pathText = match[1].trim();
  const tier = match[2].trim();
  const expected = Number(match[3]);
  if (!isImpactPath(pathText)) return [`Unsupported impact path: ${pathText}`];
  const path = pathText as ImpactPath;
  if (tier !== "any" && !isImpactTier(tier)) return [`Unsupported impact tier: ${tier}`];
  let actual = 0;
  for (const unit of state.impactDebug.units) {
    const count = unit.countsByPath[path] ?? 0;
    if (tier === "any") {
      actual += count;
      continue;
    }
    const peak = unit.peakByPath[path] ?? "none";
    if (IMPACT_TIER_RANK[peak] >= IMPACT_TIER_RANK[tier]) actual += count;
  }
  return actual >= expected ? [] : [`${path}:${tier} expected impact path count >= ${expected}, got ${actual}`];
}

function evaluateBattleRecapPresentAssertion(state: GameTextState, value: string): string[] {
  const expected = value.trim();
  if (expected !== "true" && expected !== "false") return [`Unsupported battle-recap-present value: ${value}`];
  const actual = state.battleRecap !== null;
  const expectedBool = expected === "true";
  return actual === expectedBool ? [] : [`Expected battleRecap present=${expectedBool}, got ${actual}`];
}

function evaluateBattleRecapSurvivorsAssertion(state: GameTextState, value: string): string[] {
  const match = value.match(/^teamA=(\d+),teamB=(\d+)$/);
  if (!match) return [`Unsupported battle-recap-survivors clause: ${value}`];
  if (!state.battleRecap) return ["Missing battleRecap for survivor assertion"];
  const expectedA = Number(match[1]);
  const expectedB = Number(match[2]);
  const actual = state.battleRecap.survivors;
  const failures: string[] = [];
  if (actual.teamA !== expectedA) failures.push(`teamA expected ${expectedA}, got ${actual.teamA}`);
  if (actual.teamB !== expectedB) failures.push(`teamB expected ${expectedB}, got ${actual.teamB}`);
  return failures;
}

function evaluateBattleRecapTargetPathAssertion(state: GameTextState, value: string): string[] {
  const match = value.match(/^([^:]+):([^<>=]+)>=(\w+)$/);
  if (!match) return [`Unsupported battle-recap-target-path clause: ${value}`];
  if (!state.battleRecap) return ["Missing battleRecap for target-path assertion"];
  const scope = match[1].trim();
  const path = match[2].trim();
  const tier = match[3].trim();
  if (!isImpactPath(path)) return [`Unsupported impact path: ${path}`];
  if (!isImpactTier(tier)) return [`Unsupported impact tier: ${tier}`];
  const target = state.battleRecap.mostImpactedTarget;
  if (!target) return ["Expected recap target, got null"];
  const scopeMatches = scope === "global" || target.unitId === scope || target.rootUnitId === scope;
  if (!scopeMatches) return [`Expected recap target scope ${scope}, got ${target.unitId} rooted at ${target.rootUnitId}`];
  if (target.path !== path) return [`Expected recap path ${path}, got ${target.path}`];
  return compareImpactTier(target.tier, ">=", tier)
    ? []
    : [`Expected recap tier >= ${tier}, got ${target.tier}`];
}

function evaluateResultButtonLabelsAssertion(state: GameTextState, value: string): string[] {
  const match = value.match(/^primary=(.+),secondary=(.+)$/);
  if (!match) return [`Unsupported result-button-labels clause: ${value}`];
  const expectedPrimary = match[1].trim();
  const expectedSecondary = match[2].trim();
  const failures: string[] = [];
  if (state.resultOverlay.primaryLabel !== expectedPrimary) {
    failures.push(`primary expected ${expectedPrimary}, got ${state.resultOverlay.primaryLabel}`);
  }
  if (state.resultOverlay.secondaryLabel !== expectedSecondary) {
    failures.push(`secondary expected ${expectedSecondary}, got ${state.resultOverlay.secondaryLabel}`);
  }
  return failures;
}

function evaluateResultDetailPreservesNewlinesAssertion(state: GameTextState, value: string): string[] {
  const expected = value.trim();
  if (expected !== "true" && expected !== "false") return [`Unsupported result-detail-preserves-newlines value: ${value}`];
  const preservingWhiteSpaceValues = new Set(["pre", "pre-line", "pre-wrap", "break-spaces"]);
  const actual = preservingWhiteSpaceValues.has(state.resultOverlay.detailWhiteSpace);
  const expectedBool = expected === "true";
  return actual === expectedBool
    ? []
    : [`Expected result detail newline preservation=${expectedBool}, got white-space: ${state.resultOverlay.detailWhiteSpace}`];
}

function evaluateScenarioAssertion(state: GameTextState, assertion: { kind: string; value: string }, scenario?: ScenarioSpec): ScenarioAssertionResult {
  const pass = (details: string): ScenarioAssertionResult => ({ kind: assertion.kind, value: assertion.value, passed: true, details });
  const fail = (details: string): ScenarioAssertionResult => ({ kind: assertion.kind, value: assertion.value, passed: false, details });
  const skip = (details: string): ScenarioAssertionResult => ({ kind: assertion.kind, value: assertion.value, passed: true, skipped: true, details });

  switch (assertion.kind) {
    case "comparison-focus":
      return skip("Informational comparison note.");
    case "mode-is":
      return state.mode === assertion.value
        ? pass(`Mode matched ${assertion.value}.`)
        : fail(`Expected mode ${assertion.value}, got ${state.mode}.`);
    case "units-present": {
      const ids = assertion.value.split(",").map((id) => id.trim()).filter(Boolean);
      const present = new Set(state.units.map((unit) => unit.id));
      const missing = ids.filter((id) => !present.has(id));
      return missing.length === 0
        ? pass(`Found all units: ${ids.join(", ")}.`)
        : fail(`Missing units: ${missing.join(", ")}.`);
    }
    case "linked-role-count":
    case "linked-relation-count": {
      const clauses = parseUnitClauses(assertion.value);
      const failures: string[] = [];
      for (const { unitId, clause } of clauses) {
        const match = clause.match(/^([^=]+)=(\d+)$/);
        if (!match) return fail(`Unsupported relation-count clause: ${clause}`);
        const relation = match[1].trim();
        const expected = Number(match[2]);
        const actual = state.units.filter((unit) => unit.id === unitId && unit.linkedRelation === relation).length;
        if (actual !== expected) failures.push(`${unitId}:${relation} expected ${expected}, got ${actual}`);
      }
      return failures.length === 0 ? pass("Linked relation counts matched.") : fail(failures.join("; "));
    }
    case "linked-role-targetable": {
      const clauses = parseUnitClauses(assertion.value);
      const failures: string[] = [];
      for (const { unitId, clause } of clauses) {
        const match = clause.match(/^([^=]+)=(true|false)$/);
        if (!match) return fail(`Unsupported targetable clause: ${clause}`);
        const role = match[1].trim();
        const expected = match[2] === "true";
        const root = getScenarioRoot(state, unitId);
        if (!root) {
          failures.push(`Missing root unit ${unitId}`);
          continue;
        }
        const linkedRole = getLinkedRoleForRoot(state, root, role);
        if (!linkedRole) {
          failures.push(`Missing role ${role} on ${unitId}`);
          continue;
        }
        if (linkedRole.targetable !== expected) {
          failures.push(`${unitId}:${role} expected targetable=${expected}, got ${linkedRole.targetable}`);
        }
      }
      return failures.length === 0 ? pass("Linked-role targetability matched.") : fail(failures.join("; "));
    }
    case "linked-role-state": {
      const clauses = parseUnitClauses(assertion.value);
      const failures: string[] = [];
      for (const { unitId, clause } of clauses) {
        const match = clause.match(/^([^=]+)=(alive|dead)$/);
        if (!match) return fail(`Unsupported linked-role-state clause: ${clause}`);
        const role = match[1].trim();
        const expectedAlive = match[2] === "alive";
        const root = getScenarioRoot(state, unitId);
        if (!root) {
          failures.push(`Missing root unit ${unitId}`);
          continue;
        }
        const linkedRole = getLinkedRoleForRoot(state, root, role);
        if (!linkedRole) {
          failures.push(`Missing role ${role} on ${unitId}`);
          continue;
        }
        if (linkedRole.alive !== expectedAlive) {
          failures.push(`${unitId}:${role} expected ${expectedAlive ? "alive" : "dead"}, got ${linkedRole.alive ? "alive" : "dead"}`);
        }
      }
      return failures.length === 0 ? pass("Linked-role liveness matched.") : fail(failures.join("; "));
    }
    case "parent-capability": {
      const clauses = parseUnitClauses(assertion.value);
      const failures: string[] = [];
      for (const { unitId, clause } of clauses) {
        const root = getScenarioRoot(state, unitId);
        if (!root) {
          failures.push(`Missing root unit ${unitId}`);
          continue;
        }
        const pairs = clause.split("+").map((entry) => entry.trim()).filter(Boolean);
        for (const pair of pairs) {
          const match = pair.match(/^(attack|move)=(enabled|disabled)$/);
          if (!match) return fail(`Unsupported parent-capability clause: ${pair}`);
          const capability = match[1];
          const expected = match[2];
          const actual = capability === "attack" ? root.attackCapability : root.moveCapability;
          if (actual !== expected) {
            failures.push(`${unitId}:${capability} expected ${expected}, got ${actual}`);
          }
        }
      }
      return failures.length === 0 ? pass("Parent capability matched.") : fail(failures.join("; "));
    }
    case "spawned-child-count": {
      const failures = evaluateSpawnedChildCountClauses(state, assertion.value);
      return failures.length === 0 ? pass("Spawned child counts matched.") : fail(failures.join("; "));
    }
    case "unit-hp-at-most": {
      const parts = assertion.value.split(",").map((part) => part.trim()).filter(Boolean);
      const failures: string[] = [];
      for (const part of parts) {
        const match = part.match(/^([^<>=]+)(<=)(-?\d+(?:\.\d+)?)$/);
        if (!match) return fail(`Unsupported hp clause: ${part}`);
        const unitId = match[1].trim();
        const expected = Number(match[3]);
        const root = getScenarioRoot(state, unitId);
        if (!root) {
          failures.push(`Missing root unit ${unitId}`);
          continue;
        }
        if (root.hp > expected) {
          failures.push(`${unitId} expected hp <= ${expected}, got ${root.hp}`);
        }
      }
      return failures.length === 0 ? pass("Unit HP thresholds matched.") : fail(failures.join("; "));
    }
    case "health-bar-visible": {
      const clauses = parseUnitClauses(assertion.value);
      const failures: string[] = [];
      for (const { unitId, clause } of clauses) {
        const match = clause.match(/^(true|false)$/);
        if (!match) return fail(`Unsupported health-bar-visible clause: ${clause}`);
        const root = getScenarioRoot(state, unitId);
        if (!root) {
          failures.push(`Missing health-bar context for ${unitId}`);
          continue;
        }
        const expected = match[1] === "true";
        const actual = Boolean((root as { healthBarVisible?: boolean }).healthBarVisible);
        if (actual !== expected) failures.push(`${unitId} expected healthBarVisible=${expected}, got ${actual}`);
      }
      return failures.length === 0 ? pass("Health bar visibility matched.") : fail(failures.join("; "));
    }
    case "health-bar-ratio-at-least":
    case "health-bar-ratio-at-most": {
      const parts = assertion.value.split(",").map((part) => part.trim()).filter(Boolean);
      const failures: string[] = [];
      const operator = assertion.kind === "health-bar-ratio-at-least" ? ">=" : "<=";
      for (const part of parts) {
        const match = part.match(/^([^<>=]+)(>=|<=)(-?\d+(?:\.\d+)?)$/);
        if (!match || match[2] !== operator) return fail(`Unsupported health-bar-ratio clause: ${part}`);
        const unitId = match[1].trim();
        const expected = Number(match[3]);
        const root = getScenarioRoot(state, unitId);
        if (!root) {
          failures.push(`Missing health-bar ratio context for ${unitId}`);
          continue;
        }
        const actual = Number((root as { healthBarFillRatio?: number }).healthBarFillRatio ?? 0);
        if (operator === ">=" ? actual < expected : actual > expected) {
          failures.push(`${unitId} expected health bar ratio ${operator} ${expected}, got ${actual}`);
        }
      }
      return failures.length === 0 ? pass("Health bar ratios matched.") : fail(failures.join("; "));
    }
    case "unit-height-at-most": {
      const parts = assertion.value.split(",").map((part) => part.trim()).filter(Boolean);
      const failures: string[] = [];
      for (const part of parts) {
        const match = part.match(/^([^<>=]+)(<=)(-?\d+(?:\.\d+)?)$/);
        if (!match) return fail(`Unsupported height clause: ${part}`);
        const unitId = match[1].trim();
        const expected = Number(match[3]);
        const root = getScenarioRoot(state, unitId);
        if (!root) {
          failures.push(`Missing height context for ${unitId}`);
          continue;
        }
        const actual = Number((root as { y?: number }).y ?? 0);
        if (actual > expected) {
          failures.push(`${unitId} expected height <= ${expected}, got ${actual}`);
        }
      }
      return failures.length === 0 ? pass("Unit heights matched.") : fail(failures.join("; "));
    }
    case "position-shift-at-least": {
      if (!scenario) return fail("No scenario context for position-shift assertion.");
      const parts = assertion.value.split(",").map((part) => part.trim()).filter(Boolean);
      const failures: string[] = [];
      for (const part of parts) {
        const match = part.match(/^([^<>=]+)(>=)(-?\d+(?:\.\d+)?)$/);
        if (!match) return fail(`Unsupported movement clause: ${part}`);
        const unitId = match[1].trim();
        const expected = Number(match[3]);
        const root = getScenarioRoot(state, unitId);
        const initial = getInitialUnitSpec(scenario, unitId);
        if (!root || !initial) {
          failures.push(`Missing movement context for ${unitId}`);
          continue;
        }
        const dx = root.x - initial.x;
        const dz = root.z - initial.z;
        const actual = Math.sqrt(dx * dx + dz * dz);
        if (actual < expected) {
          failures.push(`${unitId} expected movement >= ${expected}, got ${actual.toFixed(2)}`);
        }
      }
      return failures.length === 0 ? pass("Position shift matched.") : fail(failures.join("; "));
    }
    case "position-shift-at-most": {
      if (!scenario) return fail("No scenario context for position-shift assertion.");
      const parts = assertion.value.split(",").map((part) => part.trim()).filter(Boolean);
      const failures: string[] = [];
      for (const part of parts) {
        const match = part.match(/^([^<>=]+)(<=)(-?\d+(?:\.\d+)?)$/);
        if (!match) return fail(`Unsupported movement clause: ${part}`);
        const unitId = match[1].trim();
        const expected = Number(match[3]);
        const root = getScenarioRoot(state, unitId);
        const initial = getInitialUnitSpec(scenario, unitId);
        if (!root || !initial) {
          failures.push(`Missing movement context for ${unitId}`);
          continue;
        }
        const dx = root.x - initial.x;
        const dz = root.z - initial.z;
        const actual = Math.sqrt(dx * dx + dz * dz);
        if (actual > expected) {
          failures.push(`${unitId} expected movement <= ${expected}, got ${actual.toFixed(2)}`);
        }
      }
      return failures.length === 0 ? pass("Position shift upper bounds matched.") : fail(failures.join("; "));
    }
    case "unit-distance-at-least": {
      const clauses = assertion.value.split(",").map((part) => part.trim()).filter(Boolean);
      const failures: string[] = [];
      for (const clause of clauses) {
        const pairMatch = clause.match(/^([^<>=]+)<->([^<>=]+)(>=)(-?\d+(?:\.\d+)?)$/);
        if (!pairMatch) return fail(`Unsupported unit-distance clause: ${clause}`);
        const left = pairMatch[1].trim();
        const right = pairMatch[2].trim();
        const expected = Number(pairMatch[4]);
        const leftRoot = getScenarioRoot(state, left);
        const rightRoot = getScenarioRoot(state, right);
        if (!leftRoot || !rightRoot) {
          failures.push(`Missing unit-distance context for ${left}<->${right}`);
          continue;
        }
        const dx = rightRoot.x - leftRoot.x;
        const dz = rightRoot.z - leftRoot.z;
        const actual = Math.sqrt(dx * dx + dz * dz);
        if (actual < expected) {
          failures.push(`${left}<->${right} expected distance >= ${expected}, got ${actual.toFixed(2)}`);
        }
      }
      return failures.length === 0 ? pass("Unit distances matched.") : fail(failures.join("; "));
    }
    case "collision-push-at-least": {
      const parts = assertion.value.split(",").map((part) => part.trim()).filter(Boolean);
      const failures: string[] = [];
      for (const part of parts) {
        const match = part.match(/^([^<>=]+)(>=)(-?\d+(?:\.\d+)?)$/);
        if (!match) return fail(`Unsupported collision-push clause: ${part}`);
        const unitId = match[1].trim();
        const expected = Number(match[3]);
        const root = getScenarioRoot(state, unitId);
        if (!root) {
          failures.push(`Missing collision-push context for ${unitId}`);
          continue;
        }
        if (root.collisionPushPeak < expected) {
          failures.push(`${unitId} expected collision push >= ${expected}, got ${root.collisionPushPeak}`);
        }
      }
      return failures.length === 0 ? pass("Collision push matched.") : fail(failures.join("; "));
    }
    case "crowd-metric-at-least": {
      const failures = evaluateCrowdMetricClauses(state, assertion.value);
      return failures.length === 0 ? pass("Crowd metrics matched.") : fail(failures.join("; "));
    }
    case "physics-state": {
      const clauses = parseUnitClauses(assertion.value);
      const failures: string[] = [];
      for (const { unitId, clause } of clauses) {
        const root = getScenarioRoot(state, unitId);
        if (!root) {
          failures.push(`Missing physics-state context for ${unitId}`);
          continue;
        }
        const expectedStates = new Set(clause.split("|").map((entry) => entry.trim()).filter(Boolean));
        if (expectedStates.size === 0) {
          failures.push(`No expected states provided for ${unitId}`);
          continue;
        }
        if (!expectedStates.has(root.physicsState)) {
          failures.push(`${unitId} expected physics state ${[...expectedStates].join("|")}, got ${root.physicsState}`);
        }
      }
      return failures.length === 0 ? pass("Physics states matched.") : fail(failures.join("; "));
    }
    case "balance-state": {
      const clauses = parseUnitClauses(assertion.value);
      const failures: string[] = [];
      for (const { unitId, clause } of clauses) {
        const root = getScenarioRoot(state, unitId);
        if (!root) {
          failures.push(`Missing balance-state context for ${unitId}`);
          continue;
        }
        const expectedStates = new Set(clause.split("|").map((entry) => entry.trim()).filter(Boolean));
        const actual = (root as { balanceState?: string }).balanceState ?? "steady";
        if (!expectedStates.has(actual)) {
          failures.push(`${unitId} expected balance state ${[...expectedStates].join("|")}, got ${actual}`);
        }
      }
      return failures.length === 0 ? pass("Balance states matched.") : fail(failures.join("; "));
    }
    case "battle-feel-state": {
      const clauses = parseUnitClauses(assertion.value);
      const failures: string[] = [];
      for (const { unitId, clause } of clauses) {
        const root = getScenarioRoot(state, unitId);
        if (!root) {
          failures.push(`Missing battle-feel-state context for ${unitId}`);
          continue;
        }
        const expectedStates = new Set(clause.split("|").map((entry) => entry.trim()).filter(Boolean));
        const actual = (root as { battleFeelState?: string }).battleFeelState ?? "steady";
        if (!expectedStates.has(actual)) {
          failures.push(`${unitId} expected battle-feel state ${[...expectedStates].join("|")}, got ${actual}`);
        }
      }
      return failures.length === 0 ? pass("Battle-feel states matched.") : fail(failures.join("; "));
    }
    case "pressure-transfer-at-least": {
      const parts = assertion.value.split(",").map((part) => part.trim()).filter(Boolean);
      const failures: string[] = [];
      for (const part of parts) {
        const match = part.match(/^([^<>=]+)(>=)(-?\d+(?:\.\d+)?)$/);
        if (!match) return fail(`Unsupported pressure-transfer clause: ${part}`);
        const unitId = match[1].trim();
        const expected = Number(match[3]);
        const root = getScenarioRoot(state, unitId);
        if (!root) {
          failures.push(`Missing pressure-transfer context for ${unitId}`);
          continue;
        }
        const actual = Number((root as { pressureTransferred?: number }).pressureTransferred ?? 0);
        if (actual < expected) {
          failures.push(`${unitId} expected pressure transfer >= ${expected}, got ${actual}`);
        }
      }
      return failures.length === 0 ? pass("Pressure transfer matched.") : fail(failures.join("; "));
    }
    case "attack-interrupted-at-least": {
      const parts = assertion.value.split(",").map((part) => part.trim()).filter(Boolean);
      const failures: string[] = [];
      for (const part of parts) {
        const match = part.match(/^([^<>=]+)(>=)(-?\d+(?:\.\d+)?)$/);
        if (!match) return fail(`Unsupported attack-interrupted clause: ${part}`);
        const unitId = match[1].trim();
        const expected = Number(match[3]);
        const root = getScenarioRoot(state, unitId);
        if (!root) {
          failures.push(`Missing attack interruption context for ${unitId}`);
          continue;
        }
        const actual = Number((root as { attackInterruptedCount?: number }).attackInterruptedCount ?? 0);
        if (actual < expected) {
          failures.push(`${unitId} expected attack interruptions >= ${expected}, got ${actual}`);
        }
      }
      return failures.length === 0 ? pass("Attack interruption counts matched.") : fail(failures.join("; "));
    }
    case "downed-block-active": {
      const clauses = parseUnitClauses(assertion.value);
      const failures: string[] = [];
      for (const { unitId, clause } of clauses) {
        const match = clause.match(/^(true|false)$/);
        if (!match) return fail(`Unsupported downed-block-active clause: ${clause}`);
        const expected = match[1] === "true";
        const root = getScenarioRoot(state, unitId);
        if (!root) {
          failures.push(`Missing downed-block context for ${unitId}`);
          continue;
        }
        const actual = Boolean((root as { downedBlockActive?: boolean }).downedBlockActive);
        if (actual !== expected) {
          failures.push(`${unitId} expected downedBlockActive=${expected}, got ${actual}`);
        }
      }
      return failures.length === 0 ? pass("Downed block activity matched.") : fail(failures.join("; "));
    }
    case "downed-block-seconds-at-most": {
      const parts = assertion.value.split(",").map((part) => part.trim()).filter(Boolean);
      const failures: string[] = [];
      for (const part of parts) {
        const match = part.match(/^([^<>=]+)(<=)(-?\d+(?:\.\d+)?)$/);
        if (!match) return fail(`Unsupported downed-block-seconds clause: ${part}`);
        const unitId = match[1].trim();
        const expected = Number(match[3]);
        const root = getScenarioRoot(state, unitId);
        if (!root) {
          failures.push(`Missing downed-block duration context for ${unitId}`);
          continue;
        }
        const actual = Number((root as { downedSecondsRemaining?: number }).downedSecondsRemaining ?? 0);
        if (actual > expected) {
          failures.push(`${unitId} expected downed seconds <= ${expected}, got ${actual}`);
        }
      }
      return failures.length === 0 ? pass("Downed block timing matched.") : fail(failures.join("; "));
    }
    case "impact-tier-at-least": {
      const failures = evaluateImpactTierAssertion(state, assertion.value, ">=");
      return failures.length === 0 ? pass("Impact tier lower bound matched.") : fail(failures.join("; "));
    }
    case "impact-tier-at-most": {
      const failures = evaluateImpactTierAssertion(state, assertion.value, "<=");
      return failures.length === 0 ? pass("Impact tier upper bound matched.") : fail(failures.join("; "));
    }
    case "impact-count-at-least": {
      const failures = evaluateImpactCountAssertion(state, assertion.value);
      return failures.length === 0 ? pass("Impact count matched.") : fail(failures.join("; "));
    }
    case "impact-path-count-at-least": {
      const failures = evaluateImpactPathCountAssertion(state, assertion.value);
      return failures.length === 0 ? pass("Impact path count matched.") : fail(failures.join("; "));
    }
    case "impact-malformed-path-guard": {
      const failures = evaluateImpactTierAssertion(state, assertion.value, "<=");
      const hasUnsupportedPathFailure = failures.some((failure) => failure.includes("Unsupported impact path"));
      return hasUnsupportedPathFailure
        ? pass(`Malformed path failed loudly: ${failures.join("; ")}`)
        : fail(`Malformed impact path did not fail loudly; result was: ${failures.join("; ") || "no failure"}`);
    }
    case "battle-recap-present": {
      const failures = evaluateBattleRecapPresentAssertion(state, assertion.value);
      return failures.length === 0 ? pass("Battle recap presence matched.") : fail(failures.join("; "));
    }
    case "battle-recap-survivors": {
      const failures = evaluateBattleRecapSurvivorsAssertion(state, assertion.value);
      return failures.length === 0 ? pass("Battle recap survivors matched.") : fail(failures.join("; "));
    }
    case "battle-recap-target-path": {
      const failures = evaluateBattleRecapTargetPathAssertion(state, assertion.value);
      return failures.length === 0 ? pass("Battle recap target path matched.") : fail(failures.join("; "));
    }
    case "result-detail-preserves-newlines": {
      const failures = evaluateResultDetailPreservesNewlinesAssertion(state, assertion.value);
      return failures.length === 0 ? pass("Result detail preserves newlines.") : fail(failures.join("; "));
    }
    case "result-button-labels": {
      const failures = evaluateResultButtonLabelsAssertion(state, assertion.value);
      return failures.length === 0 ? pass("Result button labels matched.") : fail(failures.join("; "));
    }
    case "chain-topple-count-at-least": {
      const match = assertion.value.match(/^(.+?)(>=)(\d+)$/);
      if (!match) return fail(`Unsupported chain-topple-count clause: ${assertion.value}`);
      const unitIds = match[1].split("+").map((entry) => entry.trim()).filter(Boolean);
      const expected = Number(match[3]);
      const activeStates = new Set(["toppled", "downed", "recovering"]);
      let actual = 0;
      for (const unitId of unitIds) {
        const root = getScenarioRoot(state, unitId);
        if (!root) continue;
        const battleFeelState = (root as { battleFeelState?: string }).battleFeelState ?? "steady";
        if (activeStates.has(battleFeelState)) actual += 1;
      }
      return actual >= expected
        ? pass(`Chain topple count matched (${actual} >= ${expected}).`)
        : fail(`Expected chain topple count >= ${expected}, got ${actual}.`);
    }
    case "topple-direction": {
      const clauses = parseUnitClauses(assertion.value);
      const failures: string[] = [];
      for (const { unitId, clause } of clauses) {
        const root = getScenarioRoot(state, unitId);
        if (!root) {
          failures.push(`Missing topple-direction context for ${unitId}`);
          continue;
        }
        const expectedDirections = new Set(clause.split("|").map((entry) => entry.trim()).filter(Boolean));
        const actual = (root as { toppleDirection?: string }).toppleDirection ?? "none";
        if (!expectedDirections.has(actual)) {
          failures.push(`${unitId} expected topple direction ${[...expectedDirections].join("|")}, got ${actual}`);
        }
      }
      return failures.length === 0 ? pass("Topple directions matched.") : fail(failures.join("; "));
    }
    case "replay-stability":
    case "replay-restore":
      return skip("Replay stability is evaluated in runScenarioCheck.");
    case "emitter-owner": {
      const clauses = parseUnitClauses(assertion.value);
      const failures: string[] = [];
      for (const { unitId, clause } of clauses) {
        const root = getScenarioRoot(state, unitId);
        if (!root) {
          failures.push(`Missing root unit ${unitId}`);
          continue;
        }
        const expected = new Set(clause.split("+").map((entry) => entry.trim()).filter(Boolean));
        const actual = getEmitterRoleSet(state, root);
        const mismatch = expected.size !== actual.size || [...expected].some((role) => !actual.has(role));
        if (mismatch) failures.push(`${unitId} expected emitters ${[...expected].join("+")}, got ${[...actual].join("+")}`);
      }
      return failures.length === 0 ? pass("Emitter ownership matched.") : fail(failures.join("; "));
    }
    case "impact-owner": {
      const clauses = parseUnitClauses(assertion.value);
      const failures: string[] = [];
      for (const { unitId, clause } of clauses) {
        const root = getScenarioRoot(state, unitId);
        if (!root) {
          failures.push(`Missing root unit ${unitId}`);
          continue;
        }
        const expected = new Set(clause.split("+").map((entry) => entry.trim()).filter(Boolean));
        const actual = getImpactRoleSet(state, root);
        const mismatch = expected.size !== actual.size || [...expected].some((role) => !actual.has(role));
        if (mismatch) failures.push(`${unitId} expected impact roles ${[...expected].join("+")}, got ${[...actual].join("+")}`);
      }
      return failures.length === 0 ? pass("Impact ownership matched.") : fail(failures.join("; "));
    }
    case "damage-owner": {
      const clauses = parseUnitClauses(assertion.value);
      const failures: string[] = [];
      for (const { unitId, clause } of clauses) {
        const match = clause.match(/^([^=]+)=([a-z-]+)$/);
        if (!match) return fail(`Unsupported damage-owner clause: ${clause}`);
        const role = match[1].trim();
        const expectedRouting = match[2].trim();
        const root = getScenarioRoot(state, unitId);
        if (!root) {
          failures.push(`Missing root unit ${unitId}`);
          continue;
        }
        const target = role === "parent"
          ? root
          : getLinkedChildrenForRoot(state, root).find((child) => child.compositeRole === role);
        if (!target) {
          failures.push(`Missing role ${role} on ${unitId}`);
          continue;
        }
        if (target.damageRouting !== expectedRouting) {
          failures.push(`${unitId}:${role} expected ${expectedRouting}, got ${target.damageRouting}`);
        }
      }
      return failures.length === 0 ? pass("Damage routing matched.") : fail(failures.join("; "));
    }
    case "cleanup-policy": {
      const clauses = parseUnitClauses(assertion.value);
      const failures: string[] = [];
      for (const { unitId, clause } of clauses) {
        const root = getScenarioRoot(state, unitId);
        if (!root) {
          failures.push(`Missing root unit ${unitId}`);
          continue;
        }
        const children = getLinkedChildrenForRoot(state, root);
        let targets: GameTextUnitState[] = [];
        if (clause.includes("all linked roles")) {
          targets = children;
        } else if (clause.includes("mount removes with parent")) {
          targets = children.filter((child) => child.linkedRelation === "mount");
        } else {
          const label = clause.split(" removes")[0].trim();
          targets = children.filter((child) => child.compositeRole === label);
        }
        if (targets.length === 0) {
          failures.push(`No cleanup targets matched for ${unitId}:${clause}`);
          continue;
        }
        const wrong = targets.filter((target) => target.cleanupPolicy !== "remove-with-parent");
        if (wrong.length > 0) {
          failures.push(`${unitId} cleanup mismatch on ${wrong.map((target) => target.compositeRole ?? target.role).join(", ")}`);
        }
      }
      return failures.length === 0 ? pass("Cleanup policy matched.") : fail(failures.join("; "));
    }
    case "victory-semantics": {
      const clauses = parseUnitClauses(assertion.value);
      const failures: string[] = [];
      for (const { unitId, clause } of clauses) {
        const root = getScenarioRoot(state, unitId);
        if (!root) {
          failures.push(`Missing root unit ${unitId}`);
          continue;
        }
        const children = getLinkedChildrenForRoot(state, root);
        let targets: GameTextUnitState[] = [];
        if (clause.includes("crew should not count")) {
          targets = children.filter((child) => child.linkedRelation === "crew");
        } else {
          const role = clause.split(" should")[0].trim();
          targets = children.filter((child) => child.compositeRole === role);
        }
        if (targets.length === 0) {
          failures.push(`No victory targets matched for ${unitId}:${clause}`);
          continue;
        }
        const wrong = targets.filter((target) => target.countsTowardVictory || target.victoryRouting === "self");
        if (wrong.length > 0) {
          failures.push(`${unitId} victory mismatch on ${wrong.map((target) => target.compositeRole ?? target.role).join(", ")}`);
        }
      }
      return failures.length === 0 ? pass("Victory semantics matched.") : fail(failures.join("; "));
    }
    case "no-duplicate-standins": {
      const ids = assertion.value.split("+").map((id) => id.trim()).filter(Boolean);
      const failures: string[] = [];
      for (const unitId of ids) {
        const root = getScenarioRoot(state, unitId);
        if (!root) {
          failures.push(`Missing root unit ${unitId}`);
          continue;
        }
        if (!root.decorativeStandinsSuppressed) {
          failures.push(`${unitId} still reports decorative stand-ins enabled.`);
        }
      }
      return failures.length === 0 ? pass("Decorative stand-ins suppressed.") : fail(failures.join("; "));
    }
    case "origin-source":
    case "origin-socket": {
      const clauses = parseUnitClauses(assertion.value);
      const failures: string[] = [];
      for (const { unitId, clause } of clauses) {
        const root = getScenarioRoot(state, unitId);
        if (!root) {
          failures.push(`Missing root unit ${unitId}`);
          continue;
        }
        const pairs = clause.split("+").map((entry) => entry.trim()).filter(Boolean);
        for (const pair of pairs) {
          const match = pair.match(/^(attack|smoke|impact)=([A-Za-z-]+)$/);
          if (!match) return fail(`Unsupported origin clause: ${pair}`);
          const originKind = match[1];
          const expected = match[2];
          const actual = assertion.kind === "origin-source"
            ? (originKind === "attack" ? root.attackOriginSource : originKind === "smoke" ? root.smokeOriginSource : root.impactOriginSource)
            : (originKind === "attack" ? root.attackOriginSocket : originKind === "smoke" ? root.smokeOriginSocket : root.impactOriginSocket);
          if ((actual ?? "none") !== expected) {
            failures.push(`${unitId}:${originKind} expected ${expected}, got ${actual ?? "none"}`);
          }
        }
      }
      return failures.length === 0
        ? pass(`${assertion.kind} matched.`)
        : fail(failures.join("; "));
    }
    default:
      return fail(`Unsupported assertion kind ${assertion.kind}.`);
  }
}

function evaluateScenarioResults(
  scenario: ScenarioSpec,
  initialState: GameTextState,
  options: { includeReplayAssertions?: boolean } = {},
): ScenarioCheckResult {
  let state = initialState;
  const replayStabilityAssertions = scenario.assertions.filter((assertion) => assertion.kind === "replay-stability");
  const replayRestoreAssertions = scenario.assertions.filter((assertion) => assertion.kind === "replay-restore");
  const directAssertions = scenario.assertions.filter(
    (assertion) => assertion.kind !== "replay-stability" && assertion.kind !== "replay-restore",
  );
  const results = directAssertions.map((assertion) => evaluateScenarioAssertion(state, assertion, scenario));

  if (options.includeReplayAssertions !== false && (replayStabilityAssertions.length > 0 || replayRestoreAssertions.length > 0)) {
    playAgain();
    const postReplayPlacement = buildGameStatePayload();
    const orphanedSpawned = postReplayPlacement.units.filter((unit) => unit.role === "summoned" || unit.linkedRelation === "spawned-child");
    const expectedRoots = scenario.units.length;
    const actualRoots = postReplayPlacement.units.filter((unit) => unit.linkedParentId === null).length;
    const replayPreconditionFailure = orphanedSpawned.length > 0
      ? `playAgain() left orphaned spawned units: ${orphanedSpawned.map((unit) => `${unit.id}#${unit.runtimeId}`).join(", ")}`
      : actualRoots !== expectedRoots
        ? `playAgain() expected ${expectedRoots} root units, found ${actualRoots}.`
        : null;

    for (const assertion of replayRestoreAssertions) {
      if (replayPreconditionFailure) {
        results.push({
          kind: assertion.kind,
          value: assertion.value,
          passed: false,
          details: replayPreconditionFailure,
        });
        continue;
      }
      const failures = evaluateReplayRestoreClauses(postReplayPlacement, assertion.value);
      results.push({
        kind: assertion.kind,
        value: assertion.value,
        passed: failures.length === 0,
        details: failures.length === 0 ? "Replay restored linked-role liveness and parent capabilities." : failures.join("; "),
      });
      state = postReplayPlacement;
    }

    if (replayStabilityAssertions.length > 0) {
      if (replayPreconditionFailure) {
        for (const assertion of replayStabilityAssertions) {
          results.push({
            kind: assertion.kind,
            value: assertion.value,
            passed: false,
            details: replayPreconditionFailure,
          });
        }
        state = postReplayPlacement;
      } else {
      startBattle(true);
      if (scenario.advanceMs && scenario.advanceMs > 0) {
        advanceSimulationTime(scenario.advanceMs);
      }
      const replayState = buildGameStatePayload();
      for (const assertion of replayStabilityAssertions) {
        const failures = evaluateSpawnedChildCountClauses(replayState, assertion.value);
        results.push({
          kind: assertion.kind,
          value: assertion.value,
          passed: failures.length === 0,
          details: failures.length === 0 ? "Replay cleanup and rerun child counts matched." : failures.join("; "),
        });
      }
      state = replayState;
      }
    }
  }

  const failures = results.filter((result) => !result.passed).map((result) => `${result.kind}: ${result.details}`);
  return {
    scenario: scenario.name,
    passed: failures.length === 0,
    failures,
    results,
    state,
  };
}

function runScenarioCheck(name: string): ScenarioCheckResult | null {
  const scenario = getScenario(name);
  if (!scenario) {
    showStatus(`Unknown scenario: ${name}`);
    return null;
  }
  runScenarioSpec(scenario);
  return evaluateScenarioResults(scenario, buildGameStatePayload());
}

function runScenarioGalleryValidation(name: string): GalleryValidationResult | null {
  const scenario = getScenario(name);
  if (!scenario) {
    showStatus(`Unknown scenario: ${name}`);
    return null;
  }
  if (!scenario.gallery) {
    showStatus(`Scenario ${name} has no gallery metadata.`);
    return null;
  }

  const gallery = scenario.gallery;
  runScenarioSpec(scenario, { autoStart: false, advanceMs: 0 });
  openGalleryCaptureSession(scenario);
  setGalleryCaptureMode(gallery.hideUiDuringCapture ?? true);
  let appliedCamera = camCtrl.applyGalleryPreset(gallery.presetId, gallery.cameraOverride);
  renderStaticFrames(gallery.settleFrames ?? 2);

  if (gallery.capturePhase === "simulation-mid") {
    startBattle(true);
    const captureAdvanceMs = gallery.captureAdvanceMs ?? scenario.advanceMs ?? 0;
    if (captureAdvanceMs > 0) {
      advanceSimulationTime(captureAdvanceMs);
    }
  } else if (gallery.capturePhase === "replay") {
    if (scenario.autoStart) {
      startBattle(true);
    }
    if ((scenario.advanceMs ?? 0) > 0) {
      advanceSimulationTime(scenario.advanceMs ?? 0);
    }
    playAgain();
    const replayAdvanceMs = gallery.captureAdvanceMs ?? 0;
    if (replayAdvanceMs > 0) {
      startBattle(true);
      advanceSimulationTime(replayAdvanceMs);
    }
  } else if (gallery.capturePhase === "post-reset") {
    runScenarioSpec(scenario, { autoStart: false, advanceMs: 0, preserveGallerySession: true });
    setGalleryCaptureMode(gallery.hideUiDuringCapture ?? true);
    appliedCamera = camCtrl.applyGalleryPreset(gallery.presetId, gallery.cameraOverride);
    renderStaticFrames(gallery.settleFrames ?? 2);
  }

  const checkResult = evaluateScenarioResults(scenario, buildGameStatePayload(), {
    includeReplayAssertions: false,
  });
  const manifestEntry = buildGalleryManifestEntry(scenario, gallery, checkResult.passed);
  galleryManifest.set(scenario.name, manifestEntry);
  return {
    ...checkResult,
    capture: {
      ...manifestEntry,
      camera: appliedCamera,
    },
  };
}

function getGalleryManifest(): GalleryCaptureManifestEntry[] {
  return [...galleryManifest.values()];
}

// ─── Input ───
scene.onPointerObservable.add((pointerInfo) => {
  if (stateMachine.currentState !== GameState.Placement) return;

  if (pointerInfo.type === PointerEventTypes.POINTERTAP) {
    const evt = pointerInfo.event as PointerEvent;
    if (evt.button === 2) {
      // Right-click always removes (desktop)
      tryRemoveUnit(scene.pointerX, scene.pointerY);
    } else if (evt.button === 0) {
      if (removeMode) {
        tryRemoveUnit(scene.pointerX, scene.pointerY);
      } else {
        tryPlaceUnit(scene.pointerX, scene.pointerY);
      }
    }
  }
});

// Keyboard
window.addEventListener("keydown", (e) => {
  if (CAMERA_MOVEMENT_KEYS.has(e.code)) {
    if (isTextEntryTarget(e.target)) return;
    e.preventDefault();
    heldCameraKeys.add(e.code);
    syncCameraMotionIntent();
    return;
  }

  if (e.repeat) return;

  switch (e.code) {
    case "Space":
      e.preventDefault();
      if (stateMachine.currentState === GameState.Result) btnResultPrimaryEl?.click();
      else startBattle();
      break;
    case "Tab": // the key the result prompt names; Space still works
      if (stateMachine.currentState !== GameState.Result) return;
      e.preventDefault();
      btnResultPrimaryEl?.click();
      break;
    case "KeyR":
      resetBattle();
      break;
    case "KeyN":
      selectRelativeUnit(1);
      break;
    case "KeyB":
      selectRelativeUnit(-1);
      break;
  }
});

window.addEventListener("keyup", (e) => {
  if (!heldCameraKeys.delete(e.code)) return;
  syncCameraMotionIntent();
});

window.addEventListener("blur", () => {
  clearHeldCameraMotion();
});

// Expose to HTML onclick handlers
const gameApi = {
  startBattle,
  startBattleImmediate: () => startBattle(true),
  resetBattle,
  playAgain,
  openCampaignPicker: () => toggleCampaignOverlay(true),
  closeCampaignPicker: () => toggleCampaignOverlay(false),
  leaveCampaignMode,
  toggleCampaignUnlimited: () => {
    if (!campaignSession) {
      showStatus("Load a campaign scenario first.");
      return;
    }
    setCampaignUnlimited(!campaignSession.unlimited);
  },
  listCampaigns: () => listCampaignDefinitions().map((campaign) => ({
    id: campaign.id,
    displayName: campaign.displayName,
    scenarioCount: campaign.scenarios.length,
    scenarios: campaign.scenarios.map((scenario, index) => ({
      id: scenario.id,
      displayName: scenario.displayName,
      ladderRole: scenario.ladderRole,
      index,
    })),
  })),
  listCampaignScenarios: (campaignId: CampaignId) => {
    const campaign = listCampaignDefinitions().find((entry) => entry.id === campaignId);
    if (!campaign) return [];
    return campaign.scenarios.map((scenario, index) => ({
      id: scenario.id,
      displayName: scenario.displayName,
      description: scenario.description,
      ladderRole: scenario.ladderRole,
      validationTier: scenario.validationTier ?? "smoke",
      index,
    }));
  },
  loadCampaignScenario: (campaignId: CampaignId, scenarioId?: string) => {
    const nextSession = createCampaignSession(campaignId, campaignSession?.unlimited ?? false, scenarioId);
    if (!nextSession) return null;
    campaignSession = nextSession;
    loadCampaignScenario("Campaign loaded.");
    return {
      campaign: getActiveCampaignDefinition(),
      scenario: getActiveCampaignScenarioDefinition(),
    };
  },
  validateCampaignDefinitions: () => validateCampaignDefinitionsStructure(),
  validateCurrentCampaignScenario,
  runCampaignSmokeCheck,
  runCampaignScenarioDeterministicCheck,
  runCampaignProgressionCheck,
  setCampaignUnlimited: (enabled: boolean) => setCampaignUnlimited(Boolean(enabled)),
  getCampaignState: () => buildGameStatePayload().campaign,
  toggleRemoveMode,
  skipTitleIntro: dismissTitleIntro,
  spawnUnit: spawnHarnessUnit,
  // Capture harness: a first draw skips meshes whose shaders are still compiling, so wait and redraw.
  renderWhenReady: async () => {
    for (let i = 0; i < 40; i++) {
      scene.render();
      await new Promise((resolve) => setTimeout(resolve, 50));
      if (i >= 5 && scene.isReady() && engine.areAllEffectsReady()) break;
    }
    scene.render();
  },
  runScenario,
  runScenarioCheck,
  runScenarioGalleryValidation,
  getGalleryManifest,
  listScenarios: listScenarioNames,
};
(window as any).game = gameApi;
(window as any).MOVBattle = gameApi;

// ─── Game loop ───
engine.runRenderLoop(() => {
  const dt = engine.getDeltaTime() / 1000;
  worldTimeSeconds += dt;
  camCtrl.update(dt);
  tick(dt, worldTimeSeconds);
  scene.render();
});

function tick(dt: number, nowSeconds: number): void {
  if (stateMachine.currentState === GameState.Simulation) {
    simulation.update(dt, nowSeconds);
    projectileSystem.update(dt);
    visualEffects.update(dt);
    if (!galleryCaptureSession) camCtrl.followBattle(computeBattleFocus(), dt);
    checkVictory();
  } else if (stateMachine.currentState === GameState.Placement) {
    // Still update units for idle animation if needed
    for (const unit of placedUnits) {
      unit.update(dt, nowSeconds);
    }
  }
}

window.addEventListener("resize", () => engine.resize());

function renderGameToText(): string {
  return JSON.stringify(buildGameStatePayload());
}

(window as any).render_game_to_text = renderGameToText;
(window as any).advanceTime = advanceSimulationTime;
