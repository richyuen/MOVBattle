# Loop state
Iteration: 237   Last re-audit: 235   Consecutive rejects: 0   Branch: main

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
- h FAIL (rewritten 235) [S since: 3, rejected since: 0] B: 2 every red front board at one identical lean, a rigid sheared plate — shield_wall_front; 3 heads bowed so only helmet domes show over the rims, no face above any board (red wall men are tribal.protector in bone_mask, oversized grey spheres) — shield_wall_front. (1 struck 237) Ref tabs_screenshot_06.
unit-look: e PASS f PASS g PASS h FAIL (3/4)
- h FAIL [S since: 0, rejected since: 1] B: 2 the green and yellow "cones" in lineup_medieval are hood_liripipe hoods (medieval.archer, pitchfork peasant), not conical_hat: they read as brimless cones perched on the skull, no cowl down the back of the head (reword at the 240 re-audit) — lineup_medieval. (1 struck 233) Ref tabs_screenshot_05, 06, 04.
maps-light: e PASS f PASS g PASS h PASS (4/4)
ui-flow: e PASS f PASS g PASS h PASS (4/4)
camera: e PASS f PASS g PASS h PASS (4/4)
vfx: e PASS f PASS g PASS h PASS (4/4)
Total tier 1 24/24; tier 2 21/24.

## Focus (every gap this iteration)
BASE 10dd4f6
- [S] battle-feel.h wall-head-level (799b90c) — APPROVE, blocker 1 struck (probe: blue necks were upright; the plume_helmet was a sphere cap open side up; now a head-fitted dome + crest for every helmet/plume_helmet wearer)
- [S] unit-look.h archer-brim — DROPPED uncommitted: the lineup "cones" are hood_liripipe hoods, not conical_hat (only Dynasty wears that), so a cone brim does not touch them

## Last verdicts (one line per gap, verbatim critic header)
- GAP: [S] wall-head-level (799b90c) VERDICT: APPROVE CRITERION: battle-feel.h FAIL (previous: FAIL)

## Ranked open gaps (max 8, tags and attempts in brackets; each clears a numbered blocker)
1. [S] battle-feel.h wall-board-lean [0] — blocker 2: per-man board lean and yaw offset from the carrier slot, rims overlapping into one uneven surface — ref tabs_screenshot_06 — ours shield_wall_front
2. [S] battle-feel.h protector-helm-fit [0] — blocker 3: the red wall men's bone_mask (tribal.protector) fitted to the head with the face showing over the rim — ref tabs_screenshot_06 — ours shield_wall_front
3. [S] unit-look.h hood-cowl [0] — blocker 2: hood_liripipe gets a cowl draping down the back of the head to the shoulders and a face-framing rim — ref tabs_screenshot_05 — ours lineup_medieval
4. [S] battle-feel.h wall-chin-up [0] — blocker 3: wall-hold head pitch lifting the chin level over the rim — ref tabs_screenshot_06 — ours shield_wall_2650ms
5. [R] battle-feel.e melee strike rebuild [0] — plateau, blockers 1-3: windup-to-contact swing ending on an enemy board or head, recoil on the hit man — ref trailer_3_sheet_01 r2c3, r3c1 — ours press_clubbers_side, closeup_weapon_reads

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
- 237 picks were [S] battle-feel.h + [S] unit-look.h (dropped); 238 must not repeat that pair, so one [S] (h or unit-look.h) plus optionally the [R] on battle-feel.e. Skip [P]s on rows approved within 20 iterations. Check EOL/CR of every committed file. shield_wall scenes: blue = ancient.hoplite (plume_helmet), red = tribal.protector (bone_mask).
- Shield wall: carriers snap to ShieldSlot.at each step and are wallBraced (no crowd topple); every rank's boards ride the rank strip at 0.62 of neck height; the shield arm aims at the board back (_gripBoard). The blue wall men are hoplites with round boards (no tower shields in the wall shots).
- battle-feel.e: contact clubbers are limp 0.8-0.98 (toppled by braced hoplites), overriding the club pose; crowd_topple_clubber_vs_protector guards that topple.
- capture.mjs runs the showcase first and the regression set on a reloaded page, so `--only` looks equal full-run frames. Python edits: read/write bytes as utf-8 and keep the file's eol.
- Shadows pass, leave them. No raised idle lean, free-foot 0.08 or walk torso yaw. No [P] on SHOULDER_INSET, TRAPEZIUS_*, NECK_*, hull, pelvis, arm taper, ghost, bow ready, laurel, sunk crouch, CALF_SWELL, helm crown, lawn shade, carry bob, mammoth hull, spear carry, club heave.
