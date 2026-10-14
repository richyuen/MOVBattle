# Loop state
Iteration: 200   Last re-audit: 200   Consecutive rejects: 0   Branch: main

## Criteria (critic, PASS/FAIL per criterion; FAIL carries its closed blocker list and the count of approved [S] since the list was written)
battle-feel: a PASS b PASS c PASS d PASS (4/4)
unit-look: a PASS b PASS c PASS d PASS (4/4)
maps-light: a PASS b PASS c PASS d PASS (4/4)
ui-flow: a PASS b PASS c PASS d PASS (4/4)
camera: a PASS b PASS c PASS d PASS (4/4)
vfx: a PASS b PASS c PASS d PASS (4/4)
Tier 2 (fully scored at 198, re-audited 200):
battle-feel: e FAIL f PASS g FAIL h FAIL (1/4)
- e FAIL [S since: 1] B: 1 no swing caught mid-arc against a target — closeup_weapon_reads (only sword knights, no clubber, no landed blow); 3 every press clubber holds the club cocked at one near-vertical angle, a picket of posts, none caught dropping onto a man — big_melee_5s, 9s. (2 struck 200) Ref trailer_3_sheet_01 r2c3.
- g FAIL [S since: 0] B: 1 landing not shown: flung knights out of frame at war_machines_3800ms, no landed spread of varied poses. Ref trailer_2_sheet_02 r1c2.
- h FAIL [S since: 0] B: 1 red front boards are separate edge-on discs with gaps, not lapped rim over rim — shield_wall_side, 2650ms; 2 men pass through each other at contact, blue rank fused, shafts sink into red boards — shield_wall_side. Ref tabs_screenshot_06.
unit-look: e PASS f FAIL g PASS h FAIL (2/4)
- f FAIL [S since: 2] B: 1 mammoth ~2.5-2.9 men tall (ref ~3.5) — big_melee_result. (3 struck 199) Ref tabs_screenshot_01.
- h FAIL [S since: 1] B: 1 eyes do not read at lineup distance on bare-faced units; 3 beret and yellow cone ~1 head wide (ref ~2 heads, tabs_screenshot_05) — lineup_medieval. Ref tabs_screenshot_04.
maps-light: e FAIL f FAIL g PASS h PASS (2/4)
- e FAIL B: 1 no evidence: add a second-biome shot (meadow or winter).
- f FAIL [S since: 0] B: 1 corners no darker than centre (no vignette); 2 no distance haze, far trees as saturated as near grass — big_melee_5s. Ref tabs_screenshot_05, 01.
ui-flow: e PASS f PASS g FAIL h PASS (3/4)
- g FAIL B: 1 no evidence: add a campaign-select shot.
camera: e PASS f FAIL g FAIL h PASS (2/4)
- f FAIL B: 1 no evidence: add a near-ground spectator shot looking up at the mammoth or a launch.
- g FAIL B: 1 no evidence: add a big_melee_result pair 1 s apart.
vfx: e FAIL f PASS g FAIL h FAIL (1/4)
- e FAIL [S since: 1] B: 1 no whole solid ring or dome (198 ring shows a quarter arc behind a body) — closeup_state_reads; 2 Zeus held bolt is a pale yellow glow slab (ref white jagged slabs trailer_2_sheet_03 r3c2) — closeup_pair_zeus_thor. Ref trailer_2_sheet_03 r2c1.
- g FAIL [S since: 1] B: 2 no broken-gear debris (r1c2) — big_melee_5s, 9s. (1 struck 199) Ref trailer_2_sheet_02.
- h FAIL [S since: 1] B: 1 burst hard solid lobes, no soft fire envelope (ref trailer_3_sheet_03 r1c2) — war_machines_1100ms; 3 muzzle puff faceted spheres, no drifting smoke — 1250ms. (2 struck 200)
Total tier 1 24/24; tier 2 11/24.

## Focus (every gap this iteration)
BASE 471cdaa
- [S] battle-feel.e overhead-club-strike (b0ca225) — APPROVE, blocker 2 struck, blocker 3 added, criterion still FAIL
- [S] vfx.h cannonball-smoke-trail (df80399) — APPROVE, blocker 2 struck, criterion still FAIL

## Last verdicts (one line per gap, verbatim critic header)
- GAP: [S] overhead-club-strike (b0ca225) VERDICT: APPROVE CRITERION: battle-feel.e FAIL (previous: FAIL)
- GAP: [S] cannonball-smoke-trail (df80399) VERDICT: APPROVE CRITERION: vfx.h FAIL (previous: FAIL)

