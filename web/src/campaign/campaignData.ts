import { ALL_UNITS } from "../data/unitDefinitions";
import type {
  CampaignDefinition,
  CampaignId,
  CampaignPlacementSpec,
  CampaignScenarioDefinition,
} from "./campaignTypes";
import { TABS_STAGES, type TabsStageDef } from "./stages";

// The 12 TABS campaigns, each a curated set of its real levels (web/src/campaign/stages/, one file per campaign; loop v10 stages phase).
const allUnitIds = ALL_UNITS.map((unit) => unit.id);

const CAMPAIGN_META: Array<{ id: CampaignId; displayName: string; description: string }> = [
  { id: "introduction", displayName: "The Introduction", description: "An introduction to the game: one faction at a time, fought with the faction before it." },
  { id: "adventure", displayName: "The Adventure", description: "Fun levels that need little strategy, against the five base factions." },
  { id: "challenge", displayName: "The Challenge", description: "Hard levels on a tight budget that need exact placement." },
  { id: "dynasty", displayName: "The Dynasty", description: "The Dynasty faction: first against it, then with it." },
  { id: "renaissance", displayName: "The Renaissance", description: "The Renaissance faction: first against it, then with it." },
  { id: "pirate", displayName: "The Pirate", description: "The Pirate faction on the beach." },
  { id: "spooky", displayName: "The Spooky", description: "The Spooky faction in the graveyard." },
  { id: "simulation", displayName: "The Simulation", description: "Puzzle battles on the plain simulation maps." },
  { id: "wild_west", displayName: "The Wild West", description: "The Wild West faction in the desert town." },
  { id: "legacy", displayName: "The Legacy", description: "The Legacy faction's old units." },
  { id: "fantasy_good", displayName: "The Fantasy Good", description: "The Good faction against the other factions." },
  { id: "fantasy_evil", displayName: "The Fantasy Evil", description: "The Evil faction against the other factions." },
];

/** Faction keys are the unit-id prefixes (`wild_west` for `wild_west.miner`). */
function allowedUnits(stage: TabsStageDef): string[] {
  const spec = stage.playerUnits;
  if (spec === "all") return allUnitIds;
  if ("units" in spec) return spec.units;
  return allUnitIds.filter((id) => spec.factions.some((key) => id.startsWith(`${key}.`)));
}

function toScenario(stage: TabsStageDef, index: number, count: number): CampaignScenarioDefinition {
  const last = index === count - 1;
  const placements: CampaignPlacementSpec[] = stage.enemy.map(([unitId, x, z, yaw]) => ({ unitId, team: 1, position: { x, z }, locked: true, ...(yaw ? { yaw } : {}) }));
  return {
    id: stage.id,
    displayName: stage.title,
    description: `TABS level ${stage.tabsLevel}: ${stage.title}.`,
    mapId: stage.mapId,
    ladderRole: index === 0 ? "opener" : last ? "finale" : "pressure",
    restrictions: { budget: stage.budget, allowedUnitIds: allowedUnits(stage) },
    placements,
    validationTier: index === 0 || last ? "core" : "smoke",
    smokeAdvanceMs: last ? 3200 : 2600,
    validationTags: last ? ["finale"] : undefined,
  };
}

export const CAMPAIGN_DEFINITIONS: CampaignDefinition[] = CAMPAIGN_META.map((meta) => {
  const stages = TABS_STAGES[meta.id];
  return { ...meta, scenarios: stages.map((stage, index) => toScenario(stage, index, stages.length)) };
});

export function validateCampaignDefinitionsStructure(): string[] {
  const failures: string[] = [];
  const scenarioIds = new Set<string>();

  for (const campaign of CAMPAIGN_DEFINITIONS) {
    if (campaign.scenarios.length < 4) {
      failures.push(`${campaign.id} expected at least 4 scenarios, got ${campaign.scenarios.length}`);
    }
    const coreCount = campaign.scenarios.filter((scenario) => scenario.validationTier === "core").length;
    if (coreCount < 2) {
      failures.push(`${campaign.id} expected at least 2 core scenarios, got ${coreCount}`);
    }
    for (const scenario of campaign.scenarios) {
      if (scenarioIds.has(scenario.id)) {
        failures.push(`Duplicate scenario id ${scenario.id}`);
      }
      scenarioIds.add(scenario.id);
      for (const placement of scenario.placements) {
        if (!allUnitIds.includes(placement.unitId)) failures.push(`${scenario.id} places unknown unit ${placement.unitId}`);
      }
    }
  }

  return failures;
}
