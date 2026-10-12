# Loop state
Iteration: 35   Last re-audit: 35   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 2 | ui-flow 4 | camera 4 | vfx 3

## Focus (2-3 gaps this iteration)
- grass-cone-spikes 3213173 — APPROVE
- team-skin-not-on-body ef53fd7+7823347 — APPROVE
- cannon-hit-no-launch 8b3f8b1 — APPROVE

## Last verdicts (one line per gap, verbatim critic header)
- GAP: grass-cone-spikes (3213173) VERDICT: APPROVE SCORE: maps-light 2/5 (previous: 2/5)
- GAP: team-skin-not-on-body (ef53fd7+7823347) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: cannon-hit-no-launch (8b3f8b1) VERDICT: APPROVE SCORE: battle-feel 3/5 (previous: 3/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [maps-light] island-rect-slab (= island-rect-no-cliff): flat rectangular slab, straight edges; want rounded floating island with cliff edge [attempts: 1] — ref: trailer_1_sheet_01 r1c1 — ours: hud_placement.png
2. [unit-look] mono-team-no-cloth: units one flat team hue; want darker or contrasting cloth over team skin [attempts: 0] — ref: tabs_screenshot_06 — ours: lineup_medieval.png
3. [maps-light] grass-confetti-cards: separate wide two-tone chips, bare ground between; want upright overlapping clumps in ground value [attempts: 0] — ref: tabs_screenshot_02 — ours: big_melee_2s.png
4. [battle-feel] blast-victims-stand-up: cannon victims all upright 2.7 s after the hit; want them left sprawled [attempts: 0] — ref: tabs_screenshot_01 — ours: war_machines_3800ms.png
5. [vfx] cannon-no-fireball: impact is a small white puff and pebble ring; want a large orange-white fireball [attempts: 0] — ref: trailer_3_sheet_03 r1c1 — ours: war_machines_1100ms.png
6. [battle-feel] blast-uniform-popcorn: every unit in radius goes straight up; want centre few arcing outward, edge staggering [attempts: 0] — ref: trailer_3_sheet_03 r1c3 — ours: war_machines_1100ms.png
7. [unit-look] torso-box-cube-hands (= cube-hands-stick-limbs): box torsos, cube hands, floating shoulder caps; want tapered torsos, mitts [attempts: 2] — ref: tabs_screenshot_04 — ours: closeup_pair_zeus_thor.png
8. [battle-feel] shield-line-gapped: 2-3 separated shield bearers; want ten overlapping into a wall [attempts: 0] — ref: tabs_screenshot_06 — ours: big_melee_2s.png

## Rejected attempts (last 5, newest first; `rejected-kept` when the revert conflicted)
- lime-field-flat-sky [attempts: 1] — sky went grey; frame-wide -18 saturation muddied team colours
- muzzle-smoke-bank [attempts: 2] — bank is impact smoke, not muzzle
- plank-lean-rod-arms [attempts: 1] — attack-only elbow clamp
- cube-hands-stick-limbs [attempts: 2] — thin box trades cube for paddle
- island-rect-no-cliff [attempts: 1] — cliff band in no PNG

## Notes for next iteration (max 5 lines)
- Gap 2: unitFactory applyMaterialPreset: torso bodyDiffuse ~0.7x of team-tinted colour; metal presets ~35% toward teamColor.
- Gap 3: _createFieldBlades half 0.03-0.05, h 0.10-0.18, BLADE_LIGHT 1.0, BLADE_DARK 0.92.
- Gap 6: projectileSystem blast loop lift 3 + 9*falloff, outward 2 + 4*falloff.
- Body fx emissive (runtimeUnit _applyFxPreset) also washes hero torsos toward grey.
