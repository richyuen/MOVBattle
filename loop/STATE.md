# Loop state (v2: one batch at a time, up to 5 structural gaps per iteration)
Iteration: 353   Batch: medieval (4/18)   Consecutive empty: 0   Done: 21/139   Parked: 0
Batches, in order: tribal, renaissance, farmer, medieval, ancient, viking, dynasty, pirate, spooky, wild_west, legacy_1, legacy_2, good, evil, secret_1, secret_2, secret_3, secret_4

## Scoreboard (a b c d as + pass, - fail, ? unscored; status q queued, o open, D done, p parked)
tribal: clubber ++++ D | protector ++++ D | spear_thrower ++++ D | stoner ++++ D | bone_mage ++++ D | chieftain ++++ D | mammoth ++++ D
renaissance: painter ++++ D | fencer ++++ D | balloon_archer ++++ D | musketeer ++++ D | halberd ++++ D | jouster ++++ D | da_vinci_tank ++++ D
farmer: halfling ++++ D | farmer ++++ D | hay_baler ++++ D | potion_seller ++++ D | harvester ++++ D | wheelbarrow ++++ D | scarecrow ++++ D
medieval: bard ---+ o | squire -+++ o | archer ---+ o | healer -+++ o | knight -+++ o | catapult --++ o | king --++ o
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
353 (BASE 5d59ccc): [S] squire b two-fisted hilt 7f4b61c approved | [S] king b two-fisted Zweihander 9e2fd04 rejected (reverted c9dd189) | [S] healer b priest staff 03b4e5c approved | [S] knight a open armet 58cfa04+4459ae6 approved | [S] bard c Banjo Walk 68d8302+53c3633 approved | [P] archer b BROWN_LONGBOW.long 1.4 e1336bb approved | evidence 8c94af9+2f382aa (unit_<id>_walk)

## Last verdicts (critic header lines verbatim)
- GAP: [S] medieval.squire (7f4b61c) VERDICT: APPROVE CRITERION: medieval.squire.b PASS (previous: FAIL) BLOCKERS: struck: 1
- GAP: [S] medieval.king (9e2fd04) VERDICT: REJECT CRITERION: medieval.king.b FAIL (previous: FAIL) BLOCKERS: 1. off hand beside the guard, off the grip line
- GAP: [S] medieval.healer (03b4e5c) VERDICT: APPROVE CRITERION: medieval.healer.b PASS (previous: FAIL) BLOCKERS: struck: 1
- GAP: [S] medieval.knight (58cfa04 +4459ae6) VERDICT: APPROVE CRITERION: medieval.knight.a FAIL (previous: FAIL) BLOCKERS: struck: 1; remaining: 2, 3
- GAP: [S] medieval.bard (68d8302 +53c3633) VERDICT: APPROVE CRITERION: medieval.bard.c FAIL (previous: FAIL) BLOCKERS: struck: 1; remaining: 2
- GAP: [P] medieval.archer (e1336bb) VERDICT: APPROVE CRITERION: medieval.archer.b FAIL (previous: FAIL) BLOCKERS: struck: 1; remaining: 2

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
- Medieval audited 351 (d 7/7 PASS). Squire/archer stats moved in 351 (both in regression scenarios): expect re-baselines at the medieval checkpoint.
- King b is plateau (rejected 351, 353): next pick on it is one [R]; reach-clamp the off fist on the long grip (TWO_FIST_SWORD/_swordInBothFists, squire approved 353).
- Pickable [P] fallout: CATAPULT_ARM.cocked lower (351, catapult_idle); BOULDER.stone (.6,.5,.4) lit .1 (352, catapult_windup); ARMET.rail 1.0 proud .12 (353, lineup_medieval).
- Bard Banjo Walk (353) may shift regression scenarios with bards; capture adds unit_<id>_walk for a banjo_walk. Knight _idle faces away: helm front in lineup/_ability.
- Bash eats backslashes and some heredocs (apostrophes in heredoc bodies broke 353): write files with the Write tool; unitVisuals.ts is CRLF. Never `git commit -a`.
