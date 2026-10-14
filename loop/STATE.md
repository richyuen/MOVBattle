# Loop state
Iteration: 225   Last re-audit: 225   Consecutive rejects: 0   Branch: main

## Criteria (critic, PASS/FAIL per criterion; FAIL carries its closed blocker list and the count of approved [S] since the list was written)
battle-feel: a PASS b PASS c PASS d PASS (4/4)
unit-look: a PASS b PASS c PASS d PASS (4/4)
maps-light: a PASS b PASS c PASS d PASS (4/4)
ui-flow: a PASS b PASS c PASS d PASS (4/4)
camera: a PASS b PASS c PASS d PASS (4/4)
vfx: a PASS b PASS c PASS d PASS (4/4)
Tier 2 (fully scored at 198, re-audited 220, 225):
battle-feel: e FAIL f PASS g PASS h FAIL (2/4)
- e FAIL (rewritten 225, plateau cleared) [S since: 0] B: 1 no club comes down on a board top, head or shoulder: one held upright over the red boards, one jammed level at chest height into air, one cocked behind the head; no struck man reacts — press_clubbers_side; 2 red clubs a held-windup forest (3-4 at 70-80 deg, rest ~45), none past the head or descending — big_melee_5s, 9s; 3 every hoplite spear a vertical picket, none levelled or thrust over the boards — shield_wall_side, _front, 2500ms, 2650ms; 4 swords upright before the chest or trailed at the hip, none mid-arc — closeup_weapon_reads. Ref trailer_3_sheet_01 r2c3, r3c1.
- h FAIL (rewritten 225, plateau cleared) [S since: 0] B: 1 blue boards show full faces to the side lens while red boards angle to the foe; red bodies side-on between red boards — shield_wall_side; 2 pressed red block interpenetrates, helmets merged two-three deep — 2500ms, 2650ms; 3 blue knights fold into the blue board row, blades and mitts crossing the boards — shield_wall_side; 4 red band bows into an arc (right wing ~45 deg back), boards bolt upright, men not pressing into a stride — shield_wall_front. Ref tabs_screenshot_06.
unit-look: e PASS f PASS g PASS h FAIL (3/4)
- h FAIL [S since: 2, rejected since: 2] B: 3 beret and yellow cone ~1.5 heads wide, small on the head (ref ~2 heads, tabs_screenshot_05) — lineup_medieval. (1 struck 218) Ref tabs_screenshot_04.
maps-light: e FAIL f FAIL g PASS h PASS (2/4)
- e FAIL [S since: 2] B: 2 placement top-down only, full-half team tints hide the ground; no low tint-free spooky shot — biome_spooky. (1 struck 225, 3 struck 224) Ref tabs_screenshot_03, 05, 09.
- f FAIL [S since: 2, rejected since: 1] B: 2 ring canopies full-saturation, same strength as the field (ridges hazed 223) — big_melee_5s, spell_dome. (1 struck 215) Ref tabs_screenshot_05, 01.
ui-flow: e PASS f PASS g PASS h PASS (4/4)
camera: e PASS f PASS g PASS h PASS (4/4)
vfx: e PASS f PASS g PASS h PASS (4/4)
Total tier 1 24/24; tier 2 19/24.

## Focus (every gap this iteration)
BASE 9d6f2a8 (re-audit 225: no flips; battle-feel.e and .h lists rewritten, plateau cleared)
- [S] maps-light.e spooky-canopy (ec4315c) — APPROVE, blocker 1 struck
- [S] ui-flow.g campaign-map (bc5fc98) — APPROVE, blockers 1-3 struck, ui-flow.g PASS

## Last verdicts (one line per gap, verbatim critic header)
- GAP: [S] spooky-canopy (ec4315c) VERDICT: APPROVE CRITERION: maps-light.e FAIL (previous: FAIL)
- GAP: [S] campaign-map (bc5fc98) VERDICT: APPROVE CRITERION: ui-flow.g PASS (previous: FAIL)

