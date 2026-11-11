# Loop state (v4: two batch audits merged; up to 9 structural/rebuild gaps + 1 eligible polish; fresh CONFIRM before done)
Iteration: 510   Batch: secret_1   Consecutive empty: 0   Done: 100/139   Parked: 0
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
secret_1: ballooner -+-+ o | bomb_on_a_stick -+++ o | fan_bearer --++ o | raptor -+++ o | the_teacher -+++ o | jester ---+ o | ball_n_chain ++-+ o | chu_ko_nu ---+ o | executioner -+++ o | shouter -+++ o
secret_2: taekwondo ???? q | raptor_rider ???? q | cheerleader ???? q | cupid ???? q | mace_spinner ???? q | clams ???? q | present_elf ???? q | ice_mage ???? q | infernal_whip ???? q | bank_robbers ???? q
secret_3: witch ???? q | banshee ???? q | necromancer ???? q | solar_architect ???? q | wheelbarrow_dragon ???? q | skeleton_giant ???? q | bomb_cannon ???? q | cavalry ???? q | vlad ???? q | gatling_gun ???? q
secret_4: blackbeard ???? q | samurai_giant ???? q | ullr ???? q | lady_red_jade ???? q | sensei ???? q | shogun ???? q | tree_giant ???? q | artemis ???? q | ice_giant ???? q

## Focus (iteration 510; BASE 8e6a45f6)
1. [S] secret.raptor.a blocker 4 (b60b1a73) APPROVE, struck 4
2. [S] secret.raptor.b blocker 2 (0313ad73) APPROVE, struck 2
3. [S] secret.raptor.c blocker 1 (3bc37fcc, fbe5fa90) APPROVE, struck 1
4. [S] secret.executioner.a blocker 3 (df0f3fe6) APPROVE, struck 3
5. [S] secret.ball_n_chain.a blocker 3 (a8b184ab) APPROVE, struck 3
6. [S] secret.chu_ko_nu.a blocker 4 (e8df8cbb, f1846fde) APPROVE, struck 4; CONFIRM failed a, b, c
7. [S] secret.shouter.a blocker 1 (3b45f093) APPROVE, struck 1; added 3
8. [S] secret.shouter.a blocker 2 (f008ee0e) APPROVE, struck 2
9. [S] secret.ball_n_chain.a blocker 4 (07986a12, e9179b7c) APPROVE, struck 4
- Evidence: 8e6a45f6 re-aims Chu Ko Nu idle beneath the crossbow.
- 9/9, 9 struck

## Last verdicts (critic header lines verbatim)
- GAP: [S] secret.raptor.a (b60b1a73)
- VERDICT: APPROVE
- CRITERION: secret.raptor.a FAIL (previous: FAIL)
- GAP: [S] secret.raptor.b (0313ad73)
- VERDICT: APPROVE
- CRITERION: secret.raptor.b PASS (previous: FAIL)
- GAP: [S] secret.raptor.c (3bc37fcc, fbe5fa90)
- VERDICT: APPROVE
- CRITERION: secret.raptor.c PASS (previous: FAIL)
- GAP: [S] secret.executioner.a (df0f3fe6)
- VERDICT: APPROVE
- CRITERION: secret.executioner.a FAIL (previous: FAIL)
- GAP: [S] secret.ball_n_chain.a (a8b184ab)
- VERDICT: APPROVE
- CRITERION: secret.ball_n_chain.a FAIL (previous: FAIL)
- GAP: [S] secret.chu_ko_nu.a (e8df8cbb, f1846fde)
- VERDICT: APPROVE
- CRITERION: secret.chu_ko_nu.a PASS (previous: FAIL)
- GAP: [S] secret.shouter.a (3b45f093)
- VERDICT: APPROVE
- CRITERION: secret.shouter.a FAIL (previous: FAIL)
- GAP: [S] secret.shouter.a (f008ee0e)
- VERDICT: APPROVE
- CRITERION: secret.shouter.a FAIL (previous: FAIL)
- GAP: [S] secret.ball_n_chain.a (07986a12, e9179b7c)
- VERDICT: APPROVE
- CRITERION: secret.ball_n_chain.a PASS (previous: FAIL)
- REGRESSIONS: none

## Notes for next iteration (max 5 lines)
- Chu Ko Nu belt passed gap review. CONFIRM found sleeve, grip, magazine and bolt-origin blockers. Re-audit only its idle-dependent a/b criteria after 8e6a45f6 and carry c/d.
- Raptor claws and bite passed. Team markings remain. Executioner hood passed; its build and trousers remain.
- Ball ’n’ Chain shirt and trousers passed. Its stone-led dive and repeated pounds remain.
- Shouter horns and breeches passed. The lower breeches clip the pale wraps and need a new knee transition.
- Starvation at 511: Ballooner a/c, Fan Bearer b, and Jester a/b/c (last attempted 506), plus Chu Ko Nu b/c if still open after re-audit.
