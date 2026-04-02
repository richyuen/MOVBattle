import { FACTION_NAMES, FactionId } from "../data/factionColors";
import { getUnitsByFaction } from "../data/unitDefinitions";
import type { GalleryCameraOverride, GalleryCameraPresetId } from "../ui/cameraController";

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
    | "position-shift-at-least"
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
    | "replay-restore";
  value: string;
}

export interface ScenarioAction {
  kind: "damage-linked-role";
  parentUnitId: string;
  role: string;
  damage: number;
}

export interface ScenarioSpec {
  name: string;
  description: string;
  autoStart?: boolean;
  advanceMs?: number;
  units: ScenarioUnitSpec[];
  assertions: ScenarioAssertion[];
  actions?: ScenarioAction[];
  gallery?: ScenarioGallerySpec;
}

export type ScenarioCapturePhase = "placement" | "simulation-mid" | "replay" | "post-reset";

export interface ScenarioGallerySpec {
  presetId: GalleryCameraPresetId;
  capturePhase: ScenarioCapturePhase;
  captureAdvanceMs?: number;
  settleFrames?: number;
  hideUiDuringCapture?: boolean;
  artifactBaseName?: string;
  cameraOverride?: GalleryCameraOverride;
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
      { kind: "linked-relation-count", value: "dynasty.hwacha:crew=2" },
      { kind: "emitter-owner", value: "legacy.tank:gunner, renaissance.da_vinci_tank:pilot, dynasty.hwacha:rocketeer" },
      { kind: "impact-owner", value: "legacy.tank:gunner, renaissance.da_vinci_tank:pilot, dynasty.hwacha:rocketeer" },
      { kind: "origin-source", value: "legacy.tank:attack=vehicle-socket+impact=vehicle-socket, renaissance.da_vinci_tank:attack=vehicle-socket+impact=vehicle-socket, dynasty.hwacha:attack=vehicle-socket+impact=vehicle-socket" },
      { kind: "no-duplicate-standins", value: "legacy.tank+renaissance.da_vinci_tank+dynasty.hwacha" },
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
};

Object.assign(SCENARIOS, GALLERY_SCENARIOS);

export function listScenarioNames(): string[] {
  return Object.keys(SCENARIOS);
}

export function getScenario(name: string): ScenarioSpec | undefined {
  return SCENARIOS[name];
}
