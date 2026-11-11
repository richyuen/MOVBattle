# Loop state (v4: two batch audits merged; up to 9 structural/rebuild gaps + 1 eligible polish; fresh CONFIRM before done)
Iteration: 514   Batch: secret_1   Consecutive empty: 0   Done: 107/139   Parked: 0
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
secret_1: ballooner -+++ o | bomb_on_a_stick ++++ D | fan_bearer -+++ o | raptor ++++ D | the_teacher ++++ D | jester ++++ D | ball_n_chain ++++ D | chu_ko_nu ---+ o | executioner ++++ D | shouter ++++ D
secret_2: taekwondo ???? q | raptor_rider ???? q | cheerleader ???? q | cupid ???? q | mace_spinner ???? q | clams ???? q | present_elf ???? q | ice_mage ???? q | infernal_whip ???? q | bank_robbers ???? q
secret_3: witch ???? q | banshee ???? q | necromancer ???? q | solar_architect ???? q | wheelbarrow_dragon ???? q | skeleton_giant ???? q | bomb_cannon ???? q | cavalry ???? q | vlad ???? q | gatling_gun ???? q
secret_4: blackbeard ???? q | samurai_giant ???? q | ullr ???? q | lady_red_jade ???? q | sensei ???? q | shogun ???? q | tree_giant ???? q | artemis ???? q | ice_giant ???? q
## Focus (iteration 514; BASE 8a18dbec)
1. [S] secret.the_teacher.a blocker 3 (76eb7ccd) APPROVE, struck 3; a PASS, CONFIRM passed, the_teacher D
2. [S] secret.fan_bearer.b blocker 2 (6eb5edb1) APPROVE, struck 2; b PASS
3. [S] secret.fan_bearer.a blocker 4 (77e689a3) APPROVE, struck 4; CONFIRM failed a (skirt shade, sash width)
4. [S] secret.ballooner.c blocker 2 (99a107b4) APPROVE, struck 2; c PASS
5. [S] secret.chu_ko_nu.b blocker 5 (09540a69) REJECT, reverted 4d6431b2
6. [S] secret.ballooner.a blocker 4 (c478e0f8) APPROVE, struck 4 (and 3 by the lineup test)
7. [S] secret.chu_ko_nu.a blocker 1 (01ec5768) APPROVE, struck 1
8. [S] secret.chu_ko_nu.a blocker 2 (d85e50bc) APPROVE, struck 2
9. [S] secret.ballooner.a blocker 5 (baed6b00) APPROVE, struck 5
- 8/9, 9 struck

## Last verdicts (critic header lines verbatim)
- GAP: [S] secret.the_teacher (76eb7ccd) / VERDICT: APPROVE / CRITERION: secret.the_teacher.a PASS   (previous: FAIL)
- GAP: [S] secret.fan_bearer (6eb5edb1) / VERDICT: APPROVE / CRITERION: secret.fan_bearer.b PASS   (previous: FAIL)
- GAP: [S] secret.fan_bearer (77e689a3) / VERDICT: APPROVE / CRITERION: secret.fan_bearer.a PASS   (previous: FAIL)
- GAP: [S] secret.ballooner (99a107b4) / VERDICT: APPROVE / CRITERION: secret.ballooner.c PASS   (previous: FAIL)
- GAP: [S] secret.chu_ko_nu (09540a69) / VERDICT: REJECT / CRITERION: secret.chu_ko_nu.b FAIL   (previous: FAIL)
- GAP: [S] secret.ballooner (c478e0f8) / VERDICT: APPROVE / CRITERION: secret.ballooner.a FAIL   (previous: FAIL)
- GAP: [S] secret.chu_ko_nu (01ec5768) / VERDICT: APPROVE / CRITERION: secret.chu_ko_nu.a FAIL   (previous: FAIL)
- GAP: [S] secret.chu_ko_nu (d85e50bc) / VERDICT: APPROVE / CRITERION: secret.chu_ko_nu.a FAIL   (previous: FAIL)
- GAP: [S] secret.ballooner (baed6b00) / VERDICT: APPROVE / CRITERION: secret.ballooner.a FAIL   (previous: FAIL)
- REGRESSIONS: none
- CONFIRM: the_teacher ++++ | fan_bearer -+++ (a: skirt shade, sash width)

## Notes for next iteration (max 5 lines)
- Three secret_1 units open (ballooner, fan_bearer, chu_ko_nu) with 6 ranked [S] between them: tail-overlap secret_2 (audit it in step 2) and pick from both.
- Chu Ko Nu b.5: put the SS readyAim call for RCB units right after _selectEnemyTarget (the windup is a back-off) AND keep the 514 flipped lay (FromLookDirectionLH(fwd)); probe muzzleAhead in a back-off.
- Fan Bearer a.1 is colour: render a --noglow swatch of the skirt before choosing the shade (palette.png).
- Ballooner a.6: pantaloons must replace the pale tunic hem block below the waist.
