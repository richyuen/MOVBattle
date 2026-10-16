# Loop state
Iteration: 293   Last re-audit: 290   Consecutive rejects: 0   Branch: main

## Criteria (critic, PASS/FAIL per criterion; FAIL carries its closed blocker list and the count of approved [S] since the list was written)
battle-feel: a PASS b PASS c PASS d PASS (4/4)
unit-look: a PASS b PASS c PASS d PASS (4/4)
maps-light: a PASS b PASS c PASS d PASS (4/4)
ui-flow: a PASS b PASS c PASS d PASS (4/4)
camera: a PASS b PASS c PASS d PASS (4/4)
vfx: a PASS b PASS c PASS d PASS (4/4)
Tier 2 (fully scored at 198, re-audited 220-290):
battle-feel: e FAIL f PASS g PASS h PASS (3/4) (h cleared by [R] 065ba9e, 242)
- e FAIL plateau (3 rejected [S] since list; next pick on it is one [R]) (list rewritten by re-audit 285, kept 290) [S since: 2 (289 press-blow-follow-through 2bb3413, 291 press-blow-off-feet ba425b2); rejected since: 3 (286 press-blow-lands, 287 press-blow-lands rejected-kept, 293 press-second-rank-blow 01de458)] B: struck old 1 (ba425b2). 1 big_melee_2s/2150ms/5s/9s: red clubbers 1-3 bodies behind their own front never bring a club down on a blue board or head: at 2s/2150ms rear clubs stand upright or cocked back over the shoulder; at 5s one club runs level into a blue board at chest height, one points up; 2 closeup_weapon_reads: red knights hold swords level or up before the chest, no blade over a shoulder, none meets a body — TABS r3c1 arm cocked well back over the shoulder. Ref trailer_3_sheet_01 r2c3, r3c1. Minor: the thrown man goes over head-first; TABS r2c3 goes back seat-first, legs swinging up
unit-look: e PASS f PASS g PASS h PASS (4/4) (h cleared by 810f6c6, 240)
maps-light: e PASS f PASS g PASS h PASS (4/4)
ui-flow: e PASS f PASS g PASS h PASS (4/4)
camera: e PASS f PASS g PASS h PASS (4/4)
vfx: e PASS f PASS g PASS h PASS (4/4)
Tier 3 (scored 240, re-audited 245-290; ours lineup_<faction> / biome_<map> / throw_<group>; refs factions/<f>, units/<f>.<id>, maps/<biome>):
unit-look tier 3: i-v all PASS (14/14) (cleared 242-269)
maps-light tier 3: i-o all PASS (7/7) (cleared 246-273)
vfx tier 3: i PASS j FAIL k PASS l PASS m FAIL n PASS o PASS p FAIL (5/8) (first scored 281; o cleared by d930bf5, 287; n cleared by 5deb87c, 289; i cleared by 2dedac6, 291; k cleared by a73812a, 292; l cleared by b22b07e, 293)
- j harpooner [S since: 2 (285 09a194c, 290 harpoon-head 10b78d8)] B: struck 1-4 (10b78d8: dark iron leaf head, two swept barbs, short dark shaft, tie ring); 5 in throw_spears_harpoon the rope's tail runs past and below the muzzle to where the muzzle was at release, not tied to the gun; also gun reads pale grey, muzzle raised, not dark and low at the hip (units/pirate.harpooner.jpg). Minor: white streak beside the rope reads as two lines
- m dynamite_thrower [S since: 1 (284 345314d)] B: struck 1-3; 4 the bundle is a forearm-length 3-pack at the hip (lineup_wild_west), and in flight sticks and bands merge into one plain red cylinder, no lit spark at the fuse (throw_bombs_flight); TABS a hip-to-chest, near torso-wide bundle of distinct sticks, two broad black bands, glowing fuse (units/wild_west.dynamite_thrower.jpg)
- p swordcaster [S since: 1 (288 462b2dc)] B: struck 1 (462b2dc: glowing white sword, hangs .7 s over his head, then flies; throw_casters_flight shows it flying level); 2 holds a short dark hand sword at the hip, one sword at a time; TABS a dark lockbox chest in both hands at the belly, 5-6 blades standing point-up round him (units/spooky.swordcaster.jpg)
Total tier 1 24/24; tier 2 23/24; tier 3 26/29.

## Focus (every gap this iteration)
BASE 10e035e (iter 293)
- [S] press-second-rank-blow (battle-feel.e blocker 1) — 01de458 — REJECT (reverted 5d83af5)
- [S] bomb-pair-fist-size (vfx.l blocker 3) — b22b07e — APPROVE (vfx.l flips PASS)

