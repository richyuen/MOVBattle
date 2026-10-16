# Loop state
Iteration: 290   Last re-audit: 290   Consecutive rejects: 0   Branch: main

## Criteria (critic, PASS/FAIL per criterion; FAIL carries its closed blocker list and the count of approved [S] since the list was written)
battle-feel: a PASS b PASS c PASS d PASS (4/4)
unit-look: a PASS b PASS c PASS d PASS (4/4)
maps-light: a PASS b PASS c PASS d PASS (4/4)
ui-flow: a PASS b PASS c PASS d PASS (4/4)
camera: a PASS b PASS c PASS d PASS (4/4)
vfx: a PASS b PASS c PASS d PASS (4/4)
Tier 2 (fully scored at 198, re-audited 220-290):
battle-feel: e FAIL f PASS g PASS h PASS (3/4) (h cleared by [R] 065ba9e, 242)
- e FAIL (list rewritten by re-audit 285, kept 290) [S since: 1 (289 press-blow-follow-through 2bb3413); rejected since: 2 (286 press-blow-lands, 287 press-blow-lands rejected-kept)] B: 1 (club-up/club-hangs parts struck by 2bb3413) press_clubbers_hit: struck hoplite upright, board in the wall, nothing flung; right clubber crouched, club at hip. press_clubbers_blow: no hoplite knocked out of the file; he is pitched back ~40 deg, head thrown back, one arm flung out, but both feet still planted in the file — TABS r2c3 struck man thrown back off his feet, arms out; 2 big_melee_2s/2150ms/5s/9s: red clubbers 1-3 bodies behind their own front, clubs cocked forward over their own rank or flat at hip, none comes down on a blue board or head; 3 closeup_weapon_reads: red knights hold swords level or up before the chest, no blade over a shoulder, none meets a body — TABS r3c1 arm cocked well back over the shoulder. Ref trailer_3_sheet_01 r2c3, r3c1.
unit-look: e PASS f PASS g PASS h PASS (4/4) (h cleared by 810f6c6, 240)
maps-light: e PASS f PASS g PASS h PASS (4/4)
ui-flow: e PASS f PASS g PASS h PASS (4/4)
camera: e PASS f PASS g PASS h PASS (4/4)
vfx: e PASS f PASS g PASS h PASS (4/4)
Tier 3 (scored 240, re-audited 245-290; ours lineup_<faction> / biome_<map> / throw_<group>; refs factions/<f>, units/<f>.<id>, maps/<biome>):
unit-look tier 3: i-v all PASS (14/14) (cleared 242-269)
maps-light tier 3: i-o all PASS (7/7) (cleared 246-273)
vfx tier 3: i FAIL j FAIL k FAIL l FAIL m FAIL n PASS o PASS p FAIL (2/8) (first scored 281; o cleared by d930bf5, 287; n cleared by 5deb87c, 289)
- i spear_thrower [S since: 1 (281 7bff8d9)] B: struck 1-3; 4 held javelin a man-height pole, small blue tip; TABS a short javelin, big dark leaf head (units/tribal.spear_thrower.jpg)
- j harpooner [S since: 2 (285 09a194c, 290 harpoon-head 10b78d8)] B: struck 1-4 (10b78d8: dark iron leaf head, two swept barbs, short dark shaft, tie ring); 5 in throw_spears_harpoon the rope's tail runs past and below the muzzle to where the muzzle was at release, not tied to the gun; also gun reads pale grey, muzzle raised, not dark and low at the hip (units/pirate.harpooner.jpg). Minor: white streak beside the rope reads as two lines
- k stoner [S since: 1 (283 8cb65fc)] B: 1 holds a head-sized grey pebble in one raised hand; TABS a chest-sized faceted boulder in both hands at the waist (units/tribal.stoner.jpg); 2 a small smooth sphere flies (his own held rock), not the faceted boulder (throw_bombs_flight); struck 3; 4 a one-arm overarm toss, not the end of a two-hand heave from the waist
- l bomb_thrower [S since: 1 (282 e833fa3)] B: struck 1, 2; 3 the bomb in flight is the one he held, but head-sized and only one; TABS a fist-sized bomb in each hand, short fuse (units/pirate.bomb_thrower.jpg; ours throw_bombs_release)
- m dynamite_thrower [S since: 1 (284 345314d)] B: struck 1-3; 4 the bundle is a forearm-length 3-pack at the hip (lineup_wild_west), and in flight sticks and bands merge into one plain red cylinder, no lit spark at the fuse (throw_bombs_flight); TABS a hip-to-chest, near torso-wide bundle of distinct sticks, two broad black bands, glowing fuse (units/wild_west.dynamite_thrower.jpg)
- p swordcaster [S since: 1 (288 462b2dc)] B: struck 1 (462b2dc: glowing white sword, hangs .7 s over his head, then flies; throw_casters_flight shows it flying level); 2 holds a short dark hand sword at the hip, one sword at a time; TABS a dark lockbox chest in both hands at the belly, 5-6 blades standing point-up round him (units/spooky.swordcaster.jpg)
Total tier 1 24/24; tier 2 23/24; tier 3 23/29.

## Focus (every gap this iteration)
BASE 3fb7219 (iter 290, re-audit done: no flips, no regressions)
- [S] press-blow-off-feet (battle-feel.e blocker 1) — dropped at the look, uncommitted
- evidence: throw_spears_harpoon, the harpoon 64 ms off the muzzle — f3bfcff
- [S] harpoon-head (vfx.j blocker 2) — 10b78d8 — APPROVE (j.2 struck, j still FAIL)

