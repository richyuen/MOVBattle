# Loop state (v4: two batch audits merged; up to 9 structural/rebuild gaps + 1 eligible polish; fresh CONFIRM before done)
Iteration: 549   Batch: secret_4   Consecutive empty: 0   Done: 132/139   Parked: 0
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
secret_3: witch ++++ D | banshee ++++ D | necromancer ++++ D | solar_architect ++++ D | wheelbarrow_dragon ++++ D | skeleton_giant ++++ D | bomb_cannon ++++ D | cavalry ++++ D | vlad ++++ D | gatling_gun ++++ D
secret_4: blackbeard ++++ D | samurai_giant -+++ o | ullr -+++ o | lady_red_jade -+++ o | sensei ++++ D | shogun -+++ o | tree_giant -+-+ o | artemis -+++ o | ice_giant -+++ o

## Focus (iteration 549; BASE a06ba554; secret_4)
- Evidence (9a8bfa4d): Shogun dash_mid and dash_slash on one camera held from the dash.
1. [S] secret.lady_red_jade.c wide and full-circle guandao sweep (56a42adb, 17d5c28b) APPROVE, struck 3, c PASS
2. [S] secret.ice_giant.c overhead long-arm slam (94a04464) APPROVE, struck 3, c PASS
3. [S] secret.artemis.b drawing fist solved onto the nock (57b5c54c) APPROVE, struck 1, b PASS
4. [S] secret.artemis.c charged shaft seated at the nock (a4d86a7a) APPROVE, struck 1, c PASS
5. [S] secret.shogun.c lunge dash that lands its slash (72c599b5, 0329688a) APPROVE, struck 2, c PASS
6. [S] secret.shogun.b cream tsuka, diamond cord, gold kashira (886fabbc) APPROVE, struck 3, b PASS
7. [S] secret.tree_giant.a strapped sandals (b04ab33e) REJECT, reverted 5837b4d6
8. [S] secret.samurai_giant.a vambraces (5ce1d544, 2482989c) dropped: not visible in the idle, reverted 3d645e19, 308cb4b0
9. [S] secret.ullr.a broad olive beard and moustache (5110dfdf) APPROVE, struck 2
- 7/9, 13 struck

## Last verdicts (critic header lines verbatim)
- GAP: [S] secret.lady_red_jade (56a42adb, 17d5c28b) / VERDICT: APPROVE / CRITERION: secret.lady_red_jade.c PASS   (previous: FAIL)
- GAP: [S] secret.ice_giant (94a04464) / VERDICT: APPROVE / CRITERION: secret.ice_giant.c PASS   (previous: FAIL)
- GAP: [S] secret.artemis (57b5c54c) / VERDICT: APPROVE / CRITERION: secret.artemis.b PASS   (previous: FAIL)
- GAP: [S] secret.artemis (a4d86a7a) / VERDICT: APPROVE / CRITERION: secret.artemis.c PASS   (previous: FAIL)
- GAP: [S] secret.shogun (72c599b5, 0329688a) / VERDICT: APPROVE / CRITERION: secret.shogun.c PASS   (previous: FAIL)
- GAP: [S] secret.shogun (886fabbc) / VERDICT: APPROVE / CRITERION: secret.shogun.b PASS   (previous: FAIL)
- GAP: [S] secret.tree_giant (b04ab33e) / VERDICT: REJECT / CRITERION: secret.tree_giant.a FAIL   (previous: FAIL)
- GAP: [S] secret.ullr (5110dfdf) / VERDICT: APPROVE / CRITERION: secret.ullr.a FAIL   (previous: FAIL)
- REGRESSIONS: none

## Notes for next iteration (max 5 lines)
- Every open unit now fails only a (plus tree_giant c). Size/build blockers (jade a.4, ice a.5, tree a.6, samurai a.6) are ranked [S] rig gaps; a unit whose last blocker clears goes to CONFIRM.
- Samurai Giant vambraces: the idle hides the forearms behind the broad blade (probe_bbox 549). Evidence commit or a pose change before another a.2 pick.
- Tree Giant sandals: thin straps over a team foot, no toe block; strapSandals boxes read as a boot (critic 549). Artemis a.2 sandals: same warning.
