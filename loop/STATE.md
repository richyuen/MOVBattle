# Loop state (v2: one batch at a time, up to 5 structural gaps per iteration)
Iteration: 329   Batch: renaissance (2/18)   Consecutive empty: 0   Done: 7/139   Parked: 0
Batches, in order: tribal, renaissance, farmer, medieval, ancient, viking, dynasty, pirate, spooky, wild_west, legacy_1, legacy_2, good, evil, secret_1, secret_2, secret_3, secret_4

## Scoreboard (a b c d as + pass, - fail, ? unscored; status q queued, o open, D done, p parked)
tribal: clubber ++++ D | protector ++++ D | spear_thrower ++++ D | stoner ++++ D | bone_mage ++++ D | chieftain ++++ D | mammoth ++++ D
renaissance: painter ---+ o | fencer ---+ o | balloon_archer ---+ o | musketeer ---+ o | halberd ---+ o | jouster ---+ o | da_vinci_tank ---+ o
farmer: halfling ???? q | farmer ???? q | hay_baler ???? q | potion_seller ???? q | harvester ???? q | wheelbarrow ???? q | scarecrow ???? q
medieval: bard ???? q | squire ???? q | archer ???? q | healer ???? q | knight ???? q | catapult ???? q | king ???? q
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
329 (BASE 9e3e957): [S] halberd b two-handed grip 0f6980a + db2d934 approved | [S] musketeer b two-handed carry f4cff29 approved | [P] painter b palette out a8a09e2 rejected (reverted) | [S] jouster b heater shield fa71e96 + 9cb619c approved | [S] balloon_archer b longbow ea71dc1 + c2aff34 approved | [S] da_vinci_tank c cannonball 495e7d1 approved. 5/6, no regressions.
328 (BASE 3b4c2c2): 6/6 approved (fencer back slab, halberd sallet, musketeer musket, painter palette + brush girth, jouster lance).

## Last verdicts (critic header lines verbatim)
- GAP: [S] renaissance.halberd (0f6980a + db2d934) VERDICT: APPROVE CRITERION: renaissance.halberd.b FAIL (previous: FAIL) BLOCKERS: 2 not struck (half-cleared).
- GAP: [S] renaissance.musketeer (f4cff29) VERDICT: APPROVE CRITERION: renaissance.musketeer.b FAIL (previous: FAIL) BLOCKERS: 2 not struck (one-handed half cleared, upright carry remains).
- GAP: [P] renaissance.painter (a8a09e2) VERDICT: REJECT CRITERION: renaissance.painter.b FAIL (previous: FAIL) BLOCKERS: 3.
- GAP: [S] renaissance.jouster (fa71e96 + 9cb619c) VERDICT: APPROVE CRITERION: renaissance.jouster.b FAIL (previous: FAIL) BLOCKERS: struck: 2. added: 3.
- GAP: [S] renaissance.balloon_archer (ea71dc1 + c2aff34) VERDICT: APPROVE CRITERION: renaissance.balloon_archer.b FAIL (previous: FAIL) BLOCKERS: struck: 1. added: 2.
- GAP: [S] renaissance.da_vinci_tank (495e7d1) VERDICT: APPROVE CRITERION: renaissance.da_vinci_tank.c FAIL (previous: FAIL) BLOCKERS: struck: 1. remaining: 2.
- REGRESSIONS: none. d PASS 7/7 (stats 329).

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
- fencer had no pick in 329 (ranked: lunge c, cup hilt b, hair a). Fallout [P]s open: balloon_archer LONGBOW long/thick, jouster HEATER size/upright, musketeer MUSKET long/bore.
- LEDGER sits at ~13980/14000 bytes: trim old earlier-values notes before adding rows.
- _offArmTo (shared off-arm solve) is ~20 deg off analytically; pass settle 2 for new callers. A prop child of a hand: probe in-page (spawnUnit + world matrices) before trusting a look shot.
- One-handed props: the hand +y runs up the forearm. Shield turns go in shield.rotation (Euler); the shield layer rebuilds its rest from it.
- After any --iter capture rerun stats --batch <batch> --iter N. capture.mjs --units takes a comma list. Never put a bare cat > file in a command.
