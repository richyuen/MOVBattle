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
    | "victory-semantics"
    | "emitter-owner"
    | "damage-owner"
    | "cleanup-policy"
    | "no-duplicate-standins";
  value: string;
}

export interface ScenarioSpec {
  name: string;
  description: string;
  autoStart?: boolean;
  advanceMs?: number;
  units: ScenarioUnitSpec[];
  assertions: ScenarioAssertion[];
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
      { kind: "victory-semantics", value: "secret.bomb_cannon crew should not count as separate victory actors." },
      { kind: "emitter-owner", value: "secret.bomb_cannon:gunner" },
      { kind: "damage-owner", value: "secret.bomb_cannon:gunner=parent,loader=parent" },
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
      { kind: "victory-semantics", value: "secret.gatling_gun crew should not count as separate victory actors." },
      { kind: "emitter-owner", value: "secret.gatling_gun:crank gunner" },
      { kind: "damage-owner", value: "secret.gatling_gun:crank gunner=parent,loader=parent" },
      { kind: "cleanup-policy", value: "secret.gatling_gun:all linked roles remove with parent" },
      { kind: "no-duplicate-standins", value: "secret.gatling_gun" },
      { kind: "units-present", value: "secret.gatling_gun" },
      { kind: "comparison-focus", value: "Text state should expose crank gunner and loader composition." },
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
      { kind: "emitter-owner", value: "secret.cavalry:parent impact via horse, secret.raptor_rider:parent impact via raptor" },
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
      { kind: "damage-owner", value: "secret.wheelbarrow_dragon:cart=parent,dragon head=parent" },
      { kind: "cleanup-policy", value: "secret.wheelbarrow_dragon:all linked roles remove with parent" },
      { kind: "no-duplicate-standins", value: "secret.wheelbarrow_dragon" },
      { kind: "comparison-focus", value: "Wheelbarrow Dragon should expose cart, driver, and dragon-head composition." },
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
      { kind: "emitter-owner", value: "secret.clams:parent only; summoned bomb divers remain separate spawned children" },
      { kind: "damage-owner", value: "secret.clams:clam shell=parent" },
      { kind: "cleanup-policy", value: "secret.clams:clam shell removes with parent, summons remain spawned children" },
      { kind: "no-duplicate-standins", value: "secret.clams" },
      { kind: "comparison-focus", value: "CLAMS should expose an anchored shell attachment that remains distinct from summoned bomb divers." },
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
    ],
  },
};

export function listScenarioNames(): string[] {
  return Object.keys(SCENARIOS);
}

export function getScenario(name: string): ScenarioSpec | undefined {
  return SCENARIOS[name];
}
