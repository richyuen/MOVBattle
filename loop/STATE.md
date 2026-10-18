# Loop state (v2: one batch at a time, up to 5 structural gaps per iteration)
Iteration: 333   Batch: renaissance (2/18)   Consecutive empty: 0   Done: 7/139   Parked: 0
Batches, in order: tribal, renaissance, farmer, medieval, ancient, viking, dynasty, pirate, spooky, wild_west, legacy_1, legacy_2, good, evil, secret_1, secret_2, secret_3, secret_4

## Scoreboard (a b c d as + pass, - fail, ? unscored; status q queued, o open, D done, p parked)
tribal: clubber ++++ D | protector ++++ D | spear_thrower ++++ D | stoner ++++ D | bone_mage ++++ D | chieftain ++++ D | mammoth ++++ D
renaissance: painter -+++ o | fencer -+++ o | balloon_archer -+++ o | musketeer -+++ o | halberd -+-+ o | jouster --++ o | da_vinci_tank -+++ o
farmer: halfling ???? q | farmer ???? q | hay_baler ???? q | potion_seller ???? q | harvester ???? q | wheelbarrow ???? q | scarecrow ???? q
medieval: bard ???? q | squire ???? q | archer ???? q | healer ???? q | knight ???? q | catapult ???? q | king ???? q
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
333 (BASE 84f6665): [S] fencer c lunge legs 90d850a approved | [S] jouster c level lance eea51ad approved | [S] balloon_archer c arrow ball 4e0e02c approved | [S] painter a jabot b8f9dd8 + d307b07 approved | [S] halberd a dress c23f17c approved. Evidence 04ea157 (lineup opened, tank whole). Da vinci scale [P] skipped (tank already ~5 men wide in the new lineup).
332 (BASE 49f6b1a): 5/6 approved (musketeer fling, painter splotches + hair, jouster lance on target, balloon float); da vinci scale [P] rejected.

## Last verdicts (critic header lines verbatim)
- GAP: [S] renaissance.fencer (90d850a) VERDICT: APPROVE CRITERION: renaissance.fencer.c PASS (previous: FAIL) BLOCKERS: struck: 4 (none remain)
- GAP: [S] renaissance.jouster (eea51ad) VERDICT: APPROVE CRITERION: renaissance.jouster.c PASS (previous: FAIL) BLOCKERS: struck: 3 (none remain)
- GAP: [S] renaissance.balloon_archer (4e0e02c) VERDICT: APPROVE CRITERION: renaissance.balloon_archer.c PASS (previous: FAIL) BLOCKERS: struck: 2 (none remain)
- GAP: [S] renaissance.painter (b8f9dd8 + d307b07) VERDICT: APPROVE CRITERION: renaissance.painter.a FAIL (previous: FAIL) BLOCKERS: 2 re-worded (shape cleared, colour remains)
- GAP: [S] renaissance.halberd (c23f17c) VERDICT: APPROVE CRITERION: renaissance.halberd.a FAIL (previous: FAIL) BLOCKERS: 2 re-worded (sleeves, gauntlets and tabard shape cleared, colour remains)
- EVIDENCE 04ea157: da_vinci_tank.a blocker 4 re-worded (width fine, roof peak too low). REGRESSIONS: none. d PASS 7/7 (stats 333).

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
- Open picks: jouster a draped horse + b heater, fencer a doublet/breeches + boots, balloon_archer a striped doublet, halberd c chop onto the man ([S]: CHOP row is approved 330, no [P] on it), da vinci a taller roof ([S]); [P] colour fallout: painter PAINTER_RUFF_COLOR, halberd HALBERD_CREAM (warmer tan, lineup shot).
- Cream cloth renders grey-white under this light: pick tans darker and warmer than the reference reads (~0.8, 0.62, 0.4). Musketeer a facial hair: idle sees his back.
- A ranged shot fires at the very start of its attack: a release pose must be up before the attack (see _aimMusket). Props stand in the world (Matrix.FromXYZAxesToRef) as _poseHalberd/_pointRapier/_aimMusket do; last-layer overrides (_lungeLegs) beat the pose stack.
- A missile's mechanic is logged under its shooter via ProjectileSystem.abilityHook; capture frame 4 follows a floating man. Faction lineups take a cameraOverride (scenarios.ts makeFactionGalleryScenario).
- After any --iter capture rerun stats --batch <batch> --iter N. capture needs a clean tree. Write memory files with heredocs or a node script file (bash eats backticks in inline node -e). LEDGER is near its 14000-byte cap: compact finished batches.
