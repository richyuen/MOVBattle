# Loop state (v6: one batch at a time, up to 7 structural gaps per iteration, a CONFIRM critic before D and two CONFIRM fails make a plateau, a criterion a CONFIRM passed stays passed, the critic sees the diff and never the worker's words, the capture frames a unit by its mesh top)
Iteration: 441   Batch: pirate+spooky (10/19)   Consecutive empty: 0   Done: 57/139   Parked: 0
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
spooky: skeleton_warrior -+++ o | skeleton_archer -+++ o | candlehead ++++ D | vampire -+-+ o | pumpkin_catapult -+++ o | swordcaster ++++ D | reaper -+-+ o
wild_west: dynamite_thrower ???? q | miner ???? q | cactus ???? q | gunslinger ???? q | lasso ???? q | deadeye ???? q | quick_draw ???? q
legacy_1: peasant ???? q | banner_bearer ???? q | poacher ???? q | blowdarter ???? q | pike ???? q | barrel_roller ???? q | boxer ???? q | flag_bearer ???? q
legacy_2: pharaoh ???? q | wizard ???? q | chariot ???? q | thor ???? q | tank ???? q | super_boxer ???? q | dark_peasant ???? q | super_peasant ???? q
good: devout_gauntlet ???? q | celestial_aegis ???? q | radiant_glaive ???? q | righteous_paladin ???? q | divine_arbiter ???? q | sacred_elephant ???? q | chronomancer ???? q
evil: shadow_walker ???? q | exiled_sentinel ???? q | mad_mechanic ???? q | void_cultist ???? q | tempest_lich ???? q | death_bringer ???? q | void_monarch ???? q
secret_1: ballooner ???? q | bomb_on_a_stick ???? q | fan_bearer ???? q | raptor ???? q | the_teacher ???? q | jester ???? q | ball_n_chain ???? q | chu_ko_nu ???? q | executioner ???? q | shouter ???? q
secret_2: taekwondo ???? q | raptor_rider ???? q | cheerleader ???? q | cupid ???? q | mace_spinner ???? q | clams ???? q | present_elf ???? q | ice_mage ???? q | infernal_whip ???? q | bank_robbers ???? q
secret_3: witch ???? q | banshee ???? q | necromancer ???? q | solar_architect ???? q | wheelbarrow_dragon ???? q | skeleton_giant ???? q | bomb_cannon ???? q | cavalry ???? q | vlad ???? q | gatling_gun ???? q
secret_4: blackbeard ???? q | samurai_giant ???? q | ullr ???? q | lady_red_jade ???? q | sensei ???? q | shogun ???? q | tree_giant ???? q | artemis ???? q | ice_giant ???? q

## Focus (every gap this iteration: tag, unit, gap, sha, verdict; the line ends in `- <approved>/<total>, <struck> struck`)
441 (BASE a46e87b8; no evidence commit): [S] skeleton_archer a.3 shared SKELETON_BONE (00099cf7) rejected-kept (revert conflicted) | [S] skeleton_warrior a.5 knee bone (c2ca5852) struck 5 | [S] pumpkin_catapult a.1 PUMPKIN_TIMBER (fcb568a7) struck 1, a PASS | [S] reaper a.4 REAPER_ROBE (0d48da55) struck 4 | [S] vampire a.4 VAMPIRE_VEST (76405fb2) 4's arms clause struck | [S] queen a.2 legs + skirt cut (72e9e80d, 52d68fdd) rejected (reverted 6f6d8b79, f7540111) | pumpkin CONFIRM failed a (3 new blockers), passed b, c - 4/6, 4 struck
440 (BASE 93103dfd; no evidence commit): [S] pumpkin_catapult a.3 operator skull anchor (bc704fe0) struck 3 | [S] skeleton_warrior a.4 greaves (7c68a9f4, 1cdbda83) struck 4, added 5 | [S] skeleton_archer a.5 boot shafts (335a51ae) struck 5 | [S] candlehead a.4 knee boots (29284d0d) struck 4, 3 (lineup), a PASS | [S] vampire a.2 beard + fangs (c4c3d64f) struck 2 | [S] reaper a.2 long legs (b0c472fa) struck 2 | [R] queen a.1 QUEEN_BUILD (fba5bc29) struck 1, added 2 | candlehead CONFIRM passed a, b, c -> D - 7/7, 8 struck
## Last verdicts (critic header lines verbatim)
- GAP: [S] spooky.skeleton_archer (00099cf7) VERDICT: REJECT CRITERION: spooky.skeleton_archer.a FAIL   (previous: FAIL)
- GAP: [S] spooky.skeleton_warrior (c2ca5852) VERDICT: APPROVE CRITERION: spooky.skeleton_warrior.a FAIL   (previous: FAIL)
- GAP: [S] spooky.pumpkin_catapult (fcb568a7) VERDICT: APPROVE CRITERION: spooky.pumpkin_catapult.a PASS   (previous: FAIL)
- GAP: [S] spooky.reaper (0d48da55) VERDICT: APPROVE CRITERION: spooky.reaper.a FAIL   (previous: FAIL)
- GAP: [S] spooky.vampire (76405fb2) VERDICT: APPROVE CRITERION: spooky.vampire.a FAIL   (previous: FAIL)
- GAP: [S] pirate.pirate_queen (72e9e80d, 52d68fdd) VERDICT: REJECT CRITERION: pirate.pirate_queen.a FAIL   (previous: FAIL)
- REGRESSIONS: none
- CONFIRM spooky.pumpkin_catapult: a FAIL b PASS c PASS d PASS (3/4)
## Notes for next iteration (max 5 lines)
- Bone colour (archer a.3, warrior a.2, reaper a.3) is one fix in spookyDress SKELETON_BONE / skeletonBone() (kept, rejected-kept 441): the cloth self-lit (1,.86,.6) swatched grey; try "unlit" or a saturated warm value off palette.png's right wall, judge on the --noglow swatch (target shins ~220/195/160).
- Reaper c starves NOW (442, last 436): weak = target max hp < ~.15 of his (squire 189 vs 1939, no evidence commit); a held-aloft state is new code (applyBlastLaunch only throws). Vampire c (attempts 2) starves at 444.
- Queen a.2: the critic wants a pale thigh shell hip-to-knee and the boot top seated on the knee joint; QUEEN_FRAME legs/tall are a 440 approved row (re-tuning them read as a ledger reversal).
- Pumpkin a (CONFIRM 441 list): upright posts for the A-frame, drop the cw cube, wheels dark; all gated on options.spooky (medieval catapult is D).
- Captures run ~5 s a shot (6 units ~7 min): background them and wait with a Monitor until-loop on the log.
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
