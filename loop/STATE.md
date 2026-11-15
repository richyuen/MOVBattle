# Loop state (v4: two batch audits merged; up to 9 structural/rebuild gaps + 1 eligible polish; fresh CONFIRM before done)
Iteration: 550   Batch: secret_4   Consecutive empty: 0   Done: 132/139   Parked: 0
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
secret_4: blackbeard ++++ D | samurai_giant -+++ o | ullr -+++ o | lady_red_jade -+++ o | sensei ++++ D | shogun -+++ o | tree_giant -+++ o | artemis -+++ o | ice_giant -+++ o

## Focus (iteration 550; BASE e4a2a591; secret_4)
1. [S] secret.lady_red_jade.a tall slim rig (ac99338e) APPROVE, struck 4; CONFIRM failed a (2 new)
2. [S] secret.ice_giant.a long legs and trunk, tallest (56982960) APPROVE, struck 5; CONFIRM failed a (4 new)
3. [S] secret.artemis.a open strap sandals (b4f1b1e3) APPROVE, struck 2; CONFIRM failed a (1 new; a plateau)
4. [S] secret.ullr.a belt (94e017e9) APPROVE, struck 5
5. [S] secret.ullr.a lace-up boots (b78a31bd) APPROVE, struck 6
6. [S] secret.shogun.a hakama (d8515ec3) APPROVE, struck 6
7. [S] secret.shogun.a tassets (a34b4763) APPROVE, struck 5
8. [S] secret.tree_giant.c heavy-swing family, two-handed swat (a89c3af8) APPROVE, struck 1, c PASS
9. [S] secret.tree_giant.a open sandals (fa5b6d54) APPROVE, struck 3
- 9/9, 9 struck

## Last verdicts (critic header lines verbatim)
- GAP: [S] secret.lady_red_jade (ac99338e) / VERDICT: APPROVE / CRITERION: secret.lady_red_jade.a PASS   (previous: FAIL)
- GAP: [S] secret.ice_giant (56982960) / VERDICT: APPROVE / CRITERION: secret.ice_giant.a PASS   (previous: FAIL)
- GAP: [S] secret.artemis (b4f1b1e3) / VERDICT: APPROVE / CRITERION: secret.artemis.a PASS   (previous: FAIL)
- GAP: [S] secret.ullr (94e017e9) / VERDICT: APPROVE / CRITERION: secret.ullr.a FAIL   (previous: FAIL)
- GAP: [S] secret.ullr (b78a31bd) / VERDICT: APPROVE / CRITERION: secret.ullr.a FAIL   (previous: FAIL)
- GAP: [S] secret.shogun (d8515ec3) / VERDICT: APPROVE / CRITERION: secret.shogun.a FAIL   (previous: FAIL)
- GAP: [S] secret.shogun (a34b4763) / VERDICT: APPROVE / CRITERION: secret.shogun.a FAIL   (previous: FAIL)
- GAP: [S] secret.tree_giant (a89c3af8) / VERDICT: APPROVE / CRITERION: secret.tree_giant.c PASS   (previous: FAIL)
- GAP: [S] secret.tree_giant (fa5b6d54) / VERDICT: APPROVE / CRITERION: secret.tree_giant.a FAIL   (previous: FAIL)
- REGRESSIONS: none
- CONFIRM 550: lady_red_jade, ice_giant, artemis a FAIL; b, c, d PASS (no unit done)

## Notes for next iteration (max 5 lines)
- Artemis a is plateau (CONFIRM failed a in 546 and 550): this iteration's [R] is her back quiver, specified from both CONFIRM lists.
- Ice Giant: CONFIRM wants height from trunk and long arms, legs short (ape); keep his head over the tree giant's (~4.3 m; probe heights with probe_eval).
- Samurai Giant vambraces: the idle hides the forearms behind the broad blade (probe_bbox 549). Evidence commit (a new shot, not the idle camera) before another a.2 pick; starves at 554.
- Ullr and Shogun each have one blocker left (ullr a.7 colour-only: swatch; shogun a.4 vambraces): a pass sends them to CONFIRM.
- Tree Giant a.6 scale must stay under the ice giant's head.
