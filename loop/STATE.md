# Loop state
Iteration: 17   Last re-audit: 15   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 2 | unit-look 3 | maps-light 2 | ui-flow 3 | camera 3 | vfx 3

## Focus (2-3 gaps this iteration)
- tray-shields b67629b — APPROVE
- balloon-explosion 07c7d3c — REJECT, reverted eed197c
- flat-lime-ground 28146b3 — APPROVE

## Last verdicts (one line per gap, verbatim critic header)
- GAP: tray-shields (b67629b) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: balloon-explosion (07c7d3c) VERDICT: REJECT SCORE: vfx 3/5 (previous: 3/5)
- GAP: flat-lime-ground (28146b3) VERDICT: APPROVE SCORE: maps-light 2/5 (previous: 2/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [vfx] balloon-explosion: opaque ball cluster; want a body-engulfing yellow fire mass with a few head-sized grey lobes [attempts: 1] — ref: trailer_3_sheet_03 r2c1 — ours: war_machines_1100ms.png
2. [battle-feel] upright-rigid-ranks: engaged and holding units vertical, straight legs; want 30-45 deg hunch, crouched brace, idle sway [attempts: 1] — ref: tabs_screenshot_06 — ours: big_melee_2s.png
3. [maps-light] brown-mesas-dark-haze: hard saturated brown mountains, far treeline darker than near trees, white grass shards; want pale grey-blue mountains, paler far trees, in-hue blades [attempts: 0] — ref: trailer_3_sheet_01 r2c2 — ours: big_melee_result.png
4. [unit-look] cube-hands-stick-limbs: square plate hands on needle wrists, line ankles on disc feet; want compact mitts, limbs thick to the cuff [attempts: 1] — ref: tabs_screenshot_04 — ours: big_melee_9s.png
5. [unit-look] mammoth-box-tusks: stacked brown boxes, straight tusks, no fur; want faceted rounded body, curved tusks [attempts: 0] — ref: trailer_1_sheet_01 r2c2 — ours: big_melee_9s.png
6. [unit-look] half-size-shields: discs torso-wide with gaps, non-round shields not team-colored; want neck-to-knee overlapping discs [attempts: 0] — ref: tabs_screenshot_06 — ours: big_melee_2s.png
7. [battle-feel] polearm-brace-gap: braced shield lines do not meet; protectors planted, hoplites a body length short [attempts: 1] — ref: tabs_screenshot_06 — ours: big_melee_2s.png
8. [camera] gallery-high-far: lineup/closeup units ~40 px tall seen from above; want a low, close hero angle [attempts: 0] — ref: tabs_screenshot_02 — ours: lineup_medieval.png

## Rejected attempts (last 5, newest first; `rejected-kept` when the revert conflicted)
- balloon-explosion [attempts: 1] — near-black smoke spheres own 80% of the blast; fire is a body-sized core plus needles
- cube-hands-stick-limbs [attempts: 1] — mitt shows its big face side-on; LIMB_THIN compounded to 0.64
- upright-rigid-ranks [attempts: 1] — 0.22-0.38 rad lean unreadable; holding bracers and idle untouched
- polearm-brace-gap [attempts: 1] — brace-on-brace only, so mixed lines stay planted
- cannon-ball-and-impact-burst [attempts: 1] — no black ball in any still: hidden by a 1.6-scale puff

## Notes for next iteration (max 5 lines)
- Pickable now: 3, 5, 6, 8 (1, 2, 4, 7 are under Rejected). 18 is not a re-audit; 20 is.
- Gap 3 NEXT EDIT: mapBuilder BLADE_LIGHT 0.2 -> 0.08, HAZE_MIX 0.5 -> 0.75 toward a lightened fog color.
- Gap 6 NEXT EDIT: propBuilder attachProps non-buckler scale 1.6 -> ~2.4; team-color kite/tower too.
- Blast stills land 0.22-0.27 s after impact: fire must still be the larger shape then; smoke ~0.35 grey, head-sized, 6 lobes.
- Global fog (main.ts 70/170) also fogs the 82 m placement camera: haze far props by color, not fog.
