# Loop state (v4: one batch at a time, up to 7 structural gaps per iteration, a CONFIRM critic before D, evidence commits outside the 7)
Iteration: 407   Batch: ancient+viking (6-7/19)   Consecutive empty: 0   Done: 35/139   Parked: 1
Batches, in order: tribal, renaissance, farmer, medieval, farmer:re, ancient, viking, dynasty, pirate, spooky, wild_west, legacy_1, legacy_2, good, evil, secret_1, secret_2, secret_3, secret_4

## Scoreboard (a b c d as + pass, - fail, ? unscored; status q queued, o open, D done, p parked)
tribal: clubber ++++ D | protector ++++ D | spear_thrower ++++ D | stoner ++++ D | bone_mage ++++ D | chieftain ++++ D | mammoth ++++ D
renaissance: painter ++++ D | fencer ++++ D | balloon_archer ++++ D | musketeer ++++ D | halberd ++++ D | jouster ++++ D | da_vinci_tank ++++ D
farmer: halfling ++++ D | farmer ++++ D | hay_baler ++++ D | potion_seller ++++ D | harvester ++++ D | wheelbarrow -+++ p | scarecrow ++++ D
medieval: bard ++++ D | squire ++++ D | archer ++++ D | healer ++++ D | knight ++++ D | catapult ++++ D | king ++++ D
ancient: shield_bearer ++++ D | sarissa ++++ D | hoplite ++++ D | snake_archer ++++ D | ballista ++++ D | minotaur -+++ o | zeus ++++ D
viking: headbutter -+++ o | ice_archer --++ o | brawler -+++ o | berserker ++++ D | valkyrie ++++ D | longship -+++ o | jarl --++ o
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
407 (BASE 978f707): [S] jarl b.1 crescent axe (f6b95a5) approved, struck 1 | [R] brawler a beard rebuild (9ece9b8) approved, struck 2+5, plateau cleared | [S] jarl a.1 pelt flaps (4859953 + 22d7ed7) approved, struck 1 | [S] headbutter a.2 leg cut (ff93093) approved, a PASS; CONFIRM failed a (new list) | [S] ice_archer b.2 upright carry (1936db1 + a65dfd2) approved, 2 stands | [S] longship a.4 carrier dress (562d7f1) approved, a PASS; CONFIRM failed a (new list) | [S] minotaur a.4 slim legs on hooves (8f84140) approved, struck 4 - 7/7, 7 struck
406 (BASE 9c743e0): [S] minotaur a.1 tall neck (73bf52a) approved | [S] jarl a.2 belt (293835c) approved; CONFIRM failed a, b | [S] headbutter a.2 standSquare (e25bd21) REJECTED | [S] valkyrie b.2 winged hilt -> D | [S] ice_archer b.1 recurve (8dbee1a) approved | [S] longship a.3 curved hull (b38c4d7) approved | [S] zeus a.3 emblem -> D - 6/7, 8 struck
## Last verdicts (critic header lines verbatim)
- GAP: [S] viking.jarl (f6b95a5) VERDICT: APPROVE CRITERION: viking.jarl.b FAIL (previous: FAIL)
- GAP: [R] viking.brawler (9ece9b8) VERDICT: APPROVE CRITERION: viking.brawler.a FAIL (previous: FAIL, plateau)
- GAP: [S] viking.jarl (4859953 + 22d7ed7) VERDICT: APPROVE CRITERION: viking.jarl.a FAIL (previous: FAIL)
- GAP: [S] viking.headbutter (ff93093) VERDICT: APPROVE CRITERION: viking.headbutter.a PASS (previous: FAIL)
- GAP: [S] viking.ice_archer (1936db1 + a65dfd2) VERDICT: APPROVE CRITERION: viking.ice_archer.b FAIL (previous: FAIL)
- GAP: [S] viking.longship (562d7f1) VERDICT: APPROVE CRITERION: viking.longship.a PASS (previous: FAIL)
- GAP: [S] ancient.minotaur (8f84140) VERDICT: APPROVE CRITERION: ancient.minotaur.a FAIL (previous: FAIL)
- CONFIRM viking.headbutter a FAIL | b PASS | c PASS | d PASS -> open; CONFIRM viking.longship a FAIL | b PASS | c PASS | d PASS -> open
- REGRESSIONS: none

## Notes for next iteration (max 5 lines)
- Next ranked [S]: jarl b.2 diagonal two-handed carry / a.2 big bear head; ice_archer a.1 snow lumps (no attempt on a since 405) / b.3 windup draw; minotaur a.3 belt clear of the muzzle; brawler a.4 torso beard tail in front of the board to the belt (plateau cleared 407); headbutter a.1 plain team tunic (CONFIRM 407); longship a.1 tall S prow neck (CONFIRM 407).
- The red-team trunk under materialPreset viking_fur renders brown-mauve (ice_archer a.2, jarl chest, likely the headbutter's 'vest' a.1): one fix may serve all three.
- The CONFIRM failed every proposed-done unit in 402-407 except valkyrie and zeus: the gap critic's PASS is not a done.
- Zeus (D) owes a small guard at runtimeUnit.ts:1053 (a flung body keeps a mesh's own render group) - outside the loop's picks; note only.
- probe_axes (407) gives a prop's local axes in the torso/root frame: use it before hanging dress off a held prop.

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
