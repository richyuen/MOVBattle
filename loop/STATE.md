# Loop state (v2: one batch at a time, up to 5 structural gaps per iteration)
Iteration: 351   Batch: medieval (4/18)   Consecutive empty: 0   Done: 21/139   Parked: 0
Batches, in order: tribal, renaissance, farmer, medieval, ancient, viking, dynasty, pirate, spooky, wild_west, legacy_1, legacy_2, good, evil, secret_1, secret_2, secret_3, secret_4

## Scoreboard (a b c d as + pass, - fail, ? unscored; status q queued, o open, D done, p parked)
tribal: clubber ++++ D | protector ++++ D | spear_thrower ++++ D | stoner ++++ D | bone_mage ++++ D | chieftain ++++ D | mammoth ++++ D
renaissance: painter ++++ D | fencer ++++ D | balloon_archer ++++ D | musketeer ++++ D | halberd ++++ D | jouster ++++ D | da_vinci_tank ++++ D
farmer: halfling ++++ D | farmer ++++ D | hay_baler ++++ D | potion_seller ++++ D | harvester ++++ D | wheelbarrow ++++ D | scarecrow ++++ D
medieval: bard ---+ o | squire --++ o | archer ---+ o | healer ---+ o | knight -+++ o | catapult --++ o | king --++ o
ancient: shield_bearer ???? q | sarissa ???? q | hoplite ???? q | snake_archer ???? q | ballista ???? q | minotaur ???? q | zeus ???? q
viking: headbutter ???? q | ice_archer ???? q | brawler ???? q | berserker ???? q | valkyrie ???? q | longship ???? q | jarl ???? q
dynasty: samurai ???? q | firework_archer ???? q | monk ???? q | ninja ???? q | dragon ???? q | hwacha ???? q | monkey_king ???? q
pirate: flintlock ???? q | blunderbuss ???? q | bomb_thrower ???? q | harpooner ???? q | cannon ???? q | captain ???? q | pirate_queen ???? q
spooky: skeleton_warrior ???? q | skeleton_archer ???? q | candlehead ???? q | vampire ???? q | pumpkin_catapult ???? q | swordcaster ???? q | reaper ???? q
wild_west: dynamite_thrower ???? q | miner ???? q | cactus ???? q | gunslinger ???? q | lasso ???? q | deadeye ???? q | quick_draw ???? q
legacy_1: peasant ???? q | banner_bearer ???? q | poacher ???? q | blowdarter ???? q | pike ???? q | barrel_roller ???? q | boxer ???? q | flag_bearer ???? q
legacy_2: pharaoh ???? q | wizard ???? q | chariot ???? q | thor ???? q | tank ???? q | super_boxer ???? q | dark_peasant ???? q | super_peasant ???? q
good: devout_gauntlet ???? q | celestial_aegis ???? q | radiant_glaive ???? q | righteous_paladin ???? q | divine_arbiter ???? q | sacred_elephant ???? q | chronomancer ???? q
evil: shadow_walker ???? q | exiled_sentinel ???? q | mad_mechanic ???? q | void_cultist ???? q | tempest_lich ???? q | death_bringer ???? q | void_monarch ???? q
secret_1: ballooner ???? q | bomb_on_a_stick ???? q | fan_bearer ???? q | raptor ???? q | the_teacher ???? q | jester ???? q | ball_n_chain ???? q | chu_ko_nu ???? q | executioner ???? q | shouter ???? q
secret_2: taekwondo ???? q | raptor_rider ???? q | cheerleader ???? q | cupid ???? q | mace_spinner ???? q | clams ???? q | present_elf ???? q | ice_mage ???? q | infernal_whip ???? q | bank_robbers ???? q
secret_3: witch ???? q | banshee ???? q | necromancer ???? q | solar_architect ???? q | wheelbarrow_dragon ???? q | skeleton_giant ???? q | bomb_cannon ???? q | cavalry ???? q | vlad ???? q | gatling_gun ???? q
secret_4: blackbeard ???? q | samurai_giant ???? q | ullr ???? q | lady_red_jade ???? q | sensei ???? q | shogun ???? q | tree_giant ???? q | artemis ???? q | ice_giant ???? q

## Focus (every gap this iteration: tag, unit, gap, sha, verdict)
351 (BASE 3df7001): [S] healer c gold heal beam 8407591 approved | [S] catapult c throwing arm df37545+a4cb4c1 approved | [S] knight c Knight Charge b806f45 approved | [S] bard b banjo e179db7 approved | [S] king b Zweihander 4c91ec8 rejected (reverted ce15b46)
351.0: regression re-baseline 256a539, medieval stats 3df7001, evidence (war machines framed by mesh top) 65be27f.

## Last verdicts (critic header lines verbatim)
- GAP: [S] medieval.healer (8407591) VERDICT: APPROVE CRITERION: medieval.healer.c FAIL (previous: FAIL) BLOCKERS: struck: 1. Remaining: 2. healed ally only partly gilded
- GAP: [S] medieval.catapult (df37545 + a4cb4c1) VERDICT: APPROVE CRITERION: medieval.catapult.c PASS (previous: FAIL) BLOCKERS: struck: 1 (list cleared)
- GAP: [S] medieval.knight (b806f45) VERDICT: APPROVE CRITERION: medieval.knight.c PASS (previous: FAIL) BLOCKERS: struck: 1 (list cleared)
- GAP: [S] medieval.bard (e179db7) VERDICT: APPROVE CRITERION: medieval.bard.b FAIL (previous: FAIL) BLOCKERS: struck: 1. Remaining: 2. grip both fists high on the neck
- GAP: [S] medieval.king (4c91ec8) VERDICT: REJECT CRITERION: medieval.king.b FAIL (previous: FAIL) BLOCKERS: 1, 2 open; added 3 (pommel-first swing, from 4c91ec8)

## Unit file template (loop/units/<id>.md, cap 2600 bytes)
```
# <unitId>
Status: open|done|parked   Audited: <iter>   Done: <iter or ->
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (0 since <iter>)
 1. <element> in unit_<id>_<shot> — TABS: <what the reference shows> (ref: <file or card section>)
b PASS (<iter>)
c FAIL (0 since <iter>) [plateau|parked when marked]
 1. missing: <mechanic>
d PASS|FAIL (<the stats.json line, shortened>)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] c <gap> — blocker 1: <mechanism> — ref: <file> — ours: <png>
## Attempts (iter | gap | criterion | verdict: approved, rejected, rejected-kept, dropped)
## Rejected (last 4: gap [tag] [attempts] — iter: what — critic's top defect)
## Notes (max 3 lines)
```

## Notes for next iteration (max 5 lines)
- Medieval audited 351 (d 7/7 PASS after stats). Squire/archer stats moved (both in regression scenarios): expect re-baselines at the medieval checkpoint.
- King Zweihander retry: the greatsword's +y runs out of the fist toward his back in the carry/swing; mount the blade on the old slab sword's swing side (check unit_medieval.king_release) before widening it.
- Pickable [P] fallout (351): HEAL_BEAM.core thicker (healer_flight), CATAPULT_ARM.cocked lower (catapult_idle).
- Scratch probe: run scenarios on `node <web>/node_modules/vite/bin/vite.js preview` spawned without a shell (server.kill() works); npx+shell leaves vite alive on the port.
- Bash eats backslashes in heredoc/inline python: write patch scripts with the Write tool; unitVisuals.ts is CRLF. Never `git commit -a`. After any --iter capture rerun stats --batch <batch> --iter N.
