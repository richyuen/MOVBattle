# Loop state
Iteration: 235   Last re-audit: 235   Consecutive rejects: 0   Branch: main

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
- h FAIL (rewritten 235) [S since: 1, rejected since: 0] B: 1 blue helmets tipped ~60 deg onto the board tops, blue rear men crouched under the board line; red front rank still in a deep forward lunge (trunk ~40 deg, knees well bent) — shield_wall_side (235: red no longer near flat, no hands on the ground); 2 every red front board at one identical lean, a rigid sheared plate — shield_wall_front; 3 heads bowed so only helmet domes show over the rims, no face above any board (domes now upright) — shield_wall_front. Ref tabs_screenshot_06.
unit-look: e PASS f PASS g PASS h FAIL (3/4)
- h FAIL [S since: 0, rejected since: 1] B: 2 green and yellow archer cones have no visible brim at lineup distance (0.05-head ring in a darker tone merges into the cone foot) — lineup_medieval. (1 struck 233 by the [R]) Ref tabs_screenshot_05, 06, 04.
maps-light: e PASS f PASS g PASS h PASS (4/4)
ui-flow: e PASS f PASS g PASS h PASS (4/4)
camera: e PASS f PASS g PASS h PASS (4/4)
vfx: e PASS f PASS g PASS h PASS (4/4)
Total tier 1 24/24; tier 2 21/24.

## Focus (every gap this iteration)
BASE 0203d5b (re-audit 235: no flips; e, h lists rewritten; h.1 board facing dropped: the side lens stands on red's side, bosses face the foe on both walls as the 232 probe found)
- [S] unit-look.h cone-brim-skirt (01075f4) — REJECT, reverted: a 0.1-head-deep flared skirt is invisible edge-on from the eye-level lineup camera
- [S] battle-feel.h upright-wall-stance (e6654b2) — APPROVE, no strike (red stand taller, heads up; blue still folded under tipped helmets; red still lunge)
- housekeeping 8748e8b: 235.2 had stored proceduralAnimation.ts with CRLF (a lone CR defeats autocrlf); restored to LF

## Last verdicts (one line per gap, verbatim critic header)
- GAP: [S] cone-brim-skirt (01075f4) VERDICT: REJECT CRITERION: unit-look.h FAIL (previous: FAIL)
- GAP: [S] upright-wall-stance (e6654b2) VERDICT: APPROVE CRITERION: battle-feel.h FAIL (previous: FAIL)

## Ranked open gaps (max 8, tags and attempts in brackets; each clears a numbered blocker)
1. [S] battle-feel.h upright-wall-legs [0] — blocker 1: a wall man drops the brace crouch and lunge (knees under hips, hip at stand height), and the upright clamp reaches the blue wall men too (find why they skip it) — ref tabs_screenshot_06 — ours shield_wall_side
2. [S] battle-feel.h face-over-rim [0] — blocker 3: board rim at the chin and the helmet's face opening toward the enemy, a face above each board from the front — ref tabs_screenshot_06 — ours shield_wall_front
3. [S] battle-feel.h per-man-board-jitter [0] — blocker 2: each board's own seeded offsets in height, yaw and roll — ref tabs_screenshot_06 — ours shield_wall_front
4. [S] unit-look.h tipped-disc-brim [1] — blocker 2: a flat disc brim 2.8-3 heads across tipped ~0.25 rad so its top shows at eye level, narrower cone foot stepping out to it — ref tabs_screenshot_05 — ours lineup_medieval
5. [R] battle-feel.e strike-contact rebuild [0] — plateau, blockers 1-3: target-locked strike driving the weapon head to the foe's board or head at impact, recoil on the struck man; rank-back clubbers close to reach — ref trailer_3_sheet_01 r2c3, r3c1 — ours press_clubbers_side, big_melee_2s, closeup_weapon_reads

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- cone-brim-skirt [attempts: 1] — 235: flared skirt 1.5->2.4 heads, 0.1 deep, lighter: invisible edge-on at eye level
- aimed-club-cycle [attempts: 1] — 234: laid clubs end on the clubber's own front man, short of the foe; rank-back men need to close to reach
- rear-strike-lands [attempts: 1] — 233: aimed lay only at the landed fraction; rear club still cocked vertical between beats
- second-rank-blow [attempts: 1] — 231: beat-only strike from the rear rank; between beats the cocked hold is what stills catch
- head-fitted-hats [attempts: 1] — 229: 2-head width read; fixed brow seat covers the cone archer's eyes
- body-spaced-slots [attempts: 1] — 228: lateral slot pitch from body width opens board gaps; merging is front-to-back
- strike-tip [attempts: 2, dropped] — 228: landed fist at knee height in the press crouch; spent
- strike-aim [attempts: 1] — 227: arm aimed at head top, club arc laid by atan2 stands up off the arm; aim the club tip instead

## Notes for next iteration (max 5 lines)
- 235 picks were [S] unit-look.h + [S] battle-feel.h; 236 must not repeat that pair. Skip [P]s on rows approved within 20 iterations (critic ranked WALL_TRUNK_MAX 0.15 at 235). MUST run `git ls-files --eol <file>` and `git show HEAD:<file> | count CR` after each code commit (235.2 slipped CRLF in).
- Shield wall: carriers snap to ShieldSlot.at each step and are wallBraced (no crowd topple); every rank's boards ride the rank strip at 0.62 of neck height; the shield arm aims at the board back (_gripBoard). The blue wall men are hoplites with round boards (no tower shields in the wall shots).
- battle-feel.e: contact clubbers are limp 0.8-0.98 (toppled by braced hoplites), overriding the club pose; crowd_topple_clubber_vs_protector guards that topple.
- capture.mjs runs the showcase first and the regression set on a reloaded page, so `--only` looks equal full-run frames. Python edits: read/write bytes as utf-8 and keep the file's eol.
- Shadows pass, leave them. No raised idle lean, free-foot 0.08 or walk torso yaw. No [P] on SHOULDER_INSET, TRAPEZIUS_*, NECK_*, hull, pelvis, arm taper, ghost, bow ready, laurel, sunk crouch, CALF_SWELL, helm crown, lawn shade, carry bob, mammoth hull, spear carry, club heave.
