# Loop state (v5: one batch at a time, up to 7 structural gaps per iteration, a CONFIRM critic before D and two CONFIRM fails make a plateau, the critic sees the diff and never the worker's words, the capture frames a unit by its mesh top)
Iteration: 432   Batch: dynasty+pirate (10/19)   Consecutive empty: 0   Done: 52/139   Parked: 0
Batches, in order: tribal, renaissance, farmer, medieval, farmer:re, ancient, viking, dynasty, pirate, spooky, wild_west, legacy_1, legacy_2, good, evil, secret_1, secret_2, secret_3, secret_4

## Scoreboard (a b c d as + pass, - fail, ? unscored; status q queued, o open, D done, p parked)
tribal: clubber ++++ D | protector ++++ D | spear_thrower ++++ D | stoner ++++ D | bone_mage ++++ D | chieftain ++++ D | mammoth ++++ D
renaissance: painter ++++ D | fencer ++++ D | balloon_archer ++++ D | musketeer ++++ D | halberd ++++ D | jouster ++++ D | da_vinci_tank ++++ D
farmer: halfling ++++ D | farmer ++++ D | hay_baler ++++ D | potion_seller ++++ D | harvester ++++ D | wheelbarrow ++++ D | scarecrow ++++ D
medieval: bard ++++ D | squire ++++ D | archer ++++ D | healer ++++ D | knight ++++ D | catapult ++++ D | king ++++ D
ancient: shield_bearer ++++ D | sarissa ++++ D | hoplite ++++ D | snake_archer ++++ D | ballista ++++ D | minotaur ++++ D | zeus ++++ D
viking: headbutter ++++ D | ice_archer ++++ D | brawler ++++ D | berserker ++++ D | valkyrie ++++ D | longship ++++ D | jarl ++++ D
dynasty: samurai ++++ D | firework_archer ++++ D | monk ++++ D | ninja ++++ D | dragon ++++ D | hwacha ++++ D | monkey_king -+++ o
pirate: flintlock ++++ D | blunderbuss ++++ D | bomb_thrower ++++ D | harpooner -+++ o | cannon ++++ D | captain -+++ o | pirate_queen -+++ o
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
432 (BASE 67890443; plateau [R] monkey_king a): [R] monkey_king a build (82d77ccb) struck 1, 2 | [S] blunderbuss a.1 greaves (11be8ee6) struck 1, a PASS; CONFIRM passed, D | [S] harpooner a.1 pants (02534ee3, 6df6805c) struck 1, 2 (lineup) | [S] captain a.1 pants+boots (209964c9, 8a9e1309) struck 1 | [S] queen a.1 skirt flap (4d8b3736) approved, none struck | [S] flintlock a.2 ginger locks (0ddfd8fa, 6d30b7c6) struck 2, a PASS; CONFIRM passed, D - 6/6, 7 struck
431 (BASE 3d4a557c; starving blunderbuss b): [R] dragon a head+body (3e94ecfa, 48329bf4) struck 1-4, a PASS; CONFIRM passed, D | [S] flintlock a.1 team bandana (6561ba6f) struck 1, also bomb_thrower a.1 struck | [S] bomb_thrower a.2 belt (8d798815, 67e6d6eb) struck 2, a PASS; CONFIRM passed, D | [S] captain a.4 beard (927e8a7a, ee1ab3a9) struck 4, a PASS; CONFIRM failed a | [S] captain b.2 cup guard (3021427b) b PASS | [P] harpooner a.4 scale 1.3 (ec00c268) a PASS; CONFIRM failed a | [S] queen b.1 crossed blades (fe03e273) struck 1, 2, b PASS | [S] queen a.4 skirt (d06b4abd) a PASS; CONFIRM failed a | [S] blunderbuss b.1 gun rebuild (8addafc1) b PASS; CONFIRM failed a - 9/9, 13 struck
## Last verdicts (critic header lines verbatim)
- GAP: [R] dynasty.monkey_king (82d77ccb) VERDICT: APPROVE CRITERION: dynasty.monkey_king.a FAIL   (previous: FAIL)
- GAP: [S] pirate.blunderbuss (11be8ee6) VERDICT: APPROVE CRITERION: pirate.blunderbuss.a PASS   (previous: FAIL)
- GAP: [S] pirate.harpooner (02534ee3, 6df6805c) VERDICT: APPROVE CRITERION: pirate.harpooner.a FAIL   (previous: FAIL)
- GAP: [S] pirate.captain (209964c9, 8a9e1309) VERDICT: APPROVE CRITERION: pirate.captain.a FAIL   (previous: FAIL)
- GAP: [S] pirate.pirate_queen (4d8b3736) VERDICT: APPROVE CRITERION: pirate.pirate_queen.a FAIL   (previous: FAIL)
- GAP: [S] pirate.flintlock (0ddfd8fa, 6d30b7c6) VERDICT: APPROVE CRITERION: pirate.flintlock.a PASS   (previous: FAIL)
- REGRESSIONS: none
- CONFIRM: UNIT pirate.blunderbuss: a PASS b PASS c PASS d PASS (4/4) | UNIT pirate.flintlock: a PASS b PASS c PASS d PASS (4/4)

## Notes for next iteration (max 5 lines)
- [R] slot 433: monkey_king a blocker 3 (still plateau by CONFIRM count): end MONKEY_SHORTS at the knee joint on the thigh (thigh mesh runs past the knee), bare team shin, orange ankle band, low shoe; robe reads long.
- Pickable [S] 433: captain a.2 tricorn / a.3 shirt+vest+sash; harpooner a.3 shoes+socks; queen a.2 sleeves / a.1 slim pants + knee hem / a.3 dreads. Fewer than 5 under one-per-criterion: second [S] per criterion allowed (different blockers).
- Shared 432: braceLimb (barrelBracers + barrelGreaves); piratePants(color, cuffLight); harpoonerPants legs take head skin; captainLegs recolours the foot black (pattern for harpooner shoes); flintlockLocks replaces pirateHair on the flintlock (pirateHair still in blunderbussHair).
- Captures with the monkey king plus 5 units run ~15 min: run in the background and wait on the notification.
- LESSONS at 9998/10000: merge before adding. LEDGER compacted 432 (dragon, bomb_thrower rows).

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
