# Loop state
Iteration: 134   Last re-audit: 130   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 3 | ui-flow 4 | camera 4 | vfx 3

## Focus (every pickable gap this iteration)
- stomp-flings-to-edge efaabe7 — APPROVE
- giant-rout 889e17b — APPROVE
- battle-ground-dull c8536cb — APPROVE
- red-tomato a87cbba — APPROVE
- blast-foot-step 1a32d35 — APPROVE
- smoke-belly-ratio afc28f7 — APPROVE
- victory-giant-headless 5d927aa — REJECT (reverted)
- head-pulse-zeus 196dbe5 — REJECT (reverted)

## Last verdicts (one line per gap, verbatim critic header)
- GAP: stomp-flings-to-edge (efaabe7) VERDICT: APPROVE SCORE: battle-feel 3/5 (previous: 3/5)
- GAP: giant-rout (889e17b) VERDICT: APPROVE SCORE: battle-feel 3/5 (previous: 3/5)
- GAP: battle-ground-dull (c8536cb) VERDICT: APPROVE SCORE: maps-light 3/5 (previous: 3/5)
- GAP: red-tomato (a87cbba) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: blast-foot-step (1a32d35) VERDICT: APPROVE SCORE: vfx 3/5 (previous: 3/5)
- GAP: smoke-belly-ratio (afc28f7) VERDICT: APPROVE SCORE: vfx 3/5 (previous: 3/5)
- GAP: victory-giant-headless (5d927aa) VERDICT: REJECT SCORE: camera 4/5 (previous: 4/5)
- GAP: head-pulse-zeus (196dbe5) VERDICT: REJECT SCORE: unit-look 3/5 (previous: 3/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [battle-feel] giant-still-routs: 0/30 vs 19/31 in 21.3 s, mammoth 82% hp after 37 hits, blue melee kills 0; unitDefinitions.ts tribal.mammoth hp 9016 to ~5500 [attempts: 0] — ref: tabs_screenshot_01 — ours: big_melee_result.png
2. [battle-feel] slam-no-airtime: 0 airborne or downed men at 5 s and 9 s, 9 bodies 7-14 behind the front; simulationSystem.ts iconic_mammoth knockback.y floor 1.35 to ~2.4 [attempts: 0] — ref: trailer_3_sheet_01 r1c2 — ours: big_melee_5s.png
3. [camera] victory-giant-headless: hide 37% of width, no head, right 47% empty; cameraController.ts farSide branch target.y to baseY + 2.4, radius stays 4.5 [attempts: 1] — ref: gameplay_sheet_02 r1c2 — ours: big_melee_result.png
4. [maps-light] ground-tan-not-orange: 209,153,90 vs 216,121,79; R-G 56 vs 76-95; placement 219,166,105 vs 238,162,102; mapBuilder.ts grass.diffuseColor green 0.58 to ~0.48 [attempts: 0] — ref: tabs_screenshot_01 — ours: big_melee_2s.png
5. [unit-look] red-shade-not-plum: shade 150,50,63 vs 133,43,90, median 181,84,97 vs 174,78,116; unitFactory.ts WARM_SKIN_GLOW 0.5 to ~0.35, no more blue lift [attempts: 0] — ref: tabs_screenshot_06 — ours: big_melee_9s.png
6. [unit-look] head-darker-than-arms: Zeus head 91,145,183 vs arms 126,154,190; Thor 99,139,173 vs 118,149,179; unitFactory.ts HEAD_GLOW 1.9 to ~2.3 [attempts: 0] — ref: tabs_screenshot_04 — ours: closeup_pair_zeus_thor.png
7. [vfx] blast-foot-wide: orange foot x 760-1290 under a ball x 1010-1370, hard seam, 34% of height vs 27%; visualEffects.ts lobeSizes[1], [3] to 0.7, 0.6 [attempts: 0] — ref: trailer_3_sheet_03 r1c1 — ours: war_machines_1100ms.png
8. [vfx] smoke-boulder-parked: belly/top 0.46-0.48 vs 0.32-0.37, 4 opaque lobes vs a trail of 8+; projectileSystem.ts muzzle smoke count 4 to 7, lead 0.54 to 0.42 [attempts: 0] — ref: trailer_2_sheet_02 r1c1 — ours: war_machines_3800ms.png

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- head-pulse-zeus [attempts: 1] — head took the fx pulse: offset is in the resting state (Thor too), pulse not the cause
- victory-giant-headless [attempts: 1] — farSide radius 6, aim floor 1.0: hide 37% of width, still no head, survivors shrank to 30%
- giant-untouched-wipe [attempts: 1] — healthScale 1.8: same 336 hp lost
- crowd-thin [attempts: 1] — fourth rank in capture.mjs: yardstick moved; dropped at audit 130
- victory-crowded [attempts: 1] — radius cap 6: eye still inside the crowd; dropped at audit 130
- mammoth-no-trample [attempts: 2] — spent
- muzzle-smoke-low-contrast [attempts: 1] — base 0.90 warm, emissive 0.01: lit unchanged, underside brown

## Notes for next iteration (max 5 lines)
- Spent (never retry): mammoth-no-trample, boulders lit colour, fireball lobe sizes/balloon, grass tufts, presser-lean-capped, mammoth melee-hit launch/mop-hat/tusks/hide, airborne-sit-square, cloud bases, far ridge, red-team-maroon, corpses-flat, zeus skirt, idle legs, placement specks, helm, red-rank-knot. Never shrink enemy collision distance or lower ally contactBias below 0.55. Never edit capture.mjs for a gap.
- ACES: emissive 0.25 shows ~140, 0.65 ~190, 1.0 ~210, 2.0 ~235, 3.4 ~245. Saturated red tops out near 205: only lifting green and blue raised it. Grass emissive is 0.16, 0.04, 0.036: more glow lifts red and green alike; shadows must stay plum.
- Probe uncommitted with `capture.mjs --iter 9123 --showcase-only`, view the PNGs, commit one gap per file (`git commit -- <file>`). Some files are CRLF (runtimeUnit.ts). Poses differ run to run. Critic's named material can be wrong (blast foot is footMat, lobes 1 and 3).
- Giant slam is now knockback 1.0, radius 3.0, damage 1.0: splash is no longer the lever. Hits are `direct` + `splash-primary` in impactCountsByPath.
- Camera: followBattle sinks y 0.6 at 0.8/s. Victory shot differs run to run; a wider radius alone never shows the giant's head. hemi.intensity 0.45: no further fill cuts. Head has its own material (HEAD_GLOW 1.9).
