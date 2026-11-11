# Loop state (v4: two batch audits merged; up to 9 structural/rebuild gaps + 1 eligible polish; fresh CONFIRM before done)
Iteration: 520   Batch: secret_2   Consecutive empty: 0   Done: 112/139   Parked: 0
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
secret_2: taekwondo ++++ D | raptor_rider ---+ o | cheerleader -+++ o | cupid ++++ D | mace_spinner -+-+ o | clams -+-+ o | present_elf ---+ o | ice_mage ---+ o | infernal_whip ---+ o | bank_robbers -+-+ o
secret_3: witch ???? q | banshee ???? q | necromancer ???? q | solar_architect ???? q | wheelbarrow_dragon ???? q | skeleton_giant ???? q | bomb_cannon ???? q | cavalry ???? q | vlad ???? q | gatling_gun ???? q
secret_4: blackbeard ???? q | samurai_giant ???? q | ullr ???? q | lady_red_jade ???? q | sensei ???? q | shogun ???? q | tree_giant ???? q | artemis ???? q | ice_giant ???? q
## Focus (iteration 520; BASE 2c21171d; the 9 starving criteria filled the 9 slots)
1. [S] secret.raptor_rider.c blocker 2 (2adeaa70) APPROVE, struck 2
2. [S] secret.infernal_whip.c blocker 1 (64e33a1e) APPROVE, struck 1
3. [S] secret.bank_robbers.b blocker 1 (9ac31691, 60abe3c1) APPROVE, struck 1, 2; b PASS; a.6 struck
4. [S] secret.bank_robbers.c blocker 1 (37d214e6, 66d5e2d6) APPROVE, struck 1
5. [S] secret.ice_mage.c blocker 1 (d0b30045) APPROVE, struck 1
6. [S] secret.present_elf.c blocker 1 (ed6474a0) APPROVE, struck 1
7. [S] secret.mace_spinner.b blocker 2 (30b10961, 7515543f) APPROVE, struck 1, 2, 3; b PASS
8. [S] secret.mace_spinner.a blocker 2 (24828404) APPROVE, struck 2
9. [S] secret.clams.c blocker 1 (1be75f32) APPROVE, struck 1, 3
- 9/9, 13 struck

## Last verdicts (critic header lines verbatim)
- GAP: [S] secret.raptor_rider (2adeaa70) / VERDICT: APPROVE / CRITERION: secret.raptor_rider.c FAIL   (previous: FAIL)
- GAP: [S] secret.infernal_whip (64e33a1e) / VERDICT: APPROVE / CRITERION: secret.infernal_whip.c FAIL   (previous: FAIL)
- GAP: [S] secret.bank_robbers (9ac31691, 60abe3c1) / VERDICT: APPROVE / CRITERION: secret.bank_robbers.b PASS   (previous: FAIL)
- GAP: [S] secret.bank_robbers (37d214e6, 66d5e2d6) / VERDICT: APPROVE / CRITERION: secret.bank_robbers.c FAIL   (previous: FAIL)
- GAP: [S] secret.ice_mage (d0b30045) / VERDICT: APPROVE / CRITERION: secret.ice_mage.c FAIL   (previous: FAIL)
- GAP: [S] secret.present_elf (ed6474a0) / VERDICT: APPROVE / CRITERION: secret.present_elf.c FAIL   (previous: FAIL)
- GAP: [S] secret.mace_spinner (30b10961, 7515543f) / VERDICT: APPROVE / CRITERION: secret.mace_spinner.b PASS   (previous: FAIL)
- GAP: [S] secret.mace_spinner (24828404) / VERDICT: APPROVE / CRITERION: secret.mace_spinner.a FAIL   (previous: FAIL)
- GAP: [S] secret.clams (1be75f32) / VERDICT: APPROVE / CRITERION: secret.clams.c FAIL   (previous: FAIL)
- REGRESSIONS: none

## Notes for next iteration (max 5 lines)
- RE-AUDIT bank_robbers a first (carry changed at 520: fists up, safe lowered, flank robber .95), audit.md/audit2.md as at 519.
- cheerleader a (cream top, sash) waited out 520 for the starving picks: pick both, then CONFIRM again.
- Evidence commits first: infernal_whip c.3 re-aim to _struck; present_elf c.2 needs present_open as the capture ability (ABILITY_PREF).
- Starving at 521 (no attempt since 515): raptor_rider a, infernal_whip a, ice_mage a/b, present_elf a, clams a; mace_spinner c (last 518).
- mace_spinner c redo: gate on the unit id, not posePreset "spinner"; lay the maces (SpinnerMaces.place) along the forearms in the spin.
