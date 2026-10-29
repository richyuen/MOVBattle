# Loop state (v4: one batch at a time, up to 7 structural gaps per iteration, a CONFIRM critic before D, evidence commits outside the 7)
Iteration: 403   Batch: farmer:re+ancient+viking (5-8/19)   Consecutive empty: 0   Done: 32/139   Parked: 1
Batches, in order: tribal, renaissance, farmer, medieval, farmer:re, ancient, viking, dynasty, pirate, spooky, wild_west, legacy_1, legacy_2, good, evil, secret_1, secret_2, secret_3, secret_4

## Scoreboard (a b c d as + pass, - fail, ? unscored; status q queued, o open, D done, p parked)
tribal: clubber ++++ D | protector ++++ D | spear_thrower ++++ D | stoner ++++ D | bone_mage ++++ D | chieftain ++++ D | mammoth ++++ D
renaissance: painter ++++ D | fencer ++++ D | balloon_archer ++++ D | musketeer ++++ D | halberd ++++ D | jouster ++++ D | da_vinci_tank ++++ D
farmer: halfling -+++ o | farmer ++++ D | hay_baler ++++ D | potion_seller ++++ D | harvester ++++ D | wheelbarrow -+++ p | scarecrow ++++ D
medieval: bard ++++ D | squire ++++ D | archer ++++ D | healer ++++ D | knight ++++ D | catapult ++++ D | king ++++ D
ancient: shield_bearer ++++ D | sarissa ++++ D | hoplite ++++ D | snake_archer ++++ D | ballista ++++ D | minotaur -+++ o | zeus -+++ o
viking: headbutter -+++ o | ice_archer -+++ o | brawler -+++ o | berserker ++++ D | valkyrie -+++ o | longship -+++ o | jarl -+++ o
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
403 (BASE 73e45c7): evidence jarl clear of the hull in lineup_viking + ice archer idle on her eye meshes (88e3f00), RE-AUDIT of jarl.a + ice_archer.a (both lists rewritten) | evidence halfling idle swing .2 (94a7f14), re-audit due 404 | [R] wheelbarrow a.1 FRONT_SPLIT (06ea4d4, reverted a5b8099) REJECTED -> a parked | [S] longship c.2 oars kept + two-handed chop (0d30de1) approved, c PASS | [S] minotaur a.4 face upright + nose plate (a92a9f9) approved, a PASS; CONFIRM then failed a (pauldron, sash) | [S] valkyrie a.4 armour (0ec42c6) approved, bands/bracers/boots struck, belt + ring stand | [S] jarl a.1 beard run + red-tied plait (76b6c7d) approved, 1 struck | [S] ice_archer a.1 cap seated off the eyes (7029273) approved, 1 struck | [S] headbutter a.1 headSize 1.3 + low cap + strip (bcd3eb5) approved, 1 struck, 3 added; CONFIRM longship failed a (rails, shields, hull, carriers) - 6/7, 8 struck
402 (BASE d4c9f5c): evidence ice_archer idle (5f3f1b8 + f8ff48e) | [S] longship c.1 (4c0305e) approved | [S] jarl a.2 (03c2cf1) approved | [S] valkyrie a.3 (498f78d) approved | [S] ice_archer a.2 (911eda0) approved | [S] headbutter a.4 (688ef22) approved, CONFIRM failed a | [S] brawler a.4 splay (2230052, reverted 77a7b59) REJECTED | [S] halfling a.4 (06049a1 + e4ec07a) approved | [R] minotaur a.2/a.3 (cdc71a4) approved - 7/8, 8 struck

## Last verdicts (critic header lines verbatim)
- GAP: [R] farmer.wheelbarrow (06ea4d4) VERDICT: REJECT CRITERION: farmer.wheelbarrow.a FAIL (previous: FAIL)
- GAP: [S] viking.longship (0d30de1) VERDICT: APPROVE CRITERION: viking.longship.c PASS (previous: FAIL)
- GAP: [S] ancient.minotaur (a92a9f9) VERDICT: APPROVE CRITERION: ancient.minotaur.a PASS (previous: FAIL)
- GAP: [S] viking.valkyrie (0ec42c6) VERDICT: APPROVE CRITERION: viking.valkyrie.a FAIL (previous: FAIL)
- GAP: [S] viking.jarl (76b6c7d) VERDICT: APPROVE CRITERION: viking.jarl.a FAIL (previous: FAIL)
- GAP: [S] viking.ice_archer (7029273) VERDICT: APPROVE CRITERION: viking.ice_archer.a FAIL (previous: FAIL)
- GAP: [S] viking.headbutter (bcd3eb5) VERDICT: APPROVE CRITERION: viking.headbutter.a FAIL (previous: FAIL)
- CONFIRM viking.longship a FAIL | b PASS | c PASS | d PASS; ancient.minotaur a FAIL | b PASS | c PASS | d PASS -> both stay open, a takes the confirmer's lists (0 since 403)
- REGRESSIONS: none

## Notes for next iteration (max 5 lines)
- 403: 6/7 approved; the wheelbarrow's second [R] rejected -> a parked, unit p. Done 32 still. farmer:re has only the halfling open.
- Step 2 first at 404: RE-AUDIT farmer.halfling a.1 only (evidence 94a7f14 re-aimed his idle to .2 rad; probe: his feet are side by side, the "stride" was the camera).
- [R] slot at 404: the brawler's plateau [R] (a near-black bib proud of the board). zeus.a (last attempt 400) starves at 405: its blocker 3 (the emblem held out of the hand-bolt's bloom).
- Next ranked [S]: headbutter a.3 (band off the eye beads' tops); valkyrie a.4 (belt seated off torsoMesh); ice_archer a.2 (cuffs) / a.3 (boots); jarl a.3 (forearm wraps) / a.4 (cuffs); minotaur a.1 (flat wedge pauldron) / a.2 (sash); longship a.1 (timber rails) / a.2 (full team shield faces).
- The CONFIRM failed both proposed-done units on a in 402 and 403: the gap critic's a PASS on a unit is not a done.

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
