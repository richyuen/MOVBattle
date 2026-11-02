# Loop state (v7: a look list holds 6 blockers with the build first, the tail overlaps below 7 picks, a plateau [R] goes next, CONFIRM runs beside the critic; v6: one batch at a time, up to 7 structural gaps per iteration, a CONFIRM critic before D and two CONFIRM fails make a plateau, a criterion a CONFIRM passed stays passed, the critic sees the diff and never the worker's words, the capture frames a unit by its mesh top)
Iteration: 469   Batch: legacy_2   Consecutive empty: 0   Done: 78/139   Parked: 0
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
legacy_1: peasant ++++ D | banner_bearer ++++ D | poacher ++++ D | blowdarter ++++ D | pike ++++ D | barrel_roller ++++ D | boxer ++++ D | flag_bearer ++++ D
legacy_2: pharaoh ---+ o | wizard ---+ o | chariot --++ o | thor ---+ o | tank -+-+ o | super_boxer ---+ o | dark_peasant ---+ o | super_peasant -+-+ o
good: devout_gauntlet ???? q | celestial_aegis ???? q | radiant_glaive ???? q | righteous_paladin ???? q | divine_arbiter ???? q | sacred_elephant ???? q | chronomancer ???? q
evil: shadow_walker ???? q | exiled_sentinel ???? q | mad_mechanic ???? q | void_cultist ???? q | tempest_lich ???? q | death_bringer ???? q | void_monarch ???? q
secret_1: ballooner ???? q | bomb_on_a_stick ???? q | fan_bearer ???? q | raptor ???? q | the_teacher ???? q | jester ???? q | ball_n_chain ???? q | chu_ko_nu ???? q | executioner ???? q | shouter ???? q
secret_2: taekwondo ???? q | raptor_rider ???? q | cheerleader ???? q | cupid ???? q | mace_spinner ???? q | clams ???? q | present_elf ???? q | ice_mage ???? q | infernal_whip ???? q | bank_robbers ???? q
secret_3: witch ???? q | banshee ???? q | necromancer ???? q | solar_architect ???? q | wheelbarrow_dragon ???? q | skeleton_giant ???? q | bomb_cannon ???? q | cavalry ???? q | vlad ???? q | gatling_gun ???? q
secret_4: blackbeard ???? q | samurai_giant ???? q | ullr ???? q | lady_red_jade ???? q | sensei ???? q | shogun ???? q | tree_giant ???? q | artemis ???? q | ice_giant ???? q

## Focus (every gap this iteration: tag, unit, gap, sha, verdict; the line ends in `- <approved>/<total>, <struck> struck`)
469 (BASE fe9d7ce1; evidence 6eb6f1ea + bee62d6c blowdarter idle swings .4 rad): [S] blowdarter a.2 BLOWDARTER_SCARF solid V (3495f889) struck 2 | [S] blowdarter a.1 BLOWDARTER_SHORTS (9c5878c2) struck 1 | [S] blowdarter a.3 BLOWDARTER_HAIR (8c918f0e) struck 3, a PASS | [S] barrel_roller c.2 BARREL_ROLL.ridden (d67af714, 5cabc202) struck 2, c PASS | [P] barrel_roller a.7 pantTo .8 (f5721bce) struck 7, a PASS | [S] pharaoh b.1 PHARAOH_CROOK (32f27e05) struck 1 | [S] pharaoh a.1 MODIUS (7c1181a9) struck 1 | [S] thor a.1 WINGED_BAND (e9078ccf, de828e55) struck 1; CONFIRM passed blowdarter, barrel_roller: D; legacy_1 checkpoint 12/12 GREEN - 8/8, 8 struck
468 (BASE 0692a0e6; [P] legacy_2 stats 1cc82c80; legacy_2 audited): [S] barrel_roller c.2 BARREL_ROLL (5a54adf1) kept | [S] blowdarter a.2 BLOWDARTER_SCARF (6539168f, shared) kept | [S] blowdarter a.3 BLOWDARTER_PANTS (6539168f) REJECT, hunk reverted a49b8e78 | [S] barrel_roller a.3 BARREL_HAIR (6539168f) struck 3 | [S] barrel_roller a.6 BARREL_LEGS (6539168f) struck 6, added 7 | [S] super_peasant b.1 SUPER_CUFFS (9c6d188f, shared) struck 1, b PASS | [S] wizard a.2 WIZARD_BEARD (9c6d188f) struck 2; CONFIRM passed barrel_roller a, b, c (gap critic kept a, c open), failed blowdarter a (3 new) - 6/7, 4 struck
467 (BASE c07c1bca): [S] blowdarter c.3 POISON (ab237b96) struck 3, c PASS | [S] poacher c.1 DRAWS_BEFORE_LOOSE (8faddfa9) struck 1, c PASS | [S] flag_bearer a.4 FLAG_BOOTS (c676cf71, shared) struck 4, a PASS | [S] pike a.4 PIKE_BELT (c676cf71) struck 4 | [S] pike a.3 PIKE_HAIR (c676cf71) struck 3, a PASS | [S] poacher a.4 POACHER_KNEES (c676cf71) struck 4, a PASS | [S] barrel_roller a.5 BARREL_WRAPS (c676cf71) struck 5; CONFIRM passed flag_bearer, pike, poacher: D - 7/7, 7 struck
## Last verdicts (critic header lines verbatim)
- GAP: [S] legacy.blowdarter (3495f889) VERDICT: APPROVE CRITERION: legacy.blowdarter.a FAIL   (previous: FAIL)
- GAP: [S] legacy.blowdarter (9c5878c2) VERDICT: APPROVE CRITERION: legacy.blowdarter.a FAIL   (previous: FAIL)
- GAP: [S] legacy.blowdarter (8c918f0e) VERDICT: APPROVE CRITERION: legacy.blowdarter.a PASS   (previous: FAIL)
- GAP: [S] legacy.barrel_roller (d67af714, follow-up 5cabc202) VERDICT: APPROVE CRITERION: legacy.barrel_roller.c PASS   (previous: FAIL)
- GAP: [P] legacy.barrel_roller (f5721bce) VERDICT: APPROVE CRITERION: legacy.barrel_roller.a PASS   (previous: FAIL)
- GAP: [S] legacy.pharaoh (32f27e05) VERDICT: APPROVE CRITERION: legacy.pharaoh.b FAIL   (previous: FAIL)
- GAP: [S] legacy.pharaoh (7c1181a9) VERDICT: APPROVE CRITERION: legacy.pharaoh.a FAIL   (previous: FAIL)
- GAP: [S] legacy.thor (e9078ccf, follow-up de828e55) VERDICT: APPROVE CRITERION: legacy.thor.a FAIL   (previous: FAIL)
- REGRESSIONS: none
- CONFIRM 469: legacy.blowdarter, legacy.barrel_roller a PASS b PASS c PASS d PASS (4/4)
## Notes for next iteration (max 5 lines)
- legacy_1 is closed (all D; checkpoint 12/12 GREEN at 469). Batch is legacy_2 alone: 8 open units, enough for 7 picks, no tail overlap yet.
- Pharaoh and thor carry the 469 critic's fresh Ranked gaps (flail, garb, kneel aura; hair, Mjolnir, coat); the other six keep the 468 audit's.
- Untouched since the audit: wizard b sword, chariot a helmet, tank a riders / c fireball, super_boxer a hair, dark_peasant b hands, super_peasant c flight.
- Starvation: none due at 470 (every legacy_2 criterion was audited at 468).
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
