# Loop state (v8: two auditors per batch, lists merged; up to 9 gaps; a unit with 3 or fewer blockers picked first; a c look shows the target; v7: a look list holds 6 blockers with the build first, the tail overlaps below 7 picks, a plateau [R] goes next, CONFIRM runs beside the critic; v6: one batch at a time, up to 7 structural gaps per iteration, a CONFIRM critic before D and two CONFIRM fails make a plateau, a criterion a CONFIRM passed stays passed, the critic sees the diff and never the worker's words, the capture frames a unit by its mesh top)
Iteration: 480   Batch: legacy_2   Consecutive empty: 0   Done: 81/139   Parked: 0
Batches, in order: tribal, renaissance, farmer, medieval, farmer:re, ancient, viking, dynasty, pirate, spooky, wild_west, legacy_1, legacy_2, good, evil, secret_1, secret_2, secret_3, secret_4

## Scoreboard (a b c d as + pass, - fail, ? unscored; status q queued, o open, D done, p parked)
tribal: clubber ++++ D | protector ++++ D | spear_thrower ++++ D | stoner ++++ D | bone_mage ++++ D | chieftain ++++ D | mammoth ++++ D
renaissance: painter ++++ D | fencer ++++ D | balloon_archer ++++ D | musketeer ++++ D | halberd ++++ D | jouster ++++ D | da_vinci_tank ++++ D
farmer: halfling ++++ D | farmer ++++ D | hay_baler ++++ D | potion_seller ++++ D | harvester ++++ D | wheelbarrow ++++ D | scarecrow ++++ D
medieval: bard ++++ D | squire ++++ D | archer ++++ D | healer ++++ D | knight ++++ D | catapult ++++ D | king ++++ D
ancient: shield_bearer ++++ D | sarissa ++++ D | hoplite ++++ D | snake_archer ++++ D | ballista ++++ D | minotaur ++++ D | zeus ++++ D
viking: headbutter ++++ D | ice_archer ++++ D | brawler ++++ D | berserker ++++ D | valkyrie ++++ D | longship ++++ D | jarl ++++ D
dynasty: samurai ++++ D | firework_archer ++++ D | monk ++++ D | ninja ++++ D | dragon ++++ D | hwacha ++++ D | monkey_king ++++ D
pirate: flintlock ++++ D | blunderbuss ++++ D | bomb_thrower ++++ D | harpooner ++++ D | cannon ++++ D | captain ++++ D | pirate_queen ++++ D
spooky: skeleton_warrior ++++ D | skeleton_archer ++++ D | candlehead ++++ D | vampire ++++ D | pumpkin_catapult ++++ D | swordcaster ++++ D | reaper ++++ D
wild_west: dynamite_thrower ++++ D | miner ++++ D | cactus ++++ D | gunslinger ++++ D | lasso ++++ D | deadeye ++++ D | quick_draw ++++ D
legacy_1: peasant ++++ D | banner_bearer ++++ D | poacher ++++ D | blowdarter ++++ D | pike ++++ D | barrel_roller ++++ D | boxer ++++ D | flag_bearer ++++ D
legacy_2: pharaoh -+++ o | wizard -+++ o | chariot ++++ D | thor ++++ D | tank ++++ D | super_boxer -+++ o | dark_peasant ++-+ o | super_peasant -+-+ o
good: devout_gauntlet ???? q | celestial_aegis ???? q | radiant_glaive ???? q | righteous_paladin ???? q | divine_arbiter ???? q | sacred_elephant ???? q | chronomancer ???? q
evil: shadow_walker ???? q | exiled_sentinel ???? q | mad_mechanic ???? q | void_cultist ???? q | tempest_lich ???? q | death_bringer ???? q | void_monarch ???? q
secret_1: ballooner ???? q | bomb_on_a_stick ???? q | fan_bearer ???? q | raptor ???? q | the_teacher ???? q | jester ???? q | ball_n_chain ???? q | chu_ko_nu ???? q | executioner ???? q | shouter ???? q
secret_2: taekwondo ???? q | raptor_rider ???? q | cheerleader ???? q | cupid ???? q | mace_spinner ???? q | clams ???? q | present_elf ???? q | ice_mage ???? q | infernal_whip ???? q | bank_robbers ???? q
secret_3: witch ???? q | banshee ???? q | necromancer ???? q | solar_architect ???? q | wheelbarrow_dragon ???? q | skeleton_giant ???? q | bomb_cannon ???? q | cavalry ???? q | vlad ???? q | gatling_gun ???? q
secret_4: blackbeard ???? q | samurai_giant ???? q | ullr ???? q | lady_red_jade ???? q | sensei ???? q | shogun ???? q | tree_giant ???? q | artemis ???? q | ice_giant ???? q

