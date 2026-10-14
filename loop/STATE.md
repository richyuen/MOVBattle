# Loop state
Iteration: 203   Last re-audit: 200   Consecutive rejects: 1   Branch: main

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
- h FAIL [S since: 1] B: 1 the lap holds while the wall closes (shield_wall_front centre and right) but breaks under the shove: boards clamped to their displaced men re-scatter into separate discs — shield_wall_side, 2650ms; the left wing in shield_wall_front unlapped; 2 men pass through each other at contact, blue rank fused, shafts sink into red boards — shield_wall_side. Ref tabs_screenshot_06.
unit-look: e PASS f FAIL g PASS h FAIL (2/4)
- f FAIL [S since: 2] B: 1 mammoth ~2.5-2.9 men tall (ref ~3.5) — big_melee_result. (3 struck 199) Ref tabs_screenshot_01.
- h FAIL [S since: 1] B: 1 eyes do not read at lineup distance on bare-faced units; 3 beret and yellow cone ~1 head wide (ref ~2 heads, tabs_screenshot_05) — lineup_medieval. Ref tabs_screenshot_04.
maps-light: e FAIL f FAIL g PASS h PASS (2/4)
- e FAIL [S since: 0] B: 1 spooky tree ring is lime-green deciduous, a day meadow palette on purple ground (ref navy night, pink glow); 2 placement top-down only, team tints hide the ground, no battle-angle shot; 3 no spooky dressing (gravestones, dead trees, pink lights) — biome_spooky. Ref tabs_screenshot_03, 05.
- f FAIL [S since: 0] B: 1 corners no darker than centre (no vignette); 2 no distance haze, far trees as saturated as near grass — big_melee_5s. Ref tabs_screenshot_05, 01.
ui-flow: e PASS f PASS g FAIL h PASS (3/4)
- g FAIL [S since: 0] B: 1 levels are text cards in a centred two-column modal, not level nodes on a campaign map; 2 bold mixed-case sans, ref thin widely tracked white caps (tabs_screenshot_04); 3 a sentence of description per card, a wall of text, ref terse labels on empty screen — ui_campaign_select.
camera: e PASS f FAIL g FAIL h PASS (2/4)
- f FAIL [S since: 0] B: 1 missing: a near-ground spectator camera rule looking up at the mammoth or a launch (none in web/src; confirmed 203).
- g FAIL [S since: 0] B: 1 missing: continuous result-shot drift: the victory camera stops once its 2 s swoop ends; big_melee_result and _1s frame identically, survivors frozen — big_melee_result, _1s. Ref gameplay_sheet_02 r1c2.
vfx: e FAIL f PASS g FAIL h FAIL (1/4)
- e FAIL [S since: 1] B: 1 no whole solid ring or dome (198 ring shows a quarter arc behind a body) — closeup_state_reads; 2 Zeus held bolt is a pale yellow glow slab (ref white jagged slabs trailer_2_sheet_03 r3c2) — closeup_pair_zeus_thor. Ref trailer_2_sheet_03 r2c1.
- g FAIL [S since: 1] B: 2 no broken-gear debris (r1c2) — big_melee_5s, 9s. (1 struck 199) Ref trailer_2_sheet_02.
- h FAIL [S since: 1] B: 1 burst hard solid lobes, no soft fire envelope (ref trailer_3_sheet_03 r1c2) — war_machines_1100ms; 3 muzzle puff faceted spheres, no drifting smoke — 1250ms. (2 struck 200)
Total tier 1 24/24; tier 2 11/24.

## Focus (every gap this iteration)
BASE 18d9e63
- evidence e2d0cfb big_melee_result_1s (camera.g scored: missing result drift); camera.f rewritten to missing (confirmed)
- [S] battle-feel.h lapped-boards-in-contact (d32a9a6) — REJECT, reverted
- [S] battle-feel.g landed-spread — dropped uncommitted: the battle camera's subject picking only drives the victory shot, a salvo kills ~1 man, toppled men get up

## Last verdicts (one line per gap, verbatim critic header)
- GAP: [S] lapped-boards-in-contact (d32a9a6) VERDICT: REJECT CRITERION: battle-feel.h FAIL (previous: FAIL)

