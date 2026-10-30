# Loop state (v5: one batch at a time, up to 7 structural gaps per iteration, a CONFIRM critic before D and two CONFIRM fails make a plateau, the critic sees the diff and never the worker's words, the capture frames a unit by its mesh top)
Iteration: 423   Batch: dynasty+pirate (8-9/19)   Consecutive empty: 0   Done: 47/139   Parked: 0
Batches, in order: tribal, renaissance, farmer, medieval, farmer:re, ancient, viking, dynasty, pirate, spooky, wild_west, legacy_1, legacy_2, good, evil, secret_1, secret_2, secret_3, secret_4

## Scoreboard (a b c d as + pass, - fail, ? unscored; status q queued, o open, D done, p parked)
tribal: clubber ++++ D | protector ++++ D | spear_thrower ++++ D | stoner ++++ D | bone_mage ++++ D | chieftain ++++ D | mammoth ++++ D
renaissance: painter ++++ D | fencer ++++ D | balloon_archer ++++ D | musketeer ++++ D | halberd ++++ D | jouster ++++ D | da_vinci_tank ++++ D
farmer: halfling ++++ D | farmer ++++ D | hay_baler ++++ D | potion_seller ++++ D | harvester ++++ D | wheelbarrow ++++ D | scarecrow ++++ D
medieval: bard ++++ D | squire ++++ D | archer ++++ D | healer ++++ D | knight ++++ D | catapult ++++ D | king ++++ D
ancient: shield_bearer ++++ D | sarissa ++++ D | hoplite ++++ D | snake_archer ++++ D | ballista ++++ D | minotaur ++++ D | zeus ++++ D
viking: headbutter ++++ D | ice_archer ++++ D | brawler ++++ D | berserker ++++ D | valkyrie ++++ D | longship ++++ D | jarl ++++ D
dynasty: samurai ++++ D | firework_archer ++++ D | monk ++++ D | ninja ++++ D | dragon --++ o | hwacha ++++ D | monkey_king -+++ o
pirate: flintlock ---+ o | blunderbuss ---+ o | bomb_thrower -+++ o | harpooner ---+ o | cannon ---+ o | captain ---+ o | pirate_queen ---+ o
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
423 (BASE a8b91158): [S] flintlock b.1 pistol held out (5b56edc3, caf27b2a) struck 1, 3 | [S] harpooner b.1 breech block (3f4bf980, 18f56ed9) struck 1 | [S] cannon b.1 long barrel (b1f1f4aa) struck 1 | [S] captain a.1 skull plate (f22c1648) struck 1 | [S] flintlock a.1 open vest (e6ed0749) struck 1 | [S] bomb_thrower a.1 vest (9bb121db) struck 1 - 6/6, 7 struck
422 (BASE dcac7be0; 422.0 pirate stats d PASS 7/7; pirate AUDIT, tail overlap): [S] dragon b.1 carrier grip (bf9ce7a9) struck 1 | [S] dragon a.5 band on edge (e7926245) struck 5 | [S] monkey_king a.3 shorts + shoes (8db34616, b9adb0a3) struck 3 | [S] monkey_king a.4 half robe (6ff201bb) struck 4, a PASS, CONFIRM failed a (3 new) and b (1 new) | [R] farmer.wheelbarrow a.1 riders' split, unparked by hand (4c36f7da) struck 1, a PASS, CONFIRM passed - D - 5/5, 5 struck
## Last verdicts (critic header lines verbatim)
- GAP: [S] pirate.flintlock (5b56edc3, caf27b2a) VERDICT: APPROVE CRITERION: pirate.flintlock.b FAIL (previous: FAIL)
- GAP: [S] pirate.harpooner (3f4bf980, 18f56ed9) VERDICT: APPROVE CRITERION: pirate.harpooner.b FAIL (previous: FAIL)
- GAP: [S] pirate.cannon (b1f1f4aa) VERDICT: APPROVE CRITERION: pirate.cannon.b FAIL (previous: FAIL)
- GAP: [S] pirate.captain (f22c1648) VERDICT: APPROVE CRITERION: pirate.captain.a FAIL (previous: FAIL)
- GAP: [S] pirate.flintlock (e6ed0749) VERDICT: APPROVE CRITERION: pirate.flintlock.a FAIL (previous: FAIL)
- GAP: [S] pirate.bomb_thrower (9bb121db) VERDICT: APPROVE CRITERION: pirate.bomb_thrower.a FAIL (previous: FAIL)
- REGRESSIONS: none (bomb_thrower b and c still read)

## Notes for next iteration (max 5 lines)
- Pickable [S]: dragon b.2 front carrier grip, a.4 muzzle, a.3 carrier trim, b.3 front pole colour; monkey_king a.1 leaf feathers, b.1 staff (rebuild only: MONKEY_STAFF.long is an approved row), a.2 blond hair ring; pirate 423 ranks: flintlock b.2 off-hand pistol, flintlock a.2 pants, harpooner b.2 two-hand hip grip, harpooner a.1 tricorn, cannon b.2 breech handles, cannon a.1 tall wheels, captain a.3 coat, captain b.1 dragon pistol, bomb_thrower a.2 shorts / a.3 socks; captain c.1 cutlass slash (audit rank 1, see his Notes). No [P] on offer.
- Evidence commits first (outside the 7) before any pick on: pirate.blunderbuss (the shooter is out of the side-on frame at his 200 ms shot: windup/release/flight empty) and pirate.pirate_queen (her scene must outnumber her for Bomb Spin). No re-audit pending.
- The pirate_hat tricorn (captain, queen) now has a wall at the front (423); the shared "flintlock" prop is now a pistol held out by _aimPistol (gunslinger, quick_draw, bank_robbers get it; the queen's off-hand copy is not aimed); new pirate dress goes in web/src/units/pirateDress.ts (PIRATE_VEST).
- Shared props changed for batch units carry to later batches: katana (light steel 416) is also on Secret teacher, samurai_giant, shogun; strapSandals (ancientDress) dresses the firework archer too.
- Starving: dragon a.3/a.4 never attempted (a's starvation clock runs from 422: picked by 427); monkey_king b at 427 (last attempt 416).

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
