# Loop state (v4: two batch audits merged; up to 9 structural/rebuild gaps + 1 eligible polish; fresh CONFIRM before done)
Iteration: 513   Batch: secret_1   Consecutive empty: 0   Done: 106/139   Parked: 0
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
secret_1: ballooner -+-+ o | bomb_on_a_stick ++++ D | fan_bearer --++ o | raptor ++++ D | the_teacher -+++ o | jester ++++ D | ball_n_chain ++++ D | chu_ko_nu ---+ o | executioner ++++ D | shouter ++++ D
secret_2: taekwondo ???? q | raptor_rider ???? q | cheerleader ???? q | cupid ???? q | mace_spinner ???? q | clams ???? q | present_elf ???? q | ice_mage ???? q | infernal_whip ???? q | bank_robbers ???? q
secret_3: witch ???? q | banshee ???? q | necromancer ???? q | solar_architect ???? q | wheelbarrow_dragon ???? q | skeleton_giant ???? q | bomb_cannon ???? q | cavalry ???? q | vlad ???? q | gatling_gun ???? q
secret_4: blackbeard ???? q | samurai_giant ???? q | ullr ???? q | lady_red_jade ???? q | sensei ???? q | shogun ???? q | tree_giant ???? q | artemis ???? q | ice_giant ???? q
## Focus (iteration 513; BASE eee3063b)
1. [R] secret.shouter.a blockers 1-4 (ecb2f1d2) APPROVE, struck 1-4; a PASS, CONFIRM passed, shouter D
2. [S] secret.executioner.a blocker 1 (0e3163cb) APPROVE, struck 1; CONFIRM passed, executioner D
3. [S] secret.ball_n_chain.c blocker 2 (bd5c8bce, 9e93b061) APPROVE, struck 2; CONFIRM passed, ball_n_chain D
4. [S] secret.jester.a blocker 1 (aec49ae0) APPROVE, struck 1; CONFIRM passed, jester D
5. [S] secret.bomb_on_a_stick.a blocker 2 (1ed2fd7e) APPROVE, struck 2
6. [S] secret.bomb_on_a_stick.a blocker 5 (fdf374b2) APPROVE, struck 5; CONFIRM passed, bomb_on_a_stick D
7. [S] secret.fan_bearer.a blocker 3 (75907159) APPROVE, struck 3
8. [S] secret.the_teacher.a blocker 1 (b919c5d4) APPROVE, struck 1
9. [S] secret.the_teacher.a blocker 2 (ce979dd8) APPROVE, struck 2
- 9/9, 12 struck

## Last verdicts (critic header lines verbatim)
- GAP: [R] secret.shouter (ecb2f1d2) / VERDICT: APPROVE / CRITERION: secret.shouter.a PASS   (previous: FAIL)
- GAP: [S] secret.executioner (0e3163cb) / VERDICT: APPROVE / CRITERION: secret.executioner.a PASS   (previous: FAIL)
- GAP: [S] secret.ball_n_chain (bd5c8bce, 9e93b061) / VERDICT: APPROVE / CRITERION: secret.ball_n_chain.c PASS   (previous: FAIL)
- GAP: [S] secret.jester (aec49ae0) / VERDICT: APPROVE / CRITERION: secret.jester.a PASS   (previous: FAIL)
- GAP: [S] secret.bomb_on_a_stick (1ed2fd7e) / VERDICT: APPROVE / CRITERION: secret.bomb_on_a_stick.a FAIL   (previous: FAIL)
- GAP: [S] secret.bomb_on_a_stick (fdf374b2) / VERDICT: APPROVE / CRITERION: secret.bomb_on_a_stick.a PASS   (previous: FAIL)
- GAP: [S] secret.fan_bearer (75907159) / VERDICT: APPROVE / CRITERION: secret.fan_bearer.a FAIL   (previous: FAIL)
- GAP: [S] secret.the_teacher (b919c5d4) / VERDICT: APPROVE / CRITERION: secret.the_teacher.a FAIL   (previous: FAIL)
- GAP: [S] secret.the_teacher (ce979dd8) / VERDICT: APPROVE / CRITERION: secret.the_teacher.a FAIL   (previous: FAIL)
- REGRESSIONS: none
- CONFIRM: shouter ++++ | executioner ++++ | ball_n_chain ++++ | jester ++++ | bomb_on_a_stick ++++

## Notes for next iteration (max 5 lines)
- Four secret_1 units open (ballooner, fan_bearer, the_teacher, chu_ko_nu) with 9 ranked [S] between them; if fewer than 9 are pickable, tail-overlap secret_2 (audit it in step 2).
- Chu Ko Nu: first pick b.5 (lay the bow toward the target, not _heading); then re-judge c.1. Critic 2 asks for a front three-quarter idle before a can PASS (evidence commit candidate).
- Ballooner glue dive dropped in 511: probe the held man's position through the lift before the next try (ball_n_chain's 513 dive: set RU _leapAir and DIVE at full weight).
- Fan Bearer b.2 needs the carry ahead of the hips (the shaft runs through the pelvis).
- Teacher a.3: the beard must be big (cheek to cheek, down to the jabot), not a recolour.
