# Loop state (v4: two batch audits merged; up to 9 structural/rebuild gaps + 1 eligible polish; fresh CONFIRM before done)
Iteration: 532   Batch: secret_3   Consecutive empty: 0   Done: 120/139   Parked: 0
Batches, in order: tribal, renaissance, farmer, medieval, farmer:re, ancient, viking, dynasty, pirate, spooky, wild_west, legacy_1, legacy_2, good, evil, secret_1, secret_2, secret_3, secret_4

## Scoreboard (a b c d as + pass, - fail, ? unscored; status q queued, o open, D done, p parked)
tribal: clubber ++++ D | protector ++++ D | spear_thrower ++++ D | stoner ++++ D | bone_mage ++++ D | chieftain ++++ D | mammoth ++++ D
renaissance: painter ++++ D | fencer ++++ D | balloon_archer ++++ D | musketeer ++++ D | halberd ++++ D | jouster ++++ D | da_vinci_tank ++++ D
farmer: halfling ++++ D | farmer ++++ D | hay_baler ++++ D | potion_seller ++++ D | harvester ++++ D | wheelbarrow ++++ D | scarecrow ++++ D
medieval: bard ++++ D | squire ++++ D | archer ++++ D | healer ++++ D | knight ++++ D | catapult ++++ D | king ++++ D
ancient: shield_bearer ++++ D | sarissa ++++ D | hoplite ++++ D | snake_archer ++++ D | ballista ++++ D | minotaur ++++ D | zeus ++++ D
viking: headbutter ++++ D | ice_archer ++++ D | brawler ++++ D | berserker ++++ D | valkyrie ++++ D | longship ++++ D | jarl ++++ D
dynasty: samurai ++++ D | firework_archer ++++ D | monk ++++ D | ninja ++++ D | dragon ++++ D | hwacha ++++ D | monkey_king ++++ D
pirate: flintlock ++++ D | blunderbuss ++++ D | bomb_thrower ++++ D | harpooner ++++ D | cannon ++++ D | captain ++++ D | pirate_queen ++++ D
spooky: skeleton_warrior ++++ D | skeleton_archer ++++ D | candlehead ++++ D | vampire ++++ D | pumpkin_catapult ++++ D | swordcaster ++++ D | reaper ++++ D
wild_west: dynamite_thrower ++++ D | miner ++++ D | cactus ++++ D | gunslinger ++++ D | lasso ++++ D | deadeye ++++ D | quick_draw ++++ D
legacy_1: peasant ++++ D | banner_bearer ++++ D | poacher ++++ D | blowdarter ++++ D | pike ++++ D | barrel_roller ++++ D | boxer ++++ D | flag_bearer ++++ D
legacy_2: pharaoh ++++ D | wizard ++++ D | chariot ++++ D | thor ++++ D | tank ++++ D | super_boxer ++++ D | dark_peasant ++++ D | super_peasant ++++ D
good: devout_gauntlet ++++ D | celestial_aegis ++++ D | radiant_glaive ++++ D | righteous_paladin ++++ D | divine_arbiter ++++ D | sacred_elephant ++++ D | chronomancer ++++ D
evil: shadow_walker ++++ D | exiled_sentinel ++++ D | mad_mechanic ++++ D | void_cultist ++++ D | tempest_lich ++++ D | death_bringer ++++ D | void_monarch ++++ D
secret_1: ballooner ++++ D | bomb_on_a_stick ++++ D | fan_bearer ++++ D | raptor ++++ D | the_teacher ++++ D | jester ++++ D | ball_n_chain ++++ D | chu_ko_nu ++++ D | executioner ++++ D | shouter ++++ D
secret_2: taekwondo ++++ D | raptor_rider ++++ D | cheerleader ++++ D | cupid ++++ D | mace_spinner ++++ D | clams ++++ D | present_elf ++++ D | ice_mage ++++ D | infernal_whip ++++ D | bank_robbers ++++ D
secret_3: witch ---+ o | banshee -+-+ o | necromancer ---+ o | solar_architect ---+ o | wheelbarrow_dragon -+++ o | skeleton_giant -+++ o | bomb_cannon -+++ o | cavalry +-++ o | vlad -+++ o | gatling_gun --++ o
secret_4: blackbeard ???? q | samurai_giant ???? q | ullr ???? q | lady_red_jade ???? q | sensei ???? q | shogun ???? q | tree_giant ???? q | artemis ???? q | ice_giant ???? q
## Focus (iteration 532; BASE 88796018; secret_3)
1. [S] secret.gatling_gun.a blocker 2 (6307e0d6) APPROVED, struck 2
2. [S] secret.skeleton_giant.c blocker 1 (35fde574) APPROVED, struck 1, c PASS
3. [S] secret.wheelbarrow_dragon.a blocker 4 (44712ed1) APPROVED, struck 4, a PASS (CONFIRM failed a)
4. [S] secret.cavalry.a blocker 3 (32b21a31) APPROVED, struck 3
5. [S] secret.cavalry.a blocker 4 (31368387) APPROVED, struck 4, a PASS (CONFIRM passed a, c, d; failed b)
6. [S] secret.gatling_gun.a blocker 3 (16b934a1) APPROVED, struck 3, a PASS (CONFIRM failed a, b)
7. [S] secret.bomb_cannon.a blocker 2 (4a2e4801) APPROVED, struck 2; 4 by lineup
8. [S] secret.skeleton_giant.a blocker 5 (e01c074c) APPROVED, struck 5
9. [S] secret.wheelbarrow_dragon.b blocker 2 (f1fb5d6a) APPROVED, struck 2, b PASS (CONFIRM passed b, c, d)
- 9/9, 10 struck

