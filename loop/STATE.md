# Loop state (v5: one batch at a time, up to 7 structural gaps per iteration, a CONFIRM critic before D and two CONFIRM fails make a plateau, the critic sees the diff and never the worker's words, the capture frames a unit by its mesh top)
Iteration: 427   Batch: dynasty+pirate (8-9/19)   Consecutive empty: 0   Done: 47/139   Parked: 0
Batches, in order: tribal, renaissance, farmer, medieval, farmer:re, ancient, viking, dynasty, pirate, spooky, wild_west, legacy_1, legacy_2, good, evil, secret_1, secret_2, secret_3, secret_4

## Scoreboard (a b c d as + pass, - fail, ? unscored; status q queued, o open, D done, p parked)
tribal: clubber ++++ D | protector ++++ D | spear_thrower ++++ D | stoner ++++ D | bone_mage ++++ D | chieftain ++++ D | mammoth ++++ D
renaissance: painter ++++ D | fencer ++++ D | balloon_archer ++++ D | musketeer ++++ D | halberd ++++ D | jouster ++++ D | da_vinci_tank ++++ D
farmer: halfling ++++ D | farmer ++++ D | hay_baler ++++ D | potion_seller ++++ D | harvester ++++ D | wheelbarrow ++++ D | scarecrow ++++ D
medieval: bard ++++ D | squire ++++ D | archer ++++ D | healer ++++ D | knight ++++ D | catapult ++++ D | king ++++ D
ancient: shield_bearer ++++ D | sarissa ++++ D | hoplite ++++ D | snake_archer ++++ D | ballista ++++ D | minotaur ++++ D | zeus ++++ D
viking: headbutter ++++ D | ice_archer ++++ D | brawler ++++ D | berserker ++++ D | valkyrie ++++ D | longship ++++ D | jarl ++++ D
dynasty: samurai ++++ D | firework_archer ++++ D | monk ++++ D | ninja ++++ D | dragon --++ o | hwacha ++++ D | monkey_king -+++ o
pirate: flintlock -+++ o | blunderbuss --++ o | bomb_thrower -+++ o | harpooner --++ o | cannon --++ o | captain ---+ o | pirate_queen --++ o
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
427 (BASE 613ba5b9; evidence 9b0f50bb a missile with a just-logged special is not the release): [S] queen c.2 Bomb Spin (4e116860) struck 2, c PASS | [S] blunderbuss c.2 knockback (9afd1177) struck 2, c PASS | [S] blunderbuss a.1 plank hat (01fa4757) struck 1 | [S] cannon c.1 flat shot (5adcac44) struck 1, c PASS | [S] captain b.1 dragon pistol (e5f2be6b, d63a4705) struck 1 | [S] queen a.1 bandana (2a45e931) struck 1 | [S] monkey_king b.1 staff MONKEY_RUYI (13e19096) struck 1, b PASS - 7/7, 7 struck
426 (BASE edb2d31e; RE-AUDIT blunderbuss c + queen c; evidence fb6f2a08 harpooner ability pair = kick): [S] queen c.1 cutlass slash (45024151) struck 1 | [S] blunderbuss c.1 recoil (fb6f0227) struck 1 | [S] flintlock c.1 bell flash + ball (7e83d5a4) struck 1, c PASS | [S] cannon a.2 ring sight (bd059354) struck 2, 4 | [S] blunderbuss a.2 barrel armour (c311013a) struck 2 | [S] harpooner a.3 open coat (04163e67) struck 3 | [P] blunderbuss b.1 long .9 (d0bc1b09) rejected, reverted 0a8294e8 | [S] harpooner c.2 Pirate Kick (1ae5476f, 9476aac6) struck 2, c PASS - 7/8, 8 struck
## Last verdicts (critic header lines verbatim)
- GAP: [S] pirate.pirate_queen (4e116860) VERDICT: APPROVE CRITERION: pirate.pirate_queen.c PASS (previous: FAIL)
- GAP: [S] pirate.blunderbuss (9afd1177) VERDICT: APPROVE CRITERION: pirate.blunderbuss.c PASS (previous: FAIL)
- GAP: [S] pirate.blunderbuss (01fa4757) VERDICT: APPROVE CRITERION: pirate.blunderbuss.a FAIL (previous: FAIL)
- GAP: [S] pirate.cannon (5adcac44) VERDICT: APPROVE CRITERION: pirate.cannon.c PASS (previous: FAIL)
- GAP: [S] pirate.captain (e5f2be6b, d63a4705) VERDICT: APPROVE CRITERION: pirate.captain.b FAIL (previous: FAIL)
- GAP: [S] pirate.pirate_queen (2a45e931) VERDICT: APPROVE CRITERION: pirate.pirate_queen.a FAIL (previous: FAIL)
- GAP: [S] dynasty.monkey_king (13e19096) VERDICT: APPROVE CRITERION: dynasty.monkey_king.b PASS (previous: FAIL)
- REGRESSIONS: none

## Notes for next iteration (max 5 lines)
- Starving at 428 (no attempt in 5 iterations): cannon b (breech handles), captain a (long coat); at 429 flintlock a, bomb_thrower a, dragon a/b, monkey_king a.
- Pickable [S] (427 ranks): captain c.2 pistol blast, captain a.3 coat, queen a.3 bomb sash / a.2 locks, blunderbuss a.3 bracers / a.4 hair, cannon b.2 handles / a.3 shirt, monkey_king a.3 trunk / a.2 hair; earlier: harpooner a.2 beard / b.3 bayonet, flintlock a.4 hair / a.3 socks, queen b.2 big cutlass, blunderbuss b.1 [S] rebuild, bomb_thrower a.3 socks / a.4 sash, dragon a.3 trim / b.2 front hold.
- Shared 427: projectile options at/flight (a ground-point lob); LAUNCH.cannonball is the pirate cannon's only; _aimPistol holds a lone off-hand pistol marked by a "pistolHeldOut" child (Blackbeard's plain one stays); BLUNDERBUSS_BLAST/RECOIL blunderbuss only.
- Shared earlier: buildCutlass + CUTLASS_SLASH (captain, queen, blackbeard); PIRATE_KICK harpooner; GUN_TOSS + spawnPistolShot flintlock; pirateDress PIRATE_VEST/PANTS/SHORTS, BARREL_ARMOUR, OPEN_COAT, PLANK_HAT, QUEEN_BANDANA.
- Monkey king b PASS by one critic: a CONFIRM decides it once his a passes. Queen, blunderbuss and cannon c PASS (single critic, as other criteria).

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
