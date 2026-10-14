# Loop state
Iteration: 208   Last re-audit: 205   Consecutive rejects: 2   Branch: main

## Criteria (critic, PASS/FAIL per criterion; FAIL carries its closed blocker list and the count of approved [S] since the list was written)
battle-feel: a PASS b PASS c PASS d PASS (4/4)
unit-look: a PASS b PASS c PASS d PASS (4/4)
maps-light: a PASS b PASS c PASS d PASS (4/4)
ui-flow: a PASS b PASS c PASS d PASS (4/4)
camera: a PASS b PASS c PASS d PASS (4/4)
vfx: a PASS b PASS c PASS d PASS (4/4)
Tier 2 (fully scored at 198, re-audited 205):
battle-feel: e FAIL f PASS g FAIL h FAIL (1/4)
- e FAIL [S since: 2] B: 1 no swing caught mid-arc against a target — closeup_weapon_reads (only sword knights, no clubber, no landed blow); 3 no press club caught landing on a man: side-on press_clubbers_side shows one club cocked and one driven level into the board face, none down on a head or body — press_clubbers_side, big_melee_9s. (2 struck 200) Ref trailer_3_sheet_01 r2c3.
- g FAIL [S since: 0] B: 1 landing not shown: flung knights out of frame at war_machines_3800ms, no landed spread of varied poses. Ref trailer_2_sheet_02 r1c2.
- h FAIL [S since: 3] B: 1 under the shove the front boards turn and split sideways into separate discs with torsos between them, not one lapped face (the heap and flat-tipped boards cleared 206) — shield_wall_side, 2650ms. (2 struck 205) Ref tabs_screenshot_06.
unit-look: e PASS f FAIL g PASS h FAIL (2/4)
- f FAIL [S since: 2] B: 1 mammoth ~2.5-2.9 men tall (ref ~3.5) — big_melee_result. (3 struck 199) Ref tabs_screenshot_01.
- h FAIL [S since: 1] B: 1 eyes do not read at lineup distance on bare-faced units; 3 beret and yellow cone ~1 head wide (ref ~2 heads, tabs_screenshot_05) — lineup_medieval. Ref tabs_screenshot_04.
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
- h FAIL [S since: 1] B: 1 burst hard solid lobes, no soft fire envelope (ref trailer_3_sheet_03 r1c2) — war_machines_1100ms; 3 muzzle puff faceted spheres, no drifting smoke — 1250ms. (2 struck 200)
Total tier 1 24/24; tier 2 12/24.

## Focus (every gap this iteration)
BASE 86a9dd9
- [S] battle-feel.h wall-board-yaw-from-frame (63b3712) — REJECT, reverted
- [S] battle-feel.e club-overhead-strike — dropped uncommitted after a probe: clubbers in contact are mostly limp 0.8-0.98 (staggered/toppled by the braced hoplites), which overrides the club pose

## Last verdicts (one line per gap, verbatim critic header)
- GAP: [S] wall-board-yaw-from-frame (63b3712) VERDICT: REJECT CRITERION: battle-feel.h FAIL (previous: FAIL)

