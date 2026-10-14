# Loop state
Iteration: 232   Last re-audit: 230   Consecutive rejects: 0   Branch: main

## Criteria (critic, PASS/FAIL per criterion; FAIL carries its closed blocker list and the count of approved [S] since the list was written)
battle-feel: a PASS b PASS c PASS d PASS (4/4)
unit-look: a PASS b PASS c PASS d PASS (4/4)
maps-light: a PASS b PASS c PASS d PASS (4/4)
ui-flow: a PASS b PASS c PASS d PASS (4/4)
camera: a PASS b PASS c PASS d PASS (4/4)
vfx: a PASS b PASS c PASS d PASS (4/4)
Tier 2 (fully scored at 198, re-audited 220, 225, 230):
battle-feel: e FAIL f PASS g PASS h FAIL (2/4)
- e FAIL (rewritten 230) [S since: 2, rejected since: 1] B: 1 blue clubs never land on a red board top or head (one slanted in air, one level at the chest, one low at the hip); no struck man reacts — press_clubbers_side; 2 red clubs partly eased (232: rear rank rests low between beats) but 2-3 still cocked behind the line and no laid club reaches a blue board — big_melee_2s, 2150ms, 5s, 9s; 4 knight swords cocked behind the helm or level across the chest, no blade meets a body — closeup_weapon_reads. (3 struck 230) Ref trailer_3_sheet_01 r2c3, r3c1.
- h FAIL (rewritten 230) [S since: 2, rejected since: 0] B: 1 blue boards full face to the side lens while red boards angle to the foe; red torsos side-on between red boards — shield_wall_side; 3 boards lean (232) but every board at one tilt, a rigid sheared plate; men not in a pressing stride — shield_wall_front. (2 struck 230) Ref tabs_screenshot_06.
unit-look: e PASS f PASS g PASS h FAIL (3/4)
- h FAIL plateau (rewritten 230; plateau until an [R] is judged) [S since: 2, rejected since: 3] B: 1 purple beret ~1.5 heads wide, perched on the crown instead of seated at the brow; 2 green and yellow archer cones ~1 head wide, no brim, sitting high — lineup_medieval. Ref tabs_screenshot_05, 06, 04.
maps-light: e PASS f PASS g PASS h PASS (4/4)
ui-flow: e PASS f PASS g PASS h PASS (4/4)
camera: e PASS f PASS g PASS h PASS (4/4)
vfx: e PASS f PASS g PASS h PASS (4/4)
Total tier 1 24/24; tier 2 21/24.

## Focus (every gap this iteration)
BASE 36a559b
- [S] battle-feel.e rear-club-rest (936fcdc) — APPROVE, no strike (rear clubs now low between beats, but droop to hip height; back-crowd clubbers still cocked)
- [S] battle-feel.h pressing-lean (c32c4ec) — APPROVE, no strike (boards tip in side view; hardly reads from the front lens; no stride)
- probe: every front board's face normal points along its wall heading at the foe (blue +x, red -x); the critic sees blue bosses toward the side lens, so blocker h.1 needs the lens side settled at the next re-audit

## Last verdicts (one line per gap, verbatim critic header)
- GAP: [S] rear-club-rest (936fcdc) VERDICT: APPROVE CRITERION: battle-feel.e FAIL (previous: FAIL)
- GAP: [S] pressing-lean (c32c4ec) VERDICT: APPROVE CRITERION: battle-feel.h FAIL (previous: FAIL)

## Ranked open gaps (max 8, tags and attempts in brackets; each clears a numbered blocker)
1. [S] battle-feel.e rear-strike-lands [0] — blocker 2: the rear clubber's slam ends on the blue board top or head ahead (landed pose aimed at the foe's head height through the ally's lane), with a flinch — ref trailer_3_sheet_01 r2c3 — ours big_melee_9s
2. [S] battle-feel.h pressing-stride [0] — blocker 3: lead leg forward under the board, rear leg back and straight, trunk driven into the board, per-man phase so board tilts differ — ref tabs_screenshot_06 — ours shield_wall_front
3. [S] battle-feel.e knight-blade-meets [0] — blocker 4: the knight's swing lands its blade on the target's body with a target flinch — ref trailer_3_sheet_01 r3c1 — ours closeup_weapon_reads
4. [S] battle-feel.e back-crowd-lowered [0] — blocker 2: clubbers blocked by the crowd with no ally in lane rest the club low too — ref trailer_3_sheet_01 r2c3 — ours big_melee_9s
5. [S] battle-feel.e clubber-lands-on-board [0] — blocker 1: blue press blow landed pose on the red board rim or helm (press crouch keeps the fist at knee height: fix first) — ref trailer_3_sheet_01 r2c3 — ours press_clubbers_side
6. [S] battle-feel.h red-wall-face [0] — blocker 1: settle the lens side against the probe first — ref tabs_screenshot_06 — ours shield_wall_side
7. [R] unit-look.h hat-seat rebuild [0] — plateau: brow-seated head-fitted hats from a written spec — ref tabs_screenshot_04, 05, 06 — ours lineup_medieval

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- second-rank-blow [attempts: 1] — 231: beat-only strike from the rear rank; between beats the cocked hold is what stills catch
- head-fitted-hats [attempts: 1] — 229: 2-head width read; fixed brow seat covers the cone archer's eyes
- body-spaced-slots [attempts: 1] — 228: lateral slot pitch from body width opens board gaps; merging is front-to-back
- strike-tip [attempts: 2, dropped] — 228: landed fist at knee height in the press crouch; spent
- strike-aim [attempts: 1] — 227: arm aimed at head top, club arc laid by atan2 stands up off the arm; aim the club tip instead
- spooky-leaves [attempts: 1, [P]] — 226: ledger reversal of the 225 row; crowns sink into the team tints
- block-separation [attempts: 1, dropped] — 226: hard non-overlap after the slot snap fights the snap; wall slides out of frame
- haze-near [attempts: 1, [P]] — 224: BACKDROP_HAZE_NEAR 26 -> 18: crowns not visibly paler; ledger reversal of a 223 row

## Notes for next iteration (max 5 lines)
- 232 picks were [S] battle-feel.e + [S] battle-feel.h; 233 must not repeat that pair (e+h): pair one of them with unit-look.h ([R]) or another criterion. Skip [P]s on rows approved within 20 iterations (critic ranked REAR_CLUB_REST 0.6 at 232: ledger reversal). Arm angles: shoulder.x 0 hanging, -1.6 level forward, -2.5 cocked overhead.
- Shield wall: carriers snap to ShieldSlot.at each step and are wallBraced (no crowd topple); every rank's boards ride the rank strip at 0.62 of neck height; the shield arm aims at the board back (_gripBoard). The blue wall men are hoplites with round boards (no tower shields in the wall shots).
- battle-feel.e: contact clubbers are limp 0.8-0.98 (toppled by braced hoplites), overriding the club pose; crowd_topple_clubber_vs_protector guards that topple.
- capture.mjs runs the showcase first and the regression set on a reloaded page, so `--only` looks equal full-run frames. Python edits: read/write bytes as utf-8 and keep the file's eol.
- Shadows pass, leave them. No raised idle lean, free-foot 0.08 or walk torso yaw. No [P] on SHOULDER_INSET, TRAPEZIUS_*, NECK_*, hull, pelvis, arm taper, ghost, bow ready, laurel, sunk crouch, CALF_SWELL, helm crown, lawn shade, carry bob, mammoth hull, spear carry, club heave.
