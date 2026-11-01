# Loop state (v6: one batch at a time, up to 7 structural gaps per iteration, a CONFIRM critic before D and two CONFIRM fails make a plateau, a criterion a CONFIRM passed stays passed, the critic sees the diff and never the worker's words, the capture frames a unit by its mesh top)
Iteration: 444   Batch: pirate+wild_west (6/14)   Consecutive empty: 0   Done: 62/139   Parked: 0
Batches, in order: tribal, renaissance, farmer, medieval, farmer:re, ancient, viking, dynasty, pirate, spooky, wild_west, legacy_1, legacy_2, good, evil, secret_1, secret_2, secret_3, secret_4

## Scoreboard (a b c d as + pass, - fail, ? unscored; status q queued, o open, D done, p parked)
tribal: clubber ++++ D | protector ++++ D | spear_thrower ++++ D | stoner ++++ D | bone_mage ++++ D | chieftain ++++ D | mammoth ++++ D
renaissance: painter ++++ D | fencer ++++ D | balloon_archer ++++ D | musketeer ++++ D | halberd ++++ D | jouster ++++ D | da_vinci_tank ++++ D
farmer: halfling ++++ D | farmer ++++ D | hay_baler ++++ D | potion_seller ++++ D | harvester ++++ D | wheelbarrow ++++ D | scarecrow ++++ D
medieval: bard ++++ D | squire ++++ D | archer ++++ D | healer ++++ D | knight ++++ D | catapult ++++ D | king ++++ D
ancient: shield_bearer ++++ D | sarissa ++++ D | hoplite ++++ D | snake_archer ++++ D | ballista ++++ D | minotaur ++++ D | zeus ++++ D
viking: headbutter ++++ D | ice_archer ++++ D | brawler ++++ D | berserker ++++ D | valkyrie ++++ D | longship ++++ D | jarl ++++ D
dynasty: samurai ++++ D | firework_archer ++++ D | monk ++++ D | ninja ++++ D | dragon ++++ D | hwacha ++++ D | monkey_king ++++ D
pirate: flintlock ++++ D | blunderbuss ++++ D | bomb_thrower ++++ D | harpooner ++++ D | cannon ++++ D | captain ++++ D | pirate_queen -+++ o
spooky: skeleton_warrior ++++ D | skeleton_archer ++++ D | candlehead ++++ D | vampire ++++ D | pumpkin_catapult ++++ D | swordcaster ++++ D | reaper ++++ D
wild_west: dynamite_thrower --++ o | miner ---+ o | cactus -+-+ o | gunslinger --++ o | lasso ---+ o | deadeye --++ o | quick_draw ---+ o
legacy_1: peasant ???? q | banner_bearer ???? q | poacher ???? q | blowdarter ???? q | pike ???? q | barrel_roller ???? q | boxer ???? q | flag_bearer ???? q
legacy_2: pharaoh ???? q | wizard ???? q | chariot ???? q | thor ???? q | tank ???? q | super_boxer ???? q | dark_peasant ???? q | super_peasant ???? q
good: devout_gauntlet ???? q | celestial_aegis ???? q | radiant_glaive ???? q | righteous_paladin ???? q | divine_arbiter ???? q | sacred_elephant ???? q | chronomancer ???? q
evil: shadow_walker ???? q | exiled_sentinel ???? q | mad_mechanic ???? q | void_cultist ???? q | tempest_lich ???? q | death_bringer ???? q | void_monarch ???? q
secret_1: ballooner ???? q | bomb_on_a_stick ???? q | fan_bearer ???? q | raptor ???? q | the_teacher ???? q | jester ???? q | ball_n_chain ???? q | chu_ko_nu ???? q | executioner ???? q | shouter ???? q
secret_2: taekwondo ???? q | raptor_rider ???? q | cheerleader ???? q | cupid ???? q | mace_spinner ???? q | clams ???? q | present_elf ???? q | ice_mage ???? q | infernal_whip ???? q | bank_robbers ???? q
secret_3: witch ???? q | banshee ???? q | necromancer ???? q | solar_architect ???? q | wheelbarrow_dragon ???? q | skeleton_giant ???? q | bomb_cannon ???? q | cavalry ???? q | vlad ???? q | gatling_gun ???? q
secret_4: blackbeard ???? q | samurai_giant ???? q | ullr ???? q | lady_red_jade ???? q | sensei ???? q | shogun ???? q | tree_giant ???? q | artemis ???? q | ice_giant ???? q

