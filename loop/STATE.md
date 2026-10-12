# Loop state
Iteration: 71   Last re-audit: 70   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 3 | ui-flow 4 | camera 4 | vfx 3

## Focus (every pickable gap this iteration)
- foot-box-wider-than-ankle d25c999 — APPROVE
- hill-bald-oval-rim d65956d — REJECT (reverted a47b70a)
- grass-tufts-oversized fea52f7 — APPROVE

## Last verdicts (one line per gap, verbatim critic header)
- GAP: foot-box-wider-than-ankle (d25c999) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: hill-bald-oval-rim (d65956d) VERDICT: REJECT SCORE: maps-light 3/5 (previous: 3/5)
- GAP: grass-tufts-oversized (fea52f7) VERDICT: APPROVE SCORE: maps-light 3/5 (previous: 3/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [maps-light] hill-cap-too-steep-and-pale: mounds still pale hard-edged ovals from above; flatten to a ~20 degree cap [attempts: 1] — ref: gameplay_sheet_01 r3c2 — ours: hud_placement.png
2. [maps-light] grass-cards-large-sparse: tufts are big star-shaped blotches, not a fine blade carpet [attempts: 0] — ref: trailer_3_sheet_01 r2c1 — ours: lineup_medieval.png
3. [unit-look] foot-slab-too-long: narrow feet are ski-length and square-toed [attempts: 0] — ref: tabs_screenshot_04 — ours: closeup_pair_zeus_thor.png
4. [maps-light] boulders-orange-loaves: rocks are smooth orange ellipsoids; TABS grey/tan and faceted [attempts: 0] — ref: tabs_screenshot_02 — ours: closeup_state_reads.png
5. [unit-look] red-team-maroon-not-coral: red units dark burgundy; TABS bright salmon [attempts: 0] — ref: trailer_3_sheet_01 r1c2 — ours: closeup_weapon_reads.png
6. [vfx] blast-stacked-balls: overlapping yellow/orange/white spheres on brown puffs; TABS flat yellow-white flash with streaks [attempts: 1] — ref: trailer_3_sheet_02 r2c1 — ours: war_machines_1100ms.png
7. [maps-light] island-square-plateau: square slab, straight edges, coloured side strips; TABS rounded irregular island [attempts: 0] — ref: trailer_1_sheet_01 r1c1 — ours: hud_placement.png
8. [unit-look] props-undersized-at-range: lineup weapons and hats are slivers, shield a narrow kite [attempts: 0] — ref: tabs_screenshot_06 — ours: lineup_medieval.png

## Rejected attempts (last 5, newest first; `rejected-kept` when the revert conflicted)
- hill-cap-too-steep-and-pale (was hill-bald-oval-rim) [attempts: 1] — scaleY 1.2h sunk 0.3h: edge still ~60 degrees, still pale with a dark crescent
- blast-launch-too-high-and-stiff [attempts: 1] — knee bend only (lift cut stalled a scenario): bodies still over the trees, legs forked
- blast-stacked-balls (was fireball-balloon-cluster) [attempts: 1] — glow un-excluded + cap 1.1: white egg, still ~2 men tall
- battle-cam-inside-near-rank [attempts: 1] — +1.5 m back-off over 6 s: all three symptoms still there at 9s
- placement-haze-washes-teams [attempts: 2] — sun pos + autoCalcShadowZBounds + blur 16: unit shadows vanished

## Notes for next iteration (max 5 lines)
- Gaps 1 and 6 are under Rejected, not pickable. Gap 1 next edit: _createHill scaleY ~8-10x height, position.y = 0.3*height - 0.5*scaleY.
- Gap 2: mapBuilder _createFieldBlades, halve patch footprint (4 m cells) and double count inside |x| < 24.
- Gap 3: bodyBuilder footLength from lowerLegBottom * 1.6-1.8 instead of 0.24 * bulk.
- Any cut to blast lift (projectileSystem.ts:388, 3rd arg) fails battle_recap_result_legacy_tank_shell.
