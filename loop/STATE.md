# Loop state (v4: two batch audits merged; up to 9 structural/rebuild gaps + 1 eligible polish; fresh CONFIRM before done)
Iteration: 530   Batch: secret_2+secret_3   Consecutive empty: 0   Done: 119/139   Parked: 0
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
secret_2: taekwondo ++++ D | raptor_rider ++++ D | cheerleader ++++ D | cupid ++++ D | mace_spinner ++++ D | clams ++++ D | present_elf ++++ D | ice_mage ++++ D | infernal_whip ++++ D | bank_robbers +-++ o
secret_3: witch ---+ o | banshee -+-+ o | necromancer ---+ o | solar_architect ---+ o | wheelbarrow_dragon --++ o | skeleton_giant -+-+ o | bomb_cannon --++ o | cavalry -+++ o | vlad -+++ o | gatling_gun -+++ o
secret_4: blackbeard ???? q | samurai_giant ???? q | ullr ???? q | lady_red_jade ???? q | sensei ???? q | shogun ???? q | tree_giant ???? q | artemis ???? q | ice_giant ???? q
## Focus (iteration 530; BASE bd1f6929; secret_2+secret_3)
0. evidence: banshee idle nearFront .25 (2eb70c3d); ABILITY_PREF banshee scream (405435ba), cavalry shockwave (28426fd0)
1. [S] secret.bank_robbers.b blocker 2 (f4eb62e2) APPROVED, struck 2
2. [S] secret.bank_robbers.b blocker 3 (865a5057) APPROVED, struck 3; added 4
3. [S] secret.wheelbarrow_dragon.c blocker 1 (7b82178a) APPROVED, struck 1, c PASS
4. [S] secret.cavalry.c blocker 1 (489d21ae) APPROVED, struck 1, c PASS
5. [S] secret.banshee.c blocker 1 (ac9de35a) APPROVED, struck 1
6. [S] secret.necromancer.c blocker 1 (9efd3166) APPROVED, struck 1
7. [S] secret.witch.a blocker 2 (69d439c2, 03b0aab4) APPROVED, struck 2; 3 by lineup
8. [S] secret.gatling_gun.b blocker 2 (a57ca606) APPROVED, struck 2, b PASS
9. [S] secret.solar_architect.b blocker 3 (74451e1d) APPROVED, struck 3
10. [P] secret.witch.b blocker 2 (1553b2ba) APPROVED, no strike
- 10/10, 10 struck

## Last verdicts (critic header lines verbatim)
- GAP: [S] secret.bank_robbers (f4eb62e2) / VERDICT: APPROVE / CRITERION: secret.bank_robbers.b FAIL   (previous: FAIL)
- GAP: [S] secret.bank_robbers (865a5057) / VERDICT: APPROVE / CRITERION: secret.bank_robbers.b FAIL   (previous: FAIL)
- GAP: [S] secret.wheelbarrow_dragon (7b82178a) / VERDICT: APPROVE / CRITERION: secret.wheelbarrow_dragon.c PASS   (previous: FAIL)
- GAP: [S] secret.cavalry (489d21ae) / VERDICT: APPROVE / CRITERION: secret.cavalry.c PASS   (previous: FAIL)
- GAP: [S] secret.banshee (ac9de35a) / VERDICT: APPROVE / CRITERION: secret.banshee.c FAIL   (previous: FAIL)
- GAP: [S] secret.necromancer (9efd3166) / VERDICT: APPROVE / CRITERION: secret.necromancer.c FAIL   (previous: FAIL)
- GAP: [S] secret.witch (69d439c2, 03b0aab4) / VERDICT: APPROVE / CRITERION: secret.witch.a FAIL   (previous: FAIL)
- GAP: [S] secret.gatling_gun (a57ca606) / VERDICT: APPROVE / CRITERION: secret.gatling_gun.b PASS   (previous: FAIL)
- GAP: [S] secret.solar_architect (74451e1d) / VERDICT: APPROVE / CRITERION: secret.solar_architect.b FAIL   (previous: FAIL)
- GAP: [P] secret.witch (1553b2ba) / VERDICT: APPROVE / CRITERION: secret.witch.b FAIL   (previous: FAIL)
- REGRESSIONS: none

## Notes for next iteration (max 5 lines)
- 531 step 2: RE-AUDIT banshee.a only (evidence 530.0 moved her idle camera; give the critic her Verdicts block).
- Starve at 532 (no attempt since 527): solar.c, skeleton_giant.a and .c, necromancer.a, gatling.a, cavalry.a, bomb_cannon.b: spread them over 531-532.
- Eligible [P]: bank_robbers robbers armLength ~1.3 (fallout of 865a5057, to 533). bomb_cannon cutlass flip needs an [S] re-seat.
- bank_robbers: only b left (colour 1, hat gap 4); a second CONFIRM fail on b makes it plateau. solar b.2 may be stale (critic): check it.
- Witch clones copy her look; the barrow dragon lives in the cart actor; gatling operators lost the chassis bed they stood on.
