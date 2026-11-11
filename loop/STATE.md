# Loop state (v4: two batch audits merged; up to 9 structural/rebuild gaps + 1 eligible polish; fresh CONFIRM before done)
Iteration: 516   Batch: secret_1+secret_2   Consecutive empty: 0   Done: 109/139   Parked: 0
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
secret_1: ballooner ++++ D | bomb_on_a_stick ++++ D | fan_bearer -+++ o | raptor ++++ D | the_teacher ++++ D | jester ++++ D | ball_n_chain ++++ D | chu_ko_nu ++++ D | executioner ++++ D | shouter ++++ D
secret_2: taekwondo -+-+ o | raptor_rider ---+ o | cheerleader -+-+ o | cupid ---+ o | mace_spinner ---+ o | clams -+-+ o | present_elf ---+ o | ice_mage ---+ o | infernal_whip ---+ o | bank_robbers ---+ o
secret_3: witch ???? q | banshee ???? q | necromancer ???? q | solar_architect ???? q | wheelbarrow_dragon ???? q | skeleton_giant ???? q | bomb_cannon ???? q | cavalry ???? q | vlad ???? q | gatling_gun ???? q
secret_4: blackbeard ???? q | samurai_giant ???? q | ullr ???? q | lady_red_jade ???? q | sensei ???? q | shogun ???? q | tree_giant ???? q | artemis ???? q | ice_giant ???? q
## Focus (iteration 516; BASE 0757f5e0; evidence 0757f5e0: one lineup per slice)
1. [R] secret.chu_ko_nu.b blockers 2, 4, 5 (a4b70e94, 602fa00f) APPROVE, struck 2, 4, 5; b PASS
2. [S] secret.chu_ko_nu.c blocker 1 (66e47ff2) APPROVE, struck 1; c PASS; CONFIRM passed, done
3. [S] secret.ballooner.a blocker 1 (aac1740a) APPROVE, struck 1; a PASS; CONFIRM passed, done
4. [S] secret.taekwondo.a blocker 1 (1955e016, f438c488) APPROVE, struck 1, 2
5. [S] secret.taekwondo.c blocker 1 (23d145b2) APPROVE, struck 1
6. [S] secret.cupid.a blocker 3 (463d1578) APPROVE, struck 3, 2 by lineup
7. [S] secret.cupid.b blocker 1 (2cd491c9) APPROVE, struck 1
8. [S] secret.cheerleader.a blocker 2 (848338c6) APPROVE, struck 2, 1 by lineup
9. [S] secret.clams.a blocker 2 (deb199cb, 30b1375a) APPROVE, struck 2
- 9/9, 14 struck

## Last verdicts (critic header lines verbatim)
- GAP: [R] secret.chu_ko_nu (a4b70e94, 602fa00f) / VERDICT: APPROVE / CRITERION: secret.chu_ko_nu.b PASS   (previous: FAIL plateau)
- GAP: [S] secret.chu_ko_nu (66e47ff2) / VERDICT: APPROVE / CRITERION: secret.chu_ko_nu.c PASS   (previous: FAIL)
- GAP: [S] secret.ballooner (aac1740a) / VERDICT: APPROVE / CRITERION: secret.ballooner.a PASS   (previous: FAIL)
- GAP: [S] secret.taekwondo (1955e016, f438c488) / VERDICT: APPROVE / CRITERION: secret.taekwondo.a FAIL   (previous: FAIL)
- GAP: [S] secret.taekwondo (23d145b2) / VERDICT: APPROVE / CRITERION: secret.taekwondo.c FAIL   (previous: FAIL)
- GAP: [S] secret.cupid (463d1578) / VERDICT: APPROVE / CRITERION: secret.cupid.a FAIL   (previous: FAIL)
- GAP: [S] secret.cupid (2cd491c9) / VERDICT: APPROVE / CRITERION: secret.cupid.b FAIL   (previous: FAIL)
- GAP: [S] secret.cheerleader (848338c6) / VERDICT: APPROVE / CRITERION: secret.cheerleader.a FAIL   (previous: FAIL)
- GAP: [S] secret.clams (deb199cb, 30b1375a) / VERDICT: APPROVE / CRITERION: secret.clams.a FAIL   (previous: FAIL)
- REGRESSIONS: none
- CONFIRM: ballooner ++++ | chu_ko_nu ++++ (both done)

## Notes for next iteration (max 5 lines)
- [R] slot 517: fan_bearer.a plateau (one dress pass owning skirt, sash and legs; unit file). It is secret_1's last open unit: its checkpoint follows once it is D or p.
- present_elf, ice_mage, infernal_whip: the idle is a front shot (probe 516); the ball hood (a.1) hides the face. Pick a.1 first, then RE-AUDIT a, b on the new idle.
- Per-slice lineups now: lineup_secret_1, lineup_secret_2 (capture lineupKey). CRITIC's lineup_<f> means the unit's slice lineup.
- cheerleader: the poms in front of her hips hide top and skirt in idle and lineup (TABS holds them out at the hip sides).
