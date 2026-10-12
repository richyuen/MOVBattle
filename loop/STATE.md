# Loop state
Iteration: 34   Last re-audit: 30   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 2 | ui-flow 4 | camera 4 | vfx 3

## Focus (2-3 gaps this iteration)
- plank-topple-march 93f114a — APPROVE
- victory-shot-wide-snap 8d17f29 — APPROVE
- lime-field-flat-sky a662fb5 — REJECT (reverted a636711)

## Last verdicts (one line per gap, verbatim critic header)
- GAP: plank-topple-march (93f114a) VERDICT: APPROVE SCORE: battle-feel 3/5 (previous: 3/5)
- GAP: victory-shot-wide-snap (8d17f29) VERDICT: APPROVE SCORE: camera 4/5 (previous: 4/5)
- GAP: lime-field-flat-sky (a662fb5) VERDICT: REJECT SCORE: maps-light 2/5 (previous: 2/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [maps-light] lime-field-flat-sky: lime field under flat teal sky; want pastel ground, teal sky, vivid units [attempts: 1] — ref: tabs_screenshot_01 — ours: big_melee_2s.png
2. [maps-light] chip-grass-bare-field: sparse lone triangles on a bare plane; want dense thin blade tufts, long sun shadows [attempts: 0] — ref: trailer_3_sheet_01 — ours: war_machines_1100ms.png
3. [battle-feel] corpse-planks: dead bodies lie as straight sticks; want folded at hip, limbs splayed [attempts: 0] — ref: trailer_2_sheet_02 — ours: big_melee_result.png
4. [battle-feel] head-coaxial-march: pitched walkers keep head in line with spine; want it hanging forward [attempts: 0] — ref: trailer_3_sheet_01 — ours: big_melee_9s.png
5. [camera] victory-giant-sets-radius: mammoth sets the victory framing, humans a fifth of frame; want human at half, giants cropped [attempts: 0] — ref: gameplay_sheet_02 — ours: big_melee_result.png
6. [unit-look] box-torso-stick-limbs: slab torsos, pipe limbs, grey pot heads; want tapered faceted bodies, round shields, team gear [attempts: 0] — ref: tabs_screenshot_06 — ours: closeup_weapon_reads.png
7. [vfx] glow-puffs-not-chunky: hit flashes and blurred white glows; want faceted smoke, no flash, stuck spears [attempts: 0] — ref: trailer_2_sheet_02 — ours: big_melee_2s.png
8. [ui-flow] placement-haze-debug-labels: placement washed in fog, "Unlimited: Off" and 1000000 budget showing [attempts: 0] — ref: gameplay_sheet_02 — ours: hud_placement.png

## Rejected attempts (last 5, newest first; `rejected-kept` when the revert conflicted)
- lime-field-flat-sky [attempts: 1] — sky went grey; frame-wide -18 saturation muddied team colours
- muzzle-smoke-bank [attempts: 2] — bank is impact smoke, not muzzle; shrinking the muzzle puff left cannons bare
- plank-lean-rod-arms [attempts: 1] — attack-only elbow clamp
- cube-hands-stick-limbs [attempts: 2] — thin box trades cube for paddle
- island-rect-no-cliff [attempts: 1] — cliff band in no PNG

## Notes for next iteration (max 5 lines)
- Iter 35 is a re-audit. Gap 1 list text predates the revert: the sky is the old teal again.
- Gap 1: no global desaturation; sky ~(0.42, 0.78, 0.76) in main.ts + restoreSandboxSceneLook, vignetteWeight ~0.8, ground colour only.
- Gap 4: waist-break neck term 0.6 -> ~1.2, walk neck.x -0.1 -> ~+0.15.
- Gap 5: frameSurvivors: cap tall ~2.2, MAX_RADIUS ~7, target box.focus when the tallest survivor exceeds the cap.
- Gap 3: waist/neck block skips Dead; fold corpses at the hip in _animateDead.
