# Loop state (v4: two batch audits merged; up to 9 structural/rebuild gaps + 1 eligible polish; fresh CONFIRM before done)
Iteration: 494   Batch: evil   Consecutive empty: 0   Done: 93/139   Parked: 0
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
evil: shadow_walker ---+ o | exiled_sentinel -+++ o | mad_mechanic -+++ o | void_cultist --++ o | tempest_lich ---+ o | death_bringer -+-+ o | void_monarch -+-+ o
secret_1: ballooner ???? q | bomb_on_a_stick ???? q | fan_bearer ???? q | raptor ???? q | the_teacher ???? q | jester ???? q | ball_n_chain ???? q | chu_ko_nu ???? q | executioner ???? q | shouter ???? q
secret_2: taekwondo ???? q | raptor_rider ???? q | cheerleader ???? q | cupid ???? q | mace_spinner ???? q | clams ???? q | present_elf ???? q | ice_mage ???? q | infernal_whip ???? q | bank_robbers ???? q
secret_3: witch ???? q | banshee ???? q | necromancer ???? q | solar_architect ???? q | wheelbarrow_dragon ???? q | skeleton_giant ???? q | bomb_cannon ???? q | cavalry ???? q | vlad ???? q | gatling_gun ???? q
secret_4: blackbeard ???? q | samurai_giant ???? q | ullr ???? q | lady_red_jade ???? q | sensei ???? q | shogun ???? q | tree_giant ???? q | artemis ???? q | ice_giant ???? q

## Focus (iteration 494; BASE 7b0ae2f6; evidence 427bcf57, 4f267007, 24b2e01b, d12876fc)
1. [S] evil.mad_mechanic.a blocker 1 (6b26e43f) APPROVE, struck 1.
2. [S] evil.exiled_sentinel.a blocker 4 (1c20c66c) APPROVE, struck 4.
3. [S] evil.void_cultist.a blocker 3 (2f7c8529, 5c8089a5, 85c56b08) APPROVE, struck 3; a PASS, but CONFIRM failed a, b (new lists).
4. [S] evil.tempest_lich.a blocker 4 (8b9c277c) APPROVE, struck 4.
5. [S] evil.tempest_lich.b blocker 1 (fbae7a4d, 03307096) APPROVE, struck 1.
6. [S] evil.death_bringer.a blocker 1 (416104b2) APPROVE, struck 1.
7. [S] evil.void_monarch.a blocker 1 (cdc2f6f8; stats e2469b0d) APPROVE, struck 1.
8. [S] evil.void_cultist.c blocker 2 (146499df) APPROVE, struck 2; c PASS (CONFIRM passed c, d).
9. [S] evil.exiled_sentinel.c blocker 2 (fb3bd010) APPROVE, struck 2; c PASS.
- 9/9, 9 struck

## Last verdicts (critic header lines verbatim)
- GAP: [S] evil.mad_mechanic (6b26e43f) | VERDICT: APPROVE | CRITERION: evil.mad_mechanic.a FAIL   (previous: FAIL)
- GAP: [S] evil.exiled_sentinel (1c20c66c) | VERDICT: APPROVE | CRITERION: evil.exiled_sentinel.a FAIL   (previous: FAIL)
- GAP: [S] evil.void_cultist (2f7c8529, 5c8089a5, 85c56b08) | VERDICT: APPROVE | CRITERION: evil.void_cultist.a PASS   (previous: FAIL)
- GAP: [S] evil.tempest_lich (8b9c277c) | VERDICT: APPROVE | CRITERION: evil.tempest_lich.a FAIL   (previous: FAIL)
- GAP: [S] evil.tempest_lich (fbae7a4d, 03307096) | VERDICT: APPROVE | CRITERION: evil.tempest_lich.b FAIL   (previous: FAIL)
- GAP: [S] evil.death_bringer (416104b2) | VERDICT: APPROVE | CRITERION: evil.death_bringer.a FAIL   (previous: FAIL)
- GAP: [S] evil.void_monarch (cdc2f6f8) | VERDICT: APPROVE | CRITERION: evil.void_monarch.a FAIL   (previous: FAIL)
- GAP: [S] evil.void_cultist (146499df) | VERDICT: APPROVE | CRITERION: evil.void_cultist.c PASS   (previous: FAIL)
- GAP: [S] evil.exiled_sentinel (fb3bd010) | VERDICT: APPROVE | CRITERION: evil.exiled_sentinel.c PASS   (previous: FAIL)
- REGRESSIONS: none
- CONFIRM: UNIT evil.void_cultist: a FAIL b FAIL c PASS d PASS (2/4)

## Notes for next iteration (max 5 lines)
- 9/9 approved, 16 blockers struck; Done 93/139. Sentinel and cultist c PASS; cultist reopened on a (sleeves, knee coat) and b (shield hold, size) by CONFIRM.
- Shadow Walker had no pick in 494 (a 492, b 490, c 493): b starves at 496; take its c poof or b blade early.
- Lich: tunic in, so the hover retry (REAPER_HOVER on the hip) is ready (c.2); tendrils next on a.
- Capture evidence 494: mechanic idle +250 ms; sentinel spars with three archers 8 m off (ability pavise_block framed as idle); cultist has two extra squires.
- Stats 7/7 d PASS (monarch hm .27 after dropping giant). LESSONS near cap (~10.0 KB): compact before adding.
