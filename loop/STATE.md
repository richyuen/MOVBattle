# Loop state
Iteration: 289   Last re-audit: 285   Consecutive rejects: 0   Branch: main

## Criteria (critic, PASS/FAIL per criterion; FAIL carries its closed blocker list and the count of approved [S] since the list was written)
battle-feel: a PASS b PASS c PASS d PASS (4/4)
unit-look: a PASS b PASS c PASS d PASS (4/4)
maps-light: a PASS b PASS c PASS d PASS (4/4)
ui-flow: a PASS b PASS c PASS d PASS (4/4)
camera: a PASS b PASS c PASS d PASS (4/4)
vfx: a PASS b PASS c PASS d PASS (4/4)
Tier 2 (fully scored at 198, re-audited 220-285):
battle-feel: e FAIL f PASS g PASS h PASS (3/4) (h cleared by [R] 065ba9e, 242)
- e FAIL (list rewritten by re-audit 285) [S since: 1 (289 press-blow-follow-through 2bb3413); rejected since: 2 (286 press-blow-lands, 287 press-blow-lands rejected-kept)] B: 1 (club-up and club-hangs parts struck by 2bb3413: club now driven down, ends low at the shins, striker pitched into it) press_clubbers_hit: the struck hoplite stays upright, board in the wall, nothing flung; the right clubber crouches, club at the hip. press_clubbers_blow: no hoplite knocked out of the file, he still stands in it arms forward (the 4.4 lift floor shows in no shot) — TABS r2c3 struck man thrown back off his feet, arms out; 2 big_melee_2s/2150ms/5s/9s: red clubbers 1-3 bodies behind their own front, clubs cocked forward over their own rank or flat at hip, none comes down on a blue board or head; 3 closeup_weapon_reads: red knights hold swords level or up before the chest, no blade over a shoulder, none meets a body — TABS r3c1 arm cocked well back over the shoulder. Ref trailer_3_sheet_01 r2c3, r3c1.
unit-look: e PASS f PASS g PASS h PASS (4/4) (h cleared by 810f6c6, 240)
maps-light: e PASS f PASS g PASS h PASS (4/4)
ui-flow: e PASS f PASS g PASS h PASS (4/4)
camera: e PASS f PASS g PASS h PASS (4/4)
vfx: e PASS f PASS g PASS h PASS (4/4)
Tier 3 (scored 240, re-audited 245-285; ours lineup_<faction> / biome_<map> / throw_<group>; refs factions/<f>, units/<f>.<id>, maps/<biome>):
unit-look tier 3: i-v all PASS (14/14) (cleared 242-269)
maps-light tier 3: i-o all PASS (7/7) (cleared 246-273)
vfx tier 3: i FAIL j FAIL k FAIL l FAIL m FAIL n PASS o PASS p FAIL (2/8) (first scored 281; o cleared by d930bf5, 287; n cleared by 5deb87c, 289)
- i spear_thrower [S since: 1 (281 7bff8d9)] B: struck 1-3; 4 held javelin a man-height pole, small blue tip; TABS a short javelin, big dark leaf head (units/tribal.spear_thrower.jpg)
- j harpooner [S since: 1 (285 harpoon-gun 09a194c)] B: struck 1, 3, 4 (09a194c: gun prop, missile from its muzzle, dark rope); 2 flies the generic thin blue-tipped spear; TABS a heavy dark barbed harpoon head on a short shaft; 5 (added by 09a194c) in throw_spears_flight the rope's start hangs where the muzzle was at release (~170 px above the gun, now at the hip) instead of following the gun; also gun reads pale grey, raised muzzle-up to head height, not blue and low at the hip (units/pirate.harpooner.jpg)
- k stoner [S since: 1 (283 8cb65fc)] B: 1 holds a head-sized grey pebble in one raised hand; TABS a chest-sized faceted boulder in both hands at the waist (units/tribal.stoner.jpg); 2 a small smooth sphere flies (his own held rock), not the faceted boulder (throw_bombs_flight); struck 3; 4 a one-arm overarm toss, not the end of a two-hand heave from the waist
- l bomb_thrower [S since: 1 (282 e833fa3)] B: struck 1, 2; 3 the bomb in flight is the one he held, but head-sized and only one; TABS a fist-sized bomb in each hand, short fuse (units/pirate.bomb_thrower.jpg; ours throw_bombs_release)
- m dynamite_thrower [S since: 1 (284 345314d)] B: struck 1-3; 4 the bundle is a forearm-length 3-pack at the hip (lineup_wild_west), and in flight sticks and bands merge into one plain red cylinder, no lit spark at the fuse (throw_bombs_flight); TABS a hip-to-chest, near torso-wide bundle of distinct sticks, two broad black bands, glowing fuse (units/wild_west.dynamite_thrower.jpg)
- p swordcaster [S since: 1 (288 462b2dc)] B: struck 1 (462b2dc: glowing white sword, dark guard/grip, hangs .7 s over his head point-on, then flies); 2 holds a short dark hand sword at the hip, one sword at a time; TABS a dark lockbox chest in both hands at the belly, 5-6 blades standing point-up round him (units/spooky.swordcaster.jpg); note: keyhole too small to read, the shot pair shows only the hover, never the flight
Total tier 1 24/24; tier 2 23/24; tier 3 23/29.

