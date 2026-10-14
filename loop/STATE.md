# Loop state
Iteration: 238   Last re-audit: 235   Consecutive rejects: 0   Branch: main

## Criteria (critic, PASS/FAIL per criterion; FAIL carries its closed blocker list and the count of approved [S] since the list was written)
battle-feel: a PASS b PASS c PASS d PASS (4/4)
unit-look: a PASS b PASS c PASS d PASS (4/4)
maps-light: a PASS b PASS c PASS d PASS (4/4)
ui-flow: a PASS b PASS c PASS d PASS (4/4)
camera: a PASS b PASS c PASS d PASS (4/4)
vfx: a PASS b PASS c PASS d PASS (4/4)
Tier 2 (fully scored at 198, re-audited 220, 225, 230, 235):
battle-feel: e FAIL f PASS g PASS h FAIL (2/4)
- e FAIL plateau (rewritten 235; until an [R] is judged) [S since: 0, rejected since: 0] B: 1 none of the 4 blue clubs meets a red board or head (level past the heap, head on the ground, shouldered, planted at the front man's feet); no red man recoils — press_clubbers_side; 2 red clubbers 1-3 bodies behind their own spear front, clubs level at the shoulder or cocked upright (three in 9s) or dragged low; none reaches a blue board — big_melee_2s, 2150ms, 9s; 3 red knight swords upright over the helm or level across the chest, no blade meets a body — closeup_weapon_reads. Ref trailer_3_sheet_01 r2c3, r3c1.
- h FAIL plateau (rewritten 235) [S since: 4, rejected since: 0] B: 2 red front boards scattered a little (238) but all still lean the same way within ~7 deg, one depth on the strip, rims abut instead of lapping — shield_wall_front; 3 heads bowed so only helmet domes show over the rims, no face above any board (red wall men are tribal.protector in bone_mask, oversized grey spheres) — shield_wall_front. (1 struck 237) Ref tabs_screenshot_06.
unit-look: e PASS f PASS g PASS h FAIL (3/4)
- h FAIL [S since: 0, rejected since: 1] B: 2 the green and yellow "cones" in lineup_medieval are hood_liripipe hoods (medieval.archer, pitchfork peasant), not conical_hat: they read as brimless cones perched on the skull, no cowl down the back of the head (reword at the 240 re-audit) — lineup_medieval. (1 struck 233) Ref tabs_screenshot_05, 06, 04.
maps-light: e PASS f PASS g PASS h PASS (4/4)
ui-flow: e PASS f PASS g PASS h PASS (4/4)
camera: e PASS f PASS g PASS h PASS (4/4)
vfx: e PASS f PASS g PASS h PASS (4/4)
Total tier 1 24/24; tier 2 21/24.

## Focus (every gap this iteration)
BASE 74bfe7c (one gap: the pair rule left one [S] criterion)
- [S] battle-feel.h wall-board-lean (cffd2d0) — APPROVE, no strike (heights and turns now vary; still one shared lean and one depth)

## Last verdicts (one line per gap, verbatim critic header)
- GAP: [S] wall-board-lean (cffd2d0) VERDICT: APPROVE CRITERION: battle-feel.h FAIL (previous: FAIL)

## Ranked open gaps (max 8, tags and attempts in brackets; each clears a numbered blocker)
1. [R] battle-feel.h wall-surface (plateau; or wait for the 240 re-audit) [0] — absorbs: [S] wall-board-depth-stagger — blocker 2: seeded fore/aft board stagger (~a board's thickness) plus a face-on/edge-on turn class per man, rims lapping over one another — ref tabs_screenshot_06 — ours shield_wall_front
2. [S] battle-feel.h wall-face-over-rim [0] — blocker 3: tribal.protector bone_mask shrunk/fitted and the head lifted so eyes show above each rim — ref tabs_screenshot_06 — ours shield_wall_front
3. [S] unit-look.h hood-cowl [0] — blocker 2: hood_liripipe cowl wedge down the back of the skull to the nape — ref tabs_screenshot_04 — ours lineup_medieval
4. [S] unit-look.h hood-liripipe-tail [0] — blocker 2: hanging liripipe tail off the hood crown — ref tabs_screenshot_05 — ours lineup_medieval
5. [R] battle-feel.e melee-strike rebuild [0] — plateau, blockers 1-3: target-seeking strike from a written spec (windup aimed at the foe, committed arc ending in contact, recoil) — ref trailer_3_sheet_01 r2c3, r3c1 — ours press_clubbers_side, closeup_weapon_reads, big_melee_2s

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- archer-brim [attempts: 1, dropped] — 237: the lineup cones are hood_liripipe, not conical_hat
- cone-brim-skirt [attempts: 1] — 235: flared skirt 1.5->2.4 heads, 0.1 deep, lighter: invisible edge-on at eye level
- aimed-club-cycle [attempts: 1] — 234: laid clubs end on the clubber's own front man, short of the foe; rank-back men need to close to reach
- rear-strike-lands [attempts: 1] — 233: aimed lay only at the landed fraction; rear club still cocked vertical between beats
- second-rank-blow [attempts: 1] — 231: beat-only strike from the rear rank; between beats the cocked hold is what stills catch
- head-fitted-hats [attempts: 1] — 229: 2-head width read; fixed brow seat covers the cone archer's eyes
- body-spaced-slots [attempts: 1] — 228: lateral slot pitch from body width opens board gaps; merging is front-to-back
- strike-tip [attempts: 2, dropped] — 228: landed fist at knee height in the press crouch; spent

## Notes for next iteration (max 5 lines)
- 238 pick was [S] battle-feel.h only; 239 can pair battle-feel.h with unit-look.h. battle-feel.h is plateau (4 approved [S] since 235 still FAIL): only an [R] on it until the 240 re-audit rewrites it. Skip [P]s on rows approved within 20 iterations. Check EOL/CR of every committed file. shield_wall: blue = ancient.hoplite, red = tribal.protector.
- Shield wall: carriers snap to ShieldSlot.at each step and are wallBraced (no crowd topple); every rank's boards ride the rank strip at 0.62 of neck height; the shield arm aims at the board back (_gripBoard). The blue wall men are hoplites with round boards (no tower shields in the wall shots).
- battle-feel.e: contact clubbers are limp 0.8-0.98 (toppled by braced hoplites), overriding the club pose; crowd_topple_clubber_vs_protector guards that topple.
- capture.mjs runs the showcase first and the regression set on a reloaded page, so `--only` looks equal full-run frames. Python edits: read/write bytes as utf-8 and keep the file's eol.
- Shadows pass, leave them. No raised idle lean, free-foot 0.08 or walk torso yaw. No [P] on SHOULDER_INSET, TRAPEZIUS_*, NECK_*, hull, pelvis, arm taper, ghost, bow ready, laurel, sunk crouch, CALF_SWELL, helm crown, lawn shade, carry bob, mammoth hull, spear carry, club heave.
