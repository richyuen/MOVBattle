# Loop state
Iteration: 129   Last re-audit: 125   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 3 | ui-flow 4 | camera 4 | vfx 3

## Focus (every pickable gap this iteration)
- blast-no-warm-foot 7387e9f — APPROVE
- muzzle-smoke-flat-tone e97f793 — APPROVE
- red-skin-bright f8d695b — APPROVE
- mammoth-no-trample 88743a9 — REJECT (reverted 12e73a0)
- blue-tabard-cyan 0e72abf — APPROVE
- reds-trail-mammoth e348368 — REJECT (reverted cf1ac11)
- victory-crowded 8906eaf — REJECT (reverted 6edcd7c)
- crowd-thin 67fef04 — REJECT (reverted 43ae19b)

## Last verdicts (one line per gap, verbatim critic header)
- GAP: blast-no-warm-foot (7387e9f) VERDICT: APPROVE SCORE: vfx 3/5 (previous: 3/5)
- GAP: muzzle-smoke-flat-tone (e97f793) VERDICT: APPROVE SCORE: vfx 3/5 (previous: 3/5)
- GAP: red-skin-bright (f8d695b) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: mammoth-no-trample (88743a9) VERDICT: REJECT SCORE: battle-feel 3/5 (previous: 3/5)
- GAP: blue-tabard-cyan (0e72abf) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: reds-trail-mammoth (e348368) VERDICT: REJECT SCORE: battle-feel 3/5 (previous: 3/5)
- GAP: victory-crowded (8906eaf) VERDICT: REJECT SCORE: camera 4/5 (previous: 4/5)
- GAP: crowd-thin (67fef04) VERDICT: REJECT SCORE: battle-feel 3/5 (previous: 3/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [battle-feel] mammoth-no-trample: enemy upright under the trunk, nobody flung vs bodies underfoot and airborne [attempts: 2, spent] — ref: tabs_screenshot_01 — ours: big_melee_5s.png
2. [camera] victory-crowded: 9+ reds edge to edge vs one or two survivors and open field; main.ts focus = survivor farthest from the group's centre, eye on the centre side at radius 3.5 looking outward [attempts: 1] — ref: gameplay_sheet_02 r1c2 — ours: big_melee_result.png
3. [battle-feel] reds-trail-mammoth: ~10 reds behind the rump, none ahead of the tusks vs infantry leading; sideways(): use the colossus facing when under the speed gate, forward share 0.8 [attempts: 1] — ref: trailer_1_sheet_01 r2c2 — ours: big_melee_9s.png
4. [camera] battle-horizon-high: horizon at 49%, eye above heads, ground fills lower 45% vs horizon at 70%, knee-height eye; cameraController.ts melee branch target.y 1.6 to 1.0, pitchUp -0.04 to +0.05 [attempts: 0] — ref: tabs_screenshot_06 — ours: big_melee_2s.png
5. [vfx] blast-foot-one-sided: body flat cream 231,222,195 with a peach foot on one side vs 250,250,224 core on a full-width 249,219,154 dome; visualEffects.ts footMat on lobe 1 too, footMat green 0.65 to 0.5 [attempts: 0] — ref: trailer_3_sheet_03 r1c1 — ours: war_machines_1100ms.png
6. [vfx] muzzle-smoke-equator: equal spheres with one hard white/grey equator, S 0.01 vs irregular clumps toned facet by facet; projectileSystem.ts tone from normals[n+1]*0.7 + normals[n]*0.3, base (1.6,1.45,1.2) [attempts: 0] — ref: trailer_2_sheet_02 r1c1 — ours: war_machines_3800ms.png
7. [battle-feel] showcase-rout: ~20 of 31 reds standing at the result vs 1-2 survivors amid the dead; the mammoth unbalances the sides [attempts: 0] — ref: gameplay_sheet_02 r1c2 — ours: big_melee_result.png
8. [unit-look] red-lit-faces-dim: lit faces V 0.74 S 0.54 vs V 0.85 S 0.58, blue shields V 0.72 beside V 0.45 tabards; unitFactory.ts WARM_SKIN lifts 0.10/0.08, tabard saturation floor 0.85 [attempts: 0] — ref: trailer_1_sheet_01 r2c1/r2c2 — ours: big_melee_result.png

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- crowd-thin [attempts: 1] — fourth rank in capture.mjs: yardstick moved, game unchanged; ground still bare at 2s
- victory-crowded [attempts: 1] — radius cap 6: eye still inside the crowd, 20+ survivors fill any radius 3-6
- reds-trail-mammoth [attempts: 1] — 0.3 heading in sideways(): gated on speed, zero once the mammoth stalls
- mammoth-no-trample [attempts: 2] — pressure x2.5 from a moving colossus: gate off at contact, bodies only tip; spent
- boulders-lit-violet-2 [attempts: 2] — spent
- muzzle-smoke-low-contrast [attempts: 1] — base 0.90 warm, emissive 0.01: lit unchanged, underside brown
- victory-giant-wall [attempts: 1] — alpha 60 deg off the giant: wall grew to 45%
- blue-army-slate [attempts: 1] — saturation x1.6 on body only: not visible

## Notes for next iteration (max 5 lines)
- Spent (never retry): mammoth-no-trample, boulders lit colour, fireball lobe sizes/balloon, grass tufts, presser-lean-capped, mammoth melee-hit launch/mop-hat/tusks/hide, airborne-sit-square, cloud bases, far ridge, red-team-maroon, corpses-flat, zeus skirt, idle legs, placement specks, helm, red-rank-knot. Never shrink enemy collision distance or lower ally contactBias below 0.55. Never edit capture.mjs for a gap.
- ACES: emissive 0.25 shows ~140, 0.65 ~190, 1.0 ~210, 2.0 ~235. Emissive lifts lit and shade alike. Camera-facing facets are sky-lit (B over R); base colours past 1 work; contrast needs vertex tints (smoke) or base colour.
- Probe uncommitted with `capture.mjs --iter 9123 [--showcase-only]`; sample PNG regions, tune, then commit. Check critic levers.
- Mammoth: colossal has resistance 1e6 against same-team contact and parts allies sideways while moving over 0.2. One gap, one change; recheck big_melee_result after any sim edit.
- Source files are CRLF: edit by exact-string node script; commit with `git commit <file> -F -` heredoc. Two gaps in one file: apply and commit one at a time.
