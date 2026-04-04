import { FACTION_NAMES, FactionId } from "../data/factionColors";
import { getUnitsByFaction } from "../data/unitDefinitions";
import type { GalleryCameraOverride, GalleryCameraPresetId } from "../ui/cameraController";
import type { BattleMapId } from "../map/mapBuilder";

export interface ScenarioUnitSpec {
  unitId: string;
  team: number;
  position: { x: number; y?: number; z: number };
}

export interface ScenarioAssertion {
  kind:
    | "units-present"
    | "mode-is"
    | "comparison-focus"
    | "linked-role-count"
    | "linked-relation-count"
    | "spawned-child-count"
    | "unit-hp-at-most"
    | "unit-height-at-most"
    | "position-shift-at-least"
    | "position-shift-at-most"
    | "unit-distance-at-least"
    | "collision-push-at-least"
    | "replay-stability"
    | "victory-semantics"
    | "emitter-owner"
    | "impact-owner"
    | "damage-owner"
    | "cleanup-policy"
    | "no-duplicate-standins"
    | "origin-source"
    | "origin-socket"
    | "linked-role-targetable"
    | "linked-role-state"
    | "parent-capability"
    | "replay-restore"
    | "crowd-metric-at-least"
    | "balance-state"
    | "topple-direction"
    | "physics-state"
    | "battle-feel-state"
    | "pressure-transfer-at-least"
    | "attack-interrupted-at-least"
    | "downed-block-active"
    | "downed-block-seconds-at-most"
    | "chain-topple-count-at-least";
  value: string;
}

export interface ScenarioAction {
  kind: "damage-linked-role" | "damage-root-unit";
  parentUnitId?: string;
  unitId?: string;
  role?: string;
  damage: number;
  impulse?: { x: number; y?: number; z: number };
}

export interface ScenarioSpec {
  name: string;
  description: string;
  mapId?: BattleMapId;
  autoStart?: boolean;
  advanceMs?: number;
  units: ScenarioUnitSpec[];
  assertions: ScenarioAssertion[];
  actions?: ScenarioAction[];
  gallery?: ScenarioGallerySpec;
}

export type ScenarioCapturePhase = "placement" | "simulation-mid" | "replay" | "post-reset";
export type GalleryReviewMode = "default" | "silhouette" | "grayscale";

export interface ScenarioGallerySpec {
  presetId: GalleryCameraPresetId;
  capturePhase: ScenarioCapturePhase;
  captureAdvanceMs?: number;
  settleFrames?: number;
  hideUiDuringCapture?: boolean;
  artifactBaseName?: string;
  cameraOverride?: GalleryCameraOverride;
  reviewModes?: GalleryReviewMode[];
  reviewOrder?: string[];
}

