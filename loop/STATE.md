# Loop state
Iteration: 220   Last re-audit: 220   Consecutive rejects: 0   Branch: main

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
- f FAIL [S since: 1, rejected since: 1] B: 2 no distance haze: far tree ring and navy mountains as saturated and dark as the field — big_melee_5s, spell_dome. (1 struck 215) Ref tabs_screenshot_05, 01.
ui-flow: e PASS f PASS g FAIL h PASS (3/4)
- g FAIL [S since: 0] B: 1 levels are text cards in a centred modal, not level nodes on a map; 2 bold mixed-case sans, ref thin tracked white caps; 3 a sentence per card, a wall of text — ui_campaign_select. Ref tabs_screenshot_04.
camera: e PASS f FAIL g PASS h PASS (3/4)
- f FAIL [S since: 0] B: 1 missing: a near-ground spectator camera rule looking up at the mammoth or a launch.
vfx: e PASS f PASS g PASS h FAIL (3/4)
- h FAIL [S since: 0] B: 1 at 1100ms the burst body is a broad tan dust fog: normally blended dust sprites drawn over the additive fire wash it out, the fireball never reads — war_machines_1100ms; 2 flung bodies hang greyed in dull tan haze, not dark against a bright blast — 1100ms, 1250ms. (3, 4 struck 220 by the [R]; plateau cleared) Ref trailer_3_sheet_03 r1c1, r1c2.
Total tier 1 24/24; tier 2 16/24.

## Focus (every gap this iteration)
BASE 3a9a82b (re-audit 220: no flips; vfx.h plateau, lists of e, h and vfx.h rewritten)
- [R] vfx.h cannon-impact-burst (fbbff07) — APPROVE, blockers 3 and 4 struck, plateau cleared, criterion still FAIL
- [S] unit-look.f giant-scale (4447d21) — APPROVE, blocker 1 struck, unit-look.f PASS

## Last verdicts (one line per gap, verbatim critic header)
- GAP: [R] cannon-impact-burst (fbbff07) VERDICT: APPROVE CRITERION: vfx.h FAIL (previous: FAIL)
- GAP: [S] giant-scale (4447d21) VERDICT: APPROVE CRITERION: unit-look.f PASS (previous: FAIL)

## Ranked open gaps (max 8, tags and attempts in brackets; each clears a numbered blocker)
1. [R] battle-feel.e swing-arc [0] — blockers 1-4: keyed windup-apex-descent-contact arc per weapon class (club overhead to board top, spear thrust from behind boards) — ref trailer_3_sheet_01 r2c3 — ours press_clubbers_side, big_melee_5s
2. [R] battle-feel.h wall-under-shove [0] — blockers 1-4: both teams' boards one enemy-facing overlapping surface with hard man-to-man separation; add shield_wall_front at contact — ref tabs_screenshot_06 — ours shield_wall_side, 2650ms
3. [S] camera.f spectator-low [0] — blocker 1: near-ground camera rule looking up at the mammoth or a cannon launch, plus a new shot — ref trailer_3_sheet_01 r1c2 — ours big_melee_9s
4. [S] maps-light.e spooky-biome [0] — blockers 1-3: navy-night palette, dead-tree ring, gravestones, pink lights — ref tabs_screenshot_03, 05 — ours biome_spooky
5. [S] maps-light.f far-haze [1] — blocker 2: depth-keyed fog on the tree ring and mountains (not HAZE_*) — ref tabs_screenshot_05 — ours big_melee_5s
6. [S] ui-flow.g campaign-map [0] — blocker 1: level nodes over a map image instead of text cards — ref tabs_screenshot_04 — ours ui_campaign_select
7. [S] unit-look.h hat-oversize [0] — blocker 3: beret and cone ~2 heads wide, seated on the head — ref tabs_screenshot_05 — ours lineup_medieval
8. [P] vfx.h dust-under-fire [0] — fallout of [R] cannon-impact-burst (approved 220): burstDust peak 0.8 -> 0.45, lift 0.25 -> 0.1; fireBody peak 0.7 -> 0.95 — NEXT shot: war_machines_1100ms, a pale-yellow fireball behind the flung bodies and the tan fog a ground band

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- backdrop-haze [attempts: 1, [S]] — 219: far* fog on (good) + HAZE_DEPTH 60: ledger reversal of the 215 haze row and a milky ring; resubmit the flip alone with a ring-owned tint
- envelope-colour [attempts: 1, [P]] — 218: pale core/outer colours at alpha 0.95 rendered mustard/dark orange with hard octagons; needs an [S] (unlit/additive core over the smoke)
- shed-gear [attempts: 1, [S]] — 216: shield/weapon cloned off the hands, laid flat at y 0.04 beside the corpse: hidden by grass cards. Clones keep the source parent (set parent null); skip the rHandM mitt
- board-layers [attempts: 1, [S]] — 214: square boards, every other one 0.07 forward: head-on band good, but blue boards beside the knights still face-on in the side shot
- board-axis-from-heading [attempts: 1, [S]] — 213: lap scaled by (1 - shove) on the strip path: blue boards unchanged face-on to the side camera; squaring removes the overlap

## Notes for next iteration (max 5 lines)
- 220 picks were [R] vfx.h + [S] unit-look.f. battle-feel.e and .h are plateau (rewritten 220): only [R] on them, one [R] per iteration. A value change bundled into an [S] on an approved row within 20 iterations is a ledger reversal: give it its own mechanism.
- Shield wall: carriers snap to ShieldSlot.at each step and are wallBraced (no crowd topple); every rank's boards ride the rank strip at 0.62 of neck height; the shield arm aims at the board back (_gripBoard). The blue wall men are hoplites with round boards (no tower shields in the wall shots).
- battle-feel.e: contact clubbers are limp 0.8-0.98 (toppled by braced hoplites), overriding the club pose; crowd_topple_clubber_vs_protector guards that topple.
- capture.mjs runs the showcase first and the regression set on a reloaded page, so `--only` looks equal full-run frames. Python edits: read/write bytes as utf-8 and keep the file's eol.
- Shadows pass, leave them. No raised idle lean, free-foot 0.08 or walk torso yaw. No [P] on SHOULDER_INSET, TRAPEZIUS_*, NECK_*, hull, pelvis, arm taper, ghost, bow ready, laurel, sunk crouch, CALF_SWELL, helm crown, lawn shade, carry bob, mammoth hull, spear carry, club heave.
