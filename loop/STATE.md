# Loop state (v4: one batch at a time, up to 7 structural gaps per iteration, a CONFIRM critic before D, evidence commits outside the 7)
Iteration: 405   Batch: ancient+viking (6-7/19)   Consecutive empty: 0   Done: 33/139   Parked: 1
Batches, in order: tribal, renaissance, farmer, medieval, farmer:re, ancient, viking, dynasty, pirate, spooky, wild_west, legacy_1, legacy_2, good, evil, secret_1, secret_2, secret_3, secret_4

## Scoreboard (a b c d as + pass, - fail, ? unscored; status q queued, o open, D done, p parked)
tribal: clubber ++++ D | protector ++++ D | spear_thrower ++++ D | stoner ++++ D | bone_mage ++++ D | chieftain ++++ D | mammoth ++++ D
renaissance: painter ++++ D | fencer ++++ D | balloon_archer ++++ D | musketeer ++++ D | halberd ++++ D | jouster ++++ D | da_vinci_tank ++++ D
farmer: halfling ++++ D | farmer ++++ D | hay_baler ++++ D | potion_seller ++++ D | harvester ++++ D | wheelbarrow -+++ p | scarecrow ++++ D
medieval: bard ++++ D | squire ++++ D | archer ++++ D | healer ++++ D | knight ++++ D | catapult ++++ D | king ++++ D
ancient: shield_bearer ++++ D | sarissa ++++ D | hoplite ++++ D | snake_archer ++++ D | ballista ++++ D | minotaur -+++ o | zeus -+++ o
viking: headbutter -+++ o | ice_archer --++ o | brawler -+++ o | berserker ++++ D | valkyrie +-++ o | longship -+++ o | jarl -+++ o
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
405 (BASE 2477188): [S] jarl a.4 brawlerLegs (a3fb035) approved, struck 4 | [S] ice_archer a.4 riveted band (99ac4de) approved, a PASS; CONFIRM failed a, b (new lists) | [S] headbutter a.2 brawlerLegs (db2616f) approved, 2 stands | [S] valkyrie b.1 VALKYRIE_SWORD (2e4602e) approved, struck 1 | [S] longship a.2 shields (1bd1f2d) approved, struck 2 | [S] minotaur a.2 sash slab (946334f) approved, a PASS; CONFIRM failed a (new list) | [S] zeus a.3 emblem over the bloom (7738aea) approved, colour clause struck | [R] brawler skipped - 7/7, 6 struck
404 (BASE 244af97): RE-AUDIT halfling a.1 struck, a PASS, CONFIRM agreed -> halfling D | [S] valkyrie a.4 belt off torsoMesh (670efeb) approved, a PASS; CONFIRM agreed a, failed b (blade length, gold guard) | [S] headbutter a.3 band off the eye tops (47ca693) approved, struck 3 | [S] jarl a.3 forearm wraps (9e3df06) approved, struck 3 | [S] longship a.1 rails timber (e3fd388) approved, struck 1 | [S] ice_archer a.2 brawlerLegs (db12da9) approved, struck 2+3 | [S] minotaur a.1 wedge plate (3c3a808 + 53b63d0) approved, struck 1 | [R] brawler skipped (see Notes) | farmer:re checkpoint 12/12 green - 6/6, 8 struck

## Last verdicts (critic header lines verbatim)
- GAP: [S] viking.jarl (a3fb035) VERDICT: APPROVE CRITERION: viking.jarl.a FAIL (previous: FAIL)
- GAP: [S] viking.ice_archer (99ac4de) VERDICT: APPROVE CRITERION: viking.ice_archer.a PASS (previous: FAIL)
- GAP: [S] viking.headbutter (db2616f) VERDICT: APPROVE CRITERION: viking.headbutter.a FAIL (previous: FAIL)
- GAP: [S] viking.valkyrie (2e4602e) VERDICT: APPROVE CRITERION: viking.valkyrie.b FAIL (previous: FAIL)
- GAP: [S] viking.longship (1bd1f2d) VERDICT: APPROVE CRITERION: viking.longship.a FAIL (previous: FAIL)
- GAP: [S] ancient.minotaur (946334f) VERDICT: APPROVE CRITERION: ancient.minotaur.a PASS (previous: FAIL)
- GAP: [S] ancient.zeus (7738aea) VERDICT: APPROVE CRITERION: ancient.zeus.a FAIL (previous: FAIL)
- CONFIRM viking.ice_archer a FAIL | b FAIL | c PASS | d PASS -> open; CONFIRM ancient.minotaur a FAIL | b PASS | c PASS | d PASS -> open
- REGRESSIONS: none

## Notes for next iteration (max 5 lines)
- 407: brawler.a [R] STARVES (last attempt 402): probe_bbox puts his board flat at belly height in the torso frame (y .24-.41, z -.14..+.73); the bib must hang in front of z .73 or lift - decide before writing.
- 405: main.ts glowLayer.renderingGroupId 0 + zeus emblem in group 1; runtimeUnit.ts:1053 resets a flung body's meshes to group 0 on landing - a small guard keeping a mesh's own group is owed (zeus Notes).
- Next ranked [S]: longship a.3 curved hull; valkyrie b.2 gold winged guard (colour: swatch); jarl a.2 bare chest + belt; headbutter a.2 leg length/stance; minotaur a.1 head up in the idle / a.2 arms; ice_archer b.1 curved bow / a.1 snow lumps; zeus a.3 bolt off the beard's foot.
- The CONFIRM failed a proposed-done unit in 402, 403, 404 and twice in 405 (ice archer a+b, minotaur a with new lists): the gap critic's PASS is not a done.

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
