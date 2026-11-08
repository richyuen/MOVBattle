# Loop state (v4: two batch audits merged; up to 9 structural/rebuild gaps + 1 eligible polish; fresh CONFIRM before done)
Iteration: 498   Batch: evil   Consecutive empty: 0   Done: 95/139   Parked: 0
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
good: devout_gauntlet ++++ D | celestial_aegis ++++ D | radiant_glaive ++++ D | righteous_paladin ++++ D | divine_arbiter ++++ D | sacred_elephant ++++ D | chronomancer ++++ D
evil: shadow_walker -+++ o | exiled_sentinel ++++ D | mad_mechanic -+++ o | void_cultist ++++ D | tempest_lich -+++ o | death_bringer -+-+ o | void_monarch -+-+ o
secret_1: ballooner ???? q | bomb_on_a_stick ???? q | fan_bearer ???? q | raptor ???? q | the_teacher ???? q | jester ???? q | ball_n_chain ???? q | chu_ko_nu ???? q | executioner ???? q | shouter ???? q
secret_2: taekwondo ???? q | raptor_rider ???? q | cheerleader ???? q | cupid ???? q | mace_spinner ???? q | clams ???? q | present_elf ???? q | ice_mage ???? q | infernal_whip ???? q | bank_robbers ???? q
secret_3: witch ???? q | banshee ???? q | necromancer ???? q | solar_architect ???? q | wheelbarrow_dragon ???? q | skeleton_giant ???? q | bomb_cannon ???? q | cavalry ???? q | vlad ???? q | gatling_gun ???? q
secret_4: blackbeard ???? q | samurai_giant ???? q | ullr ???? q | lady_red_jade ???? q | sensei ???? q | shogun ???? q | tree_giant ???? q | artemis ???? q | ice_giant ???? q

## Focus (iteration 498; BASE 050d38ff; re-audit walker/lich a, b; evidence 67337268: death bringer vs three archers 8 m off, monarch vs five packed knights)
1. [S] evil.shadow_walker.a blocker 4 (eb3df4ba, 37602f6a) APPROVE, struck 4.
2. [S] evil.shadow_walker.a blocker 5 (cb8a83fa) APPROVE, struck 5.
3. [S] evil.mad_mechanic.a blocker 6 (1e5aa045) APPROVE, struck 6; critic a PASS, CONFIRM failed a (3 blockers).
4. [S] evil.tempest_lich.b blocker 4 (63006385) APPROVE, struck 4.
5. [S] evil.tempest_lich.b blocker 5 (594b761d) APPROVE, struck 5; b PASS (CONFIRM passed).
6. [S] evil.tempest_lich.a blocker 4 (b08f6e09) APPROVE, struck 4; critic a PASS, CONFIRM failed a (robe length).
7. [S] evil.void_monarch.c blocker 2 (647a7951) APPROVE, struck the Demon Transformation clause (Dodge stands).
8. [S] evil.death_bringer.c blocker 2 (b42cc679) APPROVE, struck 2.
9. [S] evil.void_monarch.a blocker 5 (3ab07b72) APPROVE, struck 5; added 7 (plates too tall).
10. [P] evil.void_cultist.b blocker 2 (a2a1714c) APPROVE, struck 2; b PASS; CONFIRM passed all: D.
- 10/10, 10 struck

## Last verdicts (critic header lines verbatim)
- GAP: [S] evil.shadow_walker (eb3df4ba, 37602f6a) | VERDICT: APPROVE | CRITERION: evil.shadow_walker.a FAIL   (previous: FAIL)
- GAP: [S] evil.shadow_walker (cb8a83fa) | VERDICT: APPROVE | CRITERION: evil.shadow_walker.a FAIL   (previous: FAIL)
- GAP: [S] evil.mad_mechanic (1e5aa045) | VERDICT: APPROVE | CRITERION: evil.mad_mechanic.a PASS   (previous: FAIL)
- GAP: [S] evil.tempest_lich (63006385) | VERDICT: APPROVE | CRITERION: evil.tempest_lich.b FAIL   (previous: FAIL)
- GAP: [S] evil.tempest_lich (594b761d) | VERDICT: APPROVE | CRITERION: evil.tempest_lich.b PASS   (previous: FAIL)
- GAP: [S] evil.tempest_lich (b08f6e09) | VERDICT: APPROVE | CRITERION: evil.tempest_lich.a PASS   (previous: FAIL)
- GAP: [S] evil.void_monarch (647a7951) | VERDICT: APPROVE | CRITERION: evil.void_monarch.c FAIL   (previous: FAIL)
- GAP: [S] evil.death_bringer (b42cc679) | VERDICT: APPROVE | CRITERION: evil.death_bringer.c FAIL   (previous: FAIL)
- GAP: [S] evil.void_monarch (3ab07b72) | VERDICT: APPROVE | CRITERION: evil.void_monarch.a FAIL   (previous: FAIL)
- GAP: [P] evil.void_cultist (a2a1714c) | VERDICT: APPROVE | CRITERION: evil.void_cultist.b PASS   (previous: FAIL)
- REGRESSIONS: none
- CONFIRM: UNIT evil.mad_mechanic: a FAIL b PASS c PASS d PASS (3/4); UNIT evil.tempest_lich: a FAIL b PASS c PASS d PASS (3/4); UNIT evil.void_cultist: a PASS b PASS c PASS d PASS (4/4)

## Notes for next iteration (max 5 lines)
- Ranked next: death bringer charge (c.3, scene already 8 m from archers), monarch Dodge (c.2: evidence commit first, archers in his scene beside the knights), lich robe to the shins (a.5, keep the hover gap), mechanic build/shirt/hair (a.7-9), death bringer torso and belt (a.4/a.6).
- [P] eligible (fallout of 498 [S]): MONARCH_KNEES tall .62 to .4, wide 2.7 to 2.2 (a.7); MECHANIC_TROUSERS.proud .06 to .02 (critic NEXT, no blocker).
- Walker horn colour (a.7) is colour-only: swatch it with probe_close --noglow; the critic's NEXT asks an [S] material swap at WALKER_HORN.
- Mechanic a and lich a each failed CONFIRM once (498): a second CONFIRM fail makes the criterion plateau.
- Stats 7/7 d PASS (498). Death bringer a last tried 496: starving at 502.
