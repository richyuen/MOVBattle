# Loop state
Iteration: 230   Last re-audit: 230   Consecutive rejects: 0   Branch: main

## Criteria (critic, PASS/FAIL per criterion; FAIL carries its closed blocker list and the count of approved [S] since the list was written)
battle-feel: a PASS b PASS c PASS d PASS (4/4)
unit-look: a PASS b PASS c PASS d PASS (4/4)
maps-light: a PASS b PASS c PASS d PASS (4/4)
ui-flow: a PASS b PASS c PASS d PASS (4/4)
camera: a PASS b PASS c PASS d PASS (4/4)
vfx: a PASS b PASS c PASS d PASS (4/4)
Tier 2 (fully scored at 198, re-audited 220, 225, 230):
battle-feel: e FAIL f PASS g PASS h FAIL (2/4)
- e FAIL (rewritten 230) [S since: 1, rejected since: 0] B: 1 blue clubs never land on a red board top or head (one slanted in air, one level at the chest, one low at the hip); no struck man reacts — press_clubbers_side; 2 red clubs cocked overhead in every frame, no stroke coming down onto the blue boards — big_melee_2s, 2150ms, 5s, 9s; 4 knight swords cocked behind the helm or level across the chest, no blade meets a body — closeup_weapon_reads. (3 struck 230) Ref trailer_3_sheet_01 r2c3, r3c1.
- h FAIL (rewritten 230) [S since: 1, rejected since: 0] B: 1 blue boards full face to the side lens while red boards angle to the foe; red torsos side-on between red boards — shield_wall_side; 3 boards bolt upright on a straight line, no top-forward lean, men not in a pressing stride — shield_wall_front. (2 struck 230) Ref tabs_screenshot_06.
unit-look: e PASS f PASS g PASS h FAIL (3/4)
- h FAIL plateau (rewritten 230; plateau until an [R] is judged) [S since: 2, rejected since: 3] B: 1 purple beret ~1.5 heads wide, perched on the crown instead of seated at the brow; 2 green and yellow archer cones ~1 head wide, no brim, sitting high — lineup_medieval. Ref tabs_screenshot_05, 06, 04.
maps-light: e PASS f FAIL g PASS h PASS (3/4)
- f FAIL (rewritten 230) [S since: 0, rejected since: 0] B: 1 mid-distance ring canopies saturated red/orange, stronger than the lawn, no lift toward the sky — spell_dome (big_melee_5s now reads hazed). Ref tabs_screenshot_05, 01.
ui-flow: e PASS f PASS g PASS h PASS (4/4)
camera: e PASS f PASS g PASS h PASS (4/4)
vfx: e PASS f PASS g PASS h PASS (4/4)
Total tier 1 24/24; tier 2 20/24.

## Focus (every gap this iteration)
BASE a2a564c (re-audit 230: no flips; e, h, unit-look.h, maps-light.f lists rewritten; unit-look.h stays plateau)
- [S] battle-feel.h wall-queue (7b79381) — APPROVE, blocker 2 struck
- [S] battle-feel.e levelled-thrust (1ef73cb) — APPROVE, blocker 3 struck (red rear rank levels over the boards; blue rear rank still vertical)

## Last verdicts (one line per gap, verbatim critic header)
- GAP: [S] wall-queue (7b79381) VERDICT: APPROVE CRITERION: battle-feel.h FAIL (previous: FAIL)
- GAP: [S] levelled-thrust (1ef73cb) VERDICT: APPROVE CRITERION: battle-feel.e FAIL (previous: FAIL)

## Ranked open gaps (max 8, tags and attempts in brackets; each clears a numbered blocker)
1. [S] battle-feel.e red-club-downstroke [0] — blocker 2: red clubbers in the press run the press-blow beat down onto the blue boards instead of holding the cock — ref trailer_3_sheet_01 r2c3 — ours big_melee_2s
2. [S] battle-feel.h board-lap-face [0] — blocker 1: front-rank boards turned to the foe, edge over edge, torsos square behind — ref tabs_screenshot_06 — ours shield_wall_side
3. [S] battle-feel.h pressing-lean [0] — blocker 3: front rank in contact tips board tops forward and takes a braced stride — ref tabs_screenshot_06 — ours shield_wall_front
4. [S] battle-feel.e knight-blade-contact [0] — blocker 4: sword swing aimed to end on the target's body — ref trailer_3_sheet_01 r2c3 — ours closeup_weapon_reads
5. [S] maps-light.f canopy-lift [0] — blocker 1: ring canopies desaturated and lifted toward the sky by distance (new mechanism) — ref tabs_screenshot_05 — ours spell_dome
6. [R] unit-look.h hat-seat rebuild [0] — blockers 1-2: hat fitting from a spec (brow-seated, brims ~2 heads, eyes clear) — ref tabs_screenshot_04, 05, 06 — ours lineup_medieval
7. [S] battle-feel.e committed-blow-landing [0] — blocker 1: club stroke target-locked to the board top or head (press crouch keeps the fist at knee height: fix that first) — ref trailer_3_sheet_01 r2c3 — ours press_clubbers_side

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- head-fitted-hats [attempts: 1] — 229: 2-head width read; fixed brow seat covers the cone archer's eyes
- body-spaced-slots [attempts: 1] — 228: lateral slot pitch from body width opens board gaps; merging is front-to-back
- strike-tip [attempts: 2, dropped] — 228: landed fist at knee height in the press crouch; spent
- strike-aim [attempts: 1] — 227: arm aimed at head top, club arc laid by atan2 stands up off the arm; aim the club tip instead
- spooky-leaves [attempts: 1, [P]] — 226: ledger reversal of the 225 row; crowns sink into the team tints
- block-separation [attempts: 1, dropped] — 226: hard non-overlap after the slot snap fights the snap; wall slides out of frame
- haze-near [attempts: 1, [P]] — 224: BACKDROP_HAZE_NEAR 26 -> 18: crowns not visibly paler; ledger reversal of a 223 row
- committed-blow v2 [attempts: 2, [R]] — 222: crown-aimed arm and club over the descent + hold, no-topple window, spear drop: aim never caught in a frame (weight follows the ease, short hold)

## Notes for next iteration (max 5 lines)
- 230 picks were [S] battle-feel.h + [S] battle-feel.e; 231 must not repeat that pair. Skip [P]s on rows approved within 20 iterations. Arm angles: shoulder.x 0 = arm hanging, about -1.6 = level forward, -2.5 cocked overhead. Fallout for later: blue rear rank should level too; queued allies could press into the man ahead.
- Shield wall: carriers snap to ShieldSlot.at each step and are wallBraced (no crowd topple); every rank's boards ride the rank strip at 0.62 of neck height; the shield arm aims at the board back (_gripBoard). The blue wall men are hoplites with round boards (no tower shields in the wall shots).
- battle-feel.e: contact clubbers are limp 0.8-0.98 (toppled by braced hoplites), overriding the club pose; crowd_topple_clubber_vs_protector guards that topple.
- capture.mjs runs the showcase first and the regression set on a reloaded page, so `--only` looks equal full-run frames. Python edits: read/write bytes as utf-8 and keep the file's eol.
- Shadows pass, leave them. No raised idle lean, free-foot 0.08 or walk torso yaw. No [P] on SHOULDER_INSET, TRAPEZIUS_*, NECK_*, hull, pelvis, arm taper, ghost, bow ready, laurel, sunk crouch, CALF_SWELL, helm crown, lawn shade, carry bob, mammoth hull, spear carry, club heave.
