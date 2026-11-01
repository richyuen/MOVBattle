# Loop state (v7: a look list holds 6 blockers with the build first, the tail overlaps below 7 picks, a plateau [R] goes next, CONFIRM runs beside the critic; v6: one batch at a time, up to 7 structural gaps per iteration, a CONFIRM critic before D and two CONFIRM fails make a plateau, a criterion a CONFIRM passed stays passed, the critic sees the diff and never the worker's words, the capture frames a unit by its mesh top)
Iteration: 465   Batch: legacy_1 (9/14)   Consecutive empty: 0   Done: 70/139   Parked: 0
Batches, in order: tribal, renaissance, farmer, medieval, farmer:re, ancient, viking, dynasty, pirate, spooky, wild_west, legacy_1, legacy_2, good, evil, secret_1, secret_2, secret_3, secret_4

## Scoreboard (a b c d as + pass, - fail, ? unscored; status q queued, o open, D done, p parked)
tribal: clubber ++++ D | protector ++++ D | spear_thrower ++++ D | stoner ++++ D | bone_mage ++++ D | chieftain ++++ D | mammoth ++++ D
renaissance: painter ++++ D | fencer ++++ D | balloon_archer ++++ D | musketeer ++++ D | halberd ++++ D | jouster ++++ D | da_vinci_tank ++++ D
farmer: halfling ++++ D | farmer ++++ D | hay_baler ++++ D | potion_seller ++++ D | harvester ++++ D | wheelbarrow ++++ D | scarecrow ++++ D
medieval: bard ++++ D | squire ++++ D | archer ++++ D | healer ++++ D | knight ++++ D | catapult ++++ D | king ++++ D
ancient: shield_bearer ++++ D | sarissa ++++ D | hoplite ++++ D | snake_archer ++++ D | ballista ++++ D | minotaur ++++ D | zeus ++++ D
viking: headbutter ++++ D | ice_archer ++++ D | brawler ++++ D | berserker ++++ D | valkyrie ++++ D | longship ++++ D | jarl ++++ D
dynasty: samurai ++++ D | firework_archer ++++ D | monk ++++ D | ninja ++++ D | dragon ++++ D | hwacha ++++ D | monkey_king ++++ D
pirate: flintlock ++++ D | blunderbuss ++++ D | bomb_thrower ++++ D | harpooner ++++ D | cannon ++++ D | captain ++++ D | pirate_queen ++++ D
spooky: skeleton_warrior ++++ D | skeleton_archer ++++ D | candlehead ++++ D | vampire ++++ D | pumpkin_catapult ++++ D | swordcaster ++++ D | reaper ++++ D
wild_west: dynamite_thrower ++++ D | miner ++++ D | cactus ++++ D | gunslinger ++++ D | lasso ++++ D | deadeye ++++ D | quick_draw ++++ D
legacy_1: peasant -+++ o | banner_bearer +-++ o | poacher -+-+ o | blowdarter -+-+ o | pike -+++ o | barrel_roller -+-+ o | boxer --++ o | flag_bearer -+++ o
legacy_2: pharaoh ???? q | wizard ???? q | chariot ???? q | thor ???? q | tank ???? q | super_boxer ???? q | dark_peasant ???? q | super_peasant ???? q
good: devout_gauntlet ???? q | celestial_aegis ???? q | radiant_glaive ???? q | righteous_paladin ???? q | divine_arbiter ???? q | sacred_elephant ???? q | chronomancer ???? q
evil: shadow_walker ???? q | exiled_sentinel ???? q | mad_mechanic ???? q | void_cultist ???? q | tempest_lich ???? q | death_bringer ???? q | void_monarch ???? q
secret_1: ballooner ???? q | bomb_on_a_stick ???? q | fan_bearer ???? q | raptor ???? q | the_teacher ???? q | jester ???? q | ball_n_chain ???? q | chu_ko_nu ???? q | executioner ???? q | shouter ???? q
secret_2: taekwondo ???? q | raptor_rider ???? q | cheerleader ???? q | cupid ???? q | mace_spinner ???? q | clams ???? q | present_elf ???? q | ice_mage ???? q | infernal_whip ???? q | bank_robbers ???? q
secret_3: witch ???? q | banshee ???? q | necromancer ???? q | solar_architect ???? q | wheelbarrow_dragon ???? q | skeleton_giant ???? q | bomb_cannon ???? q | cavalry ???? q | vlad ???? q | gatling_gun ???? q
secret_4: blackbeard ???? q | samurai_giant ???? q | ullr ???? q | lady_red_jade ???? q | sensei ???? q | shogun ???? q | tree_giant ???? q | artemis ???? q | ice_giant ???? q

