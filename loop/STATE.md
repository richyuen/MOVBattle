# Loop state (v2: one batch at a time, up to 7 structural gaps per iteration)
Iteration: 356   Batch: medieval (4/21)   Consecutive empty: 0   Done: 21/139   Parked: 0
Batches, in order: tribal, renaissance, farmer, medieval, tribal:re, renaissance:re, farmer:re, ancient, viking, dynasty, pirate, spooky, wild_west, legacy_1, legacy_2, good, evil, secret_1, secret_2, secret_3, secret_4

## Scoreboard (a b c d as + pass, - fail, ? unscored; status q queued, o open, D done, p parked)
tribal: clubber ++++ D | protector ++++ D | spear_thrower ++++ D | stoner ++++ D | bone_mage ++++ D | chieftain ++++ D | mammoth ++++ D
renaissance: painter ++++ D | fencer ++++ D | balloon_archer ++++ D | musketeer ++++ D | halberd ++++ D | jouster ++++ D | da_vinci_tank ++++ D
farmer: halfling ++++ D | farmer ++++ D | hay_baler ++++ D | potion_seller ++++ D | harvester ++++ D | wheelbarrow ++++ D | scarecrow ++++ D
medieval: bard -+++ o | squire -+++ o | archer -+-+ o | healer -+++ o | knight -+++ o | catapult -+++ o | king -+++ o
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
356 (BASE 8544fbb; no evidence commit: the archer faces the idle camera, his old cap hid his face): [S] knight b stray chest hilt cc7912d approved | [S] archer a hood e32ac81+ee64656 approved | [S] healer a robe trim 7462491 approved | [S] bard a peasant vest ffdb80c+df7b94b approved | [S] squire a tabard 3122a04+78cf8cc approved | [S] king a beard 63043f4 approved | [S] catapult a trestle frame 4375f6d approved

## Last verdicts (critic header lines verbatim)
- GAP: [S] medieval.knight (cc7912d) VERDICT: APPROVE CRITERION: medieval.knight.b PASS (previous: FAIL) BLOCKERS: struck: 2 (list empty -> b PASS)
- GAP: [S] medieval.archer (e32ac81 + ee64656) VERDICT: APPROVE CRITERION: medieval.archer.a FAIL (previous: FAIL) BLOCKERS: 1 narrowed; 2, 3 unchanged
- GAP: [S] medieval.healer (7462491) VERDICT: APPROVE CRITERION: medieval.healer.a FAIL (previous: FAIL) BLOCKERS: 2 narrowed (collar only)
- GAP: [S] medieval.bard (ffdb80c + df7b94b) VERDICT: APPROVE CRITERION: medieval.bard.a FAIL (previous: FAIL) BLOCKERS: 1 narrowed; 2 unchanged
- GAP: [S] medieval.squire (3122a04 + 78cf8cc) VERDICT: APPROVE CRITERION: medieval.squire.a FAIL (previous: FAIL) BLOCKERS: 2, 4 unchanged; struck: 3
- GAP: [S] medieval.king (63043f4) VERDICT: APPROVE CRITERION: medieval.king.a FAIL (previous: FAIL) BLOCKERS: 2 narrowed; 3, 4 unchanged
- GAP: [S] medieval.catapult (4375f6d) VERDICT: APPROVE CRITERION: medieval.catapult.a FAIL (previous: FAIL) BLOCKERS: 2, 3 unchanged; struck: 1

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
- The visible chest is the shoulder yoke hull (body.allMeshes /_yoke$/), not torsoMesh: lay chest dress on medievalDress chestFrontAt / frontAt (356). panel() is two-sided with its own normals.
- Pickable [P] fallout (356): ARCHER_HOOD.shade/brow (archer_idle), KING_BEARD.wide/deep/blonde (king_idle); (355) FLOPPY_HAT dip/seat, CRUSADER_HELM.iron, ROYAL_CROWN.tall, QUIVER_HIP.leather.
- Medieval audited 351, a/b re-audited 355. Squire/archer stats moved in 351; archer arrow leaves at the loose (354); bard notes/walk 353-354; catapult frame 356: expect re-baselines at the medieval checkpoint.
- Two-fisted swords (king, squire) run FISTS_ON_GRIP (354). Medieval dress lives in web/src/units/medievalDress.ts (dressMedieval(scene, body, id, team), 355-356).
- tribal:re, renaissance:re, farmer:re follow medieval: full re-audits of the done batches under the new angles (ITERATE step 2).
