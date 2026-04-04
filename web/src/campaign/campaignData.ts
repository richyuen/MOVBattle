import { ALL_UNITS, getUnitsByFaction } from "../data/unitDefinitions";
import { FactionId } from "../data/factionColors";
import type { BattleMapId } from "../map/mapBuilder";
import type {
  CampaignDefinition,
  CampaignId,
  CampaignPlacementSpec,
  CampaignScenarioDefinition,
} from "./campaignTypes";

const allUnitIds = ALL_UNITS.map((unit) => unit.id);

type PlacementTuple = readonly [unitId: string, x: number, z: number];
type ValidationTag = "hazard" | "gimmick" | "finale";

interface CampaignSeed {
  id: CampaignId;
  displayName: string;
  description: string;
  baseBudget: number;
  allowedUnitIds: string[];
  baseScenario: {
    id: string;
    displayName: string;
    description: string;
    placements: CampaignPlacementSpec[];
  };
  finaleExtras?: PlacementTuple[];
}

function unitsOf(...factions: FactionId[]): string[] {
  return factions.flatMap((faction) => getUnitsByFaction(faction).map((unit) => unit.id));
}

function placements(team: 0 | 1, specs: readonly PlacementTuple[], locked = true): CampaignPlacementSpec[] {
  return specs.map(([unitId, x, z]) => ({ unitId, team, position: { x, z }, locked }));
}

function mapId(campaignId: CampaignId): BattleMapId {
  return `campaign.${campaignId}` as BattleMapId;
}

function scaleBudget(base: number, factor: number): number {
  return Math.max(400, Math.round((base * factor) / 50) * 50);
}

function clonePlacements(specs: readonly CampaignPlacementSpec[]): CampaignPlacementSpec[] {
  return specs.map((placement) => ({
    unitId: placement.unitId,
    team: placement.team,
    locked: placement.locked,
    position: { ...placement.position },
  }));
}

function takePlacements(specs: readonly CampaignPlacementSpec[], count: number): CampaignPlacementSpec[] {
  return clonePlacements(specs.slice(0, Math.max(1, Math.min(specs.length, count))));
}

function widenPlacements(specs: readonly CampaignPlacementSpec[], zPush = 2.5): CampaignPlacementSpec[] {
  return specs.map((placement, index) => ({
    ...placement,
    position: {
      ...placement.position,
      z: placement.position.z + (index % 2 === 0 ? -zPush : zPush),
    },
  }));
}

function routePlacementsAroundCentralHazard(
  specs: readonly CampaignPlacementSpec[],
  safeBand = 18,
): CampaignPlacementSpec[] {
  return specs.map((placement, index) => {
    const currentZ = placement.position.z;
    const sign = Math.abs(currentZ) > 0.5 ? Math.sign(currentZ) : (index % 2 === 0 ? -1 : 1);
    return {
      ...placement,
      position: {
        ...placement.position,
        z: sign * Math.max(safeBand, Math.abs(currentZ)),
      },
    };
  });
}

function clampPlacementsToCentralLane(
  specs: readonly CampaignPlacementSpec[],
  safeLimit = 8,
): CampaignPlacementSpec[] {
  return specs.map((placement, index) => ({
    ...placement,
    position: {
      ...placement.position,
      z: Math.max(
        -safeLimit,
        Math.min(
          safeLimit,
          placement.position.z * 0.45 + (index % 2 === 0 ? -2 : 2),
        ),
      ),
    },
  }));
}

function routePlacementsToPositiveBank(
  specs: readonly CampaignPlacementSpec[],
  startBand = 8,
): CampaignPlacementSpec[] {
  return specs.map((placement, index) => ({
    ...placement,
    position: {
      ...placement.position,
      z: startBand + (index % 3) * 4,
    },
  }));
}

function routePlacementsAwayFromLowerHazard(
  specs: readonly CampaignPlacementSpec[],
  lowerSafeBand = -12,
): CampaignPlacementSpec[] {
  return specs.map((placement, index) => ({
    ...placement,
    position: {
      ...placement.position,
      z: placement.position.z < 0
        ? Math.max(lowerSafeBand, placement.position.z - 2)
        : placement.position.z + (index % 2 === 0 ? 2 : 4),
    },
  }));
}

