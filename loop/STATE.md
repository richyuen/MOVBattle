# Loop state
Iteration: 73   Last re-audit: 70   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 3 | ui-flow 4 | camera 4 | vfx 3

## Focus (every pickable gap this iteration)
- island-square-outline bf2d452 — APPROVE
- red-cloth-brick-maroon da5608d — APPROVE
- grass-dark-tufts-short-of-rim 4843d10 — APPROVE
- thin-weapons-hairline e4db07a — APPROVE
- boulders-single-pebbles 02d3c03 — APPROVE
- foot-square-toe db82fbb — APPROVE

## Last verdicts (one line per gap, verbatim critic header)
- GAP: island-square-outline (bf2d452) VERDICT: APPROVE SCORE: maps-light 3/5 (previous: 3/5)
- GAP: red-cloth-brick-maroon (da5608d) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: grass-dark-tufts-short-of-rim (4843d10) VERDICT: APPROVE SCORE: maps-light 3/5 (previous: 3/5)
- GAP: thin-weapons-hairline (e4db07a) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: boulders-single-pebbles (02d3c03) VERDICT: APPROVE SCORE: maps-light 3/5 (previous: 3/5)
- GAP: foot-square-toe (db82fbb) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [maps-light] cliff-crags-cog-teeth: crags jut sideways past the lawn as a cog-wheel of flat tabs; pull them under the rim [attempts: 0] — ref: trailer_1_sheet_01 r1c1 — ours: hud_placement.png
2. [unit-look] red-cloth-dusty-brick: red cloth is desaturated dusty brick, maroon in shade; raise warm saturation [attempts: 0] — ref: trailer_3_sheet_01 r1c2 — ours: closeup_weapon_reads.png
3. [vfx] blast-stacked-balls: explosions are stacks of smooth orange, yellow and white balls [attempts: 2] — ref: trailer_3_sheet_02 r2c1 — ours: war_machines_1100ms.png
4. [maps-light] grass-blades-no-shadow: blades take no shadow, so tree shadows are peppered with bright flecks [attempts: 0] — ref: gameplay_sheet_01 r3c2 — ours: hud_placement.png
5. [unit-look] sword-black-bow-straight: sword blades render near-black and bows are straight sticks [attempts: 0] — ref: trailer_1_sheet_01 r2c1 — ours: big_melee_9s.png
6. [maps-light] boulder-heaps-pebble-scale: heaps pebble-scale with wart-size flank lumps; collision under-covers them [attempts: 0] — ref: tabs_screenshot_02 — ours: hud_placement.png
7. [maps-light] hill-cap-too-steep-and-pale: hills are smooth, pale, bladeless discs with a hard rim [attempts: 2] — ref: tabs_screenshot_02 — ours: hud_placement.png
8. [unit-look] knights-one-flat-colour: knights one colour head to boot, no tabard or second colour [attempts: 0] — ref: trailer_1_sheet_01 r2c1 — ours: closeup_weapon_reads.png

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- hill-cap-too-steep-and-pale [attempts: 2] — shallow 20 degree sliced cap: low in side view, but still a pale bare crisp oval from above
- blast-stacked-balls [attempts: 2] — white core + 2 yellow lobes + 7 streaks: horned sphere, streaks fat cones, dust-ball base untouched
- blast-launch-too-high-and-stiff [attempts: 1] — knee bend only (lift cut stalled a scenario): bodies still over the trees, legs forked
- battle-cam-inside-near-rank [attempts: 1] — +1.5 m back-off over 6 s: all three symptoms still there at 9s
- placement-haze-washes-teams [attempts: 2] — sun pos + autoCalcShadowZBounds + blur 16: unit shadows vanished

## Notes for next iteration (max 5 lines)
- Gaps 3 and 7 are spent: skip. 6 pickable. Iter 75 is a re-audit. Island rim helpers: islandRim/onIsland/_islandSlab in mapBuilder.
- Gap 1: _createGround crag loop, `pull` must put each crag centre >= width/2 inside the rim. Gap 4: receiveShadows on both fieldBlades meshes.
- Gap 2: unitFactory warm cloth branch, raise hsv.g (clamped); leave WARM_SHADE_KEEP alone. Gap 8 is new geometry: keep it tiny (tabard box).
- Gap 5: sword blade mat(..., "metal") renders black, use a pale non-metal; bend the bow. Gap 6: flank lumps 0.7-0.85 size, obstacle 0.75.
- Any cut to blast lift (projectileSystem.ts:388, 3rd arg) fails battle_recap_result_legacy_tank_shell. Foot toe-top factor 0.2 could go 0.5.
