# Loop state
Iteration: 226   Last re-audit: 225   Consecutive rejects: 0   Branch: main

## Criteria (critic, PASS/FAIL per criterion; FAIL carries its closed blocker list and the count of approved [S] since the list was written)
battle-feel: a PASS b PASS c PASS d PASS (4/4)
unit-look: a PASS b PASS c PASS d PASS (4/4)
maps-light: a PASS b PASS c PASS d PASS (4/4)
ui-flow: a PASS b PASS c PASS d PASS (4/4)
camera: a PASS b PASS c PASS d PASS (4/4)
vfx: a PASS b PASS c PASS d PASS (4/4)
Tier 2 (fully scored at 198, re-audited 220, 225):
battle-feel: e FAIL f PASS g PASS h FAIL (2/4)
- e FAIL (rewritten 225) [S since: 1] B: 1 press clubs now mostly landed (226) but they land at the striker's hip or short in the air at chest height, not on a board top or head; no struck man visibly reacts — press_clubbers_side; 2 red clubs partly eased (226) but 2-3 still bolt upright behind the line, none descending onto the boards — big_melee_5s, 9s; 3 every hoplite spear a vertical picket, none levelled or thrust over the boards — shield_wall_side, _front, 2500ms, 2650ms; 4 swords upright before the chest or trailed at the hip, none mid-arc — closeup_weapon_reads. Ref trailer_3_sheet_01 r2c3, r3c1.
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
BASE f3da5de
- [S] battle-feel.e overhead-strike (e828e99) — APPROVE, no blocker struck (press now landed-dominant; clubs land low/short, flinch not visible)
- [S] battle-feel.h block-separation — DROPPED uncommitted: a hard positional non-overlap pass after the slot snap (all, then same-team only) fought the slot snap and slid the whole wall out of the 2500/2650 frames
- [P] maps-light.e spooky-leaves (d0fe77d) — REJECT, reverted: ledger reversal of the 225 ring-palette row (crowns now sink into the team tints)

## Last verdicts (one line per gap, verbatim critic header)
- GAP: [S] overhead-strike (e828e99) VERDICT: APPROVE CRITERION: battle-feel.e FAIL (previous: FAIL)
- GAP: [P] spooky-leaves (d0fe77d) VERDICT: REJECT CRITERION: maps-light.e FAIL (previous: FAIL)

## Ranked open gaps (max 8, tags and attempts in brackets; each clears a numbered blocker)
1. [S] battle-feel.e overhead-strike-aim [0] — blocker 1: landed press-blow pose solved from the target's distance and head/board-top height, plus a visible stagger flinch (head back + half step back) — ref trailer_3_sheet_01 r2c3 — ours press_clubbers_side
2. [S] maps-light.e spooky-battle-shot [0] — blocker 2: low battle-camera spooky shot with zone tints faded once the battle starts — ref tabs_screenshot_09 — ours biome_spooky
3. [S] battle-feel.h press-separation [1] — blocker 2: hard separation between pressed shield men; must move the slots, not fight the snap (226 dropped) — ref tabs_screenshot_06 — ours shield_wall_2500ms
4. [S] maps-light.f ring-crown-recede [0] — blocker 2: desaturate/lift pass on ring canopies by distance — ref tabs_screenshot_05 — ours big_melee_5s
5. [S] unit-look.h hat-to-head [0] — blocker 3: hats sized from head width (~2 heads), seated by a brim ring at the brow — ref tabs_screenshot_04 — ours lineup_medieval
6. [S] battle-feel.e spear-over-boards [0] — blocker 3: rear rank levels and thrusts spears over the boards — ref trailer_3_sheet_01 r3c1 — ours shield_wall_side
7. [S] battle-feel.h board-facing [0] — blocker 1: boards turned to face the foe, bodies squared behind — ref tabs_screenshot_06 — ours shield_wall_side
8. [S] battle-feel.e sword-arc [0] — blocker 4: a sword stroke with a mid-arc frame across the body — ref trailer_3_sheet_01 r2c3 — ours closeup_weapon_reads

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- spooky-leaves [attempts: 1, [P]] — 226: ledger reversal of the 225 row; crowns sink into the team tints
- block-separation [attempts: 1, dropped] — 226: hard non-overlap after the slot snap fights the snap; wall slides out of frame
- haze-near [attempts: 1, [P]] — 224: BACKDROP_HAZE_NEAR 26 -> 18: crowns not visibly paler; ledger reversal of a 223 row
- committed-blow v2 [attempts: 2, [R]] — 222: crown-aimed arm and club over the descent + hold, no-topple window, spear drop: aim never caught in a frame (weight follows the ease, short hold)
- committed-blow [attempts: 1, [R]] — 221: arm drop 0.9 + hold + no-topple window + spear lunge drop: only the spears read (1 of 4); the landed club stays overhead
- dust-under-fire [attempts: 1, [P]] — 221: dust 0.45, body 0.95: fire still under the dust; needs draw order
- backdrop-haze [attempts: 1, [S]] — 219: far* fog on (good) + HAZE_DEPTH 60: ledger reversal of the 215 haze row and a milky ring; resubmit the flip alone with a ring-owned tint
- envelope-colour [attempts: 1, [P]] — 218: pale core/outer colours at alpha 0.95 rendered mustard/dark orange with hard octagons; needs an [S] (unlit/additive core over the smoke)

## Notes for next iteration (max 5 lines)
- 226 picks were [S] battle-feel.e + [S] battle-feel.h (dropped) + [P]. Critic now rejects any [P] on a row approved within 20 iterations, even one it ranked (224, 226): skip such [P]s. Working copies are CRLF (core.autocrlf true); index stays LF.
- Shield wall: carriers snap to ShieldSlot.at each step and are wallBraced (no crowd topple); every rank's boards ride the rank strip at 0.62 of neck height; the shield arm aims at the board back (_gripBoard). The blue wall men are hoplites with round boards (no tower shields in the wall shots).
- battle-feel.e: contact clubbers are limp 0.8-0.98 (toppled by braced hoplites), overriding the club pose; crowd_topple_clubber_vs_protector guards that topple.
- capture.mjs runs the showcase first and the regression set on a reloaded page, so `--only` looks equal full-run frames. Python edits: read/write bytes as utf-8 and keep the file's eol.
- Shadows pass, leave them. No raised idle lean, free-foot 0.08 or walk torso yaw. No [P] on SHOULDER_INSET, TRAPEZIUS_*, NECK_*, hull, pelvis, arm taper, ghost, bow ready, laurel, sunk crouch, CALF_SWELL, helm crown, lawn shade, carry bob, mammoth hull, spear carry, club heave.
