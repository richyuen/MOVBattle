# Loop state (v5: one batch at a time, up to 7 structural gaps per iteration, a CONFIRM critic before D and two CONFIRM fails make a plateau, the critic sees the diff and never the worker's words, the capture frames a unit by its mesh top)
Iteration: 425   Batch: dynasty+pirate (8-9/19)   Consecutive empty: 0   Done: 47/139   Parked: 0
Batches, in order: tribal, renaissance, farmer, medieval, farmer:re, ancient, viking, dynasty, pirate, spooky, wild_west, legacy_1, legacy_2, good, evil, secret_1, secret_2, secret_3, secret_4

## Scoreboard (a b c d as + pass, - fail, ? unscored; status q queued, o open, D done, p parked)
tribal: clubber ++++ D | protector ++++ D | spear_thrower ++++ D | stoner ++++ D | bone_mage ++++ D | chieftain ++++ D | mammoth ++++ D
renaissance: painter ++++ D | fencer ++++ D | balloon_archer ++++ D | musketeer ++++ D | halberd ++++ D | jouster ++++ D | da_vinci_tank ++++ D
farmer: halfling ++++ D | farmer ++++ D | hay_baler ++++ D | potion_seller ++++ D | harvester ++++ D | wheelbarrow ++++ D | scarecrow ++++ D
medieval: bard ++++ D | squire ++++ D | archer ++++ D | healer ++++ D | knight ++++ D | catapult ++++ D | king ++++ D
ancient: shield_bearer ++++ D | sarissa ++++ D | hoplite ++++ D | snake_archer ++++ D | ballista ++++ D | minotaur ++++ D | zeus ++++ D
viking: headbutter ++++ D | ice_archer ++++ D | brawler ++++ D | berserker ++++ D | valkyrie ++++ D | longship ++++ D | jarl ++++ D
dynasty: samurai ++++ D | firework_archer ++++ D | monk ++++ D | ninja ++++ D | dragon --++ o | hwacha ++++ D | monkey_king -+++ o
pirate: flintlock -+-+ o | blunderbuss ---+ o | bomb_thrower -+++ o | harpooner ---+ o | cannon ---+ o | captain ---+ o | pirate_queen ---+ o
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
425 (BASE 386d1e73; evidence 386d1e73 blunderbuss frame + queen vs five squires, 54a57a16 reel pair on the man): [S] harpooner a.1 brown tricorn (75a4ea7d) struck 1 | [S] harpooner c.1 reel-in (3f3fd30b, 443edc44) struck 1 | [S] flintlock c.2 pistols thrown (36eb9aaa) struck 2 | [S] blunderbuss b.1 gun + two-hand hold (28779788) struck 2, 1 down to its length | [S] cannon a.1 tall wheels (5b429ac7, 396cefd1) struck 1 | [S] queen b.1 curved cutlass/sabre (e5226412) none struck | [S] captain c.1 cutlass slash (8b450772) struck 1 - 7/7, 6 struck
424 (BASE 3e84bea4): [S] monkey_king a.1 leaf feathers (87217f77) struck 1 | [S] dragon a.4 muzzle (576ac9b3) struck 4 | [S] dragon b.3 head pole + wrapped grip (8ceb87bb) struck 3 | [S] flintlock b.2 off-hand pistol (785cfeb0) struck 2, b PASS | [S] flintlock a.2 pants (87042b0e) struck 2 | [S] bomb_thrower a.2 ripped shorts (d95ec795) struck 2 | [S] harpooner b.2 two-hand hip grip (3f068837) struck 2 - 7/7, 7 struck
## Last verdicts (critic header lines verbatim)
- GAP: [S] pirate.harpooner (75a4ea7d) VERDICT: APPROVE CRITERION: pirate.harpooner.a FAIL (previous: FAIL)
- GAP: [S] pirate.harpooner (3f3fd30b, follow-up 443edc44) VERDICT: APPROVE CRITERION: pirate.harpooner.c FAIL (previous: FAIL)
- GAP: [S] pirate.flintlock (36eb9aaa) VERDICT: APPROVE CRITERION: pirate.flintlock.c FAIL (previous: FAIL)
- GAP: [S] pirate.blunderbuss (28779788) VERDICT: APPROVE CRITERION: pirate.blunderbuss.b FAIL (previous: FAIL)
- GAP: [S] pirate.cannon (5b429ac7, follow-up 396cefd1) VERDICT: APPROVE CRITERION: pirate.cannon.a FAIL (previous: FAIL)
- GAP: [S] pirate.pirate_queen (e5226412) VERDICT: APPROVE CRITERION: pirate.pirate_queen.b FAIL (previous: FAIL)
- GAP: [S] pirate.captain (8b450772) VERDICT: APPROVE CRITERION: pirate.captain.c FAIL (previous: FAIL)
- REGRESSIONS: none

## Notes for next iteration (max 5 lines)
- RE-AUDIT at 426's step 2 (evidence 386d1e73 re-framed their shots): pirate.blunderbuss c (now framed on the shooter) and pirate.pirate_queen c (now against five squires); give the critic their Verdicts blocks, other criteria keep theirs.
- Pickable [S] (425 ranks): harpooner c.2 Pirate Kick, harpooner a.3 open coat, flintlock c.1 muzzle flash, flintlock a.4 hair, blunderbuss a.2 barrel armour, cannon a.2 crosshair, cannon b.2 breech handles, captain b.1 dragon pistol, captain a.3 coat, queen b cutlass mount, queen c.2 Bomb Spin; 424: bomb_thrower a.3 socks / a.4 sash, monkey_king a.2 hair ring, dragon a.3 trim / b.2 front hold, harpooner b.3 bayonet. [P] on offer: blunderbuss BLUNDERBUSS.long .62 -> .9 (NEXT shot _windup).
- Starving by 427: blunderbuss a, cannon c, captain b, pirate_queen a, monkey_king b (last attempt 416; b.1 is a number on an approved row: an [S] replacing MONKEY_STAFF, e.g. new end caps at his height, may reset it).
- Shared changes: the "cutlass" prop is now buildCutlass (captain, queen, blackbeard) and a blade_slash with it runs CUTLASS_SLASH; the fitted "tricorn" is brown felt (harpooner); buildCannon wheels CANNON_WHEEL (bomb cannon too); _aimPistol both hands; pirateDress PIRATE_VEST/PANTS/SHORTS.
- Shared props for later batches: katana (light steel 416) on Secret teacher, samurai_giant, shogun; strapSandals (ancientDress) on the firework archer; GUN_TOSS is the flintlock's alone.

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
