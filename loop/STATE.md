# Loop state (v4: one batch at a time, up to 7 structural gaps per iteration, a CONFIRM critic before D, evidence commits outside the 7)
Iteration: 409   Batch: ancient+viking (6-7/19)   Consecutive empty: 0   Done: 37/139   Parked: 1
Batches, in order: tribal, renaissance, farmer, medieval, farmer:re, ancient, viking, dynasty, pirate, spooky, wild_west, legacy_1, legacy_2, good, evil, secret_1, secret_2, secret_3, secret_4

## Scoreboard (a b c d as + pass, - fail, ? unscored; status q queued, o open, D done, p parked)
tribal: clubber ++++ D | protector ++++ D | spear_thrower ++++ D | stoner ++++ D | bone_mage ++++ D | chieftain ++++ D | mammoth ++++ D
renaissance: painter ++++ D | fencer ++++ D | balloon_archer ++++ D | musketeer ++++ D | halberd ++++ D | jouster ++++ D | da_vinci_tank ++++ D
farmer: halfling ++++ D | farmer ++++ D | hay_baler ++++ D | potion_seller ++++ D | harvester ++++ D | wheelbarrow -+++ p | scarecrow ++++ D
medieval: bard ++++ D | squire ++++ D | archer ++++ D | healer ++++ D | knight ++++ D | catapult ++++ D | king ++++ D
ancient: shield_bearer ++++ D | sarissa ++++ D | hoplite ++++ D | snake_archer ++++ D | ballista ++++ D | minotaur -+++ o | zeus ++++ D
viking: headbutter ++++ D | ice_archer --++ o | brawler -+++ o | berserker ++++ D | valkyrie ++++ D | longship ++++ D | jarl -+++ o
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
409 (BASE 2ccd9f2): [S] longship a.3 stern scroll (5c28a14) approved, a PASS, CONFIRM passed - D | [S] jarl a.3 continuous beard tube (b620406) approved, none struck | [S] minotaur a.1 barrel chest (506c4c3) approved, struck 1 | [S] ice_archer a.2 team coat (75774b2) approved, struck 2 | [S] headbutter a.2 copper braids (ef2e8e9) approved, a PASS, CONFIRM passed - D | [S] ice_archer b.3 full draw before the loose (8b44250) approved, split 3 - 6/6, 4 struck
408 (BASE afa4fbc): headbutter tunic, ice_archer snow lumps, jarl bear head, minotaur strap, jarl diagonal rest, longship prow approved; brawler tail dropped - 6/7, 7 struck
## Last verdicts (critic header lines verbatim)
- GAP: [S] viking.longship (5c28a14) VERDICT: APPROVE CRITERION: viking.longship.a PASS (previous: FAIL)
- GAP: [S] viking.jarl (b620406) VERDICT: APPROVE CRITERION: viking.jarl.a FAIL (previous: FAIL)
- GAP: [S] ancient.minotaur (506c4c3) VERDICT: APPROVE CRITERION: ancient.minotaur.a FAIL (previous: FAIL)
- GAP: [S] viking.ice_archer (75774b2) VERDICT: APPROVE CRITERION: viking.ice_archer.a FAIL (previous: FAIL)
- GAP: [S] viking.headbutter (ef2e8e9) VERDICT: APPROVE CRITERION: viking.headbutter.a PASS (previous: FAIL)
- GAP: [S] viking.ice_archer (8b44250) VERDICT: APPROVE CRITERION: viking.ice_archer.b FAIL (previous: FAIL)
- CONFIRM viking.longship a PASS | b PASS | c PASS | d PASS -> D; viking.headbutter a PASS | b PASS | c PASS | d PASS -> D
- REGRESSIONS: none

## Notes for next iteration (max 5 lines)
- Next ranked [S]: minotaur a.2 arm shells + mitt fists / a.3 leg shells; ice_archer a.3 hip quiver / b.3 nocked arrow on a bent string; jarl a.4 shin wraps / a.3 narrow lobed beard (jarl a is 3 approved [S] since 406 with strikes - not plateau).
- brawler a.4: the beard gap is out of attempts (395, 401, 402 rejected; 408 dropped); the idle board lies as a tray over his whole trunk - an evidence commit (re-aim at lineup_viking or a lower camera) comes first.
- The CONFIRM passed longship and headbutter at 409 after failing every proposed-done unit in 402-408 except valkyrie and zeus.
- Zeus (D) owes a small guard at runtimeUnit.ts:1053 (a flung body keeps a mesh's own render group) - outside the loop's picks; note only.
- JARL_REST was approved at 408: re-nudging it as [P] is a ledger reversal until 428.

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