## Last verdicts (critic header lines verbatim)
- GAP: [S] secret.gatling_gun (6307e0d6) / VERDICT: APPROVE / CRITERION: secret.gatling_gun.a FAIL   (previous: FAIL)
- GAP: [S] secret.skeleton_giant (35fde574) / VERDICT: APPROVE / CRITERION: secret.skeleton_giant.c PASS   (previous: FAIL)
- GAP: [S] secret.wheelbarrow_dragon (44712ed1) / VERDICT: APPROVE / CRITERION: secret.wheelbarrow_dragon.a PASS   (previous: FAIL)
- GAP: [S] secret.cavalry (32b21a31) / VERDICT: APPROVE / CRITERION: secret.cavalry.a FAIL   (previous: FAIL)
- GAP: [S] secret.cavalry (31368387) / VERDICT: APPROVE / CRITERION: secret.cavalry.a PASS   (previous: FAIL)
- GAP: [S] secret.gatling_gun (16b934a1) / VERDICT: APPROVE / CRITERION: secret.gatling_gun.a PASS   (previous: FAIL)
- GAP: [S] secret.bomb_cannon (4a2e4801) / VERDICT: APPROVE / CRITERION: secret.bomb_cannon.a FAIL   (previous: FAIL)
- GAP: [S] secret.skeleton_giant (e01c074c) / VERDICT: APPROVE / CRITERION: secret.skeleton_giant.a FAIL   (previous: FAIL)
- GAP: [S] secret.wheelbarrow_dragon (f1fb5d6a) / VERDICT: APPROVE / CRITERION: secret.wheelbarrow_dragon.b PASS   (previous: FAIL)
- REGRESSIONS: none
- CONFIRM secret.wheelbarrow_dragon: a FAIL b PASS c PASS d PASS (3/4); secret.cavalry: a PASS b FAIL c PASS d PASS (3/4); secret.gatling_gun: a FAIL b FAIL c PASS d PASS (2/4)

## Notes for next iteration (max 5 lines)
- 532 CONFIRM (first for each) failed wbd a (horns, jaw rims, afro), cavalry b (spearhead), gatling a (extra loader) and b (barrel bundle, trough); those lists are now their Verdicts. Skeleton giant a.3 (scale) has an eligible [P] (critic 532 fallout).
- Starve at 533 (last attempt 528): vlad.a; at 534 (529): witch.c, necromancer.b. Banshee a/c and witch a/b are next-best.
- Gatling single operator: dropping the loader actor needs scenarios composite_gatling_gun / operator_gatling_gun_crank_loss (crew=2, loader roles) updated in the same commit.
- solar c.1: the ray leaves from his feet (attackOrigin); aim spawnSolarRay from the right-hand wand tip. Necromancer idle frames his back: evidence commit before a face/front pick.
- Witch clones copy her look; a Stiffy body for witch a.1 is one SKELETON_UNITS entry (dressSkeleton; secret.* get no hood).
