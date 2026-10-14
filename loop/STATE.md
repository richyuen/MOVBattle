# Loop state
Iteration: 201   Last re-audit: 200   Consecutive rejects: 1   Branch: main

## Criteria (critic, PASS/FAIL per criterion; FAIL carries its closed blocker list and the count of approved [S] since the list was written)
battle-feel: a PASS b PASS c PASS d PASS (4/4)
unit-look: a PASS b PASS c PASS d PASS (4/4)
maps-light: a PASS b PASS c PASS d PASS (4/4)
ui-flow: a PASS b PASS c PASS d PASS (4/4)
camera: a PASS b PASS c PASS d PASS (4/4)
vfx: a PASS b PASS c PASS d PASS (4/4)
Tier 2 (fully scored at 198, re-audited 200):
battle-feel: e FAIL f PASS g FAIL h FAIL (1/4)
- e FAIL [S since: 1] B: 1 no swing caught mid-arc against a target — closeup_weapon_reads (only sword knights, no clubber, no landed blow); 3 no press club caught dropping onto a man: clubs only rock on the shoulder above the press — big_melee_5s, 9s. (2 struck 200) Ref trailer_3_sheet_01 r2c3.
- g FAIL [S since: 0] B: 1 landing not shown: flung knights out of frame at war_machines_3800ms, no landed spread of varied poses. Ref trailer_2_sheet_02 r1c2.
- h FAIL [S since: 0] B: 1 red front boards are separate edge-on discs with gaps, not lapped rim over rim â€” shield_wall_side, 2650ms; 2 men pass through each other at contact, blue rank fused, shafts sink into red boards â€” shield_wall_side. Ref tabs_screenshot_06.
unit-look: e PASS f FAIL g PASS h FAIL (2/4)
- f FAIL [S since: 2] B: 1 mammoth ~2.5-2.9 men tall (ref ~3.5) â€” big_melee_result. (3 struck 199) Ref tabs_screenshot_01.
- h FAIL [S since: 1] B: 1 eyes do not read at lineup distance on bare-faced units; 3 beret and yellow cone ~1 head wide (ref ~2 heads, tabs_screenshot_05) â€” lineup_medieval. Ref tabs_screenshot_04.
maps-light: e FAIL f FAIL g PASS h PASS (2/4)
- e FAIL [S since: 0] B: 1 spooky tree ring is lime-green deciduous, a day meadow palette on purple ground (ref navy night, pink glow); 2 placement top-down only, team tints hide the ground, no battle-angle shot; 3 no spooky dressing (gravestones, dead trees, pink lights) — biome_spooky. Ref tabs_screenshot_03, 05.
- f FAIL [S since: 0] B: 1 corners no darker than centre (no vignette); 2 no distance haze, far trees as saturated as near grass â€” big_melee_5s. Ref tabs_screenshot_05, 01.
ui-flow: e PASS f PASS g FAIL h PASS (3/4)
- g FAIL B: 1 no evidence: add a campaign-select shot.
camera: e PASS f FAIL g FAIL h PASS (2/4)
- f FAIL B: 1 no evidence: add a near-ground spectator shot looking up at the mammoth or a launch.
- g FAIL B: 1 no evidence: add a big_melee_result pair 1 s apart.
vfx: e FAIL f PASS g FAIL h FAIL (1/4)
- e FAIL [S since: 1] B: 1 no whole solid ring or dome (198 ring shows a quarter arc behind a body) â€” closeup_state_reads; 2 Zeus held bolt is a pale yellow glow slab (ref white jagged slabs trailer_2_sheet_03 r3c2) â€” closeup_pair_zeus_thor. Ref trailer_2_sheet_03 r2c1.
- g FAIL [S since: 1] B: 2 no broken-gear debris (r1c2) â€” big_melee_5s, 9s. (1 struck 199) Ref trailer_2_sheet_02.
- h FAIL [S since: 1] B: 1 burst hard solid lobes, no soft fire envelope (ref trailer_3_sheet_03 r1c2) â€” war_machines_1100ms; 3 muzzle puff faceted spheres, no drifting smoke â€” 1250ms. (2 struck 200)
Total tier 1 24/24; tier 2 11/24.

## Focus (every gap this iteration)
BASE f049791
- evidence 557f6eb biome_spooky (maps-light.e scored from it: FAIL); evidence 50baae9 shield_wall_front (camera ended behind the blue rank in the full run: no board faces shown)
- [S] battle-feel.h lapped-shield-boards (5553efb) — REJECT, reverted 63466ae
- [S] battle-feel.g landed-tumble-poses — dropped uncommitted: corpse heap + drape built, but a salvo kills ~1 squire and throws it ~16 m, no shot could show it
- [P] battle-feel.e press-club-phase (7810b12) — REJECT (ledger reversal), reverted b15dd3e