## Ranked open gaps (max 8, tags and attempts in brackets; each clears a numbered blocker)
1. [S] battle-feel.e overhead-strike [0] — blocker 1: overhead club strike landing on board top, head or shoulder, plus a reaction from the man struck — ref trailer_3_sheet_01 r2c3 — ours press_clubbers_side
2. [S] battle-feel.h block-separation [0] — blocker 2: hard separation in the pressed block, one body per slot two deep, helmets never merge — ref tabs_screenshot_06 — ours shield_wall_2500ms
3. [S] maps-light.e low-spooky-shot [0] — blocker 2: low-angle tint-free spooky battle shot (navy ground, dead-tree skyline); evidence + zone overlay — ref tabs_screenshot_09 — ours biome_spooky
4. [S] unit-look.h hat-geometry [0] — blocker 3: beret and cone ~2 heads wide, seated over the brow — ref tabs_screenshot_05 — ours lineup_medieval
5. [S] maps-light.f canopy-pastel [0] — blocker 2: desaturating distance pass on ring canopies toward the sky colour (not a haze knob) — ref tabs_screenshot_05 — ours big_melee_5s
6. [S] battle-feel.e spear-level [0] — blocker 3: hoplite spears levelled and thrust over the boards — ref trailer_3_sheet_01 r3c1 — ours shield_wall_side
7. [S] battle-feel.h blue-boards-face [0] — blocker 1: blue boards turned to the foe, edges lapped, bodies behind — ref tabs_screenshot_06 — ours shield_wall_side
8. [P] maps-light.e spooky-leaves fallout of 225 spooky-canopy [0] — leaves 0.2,0.22,0.4 -> 0.12,0.13,0.26 with crown emissive capped for the theme — NEXT shot biome_spooky: flank crowns lavender -> dark navy

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- haze-near [attempts: 1, [P]] — 224: BACKDROP_HAZE_NEAR 26 -> 18: crowns not visibly paler; ledger reversal of a 223 row
- committed-blow v2 [attempts: 2, [R]] — 222: crown-aimed arm and club over the descent + hold, no-topple window, spear drop: aim never caught in a frame (weight follows the ease, short hold)
- committed-blow [attempts: 1, [R]] — 221: arm drop 0.9 + hold + no-topple window + spear lunge drop: only the spears read (1 of 4); the landed club stays overhead
- dust-under-fire [attempts: 1, [P]] — 221: dust 0.45, body 0.95: fire still under the dust; needs draw order
- backdrop-haze [attempts: 1, [S]] — 219: far* fog on (good) + HAZE_DEPTH 60: ledger reversal of the 215 haze row and a milky ring; resubmit the flip alone with a ring-owned tint
- envelope-colour [attempts: 1, [P]] — 218: pale core/outer colours at alpha 0.95 rendered mustard/dark orange with hard octagons; needs an [S] (unlit/additive core over the smoke)

## Notes for next iteration (max 5 lines)
- 225 picks were [S] maps-light.e + [S] ui-flow.g (after re-audit). battle-feel.e/.h plateau cleared by the 225 rewrite: [S] pickable again (the committed-blow [R] gap is spent). ui-flow fallout [P]: campaign card caption cut mid-word, card overlaps node 11/12 labels.
- Shield wall: carriers snap to ShieldSlot.at each step and are wallBraced (no crowd topple); every rank's boards ride the rank strip at 0.62 of neck height; the shield arm aims at the board back (_gripBoard). The blue wall men are hoplites with round boards (no tower shields in the wall shots).
- battle-feel.e: contact clubbers are limp 0.8-0.98 (toppled by braced hoplites), overriding the club pose; crowd_topple_clubber_vs_protector guards that topple.
- capture.mjs runs the showcase first and the regression set on a reloaded page, so `--only` looks equal full-run frames. Python edits: read/write bytes as utf-8 and keep the file's eol.
- Shadows pass, leave them. No raised idle lean, free-foot 0.08 or walk torso yaw. No [P] on SHOULDER_INSET, TRAPEZIUS_*, NECK_*, hull, pelvis, arm taper, ghost, bow ready, laurel, sunk crouch, CALF_SWELL, helm crown, lawn shade, carry bob, mammoth hull, spear carry, club heave.