## Ranked open gaps (max 8, tags and attempts in brackets; each clears a numbered blocker)
1. [S] battle-feel.h wall-side-band [0] — blocker 1: a side-view board cover: end and gap boards turn and overlap toward an open neighbour gap so the side view is one rim-over-rim band from the first man to the last — ref tabs_screenshot_06 — ours shield_wall_2650ms, shield_wall_side
2. [S] battle-feel.e club-overhead-strike [0] — blocker 3: an overhead strike that drives the club down onto a head or shoulder at contact, not level into a board face; the striker must not be limp at the hit (contact clubbers are limp 0.8-0.98) — ref trailer_3_sheet_01 r2c3 — ours press_clubbers_side
3. [S] battle-feel.g landed-pose-spread [1] — blocker 1: framing or landing-state shot of flung knights on the ground in varied poses — ref trailer_2_sheet_02 r1c2 — ours war_machines_3800ms
4. [S] unit-look.f mammoth-scale [2] — blocker 1: mammoth ~3.5 men tall, readable legs and tusks — ref tabs_screenshot_01 — ours big_melee_result
5. [S] vfx.h soft-fire-envelope [0] — blocker 1: soft sprite fire and smoke shell round the burst lobes, drifting muzzle smoke — ref trailer_3_sheet_03 r1c2 — ours war_machines_1100ms
6. [S] vfx.e solid-ring-dome [0] — blocker 1: a one-colour solid ring or dome mesh for magic states — ref trailer_2_sheet_03 r3c2 — ours closeup_state_reads
7. [S] maps-light.f vignette-haze [0] — blocker 1: vignette post-process plus distance haze — ref tabs_screenshot_05 — ours big_melee_5s
8. [S] camera.f spectator-low-shot [0] — blocker 1: near-ground camera rule looking up at the mammoth or a launch — ref trailer_3_sheet_01 r1c2 — ours (no shot)

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- wall-board-yaw-from-frame [attempts: 1, [S]] — 208: rear-rank boards on their own lapped line square to the heading: side/2500/2650 still show two turned discs and ~6 bare torsos; a board covers half a man's width side-on
- wall-face-held-in-contact [attempts: 1, [S]] — 207: board seated across on its ShieldSlot.at (0.45 m reach), kept up under a stagger: front boards in shield_wall_side/2650ms still face a flank camera (yaw not square to the wall) with torsos between them
- dressed-front-under-shove [attempts: 2, [S]] — 204: front rank pulled onto its mean depth after the solver (0.35/step, 0.04 m cap): depth only, boards still split sideways, bodies still overlap at the line; no contact shot of the board faces
- lapped-boards-in-contact [attempts: 1, [S]] — 203: front-rank dress step onto the live line + board back clamp -0.7: men still three or four depths deep under the shove, boards flat or edge-on, boards trail behind bearers
- lapped-shield-boards [attempts: 1, [S]] — 201: front boards on one plane 0.42 ahead of the rank line, lap 0.22; in the full capture still separate discs at different depths, the front shot stood behind blue
- press-club-phase [attempts: 1, [P]] — 201: heave 0.12 -> 0.6 per-man phase: ledger reversal of the 200 row; sway, not a blow landing
- mammoth-trunk [attempts: 1, [S]] — 198: 8-knot hanging tube in hide purple off the neck: blends into the chest, sits behind the tusk arc; salmon cheek panel left; 0.05 m knot rings too thin to read (199 retry approved)
- wall-shafts-share-one-heading [attempts: 1, [S]] — 196: heading only while levelSpearAt fires; pitch band and rear strike drop still fan shafts

## Notes for next iteration (max 5 lines)
- 208 [S] pick was battle-feel.h (e dropped); 209 must not repeat h alone. Consecutive rejects 2: one more all-reject iteration writes STOP. battle-feel.h: approved 202/205/206, rejected 201/203/204/207/208; probe (208) showed front boards fully lapped (lap 1, yaw heading+0.22) - the side-view gaps are board coverage, not yaw.
- battle-feel.e: probe (208) in gallery_press_clubbers at 2.6 s: clubbers in shove contact are limp 0.8-0.98 (toppled by braced hoplites), so the club pose is overridden; idle/ready ones hold the cock. A landed blow needs strikers that stay on their feet at contact.
- capture.mjs runs the showcase first and the regression set on a reloaded page, so `--only` looks equal full-run frames. Gallery shots stop advancing at Result. A war_machines salvo kills ~1 squire.
- Probe animator branches with console.error -> look/summary.json consoleErrors. Python edits: read/write bytes as utf-8 and keep the file's eol.
- Shadows pass, leave them. No raised idle lean, free-foot 0.08 or walk torso yaw. No [P] on SHOULDER_INSET, TRAPEZIUS_*, NECK_*, hull, pelvis, arm taper, ghost, bow ready, laurel, sunk crouch, CALF_SWELL, helm crown, lawn shade, carry bob, mammoth hull, spear carry, club heave.
