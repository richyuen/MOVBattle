# Loop state
Iteration: 21   Last re-audit: 20   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 2 | ui-flow 3 | camera 3 | vfx 3

## Focus (2-3 gaps this iteration)
- gallery-closeup-too-high 2a5bc72 — APPROVE
- spire-mountains 4540b26 — APPROVE
- tray-glyph-duplicates 6ea9315 — APPROVE

## Last verdicts (one line per gap, verbatim critic header)
- GAP: gallery-closeup-too-high (2a5bc72) VERDICT: APPROVE SCORE: camera 3/5 (previous: 3/5)
- GAP: spire-mountains (4540b26) VERDICT: APPROVE SCORE: maps-light 2/5 (previous: 2/5)
- GAP: tray-glyph-duplicates (6ea9315) VERDICT: APPROVE SCORE: ui-flow 3/5 (previous: 3/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [maps-light] haze-spike-fence: pale teal cone ring in every shot; want dark saturated green pine band [attempts: 0] — ref: trailer_3_sheet_01 r2c2 — ours: big_melee_result.png
2. [maps-light] mesa-snow-lids: flat-topped humps, glowing lids, below treeline, a wall from placement; want matte pointed ridge twice treeline height [attempts: 0] — ref: trailer_3_sheet_01 r2c2 — ours: closeup_pair_zeus_thor.png
3. [ui-flow] tray-flat-band: full-width bar, boxed tiles, outline glyphs, no faction name; want curved frame, filled silhouettes, faction label [attempts: 0] — ref: gameplay_sheet_03 r3c2 — ours: hud_placement.png
4. [camera] closeups-still-mid-distance: pair a third of frame, battle reads 15-20%; want front rank cut by bottom edge [attempts: 0] — ref: tabs_screenshot_06 — ours: closeup_state_reads.png
5. [ui-flow] result-band-clutter: 190px band, four recap lines, two pills; want only VICTORY! and continue hint in thin bands [attempts: 0] — ref: gameplay_sheet_02 r1c2 — ours: big_melee_result.png
6. [camera] lineup-top-down: steep overhead, units 40px; want eye-level groups [attempts: 0] — ref: tabs_screenshot_08 — ours: lineup_medieval.png
7. [unit-look] hero-pair-rigid: box torsos, arms down, rank-and-file height, tiny hammer; want towering hero mid-swing [attempts: 0] — ref: tabs_screenshot_02 — ours: closeup_pair_zeus_thor.png
8. [vfx] blast-dome (= balloon-explosion): smooth dome of discs; want ragged flame, 8+ bodies flung [attempts: 1] — ref: trailer_3_sheet_03 r1c2 — ours: war_machines_1100ms.png

## Rejected attempts (last 5, newest first; `rejected-kept` when the revert conflicted)
- mammoth-no-launch [attempts: 1] — no body airborne in any still; launch weaker than the cannon's
- balloon-explosion [attempts: 1] — near-black smoke spheres own 80% of the blast; fire is a body-sized core plus needles
- cube-hands-stick-limbs [attempts: 1] — mitt shows its big face side-on; LIMB_THIN compounded to 0.64
- upright-rigid-ranks [attempts: 1] — 0.22-0.38 rad lean unreadable; holding bracers and idle untouched
- polearm-brace-gap [attempts: 1] — brace-on-brace only, so mixed lines stay planted

## Notes for next iteration (max 5 lines)
- Gap 8 is balloon-explosion under a new name: in Rejected attempts, not pickable. Pick from 1-7.
- Gaps 1+2 NEXT EDIT (mapBuilder.ts): HAZE_MIX 0.6->0.25; FAR_SNOW_GLOW 0.3->0.06, cap diameterTop 0.3->0.05, long 1.5x smaller.
- Gap 3 NEXT EDIT: fill closed glyphs (trayGlyphs.ts mammoth, chieftain); active-faction label set in setFaction.
- Gap 4 NEXT EDIT (scenarios.ts): pairCamera radius 8->5.5, target.y 1.1; state/weapon reads radius 14->9. Radius <8 clamps unless applyGalleryPreset widens lowerRadiusLimit.
