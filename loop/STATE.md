# Loop state
Iteration: 91   Last re-audit: 90   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 3 | ui-flow 4 | camera 4 | vfx 3

## Focus (every pickable gap this iteration)
- sky-teal-greyed be08750 — APPROVE
- corpses-all-flat 99e8218 — REJECT (reverted 29ae269)
- tray-filled-trapezoid 1869762 — APPROVE
- zeus-no-robe-skirt be5a1bf — REJECT (reverted 06550e3)
- flung-torsos-rigid-planks 56ee53c — REJECT (reverted 8169d58)
- faction-tabs-rounded-squares 26bbb2e — APPROVE
- muzzle-smoke-one-ball 71418e1 — REJECT (reverted 3fd0d58)
- tribal-rim-grey-slab-exposed bbb855d — APPROVE

## Last verdicts (one line per gap, verbatim critic header)
- GAP: sky-teal-greyed (be08750) VERDICT: APPROVE SCORE: maps-light 3/5 (previous: 3/5)
- GAP: corpses-all-flat (99e8218) VERDICT: REJECT SCORE: battle-feel 3/5 (previous: 3/5)
- GAP: tray-filled-trapezoid (1869762) VERDICT: APPROVE SCORE: ui-flow 4/5 (previous: 4/5)
- GAP: zeus-no-robe-skirt (be5a1bf) VERDICT: REJECT SCORE: unit-look 3/5 (previous: 3/5)
- GAP: flung-torsos-rigid-planks (56ee53c) VERDICT: REJECT SCORE: battle-feel 3/5 (previous: 3/5)
- GAP: faction-tabs-rounded-squares (26bbb2e) VERDICT: APPROVE SCORE: ui-flow 4/5 (previous: 4/5)
- GAP: muzzle-smoke-one-ball (71418e1) VERDICT: REJECT SCORE: vfx 3/5 (previous: 3/5)
- GAP: tribal-rim-grey-slab-exposed (bbb855d) VERDICT: APPROVE SCORE: maps-light 3/5 (previous: 3/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [unit-look] zeus-no-robe-skirt: legs punch through the skirt front; skirt x scale 1.08 -> 1.45, z 1.15 -> 2.2, length 0.9 -> 1.6 [attempts: 1] — ref: gameplay_sheet_06 r3c1 — ours: closeup_pair_zeus_thor.png
2. [battle-feel] corpses-all-flat: corpses share one pose and sink into grass [attempts: 2] — ref: tabs_screenshot_01 — ours: war_machines_3800ms.png
3. [battle-feel] flung-torsos-rigid-planks: chest-on flung bodies read as planks; add a sideways (z) waist lean of at least 0.4 rad in _buildAirPose [attempts: 1] — ref: trailer_3_sheet_03 r1c2 — ours: war_machines_1100ms.png
4. [vfx] muzzle-smoke-one-ball: keep smokeLife 1.5, only shrink lobe base 0.3 -> 0.2 [attempts: 1] — ref: trailer_2_sheet_02 r1c1 — ours: war_machines_1100ms.png
5. [vfx] impact-burst-tricolour: burst is white, yellow and orange balls; make it one orange-yellow, no white lobe [attempts: 0] — ref: trailer_3_sheet_03 r1c1 — ours: war_machines_1100ms.png
6. [maps-light] tribal-rim-flanks-bare: grey rim bare on both upper flanks; back row arc 2.2 -> 3.0 rad, 12 -> 16 trees [attempts: 0] — ref: gameplay_sheet_01 r1c3 — ours: hud_placement.png
7. [ui-flow] budget-plain-boxes: budget and unit count are square boxes; curved right edge and icons on #budget panels [attempts: 0] — ref: gameplay_sheet_02 r1c3 — ours: hud_placement.png
8. [maps-light] sky-flat-one-teal: fogColor paler (0.30, 0.74, 0.60) than clearColor, in main.ts and restoreSandboxSceneLook [attempts: 0] — ref: tabs_screenshot_01 — ours: big_melee_2s.png

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- muzzle-smoke-one-ball [attempts: 1] — smokeLife 0.9: smoke gone inside a second, TABS smoke hangs over the line; tabs_screenshot_08 shows no smoke
- flung-torsos-rigid-planks [attempts: 1] — fold floor 0.7: a forward bend is hidden chest-on, 2 of 6 still planks
- zeus-no-robe-skirt [attempts: 1] — length 1.6, z 1.7: length right, but both thighs clip through the front like an apron
- corpses-all-flat [attempts: 2] — side roll plus curl (hips 0.5/0.75, knees 0.9): curl hidden in grass, six bodies in one pose; before that roll only
- crowns-second-hue-lemon [attempts: 1] — leaves (0.90, 0.38, 0.30) and emissive 0.30: the yellow material was untouched and still lemon
- grass-knee-high-carpet [attempts: 2] — half 0.025+s*0.02: needles, cards must be wide; before that patchHeight cut
- far-band-level-berry-hedge [attempts: 2] — height 5-11: giant trunkless balls; before that 2-6.5: hidden below the ring
- lightning-ruler-straight-bars [attempts: 2] — strict alternation still an even thin sawtooth; before that parallel bars

## Notes for next iteration (max 5 lines)
- Spent (2 attempts, never retry): corpses-all-flat, upright-idle-locked-legs, placement-armies-specks, fireball-balloon-stack. Blast-lift cuts stall battle_recap_result_legacy_tank_shell. Air-pose edits stay pose-only.
- Ring is 210 trees 3-6 tall, plus a 12-tree back row at +Z spanning 2.2 rad, 4-7 tall (seeds 121-124). Sky and fog are (0.14, 0.62, 0.46), in main.ts and mapBuilder restoreSandboxSceneLook. trailer_3_sheet_03 r3c1 is not TABS.
- _buildLimpPose and death must draw no new Math.random(): use `pick`/`fall` bits (512, 1024, 2048 taken). No side-roll code exists now.
- TEAM_COLORS[1] is (0.8, 0.16, 0.2); do not mutate. getCloth materials are shared: no emissive. Zeus edits gate on `isZeus`. LIMB_THIN is 1.2. Faction tabs use clip-path, which cuts their top border.
- EOLs are mixed (index.html and mapBuilder.ts LF, projectileSystem.ts CRLF): check with `file`. sed -i by line number works; `rgba(10,14,20,0.45)` occurs twice in index.html.
