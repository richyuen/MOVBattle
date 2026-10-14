# Loop state
Iteration: 197   Last re-audit: 196   Consecutive rejects: 0   Branch: main

## Criteria (critic, PASS/FAIL per criterion; FAIL carries its closed blocker list and the count of approved [S] since the list was written)
battle-feel: a PASS b PASS c PASS d PASS (4/4)
- c flipped PASS at 197 (blockers 4 and 5 struck by wall-shafts-one-plane).
unit-look: a PASS b PASS c PASS d PASS (4/4)
maps-light: a PASS b PASS c PASS d PASS (4/4)
ui-flow: a PASS b PASS c PASS d PASS (4/4)
camera: a PASS b PASS c PASS d PASS (4/4)
vfx: a PASS b PASS c PASS d PASS (4/4)
Tier 2 (first scored at 196):
battle-feel: e unscored f unscored g unscored h unscored (a-d all pass since 197: re-audit due)
unit-look: e PASS f FAIL g PASS h FAIL (2/4)
- f FAIL [S since: 1] B: 1 mammoth ~2.5 men tall (ref ~3.5) — big_melee_result; 3 no trunk, flat face panel with a chevron — big_melee_result. Blocker 2 (crate hull) struck at 196. Ref tabs_screenshot_01.
- h FAIL [S since: 1] B: 1 eyes do not read at lineup distance on bare-faced units — lineup_medieval; 3 beret and yellow cone only ~1 head wide (ref brim ~2 heads, tabs_screenshot_05) — lineup_medieval. Blocker 2 (Zeus "o" mouth) struck at 197. Ref tabs_screenshot_04.
maps-light: e FAIL f FAIL g PASS h PASS (2/4)
- e FAIL B: 1 no evidence: add a second-biome shot (meadow or winter).
- f FAIL [S since: 0] B: 1 corners no darker than centre (no vignette); 2 no distance haze, far trees as saturated as near grass — big_melee_5s. Ref tabs_screenshot_05, 01.
ui-flow: e PASS f PASS g FAIL h PASS (3/4)
- g FAIL B: 1 no evidence: add a campaign-select shot.
camera: e PASS f FAIL g FAIL h PASS (2/4)
- f FAIL B: 1 no evidence: add a near-ground spectator shot looking up at the mammoth or a launch.
- g FAIL B: 1 no evidence: add a big_melee_result pair 1 s apart.
vfx: e FAIL f PASS g FAIL h FAIL (1/4)
- e FAIL [S since: 0] B: 1 no solid ring or dome in any shot (ref white shockwave ring trailer_2_sheet_03 r2c1, pink dome tabs_screenshot_09) — closeup_state_reads; 2 Zeus bolt pale yellow translucent glow (ref solid white jagged slabs r3c2) — closeup_state_reads, closeup_pair_zeus_thor.
- g FAIL [S since: 0] B: 1 no blood chunks in the melee (ref dark red chunks, trailer_2_sheet_02 r2c1); 2 no broken-gear debris (ref r1c2) — big_melee_5s, big_melee_9s.
- h FAIL [S since: 0] B: 1 burst is hard solid lobes, no soft fire envelope (ref trailer_3_sheet_03 r1c2) — war_machines_1100ms; 2 ball leaves only a thin line, no soft smoke trail — war_machines_550ms; 3 muzzle puff faceted spheres, no drifting sprite smoke — war_machines_1250ms.
Total tier 1 24/24; tier 2 10/20 scored (battle-feel e-h unscored).

## Focus (every gap this iteration)
BASE c79042d
- [S] battle-feel.c wall-shafts-one-plane (31a1977) — APPROVE, criterion flips PASS
- [S] unit-look.h zeus-no-mouth (f47457c) — APPROVE, criterion still FAIL (blocker 2 struck)

## Last verdicts (one line per gap, verbatim critic header)
- GAP: [S] battle-feel.c wall-shafts-one-plane (31a1977) VERDICT: APPROVE CRITERION: battle-feel.c PASS (previous: FAIL)
- GAP: [S] unit-look.h zeus-no-mouth (f47457c) VERDICT: APPROVE CRITERION: unit-look.h FAIL (previous: FAIL)