## Last verdicts (one line per gap, verbatim critic header)
- GAP: [S] press-second-rank-blow (01de458) VERDICT: REJECT CRITERION: battle-feel.e FAIL (previous: FAIL)
- GAP: [S] bomb-pair-fist-size (b22b07e) VERDICT: APPROVE CRITERION: vfx.l PASS (previous: FAIL); REGRESSIONS: none

## Ranked open gaps (max 8, tags and attempts in brackets; each clears a numbered blocker)
1. [R] battle-feel.e press-blow-rebuild (criterion plateau) — blockers 1+2: one rebuild of the melee blow from a spec: rear clubbers bring the club down over their front man onto the blue board or head (r2c3), knights cock the blade back over the shoulder and cut down onto a body (r3c1) — ref trailer_3_sheet_01 r2c3, r3c1 — ours big_melee_2150ms, closeup_weapon_reads
2. [S] vfx.j harpoon-rope-tied — blocker 5: rope tail anchored to the gun muzzle every frame; gun dark and carried low at the hip — ref units/pirate.harpooner.jpg — ours throw_spears_harpoon
3. [S] vfx.m dynamite-bundle — blocker 4: hip-to-chest, near torso-wide bundle of distinct sticks, two broad black bands, glowing fuse spark that flies with it — ref units/wild_west.dynamite_thrower.jpg — ours lineup_wild_west, throw_bombs_flight
4. [S] vfx.p swordcaster-chest — blocker 2: dark lockbox chest in both hands at the belly, 5-6 blades point-up round him launched one by one — ref units/spooky.swordcaster.jpg — ours throw_casters_release
(critic's ranked [S] press-over-rank-strike and knight-overhead-windup fold into the [R] while e is plateau)

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- press-second-rank-blow [attempts: 1] — 293: over-rank pending blow (REAR_RANK_REACH band + _allyBetween, damage .35) + BLOW_STEP 1.3 hip lunge in _aimBlow; critic: no shot shows a club landing over a rank; 2150ms rear clubs upright/cocked, 5s one club level into a board. Critic: gate on the ally lane out to two bodies, not the distance band
- press-blow-in-crowd [attempts: 1, dropped] — 292: shield-wall break where a board-less melee man stands in the row (_manInRow) + queue skip for men level with the boards; red line advanced slower, rank-1 clubbers still >1 m behind protectors at 3500 ms, few in engage
- press-blow-off-feet [attempts: 1, dropped; approved on 2nd at 291] — 290: no capture framing showed the laid-out body. Real cause found 291: blow-lean sign laid him forward onto the striker, and the wall's slot snap held him in the file
- press-throw-airborne [attempts: 1, dropped] — 288: fixed min lift 4.4 / back 1.6 m/s on the blow throw; struck man hidden in both press shots
- press-blow-lands [attempts: 2, rejected-kept] — 287: non-topple blow throw (speed/lift x kb x shoveResponse, root pitch .8, THROWN pose); critic saw no hoplite airborne or arms-out. Code kept
- press-blow-lands [attempts: 1] — 286: forced blast topple (bypassing wallBraced) + fixed 1.8/1.4 throw on every heavy_swing land; regression battlefeel_shield_wall_vs_light_swarm (protector toppled)
- head-snap-under-crown [attempts: 1] — 283: triggerBuckle from staggerFromBlow as last overlay after flinch; hidden behind his own board / his file
- overhead-blow [attempts: 1, approved on 2nd at 280] — 279: fist only reached the striker's own head height. Critic: _aimBlow values are now spent

## Notes for next iteration (max 5 lines)
- battle-feel.e plateau: [R] next. 293 probe: in big_melee most red clubbers sit 0-2.3 m outside engage with an ally between and only play the visual _pressBlow beat (never _tryAttack); over-rank blows landed 45x vs 11 front but at shot times clubs read upright. Spec the [R] so the club-down share of the beat is high when shot (r2c3), not only at the land frame.
- Probe pattern: playwright via createRequire(loop/scripts/package.json), Chrome executablePath, vite preview on 4199 (build first), window.game.getHitLog(); globalThis counters in sim code for gates (remove before commit). hitLog impact x/z is stale (sim steps without render).
- Casters: fireball and leaves pend to CAST_LOOSE from the staff head; swordcaster sword hovers .7 s over headTop. Thrown props are copies of the held prop (_buildHeldMissile). Two-hand pattern: stoner _carryBoulder; config.offhandWeapon puts a second prop in the left hand (bomb pair, seatInFist).
- Every other criterion PASS (274-293). mapBuilder.ts LF, LOG.md CRLF, projectileSystem.ts CRLF-sensitive for node replace (use Edit). Unit PBR colours grey out in shade: self-light. Glow: getGlowLayerByName("glow").addExcludedMesh.
- capture.mjs prunes output/loop iterations older than iter-10; `--only a,b` takes several shots. Melee: _tryAttack damages at swing start unless a heavy blow is pending. No [P] on rows approved within 20 iterations, except critic-named fallout.
