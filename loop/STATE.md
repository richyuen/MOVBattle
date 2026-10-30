# Loop state (v5: one batch at a time, up to 7 structural gaps per iteration, a CONFIRM critic before D and two CONFIRM fails make a plateau, the critic sees the diff and never the worker's words, the capture frames a unit by its mesh top)
Iteration: 420   Batch: dynasty (8/19)   Consecutive empty: 0   Done: 44/139   Parked: 1
Batches, in order: tribal, renaissance, farmer, medieval, farmer:re, ancient, viking, dynasty, pirate, spooky, wild_west, legacy_1, legacy_2, good, evil, secret_1, secret_2, secret_3, secret_4

## Scoreboard (a b c d as + pass, - fail, ? unscored; status q queued, o open, D done, p parked)
tribal: clubber ++++ D | protector ++++ D | spear_thrower ++++ D | stoner ++++ D | bone_mage ++++ D | chieftain ++++ D | mammoth ++++ D
renaissance: painter ++++ D | fencer ++++ D | balloon_archer ++++ D | musketeer ++++ D | halberd ++++ D | jouster ++++ D | da_vinci_tank ++++ D
farmer: halfling ++++ D | farmer ++++ D | hay_baler ++++ D | potion_seller ++++ D | harvester ++++ D | wheelbarrow -+++ p | scarecrow ++++ D
medieval: bard ++++ D | squire ++++ D | archer ++++ D | healer ++++ D | knight ++++ D | catapult ++++ D | king ++++ D
ancient: shield_bearer ++++ D | sarissa ++++ D | hoplite ++++ D | snake_archer ++++ D | ballista ++++ D | minotaur ++++ D | zeus ++++ D
viking: headbutter ++++ D | ice_archer ++++ D | brawler ++++ D | berserker ++++ D | valkyrie ++++ D | longship ++++ D | jarl ++++ D
dynasty: samurai -+++ o | firework_archer -+++ o | monk ++++ D | ninja ++++ D | dragon ---+ o | hwacha ++++ D | monkey_king -+++ o
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
420 (BASE a1460c56; RE-AUDIT dragon + monkey_king on the mesh-top frames; starvation: minotaur a): [R] minotaur a scale + flat strap + girdle off the barrel + shoulder cap (637255a6, 4eb34cd7) struck 1-4, a PASS, CONFIRM passed - D | [S] samurai a.3 hakama + greaves (69c590af) struck 3, 4 | [S] firework_archer c.3 full draw (1cb514fd) c PASS | [S] firework_archer b.1 upright bow (59a5baca) b PASS | [S] monkey_king a.1 circlet + feathers (6c4aff46) struck 1 | [S] dragon a.1 carrier heads (0f7dd79c) struck 1 | [P] hwacha a.2 timber (3d24020e; swatch) a PASS, CONFIRM passed - D; ancient checkpoint 12/12 - 7/7, 11 struck
419 (BASE f1bce224): hwacha launch smoke (c PASS) + shafts, dragon body flames (c PASS) + tongue (a PASS; CONFIRM failed a, b, c), samurai cuirass, firework fat rocket - 6/6, 6 struck
## Last verdicts (critic header lines verbatim)
- GAP: [R] ancient.minotaur (637255a6, 4eb34cd7) VERDICT: APPROVE CRITERION: ancient.minotaur.a PASS (previous: FAIL)
- GAP: [S] dynasty.samurai (69c590af) VERDICT: APPROVE CRITERION: dynasty.samurai.a FAIL (previous: FAIL)
- GAP: [S] dynasty.firework_archer (1cb514fd) VERDICT: APPROVE CRITERION: dynasty.firework_archer.c PASS (previous: FAIL)
- GAP: [S] dynasty.firework_archer (59a5baca) VERDICT: APPROVE CRITERION: dynasty.firework_archer.b PASS (previous: FAIL)
- GAP: [S] dynasty.monkey_king (6c4aff46) VERDICT: APPROVE CRITERION: dynasty.monkey_king.a FAIL (previous: FAIL)
- GAP: [S] dynasty.dragon (0f7dd79c) VERDICT: APPROVE CRITERION: dynasty.dragon.a FAIL (previous: FAIL)
- GAP: [P] dynasty.hwacha (3d24020e) VERDICT: APPROVE CRITERION: dynasty.hwacha.a PASS (previous: FAIL)
- CONFIRM ancient.minotaur a PASS b PASS c PASS d PASS -> D; dynasty.hwacha a PASS b PASS c PASS d PASS -> D
- REGRESSIONS: none

## Notes for next iteration (max 5 lines)
- Pickable [S] in dynasty: dragon c breath plume / a ribbon body, monkey_king a baboon face / puffy shorts, samurai a flared shikoro + maedate, firework_archer a shin wraps (6); [P] fallout on offer: firework tip caps (59a5baca), dragon carrier fists in skin (0f7dd79c, aimed at b.1). Under 5 pickable means the pirate audit (tail overlap) runs at step 2.
- Starving at 423: firework_archer a (last 417); dragon b at 424 (last 418, [P] poles); dragon c at 425 (last 419).
- Critic 420 NEXTs worth a pick when ranked: the firework bow wants the ICE_NOCK split string so the draw pulls the string to the hand (release shows a straight string, a second rocket nocked while the first flies); the monkey king's feathers are rods (TABS tapered blades), the circlet wire-thin.
- The samurai spars with an archer (evidence 417); the monkey king starts at 8 m (jump_charge makes him a charger). A world-posed rest (_restIceBow incl. a bare stave with the carry mark via FIREWORK_REST, _restKatana, _restNorseBoard) must clear rotationQuaternion outside the rest; the monkey king rides _restMonkBo via "monkBoHolder".
- Shared props changed for batch units carry to later batches: katana (light steel 416) is also on Secret teacher, samurai_giant, shogun; the hwacha timber is its own material (HWACHA_TIMBER), the pumpkin catapult and bomb cannon keep the wood preset.

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
