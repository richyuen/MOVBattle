# Loop state (v2: one batch at a time, up to 5 structural gaps per iteration)
Iteration: 354   Batch: medieval (4/21)   Consecutive empty: 0   Done: 21/139   Parked: 0
Batches, in order: tribal, renaissance, farmer, medieval, tribal:re, renaissance:re, farmer:re, ancient, viking, dynasty, pirate, spooky, wild_west, legacy_1, legacy_2, good, evil, secret_1, secret_2, secret_3, secret_4

## Scoreboard (a b c d as + pass, - fail, ? unscored; status q queued, o open, D done, p parked)
tribal: clubber ++++ D | protector ++++ D | spear_thrower ++++ D | stoner ++++ D | bone_mage ++++ D | chieftain ++++ D | mammoth ++++ D
renaissance: painter ++++ D | fencer ++++ D | balloon_archer ++++ D | musketeer ++++ D | halberd ++++ D | jouster ++++ D | da_vinci_tank ++++ D
farmer: halfling ++++ D | farmer ++++ D | hay_baler ++++ D | potion_seller ++++ D | harvester ++++ D | wheelbarrow ++++ D | scarecrow ++++ D
medieval: bard ??++ o | squire ??++ o | archer ??-+ o | healer ??++ o | knight ??++ o | catapult ??++ o | king ??++ o
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
354 (BASE b536178): [R] king b two fists on the long grip 331adbd approved | [S] archer c planted full-draw release e9a6c71 approved | [S] bard c music notes a20bb74+3c65ac0 approved | [S] catapult b visible crewman 0264878+e6055d9 approved | [S] healer a priest robe 62b021b approved | [P] catapult b BOULDER tone 3cd7525 approved

## Last verdicts (critic header lines verbatim)
- GAP: [R] medieval.king (331adbd) VERDICT: APPROVE CRITERION: medieval.king.b PASS (previous: FAIL) BLOCKERS: struck: 1 (none remaining)
- GAP: [S] medieval.archer (e9a6c71) VERDICT: APPROVE CRITERION: medieval.archer.c FAIL (previous: FAIL) BLOCKERS: struck: 1; remaining: 2
- GAP: [S] medieval.bard (a20bb74 + 3c65ac0) VERDICT: APPROVE CRITERION: medieval.bard.c PASS (previous: FAIL) BLOCKERS: struck: 2 (none remaining)
- GAP: [S] medieval.catapult (0264878 + e6055d9) VERDICT: APPROVE CRITERION: medieval.catapult.b FAIL (previous: FAIL) BLOCKERS: struck: 1; remaining: 2
- GAP: [S] medieval.healer (62b021b) VERDICT: APPROVE CRITERION: medieval.healer.a FAIL (previous: FAIL) BLOCKERS: struck: 2; remaining: 1, 3
- GAP: [P] medieval.catapult (3cd7525) VERDICT: APPROVE CRITERION: medieval.catapult.b FAIL (previous: FAIL) BLOCKERS: blocker 2 tone cleared; remaining: 2 (spoon bucket)

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
- Medieval audited 351 (d 7/7 PASS). Squire/archer stats moved in 351; archer arrow now leaves at the loose (354, ~1.5 s later); bard notes/walk 353-354: expect re-baselines at the medieval checkpoint.
- Two-fisted swords (king, squire) run FISTS_ON_GRIP (354): blade mounted on its line through the fist, carry and let-go both keep it there.
- Pickable [P] fallout: ARMET.rail 1.0 proud .12 (353, lineup_medieval); MUSIC_NOTE bigger/brighter (354, bard_ability); BOULDER warmer (354, catapult_windup).
- 355 first: RE-AUDIT a and b of every medieval unit (step 2; capture --batch medieval, critic given each unit file's Verdicts block). Evidence commit after 354 turned unit_<id>_idle and lineup_<f> to a front three-quarter (they were strict profile); a and b lists written from profile shots are void. c and d stand. Capture adds unit_<id>_walk for a banjo_walk.
- tribal:re, renaissance:re, farmer:re follow medieval: full re-audits of the done batches under the new angles (ITERATE step 2).
