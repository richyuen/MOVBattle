# Loop state
Iteration: 223   Last re-audit: 220   Consecutive rejects: 0   Branch: main

## Criteria (critic, PASS/FAIL per criterion; FAIL carries its closed blocker list and the count of approved [S] since the list was written)
battle-feel: a PASS b PASS c PASS d PASS (4/4)
unit-look: a PASS b PASS c PASS d PASS (4/4)
maps-light: a PASS b PASS c PASS d PASS (4/4)
ui-flow: a PASS b PASS c PASS d PASS (4/4)
camera: a PASS b PASS c PASS d PASS (4/4)
vfx: a PASS b PASS c PASS d PASS (4/4)
Tier 2 (fully scored at 198, re-audited 220):
battle-feel: e FAIL f PASS g PASS h FAIL (2/4)
- e FAIL plateau (rewritten 220) [S since: 0] B: 1 no club comes down on a board top, head or shoulder; overhead windup held, others jammed level into the board face — press_clubbers_side; 2 red clubs lean ~45 deg as a uniform forest, none at the top of a windup or descending — big_melee_5s, 9s; 3 hoplite spears vertical at contact, none thrust from behind the boards — shield_wall_2500ms, 2650ms; 4 knights' swords upright or trailed, no swing mid-arc — closeup_weapon_reads. Ref trailer_3_sheet_01 r2c3.
- h FAIL plateau (rewritten 220) [S since: 0] B: 1 blue hoplite boards face the side lens while red boards angle toward the foe — shield_wall_side, 2650ms; 2 pressed red block interpenetrates, helmets merged two and three deep — 2500ms, 2650ms; 3 blue knights overlap and their blades and mitts cross the blue board row — shield_wall_side; 4 no evidence of the band under shove from the enemy side: add shield_wall_front at contact. Ref tabs_screenshot_06.
unit-look: e PASS f PASS g PASS h FAIL (3/4)
- h FAIL [S since: 2, rejected since: 2] B: 3 beret and yellow cone ~1.5 heads wide, small on the head (ref ~2 heads, tabs_screenshot_05) — lineup_medieval. (1 struck 218) Ref tabs_screenshot_04.
maps-light: e FAIL f FAIL g PASS h PASS (2/4)
- e FAIL [S since: 0] B: 1 spooky tree ring lime-green deciduous on purple ground (ref navy night, pink glow); 2 placement top-down only, team tints hide the ground; 3 no spooky dressing (gravestones, dead trees, pink lights) — biome_spooky. Ref tabs_screenshot_03, 05, 09.
- f FAIL [S since: 2, rejected since: 1] B: 2 ring trees as saturated as the field (ridges now hazed, 223) — big_melee_5s, spell_dome. (1 struck 215) Ref tabs_screenshot_05, 01.
ui-flow: e PASS f PASS g FAIL h PASS (3/4)
- g FAIL [S since: 0] B: 1 levels are text cards in a centred modal, not level nodes on a map; 2 bold mixed-case sans, ref thin tracked white caps; 3 a sentence per card, a wall of text — ui_campaign_select. Ref tabs_screenshot_04.
camera: e PASS f PASS g PASS h PASS (4/4)
vfx: e PASS f PASS g PASS h FAIL (3/4)
- h FAIL [S since: 2] B: 2 flung bodies inside or past the set-back fire still washed pale by the additive core, and smoke drawn over them greys them — war_machines_1100ms, 1250ms (bodies in front now dark, 223). (1 struck 222, 3 and 4 struck 220) Ref trailer_3_sheet_03 r1c2.
Total tier 1 24/24; tier 2 17/24.

## Focus (every gap this iteration)
BASE 3bfff72
- [S] vfx.h fire-behind-bodies (ef44bea) — APPROVE, blocker 2 not struck (bodies in front read dark; inside/behind still pale)
- [S] maps-light.f distance-haze (5a79702) — APPROVE, blocker 2 not struck (ridges hazed, ring trees not)

