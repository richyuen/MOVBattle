# Loop state (v4: two batch audits merged; up to 9 structural/rebuild gaps + 1 eligible polish; fresh CONFIRM before done)
Iteration: 511   Batch: secret_1   Consecutive empty: 0   Done: 100/139   Parked: 0
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
secret_1: ballooner -+-+ o | bomb_on_a_stick -+++ o | fan_bearer --++ o | raptor -+++ o | the_teacher -+++ o | jester -+-+ o | ball_n_chain ++-+ o | chu_ko_nu ---+ o | executioner -+++ o | shouter -+++ o
secret_2: taekwondo ???? q | raptor_rider ???? q | cheerleader ???? q | cupid ???? q | mace_spinner ???? q | clams ???? q | present_elf ???? q | ice_mage ???? q | infernal_whip ???? q | bank_robbers ???? q
secret_3: witch ???? q | banshee ???? q | necromancer ???? q | solar_architect ???? q | wheelbarrow_dragon ???? q | skeleton_giant ???? q | bomb_cannon ???? q | cavalry ???? q | vlad ???? q | gatling_gun ???? q
secret_4: blackbeard ???? q | samurai_giant ???? q | ullr ???? q | lady_red_jade ???? q | sensei ???? q | shogun ???? q | tree_giant ???? q | artemis ???? q | ice_giant ???? q
## Focus (iteration 511; BASE 8d2b01e3)
1. [S] secret.jester.b blocker 2 (65f47ff7, 5dc19fb4) APPROVE, struck 2; b PASS
2. [S] secret.jester.c blocker 2 (278dab28, 68792d69) APPROVE, struck 2; added 3
3. [S] secret.jester.a blocker 4 (32de5d14) APPROVE, struck 4
4. [S] secret.ballooner.a blocker 3 (f7143acb) APPROVE, struck 3's doublet/V clause
5. [S] secret.fan_bearer.b blocker 2 (e64bd0b8, reverted f553726d) dropped: grip hidden in the pelvis
6. [S] secret.chu_ko_nu.b blocker 1 (7f696d24, 44e1c3fa) APPROVE, struck 1, 3; added 5
7. [S] secret.raptor.a blocker 5 (70e26c54, 3ec7bafc) APPROVE, struck 5; CONFIRM failed a
8. [P] secret.fan_bearer.a blocker 2 (a7fed8e1) APPROVE, struck 2
9. [S] secret.ballooner.c blocker 2 (026039a3, reverted e2a612c1) dropped: dive and grip not visible
10. [S] secret.chu_ko_nu.c blocker 1 (feef9d94) APPROVE, no strike
- Re-audit: Chu Ko Nu a/b x2 (audit.md, audit2.md). Evidence: 827be5cc Jester ability shot follows the kick.
- 8/10, 8 struck

## Last verdicts (critic header lines verbatim)
- GAP: [S] secret.jester (65f47ff7, 5dc19fb4) / VERDICT: APPROVE / CRITERION: secret.jester.b PASS   (previous: FAIL)
- GAP: [S] secret.jester (278dab28, 68792d69) / VERDICT: APPROVE / CRITERION: secret.jester.c FAIL   (previous: FAIL)
- GAP: [S] secret.jester (32de5d14) / VERDICT: APPROVE / CRITERION: secret.jester.a FAIL   (previous: FAIL)
- GAP: [S] secret.ballooner (f7143acb) / VERDICT: APPROVE / CRITERION: secret.ballooner.a FAIL   (previous: FAIL)
- GAP: [S] secret.chu_ko_nu (7f696d24, 44e1c3fa) / VERDICT: APPROVE / CRITERION: secret.chu_ko_nu.b FAIL   (previous: FAIL)
- GAP: [S] secret.raptor (70e26c54, 3ec7bafc) / VERDICT: APPROVE / CRITERION: secret.raptor.a PASS   (previous: FAIL)
- GAP: [S] secret.chu_ko_nu (feef9d94) / VERDICT: APPROVE / CRITERION: secret.chu_ko_nu.c FAIL   (previous: FAIL)
- GAP: [P] secret.fan_bearer (a7fed8e1) / VERDICT: APPROVE / CRITERION: secret.fan_bearer.a FAIL   (previous: FAIL)
- REGRESSIONS: none (secret.chu_ko_nu.c gets the reversed-bow bolt exit from 7f696d24, but c was already FAIL)
- CONFIRM secret.raptor: a FAIL b PASS c PASS (tongue, flush spine spots)

## Notes for next iteration (max 5 lines)
- Chu Ko Nu: first pick b.5 (lay the bow toward the target, not _heading); then re-judge c.1. Critic 2 asks for a front three-quarter idle before a can PASS (evidence commit candidate).
- Jester kick lands mid-flip: cancel or hold the wind-up while the dodge runs. Belt is the last a blocker.
- Raptor CONFIRM failed a once: team tongue and flush spots remain.
- Ballooner glue dive dropped: probe the held man's position through the lift before the next try.
- Fan Bearer b.2 needs the carry ahead of the hips (the shaft runs through the pelvis).
