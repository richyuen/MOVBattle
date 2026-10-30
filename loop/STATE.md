# Loop state (v5: one batch at a time, up to 7 structural gaps per iteration, a CONFIRM critic before D and two CONFIRM fails make a plateau, the critic sees the diff and never the worker's words, the capture frames a unit by its mesh top)
Iteration: 421   Batch: dynasty (8/19)   Consecutive empty: 0   Done: 46/139   Parked: 1
Batches, in order: tribal, renaissance, farmer, medieval, farmer:re, ancient, viking, dynasty, pirate, spooky, wild_west, legacy_1, legacy_2, good, evil, secret_1, secret_2, secret_3, secret_4

## Scoreboard (a b c d as + pass, - fail, ? unscored; status q queued, o open, D done, p parked)
tribal: clubber ++++ D | protector ++++ D | spear_thrower ++++ D | stoner ++++ D | bone_mage ++++ D | chieftain ++++ D | mammoth ++++ D
renaissance: painter ++++ D | fencer ++++ D | balloon_archer ++++ D | musketeer ++++ D | halberd ++++ D | jouster ++++ D | da_vinci_tank ++++ D
farmer: halfling ++++ D | farmer ++++ D | hay_baler ++++ D | potion_seller ++++ D | harvester ++++ D | wheelbarrow -+++ p | scarecrow ++++ D
medieval: bard ++++ D | squire ++++ D | archer ++++ D | healer ++++ D | knight ++++ D | catapult ++++ D | king ++++ D
ancient: shield_bearer ++++ D | sarissa ++++ D | hoplite ++++ D | snake_archer ++++ D | ballista ++++ D | minotaur ++++ D | zeus ++++ D
viking: headbutter ++++ D | ice_archer ++++ D | brawler ++++ D | berserker ++++ D | valkyrie ++++ D | longship ++++ D | jarl ++++ D
dynasty: samurai ++++ D | firework_archer ++++ D | monk ++++ D | ninja ++++ D | dragon --++ o | hwacha ++++ D | monkey_king -+++ o
pirate: flintlock ???? q | blunderbuss ???? q | bomb_thrower ???? q | harpooner ???? q | cannon ???? q | captain ???? q | pirate_queen ???? q
spooky: skeleton_warrior ???? q | skeleton_archer ???? q | candlehead ???? q | vampire ???? q | pumpkin_catapult ???? q | swordcaster ???? q | reaper ???? q
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
421 (BASE 7f580c19): [S] dragon c.1 breath plume (ba799e89, 8027d61c) struck 1, c PASS | [S] dragon a.2 ribbon body (0a4f9754, 87e08299) struck 2, added 5 | [P] dragon b.1 fists in skin (91a86b90) REJECTED ledger reversal, reverted bf5051cd | [S] samurai a.1 shikoro + maedate (a810cff1) struck 1, a PASS, CONFIRM passed - D | [S] firework_archer a.4 shin wraps + sandals (1801625a) struck 4, a PASS, CONFIRM passed - D | [S] monkey_king a.2 baboon face (2dc865d6) struck 2 - 5/6, 6 struck
420 (BASE a1460c56; RE-AUDIT dragon + monkey_king on the mesh-top frames; starvation: minotaur a): [R] minotaur a (637255a6, 4eb34cd7) struck 1-4, a PASS, CONFIRM passed - D | [S] samurai a.3 hakama + greaves (69c590af) struck 3, 4 | [S] firework_archer c.3 full draw (1cb514fd) c PASS | [S] firework_archer b.1 upright bow (59a5baca) b PASS | [S] monkey_king a.1 circlet + feathers (6c4aff46) struck 1 | [S] dragon a.1 carrier heads (0f7dd79c) struck 1 | [P] hwacha a.2 timber (3d24020e) a PASS, CONFIRM passed - D; ancient checkpoint 12/12 - 7/7, 11 struck
## Last verdicts (critic header lines verbatim)
- GAP: [S] dynasty.dragon (ba799e89, 8027d61c) VERDICT: APPROVE CRITERION: dynasty.dragon.c PASS (previous: FAIL)
- GAP: [S] dynasty.dragon (0a4f9754, 87e08299) VERDICT: APPROVE CRITERION: dynasty.dragon.a FAIL (previous: FAIL)
- GAP: [P] dynasty.dragon (91a86b90) VERDICT: REJECT CRITERION: dynasty.dragon.b FAIL (previous: FAIL)
- GAP: [S] dynasty.samurai (a810cff1) VERDICT: APPROVE CRITERION: dynasty.samurai.a PASS (previous: FAIL)
- GAP: [S] dynasty.firework_archer (1801625a) VERDICT: APPROVE CRITERION: dynasty.firework_archer.a PASS (previous: FAIL)
- GAP: [S] dynasty.monkey_king (2dc865d6) VERDICT: APPROVE CRITERION: dynasty.monkey_king.a FAIL (previous: FAIL)
- CONFIRM dynasty.samurai a PASS b PASS c PASS d PASS -> D; dynasty.firework_archer a PASS b PASS c PASS d PASS -> D
- REGRESSIONS: none

## Notes for next iteration (max 5 lines)
- 422 CUT OFF after step 4 (usage limit): resume 422 at step 5, not a new iteration. Done: 422.0 pirate stats (dcac7be0, d PASS 7/7), pirate AUDIT saved at output/loop/iter-422/audit.md (copy it first: the step-5 capture wipes iter-422; no pirate unit files written yet), [S] dragon b.1 grip (bf9ce7a9), [S] dragon a.5 band on edge (e7926245), [S] monkey_king a.3 shorts (8db34616 + b9adb0a3), [S] monkey_king a.4 robe (6ff201bb); all four elements seen in the look. LEDGER rows/attempts are `pending`. Left: capture --iter 422 --units dynasty.dragon,dynasty.monkey_king, critic, verdicts (CONFIRM monkey_king if a flips), 7 pirate unit files from the audit, Batch: dynasty+pirate, docs commit. No pirate gap picked; blunderbuss and pirate_queen need evidence commits first (shooter out of frame at 200 ms; the queen never outnumbered).
- Pickable [S] in dynasty: dragon b.1 carrier grip pose, dragon a.5 ribbon on edge, monkey_king a.3 puffy shorts + shoes, a.4 half robe (3 under the 2-per-unit limit, so the 4th is allowed and the pirate audit (tail overlap) runs at step 2: `Batch: dynasty+pirate`). [P] on offer: FLAME_JET.lobe .4 (ba799e89; c already PASS).
- Starving: dragon b at 424 (last attempt 421, the rejected [P]); dragon a.3/a.4 and the monkey robe have never been attempted, they fall under the a criterion's starvation only.
- Critic 421: a [P] that re-nudges a row approved in the last 20 iterations is a ledger reversal even when the critic itself listed it as fallout (dragon fists): a listed fallout [P] still needs a row older than 20 iterations or its own [S]. The dragon's b fix is a pose (pole foot at the chest, two-box arms in the trouser shade), not colours.
- The monkey king starts at 8 m (jump_charge makes him a charger) and rides _restMonkBo via "monkBoHolder"; his tan tunic is the generic trunk dress, the robe gap must cut it back to the right side. World-posed rests (_restIceBow, _restKatana, _restNorseBoard) clear rotationQuaternion outside the rest.
- Shared props changed for batch units carry to later batches: katana (light steel 416) is also on Secret teacher, samurai_giant, shogun; the hwacha timber is its own material (HWACHA_TIMBER), the pumpkin catapult and bomb cannon keep the wood preset; strapSandals (ancientDress) now dresses the firework archer too.

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
