# Loop state (v5: one batch at a time, up to 7 structural gaps per iteration, a CONFIRM critic before D and two CONFIRM fails make a plateau, the critic sees the diff and never the worker's words, the capture frames a unit by its mesh top)
Iteration: 433   Batch: pirate (10/19)   Consecutive empty: 0   Done: 54/139   Parked: 0
Batches, in order: tribal, renaissance, farmer, medieval, farmer:re, ancient, viking, dynasty, pirate, spooky, wild_west, legacy_1, legacy_2, good, evil, secret_1, secret_2, secret_3, secret_4

## Scoreboard (a b c d as + pass, - fail, ? unscored; status q queued, o open, D done, p parked)
tribal: clubber ++++ D | protector ++++ D | spear_thrower ++++ D | stoner ++++ D | bone_mage ++++ D | chieftain ++++ D | mammoth ++++ D
renaissance: painter ++++ D | fencer ++++ D | balloon_archer ++++ D | musketeer ++++ D | halberd ++++ D | jouster ++++ D | da_vinci_tank ++++ D
farmer: halfling ++++ D | farmer ++++ D | hay_baler ++++ D | potion_seller ++++ D | harvester ++++ D | wheelbarrow ++++ D | scarecrow ++++ D
medieval: bard ++++ D | squire ++++ D | archer ++++ D | healer ++++ D | knight ++++ D | catapult ++++ D | king ++++ D
ancient: shield_bearer ++++ D | sarissa ++++ D | hoplite ++++ D | snake_archer ++++ D | ballista ++++ D | minotaur ++++ D | zeus ++++ D
viking: headbutter ++++ D | ice_archer ++++ D | brawler ++++ D | berserker ++++ D | valkyrie ++++ D | longship ++++ D | jarl ++++ D
dynasty: samurai ++++ D | firework_archer ++++ D | monk ++++ D | ninja ++++ D | dragon ++++ D | hwacha ++++ D | monkey_king ++++ D
pirate: flintlock ++++ D | blunderbuss ++++ D | bomb_thrower ++++ D | harpooner -+++ o | cannon ++++ D | captain ++++ D | pirate_queen -+++ o
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
433 (BASE 96b937e4; plateau [R] monkey_king a): [R] monkey_king a.3 leg cut off the knee joint (d21e71e8, 890391e8) struck 3, a PASS; CONFIRM passed, D | [S] captain a.2 peaked tricorn (1543b25e) struck 2 | [S] captain a.3 shirt+vest+sash (5033a559) struck 3, a PASS; CONFIRM passed, D | [S] harpooner a.3 shoes+socks (ad0be350, 17ca01c7) approved, none struck | [S] queen a.1 skirt front + slim pants (c521e5f2) struck 1 | [S] queen a.2 shirt+sleeves (c9dcb0cd, c4ad8740) struck 2 - 6/6, 5 struck
432 (BASE 67890443; plateau [R] monkey_king a): [R] monkey_king a build (82d77ccb) struck 1, 2 | [S] blunderbuss a.1 greaves (11be8ee6) struck 1, a PASS; CONFIRM passed, D | [S] harpooner a.1 pants (02534ee3, 6df6805c) struck 1, 2 (lineup) | [S] captain a.1 pants+boots (209964c9, 8a9e1309) struck 1 | [S] queen a.1 skirt flap (4d8b3736) approved, none struck | [S] flintlock a.2 ginger locks (0ddfd8fa, 6d30b7c6) struck 2, a PASS; CONFIRM passed, D - 6/6, 7 struck
## Last verdicts (critic header lines verbatim)
- GAP: [R] dynasty.monkey_king (d21e71e8, 890391e8) VERDICT: APPROVE CRITERION: dynasty.monkey_king.a PASS   (previous: FAIL)
- GAP: [S] pirate.captain (1543b25e) VERDICT: APPROVE CRITERION: pirate.captain.a FAIL   (previous: FAIL)
- GAP: [S] pirate.captain (5033a559) VERDICT: APPROVE CRITERION: pirate.captain.a PASS   (previous: FAIL)
- GAP: [S] pirate.harpooner (ad0be350, 17ca01c7) VERDICT: APPROVE CRITERION: pirate.harpooner.a FAIL   (previous: FAIL)
- GAP: [S] pirate.pirate_queen (c521e5f2) VERDICT: APPROVE CRITERION: pirate.pirate_queen.a FAIL   (previous: FAIL)
- GAP: [S] pirate.pirate_queen (c9dcb0cd, c4ad8740) VERDICT: APPROVE CRITERION: pirate.pirate_queen.a FAIL   (previous: FAIL)
- REGRESSIONS: none
- CONFIRM: UNIT dynasty.monkey_king: a PASS b PASS c PASS d PASS (4/4) | UNIT pirate.captain: a PASS b PASS c PASS d PASS (4/4)
## Notes for next iteration (max 5 lines)
- dynasty batch closed 433 (checkpoint GREEN 12/12). Pirate open: harpooner a.3, queen a.3 only; spooky is next and unaudited.
- Tail overlap 434: pirate has 4 pickable [S] (harpooner shoe shell + sock, queen dreads + hair falls) < 5, so run the spooky audit (step 2) now and pick from both; Batch: pirate+spooky.
- Harpooner: the idle shoe sinks in the grass; build the brown shoe shell up to .45 of the foot box and check the sock grey on a --noglow swatch (harpoonerShoes).
- Shared 433: peakedWall (propBuilder, pirate_hat only); CAPTAIN_FRONT replaces the tan shirt + cravat; queenShirt recolours trunk + _yoke; queen pants are the leg meshes (no shells).
- Captures with 4 units run ~15 min: run in the background, wait with an until-loop Monitor.
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
