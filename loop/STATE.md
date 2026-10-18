# Loop state (v2: one batch at a time, up to 5 structural gaps per iteration)
Iteration: 332   Batch: renaissance (2/18)   Consecutive empty: 0   Done: 7/139   Parked: 0
Batches, in order: tribal, renaissance, farmer, medieval, ancient, viking, dynasty, pirate, spooky, wild_west, legacy_1, legacy_2, good, evil, secret_1, secret_2, secret_3, secret_4

## Scoreboard (a b c d as + pass, - fail, ? unscored; status q queued, o open, D done, p parked)
tribal: clubber ++++ D | protector ++++ D | spear_thrower ++++ D | stoner ++++ D | bone_mage ++++ D | chieftain ++++ D | mammoth ++++ D
renaissance: painter -+++ o | fencer -+-+ o | balloon_archer -+-+ o | musketeer -+++ o | halberd -+-+ o | jouster ---+ o | da_vinci_tank -+++ o
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
332 (BASE 49f6b1a): [S] musketeer c bullet fling ac25108 approved | [S] painter c paint splotches f7538a3 approved | [S] jouster c lance on target 062a748 approved | [S] painter a long dark hair cfb3c57 approved | [S] balloon_archer c balloon float c99a50c + 08c4efd approved | [P] da_vinci_tank a scale caea7ba rejected (reverted 9e4f452). Evidence 71a3a47 + c1db599 (float ability shots). Fencer c legs skipped: override not found (rapier skips _aimBlow); musketeer a moustache swapped out (idle sees his back).
331 (BASE 2729fab): 5/5 approved (da vinci roof + barrels, painter palette out, musketeer shouldered aim, fencer point-first rapier).

## Last verdicts (critic header lines verbatim)
- GAP: [S] renaissance.musketeer (ac25108) VERDICT: APPROVE CRITERION: renaissance.musketeer.c PASS (previous: FAIL) BLOCKERS: struck: 2 (list now empty)
- GAP: [S] renaissance.painter (f7538a3) VERDICT: APPROVE CRITERION: renaissance.painter.c PASS (previous: FAIL) BLOCKERS: struck: 1 (list now empty)
- GAP: [S] renaissance.jouster (062a748) VERDICT: APPROVE CRITERION: renaissance.jouster.c FAIL (previous: FAIL) BLOCKERS: struck: 2; added: 3 (lance dips ~30 deg out of the caparison)
- GAP: [S] renaissance.painter (cfb3c57) VERDICT: APPROVE CRITERION: renaissance.painter.a FAIL (previous: FAIL) BLOCKERS: struck: 1; remaining: 2
- GAP: [S] renaissance.balloon_archer (c99a50c + 08c4efd) VERDICT: APPROVE CRITERION: renaissance.balloon_archer.c FAIL (previous: FAIL) BLOCKERS: struck: 1; remaining: 2
- GAP: [P] renaissance.da_vinci_tank (caea7ba) VERDICT: REJECT CRITERION: renaissance.da_vinci_tank.a FAIL (previous: FAIL) BLOCKERS: 4 (ledger reversal; roof flattened; lineup cuts the tank off)
- REGRESSIONS: none. d PASS 7/7 (stats 332).

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
- Open picks: balloon_archer c arrow ball, painter a jabot, musketeer a facial hair (idle sees his back: make it proud in profile), jouster c level lance (yaw-only aim, dip ~COUCH.dip) and a horse, fencer c lunge legs (override not in _aimBlow; look at lines ~1318/1371/1514 layers), halberd a body; da vinci needs a lineup evidence commit (tank cut off) before a uniform proportions.scale [P].
- A ranged shot fires at the very start of its attack (often from the march): a pose for the release frame must already be up before the attack (see _aimMusket).
- Props turned in the fist: stand them in the world (Matrix.FromXYZAxesToRef, local = world * handRot^T) as _poseHalberd/_pointRapier/_aimMusket do; _armTo solves either arm onto a world point.
- A missile's mechanic is logged under its shooter via ProjectileSystem.abilityHook; capture frame 4 follows a floating man. Probes: console.log in source + vite build + playwright with Chrome (no scene on window.game).
- After any --iter capture rerun stats --batch <batch> --iter N. capture needs a clean tree. Write memory files with Write or a node script file (bash eats backticks in inline node -e).