## Last verdicts (one line per gap, verbatim critic header)
- GAP: [S] fire-behind-bodies (ef44bea) VERDICT: APPROVE CRITERION: vfx.h FAIL (previous: FAIL)
- GAP: [S] distance-haze (5a79702) VERDICT: APPROVE CRITERION: maps-light.f FAIL (previous: FAIL)

## Ranked open gaps (max 8, tags and attempts in brackets; each clears a numbered blocker)
1. [S] vfx.h bodies-over-fire [0] — blocker 2: flung ragdolls drawn after the fire and smoke sprites (render group or draw order) so additive light and smoke never tint them — ref trailer_3_sheet_03 r1c2 — ours war_machines_1100ms
2. [P] maps-light.f distance-haze fallout of 223 [0] — blocker 2: BACKDROP_HAZE_NEAR 26 -> 18 (keep FAR 80, MAX 0.55) — NEXT shot spell_dome: ring tree crowns paler than the field
3. [S] maps-light.e spooky-dressing [0] — blocker 3: gravestones, dead bare trees, pink lantern lights — ref tabs_screenshot_09 — ours biome_spooky
4. [S] maps-light.e spooky-ring [0] — blocker 1: spooky tree species and pink-lit navy palette replacing the lime ring — ref tabs_screenshot_03 — ours biome_spooky
5. [S] unit-look.h hat-scale [0] — blocker 3: beret and cone ~2 heads wide, seated low — ref tabs_screenshot_05 — ours lineup_medieval
6. [S] ui-flow.g campaign-map [0] — blocker 1: level nodes on a map instead of text cards — ref tabs_screenshot_04 — ours ui_campaign_select
7. [R] battle-feel.h wall-band [0] — blockers 1-4: boards face the foe as one lapped surface, no interpenetration — ref tabs_screenshot_06 — ours shield_wall_side
8. [R] battle-feel.e committed-blow-v3 [2] — spent until the 225 re-audit — ref trailer_3_sheet_01 r2c3 — ours press_clubbers_side

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- committed-blow v2 [attempts: 2, [R]] — 222: crown-aimed arm and club over the descent + hold, no-topple window, spear drop: aim never caught in a frame (weight follows the ease, short hold)
- committed-blow [attempts: 1, [R]] — 221: arm drop 0.9 + hold + no-topple window + spear lunge drop: only the spears read (1 of 4); the landed club stays overhead
- dust-under-fire [attempts: 1, [P]] — 221: dust 0.45, body 0.95: fire still under the dust; needs draw order
- backdrop-haze [attempts: 1, [S]] — 219: far* fog on (good) + HAZE_DEPTH 60: ledger reversal of the 215 haze row and a milky ring; resubmit the flip alone with a ring-owned tint
- envelope-colour [attempts: 1, [P]] — 218: pale core/outer colours at alpha 0.95 rendered mustard/dark orange with hard octagons; needs an [S] (unlit/additive core over the smoke)

## Notes for next iteration (max 5 lines)
- 223 picks were [S] vfx.h + [S] maps-light.f; 224 must not repeat that pair. A MaterialPluginBase put on a cloned material must be RegisterClass("BABYLON.<Name>") or startup throws. 225 is a re-audit.
- Shield wall: carriers snap to ShieldSlot.at each step and are wallBraced (no crowd topple); every rank's boards ride the rank strip at 0.62 of neck height; the shield arm aims at the board back (_gripBoard). The blue wall men are hoplites with round boards (no tower shields in the wall shots).
- battle-feel.e: contact clubbers are limp 0.8-0.98 (toppled by braced hoplites), overriding the club pose; crowd_topple_clubber_vs_protector guards that topple.
- capture.mjs runs the showcase first and the regression set on a reloaded page, so `--only` looks equal full-run frames. Python edits: read/write bytes as utf-8 and keep the file's eol.
- Shadows pass, leave them. No raised idle lean, free-foot 0.08 or walk torso yaw. No [P] on SHOULDER_INSET, TRAPEZIUS_*, NECK_*, hull, pelvis, arm taper, ghost, bow ready, laurel, sunk crouch, CALF_SWELL, helm crown, lawn shade, carry bob, mammoth hull, spear carry, club heave.