function hazardPlacementsForCampaign(
  campaignId: CampaignId,
  specs: readonly CampaignPlacementSpec[],
): CampaignPlacementSpec[] {
  switch (campaignId) {
    case "adventure":
    case "dynasty":
      return routePlacementsAroundCentralHazard(specs, 18);
    case "challenge":
    case "pirate":
    case "fantasy_good":
      return clampPlacementsToCentralLane(specs, 8);
    case "renaissance":
      return routePlacementsToPositiveBank(specs, 8);
    case "spooky":
      return routePlacementsAwayFromLowerHazard(specs, -12);
    default:
      return clonePlacements(specs);
  }
}

function appendPlacements(specs: readonly CampaignPlacementSpec[], extra: readonly PlacementTuple[] = []): CampaignPlacementSpec[] {
  return [
    ...clonePlacements(specs),
    ...placements(1, extra),
  ];
}

function hasHazardCampaign(campaignId: CampaignId): boolean {
  return new Set<CampaignId>([
    "adventure",
    "challenge",
    "dynasty",
    "renaissance",
    "pirate",
    "spooky",
    "simulation",
    "fantasy_good",
    "fantasy_evil",
  ]).has(campaignId);
}

function makeScenario(
  campaignId: CampaignId,
  seed: CampaignSeed,
  definition: {
    id: string;
    displayName: string;
    description: string;
    ladderRole: CampaignScenarioDefinition["ladderRole"];
    budget: number;
    placements: CampaignPlacementSpec[];
    validationTags?: ValidationTag[];
  },
): CampaignScenarioDefinition {
  return {
    id: definition.id,
    displayName: definition.displayName,
    description: definition.description,
    mapId: mapId(campaignId),
    ladderRole: definition.ladderRole,
    restrictions: {
      budget: definition.budget,
      allowedUnitIds: seed.allowedUnitIds,
    },
    placements: definition.placements,
    validationTier: definition.ladderRole === "opener" || definition.ladderRole === "finale" || definition.validationTags?.includes("hazard")
      ? "core"
      : "smoke",
    smokeAdvanceMs: definition.ladderRole === "finale"
      ? 3200
      : definition.ladderRole === "gimmick"
        ? 2600
        : 2200,
    validationTags: definition.validationTags,
  };
}

function buildScenarioLadder(seed: CampaignSeed): CampaignScenarioDefinition[] {
  const basePlacements = seed.baseScenario.placements;
  const openerCount = Math.max(3, Math.ceil(basePlacements.length * 0.45));
  const pressureCount = Math.max(4, Math.ceil(basePlacements.length * 0.7));
  const hazard = hasHazardCampaign(seed.id);

  const opener = makeScenario(seed.id, seed, {
    id: `${seed.id}_opening_clash`,
    displayName: "Opening Clash",
    description: `${seed.displayName} opener with a lighter enemy line and clear lane pressure.`,
    ladderRole: "opener",
    budget: scaleBudget(seed.baseBudget, 0.45),
    placements: takePlacements(basePlacements, openerCount),
  });

  const pressure = makeScenario(seed.id, seed, {
    id: `${seed.id}_formation_pressure`,
    displayName: "Formation Pressure",
    description: `${seed.displayName} escalates with a broader enemy formation and more ranged support.`,
    ladderRole: "pressure",
    budget: scaleBudget(seed.baseBudget, 0.65),
    placements: takePlacements(basePlacements, pressureCount),
  });

  const gimmick = makeScenario(seed.id, seed, {
    id: `${seed.id}_${hazard ? "hazard" : "terrain"}_pressure`,
    displayName: hazard ? "Hazard Pressure" : "Terrain Pressure",
    description: hazard
      ? `${seed.displayName} uses the campaign map's hazard layout as a meaningful constraint.`
      : `${seed.displayName} widens the formation to pressure terrain and flanks.`,
    ladderRole: "gimmick",
    budget: scaleBudget(seed.baseBudget, 0.85),
    placements: hazard
      ? hazardPlacementsForCampaign(seed.id, basePlacements)
      : widenPlacements(basePlacements, 2.5),
    validationTags: (hazard ? ["hazard", "gimmick"] : ["gimmick"]) as ValidationTag[],
  });

  const elite = makeScenario(seed.id, seed, {
    id: seed.baseScenario.id,
    displayName: seed.baseScenario.displayName,
    description: seed.baseScenario.description,
    ladderRole: "elite",
    budget: seed.baseBudget,
    placements: clonePlacements(basePlacements),
  });

  const finale = makeScenario(seed.id, seed, {
    id: `${seed.id}_final_stand`,
    displayName: "Final Stand",
    description: `${seed.displayName} finale with reinforced elite pressure and the campaign's full battle identity online.`,
    ladderRole: "finale",
    budget: scaleBudget(seed.baseBudget, 1.2),
    placements: appendPlacements(basePlacements, seed.finaleExtras),
    validationTags: ["finale", ...(hazard ? ["hazard"] : [])] as ValidationTag[],
  });

  return [opener, pressure, gimmick, elite, finale];
}