## Ranked open gaps (max 8, tags and attempts in brackets; each clears a numbered blocker)
1. [S] battle-feel.h dressed-front-under-shove [1] — blocker 1: in contact the dress step takes priority over push separation (or pin front-rank depth to the plane after separation), board back clamp kept -0.2 — ref tabs_screenshot_06 — ours shield_wall_2650ms
2. [S] camera.g result-drift [0] — blocker 1: slow continuous orbit or pan on the victory camera after the swoop settles, a few degrees per second — ref gameplay_sheet_02 r1c2 — ours big_melee_result_1s
3. [S] battle-feel.e press-club-lands-on-head [0] — blocker 3: the press blow ends on the target's head/shoulder with the target flinching, filmed side-on — ref trailer_3_sheet_01 r2c3 — ours big_melee_2s
4. [S] battle-feel.g landed-spread [1] — blocker 1: varied landed poses (back, side, face down) and a war_machines shot later than 3800 ms framing the landing — ref trailer_2_sheet_02 r1c2 — ours war_machines_3800ms
5. [S] camera.f spectator-low-shot [0] — blocker 1: near-ground camera rule looking up at a giant or a launch (mammoth charge or cannon hit) — ref trailer_3_sheet_01 r1c2 — ours big_melee_result
6. [S] vfx.h soft-fire-envelope [0] — blocker 1: soft billboard fire and smoke wrapping the solid burst lobes — ref trailer_3_sheet_03 r1c2 — ours war_machines_1100ms
7. [S] unit-look.f mammoth-scale [2] — blocker 1: mammoth about 3.5 men tall — ref tabs_screenshot_01 — ours big_melee_result
8. [S] maps-light.f vignette-haze [0] — blocker 1: post-process corner darkening; blocker 2: distance haze desaturating far trees — ref tabs_screenshot_05 — ours big_melee_5s

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- lapped-boards-in-contact [attempts: 1, [S]] — 203: front-rank dress step onto the live line + board back clamp -0.7: men still three or four depths deep under the shove, boards flat or edge-on, boards trail behind bearers
- lapped-shield-boards [attempts: 1, [S]] — 201: front boards on one plane 0.42 ahead of the rank line, lap 0.22; in the full capture still separate discs at different depths, the front shot stood behind blue
- press-club-phase [attempts: 1, [P]] — 201: heave 0.12 -> 0.6 per-man phase: ledger reversal of the 200 row; sway, not a blow landing
- mammoth-trunk [attempts: 1, [S]] — 198: 8-knot hanging tube in hide purple off the neck: blends into the chest, sits behind the tusk arc; salmon cheek panel left; 0.05 m knot rings too thin to read (199 retry approved)
- wall-shafts-share-one-heading [attempts: 1, [S]] — 196: heading only while levelSpearAt fires; pitch band and rear strike drop still fan shafts
- spear-stops-on-the-first-body [attempts: 1, [S]] — 194: measured the nearest enemy face along the slot heading; no shot changed
- wall-spears-thread-helmets [attempts: 1, [S]] — 190: lane from the two heads ahead + own crown height: no visible step
- bolt-hold-off-arm [attempts: 1, [P]] — 184: the pose branch is random per unit; nothing visible

## Notes for next iteration (max 5 lines)
- 203 [S] pick was battle-feel.h (g dropped). No `no evidence` blockers remain. battle-feel.h: lapped-boards gaps rejected at 201 and 203, approved at 202; next try must make the rank depth itself hold under the shove, verified in a full-run look of shield_wall_2650ms.
- capture.mjs runs the showcase first and the regression set on a reloaded page, so `--only` looks equal full-run frames. Gallery shots stop advancing at Result; a war_machines salvo kills ~1 squire and throws it ~16 m.
- Shield wall: front-rank board plane = live mean depth of the rank each step (ShieldSlot.plane); boards lap from slotting (_boardLap). Clubbers: press blow (_pressBlow) runs in the shove overlay and in readyBlow within blowStrikeReach.
- Probe animator branches with console.error -> look/summary.json consoleErrors. Python edits: read/write bytes as utf-8 and keep the file's eol (cp1252 default corrupted em-dashes in 201).
- Shadows pass, leave them. No raised idle lean, free-foot 0.08 or walk torso yaw. No [P] on SHOULDER_INSET, TRAPEZIUS_*, NECK_*, hull, pelvis, arm taper, ghost, bow ready, laurel, sunk crouch, CALF_SWELL, helm crown, lawn shade, carry bob, mammoth hull, spear carry, club heave.
