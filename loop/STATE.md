# Loop state
Iteration: 74   Last re-audit: 70   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 3 | ui-flow 4 | camera 4 | vfx 3

## Focus (every pickable gap this iteration)
- cliff-crags-cog-teeth 32a6267 — APPROVE
- red-cloth-dusty-brick a9e0c8b — REJECT (reverted b99c34e)
- grass-blades-no-shadow a01f2a2 — APPROVE
- sword-black-bow-straight ddfd7b3 — APPROVE
- boulder-heaps-pebble-scale 6f920f9 — APPROVE
- knights-one-flat-colour 7c15035 — APPROVE

## Last verdicts (one line per gap, verbatim critic header)
- GAP: cliff-crags-cog-teeth (32a6267) VERDICT: APPROVE SCORE: maps-light 3/5 (previous: 3/5)
- GAP: red-cloth-dusty-brick (a9e0c8b) VERDICT: REJECT SCORE: unit-look 3/5 (previous: 3/5)
- GAP: grass-blades-no-shadow (a01f2a2) VERDICT: APPROVE SCORE: maps-light 3/5 (previous: 3/5)
- GAP: sword-black-bow-straight (ddfd7b3) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: boulder-heaps-pebble-scale (6f920f9) VERDICT: APPROVE SCORE: maps-light 3/5 (previous: 3/5)
- GAP: knights-one-flat-colour (7c15035) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [unit-look] red-cloth-dusty-brick: red is dusty brick (S 0.45 vs 0.8) on armoured units and amber on cloth units [attempts: 1] — ref: trailer_3_sheet_01 r1c2 — ours: closeup_weapon_reads.png
2. [unit-look] tabard-pale-board: knight tabard is a pale protruding board the colour of the helm; team-coloured, body-tight, cream cross strip [attempts: 0] — ref: trailer_1_sheet_01 r2c1 — ours: closeup_weapon_reads.png
3. [maps-light] island-no-cliff-ruled-rim: no cliff shows from placement and the rim is a ruled polygon; let rock show under the lip [attempts: 0] — ref: trailer_1_sheet_01 r1c1 — ours: hud_placement.png
4. [maps-light] boulder-heaps-knee-high: heaps knee-high, collision 0.75 vs 0.925 reach; scale field heaps 1.5x [attempts: 0] — ref: tabs_screenshot_02 — ours: lineup_medieval.png
5. [maps-light] field-no-set-dressing: flat green with only trees and pebbles, no ruins, fences, logs or hills [attempts: 0] — ref: tabs_screenshot_03 — ours: hud_placement.png
6. [unit-look] bow-forearm-sword-short: bows forearm-size, swords short and mid-grey; bow 0.7 tall, blades longer, near-white [attempts: 0] — ref: trailer_3_sheet_01 r1c1 — ours: closeup_weapon_reads.png
7. [maps-light] tree-shadows-hard-dark: tree shadows hard, long and very dark; soften and lighten [attempts: 0] — ref: gameplay_sheet_01 r3c2 — ours: hud_placement.png
8. [battle-feel] front-lines-loose-upright: lines stand upright in loose ranks, ground between units, no two-deep shove [attempts: 0] — ref: tabs_screenshot_06 — ours: big_melee_2s.png

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- red-cloth-dusty-brick [attempts: 1] — warm cloth sat x1.25: skipped the armoured branch, and after the +18 deg hue shift it saturated to amber
- hill-cap-too-steep-and-pale [attempts: 2] — shallow 20 degree sliced cap: low in side view, but still a pale bare crisp oval from above
- blast-stacked-balls [attempts: 2] — white core + 2 yellow lobes + 7 streaks: horned sphere, streaks fat cones, dust-ball base untouched
- blast-launch-too-high-and-stiff [attempts: 1] — knee bend only (lift cut stalled a scenario): bodies still over the trees, legs forked
- battle-cam-inside-near-rank [attempts: 1] — +1.5 m back-off over 6 s: all three symptoms still there at 9s
- placement-haze-washes-teams [attempts: 2] — sun pos + autoCalcShadowZBounds + blur 16: unit shadows vanished

## Notes for next iteration (max 5 lines)
- Iter 75 is a re-audit. 8 pickable. Gap 1: unitFactory cloth branch, saturate warm on the armoured branch too and set the warm hue shift to 0.
- Gap 2: unitFactory tabard block: TABARD_PALE ~0.15, depth 1.02, one cream strip 0.2 chest wide. Gap 6: propBuilder bowHeight 0.4 -> 0.7.
- Gap 3: _createGround crag loop: tops stay inside the rim but drop ~1 below the lawn with pull 0.35-0.45, or bulge below the lip.
- Gap 4: _createBoulder radius size*0.93, b.size*1.5 at the call site. Gap 7: shadow darkness ~0.4; blur 16 once made unit shadows vanish.
- Any cut to blast lift (projectileSystem.ts:388, 3rd arg) fails battle_recap_result_legacy_tank_shell.
