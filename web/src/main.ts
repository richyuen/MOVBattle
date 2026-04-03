import {
  Engine, Scene, HemisphericLight, DirectionalLight, Vector3, Color3, Color4,
  PointerEventTypes, ShadowGenerator,
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

import { SimulationSystem } from "./combat/simulationSystem";
import type { SpawnUnitOptions } from "./combat/simulationSystem";
import { ProjectileSystem } from "./combat/projectileSystem";
import { VisualEffects } from "./combat/visualEffects";
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
import { TribalSandboxMapBuilder, getPlacementZones } from "./map/mapBuilder";
import { PlacementValidator } from "./map/placementValidator";
import {
  CameraController,
  type CameraViewState,
} from "./ui/cameraController";

// ─── DOM references ───
const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;
const budgetAEl = document.getElementById("budgetA")!;
const budgetBEl = document.getElementById("budgetB")!;
const selectedUnitEl = document.getElementById("selectedUnit")!;
const statusTextEl = document.getElementById("statusText")!;
const factionTabsEl = document.getElementById("factionTabs")!;
const unitGridEl = document.getElementById("unitGrid")!;
const unitSearchEl = document.getElementById("unitSearch") as HTMLInputElement;
const resultOverlayEl = document.getElementById("resultOverlay")!;
const resultTitleEl = document.getElementById("resultTitle")!;
const resultDetailEl = document.getElementById("resultDetail")!;
const bodyEl = document.body;

// ─── Engine & Scene ───
const engine = new Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });
const scene = new Scene(engine);
scene.clearColor = new Color4(0.52, 0.72, 0.90, 1);

// Material factory (PBR cache — must init before any unit/map creation)
initMaterialFactory(scene);

// Lights
const hemi = new HemisphericLight("hemi", new Vector3(0, 1, 0.3), scene);
hemi.intensity = 0.7;
hemi.groundColor = new Color3(0.25, 0.22, 0.18);
const dir = new DirectionalLight("dir", new Vector3(-0.4, -1, 0.6), scene);
dir.intensity = 0.8;

// Fog — depth fade to sky color
scene.fogMode = Scene.FOGMODE_LINEAR;
scene.fogColor = new Color3(0.52, 0.72, 0.90);
scene.fogStart = 50;
scene.fogEnd = 100;

// Shadows
const shadowGen = new ShadowGenerator(2048, dir);
shadowGen.useBlurExponentialShadowMap = true;
shadowGen.blurKernel = 48;

// Camera
const camCtrl = new CameraController(scene, canvas);

// Bloom post-processing
const pipeline = new DefaultRenderingPipeline("default", true, scene, [camCtrl.camera]);
pipeline.bloomEnabled = true;
pipeline.bloomThreshold = 0.65;
pipeline.bloomWeight = 0.4;
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

// Map
const mapBuilder = new TribalSandboxMapBuilder(scene);
const { zones, obstacles } = mapBuilder.build();

// Share obstacles with unit system for collision
RuntimeUnit.obstacles = obstacles;

// ─── Game systems ───
const stateMachine = new GameStateMachine();
const simulation = new SimulationSystem();
const projectileSystem = new ProjectileSystem(scene);
const visualEffects = new VisualEffects(scene);
simulation.projectileSystem = projectileSystem;
simulation.visualEffects = visualEffects;
projectileSystem.onShake = (intensity) => camCtrl.shake(intensity);
projectileSystem.visualEffects = visualEffects;
const unitFactory = new UnitFactory(scene);
unitFactory.shadowGenerator = shadowGen;
const placementValidator = new PlacementValidator(zones, obstacles);

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
let galleryCaptureSession: {
  scenarioId: string;
  cameraBeforeGallery: CameraViewState;
} | null = null;
RuntimeUnit.timeNowSeconds = () => worldTimeSeconds;

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

const btnRemoveEl = document.getElementById("btnRemove")!;

// ─── HUD ───
function updateBudgetDisplay(): void {
  budgetAEl.textContent = `Team A: ${budgetSystem.getRemaining(0)}`;
  budgetBEl.textContent = `Team B: ${budgetSystem.getRemaining(1)}`;
}

