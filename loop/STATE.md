# Loop state (v2: one batch at a time, up to 5 structural gaps per iteration)
Iteration: 330   Batch: renaissance (2/18)   Consecutive empty: 0   Done: 7/139   Parked: 0
Batches, in order: tribal, renaissance, farmer, medieval, ancient, viking, dynasty, pirate, spooky, wild_west, legacy_1, legacy_2, good, evil, secret_1, secret_2, secret_3, secret_4

## Scoreboard (a b c d as + pass, - fail, ? unscored; status q queued, o open, D done, p parked)
tribal: clubber ++++ D | protector ++++ D | spear_thrower ++++ D | stoner ++++ D | bone_mage ++++ D | chieftain ++++ D | mammoth ++++ D
renaissance: painter ---+ o | fencer -+-+ o | balloon_archer -+-+ o | musketeer ---+ o | halberd -+-+ o | jouster ---+ o | da_vinci_tank --++ o
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
330 (BASE 0ef9201): [S] fencer c lunge 841edec + f287302 + fa4c27d approved | [S] halberd c vertical chop 04be0ae approved | [S] jouster c couched lance fa74b0b approved | [S] fencer b cup hilt d255f45 approved | [P] balloon_archer b longbow length d3cb713 approved | [S] da_vinci_tank c spinning drum 7b89341 approved. 6/6, no regressions.
329 (BASE 9e3e957): 5/6 approved (halberd grip, musketeer two-handed carry, jouster heater, archer longbow, da vinci cannonball; painter palette [P] rejected).

## Last verdicts (critic header lines verbatim)
- GAP: [S] renaissance.fencer c lunge (841edec + f287302 + fa4c27d) VERDICT: APPROVE CRITERION: renaissance.fencer.c FAIL (previous: FAIL) BLOCKERS: struck: 1. added: 2, 3, 4.
- GAP: [S] renaissance.halberd c vertical chop (04be0ae) VERDICT: APPROVE CRITERION: renaissance.halberd.c FAIL (previous: FAIL) BLOCKERS: struck: 1 (and b.2: b PASS). added: 2, 3.
- GAP: [S] renaissance.jouster c couched lance (fa74b0b) VERDICT: APPROVE CRITERION: renaissance.jouster.c FAIL (previous: FAIL) BLOCKERS: struck: 1. added: 2.
- GAP: [S] renaissance.fencer b cup hilt (d255f45) VERDICT: APPROVE CRITERION: renaissance.fencer.b PASS (previous: FAIL) BLOCKERS: struck: 1.
- GAP: [P] renaissance.balloon_archer b longbow length (d3cb713) VERDICT: APPROVE CRITERION: renaissance.balloon_archer.b PASS (previous: FAIL) BLOCKERS: struck: 2.
- GAP: [S] renaissance.da_vinci_tank c spin while firing (7b89341) VERDICT: APPROVE CRITERION: renaissance.da_vinci_tank.c PASS (previous: FAIL) BLOCKERS: struck: 2.
- REGRESSIONS: none. d PASS 7/7 (stats 330).

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
- No pick in 330 for painter (palette out [S]: probe why the swing keeps it before the chest first) or musketeer (shouldered aim, hip carry). Fallout [P]s open: halberd CHOP landed/hold, jouster HEATER size, musketeer MUSKET long/bore.
- LEDGER at ~13.8/14 KB: trim earlier-values notes before adding rows; Structural attempts keep the last 10 iterations.
- Props turned in the fist: stand them in the world (axis + a hint, Matrix.FromXYZAxesToRef, local = world * handRot^T) as _poseHalberd/_couchLance do; the hand +y runs up the forearm.
- 1v1 melee shots: the squire often hits back on the release frame (flinch); a committed pose needs _aimWeight (as _lungeOut) and to sit after the shove layer (_aimBlow).
- After any --iter capture rerun stats --batch <batch> --iter N. capture.mjs --units takes a comma list. Never put a bare cat > file in a command.
