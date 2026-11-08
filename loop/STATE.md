# Loop state (v4: two batch audits merged; up to 9 structural/rebuild gaps + 1 eligible polish; fresh CONFIRM before done)
Iteration: 493   Batch: evil   Consecutive empty: 0   Done: 93/139   Parked: 0
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
evil: shadow_walker ---+ o | exiled_sentinel -+-+ o | mad_mechanic -+++ o | void_cultist -+-+ o | tempest_lich ---+ o | death_bringer -+-+ o | void_monarch -+-+ o
secret_1: ballooner ???? q | bomb_on_a_stick ???? q | fan_bearer ???? q | raptor ???? q | the_teacher ???? q | jester ???? q | ball_n_chain ???? q | chu_ko_nu ???? q | executioner ???? q | shouter ???? q
secret_2: taekwondo ???? q | raptor_rider ???? q | cheerleader ???? q | cupid ???? q | mace_spinner ???? q | clams ???? q | present_elf ???? q | ice_mage ???? q | infernal_whip ???? q | bank_robbers ???? q
secret_3: witch ???? q | banshee ???? q | necromancer ???? q | solar_architect ???? q | wheelbarrow_dragon ???? q | skeleton_giant ???? q | bomb_cannon ???? q | cavalry ???? q | vlad ???? q | gatling_gun ???? q
secret_4: blackbeard ???? q | samurai_giant ???? q | ullr ???? q | lady_red_jade ???? q | sensei ???? q | shogun ???? q | tree_giant ???? q | artemis ???? q | ice_giant ???? q

## Focus (iteration 493; BASE 73e19d43)
1. [S] good.righteous_paladin.a blocker 1 (74215c7f) APPROVE, struck 1; a PASS; CONFIRM passed a-d: D.
2. [S] evil.void_cultist.c blocker 1 (a127c2f7, 0a8a899c; 7dcdbf23 reverted 9fb211d5; stats ddbe3995) APPROVE, struck 1.
3. [S] evil.mad_mechanic.c blocker 1 (99b7a8fc, eee93888) APPROVE, struck 1; c PASS.
4. [S] evil.exiled_sentinel.c blocker 1 (7387478e, d837acc3) APPROVE, struck 1.
5. [S] evil.shadow_walker.c blocker 2 (7b49861b) APPROVE, struck 2.
6. [S] evil.death_bringer.c blocker 1 (87954be0) APPROVE, struck 1.
7. [S] evil.tempest_lich.c blocker 2 (301f1fad) REJECT, reverted 06b4f975.
8. [S] evil.void_monarch.c blocker 1 (f22ca9e7) APPROVE, struck 1.
9. [S] evil.void_cultist.a blocker 2 (6c991027) APPROVE, struck 2.
- 8/9, 8 struck

## Last verdicts (critic header lines verbatim)
- GAP: [S] good.righteous_paladin (74215c7f) | VERDICT: APPROVE | CRITERION: good.righteous_paladin.a PASS   (previous: FAIL)
- GAP: [S] evil.void_cultist (a127c2f7, 0a8a899c) | VERDICT: APPROVE | CRITERION: evil.void_cultist.c FAIL   (previous: FAIL)
- GAP: [S] evil.mad_mechanic (99b7a8fc, eee93888) | VERDICT: APPROVE | CRITERION: evil.mad_mechanic.c PASS   (previous: FAIL)
- GAP: [S] evil.exiled_sentinel (7387478e, d837acc3) | VERDICT: APPROVE | CRITERION: evil.exiled_sentinel.c FAIL   (previous: FAIL)
- GAP: [S] evil.shadow_walker (7b49861b) | VERDICT: APPROVE | CRITERION: evil.shadow_walker.c FAIL   (previous: FAIL)
- GAP: [S] evil.death_bringer (87954be0) | VERDICT: APPROVE | CRITERION: evil.death_bringer.c FAIL   (previous: FAIL)
- GAP: [S] evil.tempest_lich (301f1fad) | VERDICT: REJECT | CRITERION: evil.tempest_lich.c FAIL   (previous: FAIL)
- GAP: [S] evil.void_monarch (f22ca9e7) | VERDICT: APPROVE | CRITERION: evil.void_monarch.c FAIL   (previous: FAIL)
- GAP: [S] evil.void_cultist (6c991027) | VERDICT: APPROVE | CRITERION: evil.void_cultist.a FAIL   (previous: FAIL)
- REGRESSIONS: none
- CONFIRM: UNIT good.righteous_paladin: a PASS b PASS c PASS d PASS (4/4)

## Notes for next iteration (max 5 lines)
- 8/9 approved, 8 struck; Done 93/139 (Paladin D, Good batch closed: checkpoint 12/12 green, Batch now evil). Mechanic c PASS.
- Starving at 494 (no attempt since the 489 audit): tempest_lich a and b, mad_mechanic a, death_bringer a, void_monarch a. Take one slot each.
- Lich: shorten the bell skirt to a tunic over thin legs first (a.4); only then retry the hover mark (rejected 493: the skirt hid the lift).
- Monarch a.1: drop size giant and the vis scale on the evil entry only; custom.void_monarch has its own roster line, vis and HORNED_EVIL key.
- Stats 7/7 evil + paladin d PASS; no browser errors. LESSONS 9978/10000, LEDGER 15.8/16 KB: compact before adding.
