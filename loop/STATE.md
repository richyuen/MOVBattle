# Loop state (v7: a look list holds 6 blockers with the build first, the tail overlaps below 7 picks, a plateau [R] goes next, CONFIRM runs beside the critic; v6: one batch at a time, up to 7 structural gaps per iteration, a CONFIRM critic before D and two CONFIRM fails make a plateau, a criterion a CONFIRM passed stays passed, the critic sees the diff and never the worker's words, the capture frames a unit by its mesh top)
Iteration: 467   Batch: legacy_1 (11/14)   Consecutive empty: 0   Done: 76/139   Parked: 0
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
legacy_1: peasant ++++ D | banner_bearer ++++ D | poacher ++++ D | blowdarter -+++ o | pike ++++ D | barrel_roller -+-+ o | boxer ++++ D | flag_bearer ++++ D
legacy_2: pharaoh ???? q | wizard ???? q | chariot ???? q | thor ???? q | tank ???? q | super_boxer ???? q | dark_peasant ???? q | super_peasant ???? q
good: devout_gauntlet ???? q | celestial_aegis ???? q | radiant_glaive ???? q | righteous_paladin ???? q | divine_arbiter ???? q | sacred_elephant ???? q | chronomancer ???? q
evil: shadow_walker ???? q | exiled_sentinel ???? q | mad_mechanic ???? q | void_cultist ???? q | tempest_lich ???? q | death_bringer ???? q | void_monarch ???? q
secret_1: ballooner ???? q | bomb_on_a_stick ???? q | fan_bearer ???? q | raptor ???? q | the_teacher ???? q | jester ???? q | ball_n_chain ???? q | chu_ko_nu ???? q | executioner ???? q | shouter ???? q
secret_2: taekwondo ???? q | raptor_rider ???? q | cheerleader ???? q | cupid ???? q | mace_spinner ???? q | clams ???? q | present_elf ???? q | ice_mage ???? q | infernal_whip ???? q | bank_robbers ???? q
secret_3: witch ???? q | banshee ???? q | necromancer ???? q | solar_architect ???? q | wheelbarrow_dragon ???? q | skeleton_giant ???? q | bomb_cannon ???? q | cavalry ???? q | vlad ???? q | gatling_gun ???? q
secret_4: blackbeard ???? q | samurai_giant ???? q | ullr ???? q | lady_red_jade ???? q | sensei ???? q | shogun ???? q | tree_giant ???? q | artemis ???? q | ice_giant ???? q

## Focus (every gap this iteration: tag, unit, gap, sha, verdict; the line ends in `- <approved>/<total>, <struck> struck`)
467 (BASE c07c1bca): [S] blowdarter c.3 POISON (ab237b96) struck 3, c PASS | [S] poacher c.1 DRAWS_BEFORE_LOOSE (8faddfa9) struck 1, c PASS | [S] flag_bearer a.4 FLAG_BOOTS (c676cf71, shared) struck 4, a PASS | [S] pike a.4 PIKE_BELT (c676cf71) struck 4 | [S] pike a.3 PIKE_HAIR (c676cf71) struck 3, a PASS | [S] poacher a.4 POACHER_KNEES (c676cf71) struck 4, a PASS | [S] barrel_roller a.5 BARREL_WRAPS (c676cf71) struck 5; CONFIRM passed flag_bearer, pike, poacher: D - 7/7, 7 struck
466 (BASE f28b5a0d): [S] banner_bearer b.3 BANNER_POLE (c3045bf2) struck 3 | [S] banner_bearer b.2 BANNER_ARCH (39c35a54) struck 2 | [S] banner_bearer b.1 BANNER_FAN (13b2b797) struck 1, b PASS | [S] peasant a.1 PEASANT_SLEEVES (07c88423, shared) struck 1, a PASS | [S] boxer a.1 boxerBareChest (07c88423) struck 1, a PASS | [S] flag_bearer a.3 FLAG_CUFFS (07c88423) struck 3 | [S] boxer b.1 TEAM_GLOVE rebuild (7bac4615) struck 1, b PASS; CONFIRM passed banner_bearer, peasant, boxer: D - 7/7, 7 struck
465 (BASE 1bacaa78; evidence 2b229594 bearer spars his squire with the hurt ally in the ring): [S] banner_bearer + flag_bearer d polearm_melee blow, BEARER_PULSE (545192dc) d PASS both | [S] poacher c.2 SMALL_ARROW (ec355f73) struck 2 | [S] blowdarter c.2 BLOW_DART (ec355f73) struck 2 | [S] pike a.2 PIKE_VEST (ab5eacbe) struck 2 | [S] barrel_roller a.4 BARREL_VEST (ab5eacbe) struck 4 | [S] boxer a.1 build 1.08 (af84fde5) struck 1, a PASS | [S] peasant a.1 build 1.00 (af84fde5) struck 1, a PASS; CONFIRM failed banner b (3 new), peasant a (1 new), boxer a, b (1 each) - 7/7, 6 struck
## Last verdicts (critic header lines verbatim)
- GAP: [S] legacy.blowdarter (ab237b96) VERDICT: APPROVE CRITERION: legacy.blowdarter.c PASS   (previous: FAIL)
- GAP: [S] legacy.poacher (8faddfa9) VERDICT: APPROVE CRITERION: legacy.poacher.c PASS   (previous: FAIL)
- GAP: [S] legacy.flag_bearer (c676cf71) VERDICT: APPROVE CRITERION: legacy.flag_bearer.a PASS   (previous: FAIL)
- GAP: [S] legacy.pike (c676cf71) VERDICT: APPROVE CRITERION: legacy.pike.a PASS   (previous: FAIL) (blockers 4 and 3)
- GAP: [S] legacy.poacher (c676cf71) VERDICT: APPROVE CRITERION: legacy.poacher.a PASS   (previous: FAIL)
- GAP: [S] legacy.barrel_roller (c676cf71) VERDICT: APPROVE CRITERION: legacy.barrel_roller.a FAIL   (previous: FAIL)
- REGRESSIONS: none
- CONFIRM 467: legacy.flag_bearer, legacy.pike, legacy.poacher a PASS b PASS c PASS d PASS (4/4)
## Notes for next iteration (max 5 lines)
- legacy_1 has 2 open units: blowdarter a (2 scarf, 3 pants) and barrel_roller a (3 hair, 6 legs) and c (2 roll the barrel into the enemy).
- Those are 5 picks, under 7: the tail overlaps legacy_2's audit this iteration (step 2 audits legacy_2 beside the legacy_1 picks).
- Barrel roller c.2: he walks the BARREL_RIDE barrel forward under his feet into the enemy, the blast on contact, in place of the 6 m throw.
- CONFIRM watches: blowdarter dye on skin only; barrel grey tunic hem under the vest.
- Starvation: none due at 468.
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
