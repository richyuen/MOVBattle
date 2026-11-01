# Loop state (v6: one batch at a time, up to 7 structural gaps per iteration, a CONFIRM critic before D and two CONFIRM fails make a plateau, a criterion a CONFIRM passed stays passed, the critic sees the diff and never the worker's words, the capture frames a unit by its mesh top)
Iteration: 443   Batch: pirate+spooky (12/19)   Consecutive empty: 0   Done: 59/139   Parked: 0
Batches, in order: tribal, renaissance, farmer, medieval, farmer:re, ancient, viking, dynasty, pirate, spooky, wild_west, legacy_1, legacy_2, good, evil, secret_1, secret_2, secret_3, secret_4

## Scoreboard (a b c d as + pass, - fail, ? unscored; status q queued, o open, D done, p parked)
tribal: clubber ++++ D | protector ++++ D | spear_thrower ++++ D | stoner ++++ D | bone_mage ++++ D | chieftain ++++ D | mammoth ++++ D
renaissance: painter ++++ D | fencer ++++ D | balloon_archer ++++ D | musketeer ++++ D | halberd ++++ D | jouster ++++ D | da_vinci_tank ++++ D
farmer: halfling ++++ D | farmer ++++ D | hay_baler ++++ D | potion_seller ++++ D | harvester ++++ D | wheelbarrow ++++ D | scarecrow ++++ D
medieval: bard ++++ D | squire ++++ D | archer ++++ D | healer ++++ D | knight ++++ D | catapult ++++ D | king ++++ D
ancient: shield_bearer ++++ D | sarissa ++++ D | hoplite ++++ D | snake_archer ++++ D | ballista ++++ D | minotaur ++++ D | zeus ++++ D
viking: headbutter ++++ D | ice_archer ++++ D | brawler ++++ D | berserker ++++ D | valkyrie ++++ D | longship ++++ D | jarl ++++ D
dynasty: samurai ++++ D | firework_archer ++++ D | monk ++++ D | ninja ++++ D | dragon ++++ D | hwacha ++++ D | monkey_king ++++ D
pirate: flintlock ++++ D | blunderbuss ++++ D | bomb_thrower ++++ D | harpooner ++++ D | cannon ++++ D | captain ++++ D | pirate_queen -+++ o
spooky: skeleton_warrior ++++ D | skeleton_archer ++++ D | candlehead ++++ D | vampire -+-+ o | pumpkin_catapult -+++ o | swordcaster ++++ D | reaper ++-+ o
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
443 (BASE dd2f8916; no evidence commit; queen [R] deferred to 444): [S] warrior b.1 STIFFY_UPRIGHT (a18d0a6f) struck 1, b PASS | [S] archer b.1 DRAWS_BEFORE_LOOSE (3471ec43) struck 1, b PASS | [S] pumpkin a.2 no cw box (1992ee2c) struck 2 | [S] reaper c.3 hang high, not targeted, spear .22 (b111a980) struck 3, c PASS | [S] vampire a.4 vest slab + short V, off secret_ghost (67ad1643) approved, no strike | CONFIRM warrior, archer passed all (D); reaper passed a, b, failed c (burst) - 5/5, 4 struck
442 (BASE 100f6660; evidence fd81737e reaper ABILITY_PREF impale): [S] reaper c.2 REAPER_IMPALE (c350e411, 56eae583) struck 2, added 3 | [S] SKELETON_BONE unlit cream (21f0bc9a) archer a.3, warrior a.2, reaper a.3 struck, all three a PASS | [S] pumpkin a.3 PUMPKIN_POSTS (4a2e5f3b) struck 3 | [S] vampire a.4 cape gap + long V (8e29a2cb) rejected (reverted 9ef221d0) | [S] queen a.2 wrap hem + pale pelvis (af6e49fd, 6eb18db0) dropped (hidden behind the guards) | CONFIRM archer, warrior passed a, c; failed b - 5/7, 5 struck
## Last verdicts (critic header lines verbatim)
- GAP: [S] spooky.skeleton_warrior (a18d0a6f) VERDICT: APPROVE CRITERION: spooky.skeleton_warrior.b PASS   (previous: FAIL)
- GAP: [S] spooky.skeleton_archer (3471ec43) VERDICT: APPROVE CRITERION: spooky.skeleton_archer.b PASS   (previous: FAIL)
- GAP: [S] spooky.pumpkin_catapult (1992ee2c) VERDICT: APPROVE CRITERION: spooky.pumpkin_catapult.a FAIL   (previous: FAIL)
- GAP: [S] spooky.reaper (b111a980) VERDICT: APPROVE CRITERION: spooky.reaper.c PASS   (previous: FAIL)
- GAP: [S] spooky.vampire (67ad1643) VERDICT: APPROVE CRITERION: spooky.vampire.a FAIL   (previous: FAIL)
- REGRESSIONS: none
- CONFIRM spooky.skeleton_warrior: a PASS b PASS c PASS d PASS (4/4); spooky.skeleton_archer: a PASS b PASS c PASS d PASS (4/4); spooky.reaper: a PASS b PASS c FAIL d PASS (3/4)
## Notes for next iteration (max 5 lines)
- Queen a plateau: 444 takes its [R] (starves 448): hem to mid-thigh, boot top under the knee, pelvis pale, QUEEN_GUARD lifted clear of the .6-.8 m band; probe_bbox the guard meshes first (unit Notes).
- Vampire c (attempts 2) starves at 444 and takes a slot: a new latch approach (unit Notes). Vampire a.4 NEXT: belt proud of the vest slab, V deepened below the yoke.
- Reaper c (CONFIRM 443): the capture pair is the impale blow, which skips REAPER_BURST; burst on it too (or re-aim). His motion shots now see him from behind.
- Pumpkin a.1 last blocker: spooky wheel tyre + hub in PUMPKIN_TIMBER (vehicleBuilder wheels), a swatch for the critic (colour-only).
- Captures run ~5 s a shot (5 units ~7 min): background them and wait with an until-loop on the log.
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
