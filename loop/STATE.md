# Loop state
Iteration: 23   Last re-audit: 20   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 2 | ui-flow 3 | camera 3 | vfx 3

## Focus (2-3 gaps this iteration)
- mesa-snow-lids 1bce4aa — APPROVE
- closeup-ground-band 2f3f448 — APPROVE
- result-band-clutter dc2282c — APPROVE

## Last verdicts (one line per gap, verbatim critic header)
- GAP: mesa-snow-lids (1bce4aa) VERDICT: APPROVE SCORE: maps-light 2/5 (previous: 2/5)
- GAP: closeup-ground-band (2f3f448) VERDICT: APPROVE SCORE: camera 3/5 (previous: 3/5)
- GAP: result-band-clutter (dc2282c) VERDICT: APPROVE SCORE: ui-flow 3/5 (previous: 3/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [camera] lineup-top-down: steep top-down, units ~60px, no horizon; want eye-level group filling frame [attempts: 0] — ref: tabs_screenshot_06 — ours: lineup_medieval.png
2. [maps-light] mountain-cones-oversized: separate cones ~6x treeline, V gaps, haloed tips, wall across placement view; want one hazed ridge 2-3x treeline [attempts: 0] — ref: trailer_3_sheet_01 r2c2 — ours: big_melee_result.png, hud_placement.png
3. [unit-look] hero-pair-rigid: at attention, arms down, Zeus a grey box torso; want towering hero mid-swing [attempts: 0] — ref: trailer_1_sheet_01 r2c1 — ours: closeup_pair_zeus_thor.png
4. [ui-flow] tray-too-wide-boxed: 1100px dark slab, bordered square tiles; want narrow outlined arc, no fill [attempts: 0] — ref: gameplay_sheet_03 r3c2 — ours: hud_placement.png
5. [vfx] blast-dome (= balloon-explosion): translucent dome, soft balls; want solid faceted chunks, flung bodies [attempts: 1] — ref: tabs_screenshot_01 — ours: war_machines_1100ms.png
6. [maps-light] grass-spikes-and-bloom-clouds: sparse knee-high spikes, glowing blob clouds; want dense small tufts, matte hard-edged puffs [attempts: 0] — ref: tabs_screenshot_01 — ours: closeup_pair_zeus_thor.png
7. [camera] state-reads-still-mid-distance: bottom 30% empty, nobody near lens [attempts: 0] — ref: tabs_screenshot_08 — ours: closeup_state_reads.png
8. [battle-feel] upright-ranks-at-contact (= upright-rigid-ranks): vertical spaced files, gap between lines [attempts: 1] — ref: trailer_3_sheet_01 r1c2 — ours: big_melee_2s.png

## Rejected attempts (last 5, newest first; `rejected-kept` when the revert conflicted)
- mammoth-no-launch [attempts: 1] — no body airborne in any still; launch weaker than the cannon's
- balloon-explosion [attempts: 1] — near-black smoke spheres own 80% of the blast; fire is a body-sized core plus needles
- cube-hands-stick-limbs [attempts: 1] — mitt shows its big face side-on; LIMB_THIN compounded to 0.64
- upright-rigid-ranks [attempts: 1] — 0.22-0.38 rad lean unreadable; holding bracers and idle untouched
- polearm-brace-gap [attempts: 1] — brace-on-brace only, so mixed lines stay planted

## Notes for next iteration (max 5 lines)
- Gaps 5 and 8 are in Rejected attempts: not pickable.
- Gap 2 NEXT EDIT (_createMountain): main peak height*1.25 -> ~0.6, shoulders to match, offsets +-0.35 -> +-0.22; haze rock toward sky.
- Gap 7 NEXT EDIT (scenarios.ts gallery_state_reads): move target onto nearest pair or pull two extraUnits within ~3 of camera; keep beta.
- Result band leftovers: padding 8 -> ~28px, title weight normal, one hint line instead of two actions.
- Gallery presets widen upperBetaLimit/lowerRadiusLimit and never restore them.