function updateSelectedUnitDisplay(): void {
  const def = getUnit(selectedUnitId);
  if (def) {
    selectedUnitEl.textContent = `Selected: ${def.displayName} (${def.cost}g)`;
  } else {
    selectedUnitEl.textContent = "Selected: Remove Mode";
  }
}

function showStatus(msg: string): void {
  statusTextEl.textContent = msg;
  if (statusTimer) clearTimeout(statusTimer);
  statusTimer = setTimeout(() => { statusTextEl.textContent = ""; }, 2500);
}

function setGalleryCaptureMode(enabled: boolean): void {
  bodyEl.classList.toggle("capture-mode", enabled);
}

function renderStaticFrames(frameCount = 2): void {
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
  btnRemoveEl.classList.toggle("remove-active", removeMode);
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
  const query = unitSearchEl.value.trim().toLowerCase();
  return ALL_UNITS.filter((u) => {
    if (u.faction !== activeFaction) return false;
    if (!query) return true;
    return u.displayName.toLowerCase().includes(query) || u.id.toLowerCase().includes(query);
  });
}

function populateUnitGrid(): void {
  unitGridEl.innerHTML = "";
  const factionUnits = getFilteredFactionUnits();
  for (const def of factionUnits) {
    const btn = document.createElement("button");
    btn.className = "unit-btn";
    btn.dataset.id = def.id;
    btn.textContent = `${def.displayName} (${def.cost})`;
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
  // Collect unique factions in order they appear
  const seen = new Set<FactionId>();
  for (const def of ALL_UNITS) {
    if (seen.has(def.faction)) continue;
    seen.add(def.faction);

    const tab = document.createElement("button");
    tab.className = "faction-tab";
    tab.dataset.faction = String(def.faction);
    tab.textContent = FACTION_NAMES[def.faction] ?? `Faction ${def.faction}`;
    tab.addEventListener("click", () => setFaction(def.faction));
    factionTabsEl.appendChild(tab);
  }
  setFaction(activeFaction);
}

buildUnitPanel();
updateBudgetDisplay();
updateSelectedUnitDisplay();
unitSearchEl.addEventListener("input", () => populateUnitGrid());

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

  if (!budgetSystem.canAddUnit(team, simulation.getLivingCount(team))) {
    showStatus("Team unit cap reached.");
    return;
  }

  const reason = placementValidator.validate(team, worldPoint, def.collisionRadius, placedUnits);
  if (reason) {
    showStatus(reason);
    return;
  }

  if (!budgetSystem.trySpend(team, def.cost)) {
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

  removeRuntimeUnitTree(root, true);
}

// ─── Battle lifecycle ───
function startBattle(immediate = false): void {
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
    simulation.beginSimulation(worldTimeSeconds);
    stateMachine.setState(GameState.Simulation);
    showStatus("Fight!");
    return;
  }

  countdownTimer = setTimeout(() => {
    simulation.beginSimulation(worldTimeSeconds);
    stateMachine.setState(GameState.Simulation);
    showStatus("Fight!");
    countdownTimer = null;
  }, BATTLE_CONFIG.countdownSeconds * 1000);
}

function resetBattle(options: { preserveGallerySession?: boolean } = {}): void {
  if (countdownTimer) {
    clearTimeout(countdownTimer);
    countdownTimer = null;
  }

  simulation.endSimulation(worldTimeSeconds);
  projectileSystem.dispose();
  visualEffects.dispose();

  const roots = placedUnits.filter((unit) => !unit.linkedParent);
  for (const unit of roots) {
    removeRuntimeUnitTree(unit);
  }
  placedUnits.length = 0;

  budgetSystem = new BudgetSystem(
    BATTLE_CONFIG.teamABudget, BATTLE_CONFIG.teamBBudget, BATTLE_CONFIG.maxUnitsPerTeam,
  );

  removeMode = false;
  btnRemoveEl.classList.remove("remove-active");
  stateMachine.setState(GameState.Placement);
  activeScenario = null;
  updateBudgetDisplay();
  resultOverlayEl.classList.remove("visible");
  if (!options.preserveGallerySession) {
    closeGalleryCaptureSession(true);
  }
  showStatus("Battle reset.");
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

  showResult(result);
}