const CAMPAIGN_SEEDS: CampaignSeed[] = [
  {
    id: "introduction",
    displayName: "The Introduction",
    description: "A simple opening battle that teaches basic placement against a small melee line.",
    baseBudget: 700,
    allowedUnitIds: unitsOf(FactionId.Tribal),
    baseScenario: {
      id: "the_start",
      displayName: "The Start",
      description: "An easy opener with straightforward enemy lanes.",
      placements: placements(1, [
        ["farmer.halfling", 10, -5],
        ["farmer.halfling", 12, -2.5],
        ["farmer.farmer", 14, 0],
        ["farmer.hay_baler", 16, 3],
        ["farmer.potion_seller", 18, -1],
      ]),
    },
    finaleExtras: [["farmer.scarecrow", 24, 0]],
  },
  {
    id: "adventure",
    displayName: "The Adventure",
    description: "A broader combined-arms skirmish that throws mixed tribal enemies at the player.",
    baseBudget: 2600,
    allowedUnitIds: unitsOf(FactionId.Tribal, FactionId.Farmer, FactionId.Medieval, FactionId.Ancient, FactionId.Viking),
    baseScenario: {
      id: "tree_tribe",
      displayName: "Tree Tribe",
      description: "A large tribal force dug into a forested approach.",
      placements: placements(1, [
        ["tribal.clubber", 32, -18],
        ["tribal.clubber", 32, 14],
        ["tribal.protector", 36, -14],
        ["tribal.protector", 36, 18],
        ["tribal.spear_thrower", 42, -22],
        ["tribal.spear_thrower", 42, -16],
        ["tribal.spear_thrower", 42, 16],
        ["tribal.stoner", 48, -18],
        ["tribal.bone_mage", 50, 18],
        ["tribal.chieftain", 54, 14],
      ]),
    },
    finaleExtras: [["tribal.mammoth", 58, -2]],
  },
  {
    id: "challenge",
    displayName: "The Challenge",
    description: "A tight-budget puzzle battle with a stronger enemy front.",
    baseBudget: 1200,
    allowedUnitIds: allUnitIds,
    baseScenario: {
      id: "bridge_too_far",
      displayName: "Bridge Too Far",
      description: "A narrow approach with an expensive enemy centerline.",
      placements: placements(1, [
        ["medieval.knight", 14, -4],
        ["medieval.knight", 14, 4],
        ["medieval.healer", 17, 0],
        ["medieval.archer", 22, -5],
        ["medieval.archer", 22, 0],
        ["medieval.archer", 22, 5],
        ["medieval.catapult", 28, 0],
      ]),
    },
    finaleExtras: [["medieval.king", 34, 0]],
  },
  {
    id: "dynasty",
    displayName: "The Dynasty",
    description: "A red-lacquered battlefield built around disciplined ranged pressure and a hero anchor.",
    baseBudget: 2400,
    allowedUnitIds: unitsOf(FactionId.Dynasty, FactionId.Secret),
    baseScenario: {
      id: "dynasty_duel",
      displayName: "Dynasty Duel",
      description: "Dynasty infantry and fireworks protect a Monkey King finale.",
      placements: placements(1, [
        ["dynasty.samurai", 13, -6],
        ["dynasty.samurai", 13, 0],
        ["dynasty.samurai", 13, 6],
        ["dynasty.firework_archer", 18, -5],
        ["dynasty.firework_archer", 18, 5],
        ["dynasty.ninja", 20, 0],
        ["dynasty.hwacha", 26, -2],
        ["dynasty.monkey_king", 30, 3],
      ]),
    },
    finaleExtras: [["dynasty.dragon", 34, -4]],
  },
  {
    id: "renaissance",
    displayName: "The Renaissance",
    description: "A ranged duel across a formal plaza with cavalry and gunpowder support.",
    baseBudget: 2600,
    allowedUnitIds: unitsOf(FactionId.Renaissance, FactionId.Secret),
    baseScenario: {
      id: "rising_sun_duel",
      displayName: "Rising Sun Duel",
      description: "Renaissance firepower guarded by a Da Vinci Tank.",
      placements: placements(1, [
        ["renaissance.fencer", 14, -4],
        ["renaissance.halberd", 15, 3],
        ["renaissance.musketeer", 20, -6],
        ["renaissance.musketeer", 20, 0],
        ["renaissance.musketeer", 20, 6],
        ["renaissance.balloon_archer", 23, -2],
        ["renaissance.jouster", 26, 5],
        ["renaissance.da_vinci_tank", 30, 0],
      ]),
    },
    finaleExtras: [["renaissance.jouster", 34, -6]],
  },
  {
    id: "pirate",
    displayName: "The Pirate",
    description: "A shoreline ambush with cannon pressure and a Pirate Queen finisher.",
    baseBudget: 2500,
    allowedUnitIds: unitsOf(FactionId.Pirate),
    baseScenario: {
      id: "black_flag_bay",
      displayName: "Black Flag Bay",
      description: "Close-range pirates backed by artillery on a beach approach.",
      placements: placements(1, [
        ["pirate.flintlock", 14, -7],
        ["pirate.blunderbuss", 15, -2],
        ["pirate.harpooner", 16, 4],
        ["pirate.bomb_thrower", 18, 0],
        ["pirate.flintlock", 20, 7],
        ["pirate.cannon", 26, -1],
        ["pirate.captain", 23, 5],
        ["pirate.pirate_queen", 31, 2],
      ]),
    },
    finaleExtras: [["pirate.cannon", 34, -6]],
  },
  {
    id: "spooky",
    displayName: "The Spooky",
    description: "A graveyard brawl with undead ranks, siege pumpkins, and the Reaper.",
    baseBudget: 2700,
    allowedUnitIds: unitsOf(FactionId.Spooky),
    baseScenario: {
      id: "midnight_harvest",
      displayName: "Midnight Harvest",
      description: "An undead line with siege and fear support.",
      placements: placements(1, [
        ["spooky.skeleton_warrior", 12, -7],
        ["spooky.skeleton_warrior", 12, -2],
        ["spooky.skeleton_warrior", 12, 3],
        ["spooky.skeleton_archer", 18, -6],
        ["spooky.skeleton_archer", 18, 6],
        ["spooky.candlehead", 20, 0],
        ["spooky.vampire", 22, 4],
        ["spooky.pumpkin_catapult", 28, -2],
        ["spooky.reaper", 31, 1],
      ]),
    },
    finaleExtras: [["spooky.vampire", 34, -5]],
  },
  {
    id: "simulation",
    displayName: "The Simulation",
    description: "A neon arena for mixed-tech and legacy-style experimental battles.",
    baseBudget: 3200,
    allowedUnitIds: allUnitIds,
    baseScenario: {
      id: "simulation_core",
      displayName: "Simulation Core",
      description: "A mixed elite gauntlet inside a synthetic arena.",
      placements: placements(1, [
        ["legacy.boxer", 13, -5],
        ["wild_west.gunslinger", 18, -1],
        ["dynasty.ninja", 18, 4],
        ["renaissance.balloon_archer", 22, -6],
        ["good.chronomancer", 25, 0],
        ["evil.void_cultist", 27, 5],
        ["secret.gatling_gun", 31, -2],
      ]),
    },
    finaleExtras: [["good.divine_arbiter", 35, -6], ["evil.void_monarch", 37, 6]],
  },
  {
    id: "wild_west",
    displayName: "The Wild West",
    description: "A dusty high-noon shootout with explosive openers and a Quick Draw climax.",
    baseBudget: 2200,
    allowedUnitIds: unitsOf(FactionId.WildWest, FactionId.Secret),
    baseScenario: {
      id: "high_noon",
      displayName: "High Noon",
      description: "A straight-line Wild West duel with a deadly finisher.",
      placements: placements(1, [
        ["wild_west.dynamite_thrower", 13, -6],
        ["wild_west.miner", 14, 2],
        ["wild_west.cactus", 17, -1],
        ["wild_west.gunslinger", 20, -6],
        ["wild_west.deadeye", 23, 5],
        ["wild_west.lasso", 24, 0],
        ["wild_west.quick_draw", 30, 1],
      ]),
    },
    finaleExtras: [["wild_west.deadeye", 34, -5]],
  },
  {
    id: "legacy",
    displayName: "The Legacy",
    description: "A monument battle against classic TABS oddities and high-power legacy units.",
    baseBudget: 4200,
    allowedUnitIds: unitsOf(FactionId.Legacy),
    baseScenario: {
      id: "legacy_onslaught",
      displayName: "Legacy Onslaught",
      description: "Legacy support, mythic heroes, and a tank-led finish.",
      placements: placements(1, [
        ["legacy.poacher", 14, -5],
        ["legacy.pike", 16, -1],
        ["legacy.pike", 16, 3],
        ["legacy.flag_bearer", 18, 0],
        ["legacy.pharaoh", 21, -4],
        ["legacy.thor", 25, 5],
        ["legacy.tank", 31, 0],
      ]),
    },
    finaleExtras: [["legacy.wizard", 36, 4]],
  },
  {
    id: "fantasy_good",
    displayName: "The Fantasy Good",
    description: "A radiant battlefield with disciplined frontliners and divine casters.",
    baseBudget: 3200,
    allowedUnitIds: unitsOf(FactionId.Good, FactionId.Secret),
    baseScenario: {
      id: "celestial_gate",
      displayName: "Celestial Gate",
      description: "A holy phalanx with a chronomantic backline.",
      placements: placements(1, [
        ["good.devout_gauntlet", 12, -4],
        ["good.celestial_aegis", 14, 0],
        ["good.radiant_glaive", 17, -5],
        ["good.radiant_glaive", 17, 5],
        ["good.righteous_paladin", 21, 0],
        ["good.divine_arbiter", 26, -3],
        ["good.chronomancer", 30, 3],
      ]),
    },
    finaleExtras: [["good.sacred_elephant", 35, 0]],
  },
  {
    id: "fantasy_evil",
    displayName: "The Fantasy Evil",
    description: "A corrupted battlefield of void magic, summons, and fear effects.",
    baseBudget: 3400,
    allowedUnitIds: unitsOf(FactionId.Evil),
    baseScenario: {
      id: "into_the_void",
      displayName: "Into the Void",
      description: "An evil host anchored by cultists, lich magic, and the Void Monarch.",
      placements: placements(1, [
        ["evil.shadow_walker", 13, -5],
        ["evil.exiled_sentinel", 15, -1],
        ["evil.exiled_sentinel", 15, 3],
        ["evil.mad_mechanic", 18, 6],
        ["evil.void_cultist", 22, -3],
        ["evil.tempest_lich", 25, 2],
        ["evil.death_bringer", 28, -6],
        ["evil.void_monarch", 31, 0],
      ]),
    },
    finaleExtras: [["evil.tempest_lich", 35, 6]],
  },
];

export const CAMPAIGN_DEFINITIONS: CampaignDefinition[] = CAMPAIGN_SEEDS.map((seed) => ({
  id: seed.id,
  displayName: seed.displayName,
  description: seed.description,
  scenarios: buildScenarioLadder(seed),
}));

export function validateCampaignDefinitionsStructure(): string[] {
  const failures: string[] = [];
  const scenarioIds = new Set<string>();

  for (const campaign of CAMPAIGN_DEFINITIONS) {
    if (campaign.scenarios.length !== 5) {
      failures.push(`${campaign.id} expected 5 scenarios, got ${campaign.scenarios.length}`);
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
    }
  }

  return failures;
}
