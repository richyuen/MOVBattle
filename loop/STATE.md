# Loop state (v2: one batch at a time, up to 7 structural gaps per iteration)
Iteration: 358   Batch: medieval (4/21)   Consecutive empty: 0   Done: 23/139   Parked: 0
Batches, in order: tribal, renaissance, farmer, medieval, tribal:re, renaissance:re, farmer:re, ancient, viking, dynasty, pirate, spooky, wild_west, legacy_1, legacy_2, good, evil, secret_1, secret_2, secret_3, secret_4

## Scoreboard (a b c d as + pass, - fail, ? unscored; status q queued, o open, D done, p parked)
tribal: clubber ++++ D | protector ++++ D | spear_thrower ++++ D | stoner ++++ D | bone_mage ++++ D | chieftain ++++ D | mammoth ++++ D
renaissance: painter ++++ D | fencer ++++ D | balloon_archer ++++ D | musketeer ++++ D | halberd ++++ D | jouster ++++ D | da_vinci_tank ++++ D
farmer: halfling ++++ D | farmer ++++ D | hay_baler ++++ D | potion_seller ++++ D | harvester ++++ D | wheelbarrow ++++ D | scarecrow ++++ D
medieval: bard ++++ D | squire -+++ o | archer -+++ o | healer -+++ o | knight -+++ o | catapult ++++ D | king -+++ o
ancient: shield_bearer ???? q | sarissa ???? q | hoplite ???? q | snake_archer ???? q | ballista ???? q | minotaur ???? q | zeus ???? q
viking: headbutter ???? q | ice_archer ???? q | brawler ???? q | berserker ???? q | valkyrie ???? q | longship ???? q | jarl ???? q
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
358 (BASE e11f674): [S] knight a cape 929b00a+d7037c7 approved | [S] king a royal dress ededbdd rejected-kept | [S] squire a arms 56aed0c approved | [S] catapult a wood b246560 approved | [S] bard a legs bef3298 approved | [S] archer a belt+boots dbfaa66 approved | [S] archer c arrow f886865 approved | [P] healer a collar width 3aa2c45 approved

## Last verdicts (critic header lines verbatim)
- GAP: [S] medieval.knight (929b00a + d7037c7) VERDICT: APPROVE CRITERION: medieval.knight.a FAIL (previous: FAIL)
- GAP: [S] medieval.king (ededbdd) VERDICT: REJECT CRITERION: medieval.king.a FAIL (previous: FAIL)
- GAP: [S] medieval.squire (56aed0c) VERDICT: APPROVE CRITERION: medieval.squire.a FAIL (previous: FAIL)
- GAP: [S] medieval.catapult (b246560) VERDICT: APPROVE CRITERION: medieval.catapult.a PASS (previous: FAIL)
- GAP: [S] medieval.bard (bef3298) VERDICT: APPROVE CRITERION: medieval.bard.a PASS (previous: FAIL)
- GAP: [S] medieval.archer (dbfaa66) VERDICT: APPROVE CRITERION: medieval.archer.a FAIL (previous: FAIL)
- GAP: [S] medieval.archer (f886865) VERDICT: APPROVE CRITERION: medieval.archer.c PASS (previous: FAIL)
- GAP: [P] medieval.healer (3aa2c45) VERDICT: APPROVE CRITERION: medieval.healer.a FAIL (previous: FAIL)

## Unit file template (loop/units/<id>.md, cap 2600 bytes)
```
# <unitId>
Status: open|done|parked   Audited: <iter>   Done: <iter or ->
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (0 since <iter>)
 1. <element> in unit_<id>_<shot> — TABS: <what the reference shows> (ref: <file or card section>)
b PASS (<iter>)
c FAIL (0 since <iter>) [plateau|parked when marked]
 1. missing: <mechanic>
d PASS|FAIL (<the stats.json line, shortened>)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] c <gap> — blocker 1: <mechanism> — ref: <file> — ours: <png>
## Attempts (iter | gap | criterion | verdict: approved, rejected, rejected-kept, dropped)
## Rejected (last 4: gap [tag] [attempts] — iter: what — critic's top defect)
## Notes (max 3 lines)
```

## Notes for next iteration (max 5 lines)
- King: kingDress is live but rejected-kept (revert conflicted); its re-land must restore KING_BEARD (.88,.62,.28) glow .12 and end the pantaloons at the knee.
- Arm/leg dress over the tabard block's mail must be shells (limbShell, shellStripes), not recolours: dressMedieval runs before unitFactory paints the arms.
- Healer idle is side-on: the collar blocker is judged in lineup_medieval; an evidence commit could re-aim healer_idle to the front three-quarter.
- Expect re-baselines at the medieval checkpoint: squire/archer stats (351), archer loose and broadhead arrow (354, 358), bard walk, catapult frame/wheels/paint, knight plate+cape.
- tribal:re, renaissance:re, farmer:re follow medieval: full re-audits of the done batches under the new angles (ITERATE step 2).