## Focus (every gap this iteration: tag, unit, gap, sha, verdict; the line ends in `- <approved>/<total>, <struck> struck`)
465 (BASE 1bacaa78; evidence 2b229594 bearer spars his squire with the hurt ally in the ring): [S] banner_bearer + flag_bearer d polearm_melee blow, BEARER_PULSE (545192dc) d PASS both | [S] poacher c.2 SMALL_ARROW (ec355f73) struck 2 | [S] blowdarter c.2 BLOW_DART (ec355f73) struck 2 | [S] pike a.2 PIKE_VEST (ab5eacbe) struck 2 | [S] barrel_roller a.4 BARREL_VEST (ab5eacbe) struck 4 | [S] boxer a.1 build 1.08 (af84fde5) struck 1, a PASS | [S] peasant a.1 build 1.00 (af84fde5) struck 1, a PASS; CONFIRM failed banner b (3 new), peasant a (1 new), boxer a, b (1 each) - 7/7, 6 struck
464 (BASE 64552e98): [S] blowdarter c.1 HAND_LAUNCH muzzle (b42e6e1c) struck 1 | [S] boxer c.2 HOP_BACK dodge (f5c1b38a) struck 2, c PASS | [S] pike c.2 PIKE_DROP (d57603bb, fa8827d7) struck 2, c PASS | [S] barrel_roller a.2 tricorn (38bca2d8) struck 2 | [S] poacher b.1 bowGrip (99c8103c) struck 1, b PASS | [S] flag_bearer b.4 CHARGE_PENNANT (c0cb4ef3) struck 4 | [S] banner_bearer b.3 BEARER_HOLD (70924ac8, shared) struck 3 + flag b.3, b PASS both | [P] poacher b.1 POACHER_BOW wood (e968d1a0) - 8/8, 8 struck
463 (BASE 8716ab17): [S] pike b.1 LONG_PIKE (55c1c679) struck 1, 2, 3, b PASS | [S] pike c.1 levelsPike (cf35fc1b) struck 1 | [S] blowdarter b.1 BLOWGUN + BLOWGUN_HOLD (67888276) struck 1, 2, b PASS | [S] poacher b.1 POACHER_BOW (7e2eb586) none struck (no fist on it) | [S] boxer c.1 BOXER_JAB (523ab3d2, 578ed136) struck 1 | [S] barrel_roller b.1 BARREL_RIDE (e3458425) struck 1, 2, b PASS | [S] barrel_roller c.1 BARREL_SHOT (7089b8e7) struck 1 | [P] pike a.1 PIKE_PLUME tan (87ab1edc) struck 1 - 8/8, 11 struck
## Last verdicts (critic header lines verbatim)
- GAP: [S] legacy.banner_bearer (545192dc) VERDICT: APPROVE CRITERION: legacy.banner_bearer.d PASS   (previous: FAIL)
- GAP: [S] legacy.flag_bearer (545192dc) VERDICT: APPROVE CRITERION: legacy.flag_bearer.d PASS   (previous: FAIL)
- GAP: [S] legacy.poacher (ec355f73) VERDICT: APPROVE CRITERION: legacy.poacher.c FAIL   (previous: FAIL)
- GAP: [S] legacy.blowdarter (ec355f73) VERDICT: APPROVE CRITERION: legacy.blowdarter.c FAIL   (previous: FAIL)
- GAP: [S] legacy.pike (ab5eacbe) VERDICT: APPROVE CRITERION: legacy.pike.a FAIL   (previous: FAIL)
- GAP: [S] legacy.barrel_roller (ab5eacbe) VERDICT: APPROVE CRITERION: legacy.barrel_roller.a FAIL   (previous: FAIL)
- GAP: [S] legacy.boxer (af84fde5) VERDICT: APPROVE CRITERION: legacy.boxer.a PASS   (previous: FAIL)
- GAP: [S] legacy.peasant (af84fde5) VERDICT: APPROVE CRITERION: legacy.peasant.a PASS   (previous: FAIL)
- REGRESSIONS: none
- CONFIRM 465: legacy.banner_bearer a PASS b FAIL c PASS d PASS; legacy.peasant a FAIL b PASS c PASS d PASS; legacy.boxer a FAIL b FAIL c PASS d PASS
## Notes for next iteration (max 5 lines)
- Banner bearer: only b is open (CONFIRM 465: banner ray fan, crenellated arch emblem, thick gold-fitted pole); a, c, d confirmed.
- Peasant (a: tan undersleeves) and boxer (a: bare team chest; b: big team gloves) are one blocker each from a second CONFIRM.
- Both bearers' blow is a lunge with the pole plumb (BEARER_HOLD): a swung chop is a CONFIRM watch for the flag bearer.
- Poacher c.1: keep the bow in the weapon fist on the march and drawn at release. Barrel roller c.2: roll the ridden barrel into the enemy.
- Starvation at 467: poacher a (last 461) if not picked at 466.
## Unit file template (loop/units/<id>.md, cap 3200 bytes)
```
# <unitId>
Status: open|done|parked   Audited: <iter>   Done: <iter or ->
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4 (6 on a), and the count of approved [S] since the list was written)
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
