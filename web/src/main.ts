import {
  Engine, Scene, HemisphericLight, DirectionalLight, Vector3, Color3, Color4,
  PointerEventTypes,
} from "@babylonjs/core";

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
import { getScenario, listScenarioNames, type ScenarioSpec } from "./testing/scenarios";

import { TribalSandboxMapBuilder, getPlacementZones } from "./map/mapBuilder";
import { PlacementValidator } from "./map/placementValidator";
import { CameraController } from "./ui/cameraController";

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

// ─── Engine & Scene ───
const engine = new Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });
const scene = new Scene(engine);
scene.clearColor = new Color4(0.52, 0.72, 0.90, 1);

// Lights
const hemi = new HemisphericLight("hemi", new Vector3(0, 1, 0.3), scene);
hemi.intensity = 0.7;
const dir = new DirectionalLight("dir", new Vector3(-0.4, -1, 0.6), scene);
dir.intensity = 0.8;

// Camera
const camCtrl = new CameraController(scene, canvas);

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
const unitFactory = new UnitFactory(scene);
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
  });
  if (!child) return null;

  child.configureAnchoredLink({
    roleLabel: actor.label,
    parentRoleLabel,
    offset: actor.offset,
    syncFacing: actor.syncFacing,
    targetable: actor.semantics.targetable,
    combatEmitter: actor.semantics.combatEmitter,
    damageRouting: actor.semantics.damageRouting,
    victoryRouting: actor.semantics.victoryRouting,
    moveMode: actor.semantics.moveMode,
    cleanupPolicy: actor.semantics.cleanupPolicy,
    detachOnParentDeath: actor.semantics.detachOnParentDeath,
    actionPreset: actor.semantics.actionPreset,
    impactOrigin: actor.semantics.impactOrigin,
  });
  parent.detachLinkedChild(child);
  parent.attachLinkedChild(child, actor.relation);
  if (actor.hideBaseBody) {
    child.setBaseBodyVisible(false);
  }
  if (!actor.semantics.targetable) {
    child.setHealthBarVisible(false);
  }
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
  });
  const role = options.role ?? "placed";
  const countsTowardVictory = options.countsTowardVictory ?? (role === "placed" || role === "summoned");
  unit.setSpawnRole(role, countsTowardVictory);
  unit.setDecorativeStandinsSuppressed(options.suppressDecorativeOperators ?? Boolean(preset));
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

function resetBattle(): void {
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

function runScenario(name: string): ScenarioSpec | null {
  const scenario = getScenario(name);
  if (!scenario) {
    showStatus(`Unknown scenario: ${name}`);
    return null;
  }

  resetBattle();
  activeScenario = scenario;
  for (const unit of scenario.units) {
    spawnHarnessUnit(unit.unitId, unit.team, unit.position);
  }

  if (scenario.autoStart) startBattle(true);
  if (scenario.advanceMs && scenario.advanceMs > 0) {
    advanceSimulationTime(scenario.advanceMs);
  }
  return scenario;
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
  listScenarios: listScenarioNames,
};

// ─── Game loop ───
engine.runRenderLoop(() => {
  const dt = engine.getDeltaTime() / 1000;
  worldTimeSeconds += dt;
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
  const payload = {
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
        return ({
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
        attackEmitterRole: attackEmitter === unit ? "parent" : (attackEmitter.linkedRoleLabel ?? attackEmitter.definition.displayName),
        attackEmitterId: attackEmitter.runtimeId,
        impactEmitterRole: impactEmitter === unit ? "parent" : (impactEmitter.linkedRoleLabel ?? impactEmitter.definition.displayName),
        impactEmitterId: impactEmitter.runtimeId,
        decorativeStandinsSuppressed: unit.decorativeStandinsSuppressed,
        countsTowardVictory: unit.countsTowardVictory,
        linkedParentId: unit.linkedParent?.runtimeId ?? null,
        linkedRelation: unit.linkedRelation,
        linkedEntities: unit.linkedEntities,
        alive: !unit.isDead,
        hp: Math.round(unit.currentHealth),
        x: Number(unit.position.x.toFixed(2)),
        z: Number(unit.position.z.toFixed(2)),
      });
    }),
    projectiles: projectileSystem.activeCount,
  };
  return JSON.stringify(payload);
}

(window as any).render_game_to_text = renderGameToText;
(window as any).advanceTime = advanceSimulationTime;
