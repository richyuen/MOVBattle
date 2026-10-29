# Loop state (v4: one batch at a time, up to 7 structural gaps per iteration, a CONFIRM critic before D, evidence commits outside the 7)
Iteration: 404   Batch: ancient+viking (6-7/19)   Consecutive empty: 0   Done: 33/139   Parked: 1
Batches, in order: tribal, renaissance, farmer, medieval, farmer:re, ancient, viking, dynasty, pirate, spooky, wild_west, legacy_1, legacy_2, good, evil, secret_1, secret_2, secret_3, secret_4

## Scoreboard (a b c d as + pass, - fail, ? unscored; status q queued, o open, D done, p parked)
tribal: clubber ++++ D | protector ++++ D | spear_thrower ++++ D | stoner ++++ D | bone_mage ++++ D | chieftain ++++ D | mammoth ++++ D
renaissance: painter ++++ D | fencer ++++ D | balloon_archer ++++ D | musketeer ++++ D | halberd ++++ D | jouster ++++ D | da_vinci_tank ++++ D
farmer: halfling ++++ D | farmer ++++ D | hay_baler ++++ D | potion_seller ++++ D | harvester ++++ D | wheelbarrow -+++ p | scarecrow ++++ D
medieval: bard ++++ D | squire ++++ D | archer ++++ D | healer ++++ D | knight ++++ D | catapult ++++ D | king ++++ D
ancient: shield_bearer ++++ D | sarissa ++++ D | hoplite ++++ D | snake_archer ++++ D | ballista ++++ D | minotaur -+++ o | zeus -+++ o
viking: headbutter -+++ o | ice_archer -+++ o | brawler -+++ o | berserker ++++ D | valkyrie +-++ o | longship -+++ o | jarl -+++ o
dynasty: samurai ???? q | firework_archer ???? q | monk ???? q | ninja ???? q | dragon ???? q | hwacha ???? q | monkey_king ???? q
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
404 (BASE 244af97): RE-AUDIT halfling a.1 struck, a PASS, CONFIRM agreed -> halfling D | [S] valkyrie a.4 belt off torsoMesh (670efeb) approved, a PASS; CONFIRM agreed a, failed b (blade length, gold guard) | [S] headbutter a.3 band off the eye tops (47ca693) approved, struck 3 | [S] jarl a.3 forearm wraps (9e3df06) approved, struck 3 | [S] longship a.1 rails timber (e3fd388) approved, struck 1 | [S] ice_archer a.2 brawlerLegs (db12da9) approved, struck 2+3 | [S] minotaur a.1 wedge plate (3c3a808 + 53b63d0) approved, struck 1 | [R] brawler skipped (see Notes) | farmer:re checkpoint 12/12 green - 6/6, 8 struck
403 (BASE 73e45c7): evidence jarl lineup + ice archer idle (88e3f00), halfling idle .2 (94a7f14) | [R] wheelbarrow REJECTED -> parked | [S] longship c.2, minotaur a.4, valkyrie a.4 split, jarl a.1, ice_archer a.1, headbutter a.1 approved; CONFIRM failed longship a, minotaur a - 6/7, 8 struck

## Last verdicts (critic header lines verbatim)
- GAP: [S] viking.valkyrie (670efeb) VERDICT: APPROVE CRITERION: viking.valkyrie.a PASS (previous: FAIL)
- GAP: [S] viking.headbutter (47ca693) VERDICT: APPROVE CRITERION: viking.headbutter.a FAIL (previous: FAIL)
- GAP: [S] viking.jarl (9e3df06) VERDICT: APPROVE CRITERION: viking.jarl.a FAIL (previous: FAIL)
- GAP: [S] viking.longship (e3fd388) VERDICT: APPROVE CRITERION: viking.longship.a FAIL (previous: FAIL)
- GAP: [S] viking.ice_archer (db12da9) VERDICT: APPROVE CRITERION: viking.ice_archer.a FAIL (previous: FAIL)
- GAP: [S] ancient.minotaur (3c3a808 + 53b63d0) VERDICT: APPROVE CRITERION: ancient.minotaur.a FAIL (previous: FAIL)
- CONFIRM farmer.halfling a PASS | b PASS | c PASS | d PASS -> D; CONFIRM viking.valkyrie a PASS | b FAIL | c PASS | d PASS -> open, b takes the confirmer's list (0 since 404)
- REGRESSIONS: none

## Notes for next iteration (max 5 lines)
- 405: zeus.a STARVES (last attempt 400): its blocker 3 (the bolt emblem reads red-pink not orange-gold) takes a slot; it is colour-only, so render a --noglow swatch (probe_close --aim=y:1.15) for the critic.
- [R] brawler skipped at 404: probe_bbox puts his board flat at belly height in the torso frame (y .24-.41, z -.14..+.73), so a beard below y .41 sits under it in _idle; the [R] must hang the bib in front of z .73 or lift it - decide before writing (it starves at 407).
- Next ranked [S]: jarl a.4 (brawlerLegs call, one line); ice_archer a.4 (dark riveted cap band); longship a.2 (full team shield faces); minotaur a.2 (a sash proud of the hunched head); headbutter a.2 (BRAWLER_LEGS cut, cuffs to mid-shin); valkyrie b.1 (long blade) / b.2 (gold winged guard).
- The CONFIRM failed a proposed-done unit in 402, 403 and on valkyrie b in 404: the gap critic's PASS is not a done.

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