export const SCENARIOS: Record<string, ScenarioSpec> = {
  iconic_zeus_vs_thor: {
    name: "iconic_zeus_vs_thor",
    description: "Mirror hero skirmish to compare divine lightning presentation.",
    autoStart: true,
    advanceMs: 2600,
    units: [
      { unitId: "ancient.zeus", team: 0, position: { x: -10, z: -1.5 } },
      { unitId: "legacy.thor", team: 1, position: { x: 10, z: 1.5 } },
    ],
    assertions: [
      { kind: "mode-is", value: "Simulation" },
      { kind: "comparison-focus", value: "Zeus should read as wider divine lightning; Thor as tighter hammer-forward storm strikes." },
    ],
  },
  iconic_artillery_compare: {
    name: "iconic_artillery_compare",
    description: "Side-by-side artillery distinction scenario.",
    autoStart: true,
    advanceMs: 3200,
    units: [
      { unitId: "legacy.tank", team: 0, position: { x: -14, z: 0 } },
      { unitId: "renaissance.da_vinci_tank", team: 0, position: { x: -11, z: 2.5 } },
      { unitId: "dynasty.hwacha", team: 0, position: { x: -11, z: -2.5 } },
      { unitId: "tribal.clubber", team: 1, position: { x: 11, z: -2 } },
      { unitId: "tribal.clubber", team: 1, position: { x: 11, z: 0 } },
      { unitId: "tribal.clubber", team: 1, position: { x: 11, z: 2 } },
    ],
    assertions: [
      { kind: "comparison-focus", value: "Legacy Tank, Da Vinci Tank, and Hwacha should produce distinct artillery rhythms and projectile patterns." },
      { kind: "linked-relation-count", value: "legacy.tank:crew=2" },
      { kind: "linked-relation-count", value: "renaissance.da_vinci_tank:crew=1" },
      { kind: "linked-relation-count", value: "dynasty.hwacha:crew=1" },
      { kind: "emitter-owner", value: "legacy.tank:gunner, renaissance.da_vinci_tank:pilot, dynasty.hwacha:rocketeer" },
      { kind: "impact-owner", value: "legacy.tank:gunner, renaissance.da_vinci_tank:pilot, dynasty.hwacha:rocketeer" },
      { kind: "origin-source", value: "legacy.tank:attack=vehicle-socket+impact=vehicle-socket, renaissance.da_vinci_tank:attack=vehicle-socket+impact=vehicle-socket, dynasty.hwacha:attack=vehicle-socket+impact=vehicle-socket" },
      { kind: "no-duplicate-standins", value: "legacy.tank+renaissance.da_vinci_tank+dynasty.hwacha" },
    ],
  },
  physics_injected_recovery_state: {
    name: "physics_injected_recovery_state",
    description: "After a topple window, the unit should recover its normal capability state if no new hits arrive.",
    autoStart: true,
    advanceMs: 2200,
    units: [
      { unitId: "medieval.knight", team: 0, position: { x: -8, z: 0 } },
      { unitId: "medieval.archer", team: 1, position: { x: 26, z: 0 } },
    ],
    actions: [
      { kind: "damage-root-unit", unitId: "medieval.knight", damage: 1, impulse: { x: 15, y: 2.4, z: 0 } },
    ],
    assertions: [
      { kind: "physics-state", value: "medieval.knight:steady" },
      { kind: "parent-capability", value: "medieval.knight:attack=enabled+move=enabled" },
      { kind: "position-shift-at-least", value: "medieval.knight>=1.1" },
      { kind: "unit-distance-at-least", value: "medieval.knight<->medieval.archer>=16" },
      { kind: "crowd-metric-at-least", value: "medieval.knight:crowdPressure<=0.25" },
    ],
  },
  physics_hit_launch_guard: {
    name: "physics_hit_launch_guard",
    description: "A normal horizontal hit may pop a unit briefly, but it must not balloon far into the air.",
    autoStart: true,
    advanceMs: 120,
    units: [
      { unitId: "tribal.clubber", team: 0, position: { x: -8, z: 0 } },
      { unitId: "medieval.archer", team: 1, position: { x: 24, z: 0 } },
    ],
    actions: [
      { kind: "damage-root-unit", unitId: "tribal.clubber", damage: 1, impulse: { x: -14, z: 0 } },
    ],
    assertions: [
      { kind: "unit-height-at-most", value: "tribal.clubber<=1.1" },
      { kind: "position-shift-at-least", value: "tribal.clubber>=0.2" },
    ],
  },
  physics_death_launch_guard: {
    name: "physics_death_launch_guard",
    description: "A killing hit may throw a body, but it must not rocket it unrealistically high.",
    autoStart: true,
    advanceMs: 260,
    units: [
      { unitId: "tribal.clubber", team: 0, position: { x: -8, z: 0 } },
      { unitId: "medieval.archer", team: 1, position: { x: 24, z: 0 } },
    ],
    actions: [
      { kind: "damage-root-unit", unitId: "tribal.clubber", damage: 9999, impulse: { x: -14, z: 0 } },
    ],
    assertions: [
      { kind: "unit-height-at-most", value: "tribal.clubber<=1.6" },
      { kind: "position-shift-at-least", value: "tribal.clubber>=0.3" },
    ],
  },
  nonsecret_legacy_tank_roles: {
    name: "nonsecret_legacy_tank_roles",
    description: "Linked-role structure check for Legacy Tank.",
    autoStart: false,
    units: [
      { unitId: "legacy.tank", team: 0, position: { x: -8, z: 0 } },
    ],
    assertions: [
      { kind: "linked-relation-count", value: "legacy.tank:crew=2" },
      { kind: "linked-role-targetable", value: "legacy.tank:driver=false, gunner=false" },
      { kind: "victory-semantics", value: "legacy.tank crew should not count as separate victory actors." },
      { kind: "emitter-owner", value: "legacy.tank:gunner" },
      { kind: "impact-owner", value: "legacy.tank:gunner" },
      { kind: "damage-owner", value: "legacy.tank:driver=parent,gunner=parent" },
      { kind: "parent-capability", value: "legacy.tank:attack=enabled+move=enabled" },
      { kind: "cleanup-policy", value: "legacy.tank:all linked roles remove with parent" },
      { kind: "no-duplicate-standins", value: "legacy.tank" },
      { kind: "units-present", value: "legacy.tank" },
    ],
  },
  nonsecret_da_vinci_tank_roles: {
    name: "nonsecret_da_vinci_tank_roles",
    description: "Linked-role structure check for Da Vinci Tank.",
    autoStart: false,
    units: [
      { unitId: "renaissance.da_vinci_tank", team: 0, position: { x: -8, z: 0 } },
    ],
    assertions: [
      { kind: "linked-relation-count", value: "renaissance.da_vinci_tank:crew=1" },
      { kind: "linked-role-targetable", value: "renaissance.da_vinci_tank:pilot=false" },
      { kind: "victory-semantics", value: "renaissance.da_vinci_tank pilot should not count as a separate victory actor." },
      { kind: "emitter-owner", value: "renaissance.da_vinci_tank:pilot" },
      { kind: "impact-owner", value: "renaissance.da_vinci_tank:pilot" },
      { kind: "damage-owner", value: "renaissance.da_vinci_tank:pilot=parent" },
      { kind: "parent-capability", value: "renaissance.da_vinci_tank:attack=enabled+move=enabled" },
      { kind: "cleanup-policy", value: "renaissance.da_vinci_tank:all linked roles remove with parent" },
      { kind: "no-duplicate-standins", value: "renaissance.da_vinci_tank" },
      { kind: "units-present", value: "renaissance.da_vinci_tank" },
    ],
  },
  nonsecret_hwacha_roles: {
    name: "nonsecret_hwacha_roles",
    description: "Linked-role structure check for Hwacha.",
    autoStart: false,
    units: [
      { unitId: "dynasty.hwacha", team: 0, position: { x: -8, z: 0 } },
    ],
    assertions: [
      { kind: "linked-relation-count", value: "dynasty.hwacha:crew=1" },
      { kind: "linked-role-targetable", value: "dynasty.hwacha:rocketeer=true" },
      { kind: "victory-semantics", value: "dynasty.hwacha crew should not count as separate victory actors." },
      { kind: "emitter-owner", value: "dynasty.hwacha:rocketeer" },
      { kind: "impact-owner", value: "dynasty.hwacha:rocketeer" },
      { kind: "damage-owner", value: "dynasty.hwacha:rocketeer=self" },
      { kind: "parent-capability", value: "dynasty.hwacha:attack=enabled+move=enabled" },
      { kind: "cleanup-policy", value: "dynasty.hwacha:all linked roles remove with parent" },
      { kind: "no-duplicate-standins", value: "dynasty.hwacha" },
      { kind: "units-present", value: "dynasty.hwacha" },
    ],
  },
  operator_legacy_tank_gunner_loss: {
    name: "operator_legacy_tank_gunner_loss",
    description: "Internal crew damage should route to the Legacy Tank body.",
    units: [
      { unitId: "legacy.tank", team: 0, position: { x: -8, z: 0 } },
    ],
    actions: [
      { kind: "damage-linked-role", parentUnitId: "legacy.tank", role: "gunner", damage: 9999 },
    ],
    assertions: [
      { kind: "linked-role-targetable", value: "legacy.tank:driver=false, gunner=false" },
      { kind: "damage-owner", value: "legacy.tank:driver=parent,gunner=parent" },
      { kind: "unit-hp-at-most", value: "legacy.tank<=0" },
      { kind: "replay-restore", value: "legacy.tank:gunner=alive+attack=enabled+move=enabled" },
      { kind: "units-present", value: "legacy.tank" },
    ],
  },
  operator_da_vinci_tank_pilot_loss: {
    name: "operator_da_vinci_tank_pilot_loss",
    description: "Internal crew damage should route to the Da Vinci Tank body.",
    units: [
      { unitId: "renaissance.da_vinci_tank", team: 0, position: { x: -8, z: 0 } },
    ],
    actions: [
      { kind: "damage-linked-role", parentUnitId: "renaissance.da_vinci_tank", role: "pilot", damage: 9999 },
    ],
    assertions: [
      { kind: "linked-role-targetable", value: "renaissance.da_vinci_tank:pilot=false" },
      { kind: "damage-owner", value: "renaissance.da_vinci_tank:pilot=parent" },
      { kind: "unit-hp-at-most", value: "renaissance.da_vinci_tank<=0" },
      { kind: "replay-restore", value: "renaissance.da_vinci_tank:pilot=alive+attack=enabled+move=enabled" },
      { kind: "units-present", value: "renaissance.da_vinci_tank" },
    ],
  },
  operator_hwacha_rocketeer_loss: {
    name: "operator_hwacha_rocketeer_loss",
    description: "Deterministic rocketeer-loss capability check for Hwacha.",
    units: [
      { unitId: "dynasty.hwacha", team: 0, position: { x: -8, z: 0 } },
    ],
    actions: [
      { kind: "damage-linked-role", parentUnitId: "dynasty.hwacha", role: "rocketeer", damage: 9999 },
    ],
    assertions: [
      { kind: "linked-role-targetable", value: "dynasty.hwacha:rocketeer=true" },
      { kind: "linked-role-state", value: "dynasty.hwacha:rocketeer=dead" },
      { kind: "parent-capability", value: "dynasty.hwacha:attack=disabled+move=disabled" },
      { kind: "replay-restore", value: "dynasty.hwacha:rocketeer=alive+attack=enabled+move=enabled" },
      { kind: "units-present", value: "dynasty.hwacha" },
    ],
  },
  crowd_physics_clubber_vs_protector: {
    name: "crowd_physics_clubber_vs_protector",
    description: "A light rusher should register stronger crowd shove response than a braced defender.",
    autoStart: true,
    advanceMs: 500,
    units: [
      { unitId: "tribal.clubber", team: 0, position: { x: -0.35, z: 0 } },
      { unitId: "tribal.protector", team: 1, position: { x: 0.35, z: 0 } },
    ],
    assertions: [
      { kind: "mode-is", value: "Simulation" },
      { kind: "crowd-metric-at-least", value: "tribal.clubber:collisionContactCount>=1+collisionPushPeak>=0.18, tribal.protector:collisionContactCount>=1" },
      { kind: "position-shift-at-least", value: "tribal.clubber>=0.15" },
    ],
  },
  crowd_physics_halfling_vs_knight: {
    name: "crowd_physics_halfling_vs_knight",
    description: "A tiny unit should be displaced harder than a heavy knight during first contact.",
    autoStart: true,
    advanceMs: 550,
    units: [
      { unitId: "farmer.halfling", team: 0, position: { x: -0.2, z: 0 } },
      { unitId: "medieval.knight", team: 1, position: { x: 0.25, z: 0 } },
    ],
    assertions: [
      { kind: "mode-is", value: "Simulation" },
      { kind: "crowd-metric-at-least", value: "farmer.halfling:collisionContactCount>=1+collisionPushPeak>=0.28, medieval.knight:collisionContactCount>=1" },
      { kind: "position-shift-at-least", value: "farmer.halfling>=0.25" },
    ],
  },
  crowd_topple_clubber_vs_protector: {
    name: "crowd_topple_clubber_vs_protector",
    description: "Frontal melee contact should pitch a light clubber into a forward topple faster than a braced protector.",
    autoStart: true,
    advanceMs: 900,
    units: [
      { unitId: "tribal.clubber", team: 0, position: { x: -1.15, z: 0 } },
      { unitId: "tribal.protector", team: 1, position: { x: 1.15, z: 0 } },
    ],
    assertions: [
      { kind: "mode-is", value: "Simulation" },
      { kind: "physics-state", value: "tribal.clubber:toppled|recovering" },
      { kind: "topple-direction", value: "tribal.clubber:forward" },
      { kind: "crowd-metric-at-least", value: "tribal.clubber:collisionPushPeak>=1.4, tribal.protector:balancePressure<=0.8" },
      { kind: "position-shift-at-least", value: "tribal.clubber>=0.3" },
      { kind: "comparison-focus", value: "The lighter clubber should pitch forward under dense frontal contact before the braced protector does." },
    ],
  },
  crowd_topple_halfling_vs_knight: {
    name: "crowd_topple_halfling_vs_knight",
    description: "The same shove should topple the halfling forward while the knight resists or only loads pressure.",
    autoStart: false,
    units: [
      { unitId: "farmer.halfling", team: 0, position: { x: -8, z: -0.9 } },
      { unitId: "medieval.knight", team: 0, position: { x: -8, z: 0.9 } },
    ],
    actions: [
      { kind: "damage-root-unit", unitId: "farmer.halfling", damage: 1, impulse: { x: -12, y: 1.4, z: 0 } },
      { kind: "damage-root-unit", unitId: "medieval.knight", damage: 1, impulse: { x: -12, y: 1.4, z: 0 } },
    ],
    assertions: [
      { kind: "physics-state", value: "farmer.halfling:toppled|airborne, medieval.knight:steady|recovering|airborne" },
      { kind: "crowd-metric-at-least", value: "farmer.halfling:crowdPressure>=0.5, medieval.knight:crowdPressure<=0.35" },
    ],
  },
  crowd_topple_wheelbarrow_charge: {
    name: "crowd_topple_wheelbarrow_charge",
    description: "Wheelbarrow charge pressure should force a readable forward topple on the first light defender it hits.",
    autoStart: true,
    advanceMs: 1750,
    units: [
      { unitId: "farmer.wheelbarrow", team: 0, position: { x: -8, z: 0 } },
      { unitId: "tribal.clubber", team: 1, position: { x: 0.55, z: -0.5 } },
      { unitId: "tribal.protector", team: 1, position: { x: 0.95, z: 0.7 } },
    ],
    assertions: [
      { kind: "mode-is", value: "Simulation" },
      { kind: "physics-state", value: "tribal.clubber:toppled|recovering" },
      { kind: "topple-direction", value: "tribal.clubber:forward" },
      { kind: "unit-height-at-most", value: "tribal.clubber<=1.1" },
      { kind: "crowd-metric-at-least", value: "tribal.clubber:collisionPushPeak>=3.4+toppleForwardness>=0.24" },
      { kind: "position-shift-at-least", value: "tribal.clubber>=1.1, tribal.protector>=0.6" },
    ],
  },
  crowd_topple_mammoth_pressure: {
    name: "crowd_topple_mammoth_pressure",
    description: "Mammoth pressure should create broader forward-topple disruption across a mixed infantry line.",
    autoStart: true,
    advanceMs: 2150,
    units: [
      { unitId: "tribal.mammoth", team: 0, position: { x: -6.2, z: 0 } },
      { unitId: "farmer.farmer", team: 1, position: { x: 0.2, z: -1.05 } },
      { unitId: "medieval.squire", team: 1, position: { x: 0.85, z: 0 } },
      { unitId: "ancient.hoplite", team: 1, position: { x: 1.55, z: 1.05 } },
    ],
    assertions: [
      { kind: "mode-is", value: "Simulation" },
      { kind: "physics-state", value: "farmer.farmer:airborne|recovering|toppled, medieval.squire:airborne|recovering|toppled" },
      { kind: "unit-height-at-most", value: "farmer.farmer<=1.2, medieval.squire<=1.1" },
      { kind: "crowd-metric-at-least", value: "farmer.farmer:collisionPushPeak>=3.4, medieval.squire:collisionPushPeak>=1.1, ancient.hoplite:collisionPushPeak>=0.5" },
      { kind: "position-shift-at-least", value: "farmer.farmer>=1.3, medieval.squire>=1.2, ancient.hoplite>=0.75" },
    ],
  },
  crowd_topple_recovery_state: {
    name: "crowd_topple_recovery_state",
    description: "After a forward topple resolves, the unit should return to steady capability without lingering pressure lockups.",
    autoStart: true,
    advanceMs: 2400,
    units: [
      { unitId: "tribal.clubber", team: 0, position: { x: -8, z: 0 } },
      { unitId: "medieval.archer", team: 1, position: { x: 24, z: 0 } },
    ],
    actions: [
      { kind: "damage-root-unit", unitId: "tribal.clubber", damage: 1, impulse: { x: -14, y: 1.6, z: 0 } },
    ],
    assertions: [
      { kind: "physics-state", value: "tribal.clubber:steady" },
      { kind: "balance-state", value: "tribal.clubber:steady" },
      { kind: "parent-capability", value: "tribal.clubber:attack=enabled+move=enabled" },
      { kind: "crowd-metric-at-least", value: "tribal.clubber:balancePressure<=0.2+pressureLoad<=0.25" },
      { kind: "position-shift-at-least", value: "tribal.clubber>=0.7" },
      { kind: "unit-distance-at-least", value: "tribal.clubber<->medieval.archer>=14" },
    ],
  },
  battlefeel_shield_wall_vs_light_swarm: {
    name: "battlefeel_shield_wall_vs_light_swarm",
    description: "Brace-style defenders should hold longer than fragile attackers while nearby light bodies still show disruption.",
    autoStart: true,
    advanceMs: 1700,
    units: [
      { unitId: "tribal.protector", team: 0, position: { x: -2.2, z: -0.6 } },
      { unitId: "ancient.hoplite", team: 0, position: { x: -2.1, z: 0.7 } },
      { unitId: "tribal.clubber", team: 1, position: { x: 2.1, z: -0.6 } },
      { unitId: "farmer.halfling", team: 1, position: { x: 2.3, z: 0.15 } },
      { unitId: "farmer.farmer", team: 1, position: { x: 2.05, z: 0.95 } },
    ],
    assertions: [
      { kind: "mode-is", value: "Simulation" },
      { kind: "battle-feel-state", value: "tribal.protector:steady|pressure-loaded|staggered" },
      { kind: "attack-interrupted-at-least", value: "tribal.clubber>=1, farmer.halfling>=1" },
      { kind: "position-shift-at-least", value: "tribal.clubber>=0.65, farmer.halfling>=0.45" },
      { kind: "position-shift-at-most", value: "tribal.protector<=1.35" },
      { kind: "comparison-focus", value: "The shield wall should hold formation better than the light swarm while the attackers show clearer disruption states." },
    ],
  },
  battlefeel_attack_interrupt_charge: {
    name: "battlefeel_attack_interrupt_charge",
    description: "High-pressure charge contact should deterministically interrupt at least one defender attack window.",
    autoStart: true,
    advanceMs: 1600,
    units: [
      { unitId: "farmer.wheelbarrow", team: 0, position: { x: -8.5, z: 0 } },
      { unitId: "tribal.clubber", team: 1, position: { x: 0.25, z: -0.35 } },
      { unitId: "farmer.halfling", team: 1, position: { x: 0.9, z: 0.5 } },
    ],
    assertions: [
      { kind: "mode-is", value: "Simulation" },
      { kind: "attack-interrupted-at-least", value: "tribal.clubber>=1" },
      { kind: "battle-feel-state", value: "tribal.clubber:staggered|toppled|downed|recovering" },
      { kind: "position-shift-at-least", value: "tribal.clubber>=0.85" },
      { kind: "comparison-focus", value: "Wheelbarrow impact should cancel or delay a defender attack, not merely slide bodies sideways." },
    ],
  },
  battlefeel_downed_lane_block: {
    name: "battlefeel_downed_lane_block",
    description: "A freshly downed body should briefly act as a local collision obstruction without becoming a persistent corpse hazard.",
    autoStart: true,
    advanceMs: 950,
    units: [
      { unitId: "tribal.clubber", team: 0, position: { x: -7.3, z: 0 } },
      { unitId: "medieval.squire", team: 0, position: { x: -9.1, z: 0 } },
      { unitId: "medieval.archer", team: 1, position: { x: 18, z: 0 } },
    ],
    actions: [
      { kind: "damage-root-unit", unitId: "tribal.clubber", damage: 1, impulse: { x: -15, y: 1.5, z: 0 } },
    ],
    assertions: [
      { kind: "mode-is", value: "Simulation" },
      { kind: "battle-feel-state", value: "tribal.clubber:downed|recovering" },
      { kind: "downed-block-active", value: "tribal.clubber:true" },
      { kind: "downed-block-seconds-at-most", value: "tribal.clubber<=1.2" },
      { kind: "position-shift-at-most", value: "medieval.squire<=1.8" },
      { kind: "comparison-focus", value: "The fallen front unit should briefly impede the follower locally, then expire without turning into persistent corpse gameplay." },
    ],
  },
  battlefeel_spillover_chain: {
    name: "battlefeel_spillover_chain",
    description: "A heavy frontal impact should create bounded single-hop spillover pressure into nearby allies.",
    autoStart: true,
    advanceMs: 2100,
    units: [
      { unitId: "tribal.mammoth", team: 0, position: { x: -6.3, z: 0 } },
      { unitId: "farmer.farmer", team: 1, position: { x: 0.15, z: -1.0 } },
      { unitId: "medieval.squire", team: 1, position: { x: 0.85, z: 0 } },
      { unitId: "ancient.hoplite", team: 1, position: { x: 1.55, z: 1.0 } },
    ],
    assertions: [
      { kind: "mode-is", value: "Simulation" },
      { kind: "chain-topple-count-at-least", value: "farmer.farmer+medieval.squire+ancient.hoplite>=2" },
      { kind: "battle-feel-state", value: "farmer.farmer:toppled|downed|recovering, medieval.squire:staggered|toppled|downed|recovering" },
      { kind: "attack-interrupted-at-least", value: "medieval.squire>=1" },
      { kind: "position-shift-at-least", value: "medieval.squire>=0.55, ancient.hoplite>=0.3" },
      { kind: "comparison-focus", value: "Mammoth contact should disrupt more than the primary target only once, not cascade into uncontrolled pinball behavior." },
    ],
  },
  war_machine_tank_origin: {
    name: "war_machine_tank_origin",
    description: "Legacy Tank socket-driven shell and smoke origin check.",
    autoStart: true,
    advanceMs: 2200,
    units: [
      { unitId: "legacy.tank", team: 0, position: { x: -10, z: 0 } },
      { unitId: "medieval.squire", team: 1, position: { x: 9, z: 0 } },
    ],
    assertions: [
      { kind: "emitter-owner", value: "legacy.tank:gunner" },
      { kind: "impact-owner", value: "legacy.tank:gunner" },
      { kind: "origin-source", value: "legacy.tank:attack=vehicle-socket+smoke=vehicle-socket+impact=vehicle-socket" },
      { kind: "origin-socket", value: "legacy.tank:attack=primaryMuzzle+smoke=smokeSocket+impact=impactOrigin" },
      { kind: "comparison-focus", value: "Legacy Tank should fire one shell from the barrel muzzle with visible muzzle smoke and explosive impact." },
    ],
  },
  war_machine_cannon_compare: {
    name: "war_machine_cannon_compare",
    description: "Compare muzzle identity for Pirate Cannon and Bomb Cannon.",
    autoStart: true,
    advanceMs: 2400,
    units: [
      { unitId: "pirate.cannon", team: 0, position: { x: -12, z: -1.5 } },
      { unitId: "secret.bomb_cannon", team: 0, position: { x: -12, z: 1.5 } },
      { unitId: "medieval.squire", team: 1, position: { x: 10, z: -1.5 } },
      { unitId: "medieval.squire", team: 1, position: { x: 10, z: 1.5 } },
    ],
    assertions: [
      { kind: "comparison-focus", value: "Pirate Cannon and Bomb Cannon should fire from explicit barrel muzzles, with Bomb Cannon reading heavier and more explosive." },
      { kind: "units-present", value: "pirate.cannon,secret.bomb_cannon" },
    ],
  },
  war_machine_ballista_catapult: {
    name: "war_machine_ballista_catapult",
    description: "Check bolt and payload launch points on ballista and catapults.",
    autoStart: true,
    advanceMs: 2600,
    units: [
      { unitId: "ancient.ballista", team: 0, position: { x: -14, z: -2.2 } },
      { unitId: "medieval.catapult", team: 0, position: { x: -11, z: 0 } },
      { unitId: "spooky.pumpkin_catapult", team: 0, position: { x: -14, z: 2.2 } },
      { unitId: "tribal.clubber", team: 1, position: { x: 10, z: -2.2 } },
      { unitId: "tribal.clubber", team: 1, position: { x: 10, z: 0 } },
      { unitId: "tribal.clubber", team: 1, position: { x: 10, z: 2.2 } },
    ],
    assertions: [
      { kind: "comparison-focus", value: "Ballista bolts should leave the track, while catapult and pumpkin catapult payloads should launch from the bucket." },
      { kind: "units-present", value: "ancient.ballista,medieval.catapult,spooky.pumpkin_catapult" },
    ],
  },
  war_machine_wheelbarrow_compare: {
    name: "war_machine_wheelbarrow_compare",
    description: "Cart/readability check for Wheelbarrow and Wheelbarrow Dragon.",
    autoStart: true,
    advanceMs: 1800,
    units: [
      { unitId: "farmer.wheelbarrow", team: 0, position: { x: -10, z: -1.5 } },
      { unitId: "secret.wheelbarrow_dragon", team: 0, position: { x: -10, z: 1.5 } },
      { unitId: "medieval.squire", team: 1, position: { x: 7, z: -1.5 } },
      { unitId: "medieval.squire", team: 1, position: { x: 7, z: 1.5 } },
    ],
    assertions: [
      { kind: "comparison-focus", value: "Wheelbarrow should read as a charge cart; Wheelbarrow Dragon should retain cart plus dragon-head identity." },
      { kind: "units-present", value: "farmer.wheelbarrow,secret.wheelbarrow_dragon" },
      { kind: "origin-source", value: "farmer.wheelbarrow:impact=vehicle-socket, secret.wheelbarrow_dragon:attack=linked-role+impact=linked-role" },
    ],
  },
  composite_bank_robbers: {
    name: "composite_bank_robbers",
    description: "Composite identity check for Bank Robbers.",
    autoStart: false,
    units: [
      { unitId: "secret.bank_robbers", team: 0, position: { x: -8, z: 0 } },
    ],
    assertions: [
      { kind: "linked-relation-count", value: "secret.bank_robbers:attachment=1" },
      { kind: "linked-relation-count", value: "secret.bank_robbers:crew=1" },
      { kind: "emitter-owner", value: "secret.bank_robbers:parent+flank robber" },
      { kind: "damage-owner", value: "secret.bank_robbers:safe=parent,flank robber=parent" },
      { kind: "cleanup-policy", value: "secret.bank_robbers:all linked roles remove with parent" },
      { kind: "no-duplicate-standins", value: "secret.bank_robbers" },
      { kind: "units-present", value: "secret.bank_robbers" },
      { kind: "comparison-focus", value: "Text state should expose safe and robber crew composition." },
    ],
  },
  composite_bomb_cannon: {
    name: "composite_bomb_cannon",
    description: "Crewed artillery identity check for Bomb Cannon.",
    autoStart: false,
    units: [
      { unitId: "secret.bomb_cannon", team: 0, position: { x: -8, z: 0 } },
    ],
    assertions: [
      { kind: "linked-relation-count", value: "secret.bomb_cannon:crew=2" },
      { kind: "linked-role-targetable", value: "secret.bomb_cannon:gunner=true, loader=false" },
      { kind: "victory-semantics", value: "secret.bomb_cannon crew should not count as separate victory actors." },
      { kind: "emitter-owner", value: "secret.bomb_cannon:gunner" },
      { kind: "damage-owner", value: "secret.bomb_cannon:gunner=self,loader=parent" },
      { kind: "parent-capability", value: "secret.bomb_cannon:attack=enabled+move=enabled" },
      { kind: "cleanup-policy", value: "secret.bomb_cannon:all linked roles remove with parent" },
      { kind: "no-duplicate-standins", value: "secret.bomb_cannon" },
      { kind: "units-present", value: "secret.bomb_cannon" },
      { kind: "comparison-focus", value: "Text state should expose gunner and loader composition." },
    ],
  },
  composite_gatling_gun: {
    name: "composite_gatling_gun",
    description: "Crewed rapid-fire artillery identity check for Gatling Gun.",
    autoStart: false,
    units: [
      { unitId: "secret.gatling_gun", team: 0, position: { x: -8, z: 0 } },
    ],
    assertions: [
      { kind: "linked-relation-count", value: "secret.gatling_gun:crew=2" },
      { kind: "linked-role-targetable", value: "secret.gatling_gun:crank gunner=true, loader=false" },
      { kind: "victory-semantics", value: "secret.gatling_gun crew should not count as separate victory actors." },
      { kind: "emitter-owner", value: "secret.gatling_gun:crank gunner" },
      { kind: "damage-owner", value: "secret.gatling_gun:crank gunner=self,loader=parent" },
      { kind: "parent-capability", value: "secret.gatling_gun:attack=enabled+move=enabled" },
      { kind: "cleanup-policy", value: "secret.gatling_gun:all linked roles remove with parent" },
      { kind: "no-duplicate-standins", value: "secret.gatling_gun" },
      { kind: "units-present", value: "secret.gatling_gun" },
      { kind: "comparison-focus", value: "Text state should expose crank gunner and loader composition." },
    ],
  },
  operator_bomb_cannon_gunner_loss: {
    name: "operator_bomb_cannon_gunner_loss",
    description: "Deterministic gunner-loss capability check for Bomb Cannon.",
    units: [
      { unitId: "secret.bomb_cannon", team: 0, position: { x: -8, z: 0 } },
    ],
    actions: [
      { kind: "damage-linked-role", parentUnitId: "secret.bomb_cannon", role: "gunner", damage: 9999 },
    ],
    assertions: [
      { kind: "linked-role-targetable", value: "secret.bomb_cannon:gunner=true, loader=false" },
      { kind: "linked-role-state", value: "secret.bomb_cannon:gunner=dead, loader=alive" },
      { kind: "parent-capability", value: "secret.bomb_cannon:attack=disabled+move=enabled" },
      { kind: "replay-restore", value: "secret.bomb_cannon:gunner=alive+attack=enabled+move=enabled" },
      { kind: "units-present", value: "secret.bomb_cannon" },
    ],
  },
  operator_gatling_gun_crank_loss: {
    name: "operator_gatling_gun_crank_loss",
    description: "Deterministic crank-gunner-loss capability check for Gatling Gun.",
    units: [
      { unitId: "secret.gatling_gun", team: 0, position: { x: -8, z: 0 } },
    ],
    actions: [
      { kind: "damage-linked-role", parentUnitId: "secret.gatling_gun", role: "crank gunner", damage: 9999 },
    ],
    assertions: [
      { kind: "linked-role-targetable", value: "secret.gatling_gun:crank gunner=true, loader=false" },
      { kind: "linked-role-state", value: "secret.gatling_gun:crank gunner=dead, loader=alive" },
      { kind: "parent-capability", value: "secret.gatling_gun:attack=disabled+move=enabled" },
      { kind: "replay-restore", value: "secret.gatling_gun:crank gunner=alive+attack=enabled+move=enabled" },
      { kind: "units-present", value: "secret.gatling_gun" },
    ],
  },
  composite_mounts: {
    name: "composite_mounts",
    description: "Mounted unit identity check for cavalry and raptor rider.",
    autoStart: false,
    units: [
      { unitId: "secret.cavalry", team: 0, position: { x: -10, z: -1.5 } },
      { unitId: "secret.raptor_rider", team: 0, position: { x: -10, z: 1.5 } },
      { unitId: "wild_west.miner", team: 1, position: { x: 9, z: 0 } },
    ],
    assertions: [
      { kind: "linked-relation-count", value: "secret.cavalry:mount=1" },
      { kind: "linked-relation-count", value: "secret.raptor_rider:mount=1" },
      { kind: "emitter-owner", value: "secret.cavalry:parent, secret.raptor_rider:parent" },
      { kind: "impact-owner", value: "secret.cavalry:horse, secret.raptor_rider:raptor" },
      { kind: "damage-owner", value: "secret.cavalry:horse=parent, secret.raptor_rider:raptor=parent" },
      { kind: "cleanup-policy", value: "secret.cavalry+secret.raptor_rider:mount removes with parent" },
      { kind: "no-duplicate-standins", value: "secret.cavalry+secret.raptor_rider" },
      { kind: "comparison-focus", value: "Mounted units should expose rider and mount links instead of reading like plain single bodies." },
    ],
  },
  composite_wheelbarrow_dragon: {
    name: "composite_wheelbarrow_dragon",
    description: "Dragon cart composition and fire-charge check.",
    autoStart: true,
    advanceMs: 2400,
    units: [
      { unitId: "secret.wheelbarrow_dragon", team: 0, position: { x: -10, z: 0 } },
      { unitId: "medieval.squire", team: 1, position: { x: 7, z: 0 } },
    ],
    assertions: [
      { kind: "linked-relation-count", value: "secret.wheelbarrow_dragon:attachment=1" },
      { kind: "linked-relation-count", value: "secret.wheelbarrow_dragon:mount=1" },
      { kind: "emitter-owner", value: "secret.wheelbarrow_dragon:dragon head" },
      { kind: "impact-owner", value: "secret.wheelbarrow_dragon:dragon head" },
      { kind: "origin-source", value: "secret.wheelbarrow_dragon:attack=linked-role+impact=linked-role" },
      { kind: "damage-owner", value: "secret.wheelbarrow_dragon:wheelbarrow cart=parent,dragon head=parent" },
      { kind: "cleanup-policy", value: "secret.wheelbarrow_dragon:all linked roles remove with parent" },
      { kind: "no-duplicate-standins", value: "secret.wheelbarrow_dragon" },
      { kind: "comparison-focus", value: "Wheelbarrow Dragon should expose cart, driver, and dragon-head composition." },
    ],
  },
  composite_wheelbarrow_dragon_origin: {
    name: "composite_wheelbarrow_dragon_origin",
    description: "Direct linked-origin check for Wheelbarrow Dragon fire and impact.",
    autoStart: true,
    advanceMs: 1200,
    units: [
      { unitId: "secret.wheelbarrow_dragon", team: 0, position: { x: -10, z: 0 } },
      { unitId: "medieval.squire", team: 1, position: { x: 6.5, z: 0 } },
    ],
    assertions: [
      { kind: "linked-relation-count", value: "secret.wheelbarrow_dragon:attachment=1, mount=1" },
      { kind: "emitter-owner", value: "secret.wheelbarrow_dragon:dragon head" },
      { kind: "impact-owner", value: "secret.wheelbarrow_dragon:dragon head" },
      { kind: "origin-source", value: "secret.wheelbarrow_dragon:attack=linked-role+impact=linked-role" },
      { kind: "units-present", value: "secret.wheelbarrow_dragon" },
    ],
  },
  composite_clams: {
    name: "composite_clams",
    description: "Shell attachment and summon identity check for CLAMS.",
    autoStart: true,
    advanceMs: 2000,
    units: [
      { unitId: "secret.clams", team: 0, position: { x: -10, z: 0 } },
      { unitId: "medieval.squire", team: 1, position: { x: 8, z: 0 } },
    ],
    assertions: [
      { kind: "linked-relation-count", value: "secret.clams:attachment=1" },
      { kind: "emitter-owner", value: "secret.clams:parent" },
      { kind: "damage-owner", value: "secret.clams:clam shell=parent" },
      { kind: "cleanup-policy", value: "secret.clams:clam shell removes with parent" },
      { kind: "no-duplicate-standins", value: "secret.clams" },
      { kind: "comparison-focus", value: "CLAMS should expose an anchored shell attachment that remains distinct from summoned bomb divers." },
    ],
  },
  boss_dark_peasant_pressure: {
    name: "boss_dark_peasant_pressure",
    description: "Dark Peasant control-and-summon pressure check.",
    autoStart: true,
    advanceMs: 3400,
    units: [
      { unitId: "legacy.dark_peasant", team: 0, position: { x: -6.5, z: 0 } },
      { unitId: "pirate.captain", team: 1, position: { x: 4.5, z: 0 } },
    ],
    assertions: [
      { kind: "comparison-focus", value: "Dark Peasant should read as oppressive control plus dark summon pressure, not generic ranged magic." },
      { kind: "units-present", value: "legacy.dark_peasant,evil.shadow_walker" },
      { kind: "spawned-child-count", value: "legacy.dark_peasant:spawned-child>=2" },
      { kind: "unit-hp-at-most", value: "pirate.captain<=820" },
      { kind: "replay-stability", value: "legacy.dark_peasant:spawned-child>=2" },
    ],
  },
  boss_monkey_king_clones: {
    name: "boss_monkey_king_clones",
    description: "Monkey King clone pressure and replay cleanup check.",
    autoStart: true,
    advanceMs: 3200,
    units: [
      { unitId: "dynasty.monkey_king", team: 0, position: { x: -6, z: 0 } },
      { unitId: "pirate.captain", team: 1, position: { x: 4.8, z: 0 } },
    ],
    assertions: [
      { kind: "comparison-focus", value: "Monkey King should create visible clone pressure that materially changes the duel." },
      { kind: "units-present", value: "dynasty.monkey_king" },
      { kind: "spawned-child-count", value: "dynasty.monkey_king:spawned-child>=2" },
      { kind: "unit-hp-at-most", value: "pirate.captain<=820" },
      { kind: "replay-stability", value: "dynasty.monkey_king:spawned-child>=2" },
    ],
  },
  boss_super_peasant_pursuit: {
    name: "boss_super_peasant_pursuit",
    description: "Super Peasant pursuit and impact check.",
    autoStart: true,
    advanceMs: 1900,
    units: [
      { unitId: "legacy.super_peasant", team: 0, position: { x: -6.5, z: 0 } },
      { unitId: "pirate.captain", team: 1, position: { x: 5.5, z: 0 } },
    ],
    assertions: [
      { kind: "comparison-focus", value: "Super Peasant should read as extreme speed, pursuit, and impact dominance." },
      { kind: "position-shift-at-least", value: "legacy.super_peasant>=5.5" },
      { kind: "unit-hp-at-most", value: "pirate.captain<=820" },
    ],
  },
  boss_pirate_queen_duel: {
    name: "boss_pirate_queen_duel",
    description: "Pirate Queen versus Captain boss-presence check.",
    autoStart: true,
    advanceMs: 2800,
    units: [
      { unitId: "pirate.pirate_queen", team: 0, position: { x: -5.5, z: 0 } },
      { unitId: "pirate.captain", team: 1, position: { x: 4.5, z: 0 } },
    ],
    assertions: [
      { kind: "comparison-focus", value: "Pirate Queen should read as a grounded pirate boss rather than an upscaled Captain." },
      { kind: "position-shift-at-least", value: "pirate.pirate_queen>=3.5" },
      { kind: "unit-hp-at-most", value: "pirate.captain<=760" },
    ],
  },
  bosses_dark_vs_super: {
    name: "bosses_dark_vs_super",
    description: "High-risk boss comparison for deterministic validation.",
    autoStart: true,
    advanceMs: 2400,
    units: [
      { unitId: "legacy.dark_peasant", team: 0, position: { x: -8, z: 0 } },
      { unitId: "legacy.super_peasant", team: 1, position: { x: 8, z: 0 } },
    ],
    assertions: [
      { kind: "comparison-focus", value: "Dark Peasant should read as control/summon oppression; Super Peasant as mobility and impact." },
      { kind: "spawned-child-count", value: "legacy.dark_peasant:spawned-child>=2" },
      { kind: "position-shift-at-least", value: "legacy.super_peasant>=4.5" },
    ],
  },
  physics_crowd_separation: {
    name: "physics_crowd_separation",
    description: "A tight allied melee clump should spread into distinct live bodies once collision resolution is active.",
    autoStart: true,
    advanceMs: 900,
    units: [
      { unitId: "farmer.farmer", team: 0, position: { x: -9.5, z: 0 } },
      { unitId: "medieval.squire", team: 0, position: { x: -9.45, z: 0.04 } },
      { unitId: "ancient.hoplite", team: 0, position: { x: -9.45, z: -0.04 } },
      { unitId: "tribal.chieftain", team: 1, position: { x: 10.5, z: 0 } },
    ],
    assertions: [
      { kind: "mode-is", value: "Simulation" },
      { kind: "unit-distance-at-least", value: "farmer.farmer<->medieval.squire>=0.7, farmer.farmer<->ancient.hoplite>=0.7, medieval.squire<->ancient.hoplite>=0.8" },
      { kind: "collision-push-at-least", value: "farmer.farmer>=0.3, medieval.squire>=0.3, ancient.hoplite>=0.3" },
    ],
  },
  physics_mammoth_shove_line: {
    name: "physics_mammoth_shove_line",
    description: "A mammoth charge should create measurable live-body shove on a mixed infantry line.",
    autoStart: true,
    advanceMs: 2200,
    units: [
      { unitId: "tribal.mammoth", team: 0, position: { x: -6.2, z: 0 } },
      { unitId: "farmer.farmer", team: 1, position: { x: 0.2, z: -1.15 } },
      { unitId: "medieval.squire", team: 1, position: { x: 0.9, z: 0 } },
      { unitId: "ancient.hoplite", team: 1, position: { x: 1.6, z: 1.15 } },
    ],
    assertions: [
      { kind: "mode-is", value: "Simulation" },
      { kind: "collision-push-at-least", value: "farmer.farmer>=0.9, medieval.squire>=0.9, ancient.hoplite>=0.6" },
      { kind: "position-shift-at-least", value: "farmer.farmer>=1.2, medieval.squire>=1.2, ancient.hoplite>=1.2" },
      { kind: "comparison-focus", value: "Mammoth contact should displace the infantry line as live bodies instead of simply phasing through it." },
    ],
  },
  physics_topple_thresholds: {
    name: "physics_topple_thresholds",
    description: "The same shove impulse should topple a medium infantry body while a colossal beast stays steady.",
    autoStart: false,
    units: [
      { unitId: "medieval.squire", team: 0, position: { x: -8, z: -1.1 } },
      { unitId: "tribal.mammoth", team: 0, position: { x: -8, z: 1.1 } },
    ],
    actions: [
      { kind: "damage-root-unit", unitId: "medieval.squire", damage: 1, impulse: { x: 16, z: 0 } },
      { kind: "damage-root-unit", unitId: "tribal.mammoth", damage: 1, impulse: { x: 16, z: 0 } },
    ],
    assertions: [
      { kind: "physics-state", value: "medieval.squire:toppled|airborne, tribal.mammoth:airborne|steady" },
      { kind: "parent-capability", value: "medieval.squire:attack=disabled+move=disabled" },
      { kind: "crowd-metric-at-least", value: "medieval.squire:crowdPressure>=0.5, tribal.mammoth:crowdPressure<=0.2" },
    ],
  },
  adventure_obstacle_bypass: {
    name: "adventure_obstacle_bypass",
    description: "Adventure props should no longer pin advancing melee units near the ruin and forest choke points.",
    mapId: "campaign.adventure",
    autoStart: true,
    advanceMs: 3600,
    units: [
      { unitId: "medieval.squire", team: 1, position: { x: 26, z: 20 } },
      { unitId: "tribal.protector", team: 0, position: { x: 1, z: 20 } },
      { unitId: "farmer.farmer", team: 1, position: { x: 20, z: -10 } },
      { unitId: "ancient.hoplite", team: 0, position: { x: -1, z: -10 } },
    ],
    assertions: [
      { kind: "mode-is", value: "Simulation" },
      { kind: "position-shift-at-least", value: "medieval.squire>=7.5, farmer.farmer>=6.5" },
    ],
  },
  adventure_hazard_safe_routing: {
    name: "adventure_hazard_safe_routing",
    description: "Adventure units should find a safe crossing lane instead of stalling at the central water hazards.",
    mapId: "campaign.adventure",
    autoStart: true,
    advanceMs: 4200,
    units: [
      { unitId: "medieval.knight", team: 0, position: { x: -30, z: 0 } },
      { unitId: "tribal.chieftain", team: 1, position: { x: 30, z: 0 } },
    ],
    assertions: [
      { kind: "mode-is", value: "Simulation" },
      { kind: "position-shift-at-least", value: "medieval.knight>=10, tribal.chieftain>=10" },
    ],
  },
  adventure_congestion_escape: {
    name: "adventure_congestion_escape",
    description: "A crowded Adventure choke should repath and keep advancing instead of idling in a local jam.",
    mapId: "campaign.adventure",
    autoStart: true,
    advanceMs: 3200,
    units: [
      { unitId: "medieval.squire", team: 1, position: { x: 25.5, z: 18.5 } },
      { unitId: "farmer.farmer", team: 1, position: { x: 24.8, z: 20.2 } },
      { unitId: "ancient.hoplite", team: 1, position: { x: 25.7, z: 21.9 } },
      { unitId: "tribal.protector", team: 0, position: { x: 0, z: 20 } },
    ],
    assertions: [
      { kind: "mode-is", value: "Simulation" },
      { kind: "position-shift-at-least", value: "medieval.squire>=5.5, farmer.farmer>=5.5, ancient.hoplite>=5.5" },
    ],
  },
};

