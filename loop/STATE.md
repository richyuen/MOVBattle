# Loop state (v6: one batch at a time, up to 7 structural gaps per iteration, a CONFIRM critic before D and two CONFIRM fails make a plateau, a criterion a CONFIRM passed stays passed, the critic sees the diff and never the worker's words, the capture frames a unit by its mesh top)
Iteration: 442   Batch: pirate+spooky (10/19)   Consecutive empty: 0   Done: 57/139   Parked: 0
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
spooky: skeleton_warrior +-++ o | skeleton_archer +-++ o | candlehead ++++ D | vampire -+-+ o | pumpkin_catapult -+++ o | swordcaster ++++ D | reaper ++-+ o
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
442 (BASE 100f6660; evidence fd81737e reaper ABILITY_PREF impale): [S] reaper c.2 REAPER_IMPALE (c350e411, 56eae583) struck 2, added 3 | [S] SKELETON_BONE unlit cream (21f0bc9a) archer a.3, warrior a.2, reaper a.3 struck, all three a PASS | [S] pumpkin a.3 PUMPKIN_POSTS (4a2e5f3b) struck 3 | [S] vampire a.4 cape gap + long V (8e29a2cb) rejected (reverted 9ef221d0) | [S] queen a.2 wrap hem + pale pelvis (af6e49fd, 6eb18db0) dropped (hidden behind the guards) | CONFIRM archer, warrior passed a, c; failed b - 5/7, 5 struck
441 (BASE a46e87b8; no evidence commit): [S] skeleton_archer a.3 shared SKELETON_BONE (00099cf7) rejected-kept (revert conflicted) | [S] skeleton_warrior a.5 knee bone (c2ca5852) struck 5 | [S] pumpkin_catapult a.1 PUMPKIN_TIMBER (fcb568a7) struck 1, a PASS | [S] reaper a.4 REAPER_ROBE (0d48da55) struck 4 | [S] vampire a.4 VAMPIRE_VEST (76405fb2) 4's arms clause struck | [S] queen a.2 legs + skirt cut (72e9e80d, 52d68fdd) rejected (reverted 6f6d8b79, f7540111) | pumpkin CONFIRM failed a (3 new blockers), passed b, c - 4/6, 4 struck
## Last verdicts (critic header lines verbatim)
- GAP: [S] spooky.reaper (c350e411, 56eae583) VERDICT: APPROVE CRITERION: spooky.reaper.c FAIL   (previous: FAIL)
- GAP: [S] spooky.skeleton_archer (21f0bc9a) VERDICT: APPROVE CRITERION: spooky.skeleton_archer.a PASS   (previous: FAIL)
- GAP: [S] spooky.skeleton_warrior (21f0bc9a) VERDICT: APPROVE CRITERION: spooky.skeleton_warrior.a PASS   (previous: FAIL)
- GAP: [S] spooky.reaper (21f0bc9a) VERDICT: APPROVE CRITERION: spooky.reaper.a PASS   (previous: FAIL)
- GAP: [S] spooky.pumpkin_catapult (4a2e5f3b) VERDICT: APPROVE CRITERION: spooky.pumpkin_catapult.a FAIL   (previous: FAIL)
- GAP: [S] spooky.vampire (8e29a2cb) VERDICT: REJECT CRITERION: spooky.vampire.a FAIL   (previous: FAIL)
- REGRESSIONS: none
- CONFIRM spooky.skeleton_archer: a PASS b FAIL c PASS d PASS (3/4); spooky.skeleton_warrior: a PASS b FAIL c PASS d PASS (3/4)
## Notes for next iteration (max 5 lines)
- Skeletons a PASS now (shared bone flat unlit, CONFIRM 442); both failed b at CONFIRM: archer bow upright behind the head at the windup, warrior shield flat like a tray. Those b lists are new (0 since 442).
- Reaper c.3: hang the man higher beside the shoulder and root a thicker spear on a back tendril (probe_impale.mjs shows positions). Vampire c (attempts 2) starves at 444.
- Queen a is plateau: next pick one [R]: hem, pelvis seat, boot top AND the QUEEN_GUARD rest together (the band sits behind the sword guards in _idle).
- Pumpkin a: no cw cube, dark wheels (both on options.spooky only). Vampire a.4: SHORT V notch on a team vest slab (critic 442 NEXT).
- Captures run ~5 s a shot (6 units ~7 min): background them and wait with an until-loop on the log.
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
