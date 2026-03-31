export interface ScenarioUnitSpec {
  unitId: string;
  team: number;
  position: { x: number; y?: number; z: number };
}

export interface ScenarioAssertion {
  kind: "units-present" | "mode-is" | "comparison-focus";
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
      { kind: "comparison-focus", value: "Wheelbarrow Dragon should expose cart, driver, and dragon-head composition." },
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
