# Loop state (v2: one batch at a time, up to 7 structural gaps per iteration)
Iteration: 365   Batch: tribal:re (5/21)   Consecutive empty: 0   Done: 21/139   Parked: 0
Batches, in order: tribal, renaissance, farmer, medieval, tribal:re, renaissance:re, farmer:re, ancient, viking, dynasty, pirate, spooky, wild_west, legacy_1, legacy_2, good, evil, secret_1, secret_2, secret_3, secret_4

## Scoreboard (a b c d as + pass, - fail, ? unscored; status q queued, o open, D done, p parked)
tribal: clubber -+++ o | protector -+++ o | spear_thrower -+++ o | stoner -+++ o | bone_mage -+++ o | chieftain -+++ o | mammoth --++ o
renaissance: painter ++++ D | fencer ++++ D | balloon_archer ++++ D | musketeer ++++ D | halberd ++++ D | jouster ++++ D | da_vinci_tank ++++ D
farmer: halfling ++++ D | farmer ++++ D | hay_baler ++++ D | potion_seller ++++ D | harvester ++++ D | wheelbarrow ++++ D | scarecrow ++++ D
medieval: bard ++++ D | squire ++++ D | archer ++++ D | healer ++++ D | knight ++++ D | catapult ++++ D | king ++++ D
ancient: shield_bearer ???? q | sarissa ???? q | hoplite ???? q | snake_archer ???? q | ballista ???? q | minotaur ???? q | zeus ???? q
viking: headbutter ???? q | ice_archer ???? q | brawler ???? q | berserker ???? q | valkyrie ???? q | longship ???? q | jarl ???? q
dynasty: samurai ???? q | firework_archer ???? q | monk ???? q | ninja ???? q | dragon ???? q | hwacha ???? q | monkey_king ???? q
pirate: flintlock ???? q | blunderbuss ???? q | bomb_thrower ???? q | harpooner ???? q | cannon ???? q | captain ???? q | pirate_queen ???? q
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

## Focus (every gap this iteration: tag, unit, gap, sha, verdict)
365 (BASE 77c590e): [R] king a legs b1fa1af+09dfc00 approved | [S] mammoth a barrel body 50ae24c approved | [S] mammoth b trunk 0a02077 approved | [S] clubber a stance 6fba04b approved | [S] stoner a skirt per thigh 8db2654 approved | [S] bone_mage a mask rack sweep 179ef76 rejected (reverted 9f92944) | [S] chieftain a helm seat 7d98745 approved; no [P] (fallouts re-nudge 362-364 rows)

## Last verdicts (critic header lines verbatim)
- GAP: [R] medieval.king (b1fa1af +09dfc00) VERDICT: APPROVE CRITERION: medieval.king.a PASS (previous: FAIL, plateau)
- GAP: [S] tribal.mammoth (50ae24c) VERDICT: APPROVE CRITERION: tribal.mammoth.a FAIL (previous: FAIL)
- GAP: [S] tribal.mammoth (0a02077) VERDICT: APPROVE CRITERION: tribal.mammoth.b FAIL (previous: FAIL)
- GAP: [S] tribal.clubber (6fba04b) VERDICT: APPROVE CRITERION: tribal.clubber.a FAIL (previous: FAIL)
- GAP: [S] tribal.stoner (8db2654) VERDICT: APPROVE CRITERION: tribal.stoner.a FAIL (previous: FAIL)
- GAP: [S] tribal.bone_mage (179ef76) VERDICT: REJECT CRITERION: tribal.bone_mage.a FAIL (previous: FAIL)
- GAP: [S] tribal.chieftain (7d98745) VERDICT: APPROVE CRITERION: tribal.chieftain.a FAIL (previous: FAIL)

## Unit file template (loop/units/<id>.md, cap 2600 bytes)
```
# <unitId>
Status: open|done|parked   Audited: <iter>   Done: <iter or ->
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (0 since <iter>)
 1. <element> in unit_<id>_<shot> — TABS: <what the reference shows> (ref: <file or card section>)
b PASS (<iter>)
c FAIL (0 since <iter>) [plateau|parked when marked]
 1. missing: <mechanic>
d PASS|FAIL (<the stats.json line, shortened>)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] c <gap> — blocker 1: <mechanism> — ref: <file> — ours: <png>
## Attempts (iter | gap | criterion | verdict: approved, rejected, rejected-kept, dropped)
## Rejected (last 4: gap [tag] [attempts] — iter: what — critic's top defect)
## Notes (max 3 lines)
```

## Notes for next iteration (max 5 lines)
- Medieval checkpoint ran 365 (regression 12/12 GREEN, no re-baseline). Batch is tribal:re alone; its units are already audited (360 files): pick from their ranked gaps, no step 2.
- Pick next: mammoth tusks (bone-tan, bands) + hump/leg roots, chieftain shoulder skulls + beard, clubber hair + loincloth, stoner strap, bone_mage worn rack (attempt 2: near-level beams, own darker tan ~.58,.42,.26), protector idle evidence re-aim (capture.mjs, head beside the slab; not a pick).
- Capture: particle systems do not render on the stepped clock (sprite meshes). Lathes wound top-down face inward. Pale tan self-lit reads grey/cream: go darker and warmer.
- Light warm cloth: medievalDress warmCloth + unglow every mesh in it. [P] fallouts re-nudging rows approved in the last 20 iterations get rejected as ledger reversals: skip them.
