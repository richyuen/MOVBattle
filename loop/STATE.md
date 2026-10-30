# Loop state (v5: one batch at a time, up to 7 structural gaps per iteration, a CONFIRM critic before D and two CONFIRM fails make a plateau, the critic sees the diff and never the worker's words, the capture frames a unit by its mesh top)
Iteration: 422   Batch: dynasty+pirate (8-9/19)   Consecutive empty: 0   Done: 46/139   Parked: 1
Batches, in order: tribal, renaissance, farmer, medieval, farmer:re, ancient, viking, dynasty, pirate, spooky, wild_west, legacy_1, legacy_2, good, evil, secret_1, secret_2, secret_3, secret_4

## Scoreboard (a b c d as + pass, - fail, ? unscored; status q queued, o open, D done, p parked)
tribal: clubber ++++ D | protector ++++ D | spear_thrower ++++ D | stoner ++++ D | bone_mage ++++ D | chieftain ++++ D | mammoth ++++ D
renaissance: painter ++++ D | fencer ++++ D | balloon_archer ++++ D | musketeer ++++ D | halberd ++++ D | jouster ++++ D | da_vinci_tank ++++ D
farmer: halfling ++++ D | farmer ++++ D | hay_baler ++++ D | potion_seller ++++ D | harvester ++++ D | wheelbarrow -+++ p | scarecrow ++++ D
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
422 (BASE dcac7be0; 422.0 pirate stats d PASS 7/7; pirate AUDIT, tail overlap): [S] dragon b.1 carrier grip (bf9ce7a9) struck 1 | [S] dragon a.5 band on edge (e7926245) struck 5 | [S] monkey_king a.3 shorts + shoes (8db34616, b9adb0a3) struck 3 | [S] monkey_king a.4 half robe (6ff201bb) struck 4, a PASS, CONFIRM failed a (3 new) and b (1 new) - 4/4, 4 struck
421 (BASE 7f580c19): [S] dragon c.1 breath plume (ba799e89, 8027d61c) struck 1, c PASS | [S] dragon a.2 ribbon body (0a4f9754, 87e08299) struck 2, added 5 | [P] dragon b.1 fists in skin (91a86b90) REJECTED ledger reversal, reverted bf5051cd | [S] samurai a.1 shikoro + maedate (a810cff1) struck 1, a PASS, CONFIRM passed - D | [S] firework_archer a.4 shin wraps + sandals (1801625a) struck 4, a PASS, CONFIRM passed - D | [S] monkey_king a.2 baboon face (2dc865d6) struck 2 - 5/6, 6 struck
## Last verdicts (critic header lines verbatim)
- GAP: [S] dynasty.dragon (bf9ce7a9) VERDICT: APPROVE CRITERION: dynasty.dragon.b FAIL (previous: FAIL)
- GAP: [S] dynasty.dragon (e7926245) VERDICT: APPROVE CRITERION: dynasty.dragon.a FAIL (previous: FAIL)
- GAP: [S] dynasty.monkey_king (8db34616, follow-up b9adb0a3) VERDICT: APPROVE CRITERION: dynasty.monkey_king.a FAIL (previous: FAIL)
- GAP: [S] dynasty.monkey_king (6ff201bb) VERDICT: APPROVE CRITERION: dynasty.monkey_king.a PASS (previous: FAIL)
- CONFIRM dynasty.monkey_king a FAIL b FAIL c PASS d PASS (stays open with the confirmer's lists)
- REGRESSIONS: none

## Notes for next iteration (max 5 lines)
- Pickable [S]: dragon b.2 front carrier grip, a.4 muzzle, a.3 carrier trim, b.3 front pole colour (critic ranked 4 on the one open unit); monkey_king a.1 leaf feathers, b.1 staff 1.7x, a.3 blond hair ring (CONFIRM lists); pirate audit ranks: captain.c cutlass slash (find where his slung rod and two-handed rod carry come from first), flintlock.b pistol (shared prop), harpooner.b gun body, cannon.b barrel, captain.a skull plate, flintlock/bomb_thrower.a vest, harpooner.a tricorn. No [P] on offer.
- Evidence commits first (outside the 7) before any pick on: pirate.blunderbuss (the shooter is out of the side-on frame at his 200 ms shot: windup/release/flight empty) and pirate.pirate_queen (her scene must outnumber her for Bomb Spin). Step 2 is done for pirate; no re-audit pending.
- Step-5 captures wipe iter-N: copy a tail-overlap audit.md out first (done at 422, LESSONS). The 422 critic listed dragon defects (fists merge into one column, pole across the face, band edges level, fins even) and monkey defects (puff barrel-wide, toe a spike, tan right half, thin scarf) that are not blockers.
- Shared props changed for batch units carry to later batches: katana (light steel 416) is also on Secret teacher, samurai_giant, shogun; the hwacha timber is its own material (HWACHA_TIMBER); strapSandals (ancientDress) dresses the firework archer too; the pirate flintlock musket prop is on gunslinger, quick_draw, bank_robbers and the pirate queen's off hand.
- Starving: dragon a.3/a.4 never attempted (a's starvation clock runs from 422); monkey_king b at 427 (last attempt 416).

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
