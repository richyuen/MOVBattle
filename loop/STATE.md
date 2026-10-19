# Loop state (v2: one batch at a time, up to 7 structural gaps per iteration)
Iteration: 366   Batch: tribal:re (5/21)   Consecutive empty: 0   Done: 22/139   Parked: 0
Batches, in order: tribal, renaissance, farmer, medieval, tribal:re, renaissance:re, farmer:re, ancient, viking, dynasty, pirate, spooky, wild_west, legacy_1, legacy_2, good, evil, secret_1, secret_2, secret_3, secret_4

## Scoreboard (a b c d as + pass, - fail, ? unscored; status q queued, o open, D done, p parked)
tribal: clubber -+++ o | protector -+++ o | spear_thrower -+++ o | stoner -+++ o | bone_mage ++++ D | chieftain -+++ o | mammoth -+++ o
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
366 (BASE f142d6e): [S] mammoth b tusk paint ef98856+ef94f97 approved | [S] mammoth a hump + leg roots 4bc74c3+940f9b1 approved | [S] chieftain a pauldrons 0a99945+d78d6f7+65e6573 approved | [S] clubber a curly mop 6ca5eb6 approved | [S] stoner a strap d06e5d0 approved | [S] bone_mage a worn rack 1c62590+8d1905d approved (D) | evidence 59fcbb0 protector idle swing; no [P] (fallouts re-nudge rows approved 363/365)

## Last verdicts (critic header lines verbatim)
- GAP: [S] tribal.mammoth (ef98856 + ef94f97) VERDICT: APPROVE CRITERION: tribal.mammoth.b PASS (previous: FAIL)
- GAP: [S] tribal.mammoth (4bc74c3 + 940f9b1) VERDICT: APPROVE CRITERION: tribal.mammoth.a FAIL (previous: FAIL)
- GAP: [S] tribal.chieftain (0a99945 + d78d6f7 + 65e6573) VERDICT: APPROVE CRITERION: tribal.chieftain.a FAIL (previous: FAIL)
- GAP: [S] tribal.clubber (6ca5eb6) VERDICT: APPROVE CRITERION: tribal.clubber.a FAIL (previous: FAIL)
- GAP: [S] tribal.stoner (d06e5d0) VERDICT: APPROVE CRITERION: tribal.stoner.a FAIL (previous: FAIL)
- GAP: [S] tribal.bone_mage (1c62590 + 8d1905d) VERDICT: APPROVE CRITERION: tribal.bone_mage.a PASS (previous: FAIL)

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
- Step 2 next: RE-AUDIT protector.a only (evidence 59fcbb0 swung his idle 1.35 rad to his side; the head shows beside the slab, skull from the side-rear; .6 hid it, 1.0 and -.9 tried and worse). Give the critic his Verdicts block.
- Pick next: chieftain beard, clubber loincloth, stoner skirt (ring of tongues, rear tied), mammoth ears, mammoth leg-top fur hem; mammoth hump needs an evidence re-aim first (side frame showing the whole topline). spear_thrower has only a [P] (TUSK_BAND reversal): needs a fresh audit entry.
- Capture: particle systems do not render on the stepped clock (sprite meshes). Lathes wound top-down face inward. Tans on bone/wood PBR read grey: use matte cloth, darker and warmer.
- Never bakeCurrentTransformIntoVertices after parenting (bakes the world matrix). Light warm cloth: medievalDress warmCloth + unglow.
- [P] fallouts re-nudging rows approved in the last 20 iterations get rejected as ledger reversals: skip them.
