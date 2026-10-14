# Loop state
Iteration: 196   Last re-audit: 196   Consecutive rejects: 0   Branch: main

## Criteria (critic, PASS/FAIL per criterion; FAIL carries its closed blocker list and the count of approved [S] since the list was written)
battle-feel: a PASS b PASS c FAIL d PASS (3/4)
- c FAIL [S since list: 2] BLOCKERS: 4 wall shafts cross one another above the helmets: they lean both ways in yaw and roll and make a tepee of crossing shafts over the red line (TABS: six raised shafts, parallel, none crossing) — ours shield_wall_side, shield_wall_2500ms; 5 a spear aimed at a rear man still passes the front man and ends on the second-rank board — ours shield_wall_side. Ref tabs_screenshot_06, trailer_3_sheet_01 r3c1.
unit-look: a PASS b PASS c PASS d PASS (4/4)
maps-light: a PASS b PASS c PASS d PASS (4/4)
ui-flow: a PASS b PASS c PASS d PASS (4/4)
camera: a PASS b PASS c PASS d PASS (4/4)
vfx: a PASS b PASS c PASS d PASS (4/4)
Tier 2 (first scored at 196; battle-feel unscored until its c passes):
unit-look: e PASS f FAIL g PASS h FAIL (2/4)
- f FAIL [S since: 1] B: 1 mammoth ~2.5 men tall (ref ~3.5) — big_melee_result; 3 no trunk, flat face panel with a chevron — big_melee_result. Blocker 2 (crate hull) struck at 196. Ref tabs_screenshot_01.
- h FAIL [S since: 0] B: 1 eyes do not read at lineup distance on bare-faced units — lineup_medieval; 2 Zeus has an "o" mouth — closeup_pair_zeus_thor; 3 beret and yellow cone only ~1 head wide (ref brim ~2 heads, tabs_screenshot_05) — lineup_medieval. Ref tabs_screenshot_04.
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
Total tier 1 23/24 (196 re-audit: no verdict changed); tier 2 10/20 scored.

## Focus (every gap this iteration)
BASE 889442e
- [S] battle-feel.c wall-shafts-share-one-heading (f4d30a4) — REJECT, reverted 60c1b41
- [S] unit-look.f mammoth-fur-mass (01ff3fe) — APPROVE, criterion still FAIL (blocker 2 struck)

## Last verdicts (one line per gap, verbatim critic header)
- GAP: [S] battle-feel.c wall-shafts-share-one-heading (f4d30a4) VERDICT: REJECT CRITERION: battle-feel.c FAIL (previous: FAIL)
- GAP: [S] unit-look.f mammoth-fur-mass (01ff3fe) VERDICT: APPROVE CRITERION: unit-look.f FAIL (previous: FAIL)

## Ranked open gaps (max 8, tags and attempts in brackets; each clears a numbered blocker)
1. [S] battle-feel.c wall-shafts-one-plane [0] — blocker 4: every slotted man gets the wall heading and one shared raised pitch from slot assignment (not only inside levelSpearAt reach), shaft world direction set directly with no slerp to the body-yaw rest, rear strike slides along that fixed axis (no pitch drop) — ref tabs_screenshot_06 — ours shield_wall_side, shield_wall_2500ms
2. [S] battle-feel.c rear-spear-clears-front-man [0] — blocker 5: rear aim line passes over the front man's helmet to the enemy beyond and stops at the enemy board — ref trailer_3_sheet_01 r3c1 — ours shield_wall_side
3. [S] unit-look.f mammoth-trunk [0] — blocker 3: jointed faceted trunk between the tusks replaces the flat face panel and chevron — ref tabs_screenshot_01 — ours big_melee_result
4. [S] unit-look.f mammoth-scale [0] — blocker 1: body and leg build to ~3.5 men at the shoulder — ref tabs_screenshot_01 — ours big_melee_result
5. [S] unit-look.h zeus-no-mouth [0] — blocker 2: drop the "o" mouth mesh, faces eyes only — ref tabs_screenshot_04 — ours closeup_pair_zeus_thor
6. [S] vfx.e solid-magic-shape [0] — blocker 1: solid one-colour shockwave ring or dome on cast/impact — ref tabs_screenshot_09 — ours closeup_state_reads
7. [S] vfx.g blood-chunks [0] — blocker 1: a few dark red faceted chunks per melee hit, stay on the ground — ref trailer_2_sheet_02 r2c1 — ours big_melee_5s
8. [S] unit-look.h hats-two-heads-wide [0] — blocker 3: beret and cone brims ~2 heads across — ref tabs_screenshot_04 — ours lineup_medieval
No [P] ranked. Also open, unranked: vfx.h soft-fire-envelope, maps-light.f vignette-and-haze.

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
- 196 [S] pair was (battle-feel.c, unit-look.f). Four `no evidence` blockers (maps-light.e, ui-flow.g, camera.f, camera.g) want evidence commits to capture.mjs (camera.g is a two-line pair). CRITIC.md cites wrong tiles for vfx.f (use trailer_3_sheet_03 r1c1-r2c1) and unit-look.e (use trailer_3_sheet_01 r3c1).
- Spear: `_carrySpear` raises front and rear to `br.spearUp` (1.05-1.4) on `root.rotation.y`, slerped from the rest by level; rear strike drops pitch to SPEAR_REAR_STRIKE. On-hit torso squash (uneven scale) shears the arm so a fist-frame rotation lands up to 0.4 rad off in world; 196 fixed it via the fist's inverse world matrix (reverted with the gap; reuse it). Slots/heading live in the sim (`_shieldSlots`, `slot.heading`); both teams carry spears in shield_wall.
- Self-check with `capture.mjs --only <shot>` against the blocker point by point. Commit per gap with `git commit <paths> -F <msgfile>`. Capture is about 5 minutes, foreground.
- Shadows pass, leave them. Never raise idle lean or the free-foot 0.08; no walk torso yaw. No [P] on SHOULDER_INSET, TRAPEZIUS_*, NECK_*, hull, pelvis, arm taper, ghost, bow ready, SPEAR_REAR_UP_*, laurel, sunk crouch, CALF_SWELL, helm crown, lawn shade, carry bob, mammoth hull.