## Focus (every gap this iteration)
BASE fe49dc0 (iter 289)
- evidence: casters gallery spread (spacing 2.4, alpha pi/2-.7, radius 7.5) so the bone mage clears the wizard's hat — f28a302
- evidence: press_clubbers_blow camera low on the struck man's outer flank — 77a7e6f
- [S] bone-mage-staff-raise (vfx.n blocker 2) — 5deb87c — APPROVE (n PASS)
- [S] press-blow-follow-through (battle-feel.e blocker 1) — 2bb3413 — APPROVE (e.1 club parts struck, e still FAIL)

## Last verdicts (one line per gap, verbatim critic header)
- GAP: [S] bone-mage-staff-raise (5deb87c) VERDICT: APPROVE CRITERION: vfx.n PASS (previous: FAIL)
- GAP: [S] press-blow-follow-through (2bb3413) VERDICT: APPROVE CRITERION: battle-feel.e FAIL (previous: FAIL); REGRESSIONS: none

## Ranked open gaps (max 8, tags and attempts in brackets; each clears a numbered blocker)
1. [S] battle-feel.e press-blow-throw-free — blocker 1: release the struck hoplite from the wall's press hold on the hit frame so he is visibly thrown back and up, board flung — ref trailer_3_sheet_01 r2c3 — ours press_clubbers_blow
2. [S] battle-feel.e crowd-clubber-blow — blocker 2: big_melee red clubbers step through to the front and bring the overhead blow down on a blue board or head — ref trailer_3_sheet_01 r2c3 — ours big_melee_2s
3. [S] vfx.p swordcaster-lockbox — blocker 2: dark lockbox chest in both hands at the belly, 5-6 blades standing point-up round him, in place of the hand sword — ref units/spooky.swordcaster.jpg — ours throw_casters_release
4. [S] vfx.k stoner-two-hand-boulder — blockers 1/2/4: chest-sized faceted boulder in both hands at the waist, two-hand heave, same mesh flies — ref units/tribal.stoner.jpg — ours throw_bombs_release
5. [S] vfx.m dynamite-bundle — blocker 4: near torso-wide bundle of distinct sticks, two black bands, glowing fuse spark kept in flight — ref units/wild_west.dynamite_thrower.jpg — ours throw_bombs_flight
6. [S] vfx.j harpoon-head-rope — blockers 2/5: heavy dark barbed harpoon head on a short shaft, rope anchored to the gun's live muzzle; gun blue and low at the hip — ref units/pirate.harpooner.jpg — ours throw_spears_flight
7. [S] vfx.i javelin-leaf-head — blocker 4: short javelin with a big dark leaf head instead of the man-height pole — ref units/tribal.spear_thrower.jpg — ours throw_spears_release
8. [S] vfx.l twin-fist-bombs — blocker 3: fist-sized bomb in each hand, short fuse, instead of one head-sized bomb — ref units/pirate.bomb_thrower.jpg — ours throw_bombs_release

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- press-throw-airborne [attempts: 1, dropped] — 288: fixed min lift 4.4 / back 1.6 m/s on the blow throw; struck man hidden in both press shots. (289 landed the same floor inside press-blow-follow-through, approved, but the critic still sees nobody flung)
- press-blow-lands [attempts: 2, rejected-kept] — 287: non-topple blow throw (speed/lift x kb x shoveResponse, root pitch .8, THROWN arms-out/legs-swept pose); critic saw no hoplite airborne or arms-out in any press shot. Code kept
- press-blow-lands [attempts: 1] — 286: forced blast topple (bypassing wallBraced) + fixed 1.8/1.4 throw on every heavy_swing land; regression battlefeel_shield_wall_vs_light_swarm (protector toppled)
- head-snap-under-crown [attempts: 1] — 283: triggerBuckle from staggerFromBlow as last overlay after flinch; hidden behind his own board / his file
- overhead-blow [attempts: 1, approved on 2nd at 280] — 279: fist only reached the striker's own head height. Critic: _aimBlow values are now spent
- [R] aimed-blow-final-layer [attempts: 1] — 278: club arrives level into the face from a low hand on the board rim, no visible recoil
- [R] target-aimed-blow [attempts: 1] — 277: critic saw clubs hip-high/upright on the shot frame, no hoplite recoil

## Notes for next iteration (max 5 lines)
- 289 probe: the struck hoplite in press_clubbers is the outer-end man (z ~ -1.3); before the throw he is crouched (head top .83 m); the 4.4 floor lifts him .37 m by +128 ms but he moves back only .04 m (wall/collision eats the 1.6 m/s) and THROWN arms-out does not read: free him from the wall press on the hit frame. Probe script pattern: playwright via createRequire(loop/scripts/package.json), Chrome executablePath, vite preview on port 4199, read render_game_to_text units (x,y,z,airborne,battleFeelState).
- Casters: wizard fireball and bone mage leaves both pend to CAST_LOOSE from the staff head (boneStaff mesh id marks the overhead cast; unitFactory overwrites mesh metadata, so never mark props via metadata). Swordcaster sword spawns at cast start over headTop and hovers SWORD_HOVER .7 s.
- Every other criterion PASS (274-289). mapBuilder.ts LF, LOG.md CRLF, projectileSystem.ts CRLF-sensitive for node replace (use Edit). Unit PBR colours grey out in shade: self-light. Glow: getGlowLayerByName("glow").addExcludedMesh.
- capture.mjs prunes output/loop iterations older than iter-10: never use a scratch --iter number above the real one. `--only a,b` takes several shots.
- Melee hit path: _tryAttack applies damage at swing start unless a heavy blow is pending. No [P] on rows approved within 20 iterations, except fallout named by the critic.
