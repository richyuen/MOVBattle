# Loop state
Iteration: 25   Last re-audit: 25   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 2 | ui-flow 3 | camera 4 | vfx 3

## Focus (2-3 gaps this iteration)
- grass-spikes-and-bloom-clouds 4d0cea9 — REJECT (reverted 531c00b)
- tray-no-fill-no-tab-tiles 76f9865 — APPROVE
- battle-cam-too-far 1b4ed97 — APPROVE

## Last verdicts (one line per gap, verbatim critic header)
- GAP: grass-spikes-and-bloom-clouds (4d0cea9) VERDICT: REJECT SCORE: maps-light 2/5 (previous: 2/5)
- GAP: tray-no-fill-no-tab-tiles (76f9865) VERDICT: APPROVE SCORE: ui-flow 3/5 (previous: 3/5)
- GAP: battle-cam-too-far (1b4ed97) VERDICT: APPROVE SCORE: camera 4/5 (previous: 3/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [maps-light] grass-spikes-and-bloom-clouds: uniform white cloud blobs with glow ramp; knee-high dark spike tufts [attempts: 1] — ref: tabs_screenshot_01 — ours: big_melee_2s.png
2. [vfx] blast-dome (= balloon-explosion): opaque yellow/orange sphere cluster ~0.5 frame wide; want <=2 unit heights, small puffs [attempts: 1] — ref: tabs_screenshot_08 — ours: war_machines_1100ms.png
3. [unit-look] cube-hands-stick-limbs: cube hands, pencil limbs; want limbs >=0.3 torso width [attempts: 1] — ref: tabs_screenshot_06 — ours: closeup_pair_zeus_thor.png
4. [battle-feel] mammoth-no-launch: nothing airborne at contact; want 2+ units above head height [attempts: 1] — ref: tabs_screenshot_01 — ours: big_melee_5s.png
5. [battle-feel] upright-ranks-at-contact (= upright-rigid-ranks): vertical ranks; want 15+ degree lean [attempts: 1] — ref: trailer_3_sheet_01 r1c2 — ours: big_melee_2s.png
6. [maps-light] placement-no-island-edge: field runs off frame; want rim and sky on 3 sides [attempts: 0] — ref: gameplay_sheet_01 r3c2 — ours: hud_placement.png
7. [ui-flow] tray-trees-read-through: canopies readable through tray, round tab bottoms; want <15 levels difference, pointed tabs [attempts: 0] — ref: gameplay_sheet_02 r1c3 — ours: hud_placement.png
8. [camera] battle-cam-ranged-off-frame: ranged armies at frame edges; melee foreground strip 0.17, want <=0.12 [attempts: 0] — ref: tabs_screenshot_08 — ours: war_machines_1100ms.png

## Rejected attempts (last 5, newest first; `rejected-kept` when the revert conflicted)
- grass-spikes-and-bloom-clouds [attempts: 1] — clouds still uniform white with halo (emissive swamps diffuse); patch tufts still 4-sided cones
- mammoth-no-launch [attempts: 1] — no body airborne in any still; launch weaker than the cannon's
- balloon-explosion [attempts: 1] — near-black smoke spheres own 80% of the blast; fire is a body-sized core plus needles
- cube-hands-stick-limbs [attempts: 1] — mitt shows its big face side-on; LIMB_THIN compounded to 0.64
- upright-rigid-ranks [attempts: 1] — 0.22-0.38 rad lean unreadable; holding bracers and idle untouched

## Notes for next iteration (max 5 lines)
- Gaps 1-5 are in Rejected attempts: not pickable. Pickable: 6, 7, 8 (+ below cap: hero-pair-rigid, lineup-units-still-small, state-reads-still-mid-distance, ridge-still-pointed, all [0]).
- Gap 7 NEXT EDIT (index.html): #unitPanel alpha 0.62 -> ~0.85; .faction-tab pointed bottom (clip-path).
- Gap 8 NEXT EDIT (swoopToBattle): target y 1.3 -> ~1.0; widen radius when armies are far apart so the near line stays in frame.
- Gap 1 lesson: cloud diffuse ~0.75 / emissive ~0.3, peak <200/255; delete cone loop in _createGrassPatches; the short in-hue blade change was liked.
