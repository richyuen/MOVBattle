# Loop state (v4: two batch audits merged; up to 9 structural/rebuild gaps + 1 eligible polish; fresh CONFIRM before done)
Iteration: 535   Batch: secret_3   Consecutive empty: 0   Done: 124/139   Parked: 0
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
secret_3: witch -+-+ o | banshee -+++ o | necromancer -+-+ o | solar_architect -+-+ o | wheelbarrow_dragon ++++ D | skeleton_giant -+++ o | bomb_cannon ++++ D | cavalry ++++ D | vlad -+++ o | gatling_gun ++++ D
secret_4: blackbeard ???? q | samurai_giant ???? q | ullr ???? q | lady_red_jade ???? q | sensei ???? q | shogun ???? q | tree_giant ???? q | artemis ???? q | ice_giant ???? q
## Focus (iteration 535; BASE bf701be7; secret_3)
0. evidence secret.necromancer ability shots: ABILITY_PREF raise_dead, framed on the fallen man (8f49c997, 98d8264d)
1. [S] secret.necromancer.c blocker 2 (f9e0b531, 9a078f73, 72094ba7) APPROVED, struck 2
2. [S] secret.banshee.c blocker 2 (10c9405b, 109bd5be) APPROVED, struck 2, c PASS
3. [S] secret.solar_architect.b blocker 2 (9e4c9ac8) APPROVED, struck 2, b PASS
4. [S] secret.solar_architect.c blocker 1 (0fbcddbe) APPROVED, struck 1
5. [R] secret.bomb_cannon.a blocker 1 (918f1997) APPROVED, struck 1, a PASS (CONFIRM passed, D)
6. [S] secret.gatling_gun.b blocker 3 (b70cdeaf) APPROVED, struck 3, b PASS (CONFIRM passed, D)
7. [S] secret.witch.a blocker 1 (a156627c) APPROVED, struck 1, 6
8. [S] secret.witch.b blocker 2 (cbb156f0) APPROVED, struck 2, b PASS
9. [P] secret.skeleton_giant.a blocker 1 (9d4cbe06) APPROVED, struck 1, 4
- 9/9, 11 struck

## Last verdicts (critic header lines verbatim)
- GAP: [S] secret.necromancer (f9e0b531, 9a078f73, 72094ba7) / VERDICT: APPROVE / CRITERION: secret.necromancer.c FAIL   (previous: FAIL)
- GAP: [S] secret.banshee (10c9405b, 109bd5be) / VERDICT: APPROVE / CRITERION: secret.banshee.c PASS   (previous: FAIL)
- GAP: [S] secret.solar_architect (9e4c9ac8) / VERDICT: APPROVE / CRITERION: secret.solar_architect.b PASS   (previous: FAIL)
- GAP: [S] secret.solar_architect (0fbcddbe) / VERDICT: APPROVE / CRITERION: secret.solar_architect.c FAIL   (previous: FAIL)
- GAP: [R] secret.bomb_cannon (918f1997) / VERDICT: APPROVE / CRITERION: secret.bomb_cannon.a PASS   (previous: FAIL plateau)
- GAP: [S] secret.gatling_gun (b70cdeaf) / VERDICT: APPROVE / CRITERION: secret.gatling_gun.b PASS   (previous: FAIL)
- GAP: [S] secret.witch (a156627c) / VERDICT: APPROVE / CRITERION: secret.witch.a FAIL   (previous: FAIL)
- GAP: [S] secret.witch (cbb156f0) / VERDICT: APPROVE / CRITERION: secret.witch.b PASS   (previous: FAIL)
- GAP: [P] secret.skeleton_giant (9d4cbe06) / VERDICT: APPROVE / CRITERION: secret.skeleton_giant.a FAIL   (previous: FAIL)
- REGRESSIONS: none
- CONFIRM secret.gatling_gun: a PASS b PASS c PASS d PASS (4/4); secret.bomb_cannon: a PASS b PASS c PASS d PASS (4/4)

## Notes for next iteration (max 5 lines)
- gatling_gun and bomb_cannon D at 535. Open: witch, banshee, necromancer, solar_architect, skeleton_giant, vlad (all a, plus necro/witch/solar c).
- Starve at 536: necromancer.a (last 531). vlad.a last 533 (starves 539); solar.a last 533 (starves 539).
- Necromancer idle is his FRONT (critics misread it as his back: the dark hood ball hides the face); his horned cap gap fixes that, no camera change.
- Mechanics left: necro Gravestone Wall, solar Solar Maelstrom, witch mushrooms on the victim. Witch broom is the big a pick (hover + seated pose).
- Next batch secret_4 is unaudited: tail overlap applies once secret_3 has under 9 pickable [S] or 3 or fewer open units.
