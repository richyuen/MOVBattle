# Loop state (v4: two batch audits merged; up to 9 structural/rebuild gaps + 1 eligible polish; fresh CONFIRM before done)
Iteration: 525   Batch: secret_2   Consecutive empty: 0   Done: 114/139   Parked: 0
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
secret_2: taekwondo ++++ D | raptor_rider -+++ o | cheerleader ++++ D | cupid ++++ D | mace_spinner ++++ D | clams --++ o | present_elf +-++ o | ice_mage -+++ o | infernal_whip -+++ o | bank_robbers -+-+ o
secret_3: witch ???? q | banshee ???? q | necromancer ???? q | solar_architect ???? q | wheelbarrow_dragon ???? q | skeleton_giant ???? q | bomb_cannon ???? q | cavalry ???? q | vlad ???? q | gatling_gun ???? q
secret_4: blackbeard ???? q | samurai_giant ???? q | ullr ???? q | lady_red_jade ???? q | sensei ???? q | shogun ???? q | tree_giant ???? q | artemis ???? q | ice_giant ???? q
## Focus (iteration 525; BASE f144f31f; secret_2)
0. evidence: unit_secret.present_elf_front, the idle angle after the present leaves (2bc9d115); a.2 re-aimed there
1. [S] secret.present_elf.a blocker 2 (553aa464) APPROVED, struck 2
2. [S] secret.present_elf.a blocker 3 (b2419661) APPROVED, struck 3
3. [S] secret.ice_mage.a blocker 3 (3928c3e9) APPROVED, struck 3
4. [S] secret.clams.a blocker 5 (955447c8) APPROVED, struck 5
5. [S] secret.clams.a blocker 6 (d6371769) APPROVED, struck 6, a PASS; CONFIRM failed a, b
6. [S] secret.present_elf.a blocker 4 (828f37d3) APPROVED, struck 4, a PASS; CONFIRM passed a, c, failed b
7. [S] secret.ice_mage.a blocker 4 (a2721aa3) APPROVED, struck 4
8. [S] secret.infernal_whip.a blocker 3 (adcd07d8) APPROVED, struck 3
9. [S] secret.raptor_rider.c blocker 1 (3df5c0a3) APPROVED, struck 1, c PASS
10. [P] secret.infernal_whip.b blocker 3 (488c6e90) APPROVED, struck 3, b PASS
- 10/10, 10 struck

## Last verdicts (critic header lines verbatim)
- GAP: [S] secret.present_elf (553aa464) / VERDICT: APPROVE / CRITERION: secret.present_elf.a FAIL   (previous: FAIL)
- GAP: [S] secret.present_elf (b2419661) / VERDICT: APPROVE / CRITERION: secret.present_elf.a FAIL   (previous: FAIL)
- GAP: [S] secret.ice_mage (3928c3e9) / VERDICT: APPROVE / CRITERION: secret.ice_mage.a FAIL   (previous: FAIL)
- GAP: [S] secret.clams (955447c8) / VERDICT: APPROVE / CRITERION: secret.clams.a FAIL   (previous: FAIL)
- GAP: [S] secret.clams (d6371769) / VERDICT: APPROVE / CRITERION: secret.clams.a PASS   (previous: FAIL)
- GAP: [S] secret.present_elf (828f37d3) / VERDICT: APPROVE / CRITERION: secret.present_elf.a PASS   (previous: FAIL)
- GAP: [S] secret.ice_mage (a2721aa3) / VERDICT: APPROVE / CRITERION: secret.ice_mage.a FAIL   (previous: FAIL)
- GAP: [S] secret.infernal_whip (adcd07d8) / VERDICT: APPROVE / CRITERION: secret.infernal_whip.a FAIL   (previous: FAIL)
- GAP: [S] secret.raptor_rider (3df5c0a3) / VERDICT: APPROVE / CRITERION: secret.raptor_rider.c PASS   (previous: FAIL)
- GAP: [P] secret.infernal_whip (488c6e90) / VERDICT: APPROVE / CRITERION: secret.infernal_whip.b PASS   (previous: FAIL)
- REGRESSIONS: none
- CONFIRM: UNIT secret.clams: a FAIL b FAIL c PASS d PASS (2/4); UNIT secret.present_elf: a PASS b FAIL c PASS d PASS (3/4)

## Notes for next iteration (max 5 lines)
- Raptor Rider a last attempted 521: it starves now, so pick it in 526 (head, headdress, loincloth ranked).
- Bank Robbers: c.4 (fisticuffs after the throw) is still ranked first; nothing of theirs attempted in 525.
- CLAMS a.1 hip disc: the legacy propBuilder "clam_shell" special on body.hip (secret_clams preset); check the clam critters before removing it.
- Present Elf b: the present must grow to a near-cube twice shoulder-wide, chin to knee; keep unit_secret.present_elf_front for the vest.
- Every open unit fails one or two criteria now; CLAMS and Present Elf each have one CONFIRM fail (a second makes the criterion plateau).
