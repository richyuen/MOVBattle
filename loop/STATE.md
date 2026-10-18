# Loop state (v2: one batch at a time, up to 5 structural gaps per iteration)
Iteration: 331   Batch: renaissance (2/18)   Consecutive empty: 0   Done: 7/139   Parked: 0
Batches, in order: tribal, renaissance, farmer, medieval, ancient, viking, dynasty, pirate, spooky, wild_west, legacy_1, legacy_2, good, evil, secret_1, secret_2, secret_3, secret_4

## Scoreboard (a b c d as + pass, - fail, ? unscored; status q queued, o open, D done, p parked)
tribal: clubber ++++ D | protector ++++ D | spear_thrower ++++ D | stoner ++++ D | bone_mage ++++ D | chieftain ++++ D | mammoth ++++ D
renaissance: painter -+-+ o | fencer -+-+ o | balloon_archer -+-+ o | musketeer -+-+ o | halberd -+-+ o | jouster ---+ o | da_vinci_tank -+++ o
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
331 (BASE 2729fab): [S] da_vinci_tank a plank roof + drum e4c2a2f approved | [S] da_vinci_tank b 16 barrels da39ed0 approved | [S] painter b palette out face-up 413fb65 approved | [S] musketeer c shouldered aim 0b9f1b9 + 4992778 + 12c8bc1 approved | [S] fencer c point-first rapier d2b3a7b approved. 5/5, no [P] (halberd CHOP [P] skipped: its suggested landed 1.6 lifts the head off the man).
330 (BASE 0ef9201): 6/6 approved (fencer lunge + cup hilt, halberd chop, jouster couch, archer longbow [P], da vinci spin).

## Last verdicts (critic header lines verbatim)
- GAP: [S] renaissance.da_vinci_tank (e4c2a2f) VERDICT: APPROVE CRITERION: renaissance.da_vinci_tank.a FAIL (previous: FAIL) BLOCKERS: struck: 1, 2, 3. Remaining: 4.
- GAP: [S] renaissance.da_vinci_tank (da39ed0) VERDICT: APPROVE CRITERION: renaissance.da_vinci_tank.b PASS (previous: FAIL) BLOCKERS: struck: 1.
- GAP: [S] renaissance.painter (413fb65) VERDICT: APPROVE CRITERION: renaissance.painter.b PASS (previous: FAIL) BLOCKERS: struck: 3.
- GAP: [S] renaissance.musketeer (0b9f1b9 + 4992778 + 12c8bc1) VERDICT: APPROVE CRITERION: renaissance.musketeer.c FAIL (previous: FAIL) BLOCKERS: struck: 1 (and b.2: b PASS). Remaining: 2.
- GAP: [S] renaissance.fencer (d2b3a7b) VERDICT: APPROVE CRITERION: renaissance.fencer.c FAIL (previous: FAIL) BLOCKERS: struck: 2, 3. Remaining: 4.
- REGRESSIONS: none. d PASS 7/7 (stats 331).

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
- Open picks: painter c splotches, musketeer c bullet fling, fencer c lunge legs (probe what overrides _animateLunge's legs first), a-criterion hair/dress gaps; balloon_archer c balloon float, halberd a, jouster c/a still untaken. Fallout [P]s: da vinci roof scale, painter PALETTE_OUT side, halberd CHOP, jouster HEATER.
- A ranged shot fires at the very start of its attack (often from the march): a pose for the release frame must already be up before the attack (see _aimMusket).
- Props turned in the fist: stand them in the world (Matrix.FromXYZAxesToRef, local = world * handRot^T) as _poseHalberd/_pointRapier/_aimMusket do; _armTo solves either arm onto a world point.
- 1v1 melee shots: the squire often hits back on the release frame (flinch); a committed pose needs _aimWeight and to sit after the shove layer.
- After any --iter capture rerun stats --batch <batch> --iter N. capture needs a clean tree (move probe scripts out first). Bash heredocs with apostrophes broke once: write memory files with Write.
