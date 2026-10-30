# Loop state (v5: one batch at a time, up to 7 structural gaps per iteration, a CONFIRM critic before D and two CONFIRM fails make a plateau, the critic sees the diff and never the worker's words, the capture frames a unit by its mesh top)
Iteration: 419   Batch: ancient+dynasty (6,8/19)   Consecutive empty: 0   Done: 42/139   Parked: 1
Batches, in order: tribal, renaissance, farmer, medieval, farmer:re, ancient, viking, dynasty, pirate, spooky, wild_west, legacy_1, legacy_2, good, evil, secret_1, secret_2, secret_3, secret_4

## Scoreboard (a b c d as + pass, - fail, ? unscored; status q queued, o open, D done, p parked)
tribal: clubber ++++ D | protector ++++ D | spear_thrower ++++ D | stoner ++++ D | bone_mage ++++ D | chieftain ++++ D | mammoth ++++ D
renaissance: painter ++++ D | fencer ++++ D | balloon_archer ++++ D | musketeer ++++ D | halberd ++++ D | jouster ++++ D | da_vinci_tank ++++ D
farmer: halfling ++++ D | farmer ++++ D | hay_baler ++++ D | potion_seller ++++ D | harvester ++++ D | wheelbarrow -+++ p | scarecrow ++++ D
medieval: bard ++++ D | squire ++++ D | archer ++++ D | healer ++++ D | knight ++++ D | catapult ++++ D | king ++++ D
ancient: shield_bearer ++++ D | sarissa ++++ D | hoplite ++++ D | snake_archer ++++ D | ballista ++++ D | minotaur -+++ o | zeus ++++ D
viking: headbutter ++++ D | ice_archer ++++ D | brawler ++++ D | berserker ++++ D | valkyrie ++++ D | longship ++++ D | jarl ++++ D
dynasty: samurai -+++ o | firework_archer ---+ o | monk ++++ D | ninja ++++ D | dragon ---+ o | hwacha -+++ o | monkey_king -+++ o
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
419 (BASE f1bce224): [S] hwacha c.2 launch smoke (eab9d337) c PASS | [S] hwacha a.4 shafts + timber bed (3d8cd05d) struck 4 | [S] dragon c.2 body flames (70c80e29) c PASS | [S] dragon a.5 tongue (aff1befb) a PASS; CONFIRM 419 failed a, b, c | [S] samurai a.2 cuirass (95700a8c) struck 2 | [S] firework_archer b.2 fat rocket (efc224ec) struck 2 - 6/6, 6 struck
418 (BASE c775966c): firework burst + nock, dragon poles, samurai block (c PASS), monkey_king launch (c PASS), brawler lunge (D), hwacha wheels - 7/7
## Last verdicts (critic header lines verbatim)
- GAP: [S] dynasty.hwacha (eab9d337) VERDICT: APPROVE CRITERION: dynasty.hwacha.c PASS (previous: FAIL)
- GAP: [S] dynasty.hwacha (3d8cd05d) VERDICT: APPROVE CRITERION: dynasty.hwacha.a FAIL (previous: FAIL)
- GAP: [S] dynasty.dragon (70c80e29) VERDICT: APPROVE CRITERION: dynasty.dragon.c PASS (previous: FAIL)
- GAP: [S] dynasty.dragon (aff1befb) VERDICT: APPROVE CRITERION: dynasty.dragon.a PASS (previous: FAIL)
- GAP: [S] dynasty.samurai (95700a8c) VERDICT: APPROVE CRITERION: dynasty.samurai.a FAIL (previous: FAIL)
- GAP: [S] dynasty.firework_archer (efc224ec) VERDICT: APPROVE CRITERION: dynasty.firework_archer.b FAIL (previous: FAIL)
- CONFIRM dynasty.dragon a FAIL | b FAIL | c FAIL | d PASS -> open (new lists)
- REGRESSIONS: none

## Notes for next iteration (max 5 lines)
- 420 first: RE-AUDIT dragon a, b, c and monkey_king a, b, c (the 419 review's capture tool frames a unit by its mesh top: the dragon's shots now show the head and mouth, rig 5.70 m; the monkey king's tail pulls his frame back, rig 3.80 m; the other four open units' rigs are unchanged). The [R] slot is minotaur a (plateau: CONFIRM failed 403, 405, 408, 415; starving), specified from those four lists: size toward 1.2x, a thin flat strap, a wide team girdle, one arm-wide shoulder cap. Viking's checkpoint ran at the review (12/12 green) and viking left Batch.
- Starving at 421: monkey_king a (last 416). Next ranked: dragon carriers with arms/heads, breath plume, ribbon; samurai a hakama / kabuto; firework b upright bow / c full draw / a legs; hwacha a timber (palette, --noglow); monkey_king a face / headgear.
- The samurai spars with an archer (evidence 417); the monkey king starts at 8 m (jump_charge makes him a charger).
- A world-posed rest (_restIceBow, _restKatana, _restNorseBoard) must clear rotationQuaternion outside the rest; the monkey king rides _restMonkBo via the "monkBoHolder" holder.
- Shared props changed for batch units carry to later batches: katana (light steel 416) is also on Secret teacher, samurai_giant, shogun.

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
