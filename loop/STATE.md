# Loop state
Iteration: 38   Last re-audit: 35   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 3 | ui-flow 4 | camera 4 | vfx 3

## Focus (2-3 gaps this iteration)
- grass-slab-carpet 2d247c6 — APPROVE
- red-cloth-bare-thighs 68baa20 — APPROVE
- shield-line-gapped 1dba1dc+6e3b12f — REJECT before critic (regression, reverted)

## Last verdicts (one line per gap, verbatim critic header)
- GAP: grass-slab-carpet (2d247c6) VERDICT: APPROVE SCORE: maps-light 3/5 (previous: 3/5)
- GAP: red-cloth-bare-thighs (68baa20) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [unit-look] stick-limbs-box-hands: boxy slab torso, stick limbs, cube hands, big ball head; want tapered torso, small head, mitts [attempts: 2] — ref: tabs_screenshot_06 — ours: closeup_weapon_reads.png
2. [maps-light] island-rect-no-cliff: rectangular field hemmed by pale slabs, no sky; want floating island with visible edge [attempts: 1] — ref: trailer_1_sheet_01 r1c1 — ours: hud_placement.png
3. [maps-light] grass-knee-high-needles: uniform knee-high needles, bare patches barely read; want short lawn, sparse tufts, feet visible [attempts: 0] — ref: trailer_3_sheet_02 r1c1 — ours: big_melee_result.png
4. [unit-look] cloth-one-tone-taupe: tunic and trousers one tone, red cloth washed-out taupe; want saturated team-tinted cloth, distinct legs, belt break [attempts: 0] — ref: tabs_screenshot_06 — ours: big_melee_2s.png
5. [battle-feel] shield-line-gapped: no overlapping wall or two-deep pile [attempts: 1] — ref: tabs_screenshot_06 — ours: big_melee_2s.png
6. [vfx] cannon-no-dust-debris: oversized white smoke ball, pale shot; want smaller puff, black ball, dust burst on impact [attempts: 0] — ref: tabs_screenshot_02 — ours: war_machines_1100ms.png
7. [maps-light] clouds-flat-light-flat: blurred white smears, flat lime light; want puffy low-poly clouds, warm sun, long shadows [attempts: 0] — ref: tabs_screenshot_02 — ours: lineup_medieval.png
8. [unit-look] props-undersized: thin sword, small shield; want shoulder-wide shields, spears taller than unit [attempts: 0] — ref: tabs_screenshot_06 — ours: lineup_medieval.png

## Rejected attempts (last 5, newest first; `rejected-kept` when the revert conflicted)
- shield-line-gapped [attempts: 1] — any ally collision overlap (<1x radius) fails battlefeel_spillover_chain (squire shift 0.50 < 0.55)
- downed-pose-crouch [attempts: 1] — prone bodies hidden by grass; air pose cloned rigid stars
- lime-field-flat-sky [attempts: 1] — sky went grey; -18 saturation muddied team colours
- muzzle-smoke-bank [attempts: 2] — bank is impact smoke, not muzzle
- cube-hands-stick-limbs [attempts: 2] — thin box trades cube for paddle

## Notes for next iteration (max 5 lines)
- Pickable now: 2, 3, 4, 6, 7, 8 (1 and 5 are on the rejected list). 2 and 3 share mapBuilder.ts.
- Gap 3: _createFieldBlades bare-cell threshold 0.35 -> ~0.55, h to 0.12-0.25.
- Gap 4: unitFactory CLOTH_SATURATION 0.7 -> ~0.9, CLOTH_SHADE -> ~0.75.
- Gap 6: burst dust spawns below grass tops; launch higher, bigger clods, outlive the 1.1 s burst.
- Blast downed time over 3 s fails battle_recap_result_legacy_tank_shell.
