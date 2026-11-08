# Loop state (v4: two batch audits merged; up to 9 structural/rebuild gaps + 1 eligible polish; fresh CONFIRM before done)
Iteration: 495   Batch: evil   Consecutive empty: 0   Done: 93/139   Parked: 0
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
evil: shadow_walker -+-+ o | exiled_sentinel +-++ o | mad_mechanic -+++ o | void_cultist --++ o | tempest_lich --++ o | death_bringer -+-+ o | void_monarch -+-+ o
secret_1: ballooner ???? q | bomb_on_a_stick ???? q | fan_bearer ???? q | raptor ???? q | the_teacher ???? q | jester ???? q | ball_n_chain ???? q | chu_ko_nu ???? q | executioner ???? q | shouter ???? q
secret_2: taekwondo ???? q | raptor_rider ???? q | cheerleader ???? q | cupid ???? q | mace_spinner ???? q | clams ???? q | present_elf ???? q | ice_mage ???? q | infernal_whip ???? q | bank_robbers ???? q
secret_3: witch ???? q | banshee ???? q | necromancer ???? q | solar_architect ???? q | wheelbarrow_dragon ???? q | skeleton_giant ???? q | bomb_cannon ???? q | cavalry ???? q | vlad ???? q | gatling_gun ???? q
secret_4: blackbeard ???? q | samurai_giant ???? q | ullr ???? q | lady_red_jade ???? q | sensei ???? q | shogun ???? q | tree_giant ???? q | artemis ???? q | ice_giant ???? q

## Focus (iteration 495; BASE 3068672d)
1. [S] evil.exiled_sentinel.a blocker 3 (5d269f55) APPROVE, struck 3; a PASS, but CONFIRM failed b (new list).
2. [S] evil.mad_mechanic.a blocker 2 (7d131c39) APPROVE, struck 2.
3. [S] evil.void_cultist.a blocker 1 (978009c4) APPROVE, struck 1.
4. [S] evil.shadow_walker.b blocker 1 (a808e403) APPROVE, struck 1; b PASS.
5. [S] evil.shadow_walker.c blocker 1 (97ea0360, 36f79506) APPROVE, struck 1.
6. [S] evil.tempest_lich.a blocker 2 (f6c8fb65, c08bc4d0) APPROVE, struck 2.
7. [S] evil.tempest_lich.c blocker 2 (4f458ebd) APPROVE, struck 2; c PASS.
8. [S] evil.death_bringer.a blocker 3 (3218b350) APPROVE, struck 3.
9. [S] evil.void_cultist.b blocker 1 (9ebc78bd) APPROVE, struck 1.
10. [P] evil.death_bringer.a stance (65d585c3) REJECT, reverted ec4ffea2 (ledger reversal).
- 9/10, 9 struck

## Last verdicts (critic header lines verbatim)
- GAP: [S] evil.exiled_sentinel (5d269f55) | VERDICT: APPROVE | CRITERION: evil.exiled_sentinel.a PASS   (previous: FAIL)
- GAP: [S] evil.mad_mechanic (7d131c39) | VERDICT: APPROVE | CRITERION: evil.mad_mechanic.a FAIL   (previous: FAIL)
- GAP: [S] evil.void_cultist (978009c4) | VERDICT: APPROVE | CRITERION: evil.void_cultist.a FAIL   (previous: FAIL)
- GAP: [S] evil.shadow_walker (a808e403) | VERDICT: APPROVE | CRITERION: evil.shadow_walker.b PASS   (previous: FAIL)
- GAP: [S] evil.shadow_walker (97ea0360, 36f79506) | VERDICT: APPROVE | CRITERION: evil.shadow_walker.c FAIL   (previous: FAIL)
- GAP: [S] evil.tempest_lich (f6c8fb65, c08bc4d0) | VERDICT: APPROVE | CRITERION: evil.tempest_lich.a FAIL   (previous: FAIL)
- GAP: [S] evil.tempest_lich (4f458ebd) | VERDICT: APPROVE | CRITERION: evil.tempest_lich.c PASS   (previous: FAIL)
- GAP: [S] evil.death_bringer (3218b350) | VERDICT: APPROVE | CRITERION: evil.death_bringer.a FAIL   (previous: FAIL)
- GAP: [S] evil.void_cultist (9ebc78bd) | VERDICT: APPROVE | CRITERION: evil.void_cultist.b FAIL   (previous: FAIL)
- GAP: [P] evil.death_bringer (65d585c3) | VERDICT: REJECT | CRITERION: evil.death_bringer.a FAIL   (previous: FAIL)
- REGRESSIONS: none
- CONFIRM: UNIT evil.exiled_sentinel: a PASS b FAIL c PASS d PASS (3/4)

## Notes for next iteration (max 5 lines)
- 9/10 approved, 9 blockers struck; Done 93/139. Walker b, lich c, sentinel a now PASS; CONFIRM reopened sentinel b (pavise length, carry height).
- Evidence commit first: cultist b.2's named shot (windup) shows his back; re-aim it to the idle before its buckler-size pick.
- Void Monarch had no pick in 495 (a 494, c 493): give it its harness (a.3) or Demon Transformation (c.2) early.
- Lich scale [P] (UV s 1.44 toward 1.0) is ranked as blocker 1's root; death bringer stance wants an [S] idle pose, not the posePreset knob.
- Stats 7/7 d PASS (495). LESSONS at ~9.99 KB: compact before adding.
