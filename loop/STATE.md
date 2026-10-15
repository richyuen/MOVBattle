# Loop state
Iteration: 239   Last re-audit: 235   Consecutive rejects: 0   Branch: main

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
- h FAIL [S since: 1, rejected since: 1] B: 2 the yellow "cone" in lineup_medieval is medieval.healer's plain `hood`: still a brimless cone perched on the skull, no cowl (green hood_liripipe half cleared 239; reword at the 240 re-audit) — lineup_medieval. (1 struck 233) Ref tabs_screenshot_06, 05, 04.
maps-light: e PASS f PASS g PASS h PASS (4/4)
ui-flow: e PASS f PASS g PASS h PASS (4/4)
camera: e PASS f PASS g PASS h PASS (4/4)
vfx: e PASS f PASS g PASS h PASS (4/4)
Tier 3 (unit-look i-v, one per faction lineup; maps-light i-o, one per campaign map; see CRITIC.md): unscored — 240 re-audits them from the new lineup_<faction> and biome_<map> shots.
Total tier 1 24/24; tier 2 21/24; tier 3 0/21 unscored.

## Focus (every gap this iteration)
BASE 56150f4 (one gap: battle-feel.e/.h plateau; only unit-look.h [S]-pickable)
- [S] unit-look.h hood-cowl (2357259) — APPROVE, green half of blocker 2 cleared (cowl + mantle; tail and face opening not visible in any shot)

## Last verdicts (one line per gap, verbatim critic header)
- GAP: [S] hood-cowl (2357259) VERDICT: APPROVE CRITERION: unit-look.h FAIL (previous: FAIL)

## Ranked open gaps (max 8, tags and attempts in brackets; each clears a numbered blocker)
1. [S] unit-look.h hood-fitted-plain [0] — blocker 2: plain `hood` (medieval.healer) through the same fitted cowl, peak and mantle (no tail) — ref tabs_screenshot_06 — ours lineup_medieval
2. [S] unit-look.h hood-tail-read [0] — blocker 2 cleanup: liripipe tail/peak as a chunky wedge readable from behind — ref tabs_screenshot_06 — ours closeup_archer_loose
3. [R] battle-feel.e strike-connect rebuild [0] — plateau, blockers 1-3: windup aimed at a target, swing ending on the enemy board or head with recoil — ref trailer_3_sheet_01 r2c3, r3c1 — ours press_clubbers_side, closeup_weapon_reads
4. [R] battle-feel.h lapped-wall rebuild [0] — plateau, blockers 2-3: boards lapping at staggered depth and angle, faces above the rims — ref tabs_screenshot_06 — ours shield_wall_front

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
- 240 re-audits: tier 3 scored, plateau e/h lists rewritten, unit-look.h blocker 2 reworded. New evidence: press_clubbers_hit is shot on the sim frame a clubber's blow registered (hit log), so a club not on its target in it is the pose, not the sampling; tell the critic so; 13 lineup_<faction> and 7 biome_<map> shots. Two rejected [R] on a criterion now mark it `deferred`. .gitattributes normalises EOL: no more LF restores. Skip [P]s on rows approved within 20 iterations. Check EOL/CR of every committed file. shield_wall: blue = ancient.hoplite, red = tribal.protector.
- Shield wall: carriers snap to ShieldSlot.at each step and are wallBraced (no crowd topple); every rank's boards ride the rank strip at 0.62 of neck height; the shield arm aims at the board back (_gripBoard). The blue wall men are hoplites with round boards (no tower shields in the wall shots).
- battle-feel.e: contact clubbers are limp 0.8-0.98 (toppled by braced hoplites), overriding the club pose; crowd_topple_clubber_vs_protector guards that topple.
- capture.mjs runs the showcase first and the regression set on a reloaded page, so `--only` looks equal full-run frames. Python edits: read/write bytes as utf-8 and keep the file's eol.
- Shadows pass, leave them. No raised idle lean, free-foot 0.08 or walk torso yaw. No [P] on SHOULDER_INSET, TRAPEZIUS_*, NECK_*, hull, pelvis, arm taper, ghost, bow ready, laurel, sunk crouch, CALF_SWELL, helm crown, lawn shade, carry bob, mammoth hull, spear carry, club heave.