## Ranked open gaps (max 8, tags and attempts in brackets; each clears a numbered blocker)
1. [S] unit-look.f mammoth-trunk [0] — blocker 3: a faceted segmented trunk hanging from the face panel in place of the flat chevron — ref tabs_screenshot_01 — ours big_melee_result
2. [S] unit-look.f mammoth-height [0] — blocker 1: a giant body plan (longer legs, raised shoulder hump) to ~3.5 men tall — ref tabs_screenshot_01 — ours big_melee_result
3. [S] unit-look.h lineup-eyes [0] — blocker 1: eyes scaled for distance on bare-faced heads (larger disc and pupil, or darker rim) — ref tabs_screenshot_04 — ours lineup_medieval
4. [S] unit-look.h wide-brims [0] — blocker 3: beret and cone hats rebuilt with ~2-head brims — ref tabs_screenshot_05 — ours lineup_medieval
5. [S] vfx.e solid-dome [0] — blocker 1: an opaque single-colour ring/dome effect for magic hits — ref trailer_2_sheet_03 r1c2 — ours closeup_state_reads
6. [S] vfx.g blood-chunks [0] — blocker 1: a few dark red faceted chunks on hits, plus broken-gear debris — ref trailer_2_sheet_02 r1c2 — ours big_melee_5s
7. [S] maps-light.f vignette-haze [0] — blocker 1: a post-process vignette plus distance fog desaturating far trees — ref tabs_screenshot_05 — ours big_melee_5s
8. [S] vfx.h soft-smoke [0] — blocker 1: soft sprite smoke around the solid burst — ref trailer_3_sheet_03 r1c2 — ours war_machines_1100ms
No [P] ranked. Critic NEXT notes (not blockers): unslotted man near a wall takes the nearest wall's heading; laurel hair cap reads as a pointed tuft above the wreath.

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- wall-shafts-share-one-heading [attempts: 1, [S]] — 196: heading only while levelSpearAt fires and slerped toward body yaw; pitch band and rear strike pitch drop still fan shafts, crossings unchanged
- spear-stops-on-the-first-body [attempts: 1, [S]] — 194: the sim measured the nearest enemy face along the slot heading at decision time; no shot changed. The measured line is not the drawn shaft
- wall-spears-thread-helmets [attempts: 1, [S]] — 190: lane from the two heads ahead + height from own crown: no visible step (mechanism replaced by the 192 [R])
- bolt-hold-off-arm [attempts: 1, [P]] — 184: the pose branch is random per unit; nothing visible (cleared by the 191 [S])
- shade-density [attempts: 1, lawn shade row spent for [P]] — weight 0.6/0.5/0.4 + lift: shadow contrast fell from 28% to 6%, figures float; needs a mechanism
- helm-too-tall [attempts: 1, crown spent for [P]] — crown 0.75: the head block pokes through the narrowed helm wall
- carry-bob [attempts: 1, bob spent for [P]] — 0.15-0.30: a bob on a level carry still reads level and parallel
- bucket-helm-torso-sized [attempts: 1, [P] spent] — HAT_CUT_FOR_HEAD 0.85: shrank every hat, Zeus's hair and wreath fell off

## Notes for next iteration (max 5 lines)
- 197 [S] pair was (battle-feel.c, unit-look.h). battle-feel tier 2 is unscored, so 198 starts with a RE-AUDIT. Four `no evidence` blockers (maps-light.e, ui-flow.g, camera.f, camera.g) want evidence commits to capture.mjs (camera.g is a two-line pair). CRITIC.md cites wrong tiles for vfx.f (use trailer_3_sheet_03 r1c1-r2c1) and unit-look.e (use trailer_3_sheet_01 r3c1).
- Spear: the sim calls `holdSpearInWall(slot.heading)` for every slotted man each step (end of `_assignShieldSlots`); `_carrySpear` sets the shaft's world line from that heading and SPEAR_WALL_UP 1.48 through the fist's inverse world matrix (shear-safe). No per-man pitch, no strike drop. Leave it.
- Self-check with `capture.mjs --only <shot>` against the blocker point by point. Commit per gap with `git commit <paths> -F <msgfile>`. Capture is about 5 minutes, foreground. Crop shots with python PIL to read small details.
- Shadows pass, leave them. Never raise idle lean or the free-foot 0.08; no walk torso yaw. No [P] on SHOULDER_INSET, TRAPEZIUS_*, NECK_*, hull, pelvis, arm taper, ghost, bow ready, laurel, sunk crouch, CALF_SWELL, helm crown, lawn shade, carry bob, mammoth hull, spear carry.
