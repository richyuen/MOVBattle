# Loop state (v4: one batch at a time, up to 7 structural gaps per iteration, a CONFIRM critic before D, evidence commits outside the 7)
Iteration: 402   Batch: farmer:re+ancient+viking (5-8/19)   Consecutive empty: 0   Done: 32/139   Parked: 0
Batches, in order: tribal, renaissance, farmer, medieval, farmer:re, ancient, viking, dynasty, pirate, spooky, wild_west, legacy_1, legacy_2, good, evil, secret_1, secret_2, secret_3, secret_4

## Scoreboard (a b c d as + pass, - fail, ? unscored; status q queued, o open, D done, p parked)
tribal: clubber ++++ D | protector ++++ D | spear_thrower ++++ D | stoner ++++ D | bone_mage ++++ D | chieftain ++++ D | mammoth ++++ D
renaissance: painter ++++ D | fencer ++++ D | balloon_archer ++++ D | musketeer ++++ D | halberd ++++ D | jouster ++++ D | da_vinci_tank ++++ D
farmer: halfling -+++ o | farmer ++++ D | hay_baler ++++ D | potion_seller ++++ D | harvester ++++ D | wheelbarrow -+++ o | scarecrow ++++ D
medieval: bard ++++ D | squire ++++ D | archer ++++ D | healer ++++ D | knight ++++ D | catapult ++++ D | king ++++ D
ancient: shield_bearer ++++ D | sarissa ++++ D | hoplite ++++ D | snake_archer ++++ D | ballista ++++ D | minotaur -+++ o | zeus -+++ o
viking: headbutter -+++ o | ice_archer -+++ o | brawler -+++ o | berserker ++++ D | valkyrie -+++ o | longship ++-+ o | jarl -+++ o
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
402 (BASE d4c9f5c): evidence ice_archer idle camera on the head's facing (5f3f1b8 + f8ff48e) | [S] longship c.1 carriers pinned, hull leaves overhead (4c0305e) approved, 1 struck | [S] jarl a.2 beard + plait (03c2cf1) approved, 0 struck | [S] valkyrie a.3 fur collar + cream plaits (498f78d) approved, 3 struck | [S] ice_archer a.2 snow mantle (911eda0) approved, 2 struck | [S] headbutter a.4 cream cut + broad belt (688ef22) approved, 4 struck, a PASS; CONFIRM then failed a (dome, legs) | [S] brawler a.4 splayed jaw locks (2230052, reverted 77a7b59) REJECTED | [S] halfling a.4 unlit shorts (06049a1 + e4ec07a) approved, 4 + 6 struck | [R] minotaur a.2/a.3 low bull head, one girdle, pauldron scroll (cdc71a4) approved, 2 + 3 struck, 4 added - 7/8, 8 struck
401 (BASE 0b04353): [S] longship a.4 two carriers + 1.8x ship (e0fbb2c) approved, a struck; CONFIRM then failed c | [S] jarl a.5 pelt curtains to the hips (fd578de + 9c1b402) approved, 5 struck | [S] valkyrie a.2 cream helm feathers, eye-line band, tall crest (c0c74ea + cbecbca) approved, 2 struck | [S] ice_archer c.1 bead flakes out, nine icicles (5509051) approved, c PASS | [S] headbutter c.1 reach .75 + sprawl .14 s + arms trailing (41852fd + fde5dd6) approved, c PASS | [S] headbutter a.4 bracer fur + belt at the waist (7f8b218) approved, 4 narrowed | [S] brawler a.4 second wider bib (05ccbb8 + 6f22d10, reverted a1edda8/3d01ac1) REJECTED - 6/7

## Last verdicts (critic header lines verbatim)
- GAP: [S] viking.longship (4c0305e) VERDICT: APPROVE CRITERION: viking.longship.c FAIL (previous: FAIL)
- GAP: [S] viking.jarl (03c2cf1) VERDICT: APPROVE CRITERION: viking.jarl.a FAIL (previous: FAIL)
- GAP: [S] viking.valkyrie (498f78d) VERDICT: APPROVE CRITERION: viking.valkyrie.a FAIL (previous: FAIL)
- GAP: [S] viking.ice_archer (911eda0) VERDICT: APPROVE CRITERION: viking.ice_archer.a FAIL (previous: FAIL)
- GAP: [S] viking.headbutter (688ef22) VERDICT: APPROVE CRITERION: viking.headbutter.a PASS (previous: FAIL)
- GAP: [S] viking.brawler (2230052) VERDICT: REJECT CRITERION: viking.brawler.a FAIL (previous: FAIL)
- GAP: [S] farmer.halfling (06049a1 + e4ec07a) VERDICT: APPROVE CRITERION: farmer.halfling.a FAIL (previous: FAIL)
- GAP: [R] ancient.minotaur (cdc71a4) VERDICT: APPROVE CRITERION: ancient.minotaur.a FAIL (previous: FAIL)
- CONFIRM viking.headbutter a FAIL | b PASS | c PASS | d PASS -> unit stays open, a takes the confirmer's 2 blockers (0 since 402)
- REGRESSIONS: none

## Notes for next iteration (max 5 lines)
- 402: 7/8 approved, the brawler splay rejected and reverted; no regressions. Done 32 still. Batch unchanged: farmer:re 2 open, ancient 2, viking 6.
- Evidence first at 403 (outside the 7): lineup_viking hides the jarl behind the longship's stern (stand him clear of the hull so his a blockers can be lineup-tested); the ice archer's re-aimed idle still shows a blank head with no eyes (aim it on the eye meshes, eye midpoint minus head centre).
- [R] slot at 403: wheelbarrow.a is starving (no attempt since 397) and plateau, so its [R] (the front rider's seated split) takes the slot ahead of the brawler's new plateau [R] (a near-black bib proud of the board); the brawler's [R] is the 404 slot.
- Next ranked [S]: minotaur a.4 (the bull face upright, tilt ~.15); ice_archer a.3 (cream calf cuffs over dark boots); valkyrie a.4 (brown belt + gold ring, arm bands, boots); jarl a.4 (the Brawler's leg kit) then a.2 (jaw-wide beard, plait proud of the pelt strips); longship c.2 (oars kept and swung); halfling a.1 (a planted stance with no stride); headbutter a.1/a.2 (a low skull-cap dome, longer legs).
- zeus.a (last attempt 400) starves at 405; its blocker 3 stays the emblem held out of the hand-bolt's bloom.

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
