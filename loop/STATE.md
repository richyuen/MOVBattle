# Loop state
Iteration: 72   Last re-audit: 70   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 3 | ui-flow 4 | camera 4 | vfx 3

## Focus (every pickable gap this iteration)
- hill-cap-too-steep-and-pale 8013889 — REJECT (reverted 8eae7b0)
- grass-cards-large-sparse b4fac4b — APPROVE
- foot-slab-too-long 69e133d — APPROVE
- boulders-orange-loaves f7c4595 — APPROVE
- red-team-maroon-not-coral 1f4c96c — APPROVE
- blast-stacked-balls 48224e9 — REJECT (reverted 9c3128e)
- island-square-plateau 5727e3d — APPROVE
- props-undersized-at-range cf80826 — APPROVE

## Last verdicts (one line per gap, verbatim critic header)
- GAP: hill-cap-too-steep-and-pale (8013889) VERDICT: REJECT SCORE: maps-light 3/5 (previous: 3/5)
- GAP: grass-cards-large-sparse (b4fac4b) VERDICT: APPROVE SCORE: maps-light 3/5 (previous: 3/5)
- GAP: foot-slab-too-long (69e133d) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: boulders-orange-loaves (f7c4595) VERDICT: APPROVE SCORE: maps-light 3/5 (previous: 3/5)
- GAP: red-team-maroon-not-coral (1f4c96c) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: blast-stacked-balls (48224e9) VERDICT: REJECT SCORE: vfx 3/5 (previous: 3/5)
- GAP: island-square-plateau (5727e3d) VERDICT: APPROVE SCORE: maps-light 3/5 (previous: 3/5)
- GAP: props-undersized-at-range (cf80826) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [maps-light] island-square-outline: square slab, straight edges, saw-tooth cliffs; cut corners to a rounded outline [attempts: 0] — ref: trailer_1_sheet_01 r1c1 — ours: hud_placement.png
2. [vfx] blast-stacked-balls: hard white sphere with yellow balls and cone horns on a pile of dust spheres [attempts: 2] — ref: trailer_3_sheet_02 r2c1 — ours: war_machines_1100ms.png
3. [maps-light] hill-cap-too-steep-and-pale: mounds are pale hard-edged bare ovals; no blades on them [attempts: 2] — ref: gameplay_sheet_01 r3c2 — ours: hud_placement.png
4. [unit-look] red-cloth-brick-maroon: medieval/renaissance red bodies still brick-maroon under salmon skin [attempts: 0] — ref: trailer_3_sheet_01 r1c2 — ours: closeup_weapon_reads.png
5. [maps-light] grass-dark-tufts-short-of-rim: dark scattered tufts near camera; blades stop short of the rim, leaving a pale band [attempts: 0] — ref: trailer_3_sheet_01 r2c1 — ours: lineup_medieval.png
6. [unit-look] thin-weapons-hairline: swords and bows hairline at lineup range [attempts: 0] — ref: tabs_screenshot_06 — ours: lineup_medieval.png
7. [maps-light] boulders-single-pebbles: single lumps, tan on blue half and grey on red half; TABS heaps [attempts: 0] — ref: tabs_screenshot_02 — ours: hud_placement.png
8. [unit-look] foot-square-toe: feet are square-ended boxes; TABS toe tapers [attempts: 0] — ref: tabs_screenshot_04 — ours: closeup_pair_zeus_thor.png

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- hill-cap-too-steep-and-pale [attempts: 2] — shallow 20 degree sliced cap: low in side view, but still a pale bare crisp oval from above
- blast-stacked-balls [attempts: 2] — white core + 2 yellow lobes + 7 streaks: horned sphere, streaks fat cones, dust-ball base untouched
- blast-launch-too-high-and-stiff [attempts: 1] — knee bend only (lift cut stalled a scenario): bodies still over the trees, legs forked
- battle-cam-inside-near-rank [attempts: 1] — +1.5 m back-off over 6 s: all three symptoms still there at 9s
- placement-haze-washes-teams [attempts: 2] — sun pos + autoCalcShadowZBounds + blur 16: unit shadows vanished

## Notes for next iteration (max 5 lines)
- Gaps 2 and 3 are spent (2 attempts): skip them. 6 pickable gaps remain.
- Gap 1: mapBuilder _createGround: ground, centerGrass, islandUnder (tessellation 4) and the 4-edge crag loop all assume a rectangle.
- Gap 4: unitFactory material presets ~257/281/293, dark red blend targets; gap 5: _createFieldBlades range x 34 / z 24, BLADE_DARK 0.84.
- Gap 6: thicken blades and shafts in buildWeapon, not length; PROP_OVERSIZE 1.25 already applies. Gap 7: seed rock colour, add 2 flank lumps.
- Any cut to blast lift (projectileSystem.ts:388, 3rd arg) fails battle_recap_result_legacy_tank_shell.
