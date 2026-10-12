# Loop state
Iteration: 32   Last re-audit: 30   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 2 | ui-flow 4 | camera 4 | vfx 3

## Focus (2-3 gaps this iteration)
- rod-arms-outside-attack 1e3b2a3 — APPROVE
- muzzle-smoke-bank 8817ddf — REJECT (reverted 1b98d27)
- victory-band-buttons 2260669 — APPROVE

## Last verdicts (one line per gap, verbatim critic header)
- GAP: rod-arms-outside-attack (1e3b2a3) VERDICT: APPROVE SCORE: battle-feel 3/5 (previous: 3/5)
- GAP: muzzle-smoke-bank (8817ddf) VERDICT: REJECT SCORE: vfx 3/5 (previous: 3/5)
- GAP: victory-band-buttons (2260669) VERDICT: APPROVE SCORE: ui-flow 4/5 (previous: 4/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [vfx] impact-lobe-bank: cannon impact leaves a white lobe bank taller than a unit; shrink, clamp spawnExplosionBurst lobes [attempts: 0] — ref: trailer_3_sheet_03 r1c1 — ours: war_machines_3800ms.png
2. [battle-feel] plank-lean-bodies: leaning, shoving bodies are straight planks with locked arms; no waist or neck counter-bend [attempts: 1] — ref: tabs_screenshot_01 — ours: big_melee_9s.png
3. [camera] victory-shot-no-survivor: victory shot frames corpses and a cropped mammoth leg [attempts: 0] — ref: gameplay_sheet_02 r1c2 — ours: big_melee_result.png
4. [vfx] cannon-muzzle-puff: cannons show no muzzle puff when firing; want a torso-sized fat puff per shot [attempts: 2] — ref: trailer_2_sheet_02 r1c1 — ours: war_machines_1100ms.png
5. [battle-feel] crew-at-attention: cannon crew stand rigid, one on top of the barrel; want leaning in, hands on gun [attempts: 0] — ref: tabs_screenshot_08 — ours: war_machines_1100ms.png
6. [vfx] zeus-white-blob: Zeus effect a blown-out white blob over a quarter of frame, white glow balls at feet [attempts: 0] — ref: tabs_screenshot_09 — ours: closeup_state_reads.png
7. [unit-look] cube-hands-box-torsos: box torsos, cube hands wider than the forearm [attempts: 2] — ref: tabs_screenshot_04 — ours: closeup_pair_zeus_thor.png
8. [ui-flow] result-prompt-bands: campaign reads "TO NEXT SCENARIO", thin result bands, "Unlimited: Off" pill [attempts: 0] — ref: gameplay_sheet_02 r1c2 — ours: big_melee_result.png

## Rejected attempts (last 5, newest first; `rejected-kept` when the revert conflicted)
- muzzle-smoke-bank [attempts: 2] — bank is impact smoke (spawnExplosionBurst), not muzzle; shrinking the muzzle puff left cannons bare
- plank-lean-rod-arms [attempts: 1] — attack-only elbow clamp; rod arms belong to walking/shoving units
- cube-hands-stick-limbs [attempts: 2] — thin box trades cube for paddle; front view, limbs, torso unchanged
- island-rect-no-cliff [attempts: 1] — cliff band in no PNG; near rim still off-frame
- tray-trees-read-through [attempts: 1] — 88% black slab; TABS tray is a light translucent tint

## Notes for next iteration (max 5 lines)
- Pickable: 1, 2, 3, 5, 6, 8. Not pickable: 4 and 7 (two attempts each).
- Gap 1: visualEffects.ts spawnExplosionBurst: centre 0.85 -> ~0.55, outer 0.45-0.7 -> ~0.3-0.45, clamp lobe scale ~1.3.
- Gap 2: _animateWalkHumanoid: per-unit elbow factor from _wobblePhase (0.5-1.0 rad), neck/waist counter-bend against torso 0.26.
- Gap 8: showResult campaign-win primary label "Continue" (check scenario label assertions first).
- Camera leftover: swoopToBattle lowers lowerRadiusLimit and never restores it.
