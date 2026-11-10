# Loop state (v4: two batch audits merged; up to 9 structural/rebuild gaps + 1 eligible polish; fresh CONFIRM before done)
Iteration: 505   Batch: evil+secret_1   Consecutive empty: 0   Done: 99/139   Parked: 0
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
evil: shadow_walker ++++ D | exiled_sentinel ++++ D | mad_mechanic ++++ D | void_cultist ++++ D | tempest_lich ++++ D | death_bringer -+++ o | void_monarch ++++ D
secret_1: ballooner -+-+ o | bomb_on_a_stick --++ o | fan_bearer --++ o | raptor ---+ o | the_teacher -+++ o | jester ---+ o | ball_n_chain -+-+ o | chu_ko_nu -+++ o | executioner -+++ o | shouter -+++ o
secret_2: taekwondo ???? q | raptor_rider ???? q | cheerleader ???? q | cupid ???? q | mace_spinner ???? q | clams ???? q | present_elf ???? q | ice_mage ???? q | infernal_whip ???? q | bank_robbers ???? q
secret_3: witch ???? q | banshee ???? q | necromancer ???? q | solar_architect ???? q | wheelbarrow_dragon ???? q | skeleton_giant ???? q | bomb_cannon ???? q | cavalry ???? q | vlad ???? q | gatling_gun ???? q
secret_4: blackbeard ???? q | samurai_giant ???? q | ullr ???? q | lady_red_jade ???? q | sensei ???? q | shogun ???? q | tree_giant ???? q | artemis ???? q | ice_giant ???? q

## Focus (iteration 505; BASE 73b068c5)
1. [R] evil.death_bringer.a blocker 1 (37724d45) APPROVE, struck 1; a PASS
2. [S] secret.executioner.a blocker 2 (81a7d921) APPROVE, struck 2
3. [S] secret.ball_n_chain.a blocker 1 (f8f54345) APPROVE, struck 1, 2, 5
4. [S] secret.shouter.a blocker 5 (1ff4ba0b) APPROVE, struck 5
5. [S] secret.bomb_on_a_stick.a blocker 1 (c4965761) APPROVE, struck 1
6. [S] secret.the_teacher.c blocker 1 (140582e4, 67439484) APPROVE, struck 1; c PASS
7. [S] secret.raptor.a blocker 1 (18710e8b) APPROVE, struck 1, 2, 3
8. [S] secret.raptor.b blocker 1 (53a75e63) APPROVE, struck 1
9. [S] secret.raptor.c blocker 1 (be96b2b5, d7165ae8) APPROVE
- 9/9, 12 struck

## Last verdicts (critic header lines verbatim)
- GAP: [R] evil.death_bringer (37724d45) | VERDICT: APPROVE | CRITERION: evil.death_bringer.a PASS   (previous: FAIL)
- GAP: [S] secret.executioner (81a7d921) | VERDICT: APPROVE | CRITERION: secret.executioner.a FAIL   (previous: FAIL)
- GAP: [S] secret.ball_n_chain (f8f54345) | VERDICT: APPROVE | CRITERION: secret.ball_n_chain.a FAIL   (previous: FAIL)
- GAP: [S] secret.shouter (1ff4ba0b) | VERDICT: APPROVE | CRITERION: secret.shouter.a FAIL   (previous: FAIL)
- GAP: [S] secret.bomb_on_a_stick (c4965761) | VERDICT: APPROVE | CRITERION: secret.bomb_on_a_stick.a FAIL   (previous: FAIL)
- GAP: [S] secret.the_teacher (140582e4 + 67439484) | VERDICT: APPROVE | CRITERION: secret.the_teacher.c PASS   (previous: FAIL)
- GAP: [S] secret.raptor (18710e8b) | VERDICT: APPROVE | CRITERION: secret.raptor.a FAIL   (previous: FAIL)
- GAP: [S] secret.raptor (53a75e63) | VERDICT: APPROVE | CRITERION: secret.raptor.b FAIL   (previous: FAIL)
- GAP: [S] secret.raptor (be96b2b5 + d7165ae8) | VERDICT: APPROVE | CRITERION: secret.raptor.c FAIL   (previous: FAIL)
- UNIT evil.death_bringer: a FAIL b PASS c PASS d PASS (3/4) (CONFIRM)
- REGRESSIONS: none

## Notes for next iteration (max 5 lines)
- Death Bringer's compact skull passed gap review. CONFIRM leaves a open on the taller upright horns and rigid front feather fall. Rebuild those from the lineup and studio render; Evil checkpoint waits.
- Raptor now has a standalone biped body and visible teeth. Its jaw snap is logged, but the squire remains outside the jaws in the contact frame.
- Stats d PASS on all seven touched units. Final captures had no console or page errors.
