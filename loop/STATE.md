# Loop state (v4: two batch audits merged; up to 9 structural/rebuild gaps + 1 eligible polish; fresh CONFIRM before done)
Iteration: 536   Batch: secret_3   Consecutive empty: 0   Done: 125/139   Parked: 0
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
evil: shadow_walker ++++ D | exiled_sentinel ++++ D | mad_mechanic ++++ D | void_cultist ++++ D | tempest_lich ++++ D | death_bringer ++++ D | void_monarch ++++ D
secret_1: ballooner ++++ D | bomb_on_a_stick ++++ D | fan_bearer ++++ D | raptor ++++ D | the_teacher ++++ D | jester ++++ D | ball_n_chain ++++ D | chu_ko_nu ++++ D | executioner ++++ D | shouter ++++ D
secret_2: taekwondo ++++ D | raptor_rider ++++ D | cheerleader ++++ D | cupid ++++ D | mace_spinner ++++ D | clams ++++ D | present_elf ++++ D | ice_mage ++++ D | infernal_whip ++++ D | bank_robbers ++++ D
secret_3: witch -+-+ o | banshee -+++ o | necromancer -+-+ o | solar_architect ++++ D | wheelbarrow_dragon ++++ D | skeleton_giant -+++ o | bomb_cannon ++++ D | cavalry ++++ D | vlad -+++ o | gatling_gun ++++ D
secret_4: blackbeard ???? q | samurai_giant ???? q | ullr ???? q | lady_red_jade ???? q | sensei ???? q | shogun ???? q | tree_giant ???? q | artemis ???? q | ice_giant ???? q
## Focus (iteration 536; BASE a360bd1e; secret_3)
1. [S] secret.witch.a blocker 5 broom (ee3c7d9d, 58bc88c9) APPROVED, no strike
2. [S] secret.witch.a blocker 4 robe (23df7426, 45c25948) APPROVED, struck 4
3. [S] secret.witch.c blocker 3 toadstools + turn (7be05a62, 108b1557, 8af4aaa4) APPROVED, no strike (turn unseen)
4. [S] secret.skeleton_giant.a blocker 2 hood helm (45fe5c86) APPROVED, struck 2
5. [S] secret.skeleton_giant.a blocker 3 bone feet (0b9fd1f1) APPROVED, no strike
6. [S] secret.solar_architect.c blocker 2 maelstrom (cdf5df13, edb6026a) APPROVED, struck 2, c PASS
7. [S] secret.solar_architect.a blocker 3 coat (42776ebb) APPROVED, struck 3
8. [S] secret.solar_architect.a blocker 4 legs (07b399aa) APPROVED, struck 4, a PASS (CONFIRM passed, D)
9. [S] secret.necromancer.a blocker 2 horned cap (6cc2555a) APPROVED, struck 2 (starving pick)
- 9/9, 6 struck

## Last verdicts (critic header lines verbatim)
- GAP: [S] secret.witch (ee3c7d9d, 58bc88c9) / VERDICT: APPROVE / CRITERION: secret.witch.a FAIL   (previous: FAIL)
- GAP: [S] secret.witch (23df7426, 45c25948) / VERDICT: APPROVE / CRITERION: secret.witch.a FAIL   (previous: FAIL)
- GAP: [S] secret.witch (7be05a62, 108b1557, 8af4aaa4) / VERDICT: APPROVE / CRITERION: secret.witch.c FAIL   (previous: FAIL)
- GAP: [S] secret.skeleton_giant (45fe5c86) / VERDICT: APPROVE / CRITERION: secret.skeleton_giant.a FAIL   (previous: FAIL)
- GAP: [S] secret.skeleton_giant (0b9fd1f1) / VERDICT: APPROVE / CRITERION: secret.skeleton_giant.a FAIL   (previous: FAIL)
- GAP: [S] secret.solar_architect (cdf5df13, edb6026a) / VERDICT: APPROVE / CRITERION: secret.solar_architect.c PASS   (previous: FAIL)
- GAP: [S] secret.solar_architect (42776ebb) / VERDICT: APPROVE / CRITERION: secret.solar_architect.a FAIL   (previous: FAIL)
- GAP: [S] secret.solar_architect (07b399aa) / VERDICT: APPROVE / CRITERION: secret.solar_architect.a PASS   (previous: FAIL)
- GAP: [S] secret.necromancer (6cc2555a) / VERDICT: APPROVE / CRITERION: secret.necromancer.a FAIL   (previous: FAIL)
- REGRESSIONS: none
- CONFIRM secret.witch: a PASS b PASS c PASS d PASS (4/4); secret.skeleton_giant: 4/4; secret.solar_architect: 4/4 (witch, giant held open by the gap critic's FAILs)

## Notes for next iteration (max 5 lines)
- solar_architect D at 536. Open: witch (a.5 broom, c.3), banshee (a), necromancer (a, c), skeleton_giant (a.3 feet), vlad (a).
- Witch c.3 needs an evidence commit first: capture.mjs witch scene with a friend of the struck man within ~2 m so "turncoat" logs and shows. Witch [P] WITCH_BROOM pitch ~.9, lift ~.3 is eligible fallout.
- Starve: vlad.a last 533 (starves 539); banshee.a last 534 (539); necromancer.c last 535.
- Witch and giant had a CONFIRM pass at 536 on all four: once the gap critic passes their last blockers they are done.
- Next batch secret_4 unaudited: tail overlap applies once secret_3 has under 9 pickable [S] or 3 or fewer open units.
