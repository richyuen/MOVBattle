# Loop state (v5: one batch at a time, up to 7 structural gaps per iteration, a CONFIRM critic before D and two CONFIRM fails make a plateau, the critic sees the diff and never the worker's words, the capture frames a unit by its mesh top)
Iteration: 436   Batch: pirate+spooky (10/19)   Consecutive empty: 0   Done: 54/139   Parked: 0
Batches, in order: tribal, renaissance, farmer, medieval, farmer:re, ancient, viking, dynasty, pirate, spooky, wild_west, legacy_1, legacy_2, good, evil, secret_1, secret_2, secret_3, secret_4

## Scoreboard (a b c d as + pass, - fail, ? unscored; status q queued, o open, D done, p parked)
tribal: clubber ++++ D | protector ++++ D | spear_thrower ++++ D | stoner ++++ D | bone_mage ++++ D | chieftain ++++ D | mammoth ++++ D
renaissance: painter ++++ D | fencer ++++ D | balloon_archer ++++ D | musketeer ++++ D | halberd ++++ D | jouster ++++ D | da_vinci_tank ++++ D
farmer: halfling ++++ D | farmer ++++ D | hay_baler ++++ D | potion_seller ++++ D | harvester ++++ D | wheelbarrow ++++ D | scarecrow ++++ D
medieval: bard ++++ D | squire ++++ D | archer ++++ D | healer ++++ D | knight ++++ D | catapult ++++ D | king ++++ D
ancient: shield_bearer ++++ D | sarissa ++++ D | hoplite ++++ D | snake_archer ++++ D | ballista ++++ D | minotaur ++++ D | zeus ++++ D
viking: headbutter ++++ D | ice_archer ++++ D | brawler ++++ D | berserker ++++ D | valkyrie ++++ D | longship ++++ D | jarl ++++ D
dynasty: samurai ++++ D | firework_archer ++++ D | monk ++++ D | ninja ++++ D | dragon ++++ D | hwacha ++++ D | monkey_king ++++ D
pirate: flintlock ++++ D | blunderbuss ++++ D | bomb_thrower ++++ D | harpooner --++ o | cannon ++++ D | captain ++++ D | pirate_queen -+++ o
spooky: skeleton_warrior -+++ o | skeleton_archer -+++ o | candlehead -+++ o | vampire -+-+ o | pumpkin_catapult --++ o | swordcaster -+++ o | reaper -+-+ o
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
436 (BASE 29e883f3; evidence 29e883f3 archer burn on the struck man): [S] harpooner b.2 hip carry (b4465c82) struck 2, b PASS; CONFIRM failed a, b (both plateau) | [S] skeleton_warrior b.2 sword (63a08a9f) struck 2, b PASS | [S] skeleton_archer b.1 bone bow (b5fd9a36) struck 1, b PASS | [S] candlehead b.1 candle arms (4202591b) struck 1, b PASS | [S] swordcaster a.2 cuirass (89b8eb03) struck 2, 4 | [S] reaper c.1 shockwave (30c492bd) struck 1 | [S] queen a.1 upright stance (bdf2f44d) struck 3 - 7/7, 8 struck
435 (BASE 0c52a5bf; evidence b90a44ee candlehead knockup pair): [S] skeleton_archer c.2 burn (d50527c4) struck 2, c PASS | [S] candlehead c.2 knock-up (a575da38) struck 2, c PASS | [S] skeleton_warrior c.1 Stiffy Fear (c989b05a) struck 1, c PASS | [S] pumpkin_catapult c.2 pumpkin burst (a7717979) struck 2, c PASS | [S] harpooner b.1 spike bayonet (1026d70e) struck 1 | [S] swordcaster a.1 bowl cut (0e2c1030) struck 1 | [S] reaper a.1 tendrils (ae92e8fa) struck 1 | [R] queen a build (ae0de203) struck 2 - 8/8, 8 struck
## Last verdicts (critic header lines verbatim)
- GAP: [S] pirate.harpooner (b4465c82) VERDICT: APPROVE CRITERION: pirate.harpooner.b PASS   (previous: FAIL)
- GAP: [S] spooky.skeleton_warrior (63a08a9f) VERDICT: APPROVE CRITERION: spooky.skeleton_warrior.b PASS   (previous: FAIL)
- GAP: [S] spooky.skeleton_archer (b5fd9a36) VERDICT: APPROVE CRITERION: spooky.skeleton_archer.b PASS   (previous: FAIL)
- GAP: [S] spooky.candlehead (4202591b) VERDICT: APPROVE CRITERION: spooky.candlehead.b PASS   (previous: FAIL)
- GAP: [S] spooky.swordcaster (89b8eb03) VERDICT: APPROVE CRITERION: spooky.swordcaster.a FAIL   (previous: FAIL)
- GAP: [S] spooky.reaper (30c492bd) VERDICT: APPROVE CRITERION: spooky.reaper.c FAIL   (previous: FAIL)
- GAP: [S] pirate.pirate_queen (bdf2f44d) VERDICT: APPROVE CRITERION: pirate.pirate_queen.a FAIL   (previous: FAIL)
- REGRESSIONS: none
- CONFIRM: UNIT pirate.harpooner: a FAIL b FAIL c PASS d PASS (2/4)
## Notes for next iteration (max 5 lines)
- Harpooner a and b are plateau (CONFIRM failed each twice): next pick on each is one [R] from every CONFIRM list; the critics split on the off hand (free in red.png, both hands in blue.png).
- Queen a: one blocker left, bulk/height vs the captain: [S] narrow trunk + skirt meshes, longer thinner legs (not the 435 scale/bulk row).
- Spooky: b PASS on warrior, archer, candlehead (436); vampire c (bat form, bite) has no attempt since audit 434: starving at 439. Reaper c.2 tendril impale next.
- Shared 436: propBuilder buildLeafSword/STIFFY_SWORD, buildBoneBow/BONE_BOW; spookyDress candleArms, swordcasterCuirass; visualEffects spawnReaperBurst; anim _restHarpoon, QUEEN_UPRIGHT.
- Captures with 4+ units run 15-25 min: run in the background, wait with an until-loop.
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
