# Loop state (v7: a look list holds 6 blockers with the build first, the tail overlaps below 7 picks, a plateau [R] goes next, CONFIRM runs beside the critic; v6: one batch at a time, up to 7 structural gaps per iteration, a CONFIRM critic before D and two CONFIRM fails make a plateau, a criterion a CONFIRM passed stays passed, the critic sees the diff and never the worker's words, the capture frames a unit by its mesh top)
Iteration: 462   Batch: legacy_1 (6/14)   Consecutive empty: 0   Done: 70/139   Parked: 0
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
legacy_1: peasant -+++ o | banner_bearer +-+- o | poacher ---+ o | blowdarter ---+ o | pike ---+ o | barrel_roller ---+ o | boxer -+-+ o | flag_bearer --+- o
legacy_2: pharaoh ???? q | wizard ???? q | chariot ???? q | thor ???? q | tank ???? q | super_boxer ???? q | dark_peasant ???? q | super_peasant ???? q
good: devout_gauntlet ???? q | celestial_aegis ???? q | radiant_glaive ???? q | righteous_paladin ???? q | divine_arbiter ???? q | sacred_elephant ???? q | chronomancer ???? q
evil: shadow_walker ???? q | exiled_sentinel ???? q | mad_mechanic ???? q | void_cultist ???? q | tempest_lich ???? q | death_bringer ???? q | void_monarch ???? q
secret_1: ballooner ???? q | bomb_on_a_stick ???? q | fan_bearer ???? q | raptor ???? q | the_teacher ???? q | jester ???? q | ball_n_chain ???? q | chu_ko_nu ???? q | executioner ???? q | shouter ???? q
secret_2: taekwondo ???? q | raptor_rider ???? q | cheerleader ???? q | cupid ???? q | mace_spinner ???? q | clams ???? q | present_elf ???? q | ice_mage ???? q | infernal_whip ???? q | bank_robbers ???? q
secret_3: witch ???? q | banshee ???? q | necromancer ???? q | solar_architect ???? q | wheelbarrow_dragon ???? q | skeleton_giant ???? q | bomb_cannon ???? q | cavalry ???? q | vlad ???? q | gatling_gun ???? q
secret_4: blackbeard ???? q | samurai_giant ???? q | ullr ???? q | lady_red_jade ???? q | sensei ???? q | shogun ???? q | tree_giant ???? q | artemis ???? q | ice_giant ???? q

## Focus (every gap this iteration: tag, unit, gap, sha, verdict; the line ends in `- <approved>/<total>, <struck> struck`)
462 (BASE a76273ed; evidence a76273ed lineup spacingZ 1.85): [S] blowdarter a.1 BLOWDARTER_HAIR (918046b8) struck 1, 4, 5 | [S] pike a.1 cavalier_hat (9708312a) none struck (plume team) | [S] poacher b.2 quiver_back (8e47a5ac) struck 2 | [S] poacher c.1 HAND_LAUNCH (2f129417) none struck (bow not drawn at release) | [S] blowdarter c.1 MOUTH_LAUNCH (2f129417 half) REJECT, reverted 24f067a4 | [P] flag_bearer + banner_bearer c.1 BEARER_RING radius 2.2, root exception (d9f8f8c5) struck 1 each, c PASS both; lineup RE-AUDIT frames both ends - 6/7, 6 struck
461 (BASE 45af209a; evidence 76c80649 bearer framing, 45af209a lineup ranks): [S] banner_bearer a.3 BANNER_CUFFS (e0b0812b) struck 3, a PASS | [S] boxer a.4 BOXER_BOOTS (66d5aaff) struck 4 | [S] flag_bearer a.2 FLAG_JACKET (a397cd1f) struck 2 | [S] peasant a.6 PEASANT_LEGS (a1d34191) struck 6 | [S] peasant a.3 PEASANT_FRINGE (5978f032) struck 3 | [S] poacher a.5 POACHER_BOOTS (e811b7eb) struck 5, 6 | [P] peasant a.5 PEASANT_BELT fat rope (a4a2f336) struck 5; RE-AUDIT of the bearers' c (new lists: no ring on the ally) and of a in the new lineup; follow-ups 0c/0d on f1ecb6fc dropped (reverted) - 7/7, 8 struck
460 (BASE 256e7abe): [S] banner_bearer a.2 BANNER_COATEE (16dedb8c) struck 2 | [S] flag_bearer a.1 FLAG_HELMET (53a654d8) struck 1 | [S] boxer a.3 BOXER_SHORTS (37bcb6d4) struck 3 | [S] peasant a.5 PEASANT_BELT (9012c361) none struck (spaced shards) | [S] poacher a.6 POACHER_BELT (59057417) none struck (inside the coat) | [S] flag_bearer + banner_bearer c.1 BEARER_AURA haste / stay (f1ecb6fc) none struck (not seen: evidence first) | [P] flag_bearer c.3 BEARER_RING orange-gold (eb73db0b) struck 3; boxer jab not picked (the melee swing in proceduralAnimation) - 7/7, 4 struck
## Last verdicts (critic header lines verbatim)
- GAP: [S] legacy.blowdarter (918046b8) VERDICT: APPROVE CRITERION: legacy.blowdarter.a FAIL   (previous: FAIL)
- GAP: [S] legacy.pike (9708312a) VERDICT: APPROVE CRITERION: legacy.pike.a FAIL   (previous: FAIL)
- GAP: [S] legacy.poacher (8e47a5ac) VERDICT: APPROVE CRITERION: legacy.poacher.b FAIL   (previous: FAIL)
- GAP: [S] legacy.poacher (2f129417) VERDICT: APPROVE CRITERION: legacy.poacher.c FAIL   (previous: FAIL)
- GAP: [S] legacy.blowdarter (2f129417) VERDICT: REJECT CRITERION: legacy.blowdarter.c FAIL   (previous: FAIL)
- GAP: [P] legacy.flag_bearer (d9f8f8c5) VERDICT: APPROVE CRITERION: legacy.flag_bearer.c PASS   (previous: FAIL)
- GAP: [P] legacy.banner_bearer (d9f8f8c5) VERDICT: APPROVE CRITERION: legacy.banner_bearer.c PASS   (previous: FAIL)
- REGRESSIONS: none
## Notes for next iteration (max 5 lines)
- Blowdarter: the blowgun hold first (b.1: pipe level at the mouth in both hands); the dart then launches from the pipe muzzle, which clears c.1 - no new head-origin attempt.
- Starvation at 463: pike b/c, boxer c, barrel b/c have had no attempt since the 457 audit - each takes a slot (pike b.1 with its levelled grip b.3).
- Poacher c.1: the arrow leaves the fist but the bow is drawn only at _flight; hold the draw from windup through release (proceduralAnimation), then the bow mesh b.1.
- Bearers' d: dmg 0 (stats wants damageMultiplier Infinity, skipped): they need a plain blow logged as a melee hit - an [S], not a stats knob.
- BEARER_RING radius is spent (one root-exception move at 462); pike plume tan is a [P] of 9708312a.
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
