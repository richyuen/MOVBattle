# Loop state (v3: one batch at a time, up to 7 structural gaps per iteration, a CONFIRM critic before D)
Iteration: 397   Batch: farmer:re+ancient+viking (5-8/19)   Consecutive empty: 0   Done: 31/139   Parked: 0
Batches, in order: tribal, renaissance, farmer, medieval, farmer:re, ancient, viking, dynasty, pirate, spooky, wild_west, legacy_1, legacy_2, good, evil, secret_1, secret_2, secret_3, secret_4

## Scoreboard (a b c d as + pass, - fail, ? unscored; status q queued, o open, D done, p parked)
tribal: clubber ++++ D | protector ++++ D | spear_thrower ++++ D | stoner ++++ D | bone_mage ++++ D | chieftain ++++ D | mammoth ++++ D
renaissance: painter ++++ D | fencer ++++ D | balloon_archer ++++ D | musketeer ++++ D | halberd ++++ D | jouster ++++ D | da_vinci_tank ++++ D
farmer: halfling -+++ o | farmer ++++ D | hay_baler ++++ D | potion_seller ++++ D | harvester ++++ D | wheelbarrow -+++ o | scarecrow ++++ D
medieval: bard ++++ D | squire ++++ D | archer ++++ D | healer ++++ D | knight ++++ D | catapult ++++ D | king ++++ D
ancient: shield_bearer ++++ D | sarissa ++++ D | hoplite ++++ D | snake_archer ++++ D | ballista ++++ D | minotaur -+++ o | zeus -+++ o
viking: headbutter -+-+ o | ice_archer -+-+ o | brawler -+++ o | berserker -+++ o | valkyrie -+++ o | longship --++ o | jarl -+++ o
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

## Focus (every gap this iteration: tag, unit, gap, sha, verdict)
397 (BASE cb0a2ac): [R] farmer.wheelbarrow a.riders 2e73091+2c2cc8b REJECTED (reverted 8f53efc, 0e9756d) | [S] farmer.halfling a.1 legs 4fe6fd1 approved (narrowed a.1) | [S] viking.longship b.1 paddle blades 4d811b7 approved (narrowed b.1) | [S] viking.ice_archer c.1 ice arrow 0fc57f6+636060c approved (narrowed c.1) | [S] viking.brawler a.3 boots 707a5b0+df9e860 approved (struck a.3) | [S] viking.berserker a.3 armpit tufts 6904e0d+e5927fe approved (narrowed a.3) - 5/6

## Last verdicts (critic header lines verbatim)
- GAP: [R] farmer.wheelbarrow (2e73091+2c2cc8b) VERDICT: REJECT CRITERION: farmer.wheelbarrow.a FAIL (previous: FAIL)
- GAP: [S] farmer.halfling (4fe6fd1) VERDICT: APPROVE CRITERION: farmer.halfling.a FAIL (previous: FAIL)
- GAP: [S] viking.longship (4d811b7) VERDICT: APPROVE CRITERION: viking.longship.b FAIL (previous: FAIL)
- GAP: [S] viking.ice_archer (0fc57f6+636060c) VERDICT: APPROVE CRITERION: viking.ice_archer.c FAIL (previous: FAIL)
- GAP: [S] viking.brawler (707a5b0+df9e860) VERDICT: APPROVE CRITERION: viking.brawler.a FAIL (previous: FAIL)
- GAP: [S] viking.berserker (6904e0d+e5927fe) VERDICT: APPROVE CRITERION: viking.berserker.a FAIL (previous: FAIL)

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

## Notes for next iteration (max 5 lines)
- Batch unchanged; open: halfling, wheelbarrow, minotaur, zeus and all 7 viking. Done 31. 397: 5/6 approved, no unit closed; the wheelbarrow [R] was rejected (its knees-only solve was not the front rider's split).
- Wheelbarrow is a plateau with one rejected [R] since 375: its next pick is one [R] on the FRONT rider's seated split (thighs near-horizontal, knees at his waist outside the tray), and a second rejected [R] parks criterion a.
- Next ranked: halfling legs (shinLength > 1.5 + a planted wide stance) and foot fur; longship crew (stocky horned oarsmen sunk in the hull) then hull; ice_archer arrow head/frost spray then mantle, cuffs, front view (evidence commit); brawler beard; berserker armpit tufts off the arm joint, then calf cuffs.
- ice_archer a.4 still needs its evidence commit (idle/lineup are a back view) before the face and cap can be judged; zeus a.3 and minotaur a.2 wait behind the one-[R]-per-iteration rule.
- The brawler's beard is the last blocker on a; its shield covers the bib, so the beard must clear the mask's bottom edge and the shield's top rim in _idle.
