# Loop state
Iteration: 198   Last re-audit: 198   Consecutive rejects: 0   Branch: main

## Criteria (critic, PASS/FAIL per criterion; FAIL carries its closed blocker list and the count of approved [S] since the list was written)
battle-feel: a PASS b PASS c PASS d PASS (4/4)
unit-look: a PASS b PASS c PASS d PASS (4/4)
maps-light: a PASS b PASS c PASS d PASS (4/4)
ui-flow: a PASS b PASS c PASS d PASS (4/4)
camera: a PASS b PASS c PASS d PASS (4/4)
vfx: a PASS b PASS c PASS d PASS (4/4)
Tier 2 (fully scored at 198):
battle-feel: e FAIL f PASS g FAIL h FAIL (1/4)
- e FAIL [S since: 0] B: 1 no swing caught mid-arc against a target — closeup_weapon_reads; 2 clubbers in the press carry clubs level at the chest, no overhead windup or landing — big_melee_5s, 9s. Ref trailer_3_sheet_01 r2c3.
- g FAIL [S since: 0] B: 1 landing not shown: flung knights out of frame at war_machines_3800ms, no landed spread of varied poses. Ref trailer_2_sheet_02 r1c2.
- h FAIL [S since: 0] B: 1 red front boards are separate edge-on discs with gaps, not lapped rim over rim — shield_wall_side, 2650ms; 2 men pass through each other at contact, blue rank fused, shafts sink into red boards — shield_wall_side. Ref tabs_screenshot_06.
unit-look: e PASS f FAIL g PASS h FAIL (2/4)
- f FAIL [S since: 1] B: 1 mammoth ~2.5-2.9 men tall (ref ~3.5) — big_melee_result; 3 no trunk, flat salmon face panel — big_melee_result. Ref tabs_screenshot_01.
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
- g FAIL [S since: 0] B: 1 no blood chunks in the melee (ref trailer_2_sheet_02 r1c1); 2 no broken-gear debris (r1c2) — big_melee_5s, 9s.
- h FAIL [S since: 0] B: 1 burst hard solid lobes, no soft fire envelope (ref trailer_3_sheet_03 r1c2) — war_machines_1100ms; 2 ball leaves a thin line, no smoke trail — 550ms; 3 muzzle puff faceted spheres, no drifting smoke — 1250ms.
Total tier 1 24/24; tier 2 11/24.

## Focus (every gap this iteration)
BASE 11f9e26
- [S] unit-look.f mammoth-trunk (0f2e561) — REJECT, reverted 688f268
- [S] vfx.e impact-ring (c28d547) — APPROVE, criterion still FAIL (blocker 1 not struck)

## Last verdicts (one line per gap, verbatim critic header)
- GAP: [S] mammoth-trunk (0f2e561) VERDICT: REJECT CRITERION: unit-look.f FAIL (previous: FAIL)
- GAP: [S] impact-ring (c28d547) VERDICT: APPROVE CRITERION: vfx.e FAIL (previous: FAIL)

## Ranked open gaps (max 8, tags and attempts in brackets; each clears a numbered blocker)
1. [S] unit-look.f mammoth-trunk retry [1] — blocker 3: darker trunk tube rooted where the salmon panel is, in front of the tusks, to the ground — ref tabs_screenshot_01 — ours big_melee_result
2. [S] vfx.e zeus-held-bolt [0] — blocker 2: yellow glow slab in Zeus's hand replaced by solid white jagged shards — ref trailer_2_sheet_03 r3c2 — ours closeup_pair_zeus_thor
3. [S] vfx.e ring-reads-whole [0] — blocker 1: 2-3 staggered concentric hoops at chest height growing to ~5 m — ref trailer_2_sheet_03 r2c1 — ours closeup_state_reads
4. [S] vfx.g blood-chunks [0] — blocker 1: a few dark-red faceted chunks on heavy hits that settle and stay — ref trailer_2_sheet_02 r1c2 — ours big_melee_5s
5. [S] vfx.g gear-debris [0] — blocker 2: broken shield and weapon fragments as chunky bits on death — ref trailer_2_sheet_02 r1c2 — ours big_melee_9s
6. [S] vfx.h ball-smoke-trail [0] — blocker 2: soft sprite smoke trail behind the cannonball — ref trailer_3_sheet_03 r1c2 — ours war_machines_400ms
7. [S] unit-look.h lineup-eyes [0] — blocker 1: bigger bead eyes with a white disc on bare-faced units — ref tabs_screenshot_04 — ours lineup_medieval
8. [S] unit-look.f mammoth-scale [0] — blocker 1: mammoth to 3.5-4 men tall, legs rebuilt to the height — ref tabs_screenshot_01 — ours big_melee_result
Re-audit also ranked: maps-light.f vignette, battle-feel.e club-overhead-windup, battle-feel.h boards-overlap, battle-feel.g landed-spread.

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- mammoth-trunk [attempts: 1, [S]] — 198: 8-knot hanging tube in hide purple off the neck: blends into the chest, sits behind the tusk arc; salmon cheek panel left; 0.05 m knot rings too thin to read
- wall-shafts-share-one-heading [attempts: 1, [S]] — 196: heading only while levelSpearAt fires; pitch band and rear strike drop still fan shafts
- spear-stops-on-the-first-body [attempts: 1, [S]] — 194: measured the nearest enemy face along the slot heading; no shot changed
- wall-spears-thread-helmets [attempts: 1, [S]] — 190: lane from the two heads ahead + own crown height: no visible step
- bolt-hold-off-arm [attempts: 1, [P]] — 184: the pose branch is random per unit; nothing visible
- shade-density [attempts: 1, lawn shade row spent for [P]] — fainter weights: shadow contrast 28% -> 6%, figures float; needs a mechanism
- helm-too-tall [attempts: 1, crown spent for [P]] — crown 0.75: the head block pokes through the narrowed helm wall
- carry-bob [attempts: 1, bob spent for [P]] — 0.15-0.30: a bob on a level carry still reads level and parallel

## Notes for next iteration (max 5 lines)
- 198 [S] pair was (unit-look.f, vfx.e); 199 must not repeat it. Trunk retry: the panel is `cheekPaint`/`browPaint` in buildMammoth; trunk darker than `fur`, rooted forward of the tusk bases; big_melee_result angle differs between --only and full runs, check both.
- Four `no evidence` blockers (maps-light.e, ui-flow.g, camera.f, camera.g) want evidence commits to capture.mjs. CRITIC.md tile cites are wrong for vfx.f (use trailer_3_sheet_03 r1c1-r2c1), unit-look.e (trailer_3_sheet_01 r3c1), battle-feel.e (r2c3), battle-feel.g (trailer_2_sheet_02 r1c2).
- Spear wall: `holdSpearInWall(slot.heading)` each step, `_carrySpear` one line at SPEAR_WALL_UP 1.48; leave it. Shock ring: `_spawnShockRing` in visualEffects.ts, called from spawnLightning at the strike point.
- Self-check with `capture.mjs --only <shot>` (redirect to a log; piping to tail exited 4). Commit per gap with `git commit <paths> -F <msgfile>`. Crop shots with python PIL. Write long docs via the Write tool, not bash heredocs.
- Shadows pass, leave them. No raised idle lean, free-foot 0.08 or walk torso yaw. No [P] on SHOULDER_INSET, TRAPEZIUS_*, NECK_*, hull, pelvis, arm taper, ghost, bow ready, laurel, sunk crouch, CALF_SWELL, helm crown, lawn shade, carry bob, mammoth hull, spear carry.