function buildGalleryUnits(
  unitIds: string[],
  options: {
    team?: number;
    columns?: number;
    centerX?: number;
    centerZ?: number;
    spacingX?: number;
    spacingZ?: number;
  } = {},
): ScenarioUnitSpec[] {
  const team = options.team ?? 0;
  const columns = Math.max(1, options.columns ?? 7);
  const centerX = options.centerX ?? 0;
  const centerZ = options.centerZ ?? 0;
  const spacingX = options.spacingX ?? 4.2;
  const spacingZ = options.spacingZ ?? 2.4;
  const rows = Math.ceil(unitIds.length / columns);

  return unitIds.map((unitId, index) => {
    const row = Math.floor(index / columns);
    const rowItems = Math.min(columns, unitIds.length - row * columns);
    const col = index % columns;
    return {
      unitId,
      team,
      position: {
        x: centerX + (row - (rows - 1) / 2) * spacingX,
        z: centerZ + (col - (rowItems - 1) / 2) * spacingZ,
      },
    };
  });
}

function makeGalleryScenario(
  name: string,
  description: string,
  unitIds: string[],
  options: {
    autoStart?: boolean;
    advanceMs?: number;
    columns?: number;
    centerX?: number;
    centerZ?: number;
    spacingX?: number;
    spacingZ?: number;
    extraUnits?: ScenarioUnitSpec[];
    focus?: string;
    galleryPresetId?: GalleryCameraPresetId;
    capturePhase?: ScenarioCapturePhase;
    captureAdvanceMs?: number;
    settleFrames?: number;
    hideUiDuringCapture?: boolean;
    artifactBaseName?: string;
    cameraOverride?: GalleryCameraOverride;
  } = {},
): ScenarioSpec {
  const units = [
    ...buildGalleryUnits(unitIds, options),
    ...(options.extraUnits ?? []),
  ];
  return {
    name,
    description,
    autoStart: options.autoStart ?? false,
    advanceMs: options.advanceMs,
    units,
    assertions: [
      { kind: "units-present", value: unitIds.join(",") },
      { kind: "mode-is", value: options.autoStart ? "Simulation" : "Placement" },
      { kind: "comparison-focus", value: options.focus ?? description },
    ],
    gallery: {
      presetId: options.galleryPresetId ?? "faction_lineup_close",
      capturePhase: options.capturePhase ?? (options.autoStart ? "simulation-mid" : "placement"),
      captureAdvanceMs: options.captureAdvanceMs ?? options.advanceMs,
      settleFrames: options.settleFrames ?? 2,
      hideUiDuringCapture: options.hideUiDuringCapture ?? true,
      artifactBaseName: options.artifactBaseName ?? name,
      cameraOverride: options.cameraOverride,
      reviewModes: ["default", "silhouette", "grayscale"],
      reviewOrder: ["default", "silhouette", "grayscale"],
    },
  };
}

