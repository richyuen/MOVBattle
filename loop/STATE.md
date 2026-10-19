# Loop state (v2: one batch at a time, up to 7 structural gaps per iteration)
Iteration: 367   Batch: tribal:re (5/21)   Consecutive empty: 0   Done: 24/139   Parked: 0
Batches, in order: tribal, renaissance, farmer, medieval, tribal:re, renaissance:re, farmer:re, ancient, viking, dynasty, pirate, spooky, wild_west, legacy_1, legacy_2, good, evil, secret_1, secret_2, secret_3, secret_4

## Scoreboard (a b c d as + pass, - fail, ? unscored; status q queued, o open, D done, p parked)
tribal: clubber ++++ D | protector -+++ o | spear_thrower -+++ o | stoner -+++ o | bone_mage ++++ D | chieftain ++++ D | mammoth -+++ o
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
367 (BASE b00e7e6): [S] protector a face plate 8762812 approved | [S] clubber a loin strips d0909d5 approved (D) | [S] stoner a skirt tongues de2744b+df9a744 approved | [S] mammoth a ears 0d9c3d0+b40c498 approved | [S] mammoth a fur hem c69689e+d55dff7 rejected (reverted) | [S] chieftain a beard 6c66d85 approved (D); step 2 re-audit protector.a (look shots); no [P]

## Last verdicts (critic header lines verbatim)
- GAP: [S] tribal.protector (8762812) VERDICT: APPROVE CRITERION: tribal.protector.a FAIL (previous: FAIL)
- GAP: [S] tribal.clubber (d0909d5) VERDICT: APPROVE CRITERION: tribal.clubber.a PASS (previous: FAIL)
- GAP: [S] tribal.stoner (de2744b + df9a744) VERDICT: APPROVE CRITERION: tribal.stoner.a FAIL (previous: FAIL)
- GAP: [S] tribal.mammoth (0d9c3d0 + b40c498) VERDICT: APPROVE CRITERION: tribal.mammoth.a FAIL (previous: FAIL)
- GAP: [S] tribal.mammoth (c69689e + d55dff7) VERDICT: REJECT CRITERION: tribal.mammoth.a FAIL (previous: FAIL)
- GAP: [S] tribal.chieftain (6c66d85) VERDICT: APPROVE CRITERION: tribal.chieftain.a PASS (previous: FAIL)

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
- Pick next: protector jaw plate + brown arcs; stoner rear box (not the skirt: did not move with band/tongues; colour-probe meshes first); mammoth continuous barrel skirt over leg roots (one more reject plateaus mammoth.a), mammoth tapered legs; mammoth hump needs an evidence re-aim first.
- spear_thrower has only a [P] (TUSK_BAND reversal): give it a fresh audit entry when picks run short (fewer than 5 [S] left: tail-overlap renaissance:re audit).
- Capture: particle systems do not render on the stepped clock. Lathes wound top-down face inward. Tans on bone/wood PBR read grey: matte cloth. Same-colour flaps flush on a surface vanish: stand them off, darker.
- Never bakeCurrentTransformIntoVertices after parenting (bakes the world matrix). Light warm cloth: medievalDress warmCloth + unglow.
- [P] fallouts re-nudging rows approved in the last 20 iterations get rejected as ledger reversals: skip them.
