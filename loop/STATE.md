# Loop state
Iteration: 207   Last re-audit: 205   Consecutive rejects: 1   Branch: main

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
BASE 590560f
- [S] battle-feel.h wall-face-held-in-contact (7462e2e) — REJECT, reverted
- [S] battle-feel.e club-overhead-strike — dropped uncommitted (third time): CHOP_ARM_DROP 0.9, CHOP_TRUNK 0.3, CHOP_HOLD 0.45, press-blow flinch; side shot still showed a club level at waist height

## Last verdicts (one line per gap, verbatim critic header)
- GAP: [S] wall-face-held-in-contact (7462e2e) VERDICT: REJECT CRITERION: battle-feel.h FAIL (previous: FAIL)

## Ranked open gaps (max 8, tags and attempts in brackets; each clears a numbered blocker)
1. [S] battle-feel.h wall-board-yaw-from-frame [0] — blocker 1: in contact the board's world yaw comes from the wall frame (slot heading + BOARD_LAP), nothing inherited from the hand or torso, so boards read edge-on from the flank and close into one lapped edge — ref tabs_screenshot_06 — ours shield_wall_2650ms, shield_wall_side
2. [S] battle-feel.e club-overhead-strike [0] — blocker 3: a press club comes down on a head or body (press_clubbers_side shows one cocked, one on the ground) — ref trailer_3_sheet_01 r2c3 — ours press_clubbers_side
3. [S] battle-feel.e swing-caught-mid-arc [0] — blocker 1: frame a clubber or knight at the hit in closeup_weapon_reads — ref trailer_3_sheet_01 r2c3 — ours closeup_weapon_reads
4. [S] battle-feel.g landed-spread-shot [1] — blocker 1: hold the flung knights in frame and add a landed shot — ref trailer_2_sheet_02 r1c2 — ours war_machines_3800ms
5. [S] vfx.h soft-fire-and-drifting-smoke [0] — blockers 1, 3: soft fire envelope round the burst lobes, drifting muzzle smoke — ref trailer_3_sheet_03 r1c2 — ours war_machines_1100ms, 1250ms
6. [S] unit-look.f mammoth-scale [2] — blocker 1: mammoth ~3.5 men tall — ref tabs_screenshot_01 — ours big_melee_result
7. [S] maps-light.f vignette-and-haze [0] — blockers 1, 2 — ref tabs_screenshot_05 — ours big_melee_5s
8. [S] camera.f near-ground-spectator [0] — blocker 1: low shot looking up at the mammoth or a launch — ref trailer_3_sheet_01 r1c2 — ours war_machines_1100ms

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- wall-face-held-in-contact [attempts: 1, [S]] — 207: board seated across on its ShieldSlot.at (0.45 m reach), kept up under a stagger: front boards in shield_wall_side/2650ms still face a flank camera (yaw not square to the wall) with torsos between them
- dressed-front-under-shove [attempts: 2, [S]] — 204: front rank pulled onto its mean depth after the solver (0.35/step, 0.04 m cap): depth only, boards still split sideways, bodies still overlap at the line; no contact shot of the board faces
- lapped-boards-in-contact [attempts: 1, [S]] — 203: front-rank dress step onto the live line + board back clamp -0.7: men still three or four depths deep under the shove, boards flat or edge-on, boards trail behind bearers
- lapped-shield-boards [attempts: 1, [S]] — 201: front boards on one plane 0.42 ahead of the rank line, lap 0.22; in the full capture still separate discs at different depths, the front shot stood behind blue
- press-club-phase [attempts: 1, [P]] — 201: heave 0.12 -> 0.6 per-man phase: ledger reversal of the 200 row; sway, not a blow landing
- mammoth-trunk [attempts: 1, [S]] — 198: 8-knot hanging tube in hide purple off the neck: blends into the chest, sits behind the tusk arc; salmon cheek panel left; 0.05 m knot rings too thin to read (199 retry approved)
- wall-shafts-share-one-heading [attempts: 1, [S]] — 196: heading only while levelSpearAt fires; pitch band and rear strike drop still fan shafts
- spear-stops-on-the-first-body [attempts: 1, [S]] — 194: measured the nearest enemy face along the slot heading; no shot changed

## Notes for next iteration (max 5 lines)
- 207 [S] pick was battle-feel.h (e dropped); 208 must not repeat h alone. battle-feel.h: approved 202/205/206, rejected 201/203/204/207. 207's code already set the lapped world yaw from heading+BOARD_LAP, yet the critic saw boards facing the flank: probe in contact whether _boardLap/k are ~1 (wallTimer, boardPlane) and what yaw the board ends at before trying again.
- battle-feel.e chop dropped 3 times (205-207): the visible level clubs may be staggered/limp men or _animateHeavySwing; probe which branch draws the level club in press_clubbers_side (2.65 s) before another attempt.
- capture.mjs runs the showcase first and the regression set on a reloaded page, so `--only` looks equal full-run frames. Gallery shots stop advancing at Result. A war_machines salvo kills ~1 squire.
- Probe animator branches with console.error -> look/summary.json consoleErrors. Python edits: read/write bytes as utf-8 and keep the file's eol.
- Shadows pass, leave them. No raised idle lean, free-foot 0.08 or walk torso yaw. No [P] on SHOULDER_INSET, TRAPEZIUS_*, NECK_*, hull, pelvis, arm taper, ghost, bow ready, laurel, sunk crouch, CALF_SWELL, helm crown, lawn shade, carry bob, mammoth hull, spear carry, club heave.