function makeFactionGalleryScenario(
  name: string,
  faction: FactionId,
  description: string,
  options: {
    columns?: number;
    centerX?: number;
    centerZ?: number;
    spacingX?: number;
    spacingZ?: number;
  } = {},
): ScenarioSpec {
  const unitIds = getUnitsByFaction(faction).map((unit) => unit.id);
  return makeGalleryScenario(name, description, unitIds, {
    ...options,
    focus: `${description} Every ${FACTION_NAMES[faction]} unit should be distinguishable at lineup distance without falling back to a generic silhouette read.`,
  });
}

function makePairGalleryScenario(
  name: string,
  description: string,
  unitIds: [string, string],
  focus: string,
  options: {
    galleryPresetId?: GalleryCameraPresetId;
    spacingZ?: number;
    cameraOverride?: GalleryCameraOverride;
  } = {},
): ScenarioSpec {
  const pairCamera: GalleryCameraOverride = {
    alpha: -Math.PI / 2.72,
    beta: Math.PI / 3.72,
    radius: 13.5,
    target: { x: -0.2, y: 1.55, z: 0 },
    ...(options.cameraOverride ?? {}),
  };
  return makeGalleryScenario(name, description, unitIds, {
    columns: 2,
    centerX: -0.2,
    centerZ: 0,
    spacingX: 0,
    spacingZ: options.spacingZ ?? 4.2,
    galleryPresetId: options.galleryPresetId ?? "heroes_bosses_close",
    cameraOverride: pairCamera,
    focus,
  });
}

