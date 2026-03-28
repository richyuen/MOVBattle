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
import { FactionId } from "./data/factionColors";

import { SimulationSystem } from "./combat/simulationSystem";
import { ProjectileSystem } from "./combat/projectileSystem";
import { VisualEffects } from "./combat/visualEffects";
import { UnitFactory } from "./units/unitFactory";
import { RuntimeUnit } from "./units/runtimeUnit";

import { AncientSandboxMapBuilder, getPlacementZones } from "./map/mapBuilder";
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
const resultOverlayEl = document.getElementById("resultOverlay")!;
const resultTitleEl = document.getElementById("resultTitle")!;
const resultDetailEl = document.getElementById("resultDetail")!;
const btnTeamA = document.getElementById("btnTeamA")!;
const btnTeamB = document.getElementById("btnTeamB")!;

// ─── Engine & Scene ───
const engine = new Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });
const scene = new Scene(engine);
scene.clearColor = new Color4(0.55, 0.75, 0.92, 1);

// Lights
const hemi = new HemisphericLight("hemi", new Vector3(0, 1, 0.3), scene);
hemi.intensity = 0.7;
const dir = new DirectionalLight("dir", new Vector3(-0.4, -1, 0.6), scene);
dir.intensity = 0.8;

// Camera
const camCtrl = new CameraController(scene, canvas);

// Map
const mapBuilder = new AncientSandboxMapBuilder(scene);
const zones = mapBuilder.build();

// ─── Game systems ───
const stateMachine = new GameStateMachine();
const simulation = new SimulationSystem();
const projectileSystem = new ProjectileSystem(scene);
const visualEffects = new VisualEffects(scene);
simulation.projectileSystem = projectileSystem;
simulation.visualEffects = visualEffects;
const unitFactory = new UnitFactory(scene);
const placementValidator = new PlacementValidator(zones);

let budgetSystem = new BudgetSystem(
  BATTLE_CONFIG.teamABudget, BATTLE_CONFIG.teamBBudget, BATTLE_CONFIG.maxUnitsPerTeam,
);

let activeTeam = 0;
let selectedUnitId = "tribal.clubber";
let selectedRosterIndex = 0;
const placedUnits: RuntimeUnit[] = [];
let countdownTimer: ReturnType<typeof setTimeout> | null = null;
let statusTimer: ReturnType<typeof setTimeout> | null = null;
let removeMode = false;

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

