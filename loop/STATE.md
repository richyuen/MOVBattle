# Loop state (v4: two batch audits merged; up to 9 structural/rebuild gaps + 1 eligible polish; fresh CONFIRM before done)
Iteration: 515   Batch: secret_1+secret_2   Consecutive empty: 0   Done: 107/139   Parked: 0
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
secret_1: ballooner -+++ o | bomb_on_a_stick ++++ D | fan_bearer -+++ o | raptor ++++ D | the_teacher ++++ D | jester ++++ D | ball_n_chain ++++ D | chu_ko_nu +--+ o | executioner ++++ D | shouter ++++ D
secret_2: taekwondo -+-+ o | raptor_rider ---+ o | cheerleader -+-+ o | cupid ---+ o | mace_spinner ---+ o | clams -+-+ o | present_elf ---+ o | ice_mage ---+ o | infernal_whip ---+ o | bank_robbers ---+ o
secret_3: witch ???? q | banshee ???? q | necromancer ???? q | solar_architect ???? q | wheelbarrow_dragon ???? q | skeleton_giant ???? q | bomb_cannon ???? q | cavalry ???? q | vlad ???? q | gatling_gun ???? q
secret_4: blackbeard ???? q | samurai_giant ???? q | ullr ???? q | lady_red_jade ???? q | sensei ???? q | shogun ???? q | tree_giant ???? q | artemis ???? q | ice_giant ???? q
## Focus (iteration 515; BASE 1890e47d)
1. [S] secret.chu_ko_nu.b blocker 5 (19b0b661, 3948d262) REJECT, reverted 823dc1cf, c248299a; b plateau
2. [S] secret.ballooner.a blocker 6 (b8a58d45, d8a671fe) APPROVE, struck 6; CONFIRM failed a (pantaloons too long)
3. [S] secret.fan_bearer.a blocker 2 (e473f7f3) APPROVE, struck 2
4. [S] secret.fan_bearer.a blocker 1 (b8fda5ab) APPROVE, struck 1; CONFIRM failed a (navy shins) -> plateau
5. [S] secret.chu_ko_nu.a blocker 3 (ea39c522) APPROVE, struck 3
6. [S] secret.chu_ko_nu.a blocker 4 (79e1a268) APPROVE, struck 4; a PASS
7. [S] secret.cheerleader.b blocker 1 (1f7b7113) APPROVE, struck 1, 2; b PASS
8. [S] secret.clams.b blocker 1 (e79fae3e) APPROVE, struck 1; b PASS
9. [S] secret.cupid.a blocker 1 (dd1e07c2) APPROVE, struck 1
- 8/9, 9 struck

## Last verdicts (critic header lines verbatim)
- GAP: [S] secret.chu_ko_nu (19b0b661, 3948d262) / VERDICT: REJECT / CRITERION: secret.chu_ko_nu.b FAIL   (previous: FAIL)
- GAP: [S] secret.ballooner (b8a58d45, d8a671fe) / VERDICT: APPROVE / CRITERION: secret.ballooner.a PASS   (previous: FAIL)
- GAP: [S] secret.fan_bearer (e473f7f3) / VERDICT: APPROVE / CRITERION: secret.fan_bearer.a FAIL   (previous: FAIL)
- GAP: [S] secret.fan_bearer (b8fda5ab) / VERDICT: APPROVE / CRITERION: secret.fan_bearer.a PASS   (previous: FAIL)
- GAP: [S] secret.chu_ko_nu (ea39c522) / VERDICT: APPROVE / CRITERION: secret.chu_ko_nu.a FAIL   (previous: FAIL)
- GAP: [S] secret.chu_ko_nu (79e1a268) / VERDICT: APPROVE / CRITERION: secret.chu_ko_nu.a PASS   (previous: FAIL)
- GAP: [S] secret.cheerleader (1f7b7113) / VERDICT: APPROVE / CRITERION: secret.cheerleader.b PASS   (previous: FAIL)
- GAP: [S] secret.clams (e79fae3e) / VERDICT: APPROVE / CRITERION: secret.clams.b PASS   (previous: FAIL)
- GAP: [S] secret.cupid (dd1e07c2) / VERDICT: APPROVE / CRITERION: secret.cupid.a FAIL   (previous: FAIL)
- REGRESSIONS: none
- CONFIRM: ballooner -+++ (a: pantaloons too long) | fan_bearer -+++ (a: navy shins; second CONFIRM fail, plateau)

## Notes for next iteration (max 5 lines)
- Evidence commit first: lineup_secret shows only the ten secret_1 units (critic 515); add the secret_2 units, and re-aim the idle of present_elf, ice_mage, infernal_whip to the front three-quarter (AUDIT 2: shot from behind).
- [R] slot: chu_ko_nu.b plateau (backpedal facing the man + across-chest hold, unit file) and fan_bearer.a plateau wait; the older one (chu_ko_nu) takes 516, fan_bearer 517.
- chu_ko_nu.c starves at 516 (last attempt 511): bolts off the held rail.
- Ballooner a: [P] BALLOONER_LEG.hem -0.07 -> +0.03 is eligible fallout of b8a58d45.
