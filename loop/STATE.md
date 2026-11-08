# Loop state (v4: two batch audits merged; up to 9 structural/rebuild gaps + 1 eligible polish; fresh CONFIRM before done)
Iteration: 490   Batch: good+evil   Consecutive empty: 0   Done: 90/139   Parked: 0
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
legacy_2: pharaoh ++++ D | wizard ++++ D | chariot ++++ D | thor ++++ D | tank ++++ D | super_boxer ++++ D | dark_peasant ++++ D | super_peasant ++++ D
good: devout_gauntlet ++++ D | celestial_aegis ++++ D | radiant_glaive ++++ D | righteous_paladin -+++ o | divine_arbiter -+++ o | sacred_elephant -+++ o | chronomancer ++++ D
evil: shadow_walker ---+ o | exiled_sentinel -+-+ o | mad_mechanic ---+ o | void_cultist ---+ o | tempest_lich ---+ o | death_bringer ---+ o | void_monarch ---+ o
secret_1: ballooner ???? q | bomb_on_a_stick ???? q | fan_bearer ???? q | raptor ???? q | the_teacher ???? q | jester ???? q | ball_n_chain ???? q | chu_ko_nu ???? q | executioner ???? q | shouter ???? q
secret_2: taekwondo ???? q | raptor_rider ???? q | cheerleader ???? q | cupid ???? q | mace_spinner ???? q | clams ???? q | present_elf ???? q | ice_mage ???? q | infernal_whip ???? q | bank_robbers ???? q
secret_3: witch ???? q | banshee ???? q | necromancer ???? q | solar_architect ???? q | wheelbarrow_dragon ???? q | skeleton_giant ???? q | bomb_cannon ???? q | cavalry ???? q | vlad ???? q | gatling_gun ???? q
secret_4: blackbeard ???? q | samurai_giant ???? q | ullr ???? q | lady_red_jade ???? q | sensei ???? q | shogun ???? q | tree_giant ???? q | artemis ???? q | ice_giant ???? q

## Focus (iteration 490; BASE 05db8298)
1. [R] good.divine_arbiter.a blockers 1-3 (c223381e) APPROVE, struck 1, 2; blocker 3 (sleeves) stands.
2. [S] good.chronomancer.a blocker 1 (4f41d5e6) APPROVE, struck 1; a PASS; CONFIRM passed a-d: D.
3. [S] good.sacred_elephant.a blocker 6 (38f71664) APPROVE, struck 6.
4. [S] good.sacred_elephant.a blocker 3 (52fdcb61) APPROVE, struck 3.
5. [S] evil.shadow_walker.b blocker 1 (df94c995) APPROVE, no strike.
6. [S] evil.exiled_sentinel.b blocker 1 (cc597223) APPROVE, struck 1; b PASS.
7. [S] evil.void_cultist.b blocker 1 (a9a68a3e) APPROVE, struck 1.
- 7/7, 6 struck

## Last verdicts (critic header lines verbatim)
- GAP: [R] good.divine_arbiter (c223381e) | VERDICT: APPROVE | CRITERION: good.divine_arbiter.a FAIL   (previous: FAIL)
- GAP: [S] good.chronomancer (4f41d5e6) | VERDICT: APPROVE | CRITERION: good.chronomancer.a PASS   (previous: FAIL)
- GAP: [S] good.sacred_elephant (38f71664) | VERDICT: APPROVE | CRITERION: good.sacred_elephant.a FAIL   (previous: FAIL)
- GAP: [S] good.sacred_elephant (52fdcb61) | VERDICT: APPROVE | CRITERION: good.sacred_elephant.a FAIL   (previous: FAIL)
- GAP: [S] evil.shadow_walker (df94c995) | VERDICT: APPROVE | CRITERION: evil.shadow_walker.b FAIL   (previous: FAIL)
- GAP: [S] evil.exiled_sentinel (cc597223) | VERDICT: APPROVE | CRITERION: evil.exiled_sentinel.b PASS   (previous: FAIL)
- GAP: [S] evil.void_cultist (a9a68a3e) | VERDICT: APPROVE | CRITERION: evil.void_cultist.b FAIL   (previous: FAIL)
- REGRESSIONS: none
- CONFIRM: UNIT good.chronomancer: a PASS b PASS c PASS d PASS (4/4) | good.divine_arbiter: a FAIL b PASS c PASS d PASS (3/4) (run early; not applied, unit not would-be-done)

## Notes for next iteration (max 5 lines)
- 7/7 approved, 6 struck; Done 90/139 (Chronomancer D). Arbiter [R] left only a.3 sleeves: balloon in upperArm.parent frame did not show; parent to the bone, probe bbox first.
- Elephant a has only blocker 5 (scale) left: critic ranked a [P] rig-scale fallout; a scale change re-frames shots (re-audit risk).
- Paladin a.1 shorts gap has 2 attempts (not pickable); shorts hide behind the centred idle shield: an evidence commit (re-aimed shot) or a new gap is the way on.
- Walker b.1 dagger: 2 approved [S] on it, still needle-thin (critic: one wrist-wide crescent slab). Sentinel sword is hidden in the fist for the c axe swap.
- Type-check, 46 shots, stats 6/6 PASS; no browser errors. LESSONS at cap (9992/10000): merge before adding.
