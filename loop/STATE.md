# Loop state
Iteration: 214   Last re-audit: 210   Consecutive rejects: 1   Branch: main

## Criteria (critic, PASS/FAIL per criterion; FAIL carries its closed blocker list and the count of approved [S] since the list was written)
battle-feel: a PASS b PASS c PASS d PASS (4/4)
unit-look: a PASS b PASS c PASS d PASS (4/4)
maps-light: a PASS b PASS c PASS d PASS (4/4)
ui-flow: a PASS b PASS c PASS d PASS (4/4)
camera: a PASS b PASS c PASS d PASS (4/4)
vfx: a PASS b PASS c PASS d PASS (4/4)
Tier 2 (fully scored at 198, re-audited 210):
battle-feel: e FAIL f PASS g PASS h FAIL (2/4)
- e FAIL [S since: 2] B: 1 no swing caught mid-arc against a target — closeup_weapon_reads (only sword knights, no clubber, no landed blow); 3 no press club caught landing on a man: side-on press_clubbers_side shows one club cocked and one driven level into the board face, none down on a head or body — press_clubbers_side, big_melee_9s. (2 struck 200) Ref trailer_3_sheet_01 r2c3.
- h FAIL [S since: 1, rejected since: 2] B: 1 under the shove only the lead red board of each rank faces the enemy, the rank's other boards hidden behind it, no lapped band at contact — shield_wall_2500ms, 2650ms; 4 blue (hoplite, round) boards seat face-on to the side camera, a mitt and a blade through the board face — shield_wall_side. (2, 3 struck 210; 5 struck 211) Ref tabs_screenshot_06, trailer_2_sheet_03 r2c3.
unit-look: e PASS f FAIL g PASS h FAIL (2/4)
- f FAIL [S since: 2] B: 1 mammoth ~2.5-2.9 men tall (ref ~3.5) — big_melee_result. (3 struck 199) Ref tabs_screenshot_01.
- h FAIL [S since: 1, rejected since: 2] B: 1 eyes do not read at lineup distance on bare-faced units; 3 beret and yellow cone ~1 head wide (ref ~2 heads, tabs_screenshot_05) — lineup_medieval. Ref tabs_screenshot_04.
maps-light: e FAIL f FAIL g PASS h PASS (2/4)
- e FAIL [S since: 0] B: 1 spooky tree ring is lime-green deciduous, a day meadow palette on purple ground (ref navy night, pink glow); 2 placement top-down only, team tints hide the ground, no battle-angle shot; 3 no spooky dressing (gravestones, dead trees, pink lights) — biome_spooky. Ref tabs_screenshot_03, 05.
- f FAIL [S since: 0] B: 1 corners no darker than centre (no vignette); 2 no distance haze, far trees as saturated as near grass — big_melee_5s. Ref tabs_screenshot_05, 01.
ui-flow: e PASS f PASS g FAIL h PASS (3/4)
- g FAIL [S since: 0] B: 1 levels are text cards in a centred two-column modal, not level nodes on a campaign map; 2 bold mixed-case sans, ref thin widely tracked white caps (tabs_screenshot_04); 3 a sentence of description per card, a wall of text, ref terse labels on empty screen — ui_campaign_select.
camera: e PASS f FAIL g PASS h PASS (3/4)
- f FAIL [S since: 0] B: 1 missing: a near-ground spectator camera rule looking up at the mammoth or a launch (none in web/src; confirmed 203).
vfx: e FAIL f PASS g FAIL h FAIL (1/4)
- e FAIL [S since: 1] B: 1 no whole solid ring or dome (198 ring shows a quarter arc behind a body) — closeup_state_reads; 2 Zeus held bolt is a pale yellow glow slab (ref white jagged slabs trailer_2_sheet_03 r3c2) — closeup_pair_zeus_thor. Ref trailer_2_sheet_03 r2c1.
- g FAIL [S since: 1] B: 2 no broken-gear debris (r1c2) — big_melee_5s, 9s. (1 struck 199) Ref trailer_2_sheet_02.
- h FAIL [S since: 1, rejected since: 2] B: 1 burst hard solid lobes, no soft fire envelope (ref trailer_3_sheet_03 r1c2) — war_machines_1100ms; 3 muzzle puff faceted spheres, no drifting smoke — 1250ms. (2 struck 200)
Total tier 1 24/24; tier 2 13/24.

## Focus (every gap this iteration)
BASE e2c6d41
- [S] battle-feel.h board-layers (33ccb05) — REJECT, reverted: red front reads as a two-layer square band head-on (shield_wall_front), but the two blue boards in shield_wall_side stay face-on and the contact pair still shows one board per rank
- [S] battle-feel.e press-downstroke — dropped uncommitted (counts as an attempt)

