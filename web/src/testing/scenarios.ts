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
    | "health-bar-visible"
    | "health-bar-ratio-at-least"
    | "health-bar-ratio-at-most"
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
    | "impact-tier-at-least"
    | "impact-tier-at-most"
    | "impact-count-at-least"
    | "impact-path-count-at-least"
    | "impact-malformed-path-guard"
    | "battle-recap-present"
    | "battle-recap-survivors"
    | "battle-recap-target-path"
    | "result-detail-preserves-newlines"
    | "result-button-labels"
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
  health_bar_partial_damage_clubber: {
    name: "health_bar_partial_damage_clubber",
    description: "A damaged but living Clubber should keep a visible partially filled health bar.",
    autoStart: false,
    units: [
      { unitId: "tribal.clubber", team: 0, position: { x: 0, z: 0 } },
    ],
    actions: [
      { kind: "damage-root-unit", unitId: "tribal.clubber", damage: 22 },
    ],
    assertions: [
      { kind: "unit-hp-at-most", value: "tribal.clubber<=94" },
      { kind: "health-bar-visible", value: "tribal.clubber:true" },
      { kind: "health-bar-ratio-at-least", value: "tribal.clubber>=0.75" },
      { kind: "health-bar-ratio-at-most", value: "tribal.clubber<=0.85" },
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
    description: "Wheelbarrow charge pressure should force a readable forward topple on a nearby light defender.",
    autoStart: true,
    advanceMs: 1800,
    units: [
      { unitId: "farmer.wheelbarrow", team: 0, position: { x: -8.5, z: 0 } },
      { unitId: "tribal.clubber", team: 1, position: { x: 0.25, z: -0.35 } },
      { unitId: "farmer.halfling", team: 1, position: { x: 0.9, z: 0.5 } },
    ],
    assertions: [
      { kind: "mode-is", value: "Simulation" },
      { kind: "physics-state", value: "farmer.halfling:toppled|downed|recovering" },
      { kind: "topple-direction", value: "farmer.halfling:forward" },
      { kind: "unit-height-at-most", value: "farmer.halfling<=1.1" },
      { kind: "crowd-metric-at-least", value: "farmer.halfling:collisionPushPeak>=3.4+toppleForwardness>=0.24" },
      { kind: "position-shift-at-least", value: "tribal.clubber>=1.1, farmer.halfling>=0.6" },
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
      { kind: "physics-state", value: "farmer.farmer:airborne|recovering|toppled|downed, medieval.squire:airborne|recovering|toppled|downed" },
      { kind: "unit-height-at-most", value: "farmer.farmer<=1.2, medieval.squire<=1.1" },
      { kind: "crowd-metric-at-least", value: "farmer.farmer:collisionPushPeak>=3.4, medieval.squire:collisionPushPeak>=1.1, ancient.hoplite:collisionPushPeak>=0.4" },
      { kind: "position-shift-at-least", value: "farmer.farmer>=0.9, medieval.squire>=1.2, ancient.hoplite>=0.4" },
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
  battlefeel_impact_direct_clubber_hit: {
    name: "battlefeel_impact_direct_clubber_hit",
    description: "A real SimulationSystem light melee hit should record direct impact without overclassifying.",
    autoStart: true,
    advanceMs: 2600,
    units: [
      { unitId: "tribal.clubber", team: 0, position: { x: -1.2, z: 0 } },
      { unitId: "medieval.squire", team: 1, position: { x: 1.2, z: 0 } },
    ],
    assertions: [
      { kind: "mode-is", value: "Simulation" },
      { kind: "impact-path-count-at-least", value: "direct:any>=1" },
      { kind: "impact-tier-at-least", value: "medieval.squire:direct>=light" },
      { kind: "impact-tier-at-most", value: "medieval.squire:direct<=medium" },
    ],
  },
  battlefeel_impact_simulation_splash_primary_secondary: {
    name: "battlefeel_impact_simulation_splash_primary_secondary",
    description: "A real boss melee splash should classify primary and secondary SimulationSystem splash impacts.",
    autoStart: true,
    advanceMs: 1900,
    units: [
      { unitId: "tribal.chieftain", team: 0, position: { x: -1.5, z: 0 } },
      { unitId: "medieval.squire", team: 1, position: { x: 1.0, z: 0 } },
      { unitId: "farmer.farmer", team: 1, position: { x: 1.45, z: 0.75 } },
    ],
    assertions: [
      { kind: "mode-is", value: "Simulation" },
      { kind: "impact-path-count-at-least", value: "splash-primary:any>=1" },
      { kind: "impact-path-count-at-least", value: "splash-secondary:any>=1" },
      { kind: "impact-tier-at-least", value: "medieval.squire:splash-primary>=heavy" },
    ],
  },
  battlefeel_impact_projectile_direct_arrow: {
    name: "battlefeel_impact_projectile_direct_arrow",
    description: "A real arrow impact should be reported by ProjectileSystem as projectile-direct.",
    autoStart: true,
    advanceMs: 1800,
    units: [
      { unitId: "medieval.archer", team: 0, position: { x: -7.5, z: 0 } },
      { unitId: "tribal.clubber", team: 1, position: { x: 7.5, z: 0 } },
    ],
    assertions: [
      { kind: "mode-is", value: "Simulation" },
      { kind: "impact-path-count-at-least", value: "projectile-direct:any>=1" },
      { kind: "impact-tier-at-least", value: "tribal.clubber:projectile-direct>=light" },
    ],
  },
  battlefeel_impact_projectile_splash_legacy_tank_shell: {
    name: "battlefeel_impact_projectile_splash_legacy_tank_shell",
    description: "A Legacy Tank shell should cover ProjectileSystem splash branch with clustered enemies inside the 1.5m splash radius.",
    autoStart: true,
    advanceMs: 2600,
    units: [
      { unitId: "legacy.tank", team: 0, position: { x: -10, z: 0 } },
      { unitId: "medieval.squire", team: 1, position: { x: 8.6, z: 0 } },
      { unitId: "farmer.farmer", team: 1, position: { x: 9.0, z: 0.65 } },
      { unitId: "tribal.clubber", team: 1, position: { x: 9.0, z: -0.65 } },
    ],
    assertions: [
      { kind: "mode-is", value: "Simulation" },
      { kind: "impact-path-count-at-least", value: "projectile-splash:any>=1" },
      { kind: "impact-tier-at-least", value: "global:projectile-splash>=heavy" },
    ],
  },
  battle_recap_result_legacy_tank_shell: {
    name: "battle_recap_result_legacy_tank_shell",
    description: "A completed Legacy Tank battle should expose a deterministic Battle Recap in Result state.",
    autoStart: true,
    advanceMs: 12000,
    units: [
      { unitId: "legacy.tank", team: 0, position: { x: -10, z: 0 } },
      { unitId: "medieval.squire", team: 1, position: { x: 8.6, z: 0 } },
      { unitId: "farmer.farmer", team: 1, position: { x: 9.0, z: 0.65 } },
      { unitId: "tribal.clubber", team: 1, position: { x: 9.0, z: -0.65 } },
    ],
    assertions: [
      { kind: "mode-is", value: "Result" },
      { kind: "battle-recap-present", value: "true" },
      { kind: "battle-recap-survivors", value: "teamA=1,teamB=0" },
      { kind: "battle-recap-target-path", value: "global:projectile-splash>=heavy" },
      { kind: "result-detail-preserves-newlines", value: "true" },
      { kind: "result-button-labels", value: "primary=Continue,secondary=Reset" },
    ],
  },
  battlefeel_impact_heavy_charge: {
    name: "battlefeel_impact_heavy_charge",
    description: "A real charge collision should record crowd-shock impact events without harness damage.",
    autoStart: true,
    advanceMs: 1800,
    units: [
      { unitId: "farmer.wheelbarrow", team: 0, position: { x: -8.5, z: 0 } },
      { unitId: "tribal.clubber", team: 1, position: { x: 0.25, z: -0.35 } },
      { unitId: "farmer.halfling", team: 1, position: { x: 0.9, z: 0.5 } },
    ],
    assertions: [
      { kind: "mode-is", value: "Simulation" },
      { kind: "impact-path-count-at-least", value: "crowd-shock:any>=1" },
      { kind: "impact-tier-at-least", value: "global:crowd-shock>=crowdShock" },
    ],
  },
  battlefeel_impact_malformed_path_guard: {
    name: "battlefeel_impact_malformed_path_guard",
    description: "Parser guard: malformed impact paths must fail loudly instead of silently passing.",
    autoStart: false,
    advanceMs: 0,
    units: [
      { unitId: "tribal.clubber", team: 0, position: { x: -1, z: 0 } },
      { unitId: "medieval.squire", team: 1, position: { x: 1, z: 0 } },
    ],
    assertions: [
      { kind: "impact-malformed-path-guard", value: "global:not-a-real-path<=death" },
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

// The shield press of the capture script's shield_wall shots as a gallery scene, seen through the given camera.
function shieldWallGallery(name: string, description: string, cameraOverride: { alpha: number; beta: number; radius: number; target: { x: number; y: number; z: number } }, focus: string, advanceMs = 2650): ScenarioSpec {
  return makeGalleryScenario(
    name,
    description,
    ["ancient.hoplite", "ancient.hoplite", "ancient.hoplite", "ancient.hoplite", "ancient.hoplite", "ancient.hoplite", "ancient.hoplite", "ancient.hoplite"],
    {
      autoStart: true,
      advanceMs,
      captureAdvanceMs: advanceMs,
      capturePhase: "simulation-mid",
      columns: 8,
      centerX: -4,
      centerZ: 0,
      spacingX: 0,
      spacingZ: 0.8,
      galleryPresetId: "state_read_duel",
      cameraOverride,
      extraUnits: [
        { unitId: "medieval.squire", team: 0, position: { x: -5, z: -2.0 } },
        { unitId: "medieval.squire", team: 0, position: { x: -5, z: -1.2 } },
        { unitId: "medieval.squire", team: 0, position: { x: -5, z: -0.4 } },
        { unitId: "medieval.squire", team: 0, position: { x: -5, z: 0.4 } },
        { unitId: "medieval.squire", team: 0, position: { x: -5, z: 1.2 } },
        { unitId: "medieval.squire", team: 0, position: { x: -5, z: 2.0 } },
        { unitId: "tribal.protector", team: 1, position: { x: 4, z: -2.8 } },
        { unitId: "tribal.protector", team: 1, position: { x: 4, z: -2.0 } },
        { unitId: "tribal.protector", team: 1, position: { x: 4, z: -1.2 } },
        { unitId: "tribal.protector", team: 1, position: { x: 4, z: -0.4 } },
        { unitId: "tribal.protector", team: 1, position: { x: 4, z: 0.4 } },
        { unitId: "tribal.protector", team: 1, position: { x: 4, z: 1.2 } },
        { unitId: "tribal.protector", team: 1, position: { x: 4, z: 2.0 } },
        { unitId: "tribal.protector", team: 1, position: { x: 4, z: 2.8 } },
        { unitId: "tribal.protector", team: 1, position: { x: 5.3, z: -2.0 } },
        { unitId: "tribal.protector", team: 1, position: { x: 5.3, z: -1.2 } },
        { unitId: "tribal.protector", team: 1, position: { x: 5.3, z: -0.4 } },
        { unitId: "tribal.protector", team: 1, position: { x: 5.3, z: 0.4 } },
        { unitId: "tribal.protector", team: 1, position: { x: 5.3, z: 1.2 } },
        { unitId: "tribal.protector", team: 1, position: { x: 5.3, z: 2.0 } },
      ],
      focus,
    },
  );
}

/** Throwers in a column at x -3, a squire for each at `targetX` (inside every thrower's engage range), the camera side-on from the arm side with room ahead of the hand for the missile. */
function throwGallery(name: string, description: string, unitIds: string[], targetX: number, focus: string, view: { alpha?: number; spacingZ?: number; radius?: number } = {}): ScenarioSpec {
  const spacingZ = view.spacingZ ?? 1.7;
  return makeGalleryScenario(name, description, unitIds, {
    autoStart: true,
    advanceMs: 0,
    captureAdvanceMs: 0,
    capturePhase: "simulation-mid",
    columns: unitIds.length,
    centerX: -3,
    centerZ: 0,
    spacingX: 0,
    spacingZ,
    galleryPresetId: "state_read_duel",
    cameraOverride: {
      alpha: view.alpha ?? Math.PI / 2 - 0.35,
      beta: Math.PI / 2.05,
      // Aimed a head above the throwers: a bomb's arc is already 2 m up 150 ms after the hand
      radius: view.radius ?? 6.5,
      target: { x: -1.8, y: 1.8, z: 0.3 },
    },
    extraUnits: unitIds.map((_, i) => ({ unitId: "medieval.squire", team: 1, position: { x: targetX, z: (i - (unitIds.length - 1) / 2) * spacingZ } })),
    focus,
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
    cameraOverride?: GalleryCameraOverride;
    // extra metres of room beside the rank's last unit (a machine wider than a man's slot)
    lastApart?: number;
  } = {},
): ScenarioSpec {
  const unitIds = getUnitsByFaction(faction).map((unit) => unit.id);
  // Eye level from the front, one rank wide where the faction fits, so the group fills the frame under a sky third
  const singleRank = unitIds.length <= 9;
  const spec = makeGalleryScenario(name, description, unitIds, {
    columns: singleRank ? unitIds.length : undefined,
    spacingZ: 1.8, // shoulder room only: at the gallery default of 2.4 a seven-unit rank filled the width before the men filled a tenth of the height
    cameraOverride: {
      alpha: -0.2,
      beta: Math.PI / 2.15,
      radius: singleRank ? 10.5 : 13,
      target: { x: 0, y: 1.3, z: 0 },
    },
    ...options,
    focus: `${description} Every ${FACTION_NAMES[faction]} unit should be distinguishable at lineup distance without falling back to a generic silhouette read.`,
  });
  const last = spec.units[unitIds.length - 1];
  if (options.lastApart && last) last.position = { ...last.position, z: last.position.z + options.lastApart };
  return spec;
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
  // Eye level and close, from the three-quarter side, so each stance shows its forward lean and bent knees
  const pairCamera: GalleryCameraOverride = {
    alpha: -0.8,
    beta: Math.PI / 2.2,
    radius: 5.5,
    target: { x: -0.2, y: 1.1, z: 0 },
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
    // The da Vinci tank is wider than a man's shoulder room: at 1.8 m it stood behind the jouster's horse, cut at the frame's edge; the rank is opened out
    // and the camera drawn back so the whole tank stands beside the men
    // At TABS scale (338, DAVINCI_SCALE 2.3) the tank is some 7.5 m across its cannons: it stands lastApart further out and the camera takes in both
    { spacingZ: 2.7, lastApart: 3.0, cameraOverride: { alpha: -0.2, beta: Math.PI / 2.15, radius: 20, target: { x: 0, y: 1.9, z: 1.9 } } },
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
  // The secret lineup's front rank runs out of frame past the shogun, so its giants get their own eye-level rank
  gallery_secret_giants: makeGalleryScenario(
    "gallery_secret_giants",
    "Secret giants lineup at eye level.",
    ["secret.skeleton_giant", "secret.samurai_giant", "secret.tree_giant", "secret.ice_giant"],
    {
      columns: 4,
      spacingZ: 4.4,
      cameraOverride: { alpha: -0.2, beta: Math.PI / 2.15, radius: 13.5, target: { x: 0, y: 2.2, z: 0 } },
      focus: "Each secret giant should read as its own character (bones, samurai, woodsman with a tree, ice) at lineup distance.",
    },
  ),
  // The good lineup crops the sacred elephant at its back: its trappings, throne and rider are read here, three-quarter front and a little above
  gallery_sacred_elephant: makeGalleryScenario(
    "gallery_sacred_elephant",
    "Sacred elephant at three-quarter view.",
    ["good.sacred_elephant"],
    {
      columns: 1,
      cameraOverride: { alpha: -0.75, beta: Math.PI / 2.6, radius: 15, target: { x: 0, y: 3.2, z: 0 } },
      focus: "The sacred elephant should read as a white elephant in gold trappings with a blanket, a throne and an archer riding it.",
    },
  ),
  // The legacy lineup buries the chariot in its back ranks and shows it end-on: horse, wheels, car and driver are read here, three-quarter side and a little above
  gallery_legacy_chariot: makeGalleryScenario(
    "gallery_legacy_chariot",
    "Legacy chariot at three-quarter view.",
    ["legacy.chariot"],
    {
      columns: 1,
      cameraOverride: { alpha: -0.55, beta: Math.PI / 2.3, radius: 6.5, target: { x: 0, y: 1.1, z: 0 } },
      focus: "The chariot should read as a horse drawing a two-wheeled car on shafts, with a driver standing in the car.",
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
      // Eye-level battle camera inside the clash: horizon mid-frame, nearest units cut off at the feet
      cameraOverride: {
        alpha: -Math.PI / 3.4,
        beta: Math.PI / 2.02,
        radius: 6.5,
        target: { x: -3, y: 1.4, z: 0 },
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
        alpha: -Math.PI / 3.4,
        beta: Math.PI / 2.02,
        radius: 6.5,
        target: { x: -3.5, y: 1.4, z: 0 },
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
  // Loop evidence: the shield press of the capture script's shield_wall shots, seen from the flank so trunk pitch, drive legs and the pitch of the spears can be read.
  gallery_shield_wall_side: shieldWallGallery(
    "gallery_shield_wall_side",
    "Two shield lines in contact, seen side-on from the flank.",
    {
      alpha: -Math.PI / 2 + 0.3,
      beta: Math.PI / 2.06,
      radius: 4.6,
      target: { x: 0, y: 1.05, z: -2.4 },
    },
    "Each man in the press should carry his own trunk pitch, drive leg and head set, and no spear should pass through a man of its own side.",
  ),
  // Loop evidence: red's wall closing, before contact, from the gap between the lines: three-quarter on to the front boards, so they read face-on as a line.
  gallery_shield_wall_front: shieldWallGallery(
    "gallery_shield_wall_front",
    "Two shield lines closing, red's wall seen three-quarter on from the front.",
    {
      alpha: Math.PI + 0.55,
      beta: 1.32,
      radius: 6.5,
      target: { x: 3.4, y: 0.7, z: 0.4 },
    },
    "Red's front boards should lap rim over rim into one surface along the wall.",
    800,
  ),
  // Loop evidence: a rank of clubbers in the press against a hoplite wall, seen side-on down the line of contact, so a blow is framed on the man it lands on.
  gallery_press_clubbers: makeGalleryScenario(
    "gallery_press_clubbers",
    "Clubbers in contact with a hoplite wall, side-on.",
    ["tribal.clubber", "tribal.clubber", "tribal.clubber", "tribal.clubber", "tribal.clubber"],
    {
      autoStart: true,
      advanceMs: 2200,
      captureAdvanceMs: 2200,
      capturePhase: "simulation-mid",
      columns: 5,
      centerX: -2.5,
      centerZ: 0,
      spacingX: 0,
      spacingZ: 0.9,
      galleryPresetId: "state_read_duel",
      cameraOverride: {
        alpha: -Math.PI / 2 - 0.2,
        beta: Math.PI / 2.08,
        radius: 4.4,
        target: { x: 0, y: 1.1, z: -1.4 },
      },
      extraUnits: [-1.8, -0.9, 0, 0.9, 1.8].map((z) => ({ unitId: "ancient.hoplite", team: 1, position: { x: 2.5, z } })),
      focus: "A clubber's blow should come down on the head of the man in front of him, who ducks under it.",
    },
  ),
  // Loop evidence: a divine arbiter's lightning strike on a packed squire block, framed on the block so the spell's area dome stands whole in the shot.
  gallery_spell_dome: makeGalleryScenario(
    "gallery_spell_dome",
    "A lightning strike's area dome over the men it hits.",
    ["good.divine_arbiter"],
    {
      autoStart: true,
      advanceMs: 900,
      captureAdvanceMs: 900,
      capturePhase: "simulation-mid",
      columns: 1,
      centerX: -9,
      centerZ: 0,
      galleryPresetId: "state_read_duel",
      cameraOverride: {
        alpha: -Math.PI / 2 - 0.35,
        beta: 1.38,
        radius: 11,
        target: { x: 2, y: 1.2, z: 0 },
      },
      extraUnits: [-1, 0, 1].flatMap((z) => [1.6, 2.4].map((x) => ({ unitId: "medieval.squire", team: 1, position: { x, z } }))),
      focus: "A magic strike's area should read as one whole solid one-colour dome over the men it hits.",
    },
  ),
  // Loop evidence: bowmen at the loose, seen side-on.
  gallery_archer_loose: makeGalleryScenario(
    "gallery_archer_loose",
    "Bowmen shooting, seen side-on from the flank.",
    ["medieval.archer", "medieval.archer", "medieval.archer"],
    {
      autoStart: true,
      advanceMs: 1500,
      captureAdvanceMs: 1500,
      capturePhase: "simulation-mid",
      columns: 3,
      centerX: -3,
      centerZ: 0,
      spacingX: 0,
      spacingZ: 1.7,
      galleryPresetId: "state_read_duel",
      cameraOverride: {
        // From the side the bowmen's chests are turned to: the string hand shows
        alpha: Math.PI / 2 - 0.35,
        beta: Math.PI / 2.05,
        radius: 5.2,
        target: { x: -2.6, y: 1.25, z: 0.6 },
      },
      extraUnits: [
        { unitId: "medieval.squire", team: 1, position: { x: 9, z: -1.7 } },
        { unitId: "medieval.squire", team: 1, position: { x: 9, z: 0 } },
        { unitId: "medieval.squire", team: 1, position: { x: 9, z: 1.7 } },
      ],
      focus: "A bowman at the loose stands side-on with the bow stood up at the end of a level arm and the string hand at the cheek.",
    },
  ),
  // Loop evidence (vfx tier 3, throw_<unit>): throwers seen side-on at the release. The capture script steps the sim until the first missile exists and shoots
  // that frame and 150 ms on, so what left the hand can be read against what was in it. Each group shares one engage range so its men throw on the same beat.
  gallery_throw_spears: throwGallery(
    "gallery_throw_spears",
    "A spear thrower and a harpooner at the release, side-on.",
    ["tribal.spear_thrower", "pirate.harpooner"],
    8,
    "The spear that flies is the javelin he held, leaving his hand at the end of the arm's swing; the harpoon leaves the harpooner's gun on its line.",
  ),
  gallery_throw_bombs: throwGallery(
    "gallery_throw_bombs",
    "A stoner, a bomb thrower and a dynamite thrower at the release, side-on.",
    ["tribal.stoner", "pirate.bomb_thrower", "wild_west.dynamite_thrower"],
    6,
    "The boulder, bomb and dynamite stick in flight are the ones that were in the hands a frame before, and those hands are empty after.",
  ),
  gallery_throw_casters: throwGallery(
    "gallery_throw_casters",
    "A bone mage, a wizard and a swordcaster casting, side-on.",
    ["tribal.bone_mage", "legacy.wizard", "spooky.swordcaster"],
    8,
    "A caster keeps his staff; what flies is his own missile (leaves, a fireball, a sword), not a crossbow bolt.",
    // Spread and seen further round from the front, so the bone mage's raised staff is not hidden behind the wizard's hat
    { alpha: Math.PI / 2 - 0.7, spacingZ: 2.4, radius: 7.5 },
  ),
  gallery_team_color_blue_red_validation: {
    name: "gallery_team_color_blue_red_validation",
    description: "Mirrored Team A / Team B validation for red-blue ownership across humanoid, low-skin, and vehicle units.",
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
      { kind: "comparison-focus", value: "Team A should read red and Team B should read blue while faction clothing remains recognizable, low-skin units use dominant blue/red body surfaces, vehicles show large team-colored surfaces, projectile ownership is blue/red, and health bars match team color." },
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