## Last verdicts (one line per gap, verbatim critic header)
- GAP: [S] lapped-shield-boards (5553efb) VERDICT: REJECT CRITERION: battle-feel.h FAIL (previous: FAIL)
- GAP: [P] press-club-phase (7810b12) VERDICT: REJECT CRITERION: battle-feel.e FAIL (previous: FAIL)

## Ranked open gaps (max 8, tags and attempts in brackets; each clears a numbered blocker)
1. [S] battle-feel.h lapped-boards retry [1] — blocker 1: board spacing below board diameter on one plane, kept on the plane while its man is pushed back; shot from the enemy side (fix gallery_shield_wall_front camera: it must face red's boards, not stand behind blue) — ref tabs_screenshot_06 — ours shield_wall_2650ms, shield_wall_front
2. [S] battle-feel.e press-blow [0] — blocker 3: clubber in reach drops the club from CLUB_COCK to CLUB_LAND onto the nearest enemy head, blows staggered so 1-2 per frame are mid-drop — ref trailer_3_sheet_01 r2c3 — ours big_melee_5s
3. [S] battle-feel.h contact-separation [0] — blocker 2: hard body push-out between opposing front ranks, shafts stopped at board faces — ref tabs_screenshot_06 — ours shield_wall_side
4. [S] maps-light.f vignette-and-haze [0] — blocker 1: image-processing vignette; blocker 2: depth fog desaturating far trees — ref tabs_screenshot_05 — ours big_melee_5s
5. [S] maps-light.e spooky-tree-set [0] — blocker 1: navy dead-tree and pink-glow ring props for the spooky biome — ref tabs_screenshot_03 — ours biome_spooky
6. [S] battle-feel.g landing-frame [1] — blocker 1: capture follows flung bodies to the ground; landed poses from tumble attitude — ref trailer_2_sheet_02 r1c2 — ours war_machines_3800ms
7. [S] vfx.h fire-envelope [0] — blocker 1: soft billboard fire/smoke sprites round the solid burst lobes — ref trailer_3_sheet_03 r1c2 — ours war_machines_1100ms
8. [S] vfx.e zeus-jagged-bolt [1] — blocker 2: held bolt as jagged white polygon slabs, not the glow slab — ref trailer_2_sheet_03 r3c2 — ours closeup_pair_zeus_thor

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- lapped-shield-boards [attempts: 1, [S]] — 201: front boards on one plane 0.42 ahead of the rank line, lap 0.22; in the full capture still separate discs at different depths, the front shot stood behind blue
- press-club-phase [attempts: 1, [P]] — 201: heave 0.12 -> 0.6 per-man phase: ledger reversal of the 200 row; sway, not a blow landing
- mammoth-trunk [attempts: 1, [S]] — 198: 8-knot hanging tube in hide purple off the neck: blends into the chest, sits behind the tusk arc; salmon cheek panel left; 0.05 m knot rings too thin to read (199 retry approved)
- wall-shafts-share-one-heading [attempts: 1, [S]] — 196: heading only while levelSpearAt fires; pitch band and rear strike drop still fan shafts
- spear-stops-on-the-first-body [attempts: 1, [S]] — 194: measured the nearest enemy face along the slot heading; no shot changed
- wall-spears-thread-helmets [attempts: 1, [S]] — 190: lane from the two heads ahead + own crown height: no visible step
- bolt-hold-off-arm [attempts: 1, [P]] — 184: the pose branch is random per unit; nothing visible
- shade-density [attempts: 1, lawn shade row spent for [P]] — fainter weights: shadow contrast 28% -> 6%, figures float; needs a mechanism

## Notes for next iteration (max 5 lines)
- 201 [S] pick was battle-feel.h (+ g dropped); 202 must not repeat the pair. Evidence first: next `no evidence` blocker is ui-flow.g (campaign-select shot); maps-light.e now has real blockers.
- `--only` look shots are NOT the full-run frames: the regression scenarios ahead of the showcase consume Math.random, so crowd scenes (shield walls) diverge. Judge a crowd gap's look with a full `--iter` dry run or a shot robust to the divergence.
- Cannon salvo in war_machines kills ~1 squire and throws it ~16 m (x 4 -> 20); most are toppled alive. Any landing/heap gap needs a scene where blasts kill packed men near the camera. Gallery scenes stop advancing at Result (a 2-cannon gallery hit Result fast).
- Clubbers: only ~1/3 are in shove contact at 9s; the rest are Idle/Walking near the press, so poses for them go through `readyBlow` (simulationSystem blowReadyReach) not the shove overlay. Probe animator branches with console.error -> look/summary.json consoleErrors.
- Shadows pass, leave them. No raised idle lean, free-foot 0.08 or walk torso yaw. No [P] on SHOULDER_INSET, TRAPEZIUS_*, NECK_*, hull, pelvis, arm taper, ghost, bow ready, laurel, sunk crouch, CALF_SWELL, helm crown, lawn shade, carry bob, mammoth hull, spear carry, club heave.
