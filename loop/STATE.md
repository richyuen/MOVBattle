# Loop state (v2: one batch at a time, up to 7 structural gaps per iteration)
Iteration: 355   Batch: medieval (4/21)   Consecutive empty: 0   Done: 21/139   Parked: 0
Batches, in order: tribal, renaissance, farmer, medieval, tribal:re, renaissance:re, farmer:re, ancient, viking, dynasty, pirate, spooky, wild_west, legacy_1, legacy_2, good, evil, secret_1, secret_2, secret_3, secret_4

## Scoreboard (a b c d as + pass, - fail, ? unscored; status q queued, o open, D done, p parked)
tribal: clubber ++++ D | protector ++++ D | spear_thrower ++++ D | stoner ++++ D | bone_mage ++++ D | chieftain ++++ D | mammoth ++++ D
renaissance: painter ++++ D | fencer ++++ D | balloon_archer ++++ D | musketeer ++++ D | halberd ++++ D | jouster ++++ D | da_vinci_tank ++++ D
farmer: halfling ++++ D | farmer ++++ D | hay_baler ++++ D | potion_seller ++++ D | harvester ++++ D | wheelbarrow ++++ D | scarecrow ++++ D
medieval: bard -+++ o | squire -+++ o | archer -+-+ o | healer -+++ o | knight --++ o | catapult -+++ o | king -+++ o
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
355 (BASE a1f7c4f; a/b re-audit of medieval on the 3/4 idle first): [S] catapult b spoon bucket 56a8ab6 approved | [S] archer b hip quiver d75f622+7078d43 approved | [S] knight b sword hold 1574c11 approved | [S] king a fitted crown 0535fe4 approved | [S] healer a tonsure head e5f32a0+cf8f774 approved | [S] bard a floppy hat 216bf92 approved | [S] squire a great helm face 92256f8 approved

## Last verdicts (critic header lines verbatim)
- GAP: [S] medieval.catapult (56a8ab6) VERDICT: APPROVE CRITERION: medieval.catapult.b PASS (previous: FAIL) BLOCKERS: struck: 1 (none remain)
- GAP: [S] medieval.archer (d75f622 + 7078d43) VERDICT: APPROVE CRITERION: medieval.archer.b PASS (previous: FAIL) BLOCKERS: struck: 1 (none remain)
- GAP: [S] medieval.knight (1574c11) VERDICT: APPROVE CRITERION: medieval.knight.b FAIL (previous: FAIL) BLOCKERS: struck: 1; remaining: 2
- GAP: [S] medieval.king (0535fe4) VERDICT: APPROVE CRITERION: medieval.king.a FAIL (previous: FAIL) BLOCKERS: struck: 1; remaining: 2, 3, 4
- GAP: [S] medieval.healer (e5f32a0 + cf8f774) VERDICT: APPROVE CRITERION: medieval.healer.a FAIL (previous: FAIL) BLOCKERS: struck: 1; remaining: 2
- GAP: [S] medieval.bard (216bf92) VERDICT: APPROVE CRITERION: medieval.bard.a FAIL (previous: FAIL) BLOCKERS: struck: 3; remaining: 1, 2
- GAP: [S] medieval.squire (92256f8) VERDICT: APPROVE CRITERION: medieval.squire.a FAIL (previous: FAIL) BLOCKERS: struck: 1; remaining: 2, 3, 4

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
- 356 first: evidence commit - unit_medieval.archer_idle shows his back (bow ready stance yaw .6-.95 rad off the root; idle camera follows the root yaw): frame him by his body's facing so the hood (a.1) can be judged.
- Knight b.2 "stray chest hilt" is the medieval tabard's cream cross (unitFactory tabardCross); the knight wears plate there. Pickable [P] fallout (355): FLOPPY_HAT dip/seat (bard_idle eyes), CRUSADER_HELM.iron darker (squire_idle), ROYAL_CROWN.tall (king_idle), QUIVER_HIP.leather warmer.
- Medieval audited 351, a/b re-audited 355 on the 3/4 idle. Squire/archer stats moved in 351; archer arrow leaves at the loose (354); bard notes/walk 353-354; king's first hit 850 -> 1150 ms in the 355 capture: expect re-baselines at the medieval checkpoint.
- Two-fisted swords (king, squire) run FISTS_ON_GRIP (354). Medieval dress lives in web/src/units/medievalDress.ts (dressMedieval, 355).
- tribal:re, renaissance:re, farmer:re follow medieval: full re-audits of the done batches under the new angles (ITERATE step 2).
