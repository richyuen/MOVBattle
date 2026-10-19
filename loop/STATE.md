# Loop state (v2: one batch at a time, up to 7 structural gaps per iteration)
Iteration: 376   Batch: tribal:re+renaissance:re+farmer:re (5-7/21)   Consecutive empty: 0   Done: 20/139   Parked: 0
Batches, in order: tribal, renaissance, farmer, medieval, tribal:re, renaissance:re, farmer:re, ancient, viking, dynasty, pirate, spooky, wild_west, legacy_1, legacy_2, good, evil, secret_1, secret_2, secret_3, secret_4

## Scoreboard (a b c d as + pass, - fail, ? unscored; status q queued, o open, D done, p parked)
tribal: clubber ++++ D | protector ++++ D | spear_thrower ++++ D | stoner ++++ D | bone_mage ++++ D | chieftain ++++ D | mammoth -+++ o
renaissance: painter ++++ D | fencer ++++ D | balloon_archer ++++ D | musketeer ++++ D | halberd -+++ o | jouster ++++ D | da_vinci_tank ++++ D
farmer: halfling -+++ o | farmer -+++ o | hay_baler ++++ D | potion_seller --++ o | harvester -+++ o | wheelbarrow -+++ o | scarecrow -+++ o
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
376 (BASE b0e9788; evidence b0917e5 mammoth motion cameras): [S] halberd a square stance d66db47 approved | [S] harvester a chest braids ca0eef1 approved | [S] scarecrow a upright perched crows a5e59c1 approved | [S] halfling a open coat e8d2448 approved | [S] potion_seller a fitted jerkin bfd2385 approved | [S] farmer a tall hood 5162e03 approved | [S] wheelbarrow a riders on the tray 78a73b0 approved | [P] potion_seller b flask seat 665e5e0 rejected (reverted 508f32f)

## Last verdicts (critic header lines verbatim)
- GAP: [S] renaissance.halberd (d66db47) VERDICT: APPROVE CRITERION: renaissance.halberd.a FAIL (previous: FAIL)
- GAP: [S] farmer.harvester (ca0eef1) VERDICT: APPROVE CRITERION: farmer.harvester.a FAIL (previous: FAIL)
- GAP: [S] farmer.scarecrow (a5e59c1) VERDICT: APPROVE CRITERION: farmer.scarecrow.a FAIL (previous: FAIL)
- GAP: [S] farmer.halfling (e8d2448) VERDICT: APPROVE CRITERION: farmer.halfling.a FAIL (previous: FAIL)
- GAP: [S] farmer.potion_seller (bfd2385) VERDICT: APPROVE CRITERION: farmer.potion_seller.a FAIL (previous: FAIL)
- GAP: [S] farmer.farmer (5162e03) VERDICT: APPROVE CRITERION: farmer.farmer.a FAIL (previous: FAIL)
- GAP: [S] farmer.wheelbarrow (78a73b0) VERDICT: APPROVE CRITERION: farmer.wheelbarrow.a FAIL (previous: FAIL)
- GAP: [P] farmer.potion_seller (665e5e0) VERDICT: REJECT CRITERION: farmer.potion_seller.b FAIL (previous: FAIL)

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
- Evidence b0917e5 re-aimed the mammoth's motion shots: next iteration's step 2 RE-AUDITS tribal.mammoth criterion a only (give the critic its Verdicts block), before any mammoth gap.
- farmer.farmer _idle is his front (the old hood hid the face); no farmer camera change. [P] fallout pickable: farmer TALL_HOOD tip (5162e03), halfling belt/buckle (e8d2448).
- Scripts take faction names: --batch farmer for farmer:re. Farmer cloth/hair goes in web/src/units/farmerDress.ts (exists since 376).
- A pose wrong only in the capture: probe the animator's own state at the shot (376: _javelin() matched the halberd's "shaft", so a gate keyed on it was dead).
- Capture replays are deterministic. Particles do not render on the stepped clock. Never bakeCurrentTransformIntoVertices after parenting. Write node scripts with the Write tool.
