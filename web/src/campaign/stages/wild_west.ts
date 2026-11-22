// wild_west campaign: curated TABS levels (loop v10 stages phase). Card per stage: loop/cards/stages/<id>.md.
// enemy: [unitId, x, z] for team 1 (the right half, facing -x). Map, budget and army counts are checked by loop/scripts/stages.mjs.
import type { TabsStageDef } from "./types";

export const STAGES: TabsStageDef[] = [
  {
    id: "wild_west.leading_cacti",
    title: "Leading Cacti",
    tabsLevel: 2,
    mapId: "map.wild_west",
    budget: 3600,
    playerUnits: { factions: ["tribal","farmer","medieval","ancient","viking","dynasty","renaissance","pirate","spooky"] },
    enemy: [
      // Four lanes on the open sand in the middle of the town, before the back-row shopfronts (z 35.5 row, porches near
      // z 30; ref: the storefronts stand behind the lanes), each a Cactus leading three Miners (card Survey); stage zone
      // (13.5,18.5) 11x12 in main.ts:checkStage.
      ["wild_west.miner", 11.6, 14],
      ["wild_west.miner", 14.4, 14],
      ["wild_west.miner", 17.2, 14],
      ["wild_west.miner", 11.6, 17],
      ["wild_west.miner", 14.4, 17],
      ["wild_west.miner", 17.2, 17],
      ["wild_west.miner", 11.6, 20],
      ["wild_west.miner", 14.4, 20],
      ["wild_west.miner", 17.2, 20],
      ["wild_west.miner", 11.6, 23],
      ["wild_west.miner", 14.4, 23],
      ["wild_west.miner", 17.2, 23],
      ["wild_west.cactus", 8.8, 14],
      ["wild_west.cactus", 8.8, 17],
      ["wild_west.cactus", 8.8, 20],
      ["wild_west.cactus", 8.8, 23],
    ],
  },
  {
    id: "wild_west.bullets_and_chains",
    title: "Bullets and Chains",
    tabsLevel: 8,
    mapId: "map.wild_west",
    budget: 7500,
    playerUnits: { factions: ["tribal","farmer","medieval","ancient","viking","dynasty","renaissance","pirate","spooky"] },
    enemy: [
      // Two Cactus trios lead the wings on opposite sides of town (card Survey).
      ["wild_west.cactus", 28.4, -19.6],
      ["wild_west.cactus", 28.4, -17.6],
      ["wild_west.cactus", 28.4, -15.6],
      ["wild_west.cactus", 29, 16],
      ["wild_west.cactus", 29, 18],
      ["wild_west.cactus", 29, 20],
      // The Gunslinger pair fills the middle opening between the wings, at the very back (card Survey).
      ["wild_west.gunslinger", 38, -1.5],
      ["wild_west.gunslinger", 38, 1.5],
      // Five Ball n Chains follow each Cactus trio, three then two, leaving the middle open (ref wild_west.bullets_and_chains.png).
      ["secret.ball_n_chain", 32, -20],
      ["secret.ball_n_chain", 32, -18],
      ["secret.ball_n_chain", 32, -16],
      ["secret.ball_n_chain", 34.5, -19],
      ["secret.ball_n_chain", 34.5, -17],
      ["secret.ball_n_chain", 32, 20],
      ["secret.ball_n_chain", 32, 18],
      ["secret.ball_n_chain", 32, 16],
      ["secret.ball_n_chain", 34.5, 19],
      ["secret.ball_n_chain", 34.5, 17],
    ],
  },
  {
    id: "wild_west.lone_ranger_and_his_friends",
    title: "Lone Ranger and His Friends",
    tabsLevel: 15,
    mapId: "map.wild_west",
    budget: 7500,
    playerUnits: { factions: ["tribal","farmer","medieval","ancient","viking","dynasty","renaissance","pirate","spooky"] },
    enemy: [
      // [R] 625 spec (reference/stages/wild_west.lone_ranger_and_his_friends.png: the Quick Draw alone at the centre of the
      // rear, whole from head to boots, a Deadeye ~5 m either side of him a little nearer the player, the white chapel
      // behind-left of him, the town on the left). The base map's red mound ("hill", centre (35, 25), 10 x 8 m, 1.8 m
      // high; mapBuilder.ts) swallowed his legs at (33, 23): the party now stands wholly in front of it.
      // The party is laid square to the _army sight line (camera from the south-west, alpha PI+0.6: forward
      // d = (0.825, 0.565), right r = (0.565, -0.825)), round the Quick Draw at O = (29, 20.5), 1.2 m clear of the
      // mound's rim; the chapel (39, 35) is 16 m behind him and 6 m to his left, the mound 7 m behind-right.
      // Local (u along d, v along r) -> world O + u*d + v*r:
      //   Quick Draw (0, 0); Deadeyes (-1.5, +-5); Lassos (-2, +-7.5), outside the Deadeyes;
      //   Gunslingers (-4.5, +-2.6), behind the end Cacti; Cacti (-8, -2/0/2), the middle one 2 m tall so the
      //   sight line to his boots (18 deg) passes 0.6 m over it; Miners (-8, +-3.6 and +-5.1), two each side of the Cacti.
      // Nobody on the mound, in the rear-street building (x ~18..27, z ~28..37) or behind its porch; stage zone
      // (25.5, 18.5) 16 x 18 in main.ts:checkStage.
      ["wild_west.miner", 20.4, 19],
      ["wild_west.miner", 19.5, 20.2],
      ["wild_west.cactus", 21.3, 17.6],
      ["wild_west.cactus", 22.4, 16],
      ["wild_west.cactus", 23.5, 14.3],
      ["wild_west.miner", 24.4, 13],
      ["wild_west.miner", 25.3, 11.8],
      ["wild_west.gunslinger", 23.8, 20.1],
      ["wild_west.gunslinger", 26.8, 15.8],
      ["wild_west.deadeye", 24.9, 23.8],
      ["wild_west.deadeye", 30.6, 15.5],
      ["wild_west.lasso", 23.1, 25.6],
      ["wild_west.lasso", 31.6, 13.2],
      ["wild_west.quick_draw", 29, 20.5],
    ],
  },
  {
    id: "wild_west.laughing_knights",
    title: "Laughing Knights",
    tabsLevel: 21,
    mapId: "map.medieval_1",
    budget: 2800,
    playerUnits: { units: ["secret.ball_n_chain","secret.bank_robbers","secret.gatling_gun"] },
    enemy: [
      // One column on the land bridge (x -5..5, axis z 1) beside the ruins: the Jester diamond at the player end,
      // then the Knight, Executioner and Healer pairs in that order behind it (card Survey).
      ["secret.jester", -3.6, 1],
      ["secret.jester", -1.4, -1.2],
      ["secret.jester", -1.4, 3.2],
      ["secret.jester", 0.8, 1],
      ["medieval.knight", 3.2, -0.1],
      ["medieval.knight", 3.2, 2.1],
      ["secret.executioner", 5.8, -0.1],
      ["secret.executioner", 5.8, 2.1],
      ["medieval.healer", 8.4, -0.1],
      ["medieval.healer", 8.4, 2.1],
    ],
  },
  {
    id: "wild_west.shogun_s_samurai",
    title: "Shogun's Samurai",
    tabsLevel: 28,
    mapId: "map.dynasty",
    budget: 7400,
    playerUnits: { units: ["secret.ball_n_chain","secret.bank_robbers","secret.gatling_gun"] },
    enemy: [
      // Six Samurai at the foot of the right-side terrace stair (x 27, z -7..-18), eight on the outer lawn above it (card Survey).
      ["dynasty.samurai", 25, -5.5],
      ["dynasty.samurai", 27, -5.5],
      ["dynasty.samurai", 29, -5.5],
      ["dynasty.samurai", 25, -3.8],
      ["dynasty.samurai", 27, -3.8],
      ["dynasty.samurai", 29, -3.8],
      ["dynasty.samurai", 24, -19.5],
      ["dynasty.samurai", 26, -19.5],
      ["dynasty.samurai", 28, -19.5],
      ["dynasty.samurai", 30, -19.5],
      ["dynasty.samurai", 24, -21],
      ["dynasty.samurai", 26, -21],
      ["dynasty.samurai", 28, -21],
      ["dynasty.samurai", 30, -21],
      // The Shogun stands behind the upper eight at the stair head, three guards round him (card Survey).
      ["dynasty.samurai", 25, -23.8],
      ["dynasty.samurai", 29, -23.8],
      ["dynasty.samurai", 27, -27.2],
      // The Samurai Giant stands apart on the outer lawn east of the stair head, beside the upper force.
      ["secret.samurai_giant", 35, -20.5],
      ["secret.shogun", 27, -24],
    ],
  },
  {
    id: "wild_west.spooky_army",
    title: "Spooky Army",
    tabsLevel: 34,
    mapId: "map.spooky_2",
    budget: 7200,
    playerUnits: { units: ["secret.ball_n_chain","secret.bank_robbers","secret.gatling_gun"] },
    enemy: [
      // Six Candleheads stand in the middle, just past the grated court (card Survey; ref).
      ["spooky.candlehead", 7, -2],
      ["spooky.candlehead", 7, 0],
      ["spooky.candlehead", 7, 2],
      ["spooky.candlehead", 9, -2],
      ["spooky.candlehead", 9, 0],
      ["spooky.candlehead", 9, 2],
      // Four Vampires on each of the two opposite flanks (card Survey).
      ["spooky.vampire", 10, -7.4],
      ["spooky.vampire", 12, -7.4],
      ["spooky.vampire", 10, -9.2],
      ["spooky.vampire", 12, -9.2],
      ["spooky.vampire", 10, 7.4],
      ["spooky.vampire", 12, 7.4],
      ["spooky.vampire", 10, 9.2],
      ["spooky.vampire", 12, 9.2],
      // The Reaper floats above the right-side (-z) terrace stair behind the archers, three Swordcasters below him (card Survey).
      ["spooky.swordcaster", 29.4, -1.8],
      ["spooky.swordcaster", 29.4, -5.4],
      ["spooky.swordcaster", 29.8, -3.6],
      ["spooky.reaper", 32, -3.6],
      // The eight Skeleton Archers stand directly behind the Candleheads on the central approach (card Survey).
      ["spooky.skeleton_archer", 12, -3],
      ["spooky.skeleton_archer", 12, -1],
      ["spooky.skeleton_archer", 12, 1],
      ["spooky.skeleton_archer", 12, 3],
      ["spooky.skeleton_archer", 14, -3],
      ["spooky.skeleton_archer", 14, -1],
      ["spooky.skeleton_archer", 14, 1],
      ["spooky.skeleton_archer", 14, 3],
    ],
  },
];
