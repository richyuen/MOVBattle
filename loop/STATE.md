# Loop state (v4: two batch audits merged; up to 9 structural/rebuild gaps + 1 eligible polish; fresh CONFIRM before done)
Iteration: 528   Batch: secret_2+secret_3   Consecutive empty: 0   Done: 119/139   Parked: 0
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
secret_2: taekwondo ++++ D | raptor_rider ++++ D | cheerleader ++++ D | cupid ++++ D | mace_spinner ++++ D | clams ++++ D | present_elf ++++ D | ice_mage ++++ D | infernal_whip ++++ D | bank_robbers --++ o
secret_3: witch ---+ o | banshee -+-+ o | necromancer ---+ o | solar_architect ---+ o | wheelbarrow_dragon ---+ o | skeleton_giant -+-+ o | bomb_cannon --++ o | cavalry ---+ o | vlad -+-+ o | gatling_gun --++ o
secret_4: blackbeard ???? q | samurai_giant ???? q | ullr ???? q | lady_red_jade ???? q | sensei ???? q | shogun ???? q | tree_giant ???? q | artemis ???? q | ice_giant ???? q
## Focus (iteration 528; BASE 2ea44959; secret_2+secret_3)
1. [S] secret.witch.b blocker 1 (69681de4) APPROVED, struck 1
2. [S] secret.banshee.b blocker 1 (dd424eab) APPROVED, struck 1, 2, b PASS
3. [S] secret.necromancer.b blocker 1 (88adc711) APPROVED, struck 1; added 3
4. [S] secret.solar_architect.a blocker 2 (e00ede68) APPROVED, struck 2
5. [S] secret.gatling_gun.c blocker 1 (9e007d5c) APPROVED, struck 1, c PASS
6. [S] secret.bank_robbers.a blocker 1 (84812928) APPROVED, struck 1, 3 (lineup)
7. [S] secret.skeleton_giant.b blocker 2 (53ccdaed) APPROVED, struck 2, b PASS
8. [S] secret.vlad.a blocker 1 (d147ea1d) APPROVED, struck 1
9. [S] secret.wheelbarrow_dragon.a blocker 1 (a6bcb527) APPROVED, struck a.1, b.1
10. [P] secret.cavalry.b blocker 2 (c8877839) APPROVED, no strike (shot re-aimed to _windup)
- 10/10, 12 struck

## Last verdicts (critic header lines verbatim)
- GAP: [S] secret.witch (69681de4) / VERDICT: APPROVE / CRITERION: secret.witch.b FAIL   (previous: FAIL)
- GAP: [S] secret.banshee (dd424eab) / VERDICT: APPROVE / CRITERION: secret.banshee.b PASS   (previous: FAIL)
- GAP: [S] secret.necromancer (88adc711) / VERDICT: APPROVE / CRITERION: secret.necromancer.b FAIL   (previous: FAIL)
- GAP: [S] secret.solar_architect (e00ede68) / VERDICT: APPROVE / CRITERION: secret.solar_architect.a FAIL   (previous: FAIL)
- GAP: [S] secret.gatling_gun (9e007d5c) / VERDICT: APPROVE / CRITERION: secret.gatling_gun.c PASS   (previous: FAIL)
- GAP: [S] secret.bank_robbers (84812928) / VERDICT: APPROVE / CRITERION: secret.bank_robbers.a FAIL   (previous: FAIL)
- GAP: [S] secret.skeleton_giant (53ccdaed) / VERDICT: APPROVE / CRITERION: secret.skeleton_giant.b PASS   (previous: FAIL)
- GAP: [S] secret.vlad (d147ea1d) / VERDICT: APPROVE / CRITERION: secret.vlad.a FAIL   (previous: FAIL)
- GAP: [S] secret.wheelbarrow_dragon (a6bcb527) / VERDICT: APPROVE / CRITERION: secret.wheelbarrow_dragon.a FAIL   (previous: FAIL)
- GAP: [P] secret.cavalry (c8877839) / VERDICT: APPROVE / CRITERION: secret.cavalry.b FAIL   (previous: FAIL)
- REGRESSIONS: none

## Notes for next iteration (max 5 lines)
- bank_robbers: a has 1 blocker left (gun belt); b keeps CONFIRM 527's list. A second CONFIRM fail on a or b makes it plateau.
- Eligible [P] fallouts: witch WITCH_STAFF thick/ropeAt (69681de4); necromancer knife seat (88adc711); cavalry flagGap .03->.05 (c8877839); bomb_cannon cutlass flip (7d5002bd).
- c criteria never attempted (witch, banshee, necromancer, solar, wheelbarrow_dragon, skeleton_giant, cavalry, vlad) starve at 532: spread c picks.
- Solar halo lifted his rig to 2.57 m; shots still frame him. iter-528 holds only touched units' shots.