## Focus (every gap this iteration: tag, unit, gap, sha, verdict; the line ends in `- <approved>/<total>, <struck> struck`)
444 (BASE 43d77906; tail overlap: wild_west audited, stats 7aee94dc d 7/7): [S] reaper c.1 burst on the impale (49fad4e0) struck 1, c PASS | [S] vampire c.2 VAMPIRE_LATCH (9e904930) struck 2, c PASS | [S] vampire a.4 V + belt band (681b8603, d1b8f3f4) struck 4, a PASS | [S] pumpkin a.1 black wheels (d50fe07b) struck 1, a PASS | [R] queen a.2 QUEEN_LEGLINE (c71c375a, 9e30f921, c4daf42f) rejected (reverted 4732b8ca, 7dcec775, cfaefef5) | [S] gunslinger c.1 BULLET_RAIN (0e73eb2a) struck 1, c PASS | CONFIRM vampire, reaper, pumpkin passed all (D); spooky checkpoint 12/12 GREEN - 5/6, 5 struck
443 (BASE dd2f8916): [S] warrior b.1 (a18d0a6f) struck 1 | [S] archer b.1 (3471ec43) struck 1 | [S] pumpkin a.2 (1992ee2c) struck 2 | [S] reaper c.3 (b111a980) struck 3 | [S] vampire a.4 (67ad1643) approved | CONFIRM warrior, archer D - 5/5, 4 struck
## Last verdicts (critic header lines verbatim)
- GAP: [S] spooky.reaper (49fad4e0) VERDICT: APPROVE CRITERION: spooky.reaper.c PASS   (previous: FAIL)
- GAP: [S] spooky.vampire (9e904930) VERDICT: APPROVE CRITERION: spooky.vampire.c PASS   (previous: FAIL)
- GAP: [S] spooky.vampire (681b8603, d1b8f3f4) VERDICT: APPROVE CRITERION: spooky.vampire.a PASS   (previous: FAIL)
- GAP: [S] spooky.pumpkin_catapult (d50fe07b) VERDICT: APPROVE CRITERION: spooky.pumpkin_catapult.a PASS   (previous: FAIL)
- GAP: [R] pirate.pirate_queen (c71c375a, 9e30f921, c4daf42f) VERDICT: REJECT CRITERION: pirate.pirate_queen.a FAIL   (previous: FAIL)
- GAP: [S] wild_west.gunslinger (0e73eb2a) VERDICT: APPROVE CRITERION: wild_west.gunslinger.c PASS   (previous: FAIL)
- REGRESSIONS: none
- CONFIRM spooky.vampire: a PASS b PASS c PASS d PASS (4/4); spooky.reaper: a PASS b PASS c PASS d PASS (4/4); spooky.pumpkin_catapult: a PASS b PASS c PASS d PASS (4/4)
## Notes for next iteration (max 5 lines)
- Queen a plateau, [R] rejected once (444): the next [R] (one more reject parks a) rebuilds the leg chain per the 444 critic NEXT in her unit file: pelvis foot up, legs ~1, knee ~.3 of height, boots at the knee, skirt to ~.55; probe_bbox first.
- wild_west audited 444 (audit at output/loop/iter-444/audit.md): pick from the unit files' Ranked gaps (lasso c grab, cactus c needles, quick_draw c dodge, miner b pickaxe lead).
- 444: a revert that conflicts only on an adjacent context line was resolved by hand (proceduralAnimation GUNS_UP beside QUEEN_GUARD), not kept.
- Captures run ~5 s a shot: background 4+ units and wait with an until-loop on the log; never end the turn while waiting on a background agent.
## Unit file template (loop/units/<id>.md, cap 3200 bytes)
```
# <unitId>
Status: open|done|parked   Audited: <iter>   Done: <iter or ->
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (0 since <iter>)
 1. <element> in unit_<id>_<shot> - TABS: <what the reference shows> (ref: <file or card section>)
b PASS (<iter>)
c FAIL (0 since <iter>) [plateau|parked when marked]
 1. missing: <mechanic>
d PASS|FAIL (<the stats.json line, shortened>)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] <criterion> <gap> - blocker <n>: <mechanism> - ref: <file> - ours: <png>
## Attempts (iter | gap | criterion | verdict: approved, rejected, rejected-kept, dropped)
## Rejected (last 4: gap [tag] [attempts] - iter: what - critic's top defect)
## Notes (max 3 lines)
```
