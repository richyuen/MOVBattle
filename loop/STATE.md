# Loop state
Iteration: 204   Last re-audit: 200   Consecutive rejects: 0   Branch: main

## Criteria (critic, PASS/FAIL per criterion; FAIL carries its closed blocker list and the count of approved [S] since the list was written)
battle-feel: a PASS b PASS c PASS d PASS (4/4)
unit-look: a PASS b PASS c PASS d PASS (4/4)
maps-light: a PASS b PASS c PASS d PASS (4/4)
ui-flow: a PASS b PASS c PASS d PASS (4/4)
camera: a PASS b PASS c PASS d PASS (4/4)
vfx: a PASS b PASS c PASS d PASS (4/4)
Tier 2 (fully scored at 198, re-audited 200):
battle-feel: e FAIL f PASS g FAIL h FAIL (1/4)
- e FAIL [S since: 2] B: 1 no swing caught mid-arc against a target — closeup_weapon_reads (only sword knights, no clubber, no landed blow); 3 no press club caught landing on a man: clubs leave the cock and slant forward over the front, but none down on a head, and the camera behind red hides a landed club — big_melee_2s, 9s. (2 struck 200) Ref trailer_3_sheet_01 r2c3.
- g FAIL [S since: 0] B: 1 landing not shown: flung knights out of frame at war_machines_3800ms, no landed spread of varied poses. Ref trailer_2_sheet_02 r1c2.
- h FAIL [S since: 1] B: 1 the lap holds while the wall closes (front shot pre-contact, both wings now lapped) but breaks under the shove: boards split sideways into separate discs, rank 3-4 bodies deep — shield_wall_side, 2650ms; no shot shows the wall face in contact; 2 men pass through each other at contact, blue rank fused, shafts sink into red boards — shield_wall_side. Ref tabs_screenshot_06.
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
BASE 6a0d135
- [S] battle-feel.h dressed-front-under-shove (cc9b628) — REJECT, reverted
- [S] camera.g result-drift (8d8aeb5) — APPROVE, blocker 1 struck, camera.g PASS

## Last verdicts (one line per gap, verbatim critic header)
- GAP: [S] dressed-front-under-shove (cc9b628) VERDICT: REJECT CRITERION: battle-feel.h FAIL (previous: FAIL)
- GAP: [S] result-drift (8d8aeb5) VERDICT: APPROVE CRITERION: camera.g PASS (previous: FAIL)

## Ranked open gaps (max 8, tags and attempts in brackets; each clears a numbered blocker)
1. [S] battle-feel.h wall-contact-rule [0] — blocker 1 (and 2): in contact slotted front men are not parted sideways off their slot offset, and opposing bodies are stopped at the board plane (enemy held at plane + board depth); add a shield_wall contact shot from blue's side at ~2650 ms showing the board faces — ref tabs_screenshot_06 — ours shield_wall_2650ms, shield_wall_side
2. [S] camera.f spectator-low-shot [0] — blocker 1: near-ground camera rule looking up at the mammoth or a launch, plus a shot of it — ref trailer_3_sheet_01 r1c2, trailer_3_sheet_03 r1c2 — ours (none; add a shot)
3. [S] battle-feel.g landed-spread [1] — blocker 1: hold war_machines_3800ms on the landing zone so varied landed poses show — ref trailer_2_sheet_02 r1c2 — ours war_machines_3800ms
4. [S] battle-feel.e press-club-lands [0] — blocker 3: a club caught down on a head, framed so red does not hide it — ref trailer_3_sheet_01 r2c3 — ours big_melee_2s, 9s
5. [S] vfx.h fire-envelope [0] — blocker 1: soft sprite fire and smoke round the solid burst lobes — ref trailer_3_sheet_03 r1c2 — ours war_machines_1100ms
6. [S] maps-light.f vignette-haze [0] — blocker 1: screen vignette post-process; blocker 2 next: distance haze — ref tabs_screenshot_05, 01 — ours big_melee_5s
7. [S] vfx.e jagged-bolt [1] — blocker 2: Zeus's held bolt as white jagged polygon slabs — ref trailer_2_sheet_03 r3c2 — ours closeup_pair_zeus_thor
8. [S] unit-look.f mammoth-scale [2] — blocker 1: mammoth ~3.5 men tall at the shoulder — ref tabs_screenshot_01 — ours big_melee_result

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- dressed-front-under-shove [attempts: 2, [S]] — 204: front rank pulled onto its mean depth after the solver (0.35/step, 0.04 m cap): depth only, boards still split sideways, bodies still overlap at the line; no contact shot of the board faces
- lapped-boards-in-contact [attempts: 1, [S]] — 203: front-rank dress step onto the live line + board back clamp -0.7: men still three or four depths deep under the shove, boards flat or edge-on, boards trail behind bearers
- lapped-shield-boards [attempts: 1, [S]] — 201: front boards on one plane 0.42 ahead of the rank line, lap 0.22; in the full capture still separate discs at different depths, the front shot stood behind blue
- press-club-phase [attempts: 1, [P]] — 201: heave 0.12 -> 0.6 per-man phase: ledger reversal of the 200 row; sway, not a blow landing
- mammoth-trunk [attempts: 1, [S]] — 198: 8-knot hanging tube in hide purple off the neck: blends into the chest, sits behind the tusk arc; salmon cheek panel left; 0.05 m knot rings too thin to read (199 retry approved)
- wall-shafts-share-one-heading [attempts: 1, [S]] — 196: heading only while levelSpearAt fires; pitch band and rear strike drop still fan shafts
- spear-stops-on-the-first-body [attempts: 1, [S]] — 194: measured the nearest enemy face along the slot heading; no shot changed
- wall-spears-thread-helmets [attempts: 1, [S]] — 190: lane from the two heads ahead + own crown height: no visible step

## Notes for next iteration (max 5 lines)
- 204 [S] pair was (battle-feel.h, camera.g); 205 is a re-audit (N multiple of 5). battle-feel.h: lapped boards approved 202, rejected 201/203/204; front-rank depth dressing is spent; next attempt must be a contact rule (sideways slot hold + enemy stopped at the board plane) with a blue-side contact shot.
- capture.mjs runs the showcase first and the regression set on a reloaded page, so `--only` looks equal full-run frames. Gallery shots stop advancing at Result; a war_machines salvo kills ~1 squire and throws it ~16 m.
- Shield wall: front-rank board plane = live mean depth of the rank each step (ShieldSlot.plane); boards lap from slotting (_boardLap). Clubbers: press blow (_pressBlow) in the shove overlay and in readyBlow within blowStrikeReach. Victory shot orbits (RESULT_DRIFT_RATE).
- Probe animator branches with console.error -> look/summary.json consoleErrors. Python edits: read/write bytes as utf-8 and keep the file's eol (cp1252 default corrupted em-dashes in 201).
- Shadows pass, leave them. No raised idle lean, free-foot 0.08 or walk torso yaw. No [P] on SHOULDER_INSET, TRAPEZIUS_*, NECK_*, hull, pelvis, arm taper, ghost, bow ready, laurel, sunk crouch, CALF_SWELL, helm crown, lawn shade, carry bob, mammoth hull, spear carry, club heave.
