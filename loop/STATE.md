# Loop state (v4: two batch audits merged; up to 9 structural/rebuild gaps + 1 eligible polish; fresh CONFIRM before done)
Iteration: 531   Batch: secret_3   Consecutive empty: 0   Done: 120/139   Parked: 0
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
secret_3: witch ---+ o | banshee -+-+ o | necromancer ---+ o | solar_architect ---+ o | wheelbarrow_dragon --++ o | skeleton_giant -+-+ o | bomb_cannon -+++ o | cavalry -+++ o | vlad -+++ o | gatling_gun -+++ o
secret_4: blackbeard ???? q | samurai_giant ???? q | ullr ???? q | lady_red_jade ???? q | sensei ???? q | shogun ???? q | tree_giant ???? q | artemis ???? q | ice_giant ???? q
## Focus (iteration 531; BASE 3af7d2b7; secret_2+secret_3)
0. RE-AUDIT banshee.a x2 (audit.md, audit2.md): a FAIL, 6 blockers; evidence 0fce21c2 skeleton giant ability shots frame giant_fear
1. [S] secret.bank_robbers.b blocker 1 (af3247ae) APPROVED, struck 1
2. [S] secret.wheelbarrow_dragon.a blocker 3 (e7664e58, 0ef10b96) APPROVED, struck 3
3. [S] secret.cavalry.a blocker 2 (0190b5cd) APPROVED, struck 2
4. [S] secret.gatling_gun.a blocker 1 (bab41712) APPROVED, struck 1; 4 by lineup
5. [S] secret.bomb_cannon.b blocker 2 (135a95d9) APPROVED, struck 2, b PASS
6. [S] secret.solar_architect.c blocker 1 (6704451a) APPROVED, no strike
7. [S] secret.skeleton_giant.c blocker 2 (d7859f2a) APPROVED, struck 2
8. [S] secret.skeleton_giant.a blocker 1 (aad23125) APPROVED, struck 1, 4
9. [S] secret.necromancer.a blocker 1 (c99eccde) APPROVED, struck 1
10. [P] secret.bank_robbers.b blocker 4 (40b13711) APPROVED, struck 4, b PASS; CONFIRM passed a-d: bank_robbers D
- 10/10, 12 struck

## Last verdicts (critic header lines verbatim)
- GAP: [S] secret.bank_robbers (af3247ae) / VERDICT: APPROVE / CRITERION: secret.bank_robbers.b PASS   (previous: FAIL)
- GAP: [P] secret.bank_robbers (40b13711) / VERDICT: APPROVE / CRITERION: secret.bank_robbers.b PASS   (previous: FAIL)
- GAP: [S] secret.wheelbarrow_dragon (e7664e58, 0ef10b96) / VERDICT: APPROVE / CRITERION: secret.wheelbarrow_dragon.a FAIL   (previous: FAIL)
- GAP: [S] secret.cavalry (0190b5cd) / VERDICT: APPROVE / CRITERION: secret.cavalry.a FAIL   (previous: FAIL)
- GAP: [S] secret.gatling_gun (bab41712) / VERDICT: APPROVE / CRITERION: secret.gatling_gun.a FAIL   (previous: FAIL)
- GAP: [S] secret.bomb_cannon (135a95d9) / VERDICT: APPROVE / CRITERION: secret.bomb_cannon.b PASS   (previous: FAIL)
- GAP: [S] secret.solar_architect (6704451a) / VERDICT: APPROVE / CRITERION: secret.solar_architect.c FAIL   (previous: FAIL)
- GAP: [S] secret.skeleton_giant (d7859f2a) / VERDICT: APPROVE / CRITERION: secret.skeleton_giant.c FAIL   (previous: FAIL)
- GAP: [S] secret.skeleton_giant (aad23125) / VERDICT: APPROVE / CRITERION: secret.skeleton_giant.a FAIL   (previous: FAIL)
- GAP: [S] secret.necromancer (c99eccde) / VERDICT: APPROVE / CRITERION: secret.necromancer.a FAIL   (previous: FAIL)
- REGRESSIONS: none
- CONFIRM secret.bank_robbers: a PASS b PASS c PASS d PASS (4/4)

## Notes for next iteration (max 5 lines)
- 531 checkpoint: secret_2 all done, regression suite 12/12 GREEN. secret_3 has 10 open units; secret_4 unaudited (tail overlap once picks drop under 9 or open units under 4).
- Starve at 533 (last attempt 528): vlad.a, wheelbarrow_dragon.b; at 534 (529): bomb_cannon.a, witch.c, necromancer.b. Banshee a/c and witch a/b are next-best.
- solar c.1 struck nothing: the ray leaves from his feet (attackOrigin); aim spawnSolarRay from the right-hand wand tip next.
- necromancer idle frames his back (531 critic): an evidence commit before a face/front pick on him.
- Witch clones copy her look; a Stiffy body for witch a.1 is one SKELETON_UNITS entry (dressSkeleton; secret.* get no hood).
