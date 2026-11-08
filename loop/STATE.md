# Loop state (v4: two batch audits merged; up to 9 structural/rebuild gaps + 1 eligible polish; fresh CONFIRM before done)
Iteration: 492   Batch: good+evil   Consecutive empty: 0   Done: 92/139   Parked: 0
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
good: devout_gauntlet ++++ D | celestial_aegis ++++ D | radiant_glaive ++++ D | righteous_paladin -+++ o | divine_arbiter ++++ D | sacred_elephant ++++ D | chronomancer ++++ D
evil: shadow_walker ---+ o | exiled_sentinel -+-+ o | mad_mechanic -+-+ o | void_cultist -+-+ o | tempest_lich ---+ o | death_bringer -+-+ o | void_monarch -+-+ o
secret_1: ballooner ???? q | bomb_on_a_stick ???? q | fan_bearer ???? q | raptor ???? q | the_teacher ???? q | jester ???? q | ball_n_chain ???? q | chu_ko_nu ???? q | executioner ???? q | shouter ???? q
secret_2: taekwondo ???? q | raptor_rider ???? q | cheerleader ???? q | cupid ???? q | mace_spinner ???? q | clams ???? q | present_elf ???? q | ice_mage ???? q | infernal_whip ???? q | bank_robbers ???? q
secret_3: witch ???? q | banshee ???? q | necromancer ???? q | solar_architect ???? q | wheelbarrow_dragon ???? q | skeleton_giant ???? q | bomb_cannon ???? q | cavalry ???? q | vlad ???? q | gatling_gun ???? q
secret_4: blackbeard ???? q | samurai_giant ???? q | ullr ???? q | lady_red_jade ???? q | sensei ???? q | shogun ???? q | tree_giant ???? q | artemis ???? q | ice_giant ???? q

## Focus (iteration 492; BASE 49b5cd87)
1. [S] good.sacred_elephant.a blocker 1 (694be5ff) APPROVE, struck 1.
2. [S] good.sacred_elephant.a blocker 2 (5f638756) APPROVE, struck 2.
3. [S] good.sacred_elephant.a blocker 3 (509c48a0) APPROVE, struck 3; a PASS; CONFIRM passed a-d: D.
4. [S] evil.exiled_sentinel.a blocker 5 (9a91a5a5) APPROVE, struck 5.
5. [S] evil.mad_mechanic.b blocker 1 (42fd82fe) APPROVE, struck 1, 2; b PASS.
6. [S] evil.void_cultist.a blocker 1 (68d128e0) APPROVE, struck 1, 4.
7. [S] evil.shadow_walker.a blocker 2 (3d7a1e02) APPROVE, struck 2.
8. [S] evil.tempest_lich.c blocker 1 (a91f8594) APPROVE, struck 1.
9. [S] evil.void_monarch.c blocker 1 (2117c98a, 421014cc) APPROVE, struck the dart clause.
- 9/9, 11 struck

## Last verdicts (critic header lines verbatim)
- GAP: [S] good.sacred_elephant (694be5ff) | VERDICT: APPROVE | CRITERION: good.sacred_elephant.a FAIL   (previous: FAIL)
- GAP: [S] good.sacred_elephant (5f638756) | VERDICT: APPROVE | CRITERION: good.sacred_elephant.a FAIL   (previous: FAIL)
- GAP: [S] good.sacred_elephant (509c48a0) | VERDICT: APPROVE | CRITERION: good.sacred_elephant.a PASS   (previous: FAIL)
- GAP: [S] evil.exiled_sentinel (9a91a5a5) | VERDICT: APPROVE | CRITERION: evil.exiled_sentinel.a FAIL   (previous: FAIL)
- GAP: [S] evil.mad_mechanic (42fd82fe) | VERDICT: APPROVE | CRITERION: evil.mad_mechanic.b PASS   (previous: FAIL)
- GAP: [S] evil.void_cultist (68d128e0) | VERDICT: APPROVE | CRITERION: evil.void_cultist.a FAIL   (previous: FAIL)
- GAP: [S] evil.shadow_walker (3d7a1e02) | VERDICT: APPROVE | CRITERION: evil.shadow_walker.a FAIL   (previous: FAIL)
- GAP: [S] evil.tempest_lich (a91f8594) | VERDICT: APPROVE | CRITERION: evil.tempest_lich.c FAIL   (previous: FAIL)
- GAP: [S] evil.void_monarch (2117c98a; 421014cc is a stats-only follow-up and is not reviewed) | VERDICT: APPROVE | CRITERION: evil.void_monarch.c FAIL   (previous: FAIL)
- REGRESSIONS: none
- CONFIRM: UNIT good.sacred_elephant: a PASS b PASS c PASS d PASS (4/4)

## Notes for next iteration (max 5 lines)
- 9/9 approved, 11 struck; Done 92/139 (Elephant D). Good has only the Paladin open; every Evil unit is open.
- Paladin a (last attempt 488) starves at 494: its gap 1 is at 2 attempts, so take its first blocker from a fresh mechanism (e.g. a team bloused-shorts hull proud of the cuirass hem).
- Monarch is boss_melee now; next pick drops summon from the evil entry only (custom.void_monarch keeps it) and adds a radius-2 pink burst at the hit.
- Every Evil c criterion but the lich's was untried before 492 and starves at 494: spread c picks next iteration.
- Type-check, 45 shots, stats 7/7 evil + elephant d PASS; no browser errors. LESSONS at cap (9999/10000): merge before adding.
