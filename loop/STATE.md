# Loop state
Iteration: 39   Last re-audit: 35   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 3 | ui-flow 4 | camera 4 | vfx 3

## Focus (2-3 gaps this iteration)
- grass-knee-high-needles 3f0920f — APPROVE
- cloth-one-tone-taupe 480319e — APPROVE
- cannon-no-dust-debris 9a16afd — APPROVE

## Last verdicts (one line per gap, verbatim critic header)
- GAP: grass-knee-high-needles (3f0920f) VERDICT: APPROVE SCORE: maps-light 3/5 (previous: 3/5)
- GAP: cloth-one-tone-taupe (480319e) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: cannon-no-dust-debris (9a16afd) VERDICT: APPROVE SCORE: vfx 3/5 (previous: 3/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [unit-look] stick-limbs-box-hands: boxy slab torso, stick limbs, cube hands, big ball head; want tapered torso, small head, mitts [attempts: 2] — ref: tabs_screenshot_06 — ours: closeup_weapon_reads.png
2. [maps-light] island-rect-no-cliff: rectangular field hemmed by pale slabs, no sky; want floating island with visible edge [attempts: 1] — ref: trailer_1_sheet_01 r1c1 — ours: hud_placement.png
3. [vfx] cannon-muzzle-ball-pale-shot: muzzle smoke ball oversized and lingering, shot pale grey-blue, impact clods too many/big/pale; want brief muzzle puff, black ball, few dark chunks [attempts: 0] — ref: trailer_3_sheet_03 r2c1 — ours: war_machines_3800ms.png
4. [unit-look] legs-same-hue-no-belt: trousers a darker shade of the tunic, no belt, red cloth still brown; want neutral-hue legs, dark belt band, crimson cloth [attempts: 0] — ref: tabs_screenshot_06 — ours: big_melee_2s.png
5. [battle-feel] shield-line-gapped: no overlapping wall or two-deep pile [attempts: 1] — ref: tabs_screenshot_06 — ours: big_melee_2s.png
6. [maps-light] clouds-flat-light-flat: blurred white smears, flat lime light; want puffy low-poly clouds, warm sun, long shadows [attempts: 0] — ref: tabs_screenshot_02 — ours: lineup_medieval.png
7. [maps-light] grass-pale-cones-even: tufts paler than lawn and evenly spread, bare patches do not read; want darker clumped tufts on clean mottled lawn [attempts: 0] — ref: trailer_3_sheet_02 r1c1 — ours: big_melee_result.png
8. [unit-look] props-undersized: thin sword, small shield; want shoulder-wide shields, spears taller than unit [attempts: 0] — ref: tabs_screenshot_06 — ours: lineup_medieval.png

## Rejected attempts (last 5, newest first; `rejected-kept` when the revert conflicted)
- shield-line-gapped [attempts: 1] — any ally collision overlap (<1x radius) fails battlefeel_spillover_chain (squire shift 0.50 < 0.55)
- downed-pose-crouch [attempts: 1] — prone bodies hidden by grass; air pose cloned rigid stars
- lime-field-flat-sky [attempts: 1] — sky went grey; -18 saturation muddied team colours
- muzzle-smoke-bank [attempts: 2] — bank is impact smoke, not muzzle
- cube-hands-stick-limbs [attempts: 2] — thin box trades cube for paddle

## Notes for next iteration (max 5 lines)
- N=40 is a re-audit. Pickable: 2, 3, 4, 6, 7, 8 (1 and 5 rejected). 2 and 7 share mapBuilder.ts.
- Gap 3: projectileSystem spawnMuzzleFlash halve cannon smoke size+life, near-black ball; burst ~8 clods, 0.6x, darker dustMat.
- Gap 4: unitFactory TROUSER_SHADE -> desaturate+lighten toward beige/grey; add dark belt band; CLOTH_HUE_SHIFT lower for crimson.
- Gap 7: _createFieldBlades mask cell 4 m -> ~8 m; blades one step darker green than lawn.
- Blast downed time over 3 s fails battle_recap_result_legacy_tank_shell.
