// fantasy_good campaign: curated TABS levels (loop v10 stages phase). Card per stage: loop/cards/stages/<id>.md.
// enemy: [unitId, x, z] for team 1 (the right half, facing -x). Map, budget and army counts are checked by loop/scripts/stages.mjs.
import type { TabsStageDef } from "./types";

export const STAGES: TabsStageDef[] = [
  {
    id: "fantasy_good.colossal_spike",
    title: "Colossal Spike",
    tabsLevel: 11,
    mapId: "map.tribal_1",
    budget: 5800,
    playerUnits: { units: ["secret.solar_architect"] },
    enemy: [
      ["tribal.protector", 2, -12],
      ["tribal.protector", 2, -8],
      ["tribal.protector", 2, -4],
      ["tribal.chieftain", 2, 0],
      ["tribal.chieftain", 2, 4],
      // The player is surrounded on two sides: the infantry before him (east), the two Mammoths close together on his
      // south flank, apart from the infantry and turned in toward him (card Survey; thumb: the pair side by side).
      ["tribal.mammoth", -16, -19, 90],
      ["tribal.mammoth", -11.5, -19.5, 90],
      ["tribal.spear_thrower", 8.5, -6.3],
      ["tribal.spear_thrower", 8.5, -4.5],
      ["tribal.spear_thrower", 8.5, -2.7],
      ["tribal.spear_thrower", 8.5, -0.9],
      ["tribal.spear_thrower", 8.5, 0.9],
      ["tribal.spear_thrower", 8.5, 2.7],
      ["tribal.spear_thrower", 8.5, 4.5],
      ["tribal.spear_thrower", 8.5, 6.3],
    ],
  },
  {
    id: "fantasy_good.royal_archers",
    title: "Royal Archers",
    tabsLevel: 15,
    mapId: "map.medieval_1",
    budget: 4500,
    playerUnits: { units: ["secret.solar_architect"] },
    enemy: [
      // Four Kings in a rectangle, two by two (card Survey).
      ["medieval.king", 20, -2.5],
      ["medieval.king", 20, 2.5],
      ["medieval.king", 23, -2.5],
      ["medieval.king", 23, 2.5],
      // Eight Archers in an m behind the Kings: outer legs forward, two peaks back, a dip at the centre, wide gaps
      // at staggered depths (card Survey; thumb).
      ["medieval.archer", 27, -9],
      ["medieval.archer", 30, -7],
      ["medieval.archer", 31.5, -4.5],
      ["medieval.archer", 28, -1.3],
      ["medieval.archer", 28, 1.3],
      ["medieval.archer", 31.5, 4.5],
      ["medieval.archer", 30, 7],
      ["medieval.archer", 27, 9],
    ],
  },
  {
    id: "fantasy_good.clash_of_warriors",
    title: "Clash of Warriors",
    tabsLevel: 19,
    mapId: "map.viking",
    budget: 6000,
    playerUnits: { units: ["secret.solar_architect"] },
    enemy: [
      // 31 Berserkers in a loose ring (radius ~9 round (16,0), jittered 1.5-2.5 m apart) on the open inner ice,
      // well clear of the east pines (card Survey; thumb).
      ["viking.berserker", 25.5, 1.4],
      ["viking.berserker", 24.2, 2.2],
      ["viking.berserker", 23.9, 4.7],
      ["viking.berserker", 22.5, 5],
      ["viking.berserker", 21.6, 8],
      ["viking.berserker", 20.2, 7.7],
      ["viking.berserker", 18.1, 9.2],
      ["viking.berserker", 16.9, 8.4],
      ["viking.berserker", 14.1, 9.4],
      ["viking.berserker", 13.4, 8.1],
      ["viking.berserker", 10.9, 7.7],
      ["viking.berserker", 10.7, 6.2],
      ["viking.berserker", 7.8, 5.1],
      ["viking.berserker", 8.1, 3.8],
      ["viking.berserker", 6.7, 1.6],
      ["viking.berserker", 7.6, 0.4],
      ["viking.berserker", 6.7, -2.4],
      ["viking.berserker", 8.1, -3],
      ["viking.berserker", 8.6, -5.5],
      ["viking.berserker", 10.1, -5.6],
      ["viking.berserker", 11.3, -8.5],
      ["viking.berserker", 12.6, -8.1],
      ["viking.berserker", 14.8, -9.3],
      ["viking.berserker", 16, -8.4],
      ["viking.berserker", 18.9, -9.2],
      ["viking.berserker", 19.4, -7.8],
      ["viking.berserker", 21.8, -7.1],
      ["viking.berserker", 21.9, -5.7],
      ["viking.berserker", 24.7, -4.3],
      ["viking.berserker", 24.3, -3],
      ["viking.berserker", 25.4, -0.7],
      // The five Valkyries fly overhead, spread apart over the ring (thumb: two high in the sky, wide apart): their flat
      // starts are 6-9 m apart over the ring's middle; stagePresentation.ts draws them 7-10 m up until they leave it.
      ["viking.valkyrie", 12, 4.5],
      ["viking.valkyrie", 20, 5],
      ["viking.valkyrie", 16, -0.5],
      ["viking.valkyrie", 11.5, -4.5],
      ["viking.valkyrie", 20.5, -4.5],
    ],
  },
  {
    id: "fantasy_good.chaotic_cavalry",
    title: "Chaotic Cavalry",
    tabsLevel: 24,
    mapId: "map.renaissance",
    budget: 7000,
    playerUnits: { units: ["secret.solar_architect"] },
    enemy: [
      // Four Jousters on the same circle, one either side of each Tank (30 deg round from it, 6.2 m off), turned in
      // toward the middle (card Survey "two on either side of each tank").
      ["renaissance.jouster", -6, 12.4, -60],
      ["renaissance.jouster", -18, 12.4, -120],
      ["renaissance.jouster", -6, -8.4, 60],
      ["renaissance.jouster", -18, -8.4, 120],
      // The player stands in a circle (radius 12 round (-12, 2), reaching into the player's zone at x -19): one Da Vinci
      // Tank at each end of it, north and south, facing in across the middle (card Survey).
      ["renaissance.da_vinci_tank", -12, 14, -90],
      ["renaissance.da_vinci_tank", -12, -10, 90],
    ],
  },
  {
    id: "fantasy_good.vicious_terror",
    title: "Vicious Terror",
    tabsLevel: 28,
    mapId: "map.spooky_2",
    budget: 7200,
    playerUnits: { units: ["secret.solar_architect"] },
    enemy: [
      // One Reaper on either side of the player: each at the court foot of a timber stair-bridge (x 0, decks over
      // |z| 6.5..17.5), two Candleheads either side of him along the court edge, all turned in toward the player
      // (card Survey "Two Reapers on either side of the player. Both are with four Candleheads, two on either side").
      ["spooky.candlehead", -4, 6.3, -45],
      ["spooky.candlehead", -2.2, 6.3, -45],
      ["spooky.reaper", 0, 6, -45],
      ["spooky.candlehead", 2.2, 6.3, -45],
      ["spooky.candlehead", 4, 6.3, -45],
      ["spooky.candlehead", -4, -6.3, 45],
      ["spooky.candlehead", -2.2, -6.3, 45],
      ["spooky.reaper", 0, -6, 45],
      ["spooky.candlehead", 2.2, -6.3, 45],
      ["spooky.candlehead", 4, -6.3, 45],
      ["spooky.skeleton_archer", 13.5, -9.9],
      ["spooky.skeleton_archer", 13.5, -8.1],
      ["spooky.skeleton_archer", 13.5, -6.3],
      ["spooky.skeleton_archer", 13.5, -4.5],
      ["spooky.skeleton_archer", 13.5, -2.7],
      ["spooky.skeleton_archer", 13.5, -0.9],
      ["spooky.skeleton_archer", 13.5, 0.9],
      ["spooky.skeleton_archer", 13.5, 2.7],
      ["spooky.skeleton_archer", 13.5, 4.5],
      ["spooky.skeleton_archer", 13.5, 6.3],
      ["spooky.skeleton_archer", 13.5, 8.1],
      ["spooky.skeleton_archer", 13.5, 9.9],
    ],
  },
  {
    id: "fantasy_good.fortified_formation",
    title: "Fortified Formation",
    tabsLevel: 32,
    mapId: "map.legacy",
    budget: 10000,
    playerUnits: { units: ["secret.solar_architect"] },
    enemy: [
      // A circle of radius 8.5 round (13.5, 0): twelve Pikes in four groups of three, one group guarding each
      // quarter (arcs centred at 45/135/225/315 deg, 12 deg apart) (card Survey; thumb: Pikes on both sides of a tank).
      ["legacy.pike", 20.6, 4.6],
      ["legacy.pike", 19.5, 6],
      ["legacy.pike", 18.1, 7.1],
      ["legacy.pike", 8.9, 7.1],
      ["legacy.pike", 7.5, 6],
      ["legacy.pike", 6.4, 4.6],
      ["legacy.pike", 6.4, -4.6],
      ["legacy.pike", 7.5, -6],
      ["legacy.pike", 8.9, -7.1],
      ["legacy.pike", 18.1, -7.1],
      ["legacy.pike", 19.5, -6],
      ["legacy.pike", 20.6, -4.6],
      // The two Pharaohs back to back at the circle's centre, between the Tanks: one facing the player (yaw 0), one away
      // (yaw 180), their backs 1.2 m apart (card Survey "two Pharaohs also back-to-back").
      ["legacy.pharaoh", 12.9, 0],
      ["legacy.pharaoh", 14.1, 0, 180],
      // The two Tanks inside the circle, side by side facing opposite ways (yaw 0 toward the player, 180 away).
      ["legacy.tank", 13.5, -3.8],
      ["legacy.tank", 13.5, 3.8, 180],
    ],
  },
];