const GALLERY_SCENARIOS: Record<string, ScenarioSpec> = {
  gallery_faction_tribal: makeFactionGalleryScenario(
    "gallery_faction_tribal",
    FactionId.Tribal,
    "Close-read faction lineup for Tribal.",
  ),
  gallery_faction_farmer: makeFactionGalleryScenario(
    "gallery_faction_farmer",
    FactionId.Farmer,
    "Close-read faction lineup for Farmer.",
  ),
  gallery_faction_medieval: makeFactionGalleryScenario(
    "gallery_faction_medieval",
    FactionId.Medieval,
    "Close-read faction lineup for Medieval.",
  ),
  gallery_faction_ancient: makeFactionGalleryScenario(
    "gallery_faction_ancient",
    FactionId.Ancient,
    "Close-read faction lineup for Ancient.",
  ),
  gallery_faction_viking: makeFactionGalleryScenario(
    "gallery_faction_viking",
    FactionId.Viking,
    "Close-read faction lineup for Viking.",
  ),
  gallery_faction_dynasty: makeFactionGalleryScenario(
    "gallery_faction_dynasty",
    FactionId.Dynasty,
    "Close-read faction lineup for Dynasty.",
  ),
  gallery_faction_renaissance: makeFactionGalleryScenario(
    "gallery_faction_renaissance",
    FactionId.Renaissance,
    "Close-read faction lineup for Renaissance.",
  ),
  gallery_faction_pirate: makeFactionGalleryScenario(
    "gallery_faction_pirate",
    FactionId.Pirate,
    "Close-read faction lineup for Pirate.",
  ),
  gallery_faction_spooky: makeFactionGalleryScenario(
    "gallery_faction_spooky",
    FactionId.Spooky,
    "Close-read faction lineup for Spooky.",
  ),
  gallery_faction_wild_west: makeFactionGalleryScenario(
    "gallery_faction_wild_west",
    FactionId.WildWest,
    "Close-read faction lineup for Wild West.",
  ),
  gallery_faction_legacy: makeFactionGalleryScenario(
    "gallery_faction_legacy",
    FactionId.Legacy,
    "Close-read faction lineup for Legacy.",
    { columns: 6, spacingX: 4.6, spacingZ: 2.35 },
  ),
  gallery_faction_good: makeFactionGalleryScenario(
    "gallery_faction_good",
    FactionId.Good,
    "Close-read faction lineup for Good.",
  ),
  gallery_faction_evil: makeFactionGalleryScenario(
    "gallery_faction_evil",
    FactionId.Evil,
    "Close-read faction lineup for Evil.",
  ),
  gallery_faction_secret: makeFactionGalleryScenario(
    "gallery_faction_secret",
    FactionId.Secret,
    "Close-read faction lineup for Secret.",
    { columns: 8, spacingX: 4.8, spacingZ: 2.2 },
  ),
  gallery_iconic_heroes_bosses: makeGalleryScenario(
    "gallery_iconic_heroes_bosses",
    "Curated iconic heroes and bosses gallery.",
    [
      "ancient.zeus",
      "legacy.thor",
      "spooky.reaper",
      "wild_west.quick_draw",
      "good.chronomancer",
      "dynasty.monkey_king",
      "pirate.pirate_queen",
      "legacy.dark_peasant",
      "legacy.super_peasant",
      "evil.void_monarch",
    ],
    {
      columns: 5,
      spacingX: 5.0,
      spacingZ: 2.6,
      galleryPresetId: "heroes_bosses_close",
      focus: "Iconic heroes and bosses should each carry at least one unmistakable silhouette cue beyond color alone.",
    },
  ),
  gallery_war_machines_composites: makeGalleryScenario(
    "gallery_war_machines_composites",
    "Curated artillery, vehicle, and composite gallery.",
    [
      "medieval.catapult",
      "ancient.ballista",
      "dynasty.hwacha",
      "pirate.cannon",
      "renaissance.da_vinci_tank",
      "legacy.tank",
      "secret.bomb_cannon",
      "secret.gatling_gun",
      "secret.bank_robbers",
      "secret.wheelbarrow_dragon",
      "secret.clams",
      "good.sacred_elephant",
    ],
    {
      columns: 4,
      spacingX: 5.0,
      spacingZ: 2.8,
      galleryPresetId: "war_machine_wide_close",
      focus: "Vehicles and composites should read as intentional grouped silhouettes rather than duplicated humanoid stand-ins.",
    },
  ),
  gallery_giants_colossals: makeGalleryScenario(
    "gallery_giants_colossals",
    "Curated giants and colossal-unit gallery.",
    [
      "tribal.mammoth",
      "ancient.minotaur",
      "good.sacred_elephant",
      "legacy.dark_peasant",
      "legacy.super_peasant",
      "evil.void_monarch",
      "secret.tree_giant",
      "secret.ice_giant",
    ],
    {
      columns: 4,
      spacingX: 5.4,
      spacingZ: 3.0,
      galleryPresetId: "giants_wide_close",
      focus: "Large units should stay readable as distinct colossal silhouettes instead of oversized defaults.",
    },
  ),
  gallery_state_reads: makeGalleryScenario(
    "gallery_state_reads",
    "Attack and ability state-read validation gallery.",
    [
      "spooky.skeleton_archer",
      "wild_west.gunslinger",
      "legacy.wizard",
      "good.divine_arbiter",
      "evil.void_cultist",
      "spooky.swordcaster",
    ],
    {
      autoStart: true,
      advanceMs: 2200,
      captureAdvanceMs: 2200,
      capturePhase: "simulation-mid",
      columns: 6,
      centerX: -8.5,
      centerZ: 0,
      spacingX: 0,
      spacingZ: 2.8,
      galleryPresetId: "state_read_duel",
      cameraOverride: {
        target: { x: -1, y: 1.7, z: 0 },
      },
      extraUnits: [
        { unitId: "medieval.squire", team: 1, position: { x: 6.5, z: -7.0 } },
        { unitId: "medieval.squire", team: 1, position: { x: 6.5, z: -4.2 } },
        { unitId: "medieval.squire", team: 1, position: { x: 6.5, z: -1.4 } },
        { unitId: "medieval.squire", team: 1, position: { x: 6.5, z: 1.4 } },
        { unitId: "medieval.squire", team: 1, position: { x: 6.5, z: 4.2 } },
        { unitId: "medieval.squire", team: 1, position: { x: 6.5, z: 7.0 } },
      ],
      focus: "Attack/ability-state units should expose their firing, summoning, lightning, or spectral overlays in deterministic close combat.",
    },
  ),
  gallery_weapon_reads: makeGalleryScenario(
    "gallery_weapon_reads",
    "Representative weapon-family animation/readability gallery.",
    [
      "tribal.clubber",
      "medieval.squire",
      "ancient.sarissa",
      "tribal.spear_thrower",
      "pirate.bomb_thrower",
      "medieval.archer",
      "ancient.snake_archer",
      "viking.ice_archer",
      "spooky.skeleton_archer",
      "secret.chu_ko_nu",
      "renaissance.musketeer",
      "secret.artemis",
      "secret.ullr",
    ],
    {
      autoStart: true,
      advanceMs: 2400,
      captureAdvanceMs: 2400,
      capturePhase: "simulation-mid",
      columns: 7,
      centerX: -8.2,
      centerZ: 0,
      spacingX: 4.5,
      spacingZ: 2.5,
      galleryPresetId: "state_read_duel",
      artifactBaseName: "gallery_weapon_reads",
      cameraOverride: {
        alpha: -Math.PI / 2.3,
        beta: Math.PI / 3.22,
        radius: 24,
        target: { x: -0.6, y: 1.72, z: 0 },
      },
      extraUnits: buildGalleryUnits(
        [
          "medieval.squire",
          "medieval.squire",
          "medieval.squire",
          "medieval.squire",
          "medieval.squire",
          "medieval.squire",
          "medieval.squire",
          "medieval.squire",
          "medieval.squire",
          "medieval.squire",
          "medieval.squire",
          "medieval.squire",
          "medieval.squire",
        ],
        {
          team: 1,
          columns: 7,
          centerX: 6.8,
          centerZ: 0,
          spacingX: 4.5,
          spacingZ: 2.5,
        },
      ),
      focus: "Representative heavy-swing, slash, thrust, throw, bow, crossbow, and firearm users should all show weapon-correct attack reads in simulation-mid captures, including club-head-forward strikes and visible bow/crossbow draw-release states.",
    },
  ),
  gallery_team_color_blue_red_validation: {
    name: "gallery_team_color_blue_red_validation",
    description: "Mirrored Team A / Team B validation for blue-red ownership across humanoid, low-skin, and vehicle units.",
    autoStart: true,
    advanceMs: 2400,
    units: [
      { unitId: "medieval.archer", team: 0, position: { x: -12, z: -3.4 } },
      { unitId: "spooky.skeleton_archer", team: 0, position: { x: -10.5, z: 0 } },
      { unitId: "legacy.tank", team: 0, position: { x: -14.5, z: 4.2 } },
      { unitId: "medieval.archer", team: 1, position: { x: 12, z: -3.4 } },
      { unitId: "spooky.skeleton_archer", team: 1, position: { x: 10.5, z: 0 } },
      { unitId: "legacy.tank", team: 1, position: { x: 14.5, z: 4.2 } },
    ],
    assertions: [
      { kind: "units-present", value: "medieval.archer,spooky.skeleton_archer,legacy.tank" },
      { kind: "mode-is", value: "Simulation" },
      { kind: "comparison-focus", value: "Team A should read blue and Team B should read red while faction clothing remains recognizable, low-skin units use dominant blue/red body surfaces, vehicles show large team-colored surfaces, projectile ownership is blue/red, and health bars match team color." },
    ],
    gallery: {
      presetId: "state_read_duel",
      capturePhase: "simulation-mid",
      captureAdvanceMs: 1700,
      settleFrames: 3,
      hideUiDuringCapture: true,
      artifactBaseName: "gallery_team_color_blue_red_validation",
      cameraOverride: {
        alpha: -Math.PI / 2.15,
        beta: Math.PI / 3.28,
        radius: 22,
        target: { x: 0, y: 1.45, z: 0.3 },
      },
      reviewModes: ["default", "silhouette", "grayscale"],
      reviewOrder: ["default", "silhouette", "grayscale"],
    },
  },
  gallery_vehicle_close_reads: makeGalleryScenario(
    "gallery_vehicle_close_reads",
    "Close-read detail gallery for the heaviest vehicles and artillery.",
    [
      "dynasty.hwacha",
      "pirate.cannon",
      "renaissance.da_vinci_tank",
      "legacy.tank",
      "secret.bomb_cannon",
      "secret.gatling_gun",
      "good.sacred_elephant",
      "viking.longship",
      "legacy.chariot",
    ],
    {
      columns: 3,
      centerX: -0.8,
      spacingX: 4.8,
      spacingZ: 2.6,
      galleryPresetId: "vehicle_detail_close",
      cameraOverride: {
        target: { x: 0.4, y: 1.82, z: 0.1 },
        radius: 20,
      },
      focus: "Heavy units should each read as their own chassis family with visible crew, hull, or shrine cues instead of shared generic mass.",
    },
  ),
  gallery_exposed_crew_mounts: makeGalleryScenario(
    "gallery_exposed_crew_mounts",
    "Crew, rider, and mount readability gallery.",
    [
      "farmer.wheelbarrow",
      "renaissance.jouster",
      "wild_west.lasso",
      "legacy.chariot",
      "secret.cavalry",
      "secret.raptor_rider",
      "secret.bank_robbers",
      "secret.wheelbarrow_dragon",
    ],
    {
      columns: 3,
      centerX: -0.4,
      spacingX: 4.6,
      spacingZ: 2.7,
      galleryPresetId: "crew_mount_readability",
      cameraOverride: {
        target: { x: 0.2, y: 1.75, z: 0 },
        radius: 20,
      },
      focus: "Crew, riders, mounts, and carried structures must stay readable at gameplay distance rather than collapsing into a single blob.",
    },
  ),
  gallery_silhouette_heroes: makeGalleryScenario(
    "gallery_silhouette_heroes",
    "Silhouette-first hero lineup review.",
    [
      "ancient.zeus",
      "legacy.thor",
      "wild_west.quick_draw",
      "good.chronomancer",
      "good.divine_arbiter",
      "spooky.reaper",
      "legacy.dark_peasant",
      "legacy.super_peasant",
      "secret.vlad",
      "secret.blackbeard",
      "secret.shogun",
      "secret.artemis",
    ],
    {
      columns: 4,
      spacingX: 5.0,
      spacingZ: 2.8,
      galleryPresetId: "silhouette_lineup",
      focus: "Hero and boss silhouettes should remain identifiable when ornament and faction color are mentally ignored.",
    },
  ),
  gallery_pair_wild_west_gunslinger_vs_quick_draw: makePairGalleryScenario(
    "gallery_pair_wild_west_gunslinger_vs_quick_draw",
    "Pairwise hero comparison for Wild West sidearms.",
    ["wild_west.gunslinger", "wild_west.quick_draw"],
    "Gunslinger should read as a lean dual-pistol cowboy, while Quick Draw should read as the larger hero duelist with stronger smoke-and-hat silhouette.",
  ),
  gallery_pair_legacy_boxer_vs_super_boxer: makePairGalleryScenario(
    "gallery_pair_legacy_boxer_vs_super_boxer",
    "Pairwise hero comparison for Legacy boxing silhouettes.",
    ["legacy.boxer", "legacy.super_boxer"],
    "Boxer should stay squat and stripped-down, while Super Boxer should read as a larger golden champion with a clearly stronger torso-and-arms silhouette.",
  ),
  gallery_pair_good_chronomancer_vs_divine_arbiter: makePairGalleryScenario(
    "gallery_pair_good_chronomancer_vs_divine_arbiter",
    "Pairwise hero comparison for Good magic heroes.",
    ["good.chronomancer", "good.divine_arbiter"],
    "Chronomancer should read as a slimmer time mage with orbiting ring language, while Divine Arbiter should read as the taller thunder hero with heavier halo/lightning presence.",
  ),
  gallery_pair_secret_vlad_vs_blackbeard: makePairGalleryScenario(
    "gallery_pair_secret_vlad_vs_blackbeard",
    "Pairwise boss comparison for Secret pirate-vs-vampire bosses.",
    ["secret.vlad", "secret.blackbeard"],
    "Vlad should read as regal spear-and-collar nobility, while Blackbeard should read as a broader pirate captain with hat, pistol, and cutlass identity.",
  ),
  gallery_pair_secret_sensei_vs_shogun: makePairGalleryScenario(
    "gallery_pair_secret_sensei_vs_shogun",
    "Pairwise boss comparison for Secret Dynasty masters.",
    ["secret.sensei", "secret.shogun"],
    "Sensei should read as the lighter throwing-master in robes and hat, while Shogun should read as the heavier bannered samurai commander.",
  ),
  gallery_pair_secret_witch_vs_necromancer: makePairGalleryScenario(
    "gallery_pair_secret_witch_vs_necromancer",
    "Pairwise summoner comparison for Secret dark casters.",
    ["secret.witch", "secret.necromancer"],
    "Witch should read as the pointed-hat spectral summoner, while Necromancer should read as the bone-staff revival caster with a paler skeletal silhouette.",
  ),
  gallery_pair_ancient_zeus_vs_legacy_thor: makePairGalleryScenario(
    "gallery_pair_ancient_zeus_vs_legacy_thor",
    "Pairwise lightning hero comparison.",
    ["ancient.zeus", "legacy.thor"],
    "Zeus should stay laurel-and-bolt divine caster, while Thor should stay hammer-forward storm bruiser with a heavier northern silhouette.",
  ),
  gallery_pair_legacy_tank_vs_renaissance_da_vinci_tank: makePairGalleryScenario(
    "gallery_pair_legacy_tank_vs_renaissance_da_vinci_tank",
    "Pairwise tank silhouette comparison.",
    ["legacy.tank", "renaissance.da_vinci_tank"],
    "Legacy Tank should read as a heavy modern armored hull, while Da Vinci Tank should read as a squat enclosed renaissance dome.",
    {
      galleryPresetId: "vehicle_detail_close",
      spacingZ: 5.2,
      cameraOverride: {
        target: { x: 0.1, y: 1.52, z: 0 },
        radius: 15.5,
      },
    },
  ),
  gallery_pair_farmer_wheelbarrow_vs_secret_wheelbarrow_dragon: makePairGalleryScenario(
    "gallery_pair_farmer_wheelbarrow_vs_secret_wheelbarrow_dragon",
    "Pairwise wheelbarrow comparison.",
    ["farmer.wheelbarrow", "secret.wheelbarrow_dragon"],
    "Wheelbarrow should read as a simple peasant push-cart, while Wheelbarrow Dragon should read as the hybrid cart with dragon head and heavier fantasy silhouette.",
    { galleryPresetId: "crew_mount_readability", spacingZ: 5.2 },
  ),
  gallery_pair_pirate_captain_vs_secret_blackbeard: makePairGalleryScenario(
    "gallery_pair_pirate_captain_vs_secret_blackbeard",
    "Pairwise pirate captain comparison.",
    ["pirate.captain", "secret.blackbeard"],
    "Captain should stay the lean faction leader, while Blackbeard should read as the larger boss pirate with pistol-and-cutlass hero mass.",
  ),
  gallery_pair_spooky_vampire_vs_secret_vlad: makePairGalleryScenario(
    "gallery_pair_spooky_vampire_vs_secret_vlad",
    "Pairwise vampire comparison.",
    ["spooky.vampire", "secret.vlad"],
    "Vampire should read as a lighter bat-like leaper, while Vlad should read as the regal spear lord with noble collar and broader frame.",
  ),
  gallery_pair_dynasty_samurai_vs_secret_shogun: makePairGalleryScenario(
    "gallery_pair_dynasty_samurai_vs_secret_shogun",
    "Pairwise samurai comparison.",
    ["dynasty.samurai", "secret.shogun"],
    "Samurai should remain a disciplined troop silhouette, while Shogun should read as the larger bannered commander.",
  ),
  gallery_pair_renaissance_musketeer_vs_wild_west_deadeye: makePairGalleryScenario(
    "gallery_pair_renaissance_musketeer_vs_wild_west_deadeye",
    "Pairwise long-gun comparison.",
    ["renaissance.musketeer", "wild_west.deadeye"],
    "Musketeer should read as plume-and-uniform renaissance gunner, while Deadeye should read as the western rifle specialist in leather and cowboy hat.",
  ),
  gallery_pair_legacy_wizard_vs_good_divine_arbiter: makePairGalleryScenario(
    "gallery_pair_legacy_wizard_vs_good_divine_arbiter",
    "Pairwise ranged magic comparison.",
    ["legacy.wizard", "good.divine_arbiter"],
    "Wizard should read as a tall classic caster silhouette, while Divine Arbiter should read as the brighter halo-and-lightning hero.",
  ),
  gallery_pair_spooky_reaper_vs_evil_void_monarch: makePairGalleryScenario(
    "gallery_pair_spooky_reaper_vs_evil_void_monarch",
    "Pairwise dark boss comparison.",
    ["spooky.reaper", "evil.void_monarch"],
    "Reaper should read as the scythe-driven sweeping specter, while Void Monarch should read as the crowned void summoner with orbiting darkness.",
  ),
  gallery_pair_secret_artemis_vs_secret_ullr: makePairGalleryScenario(
    "gallery_pair_secret_artemis_vs_secret_ullr",
    "Pairwise elite archer comparison.",
    ["secret.artemis", "secret.ullr"],
    "Artemis should read as the radiant halo archer hero, while Ullr should read as the colder hunter with bow-and-axe identity.",
  ),
  gallery_pair_legacy_banner_bearer_vs_flag_bearer: makePairGalleryScenario(
    "gallery_pair_legacy_banner_bearer_vs_flag_bearer",
    "Pairwise Legacy banner comparison.",
    ["legacy.banner_bearer", "legacy.flag_bearer"],
    "Banner Bearer should stay the smaller support standard-bearer, while Flag Bearer should read as the larger empowered counterpart.",
  ),
};

Object.assign(SCENARIOS, GALLERY_SCENARIOS);

export function listScenarioNames(): string[] {
  return Object.keys(SCENARIOS);
}

export function getScenario(name: string): ScenarioSpec | undefined {
  return SCENARIOS[name];
}
