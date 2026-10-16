# Loop state
Iteration: 292   Last re-audit: 290   Consecutive rejects: 0   Branch: main

## Criteria (critic, PASS/FAIL per criterion; FAIL carries its closed blocker list and the count of approved [S] since the list was written)
battle-feel: a PASS b PASS c PASS d PASS (4/4)
unit-look: a PASS b PASS c PASS d PASS (4/4)
maps-light: a PASS b PASS c PASS d PASS (4/4)
ui-flow: a PASS b PASS c PASS d PASS (4/4)
camera: a PASS b PASS c PASS d PASS (4/4)
vfx: a PASS b PASS c PASS d PASS (4/4)
Tier 2 (fully scored at 198, re-audited 220-290):
battle-feel: e FAIL f PASS g PASS h PASS (3/4) (h cleared by [R] 065ba9e, 242)
- e FAIL (list rewritten by re-audit 285, kept 290) [S since: 2 (289 press-blow-follow-through 2bb3413, 291 press-blow-off-feet ba425b2); rejected since: 2 (286 press-blow-lands, 287 press-blow-lands rejected-kept)] B: struck old 1 (ba425b2: struck hoplite thrown out of his file, off his feet, board flung, arms out, in press_clubbers_hit and _blow). Renumbered: 1 big_melee_2s/2150ms/5s/9s: red clubbers 1-3 bodies behind their own front, clubs cocked forward over their own rank or flat at hip, none comes down on a blue board or head; 2 closeup_weapon_reads: red knights hold swords level or up before the chest, no blade over a shoulder, none meets a body — TABS r3c1 arm cocked well back over the shoulder. Ref trailer_3_sheet_01 r2c3, r3c1. Minor: the thrown man goes over head-first; TABS r2c3 goes back seat-first, legs swinging up
unit-look: e PASS f PASS g PASS h PASS (4/4) (h cleared by 810f6c6, 240)
maps-light: e PASS f PASS g PASS h PASS (4/4)
ui-flow: e PASS f PASS g PASS h PASS (4/4)
camera: e PASS f PASS g PASS h PASS (4/4)
vfx: e PASS f PASS g PASS h PASS (4/4)
Tier 3 (scored 240, re-audited 245-290; ours lineup_<faction> / biome_<map> / throw_<group>; refs factions/<f>, units/<f>.<id>, maps/<biome>):
unit-look tier 3: i-v all PASS (14/14) (cleared 242-269)
maps-light tier 3: i-o all PASS (7/7) (cleared 246-273)
vfx tier 3: i PASS j FAIL k PASS l FAIL m FAIL n PASS o PASS p FAIL (4/8) (first scored 281; o cleared by d930bf5, 287; n cleared by 5deb87c, 289; i cleared by 2dedac6, 291; k cleared by a73812a, 292)
- j harpooner [S since: 2 (285 09a194c, 290 harpoon-head 10b78d8)] B: struck 1-4 (10b78d8: dark iron leaf head, two swept barbs, short dark shaft, tie ring); 5 in throw_spears_harpoon the rope's tail runs past and below the muzzle to where the muzzle was at release, not tied to the gun; also gun reads pale grey, muzzle raised, not dark and low at the hip (units/pirate.harpooner.jpg). Minor: white streak beside the rope reads as two lines
- l bomb_thrower [S since: 1 (282 e833fa3)] B: struck 1, 2; 3 the bomb in flight is the one he held, but head-sized and only one; TABS a fist-sized bomb in each hand, short fuse (units/pirate.bomb_thrower.jpg; ours throw_bombs_release)
- m dynamite_thrower [S since: 1 (284 345314d)] B: struck 1-3; 4 the bundle is a forearm-length 3-pack at the hip (lineup_wild_west), and in flight sticks and bands merge into one plain red cylinder, no lit spark at the fuse (throw_bombs_flight); TABS a hip-to-chest, near torso-wide bundle of distinct sticks, two broad black bands, glowing fuse (units/wild_west.dynamite_thrower.jpg)
- p swordcaster [S since: 1 (288 462b2dc)] B: struck 1 (462b2dc: glowing white sword, hangs .7 s over his head, then flies; throw_casters_flight shows it flying level); 2 holds a short dark hand sword at the hip, one sword at a time; TABS a dark lockbox chest in both hands at the belly, 5-6 blades standing point-up round him (units/spooky.swordcaster.jpg)
Total tier 1 24/24; tier 2 23/24; tier 3 25/29.

## Focus (every gap this iteration)
BASE 97368e1 (iter 292)
- [S] press-blow-in-crowd (battle-feel.e blocker 1) — dropped uncommitted (probe: red rank-1 clubbers still trail the protector wall >1 m at 3500 ms)
- [S] stoner-two-hand-boulder (vfx.k blockers 1/2/4) — a73812a — APPROVE (vfx.k flips PASS)