function showResult(result: BattleResult): void {
  resultTitleEl.textContent = result.isDraw ? "Draw" : `Team ${result.winner === 0 ? "A" : "B"} Wins!`;
  resultDetailEl.textContent =
    `Time: ${result.durationSeconds.toFixed(1)}s\n` +
    `Team A Remaining: ${result.teamALiving}\n` +
    `Team B Remaining: ${result.teamBLiving}`;
  resultOverlayEl.classList.add("visible");
}

function playAgain(): void {
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

  removeMode = false;
  btnRemoveEl.classList.remove("remove-active");
  stateMachine.setState(GameState.Placement);
  updateBudgetDisplay();
  showStatus("Ready for another round!");
}

function spawnHarnessUnit(
  unitId: string,
  team: number,
  position: { x: number; y?: number; z: number },
  options: SpawnUnitOptions = {},
): RuntimeUnit | null {
  if (stateMachine.currentState !== GameState.Placement) return null;
  return spawnRuntimeUnit(unitId, team, new Vector3(position.x, position.y ?? 0, position.z), options);
}

function advanceSimulationTime(ms: number): void {
  const steps = Math.max(1, Math.round(ms / (1000 / 60)));
  for (let i = 0; i < steps; i++) {
    worldTimeSeconds += 1 / 60;
    tick(1 / 60, worldTimeSeconds);
  }
  scene.render();
}

function findScenarioRootRuntime(unitId: string): RuntimeUnit | null {
  return placedUnits.find((unit) => unit.definition.id === unitId && !unit.linkedParent) ?? null;
}

function applyScenarioAction(action: ScenarioAction): void {
  if (action.kind !== "damage-linked-role") return;
  const root = findScenarioRootRuntime(action.parentUnitId);
  if (!root) {
    showStatus(`Scenario action missing root ${action.parentUnitId}.`);
    return;
  }
  const child = root.linkedChildren.find((candidate) => candidate.linkedRoleLabel === action.role);
  if (!child) {
    showStatus(`Scenario action missing role ${action.parentUnitId}:${action.role}.`);
    return;
  }
  child.applyDamage(action.damage, Vector3.Zero());
}

function applyScenarioActions(scenario: ScenarioSpec): void {
  for (const action of scenario.actions ?? []) {
    applyScenarioAction(action);
  }
}

function hydrateScenario(scenario: ScenarioSpec, options: { preserveGallerySession?: boolean } = {}): void {
  resetBattle(options);
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

const galleryManifest = new Map<string, GalleryCaptureManifestEntry>();

function buildGameStatePayload() {
  return {
    coordinateSystem: "x:right, z:forward, y:up, origin:center line",
    mode: GameState[stateMachine.currentState],
    scenario: activeScenario?.name ?? null,
    activeFaction: FACTION_NAMES[activeFaction],
    selectedUnitId,
    budgets: {
      teamA: budgetSystem.getRemaining(0),
      teamB: budgetSystem.getRemaining(1),
    },
    units: placedUnits.map((unit) => {
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
        attackCapability: unit.hasContribution("attack") ? "enabled" : "disabled",
        moveCapability: unit.hasContribution("move") ? "enabled" : "disabled",
        disabledByRole: [
          ...unit.getMissingContributionRoles("attack"),
          ...unit.getMissingContributionRoles("move"),
        ],
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
        x: Number(unit.position.x.toFixed(2)),
        z: Number(unit.position.z.toFixed(2)),
      };
    }),
    projectiles: projectileSystem.activeCount,
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
  switch (e.code) {
    case "Space":
      e.preventDefault();
      startBattle();
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
    case "KeyQ":
      camCtrl.rotateBy(-1);
      break;
    case "KeyE":
      camCtrl.rotateBy(1);
      break;
  }
});

// Expose to HTML onclick handlers
(window as any).game = {
  startBattle,
  startBattleImmediate: () => startBattle(true),
  resetBattle,
  playAgain,
  toggleRemoveMode,
  spawnUnit: spawnHarnessUnit,
  runScenario,
  runScenarioCheck,
  runScenarioGalleryValidation,
  getGalleryManifest,
  listScenarios: listScenarioNames,
};

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
