# Loop state
Iteration: 20   Last re-audit: 20   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 2 | ui-flow 3 | camera 3 | vfx 3

## Focus (2-3 gaps this iteration)
- mammoth-no-launch 00597b4 — REJECT (reverted 0cbc5a4)
- clone-cone-trees 6e65133 — APPROVE
- text-pill-tray c24abe5 — APPROVE

## Last verdicts (one line per gap, verbatim critic header)
- GAP: mammoth-no-launch (00597b4) VERDICT: REJECT SCORE: battle-feel 3/5 (previous: 3/5)
- GAP: clone-cone-trees (6e65133) VERDICT: APPROVE SCORE: maps-light 2/5 (previous: 2/5)
- GAP: text-pill-tray (c24abe5) VERDICT: APPROVE SCORE: ui-flow 3/5 (previous: 3/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [battle-feel] mammoth-no-launch: victims upright or flat, nobody airborne; want 3-6 bodies in high spinning arcs [attempts: 1] — ref: tabs_screenshot_01 — ours: big_melee_9s.png
2. [vfx] balloon-explosion: huge smooth pastel spheres; want small dust burst, chunky debris, flung bodies [attempts: 1] — ref: trailer_2_sheet_02 r1c1 — ours: war_machines_1100ms.png
3. [camera] gallery-closeup-too-high: closeups steep top-down, units 60px; want eye level, unit half the frame [attempts: 0] — ref: tabs_screenshot_02 — ours: closeup_pair_zeus_thor.png
4. [maps-light] spire-mountains: needle pyramids, pale spike fence; want low wide snow-capped ridges [attempts: 0] — ref: trailer_3_sheet_01 r2c2 — ours: big_melee_result.png
5. [unit-look] cube-hands-stick-limbs: stick limbs, cube hands, box torsos; want tapered limbs, mitts, shaped torsos [attempts: 1] — ref: trailer_3_sheet_01 r1c2 — ours: big_melee_5s.png
6. [ui-flow] tray-glyph-duplicates: 7 tiles share 4 glyphs, 14 faction words, no arc; want unique silhouette per unit, faction icons [attempts: 0] — ref: gameplay_sheet_03 r3c2 — ours: hud_placement.png
7. [maps-light] smooth-egg-boulders: smooth orange eggs; want dark angular faceted rock clusters [attempts: 0] — ref: tabs_screenshot_01 — ours: lineup_medieval.png
8. [unit-look] mammoth-flat-back: box torso, slab back, stiff tusk blocks; want humped sloping back, long curved tusks [attempts: 0] — ref: tabs_screenshot_01 — ours: big_melee_9s.png

## Rejected attempts (last 5, newest first; `rejected-kept` when the revert conflicted)
- mammoth-no-launch [attempts: 1] — no body airborne in any still; launch weaker than the cannon's
- balloon-explosion [attempts: 1] — near-black smoke spheres own 80% of the blast; fire is a body-sized core plus needles
- cube-hands-stick-limbs [attempts: 1] — mitt shows its big face side-on; LIMB_THIN compounded to 0.64
- upright-rigid-ranks [attempts: 1] — 0.22-0.38 rad lean unreadable; holding bracers and idle untouched
- polearm-brace-gap [attempts: 1] — brace-on-brace only, so mixed lines stay planted

## Notes for next iteration (max 5 lines)
- Gaps 1, 2, 5 are in Rejected attempts, so not pickable; pick from 3, 4, 6, 7, 8.
- Gap 6 NEXT EDIT: UNIT_GLYPH_PATHS in main.ts, look up by def.id first, weapon family as fallback.
- Trees NEXT EDIT: second offset outer ring (spread 1.12-1.25), lean to +/-0.3 rad.
- Mammoth launch, if retried: applyBlastLaunch(dir, 3+3f, 5.5+3.5f) in _applySplashDamage; stills at 2/5/9s miss short flights.
