# Loop state (v2: one batch at a time, up to 7 structural gaps per iteration)
Iteration: 369   Batch: tribal:re+renaissance:re (5-6/21)   Consecutive empty: 0   Done: 19/139   Parked: 0
Batches, in order: tribal, renaissance, farmer, medieval, tribal:re, renaissance:re, farmer:re, ancient, viking, dynasty, pirate, spooky, wild_west, legacy_1, legacy_2, good, evil, secret_1, secret_2, secret_3, secret_4

## Scoreboard (a b c d as + pass, - fail, ? unscored; status q queued, o open, D done, p parked)
tribal: clubber ++++ D | protector -+++ o | spear_thrower -+++ o | stoner ++++ D | bone_mage ++++ D | chieftain ++++ D | mammoth -+++ o
renaissance: painter -+-+ o | fencer -+-+ o | balloon_archer --++ o | musketeer -+++ o | halberd -+++ o | jouster --++ o | da_vinci_tank ++++ D
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
369 (BASE 1673ae0): [S] fencer c step back fbd58e7 (+a285bea reverted) rejected-kept | [S] halberd c dash back e399131 approved | [S] jouster c canter charge 5ac2a1e approved | [S] musketeer b matchlock 828b96d approved | [S] balloon_archer b arrow in hand 1dafd49 +2c4f0d0 approved | [S] painter a jabot 9f0bd3c approved | [S] protector a window fill a321a18 approved; no [P]

## Last verdicts (critic header lines verbatim)
- GAP: [S] renaissance.fencer (fbd58e7 + a285bea) VERDICT: REJECT CRITERION: renaissance.fencer.c FAIL (previous: FAIL)
- GAP: [S] renaissance.halberd (e399131) VERDICT: APPROVE CRITERION: renaissance.halberd.c PASS (previous: FAIL)
- GAP: [S] renaissance.jouster (5ac2a1e) VERDICT: APPROVE CRITERION: renaissance.jouster.c PASS (previous: FAIL)
- GAP: [S] renaissance.musketeer (828b96d) VERDICT: APPROVE CRITERION: renaissance.musketeer.b PASS (previous: FAIL)
- GAP: [S] renaissance.balloon_archer (1dafd49 + 2c4f0d0) VERDICT: APPROVE CRITERION: renaissance.balloon_archer.b FAIL (previous: FAIL)
- GAP: [S] renaissance.painter (9f0bd3c) VERDICT: APPROVE CRITERION: renaissance.painter.a FAIL (previous: FAIL)
- GAP: [S] tribal.protector (a321a18) VERDICT: APPROVE CRITERION: tribal.protector.a FAIL (previous: FAIL)

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
- Pick next: fencer step back as a ground slide fired from _landMeleeBlow (HOP_BACK fencer entry is rejected-kept, live), protector plate on the slab, balloon_archer bow pose, jouster lance stripes/plume, musketeer collar, halberd sleeves, painter beret; mammoth leg tops/legs (one more reject plateaus mammoth.a).
- [P] fallout open: painter PAINTER_JABOT wider/warmer (9f0bd3c), musketeer MATCHLOCK stock warmer (828b96d). Evidence first: fencer idle from behind (re-aim before his hat); halberd blue shape may be the field rock.
- spear_thrower has only a [P] outside the fallout window: give it a fresh audit entry when picks run short. Scripts take faction names: --batch renaissance for renaissance:re.
- Capture: particles do not render on the stepped clock. Tans on bone/wood PBR read grey: matte cloth. Colour-probe a mystery mesh before cutting. Mechanic check: scratchpad probe of positions over time beats guessing from shots.
- Never bakeCurrentTransformIntoVertices after parenting; children inherit a parent's scaling.z. [P] re-nudges of rows approved in the last 20 iterations are rejected as ledger reversals.
