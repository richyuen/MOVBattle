# Loop state
Iteration: 229   Last re-audit: 225   Consecutive rejects: 0   Branch: main

## Criteria (critic, PASS/FAIL per criterion; FAIL carries its closed blocker list and the count of approved [S] since the list was written)
battle-feel: a PASS b PASS c PASS d PASS (4/4)
unit-look: a PASS b PASS c PASS d PASS (4/4)
maps-light: a PASS b PASS c PASS d PASS (4/4)
ui-flow: a PASS b PASS c PASS d PASS (4/4)
camera: a PASS b PASS c PASS d PASS (4/4)
vfx: a PASS b PASS c PASS d PASS (4/4)
Tier 2 (fully scored at 198, re-audited 220, 225):
battle-feel: e FAIL f PASS g PASS h FAIL (2/4)
- e FAIL (rewritten 225) [S since: 1, rejected since: 2] B: 1 press clubs mostly landed (226) but at the striker's hip or short in the air, not on a board top or head; no struck man visibly reacts (227 arm aim made the club stand up off the arm) — press_clubbers_side; 2 red clubs partly eased (226) but 2-3 still bolt upright behind the line, none descending onto the boards — big_melee_5s, 9s; 3 every hoplite spear a vertical picket, none levelled or thrust over the boards — shield_wall_side, _front, 2500ms, 2650ms; 4 swords upright before the chest or trailed at the hip, none mid-arc — closeup_weapon_reads. Ref trailer_3_sheet_01 r2c3, r3c1.
- h FAIL (rewritten 225) [S since: 1, rejected since: 2] B: 1 blue boards show full faces to the side lens while red boards angle to the foe; red bodies side-on between red boards — shield_wall_side; 3 blue knights fold into the blue board row, blades and mitts crossing the boards — shield_wall_side; 4 boards bolt upright, men not pressing into a stride (arc eased 229) — shield_wall_front. (2 struck 229) Ref tabs_screenshot_06.
unit-look: e PASS f PASS g PASS h FAIL (3/4)
- h FAIL plateau [S since: 2, rejected since: 3] B: 3 beret and yellow cone ~1.5 heads wide, small on the head (ref ~2 heads, tabs_screenshot_05); a low seat must keep the brim above the eyes — lineup_medieval. (1 struck 218) Ref tabs_screenshot_04.
maps-light: e PASS f FAIL g PASS h PASS (3/4)
- f FAIL [S since: 2, rejected since: 1] B: 2 ring canopies full-saturation, same strength as the field (ridges hazed 223) — big_melee_5s, spell_dome. (1 struck 215) Ref tabs_screenshot_05, 01.
ui-flow: e PASS f PASS g PASS h PASS (4/4)
camera: e PASS f PASS g PASS h PASS (4/4)
vfx: e PASS f PASS g PASS h PASS (4/4)
Total tier 1 24/24; tier 2 20/24.

## Focus (every gap this iteration)
BASE 9572e3d
- [S] unit-look.h head-fitted-hats (8131f67) — REJECT, reverted: width ~2 heads read, but the fixed 0.12-head seat pulled the yellow cone's brim over the eyes; unit-look.h now plateau (3 rejected [S])
- [S] battle-feel.h body-deep-ranks (27cc1e5) — APPROVE, blocker 2 struck

## Last verdicts (one line per gap, verbatim critic header)
- GAP: [S] head-fitted-hats (8131f67) VERDICT: REJECT CRITERION: unit-look.h FAIL (previous: FAIL)
- GAP: [S] body-deep-ranks (27cc1e5) VERDICT: APPROVE CRITERION: battle-feel.h FAIL (previous: FAIL)

## Ranked open gaps (max 8, tags and attempts in brackets; each clears a numbered blocker)
1. [S] battle-feel.h wall-board-facing [0] — blocker 1: every slotted carrier's board squared to his wall's heading toward the foe (blue boards edge-on to a side lens like the red) — ref tabs_screenshot_06 — ours shield_wall_side
2. [S] battle-feel.h press-stride [0] — blocker 4: braced press pose, board canted ~15 deg into the foe, shoulder behind it, rear leg driven back — ref tabs_screenshot_06 — ours shield_wall_front
3. [S] battle-feel.h behind-own-wall [0] — blocker 3: non-carriers held a body behind their own board row — ref tabs_screenshot_06 — ours shield_wall_side
4. [R] unit-look.h hat-fit [0] — plateau: soft hats fitted from head metrics, ~2 heads across, brim seated a margin above the eye top — ref tabs_screenshot_05 — ours lineup_medieval
5. [S] battle-feel.e levelled-spear [0] — blocker 3: second-rank hoplite levels the spear overhand and thrusts over the front boards — ref trailer_3_sheet_01 r3c1 — ours shield_wall_side
6. [S] battle-feel.e sword-arc [0] — blocker 4: sword swing with a mid-arc frame, blade across the body — ref trailer_3_sheet_01 r2c3 — ours closeup_weapon_reads
7. [S] maps-light.f ring-canopy-haze [0] — blocker 2: ring canopies weaker than the field (new mechanism, not a haze knob) — ref tabs_screenshot_05 — ours big_melee_5s
8. [S] battle-feel.e struck-reaction [2, spent] — blocker 1: needs the press crouch arm pose fixed first — ref trailer_3_sheet_01 r2c3 — ours press_clubbers_side

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
- 229 picks were [S] unit-look.h + [S] battle-feel.h. Skip [P]s on rows approved within 20 iterations. Arm angles: shoulder.x 0 = arm hanging, about -1.6 = level forward, -2.5 cocked overhead. 230 is a re-audit.
- Shield wall: carriers snap to ShieldSlot.at each step and are wallBraced (no crowd topple); every rank's boards ride the rank strip at 0.62 of neck height; the shield arm aims at the board back (_gripBoard). The blue wall men are hoplites with round boards (no tower shields in the wall shots).
- battle-feel.e: contact clubbers are limp 0.8-0.98 (toppled by braced hoplites), overriding the club pose; crowd_topple_clubber_vs_protector guards that topple.
- capture.mjs runs the showcase first and the regression set on a reloaded page, so `--only` looks equal full-run frames. Python edits: read/write bytes as utf-8 and keep the file's eol.
- Shadows pass, leave them. No raised idle lean, free-foot 0.08 or walk torso yaw. No [P] on SHOULDER_INSET, TRAPEZIUS_*, NECK_*, hull, pelvis, arm taper, ghost, bow ready, laurel, sunk crouch, CALF_SWELL, helm crown, lawn shade, carry bob, mammoth hull, spear carry, club heave.