## Ranked open gaps (max 8, tags and attempts in brackets; each clears a numbered blocker)
1. [S] battle-feel.h lapped-shield-boards [0] — blocker 1: red front boards overlap rim over rim into one surface (shared wall plane + lateral overlap offset) — ref tabs_screenshot_06 — ours shield_wall_side, 2650ms
2. [S] battle-feel.g landed-tumble-poses [0] — blocker 1: keep flung bodies in frame and capture the landing; varied landed poses from tumble state — ref trailer_2_sheet_02 r1c2 — ours war_machines_3800ms
3. [S] maps-light.f vignette-and-haze [0] — blocker 1: post-process vignette darkening the corners (blocker 2 distance desaturation fog) — ref tabs_screenshot_05, 01 — ours big_melee_5s
4. [S] vfx.e zeus-jagged-bolt [1] — blocker 2: held bolt as jagged white polygon slab, not a pale glow — ref trailer_2_sheet_03 r3c2 — ours closeup_pair_zeus_thor
5. [S] unit-look.h lineup-eyes [1] — blocker 1: eye discs read at lineup distance (contrast or size) — ref tabs_screenshot_04 — ours lineup_medieval
6. [S] vfx.g broken-gear-debris [1] — blocker 2: shattered shield and weapon chunks on hit or death — ref trailer_2_sheet_02 r1c2 — ours big_melee_5s, 9s
7. [S] unit-look.f mammoth-scale [2] — blocker 1: mammoth about 3.5 men tall — ref tabs_screenshot_01 — ours big_melee_result
8. [P] battle-feel.e press-club-phase [0] — fallout of overhead-club-strike (approved 200): heave 0.12 -> ~0.6 with per-man phase — NEXT shot: big_melee_5s, clubs over the red press at visibly mixed angles

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- mammoth-trunk [attempts: 1, [S]] — 198: 8-knot hanging tube in hide purple off the neck: blends into the chest, sits behind the tusk arc; salmon cheek panel left; 0.05 m knot rings too thin to read (199 retry approved)
- wall-shafts-share-one-heading [attempts: 1, [S]] — 196: heading only while levelSpearAt fires; pitch band and rear strike drop still fan shafts
- spear-stops-on-the-first-body [attempts: 1, [S]] — 194: measured the nearest enemy face along the slot heading; no shot changed
- wall-spears-thread-helmets [attempts: 1, [S]] — 190: lane from the two heads ahead + own crown height: no visible step
- bolt-hold-off-arm [attempts: 1, [P]] — 184: the pose branch is random per unit; nothing visible
- shade-density [attempts: 1, lawn shade row spent for [P]] — fainter weights: shadow contrast 28% -> 6%, figures float; needs a mechanism
- helm-too-tall [attempts: 1, crown spent for [P]] — crown 0.75: the head block pokes through the narrowed helm wall
- carry-bob [attempts: 1, bob spent for [P]] — 0.15-0.30: a bob on a level carry still reads level and parallel

## Notes for next iteration (max 5 lines)
- 200 [S] pair was (battle-feel.e, vfx.h); 201 must not repeat it. Critic [P] fallout from 200: press club heave 0.12 -> ~0.6 per-man phase (big_melee_5s); vfx.h next [S]: reuse the feathered billboard puff (`_leavePuff` in projectileSystem.ts) as a soft envelope round the burst and drifting muzzle smoke.
- Four `no evidence` blockers (maps-light.e, ui-flow.g, camera.f, camera.g) want evidence commits to capture.mjs. Evidence first is now a rule (ITERATE step 3): one per iteration. CRITIC.md and digest tile cites were corrected after 200; trailer_3_sheet_03 row 3 is another game's trailer, never cite it.
- Clubbers: only ~1/3 are in shove contact at 9s; the rest are Idle/Walking near the press, so poses for them go through `readyBlow` (simulationSystem blowReadyReach) not the shove overlay. Probe animator branches with console.error -> look/summary.json consoleErrors.
- Self-check with `capture.mjs --only <shot>` (redirect to a log); shots are deterministic run to run, so a look diff is the code change. Commit per gap with `git commit <paths> -F <msgfile>`. Crop shots with python PIL. Write long docs via the Write tool.
- Shadows pass, leave them. No raised idle lean, free-foot 0.08 or walk torso yaw. No [P] on SHOULDER_INSET, TRAPEZIUS_*, NECK_*, hull, pelvis, arm taper, ghost, bow ready, laurel, sunk crouch, CALF_SWELL, helm crown, lawn shade, carry bob, mammoth hull, spear carry.