## Last verdicts (one line per gap, verbatim critic header)
- GAP: [S] harpoon-head (10b78d8) VERDICT: APPROVE CRITERION: vfx.j FAIL (previous: FAIL); REGRESSIONS: none

## Ranked open gaps (max 8, tags and attempts in brackets; each clears a numbered blocker)
1. [S] battle-feel.e press-blow-off-feet [attempts: 1, dropped] — blocker 1: lift the struck board-man out of the file, feet off the ground, over backwards, arms out — ref trailer_3_sheet_01 r2c3 — ours press_clubbers_blow
2. [S] battle-feel.e clubber-close-step — blocker 2: a rear-rank clubber steps or lunges into contact range before the overhead blow, so the club comes down on a blue board or head — ref trailer_3_sheet_01 r2c3 — ours big_melee_2s
3. [S] battle-feel.e sword-shoulder-cock — blocker 3: one-hand sword windup cocks the blade back over the shoulder, then a committed diagonal cut that meets a body — ref trailer_3_sheet_01 r3c1 — ours closeup_weapon_reads
4. [S] vfx.j harpoon-rope-on-gun — blocker 5: rope start pinned to the muzzle's live world position every frame; gun dark and low at the hip, muzzle down-forward — ref units/pirate.harpooner.jpg — ours throw_spears_harpoon
5. [S] vfx.i short-javelin prop — blocker 4: javelin about .6 man-height with a big dark leaf head, held and in flight — ref units/tribal.spear_thrower.jpg — ours throw_spears_release
6. [S] vfx.k two-hand boulder — blockers 1/4: chest-sized faceted boulder in both hands at the waist, two-arm heave — ref units/tribal.stoner.jpg — ours throw_bombs_release
7. [S] vfx.p sword-chest prop — blocker 2: dark lockbox chest in both hands at the belly, ring of point-up blades round him — ref units/spooky.swordcaster.jpg — ours throw_casters_release
8. [S] vfx.m dynamite bundle — blocker 4: torso-wide bundle of distinct sticks, two broad black bands, glowing fuse spark, held and in flight — ref units/wild_west.dynamite_thrower.jpg — ours throw_bombs_flight

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- press-blow-off-feet [attempts: 1, dropped] — 290: unbraced/unsnapped the thrown man (isBlowThrown skip in _holdShieldFrames), wall men thrown -facing, root pitch .8 -> 1.35 while airborne. Probe: 1.35 rad, .4 m up at +128 ms, but no capture framing showed a laid-out body (lump among his file / behind the clubber)
- press-throw-airborne [attempts: 1, dropped] — 288: fixed min lift 4.4 / back 1.6 m/s on the blow throw; struck man hidden in both press shots
- press-blow-lands [attempts: 2, rejected-kept] — 287: non-topple blow throw (speed/lift x kb x shoveResponse, root pitch .8, THROWN pose); critic saw no hoplite airborne or arms-out. Code kept
- press-blow-lands [attempts: 1] — 286: forced blast topple (bypassing wallBraced) + fixed 1.8/1.4 throw on every heavy_swing land; regression battlefeel_shield_wall_vs_light_swarm (protector toppled)
- head-snap-under-crown [attempts: 1] — 283: triggerBuckle from staggerFromBlow as last overlay after flinch; hidden behind his own board / his file
- overhead-blow [attempts: 1, approved on 2nd at 280] — 279: fist only reached the striker's own head height. Critic: _aimBlow values are now spent
- [R] aimed-blow-final-layer [attempts: 1] — 278: club arrives level into the face from a low hand on the board rim, no visible recoil
- [R] target-aimed-blow [attempts: 1] — 277: critic saw clubs hip-high/upright on the shot frame, no hoplite recoil

## Notes for next iteration (max 5 lines)
- press_clubbers: the gap is evidence as much as mechanism. The hit log's x,z is the striker; the struck man is the outer-end hoplite (find him as y > .1 in render_game_to_text). He is thrown into a jumble of his own file and the clubber in every framing tried (outer end low/raised, behind). Clear a sight line first (e.g. a gallery variant with one hoplite, or the throw carrying him clear of the file), then shoot.
- Probe pattern: playwright via createRequire(loop/scripts/package.json), Chrome executablePath, vite preview on 4199, render_game_to_text units (x,y,z,airborne,battleFeelState); globalThis.__probe set from runtime code for joint values (remove before commit). Root pivot is at the feet.
- Casters: fireball and leaves pend to CAST_LOOSE from the staff head (boneStaff mesh id; never mark props via metadata). Swordcaster sword spawns over headTop, hovers SWORD_HOVER .7 s. Harpooner fires at swing start (+16 ms in gallery_throw_spears); throw_spears_harpoon catches it.
- Every other criterion PASS (274-290). mapBuilder.ts LF, LOG.md CRLF, projectileSystem.ts CRLF-sensitive for node replace (use Edit). Unit PBR colours grey out in shade: self-light. Glow: getGlowLayerByName("glow").addExcludedMesh.
- capture.mjs prunes output/loop iterations older than iter-10; `--only a,b` takes several shots. Melee: _tryAttack damages at swing start unless a heavy blow is pending. No [P] on rows approved within 20 iterations, except critic-named fallout.