## Last verdicts (one line per gap, verbatim critic header)
- GAP: [S] board-layers (33ccb05) VERDICT: REJECT CRITERION: battle-feel.h FAIL (previous: FAIL)

## Ranked open gaps (max 8, tags and attempts in brackets; each clears a numbered blocker)
1. [S] battle-feel.h board-layers-both-walls [1] — blocker 4: the blue boards seen face-on in shield_wall_side seated on a rank strip, square and layered; probe first whether those blue men are slotted at all (fragmented walls, rank, toppled) — ref trailer_2_sheet_03 r2c3 — ours shield_wall_side
2. [S] battle-feel.h contact-band [0] — blocker 1: at contact the strip boards behind the lead one spread across their slots instead of stacking behind it, so the band shows in the flank pair — ref tabs_screenshot_06 — ours shield_wall_2500ms
3. [S] battle-feel.e press-downstroke [1] — blocker 3: a press clubber's overhead blow lands on a head or body over the board — ref trailer_3_sheet_01 r2c3 — ours press_clubbers_side
4. [S] unit-look.f mammoth-stature [2] — blocker 1: mammoth ~3.5 men tall, legs and tusks scaled with it — ref tabs_screenshot_01 — ours big_melee_result
5. [S] maps-light.f post-vignette [0] — blocker 1: a vignette post-process darkening the frame corners — ref tabs_screenshot_05 — ours big_melee_5s
6. [S] vfx.g gear-debris [1] — blocker 2: broken shield/helmet chunks thrown on death or impact — ref trailer_2_sheet_02 r1c2 — ours big_melee_5s
7. [S] camera.f spectator-low-shot [0] — blocker 1: a near-ground camera rule looking up at the mammoth or a launch — ref trailer_3_sheet_01 r1c2 — ours war_machines_1100ms
8. [S] vfx.e solid-ring [0] — blocker 1: a whole solid one-colour ring or dome round a magic unit — ref trailer_2_sheet_03 r2c1 — ours closeup_state_reads

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- board-layers [attempts: 1, [S]] — 214: square boards, every other one 0.07 forward: head-on band good, but blue boards beside the knights still face-on in the side shot
- board-axis-from-heading [attempts: 1, [S]] — 213: lap scaled by (1 - shove) on the strip path: blue boards unchanged face-on to the side camera; squaring removes the overlap
- press-club-lands [attempts: 2, [S], dropped] — 205-212, never committed: in contact clubbers topple, stood off they are speared before a chop lands
- lapped-band-at-contact [attempts: 2, [S], dropped] — 212: from the side one wall shows faces, the other backs; turning boards cannot make a side band
- wall-side-band [attempts: 1, [S]] — 209: end men wing boards out 0.9 rad, gap-side boards turn up to 0.6 rad: a turned disc does not move into the gap, torsos still show; wings read edge-on under the shove
- wall-board-yaw-from-frame [attempts: 1, [S]] — 208: rear-rank boards on their own lapped line square to the heading: side/2500/2650 still show two turned discs and ~6 bare torsos; a board covers half a man's width side-on
- wall-face-held-in-contact [attempts: 1, [S]] — 207: board seated across on its ShieldSlot.at (0.45 m reach), kept up under a stagger: front boards in shield_wall_side/2650ms still face a flank camera (yaw not square to the wall) with torsos between them
- dressed-front-under-shove [attempts: 2, [S]] — 204: front rank pulled onto its mean depth after the solver (0.35/step, 0.04 m cap): depth only, boards still split sideways, bodies still overlap at the line; no contact shot of the board faces

## Notes for next iteration (max 5 lines)
- 214 [S] pick was battle-feel.h (e dropped). 215 is a re-audit. battle-feel.h: 2 rejected [S] since its list was rewritten (213, 214); one more makes it plateau. The blue boards the critic sees face-on in shield_wall_side may belong to unslotted men: probe before touching boards again.
- Shield wall: carriers snap to ShieldSlot.at each step and are wallBraced (no crowd topple); every rank's boards ride the rank strip at 0.62 of neck height; the shield arm aims at the board back (_gripBoard). The blue wall men are hoplites with round boards (no tower shields in the wall shots).
- battle-feel.e: contact clubbers are limp 0.8-0.98 (toppled by braced hoplites), overriding the club pose; crowd_topple_clubber_vs_protector guards that topple.
- capture.mjs runs the showcase first and the regression set on a reloaded page, so `--only` looks equal full-run frames. Python edits: read/write bytes as utf-8 and keep the file's eol.
- Shadows pass, leave them. No raised idle lean, free-foot 0.08 or walk torso yaw. No [P] on SHOULDER_INSET, TRAPEZIUS_*, NECK_*, hull, pelvis, arm taper, ghost, bow ready, laurel, sunk crouch, CALF_SWELL, helm crown, lawn shade, carry bob, mammoth hull, spear carry, club heave.
