# Loop state
Iteration: 231   Last re-audit: 230   Consecutive rejects: 0   Branch: main

## Criteria (critic, PASS/FAIL per criterion; FAIL carries its closed blocker list and the count of approved [S] since the list was written)
battle-feel: a PASS b PASS c PASS d PASS (4/4)
unit-look: a PASS b PASS c PASS d PASS (4/4)
maps-light: a PASS b PASS c PASS d PASS (4/4)
ui-flow: a PASS b PASS c PASS d PASS (4/4)
camera: a PASS b PASS c PASS d PASS (4/4)
vfx: a PASS b PASS c PASS d PASS (4/4)
Tier 2 (fully scored at 198, re-audited 220, 225, 230):
battle-feel: e FAIL f PASS g PASS h FAIL (2/4)
- e FAIL (rewritten 230) [S since: 1, rejected since: 1] B: 1 blue clubs never land on a red board top or head (one slanted in air, one level at the chest, one low at the hip); no struck man reacts — press_clubbers_side; 2 red clubs cocked overhead in every frame, no stroke coming down onto the blue boards — big_melee_2s, 2150ms, 5s, 9s; 4 knight swords cocked behind the helm or level across the chest, no blade meets a body — closeup_weapon_reads. (3 struck 230) Ref trailer_3_sheet_01 r2c3, r3c1.
- h FAIL (rewritten 230) [S since: 1, rejected since: 0] B: 1 blue boards full face to the side lens while red boards angle to the foe; red torsos side-on between red boards — shield_wall_side; 3 boards bolt upright on a straight line, no top-forward lean, men not in a pressing stride — shield_wall_front. (2 struck 230) Ref tabs_screenshot_06.
unit-look: e PASS f PASS g PASS h FAIL (3/4)
- h FAIL plateau (rewritten 230; plateau until an [R] is judged) [S since: 2, rejected since: 3] B: 1 purple beret ~1.5 heads wide, perched on the crown instead of seated at the brow; 2 green and yellow archer cones ~1 head wide, no brim, sitting high — lineup_medieval. Ref tabs_screenshot_05, 06, 04.
maps-light: e PASS f PASS g PASS h PASS (4/4)
ui-flow: e PASS f PASS g PASS h PASS (4/4)
camera: e PASS f PASS g PASS h PASS (4/4)
vfx: e PASS f PASS g PASS h PASS (4/4)
Total tier 1 24/24; tier 2 21/24.

## Focus (every gap this iteration)
BASE b6591bb
- [S] battle-feel.e second-rank-blow (b48a622) — REJECT, reverted: rear-rank clubber with an ally in his lane takes the press blow on the beat, but between beats the hold is still cocked overhead, so no still shows a club coming down over a shoulder
- [S] maps-light.f canopy-lift (d7731b8) — APPROVE, blocker 1 struck, maps-light.f PASS

## Last verdicts (one line per gap, verbatim critic header)
- GAP: [S] second-rank-blow (b48a622) VERDICT: REJECT CRITERION: battle-feel.e FAIL (previous: FAIL)
- GAP: [S] canopy-lift (d7731b8) VERDICT: APPROVE CRITERION: maps-light.f PASS (previous: FAIL)

## Ranked open gaps (max 8, tags and attempts in brackets; each clears a numbered blocker)
1. [S] battle-feel.e rear-club-rest [1] — blocker 2: a rear-rank clubber out of reach rests club-low (landed pose, tip at the front man's shoulder or the foe's board top) between beats instead of the cocked hold — ref trailer_3_sheet_01 r2c3 — ours big_melee_9s
2. [S] battle-feel.h board-to-foe facing [0] — blocker 1: blue boards face the foe along the wall heading (edge-on to the side lens), torsos square behind — ref tabs_screenshot_06 — ours shield_wall_side
3. [S] battle-feel.h pressing lean [0] — blocker 3: board top leans forward, men in a staggered pressing stride — ref tabs_screenshot_06 — ours shield_wall_front
4. [S] battle-feel.e sword-meets-body [0] — blocker 4: knight's swing ends with the blade across the foe's torso or helm — ref trailer_3_sheet_01 r2c3 — ours closeup_weapon_reads
5. [S] battle-feel.e board-top landing [0] — blocker 1: slam end on the struck man's board top or head, visible recoil (press crouch keeps the fist at knee height: fix first) — ref trailer_3_sheet_01 r2c3 — ours press_clubbers_side
6. [R] unit-look.h hat seating rebuild [0] — plateau: brow-seated head-relative mount, oversized brims, eyes clear — ref tabs_screenshot_04, 05, 06 — ours lineup_medieval

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
- 231 picks were [S] battle-feel.e + [S] maps-light.f. Skip [P]s on rows approved within 20 iterations. Arm angles: shoulder.x 0 = arm hanging, about -1.6 = level forward, -2.5 cocked overhead. Fallout: olive darkLeaves crowns not lifted by canopy grade (name check); blue rear rank still vertical spears.
- Shield wall: carriers snap to ShieldSlot.at each step and are wallBraced (no crowd topple); every rank's boards ride the rank strip at 0.62 of neck height; the shield arm aims at the board back (_gripBoard). The blue wall men are hoplites with round boards (no tower shields in the wall shots).
- battle-feel.e: contact clubbers are limp 0.8-0.98 (toppled by braced hoplites), overriding the club pose; crowd_topple_clubber_vs_protector guards that topple.
- capture.mjs runs the showcase first and the regression set on a reloaded page, so `--only` looks equal full-run frames. Python edits: read/write bytes as utf-8 and keep the file's eol.
- Shadows pass, leave them. No raised idle lean, free-foot 0.08 or walk torso yaw. No [P] on SHOULDER_INSET, TRAPEZIUS_*, NECK_*, hull, pelvis, arm taper, ghost, bow ready, laurel, sunk crouch, CALF_SWELL, helm crown, lawn shade, carry bob, mammoth hull, spear carry, club heave.
