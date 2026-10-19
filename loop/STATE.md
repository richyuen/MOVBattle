# Loop state (v2: one batch at a time, up to 7 structural gaps per iteration)
Iteration: 357   Batch: medieval (4/21)   Consecutive empty: 0   Done: 21/139   Parked: 0
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
357 (BASE d8d48cb): [S] catapult a wheels 4c16604 approved | [S] knight a cuirass 4604755 approved | [S] king a cape 377de2a+808aa53 approved | [S] squire a lower legs 74fa206 approved | [S] archer a arms 825dee2 approved | [S] healer a collar 3ab7173 approved | [S] bard a tunic cfd130d approved | [P] king a beard 8b73d7d approved

## Last verdicts (critic header lines verbatim)
- GAP: [S] medieval.catapult (4c16604) VERDICT: APPROVE CRITERION: medieval.catapult.a FAIL (previous: FAIL) BLOCKERS: 2 unchanged; struck: 3
- GAP: [S] medieval.knight (4604755) VERDICT: APPROVE CRITERION: medieval.knight.a FAIL (previous: FAIL) BLOCKERS: 2, 3 unchanged; struck: 1
- GAP: [S] medieval.king (377de2a + 808aa53) VERDICT: APPROVE CRITERION: medieval.king.a FAIL (previous: FAIL) BLOCKERS: 2 narrowed (gap 8); 3 unchanged; struck: 4
- GAP: [S] medieval.squire (74fa206) VERDICT: APPROVE CRITERION: medieval.squire.a FAIL (previous: FAIL) BLOCKERS: 2 unchanged; struck: 4
- GAP: [S] medieval.archer (825dee2) VERDICT: APPROVE CRITERION: medieval.archer.a FAIL (previous: FAIL) BLOCKERS: 1, 3 unchanged; 2 narrowed
- GAP: [S] medieval.healer (3ab7173) VERDICT: APPROVE CRITERION: medieval.healer.a FAIL (previous: FAIL) BLOCKERS: 2 narrowed
- GAP: [S] medieval.bard (cfd130d) VERDICT: APPROVE CRITERION: medieval.bard.a FAIL (previous: FAIL) BLOCKERS: 2 unchanged; struck: 1
- GAP: [P] medieval.king (8b73d7d) VERDICT: APPROVE CRITERION: medieval.king.a FAIL (previous: FAIL) BLOCKERS: 2 narrowed; 3 unchanged

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
- Chest dress goes on the shoulder yoke hull (medievalDress chestFrontAt / chestBack); panel() two-sided. limbShell(limb, from, to, out) shells a limb in its joint frame (357).
- Pickable [P] fallout: (357) HEALER_TRIM collar width x2.5 (healer_idle); (356) ARCHER_HOOD.shade/brow (archer_idle). KING_BEARD: no more [P] (critic 357).
- medievalCape (357, king) is written for reuse: the knight cape gap passes team colour and drops his "cape" special (shared propBuilder box, ~30 units: never edit it).
- Expect re-baselines at the medieval checkpoint: squire/archer stats (351), archer loose (354), bard walk (353-354), catapult frame/wheels (356-357), knight plate (357).
- tribal:re, renaissance:re, farmer:re follow medieval: full re-audits of the done batches under the new angles (ITERATE step 2).
