# Loop state (v2: one batch at a time, up to 7 structural gaps per iteration)
Iteration: 370   Batch: tribal:re+renaissance:re (5-6/21)   Consecutive empty: 0   Done: 19/139   Parked: 0
Batches, in order: tribal, renaissance, farmer, medieval, tribal:re, renaissance:re, farmer:re, ancient, viking, dynasty, pirate, spooky, wild_west, legacy_1, legacy_2, good, evil, secret_1, secret_2, secret_3, secret_4

## Scoreboard (a b c d as + pass, - fail, ? unscored; status q queued, o open, D done, p parked)
tribal: clubber ++++ D | protector -+++ o | spear_thrower -+++ o | stoner ++++ D | bone_mage ++++ D | chieftain ++++ D | mammoth -+++ o
renaissance: painter -+-+ o | fencer -+-+ o | balloon_archer --++ o | musketeer -+++ o | halberd -+++ o | jouster -+++ o | da_vinci_tank ++++ D
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
370 (BASE e04817d; evidence f9da668 capture runtimeId reset): [S] jouster b candy lance 14e00d6 approved | [S] jouster a feather plume 38081d7 +1edcdf2 rejected (reverted) | [S] musketeer a collar 6bc67f7 +62c3f84 approved | [S] halberd a quilted sleeves 9295c61 approved | [S] painter a beret 8139915 +afefe3a approved | [S] protector a slab window bone 37d76c7 approved | [S] fencer c step back e2f2190 approved; no [P]

## Last verdicts (critic header lines verbatim)
- GAP: [S] renaissance.jouster (14e00d6) VERDICT: APPROVE CRITERION: renaissance.jouster.b PASS (previous: FAIL)
- GAP: [S] renaissance.jouster (38081d7 + 1edcdf2) VERDICT: REJECT CRITERION: renaissance.jouster.a FAIL (previous: FAIL)
- GAP: [S] renaissance.musketeer (6bc67f7 + 62c3f84) VERDICT: APPROVE CRITERION: renaissance.musketeer.a FAIL (previous: FAIL)
- GAP: [S] renaissance.halberd (9295c61) VERDICT: APPROVE CRITERION: renaissance.halberd.a FAIL (previous: FAIL)
- GAP: [S] renaissance.painter (8139915 + afefe3a) VERDICT: APPROVE CRITERION: renaissance.painter.a FAIL (previous: FAIL)
- GAP: [S] tribal.protector (37d76c7) VERDICT: APPROVE CRITERION: tribal.protector.a FAIL (previous: FAIL)
- GAP: [S] renaissance.fencer (e2f2190) VERDICT: APPROVE CRITERION: renaissance.fencer.c FAIL (previous: FAIL)

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
- Evidence first: re-aim unit_renaissance.painter_idle and unit_renaissance.fencer_idle to the front three-quarter (both shot from behind; blocks painter jabot, fencer hat/shoulders). Then: jouster plume as a packed bushy clump (glow <= .1), protector bone disc with eye holes, musketeer legs, halberd stray helm plate (colour-probe), fencer dodge, painter dodge (archer scene); mammoth leg tops/legs (one more reject plateaus mammoth.a).
- spear_thrower has only a [P] outside the fallout window: give it a fresh audit entry when picks run short. Scripts take faction names: --batch renaissance for renaissance:re.
- Capture replays are now deterministic (f9da668 resets RuntimeUnit._nextRuntimeId each resetBattle); earlier ability pairs could show a diverged replay. Particles do not render on the stepped clock.
- Close-ups: scratch shot.mjs pattern (spawn alone, game.frameCamera, screenshot) checks a prop in a minute; numeric probes must freeze requestAnimationFrame like capture. Team cloth glow .2 washes to lavender; tans on bone/wood PBR read grey: matte cloth.
- Never bakeCurrentTransformIntoVertices after parenting; children inherit a parent's scaling.z. [P] re-nudges of rows approved in the last 20 iterations are rejected as ledger reversals.
