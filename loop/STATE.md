# Loop state (v4: one batch at a time, up to 7 structural gaps per iteration, a CONFIRM critic before D, evidence commits outside the 7)
Iteration: 418   Batch: ancient+viking+dynasty (6-8/19)   Consecutive empty: 0   Done: 42/139   Parked: 1
Batches, in order: tribal, renaissance, farmer, medieval, farmer:re, ancient, viking, dynasty, pirate, spooky, wild_west, legacy_1, legacy_2, good, evil, secret_1, secret_2, secret_3, secret_4

## Scoreboard (a b c d as + pass, - fail, ? unscored; status q queued, o open, D done, p parked)
tribal: clubber ++++ D | protector ++++ D | spear_thrower ++++ D | stoner ++++ D | bone_mage ++++ D | chieftain ++++ D | mammoth ++++ D
renaissance: painter ++++ D | fencer ++++ D | balloon_archer ++++ D | musketeer ++++ D | halberd ++++ D | jouster ++++ D | da_vinci_tank ++++ D
farmer: halfling ++++ D | farmer ++++ D | hay_baler ++++ D | potion_seller ++++ D | harvester ++++ D | wheelbarrow -+++ p | scarecrow ++++ D
medieval: bard ++++ D | squire ++++ D | archer ++++ D | healer ++++ D | knight ++++ D | catapult ++++ D | king ++++ D
ancient: shield_bearer ++++ D | sarissa ++++ D | hoplite ++++ D | snake_archer ++++ D | ballista ++++ D | minotaur -+++ o | zeus ++++ D
viking: headbutter ++++ D | ice_archer ++++ D | brawler ++++ D | berserker ++++ D | valkyrie ++++ D | longship ++++ D | jarl ++++ D
dynasty: samurai -+++ o | firework_archer ---+ o | monk ++++ D | ninja ++++ D | dragon -+-+ o | hwacha -+-+ o | monkey_king -+++ o
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
418 (BASE c775966c; starvation: firework_archer b, c, brawler c): [S] firework_archer c.2 burst (ceb67f2b, 20d32730; evidence 79d583da) struck 2 | [S] firework_archer b.2 nocked rocket (e9d4c966, 88c49c12) none struck: too thin | [P] dragon b.1 poles (e5fcbad5) b PASS | [S] samurai c.2 block at his blade (073a4c36, 33baf14d) c PASS | [S] monkey_king c.2 launch (0c817d95) c PASS | [S] brawler c.1 lunge (3c3337d0; evidence ff56094b) c PASS, CONFIRM passed - D | [S] hwacha a.3 wheels (914ede94) struck 3 - 7/7, 6 struck
417 (BASE e57c589c): monk knockback (D), monkey_king jump, firework robe + sash, dragon head 2x + carriers, samurai block - 6/6
## Last verdicts (critic header lines verbatim)
- GAP: [S] dynasty.firework_archer (ceb67f2b + 20d32730; evidence 79d583da) VERDICT: APPROVE CRITERION: dynasty.firework_archer.c FAIL (previous: FAIL)
- GAP: [S] dynasty.firework_archer (e9d4c966 + 88c49c12) VERDICT: APPROVE CRITERION: dynasty.firework_archer.b FAIL (previous: FAIL)
- GAP: [P] dynasty.dragon (e5fcbad5) VERDICT: APPROVE CRITERION: dynasty.dragon.b PASS (previous: FAIL)
- GAP: [S] dynasty.samurai (073a4c36 + 33baf14d) VERDICT: APPROVE CRITERION: dynasty.samurai.c PASS (previous: FAIL)
- GAP: [S] dynasty.monkey_king (0c817d95) VERDICT: APPROVE CRITERION: dynasty.monkey_king.c PASS (previous: FAIL)
- GAP: [S] viking.brawler (3c3337d0; evidence ff56094b) VERDICT: APPROVE CRITERION: viking.brawler.c PASS (previous: FAIL)
- GAP: [S] dynasty.hwacha (914ede94) VERDICT: APPROVE CRITERION: dynasty.hwacha.a FAIL (previous: FAIL)
- CONFIRM viking.brawler a PASS | b PASS | c PASS | d PASS -> D
- REGRESSIONS: none

## Notes for next iteration (max 5 lines)
- Starving at 419+: dragon c (last 416: starving at 421), minotaur a (last 415: starving at 420), dragon a / monkey_king a / hwacha c (last 416-417). Next ranked: hwacha c smoke / a shafts; dragon c burning target / a tongue; firework c release pose (full draw) / b fat rocket rebuild (values free) / a legs; samurai a cuirass / hakama; monkey_king a face / headgear; minotaur a scale + sash.
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
