# Loop state
Iteration: 137   Last re-audit: 135   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 3 | ui-flow 4 | camera 4 | vfx 3

## Focus (every pickable gap this iteration)
- spear-no-streak ae83828 — APPROVE
- red-lit-pink-shade-crimson 74c58aa — APPROVE
- mammoth-plum-not-brown df806d0 — REJECT (reverted)
- victory-group-off-centre 94d3eb4 — APPROVE
- clubs-lean-45 434b90b — REJECT (reverted)
- clear-tab-detached 9f86c23 — APPROVE
- shade-rust-not-plum a840f92 — APPROVE

## Last verdicts (one line per gap, verbatim critic header)
- GAP: spear-no-streak (ae83828) VERDICT: APPROVE SCORE: vfx 3/5 (previous: 3/5)
- GAP: red-lit-pink-shade-crimson (74c58aa) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: mammoth-plum-not-brown (df806d0) VERDICT: REJECT SCORE: unit-look 3/5 (previous: 3/5)
- GAP: victory-group-off-centre (94d3eb4) VERDICT: APPROVE SCORE: camera 4/5 (previous: 4/5)
- GAP: clubs-lean-45 (434b90b) VERDICT: REJECT SCORE: battle-feel 3/5 (previous: 3/5)
- GAP: clear-tab-detached (9f86c23) VERDICT: APPROVE SCORE: ui-flow 4/5 (previous: 4/5)
- GAP: shade-rust-not-plum (a840f92) VERDICT: APPROVE SCORE: maps-light 3/5 (previous: 3/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [battle-feel] clubs-lean-45: marching clubs level, pointing back; proceduralAnimation.ts heavy_carry elbow fold 0.9 to ~0.4, jitter 0.8 to 0.4, so shoulder + elbow is near pi/2 [attempts: 1] — ref: gameplay_sheet_02 r2c2 — ours: big_melee_5s.png
2. [maps-light] field-pale-pink: sunlit field 218,153,119 vs 240,169,105; mapBuilder.ts grass.diffuseColor green 0.5 to 0.56, blue 0.24 to 0.19, emissive untouched [attempts: 0] — ref: gameplay_sheet_01 r1c3 — ours: hud_placement.png
3. [vfx] streak-glowing-beam: streak is an opaque blooming beam; projectileSystem.ts _addStreak emissive 1 to 0.3, alpha 0.5, diameterTop 0.05 to 0.02 [attempts: 0] — ref: trailer_2_sheet_02 r1c1 — ours: closeup_state_reads.png
4. [unit-look] red-shade-hue: shaded red skin 152,30,43 vs 131,29,68; unitFactory.ts raise the blue share of the warm skin glow only, BLUE_LIFT stays 0.12 [attempts: 0] — ref: tabs_screenshot_01 — ours: big_melee_5s.png
5. [camera] victory-group-low: men cut at the chest, heads at 60-85% vs 40%, giant flank over left quarter; cameraController.ts frameSurvivors giant target y down 0.5 [attempts: 0] — ref: gameplay_sheet_02 r1c2 — ours: big_melee_result.png
6. [ui-flow] clear-tab-rounded: Clear is a darker rounded box vs slanted flat-bottomed wing; index.html .btn-clear border-radius 0, clip-path slant on left, drop its own background rule [attempts: 0] — ref: gameplay_sheet_02 r1c3 — ours: hud_placement.png
7. [battle-feel] no-bodies-down: gap-and-poke standoff, none down or airborne at 5 s and 9 s beside a mammoth [attempts: 0] — ref: trailer_3_sheet_01 r1c2 — ours: big_melee_9s.png

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- clubs-lean-45 [attempts: 1] — elbow 1.3: shoulder -1.2 plus elbow is past vertical, club tips back to level
- mammoth-plum-not-brown [attempts: 1] — spent: premise backwards, TABS hide is plum-maroon hue 326-349, as (0.43,0.20,0.25) is
- slam-no-airtime [attempts: 2] — spent
- head-darker-than-arms [attempts: 1] — skin pulse 0.25 to 0.1: charged arms still 36-85 over the head
- head-pulse-zeus [attempts: 1] — head took the fx pulse: offset is in the resting state
- giant-untouched-wipe [attempts: 1] — healthScale 1.8: same 336 hp lost
- mammoth-no-trample [attempts: 2] — spent

## Notes for next iteration (max 5 lines)
- Spent (never retry): mammoth hide colour, slam-no-airtime, charged-arms-outglow-head, mammoth-no-trample, boulders lit colour, fireball lobes, grass tufts, presser-lean-capped, mammoth launch/mop-hat/tusks, airborne-sit-square, cloud bases, far ridge, corpses-flat, zeus skirt, idle legs, helm. Never shrink enemy collision distance or lower ally contactBias below 0.55. Never edit capture.mjs.
- ACES: emissive 0.25 shows ~140, 0.65 ~190, 1.0 ~210. Grass diffuse 1.08, 0.5, 0.24, emissive 0.09, 0.04, 0.06; emissive shows in shadow. hemi.intensity 0.45: no further fill cuts.
- Probe uncommitted with `capture.mjs --iter 9123 --showcase-only`; commit one gap per file (`git commit -- <file>`). Poses differ run to run. Critic's named lever can be wrong: check it is live and probe it (box-centre victory target was a wall of mammoth).
- Shoulder rotation.x negative raises the arm. fx pulse is 0.08-0.22. `.btn:hover` resets background: repeat any fill on `:hover`. Streak is a mesh child named "streak", disposed on arrival; particle trails do not read in stills.
- Victory with a giant: eye a quarter turn off it, beta PI/2.1, target box.group (men within 3 of focus, set in main.ts); radius and aim floor are spent levers.
