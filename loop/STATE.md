# Loop state (v5: one batch at a time, up to 7 structural gaps per iteration, a CONFIRM critic before D and two CONFIRM fails make a plateau, the critic sees the diff and never the worker's words, the capture frames a unit by its mesh top)
Iteration: 424   Batch: dynasty+pirate (8-9/19)   Consecutive empty: 0   Done: 47/139   Parked: 0
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
424 (BASE 3e84bea4): [S] monkey_king a.1 leaf feathers (87217f77) struck 1 | [S] dragon a.4 muzzle (576ac9b3) struck 4 | [S] dragon b.3 head pole + wrapped grip (8ceb87bb) struck 3 | [S] flintlock b.2 off-hand pistol (785cfeb0) struck 2, b PASS | [S] flintlock a.2 pants (87042b0e) struck 2 | [S] bomb_thrower a.2 ripped shorts (d95ec795) struck 2 | [S] harpooner b.2 two-hand hip grip (3f068837) struck 2 - 7/7, 7 struck
423 (BASE a8b91158): [S] flintlock b.1 pistol held out (5b56edc3, caf27b2a) struck 1, 3 | [S] harpooner b.1 breech block (3f4bf980, 18f56ed9) struck 1 | [S] cannon b.1 long barrel (b1f1f4aa) struck 1 | [S] captain a.1 skull plate (f22c1648) struck 1 | [S] flintlock a.1 open vest (e6ed0749) struck 1 | [S] bomb_thrower a.1 vest (9bb121db) struck 1 - 6/6, 7 struck
## Last verdicts (critic header lines verbatim)
- GAP: [S] dynasty.monkey_king (87217f77) VERDICT: APPROVE CRITERION: dynasty.monkey_king.a FAIL (previous: FAIL)
- GAP: [S] dynasty.dragon (576ac9b3) VERDICT: APPROVE CRITERION: dynasty.dragon.a FAIL (previous: FAIL)
- GAP: [S] dynasty.dragon (8ceb87bb) VERDICT: APPROVE CRITERION: dynasty.dragon.b FAIL (previous: FAIL)
- GAP: [S] pirate.flintlock (785cfeb0) VERDICT: APPROVE CRITERION: pirate.flintlock.b PASS (previous: FAIL)
- GAP: [S] pirate.flintlock (87042b0e) VERDICT: APPROVE CRITERION: pirate.flintlock.a FAIL (previous: FAIL)
- GAP: [S] pirate.bomb_thrower (d95ec795) VERDICT: APPROVE CRITERION: pirate.bomb_thrower.a FAIL (previous: FAIL)
- GAP: [S] pirate.harpooner (3f068837) VERDICT: APPROVE CRITERION: pirate.harpooner.b FAIL (previous: FAIL)
- REGRESSIONS: none

## Notes for next iteration (max 5 lines)
- Pickable [S] (424 ranks): harpooner a.1 brown tricorn, harpooner c.1 reel-in, flintlock c.2 throw pistols away, flintlock a.3 grey socks, bomb_thrower a.3 striped socks / a.4 sash, monkey_king a.2 hair ring, dragon a.3 carrier trim, dragon b.2 front carrier two-hand hold; harpooner b.3 bayonet; cannon b.2 breech handles, a.1 tall wheels; captain c.1 cutlass slash, a.3 coat, b.1 dragon pistol. monkey_king b.1 staff is rebuild only (MONKEY_STAFF.long approved row). No [P] on offer.
- Evidence commits first (outside the 7) before any pick on: pirate.blunderbuss (the shooter is out of the side-on frame at his 200 ms shot: windup/release/flight empty) and pirate.pirate_queen (her scene must outnumber her for Bomb Spin). No re-audit pending.
- Shared changes: _aimPistol holds a left pistol out too when both hands carry one (gunslinger, quick_draw, bank_robbers; the queen not); pirate dress in web/src/units/pirateDress.ts (PIRATE_VEST, PIRATE_PANTS, PIRATE_SHORTS); _gripHarpoon keys on HARPOON_OFF_GRIP.
- Shared props changed for batch units carry to later batches: katana (light steel 416) is also on Secret teacher, samurai_giant, shogun; strapSandals (ancientDress) dresses the firework archer too.
- Starving: blunderbuss, pirate_queen, cannon a/c, captain b/c, harpooner a/c, flintlock c all unattempted since the 422 audit: picked by 427. monkey_king b at 427 (last attempt 416).

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
