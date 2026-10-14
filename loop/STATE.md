# Loop state
Iteration: 234   Last re-audit: 230   Consecutive rejects: 0   Branch: main

## Criteria (critic, PASS/FAIL per criterion; FAIL carries its closed blocker list and the count of approved [S] since the list was written)
battle-feel: a PASS b PASS c PASS d PASS (4/4)
unit-look: a PASS b PASS c PASS d PASS (4/4)
maps-light: a PASS b PASS c PASS d PASS (4/4)
ui-flow: a PASS b PASS c PASS d PASS (4/4)
camera: a PASS b PASS c PASS d PASS (4/4)
vfx: a PASS b PASS c PASS d PASS (4/4)
Tier 2 (fully scored at 198, re-audited 220, 225, 230):
battle-feel: e FAIL f PASS g PASS h FAIL (2/4)
- e FAIL plateau (rewritten 230) [S since: 2, rejected since: 3] B: 1 blue clubs never land on a red board top or head (one slanted in air, one level at the chest, one low at the hip); no struck man reacts — press_clubbers_side; 2 red clubs partly eased (232: rear rank rests low between beats) but 2-3 still cocked behind the line and no laid club reaches a blue board — big_melee_2s, 2150ms, 5s, 9s; 4 knight swords cocked behind the helm or level across the chest, no blade meets a body — closeup_weapon_reads. (3 struck 230) Ref trailer_3_sheet_01 r2c3, r3c1.
- h FAIL (rewritten 230) [S since: 3, rejected since: 0] B: 1 blue boards full face to the side lens while red boards angle to the foe; red torsos side-on between red boards — shield_wall_side; 3 boards lean (232) but every board at one tilt, a rigid sheared plate; front-row tilts differ only by a few degrees (pressing stride in, 234); trunk pitched near flat, rear men on all fours — shield_wall_front. (2 struck 230) Ref tabs_screenshot_06.
unit-look: e PASS f PASS g PASS h FAIL (3/4)
- h FAIL [S since: 0, rejected since: 0] B: 2 green and yellow archer cones have no visible brim at lineup distance (0.05-head ring in a darker tone merges into the cone foot) — lineup_medieval. (1 struck 233 by the [R]; plateau cleared) Ref tabs_screenshot_05, 06, 04.
maps-light: e PASS f PASS g PASS h PASS (4/4)
ui-flow: e PASS f PASS g PASS h PASS (4/4)
camera: e PASS f PASS g PASS h PASS (4/4)
vfx: e PASS f PASS g PASS h PASS (4/4)
Total tier 1 24/24; tier 2 21/24.

## Focus (every gap this iteration)
BASE 00733cf
- [S] battle-feel.e aimed-club-cycle (1f4708b) — REJECT, reverted: laid clubs end on the clubber's own front man's head, 200 px short of the blue boards; 2-3 clubs still cocked where no strike point under 4 m exists; battle-feel.e now plateau (3 rejected [S] since 230)
- [S] battle-feel.h pressing-stride (299651c) — APPROVE, no strike (side view drives and per-man tilts; front view still near one tilt)

## Last verdicts (one line per gap, verbatim critic header)
- GAP: [S] aimed-club-cycle (1f4708b) VERDICT: REJECT CRITERION: battle-feel.e FAIL (previous: FAIL)
- GAP: [S] pressing-stride (299651c) VERDICT: APPROVE CRITERION: battle-feel.h FAIL (previous: FAIL)

## Ranked open gaps (max 8, tags and attempts in brackets; each clears a numbered blocker)
1. [R] battle-feel.e melee-blow rebuild [0] — plateau: rank-back clubbers close to club reach of the foe, every clubber with a blow target swings on the aimed line, a struck-man reaction, a sword cut that lands — ref trailer_3_sheet_01 r2c3 — ours big_melee_2150ms, press_clubbers_side, closeup_weapon_reads
2. [S] battle-feel.h side-facing-boards [0] — blocker 1: (settle the lens side vs the 232 probe at the 235 re-audit) — ref tabs_screenshot_06 — ours shield_wall_side
3. [S] battle-feel.h staggered-board-seat [0] — blocker 3: per-man board height and lap offset from his stride beat, the front row overlapping unevenly — ref tabs_screenshot_06 — ours shield_wall_front
4. [S] unit-look.h cone-brim [0] — blocker 2: archer cone brim as a wider flat disc standing out at lineup distance — ref tabs_screenshot_04 — ours lineup_medieval

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- aimed-club-cycle [attempts: 1] — 234: laid clubs end on the clubber's own front man, short of the foe; rank-back men need to close to reach
- rear-strike-lands [attempts: 1] — 233: aimed lay only at the landed fraction; rear club still cocked vertical between beats
- second-rank-blow [attempts: 1] — 231: beat-only strike from the rear rank; between beats the cocked hold is what stills catch
- head-fitted-hats [attempts: 1] — 229: 2-head width read; fixed brow seat covers the cone archer's eyes
- body-spaced-slots [attempts: 1] — 228: lateral slot pitch from body width opens board gaps; merging is front-to-back
- strike-tip [attempts: 2, dropped] — 228: landed fist at knee height in the press crouch; spent
- strike-aim [attempts: 1] — 227: arm aimed at head top, club arc laid by atan2 stands up off the arm; aim the club tip instead
- spooky-leaves [attempts: 1, [P]] — 226: ledger reversal of the 225 row; crowns sink into the team tints

## Notes for next iteration (max 5 lines)
- 234 picks were [S] battle-feel.e + [S] battle-feel.h. 235 is a re-audit (battle-feel.e plateau, settle the shield_wall_side lens side vs the 232 probe). Skip [P]s on rows approved within 20 iterations (critic ranked the 234 rock 0.15 [P]: ledger reversal). Arm angles: shoulder.x 0 hanging, -1.6 level forward, -2.5 cocked overhead.
- Shield wall: carriers snap to ShieldSlot.at each step and are wallBraced (no crowd topple); every rank's boards ride the rank strip at 0.62 of neck height; the shield arm aims at the board back (_gripBoard). The blue wall men are hoplites with round boards (no tower shields in the wall shots).
- battle-feel.e: contact clubbers are limp 0.8-0.98 (toppled by braced hoplites), overriding the club pose; crowd_topple_clubber_vs_protector guards that topple.
- capture.mjs runs the showcase first and the regression set on a reloaded page, so `--only` looks equal full-run frames. Python edits: read/write bytes as utf-8 and keep the file's eol.
- Shadows pass, leave them. No raised idle lean, free-foot 0.08 or walk torso yaw. No [P] on SHOULDER_INSET, TRAPEZIUS_*, NECK_*, hull, pelvis, arm taper, ghost, bow ready, laurel, sunk crouch, CALF_SWELL, helm crown, lawn shade, carry bob, mammoth hull, spear carry, club heave.