## Last verdicts (one line per gap, verbatim critic header)
- GAP: [S] stoner-two-hand-boulder (a73812a) VERDICT: APPROVE CRITERION: vfx.k PASS (previous: FAIL); REGRESSIONS: none

## Ranked open gaps (max 8, tags and attempts in brackets; each clears a numbered blocker)
1. [S] battle-feel.e press-second-rank-blow [press-blow-in-crowd attempts: 1, dropped] — blocker 1: red clubbers 1-3 bodies behind their front close in and bring a cocked club down onto a blue board or head (overhead blow at a man in the enemy front rank, over their own rank) — ref trailer_3_sheet_01 r2c3 — ours big_melee_2s
2. [S] battle-feel.e knight-shoulder-windup — blocker 2: knight windup with the blade cocked back over the shoulder, then a committed swing that meets a body — ref trailer_3_sheet_01 r3c1 — ours closeup_weapon_reads
3. [S] vfx.l bomb-pair-fist-size — blocker 3: a fist-sized round bomb with short fuse in each hand; one flies at that size, the other stays for the next throw — ref units/pirate.bomb_thrower.jpg — ours throw_bombs_release/_flight
4. [S] vfx.m dynamite-bundle — blocker 4: near torso-wide bundle of distinct sticks hip to chest, two broad black bands, glowing fuse spark lit in flight — ref units/wild_west.dynamite_thrower.jpg — ours lineup_wild_west / throw_bombs_flight
5. [S] vfx.p swordcaster-lockbox — blocker 2: dark lockbox in both hands at the belly, 5-6 blades point-up round him (hand sword removed) — ref units/spooky.swordcaster.jpg — ours throw_casters_flight
6. [S] vfx.j harpoon-rope-anchor — blocker 5: rope tail tied to the gun muzzle every frame; gun dark and low at the hip — ref units/pirate.harpooner.jpg — ours throw_spears_harpoon

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- press-blow-in-crowd [attempts: 1, dropped] — 292: shield-wall break where a board-less melee man stands in the row (_manInRow) + queue skip for men level with the boards; red line advanced slower, rank-1 clubbers still >1 m behind protectors at 3500 ms, few in engage
- press-blow-off-feet [attempts: 1, dropped; approved on 2nd at 291] — 290: no capture framing showed the laid-out body. Real cause found 291: blow-lean sign laid him forward onto the striker, and the wall's slot snap held him in the file
- press-throw-airborne [attempts: 1, dropped] — 288: fixed min lift 4.4 / back 1.6 m/s on the blow throw; struck man hidden in both press shots
- press-blow-lands [attempts: 2, rejected-kept] — 287: non-topple blow throw (speed/lift x kb x shoveResponse, root pitch .8, THROWN pose); critic saw no hoplite airborne or arms-out. Code kept
- press-blow-lands [attempts: 1] — 286: forced blast topple (bypassing wallBraced) + fixed 1.8/1.4 throw on every heavy_swing land; regression battlefeel_shield_wall_vs_light_swarm (protector toppled)
- head-snap-under-crown [attempts: 1] — 283: triggerBuckle from staggerFromBlow as last overlay after flinch; hidden behind his own board / his file
- overhead-blow [attempts: 1, approved on 2nd at 280] — 279: fist only reached the striker's own head height. Critic: _aimBlow values are now spent
- [R] aimed-blow-final-layer [attempts: 1] — 278: club arrives level into the face from a low hand on the board rim, no visible recoil

## Notes for next iteration (max 5 lines)
- big_melee: sim time ~ half of advanceTime (lines meet x~0 near 5 s). Clubbers stall: red protectors wall up and _keepRanksDeep's queue (no depth guard, along>=-0.05) sweeps level clubbers back a body; red then marches at wall pace. In engage, clubbers are mostly staggered (canAttack false); cohesion multiplier is not the hold (~.96). Cause of the slow red march still unknown (crowd jam? 0.6 m z spacing < body).
- Probe pattern: playwright via createRequire(loop/scripts/package.json), Chrome executablePath, vite preview on 4199 (build first), render_game_to_text units (x,z there differ from sim positions); globalThis counters in sim code for gates (remove before commit). press_clubbers_blow frames the struck man live.
- Casters: fireball and leaves pend to CAST_LOOSE from the staff head; swordcaster sword hovers .7 s over headTop. Thrown props are copies of the held prop (_buildHeldMissile). Stoner: _carryBoulder overlay sets the boulder at the hands' midpoint (two-hand pattern reusable for lockbox/bomb pair).
- Every other criterion PASS (274-292). mapBuilder.ts LF, LOG.md CRLF, projectileSystem.ts CRLF-sensitive for node replace (use Edit). Unit PBR colours grey out in shade: self-light. Glow: getGlowLayerByName("glow").addExcludedMesh.
- capture.mjs prunes output/loop iterations older than iter-10; `--only a,b` takes several shots. Melee: _tryAttack damages at swing start unless a heavy blow is pending. No [P] on rows approved within 20 iterations, except critic-named fallout.