## Focus (iteration 480; BASE f97c47a0)
Nine picks, eight kept; evidence f97c47a0,66973e9e,c32f6740 outside the nine.
1. [R] legacy.thor.a blocker 2: pelvis-bound studded belt (c444ddc5) APPROVE, struck 2; CONFIRM passed; D.
2. [S] legacy.tank.a blocker 1: seated infantry riders (1b06021b) APPROVE, struck 1; CONFIRM passed; D.
3. [S] legacy.wizard.a blocker 1: lanky body/open coat (dc1ce591,d824f304) APPROVE, struck 1; beard 2 stands.
4. [S] legacy.wizard.b blocker 1: planted tall staff (c8592c0a) APPROVE, struck 1; b PASS.
5. [S] legacy.wizard.c blocker 1: radial detonation (88770cd1) APPROVE, struck 1; c PASS.
6. [S] legacy.super_boxer.c blocker 2: glove trails (db753c81) APPROVE, struck 2; c PASS. CONFIRM failed a: boots.
7. [S] legacy.dark_peasant.a blocker 5: lower dress (09453b8f,3656bb73) APPROVE, struck 5; a PASS; Custom gated off.
8. [S] legacy.super_peasant.a blocker 2: outer tunic (a70e65b3,b2acc355,4a6cb2c2) APPROVE, none struck.
9. [S] legacy.super_peasant.c blocker 1: ballistic launch (2861b99c) dropped/reverted 93e1b1e9: victim not visible.
- 8/9, 7 struck

## Last verdicts (critic header lines verbatim)
- GAP: [R] legacy.thor (c444ddc5)
- VERDICT: APPROVE
- CRITERION: legacy.thor.a PASS (previous: FAIL)
- GAP: [S] legacy.tank (1b06021b)
- VERDICT: APPROVE
- CRITERION: legacy.tank.a PASS (previous: FAIL)
- GAP: [S] legacy.wizard (dc1ce591,d824f304)
- VERDICT: APPROVE
- CRITERION: legacy.wizard.a FAIL (previous: FAIL)
- GAP: [S] legacy.wizard (c8592c0a)
- VERDICT: APPROVE
- CRITERION: legacy.wizard.b PASS (previous: FAIL)
- GAP: [S] legacy.wizard (88770cd1)
- VERDICT: APPROVE
- CRITERION: legacy.wizard.c PASS (previous: FAIL)
- GAP: [S] legacy.super_boxer (db753c81)
- VERDICT: APPROVE
- CRITERION: legacy.super_boxer.c PASS (previous: FAIL)
- GAP: [S] legacy.dark_peasant (09453b8f,3656bb73)
- VERDICT: APPROVE
- CRITERION: legacy.dark_peasant.a PASS (previous: FAIL)
- GAP: [S] legacy.super_peasant (a70e65b3,b2acc355,4a6cb2c2)
- VERDICT: APPROVE
- CRITERION: legacy.super_peasant.a FAIL (previous: FAIL)
- REGRESSIONS: none attributed to the eight reviewed gaps. All supplied stats results remain d PASS (8/8).
- UNIT legacy.thor: a PASS b PASS c PASS d PASS (4/4)
- UNIT legacy.tank: a PASS b PASS c PASS d PASS (4/4)
- UNIT legacy.super_boxer: a FAIL b PASS c PASS d PASS (3/4)

## Notes for next iteration (max 5 lines)
- Thor and Tank confirmed D; 81/139 done. Pharaoh a plateau (478) takes next [R]: sandal rebuild; keep confirmed b/c.
- Next step 2 RE-AUDIT: Wizard a/b/c after tall-staff reframing (rig1.8->2.9m), Super Peasant c after post-impact scene/camera evidence; other verdicts retain.
- Super Boxer first CONFIRM failed a on tall wrapped boxing boots; b/c confirmed. Dark Peasant only lacks victim hand grab-blast; select/frame that event before c work (release/flight empty).
- Super Peasant a APPROVE, both blockers stand; not plateau (479 struck 3). Critic proposes whole dress rebuild. c launch dropped: corpse not readable; preserve white chest gain. Fewer than9 pickable [S] may require good tail audit at step3.
- Type-check/build, captures, stats8/8 and budget passed; no regressions/errors; checkpoint not due. Bare git push follows docs commit.
