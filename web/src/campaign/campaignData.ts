import { ALL_UNITS, getUnitsByFaction } from "../data/unitDefinitions";
import { FactionId } from "../data/factionColors";
import type { BattleMapId } from "../map/mapBuilder";
import type { CampaignDefinition, CampaignId, CampaignPlacementSpec } from "./campaignTypes";

const allUnitIds = ALL_UNITS.map((unit) => unit.id);

function unitsOf(...factions: FactionId[]): string[] {
  return factions.flatMap((faction) => getUnitsByFaction(faction).map((unit) => unit.id));
}

function placements(team: 0 | 1, specs: Array<[string, number, number]>, locked = true): CampaignPlacementSpec[] {
  return specs.map(([unitId, x, z]) => ({ unitId, team, position: { x, z }, locked }));
}

function mapId(campaignId: CampaignId): BattleMapId {
  return `campaign.${campaignId}` as BattleMapId;
}

export const CAMPAIGN_DEFINITIONS: CampaignDefinition[] = [
  {
    id: "introduction",
    displayName: "The Introduction",
    description: "A simple opening battle that teaches basic placement against a small melee line.",
    scenario: {
      id: "the_start",
      displayName: "The Start",
      description: "An easy opener with straightforward enemy lanes.",
      mapId: mapId("introduction"),
      restrictions: { budget: 700, allowedUnitIds: unitsOf(FactionId.Tribal) },
      placements: placements(1, [
        ["farmer.halfling", 10, -5],
        ["farmer.halfling", 12, -2.5],
        ["farmer.farmer", 14, 0],
        ["farmer.hay_baler", 16, 3],
        ["farmer.potion_seller", 18, -1],
      ]),
    },
  },
  {
    id: "adventure",
    displayName: "The Adventure",
    description: "A broader combined-arms skirmish that throws mixed tribal enemies at the player.",
    scenario: {
      id: "tree_tribe",
      displayName: "Tree Tribe",
      description: "A large tribal force dug into a forested approach.",
      mapId: mapId("adventure"),
      restrictions: { budget: 2600, allowedUnitIds: unitsOf(FactionId.Tribal, FactionId.Farmer, FactionId.Medieval, FactionId.Ancient, FactionId.Viking) },
      placements: placements(1, [
        ["tribal.clubber", 11, -10],
        ["tribal.clubber", 11, -6],
        ["tribal.protector", 14, -3],
        ["tribal.protector", 14, 1],
        ["tribal.spear_thrower", 17, -8],
        ["tribal.spear_thrower", 17, -4],
        ["tribal.spear_thrower", 17, 0],
        ["tribal.stoner", 22, -6],
        ["tribal.bone_mage", 23, 2],
        ["tribal.chieftain", 26, -1],
      ]),
    },
  },
  {
    id: "challenge",
    displayName: "The Challenge",
    description: "A tight-budget puzzle battle with a stronger enemy front.",
    scenario: {
      id: "bridge_too_far",
      displayName: "Bridge Too Far",
      description: "A narrow approach with an expensive enemy centerline.",
      mapId: mapId("challenge"),
      restrictions: { budget: 1200, allowedUnitIds: allUnitIds },
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
  },
  {
    id: "dynasty",
    displayName: "The Dynasty",
    description: "A red-lacquered battlefield built around disciplined ranged pressure and a hero anchor.",
    scenario: {
      id: "dynasty_duel",
      displayName: "Dynasty Duel",
      description: "Dynasty infantry and fireworks protect a Monkey King finale.",
      mapId: mapId("dynasty"),
      restrictions: { budget: 2400, allowedUnitIds: unitsOf(FactionId.Dynasty, FactionId.Secret) },
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
  },
  {
    id: "renaissance",
    displayName: "The Renaissance",
    description: "A ranged duel across a formal plaza with cavalry and gunpowder support.",
    scenario: {
      id: "rising_sun_duel",
      displayName: "Rising Sun Duel",
      description: "Renaissance firepower guarded by a Da Vinci Tank.",
      mapId: mapId("renaissance"),
      restrictions: { budget: 2600, allowedUnitIds: unitsOf(FactionId.Renaissance, FactionId.Secret) },
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
  },
  {
    id: "pirate",
    displayName: "The Pirate",
    description: "A shoreline ambush with cannon pressure and a Pirate Queen finisher.",
    scenario: {
      id: "black_flag_bay",
      displayName: "Black Flag Bay",
      description: "Close-range pirates backed by artillery on a beach approach.",
      mapId: mapId("pirate"),
      restrictions: { budget: 2500, allowedUnitIds: unitsOf(FactionId.Pirate) },
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
  },
  {
    id: "spooky",
    displayName: "The Spooky",
    description: "A graveyard brawl with undead ranks, siege pumpkins, and the Reaper.",
    scenario: {
      id: "midnight_harvest",
      displayName: "Midnight Harvest",
      description: "An undead line with siege and fear support.",
      mapId: mapId("spooky"),
      restrictions: { budget: 2700, allowedUnitIds: unitsOf(FactionId.Spooky) },
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
  },
  {
    id: "simulation",
    displayName: "The Simulation",
    description: "A neon arena for mixed-tech and legacy-style experimental battles.",
    scenario: {
      id: "simulation_core",
      displayName: "Simulation Core",
      description: "A mixed elite gauntlet inside a synthetic arena.",
      mapId: mapId("simulation"),
      restrictions: { budget: 3200, allowedUnitIds: allUnitIds },
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
  },
  {
    id: "wild_west",
    displayName: "The Wild West",
    description: "A dusty high-noon shootout with explosive openers and a Quick Draw climax.",
    scenario: {
      id: "high_noon",
      displayName: "High Noon",
      description: "A straight-line Wild West duel with a deadly finisher.",
      mapId: mapId("wild_west"),
      restrictions: { budget: 2200, allowedUnitIds: unitsOf(FactionId.WildWest, FactionId.Secret) },
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
  },
  {
    id: "legacy",
    displayName: "The Legacy",
    description: "A monument battle against classic TABS oddities and high-power legacy units.",
    scenario: {
      id: "legacy_onslaught",
      displayName: "Legacy Onslaught",
      description: "Legacy support, mythic heroes, and a tank-led finish.",
      mapId: mapId("legacy"),
      restrictions: { budget: 4200, allowedUnitIds: unitsOf(FactionId.Legacy) },
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
  },
  {
    id: "fantasy_good",
    displayName: "The Fantasy Good",
    description: "A radiant battlefield with disciplined frontliners and divine casters.",
    scenario: {
      id: "celestial_gate",
      displayName: "Celestial Gate",
      description: "A holy phalanx with a chronomantic backline.",
      mapId: mapId("fantasy_good"),
      restrictions: { budget: 3200, allowedUnitIds: unitsOf(FactionId.Good, FactionId.Secret) },
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
  },
  {
    id: "fantasy_evil",
    displayName: "The Fantasy Evil",
    description: "A corrupted battlefield of void magic, summons, and fear effects.",
    scenario: {
      id: "into_the_void",
      displayName: "Into the Void",
      description: "An evil host anchored by cultists, lich magic, and the Void Monarch.",
      mapId: mapId("fantasy_evil"),
      restrictions: { budget: 3400, allowedUnitIds: unitsOf(FactionId.Evil) },
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
  },
];