function setTeam(team: number): void {
  activeTeam = team;
  btnTeamA.classList.toggle("active", team === 0);
  btnTeamB.classList.toggle("active", team === 1);
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
  if (ALL_UNITS.length === 0) return;
  selectedRosterIndex = (selectedRosterIndex + offset + ALL_UNITS.length) % ALL_UNITS.length;
  selectUnit(ALL_UNITS[selectedRosterIndex].id);
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

// Faction display names and tab accent colors (CSS-friendly)
const FACTION_NAMES: Record<number, string> = {
  [FactionId.Tribal]: "Tribal",
  [FactionId.Farmer]: "Farmer",
  [FactionId.Medieval]: "Medieval",
  [FactionId.Ancient]: "Ancient",
  [FactionId.Viking]: "Viking",
  [FactionId.Dynasty]: "Dynasty",
  [FactionId.Renaissance]: "Renaissance",
  [FactionId.Pirate]: "Pirate",
};

const FACTION_TAB_COLORS: Record<number, string> = {
  [FactionId.Tribal]: "#8d5a33",
  [FactionId.Farmer]: "#d9c73e",
  [FactionId.Medieval]: "#4070d9",
  [FactionId.Ancient]: "#ccb888",
  [FactionId.Viking]: "#33bfcf",
  [FactionId.Dynasty]: "#d93333",
  [FactionId.Renaissance]: "#2a3570",
  [FactionId.Pirate]: "#808080",
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

function populateUnitGrid(): void {
  unitGridEl.innerHTML = "";
  const factionUnits = ALL_UNITS.filter((u) => u.faction === activeFaction);
  for (const def of factionUnits) {
    const btn = document.createElement("button");
    btn.className = "unit-btn";
    btn.dataset.id = def.id;
    btn.textContent = `${def.displayName} (${def.cost})`;
    if (def.id === selectedUnitId) btn.classList.add("selected");
    btn.addEventListener("click", () => selectUnit(def.id));
    unitGridEl.appendChild(btn);
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

// ─── Placement ───
function tryPlaceUnit(screenX: number, screenY: number): void {
  if (stateMachine.currentState !== GameState.Placement) return;

  const def = getUnit(selectedUnitId);
  if (!def) {
    // Remove mode: try to remove
    tryRemoveUnit(screenX, screenY);
    return;
  }

  if (!budgetSystem.canAddUnit(activeTeam, simulation.getLivingCount(activeTeam))) {
    showStatus("Team unit cap reached.");
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

  const reason = placementValidator.validate(activeTeam, worldPoint, def.collisionRadius, placedUnits);
  if (reason) {
    showStatus(reason);
    return;
  }

  if (!budgetSystem.trySpend(activeTeam, def.cost)) {
    showStatus("Not enough budget.");
    return;
  }

  const unit = unitFactory.spawn(def, activeTeam, worldPoint);
  placedUnits.push(unit);
  simulation.registerUnit(unit);
  updateBudgetDisplay();
}

function tryRemoveUnit(screenX: number, screenY: number): void {
  if (stateMachine.currentState !== GameState.Placement) return;

  const pickResult = scene.pick(screenX, screenY);
  if (!pickResult || !pickResult.hit || !pickResult.pickedMesh) return;

  const meta = pickResult.pickedMesh.metadata;
  if (!meta || !meta.runtimeUnit) return;

  const ru = meta.runtimeUnit as RuntimeUnit;
  if (ru.isDead || ru.team !== activeTeam) return;

  // Refund and remove
  simulation.unregisterUnit(ru);
  const idx = placedUnits.indexOf(ru);
  if (idx >= 0) placedUnits.splice(idx, 1);
  budgetSystem.refund(ru.team, ru.definition.cost);
  ru.dispose();
  updateBudgetDisplay();
}

// ─── Battle lifecycle ───
function startBattle(): void {
  if (stateMachine.currentState !== GameState.Placement) return;

  const teamACount = simulation.getLivingCount(0);
  const teamBCount = simulation.getLivingCount(1);
  if (teamACount === 0 || teamBCount === 0) {
    showStatus("Both teams need at least one unit.");
    return;
  }

  stateMachine.setState(GameState.Countdown);
  showStatus("Battle starting...");

  countdownTimer = setTimeout(() => {
    simulation.beginSimulation();
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

  simulation.endSimulation();
  projectileSystem.dispose();
  visualEffects.dispose();

  for (const unit of placedUnits) {
    simulation.unregisterUnit(unit);
    unit.dispose();
  }
  placedUnits.length = 0;

  budgetSystem = new BudgetSystem(
    BATTLE_CONFIG.teamABudget, BATTLE_CONFIG.teamBBudget, BATTLE_CONFIG.maxUnitsPerTeam,
  );

  removeMode = false;
  btnRemoveEl.classList.remove("remove-active");
  stateMachine.setState(GameState.Placement);
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

  simulation.endSimulation();
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

  // Reset all units back to their original positions
  for (const unit of placedUnits) {
    unit.resetToSpawn();
  }
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
    case "Tab":
      e.preventDefault();
      setTeam(activeTeam === 0 ? 1 : 0);
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
  setTeam,
  startBattle,
  resetBattle,
  toggleRemoveMode,
};

// ─── Game loop ───
engine.runRenderLoop(() => {
  const dt = engine.getDeltaTime() / 1000;

  if (stateMachine.currentState === GameState.Simulation) {
    simulation.update(dt);
    projectileSystem.update(dt);
    visualEffects.update(dt);
    checkVictory();
  } else if (stateMachine.currentState === GameState.Placement) {
    // Still update units for idle animation if needed
    for (const unit of placedUnits) {
      unit.update(dt, performance.now() / 1000);
    }
  }

  scene.render();
});

window.addEventListener("resize", () => engine.resize());
