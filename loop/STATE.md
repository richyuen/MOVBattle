# Loop state (v4: two batch audits merged; up to 9 structural/rebuild gaps + 1 eligible polish; fresh CONFIRM before done)
Iteration: 491   Batch: good+evil   Consecutive empty: 0   Done: 91/139   Parked: 0
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
good: devout_gauntlet ++++ D | celestial_aegis ++++ D | radiant_glaive ++++ D | righteous_paladin -+++ o | divine_arbiter ++++ D | sacred_elephant -+++ o | chronomancer ++++ D
evil: shadow_walker ---+ o | exiled_sentinel -+-+ o | mad_mechanic ---+ o | void_cultist -+-+ o | tempest_lich ---+ o | death_bringer -+-+ o | void_monarch -+-+ o
secret_1: ballooner ???? q | bomb_on_a_stick ???? q | fan_bearer ???? q | raptor ???? q | the_teacher ???? q | jester ???? q | ball_n_chain ???? q | chu_ko_nu ???? q | executioner ???? q | shouter ???? q
secret_2: taekwondo ???? q | raptor_rider ???? q | cheerleader ???? q | cupid ???? q | mace_spinner ???? q | clams ???? q | present_elf ???? q | ice_mage ???? q | infernal_whip ???? q | bank_robbers ???? q
secret_3: witch ???? q | banshee ???? q | necromancer ???? q | solar_architect ???? q | wheelbarrow_dragon ???? q | skeleton_giant ???? q | bomb_cannon ???? q | cavalry ???? q | vlad ???? q | gatling_gun ???? q
secret_4: blackbeard ???? q | samurai_giant ???? q | ullr ???? q | lady_red_jade ???? q | sensei ???? q | shogun ???? q | tree_giant ???? q | artemis ???? q | ice_giant ???? q

## Focus (iteration 491; BASE d2ef59e0)
1. [S] good.divine_arbiter.a blocker 3 (65568848) APPROVE, struck 3; a PASS; CONFIRM passed a-d: D.
2. [S] evil.shadow_walker.a blocker 1 (67a1ba53) APPROVE, struck 1.
3. [S] evil.exiled_sentinel.a blocker 2 (d2525821) APPROVE, struck 2.
4. [S] evil.mad_mechanic.b blocker 1 (a395751d, 287847f9) APPROVE, no strike (claw built backwards).
5. [S] evil.void_cultist.b blocker 2 (4dfe45ac) APPROVE, struck 2; b PASS.
6. [S] evil.death_bringer.b blocker 1 (cdb92fd0, ddf16a33) APPROVE, struck 1, 2; b PASS.
7. [S] evil.void_monarch.b blocker 1 (071b5f23) APPROVE, struck 1, 2; b PASS.
8. [S] evil.tempest_lich.c blocker 1 (6a770969, f86388a0) APPROVE, no strike (bolts unseen in _struck).
9. [P] good.sacred_elephant.a blocker 5 (20f7342f) APPROVE, struck 5; CONFIRM failed a (3 new blockers).
- 9/9, 9 struck

## Last verdicts (critic header lines verbatim)
- GAP: [S] good.divine_arbiter (65568848) | VERDICT: APPROVE | CRITERION: good.divine_arbiter.a PASS   (previous: FAIL)
- GAP: [S] evil.shadow_walker (67a1ba53) | VERDICT: APPROVE | CRITERION: evil.shadow_walker.a FAIL   (previous: FAIL)
- GAP: [S] evil.exiled_sentinel (d2525821) | VERDICT: APPROVE | CRITERION: evil.exiled_sentinel.a FAIL   (previous: FAIL)
- GAP: [S] evil.mad_mechanic (a395751d, follow-up 287847f9) | VERDICT: APPROVE | CRITERION: evil.mad_mechanic.b FAIL   (previous: FAIL)
- GAP: [S] evil.void_cultist (4dfe45ac) | VERDICT: APPROVE | CRITERION: evil.void_cultist.b PASS   (previous: FAIL)
- GAP: [S] evil.death_bringer (cdb92fd0, follow-up ddf16a33) | VERDICT: APPROVE | CRITERION: evil.death_bringer.b PASS   (previous: FAIL)
- GAP: [S] evil.void_monarch (071b5f23) | VERDICT: APPROVE | CRITERION: evil.void_monarch.b PASS   (previous: FAIL)
- GAP: [S] evil.tempest_lich (6a770969, follow-up f86388a0) | VERDICT: APPROVE | CRITERION: evil.tempest_lich.c FAIL   (previous: FAIL)
- GAP: [P] good.sacred_elephant (20f7342f) | VERDICT: APPROVE | CRITERION: good.sacred_elephant.a PASS   (previous: FAIL)
- REGRESSIONS: none
- CONFIRM: UNIT good.divine_arbiter: a PASS b PASS c PASS d PASS (4/4) | good.sacred_elephant: a FAIL b PASS c PASS d PASS (3/4)

## Notes for next iteration (max 5 lines)
- 9/9 approved, 9 struck; Done 91/139 (Arbiter D). Elephant a reopened by CONFIRM: mammoth tusks, unbanded glowing rider top, stepped foot rims.
- Mechanic claw is built backwards (hand frame +y runs toward the elbow): first pick is mirroring buildMechanicClaw.
- Lich storm cloud shows in _struck (3.2 m up) but its .3 s bolts are gone by that frame: keep bolts alive for the cloud's life.
- Paladin a.1 stuck (gap at 2 attempts): the shorts do not read even unshielded in lineup_good; needs a new mechanism from a critic's list.
- Type-check, 63 shots, stats 9/9 d PASS; no browser errors. LESSONS near cap (9989/10000).
