# Loop state (v4: two batch audits merged; up to 9 structural/rebuild gaps + 1 eligible polish; fresh CONFIRM before done)
Iteration: 527   Batch: secret_2+secret_3   Consecutive empty: 0   Done: 119/139   Parked: 0
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
secret_2: taekwondo ++++ D | raptor_rider ++++ D | cheerleader ++++ D | cupid ++++ D | mace_spinner ++++ D | clams ++++ D | present_elf ++++ D | ice_mage ++++ D | infernal_whip ++++ D | bank_robbers --++ o
secret_3: witch ---+ o | banshee ---+ o | necromancer ---+ o | solar_architect ---+ o | wheelbarrow_dragon ---+ o | skeleton_giant ---+ o | bomb_cannon --++ o | cavalry ---+ o | vlad -+-+ o | gatling_gun ---+ o
secret_4: blackbeard ???? q | samurai_giant ???? q | ullr ???? q | lady_red_jade ???? q | sensei ???? q | shogun ???? q | tree_giant ???? q | artemis ???? q | ice_giant ???? q
## Focus (iteration 527; BASE f6e62ba3; secret_2+secret_3, secret_3 audited (stats f6e62ba3))
1. [S] secret.bank_robbers.a blocker 5 (08766f4b, 0fe341bb) APPROVED, struck 5
2. [S] secret.bank_robbers.a blocker 4 (361f605c) APPROVED, struck 4
3. [S] secret.bank_robbers.a blocker 2 (1838836b) APPROVED, struck 2, a PASS; CONFIRM failed a, b (new lists)
4. [S] secret.skeleton_giant.b blocker 1 (77116afd) APPROVED, struck 1
5. [S] secret.skeleton_giant.a blocker 2 (deff238b) APPROVED, struck 2
6. [S] secret.cavalry.b blocker 1 (1cd9657d) APPROVED, struck 1, 3
7. [S] secret.cavalry.a blocker 1 (99708be7, 36fdeb97) APPROVED, struck 1
8. [S] secret.vlad.b blocker 1 (1d6cb656) APPROVED, struck 1, b PASS
9. [S] secret.bomb_cannon.b blocker 1 (7d5002bd) APPROVED, struck 1; added 2
- 9/9, 10 struck

## Last verdicts (critic header lines verbatim)
- GAP: [S] secret.bank_robbers (08766f4b, follow-up 0fe341bb) / VERDICT: APPROVE / CRITERION: secret.bank_robbers.a PASS   (previous: FAIL)
- GAP: [S] secret.bank_robbers (361f605c) / VERDICT: APPROVE / CRITERION: secret.bank_robbers.a PASS   (previous: FAIL)
- GAP: [S] secret.bank_robbers (1838836b) / VERDICT: APPROVE / CRITERION: secret.bank_robbers.a PASS   (previous: FAIL)
- GAP: [S] secret.skeleton_giant (77116afd) / VERDICT: APPROVE / CRITERION: secret.skeleton_giant.b FAIL   (previous: FAIL)
- GAP: [S] secret.skeleton_giant (deff238b) / VERDICT: APPROVE / CRITERION: secret.skeleton_giant.a FAIL   (previous: FAIL)
- GAP: [S] secret.cavalry (1cd9657d) / VERDICT: APPROVE / CRITERION: secret.cavalry.b FAIL   (previous: FAIL)
- GAP: [S] secret.cavalry (99708be7, follow-up 36fdeb97) / VERDICT: APPROVE / CRITERION: secret.cavalry.a FAIL   (previous: FAIL)
- GAP: [S] secret.vlad (1d6cb656) / VERDICT: APPROVE / CRITERION: secret.vlad.b PASS   (previous: FAIL)
- GAP: [S] secret.bomb_cannon (7d5002bd) / VERDICT: APPROVE / CRITERION: secret.bomb_cannon.b FAIL   (previous: FAIL)
- REGRESSIONS: none
- CONFIRM: bank_robbers 2/4 (passed c; failed a, b)

## Notes for next iteration (max 5 lines)
- bank_robbers took CONFIRM's a, b lists (bandana, gun belt, sleeves; safe colour, door dial, straight-arm grip): a second CONFIRM fail on a or b makes it plateau.
- Eligible [P] fallouts: cavalry CAVALRY_SPEAR flags wider/longer (1cd9657d); bomb_cannon crew cutlass blade-up flip (7d5002bd).
- Unattempted secret_3 units (witch, banshee, necromancer, solar_architect, wheelbarrow_dragon, gatling_gun) starve at 532: spread picks over them.
- stats.json in iter-527 holds only the five touched units; audit.md/audit2.md hold the secret_3 audits.
