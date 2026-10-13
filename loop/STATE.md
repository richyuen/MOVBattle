# Loop state
Iteration: 143   Last re-audit: 140   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 4 | ui-flow 4 | camera 3 | vfx 3

## Focus (every pickable gap this iteration)
- result-shot-tusk-and-offcentre ada97f0 — REJECT (reverted)
- result-shot-sky-thin — no commit: no lever worked (see Notes)
- spears-too-thick 2f66a19 — APPROVE
- cone-hats-shrunk e88c059 — APPROVE
- tunics-same-teal-and-dark b5a3f89 — REJECT (reverted)
- empty-hud-zero-budget — no commit: premise wrong (see Notes)
- muzzle-puff-dull-and-few-lobes 6ebe102 — APPROVE

## Last verdicts (one line per gap, verbatim critic header)
- GAP: result-shot-tusk-and-offcentre (ada97f0) VERDICT: REJECT SCORE: camera 3/5 (previous: 3/5)
- GAP: spears-too-thick (2f66a19) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: cone-hats-shrunk (e88c059) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: tunics-same-teal-and-dark (b5a3f89) VERDICT: REJECT SCORE: unit-look 3/5 (previous: 3/5)
- GAP: muzzle-puff-dull-and-few-lobes (6ebe102) VERDICT: APPROVE SCORE: vfx 3/5 (previous: 3/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [camera] result-shot-tusk-and-offcentre: tusk x~80-510, no sky; critic: GIANT_SHOT_FOV 0.65 [attempts: 2, spent: skip] — ref: gameplay_sheet_02 r1c2 — ours: big_melee_result.png
2. [unit-look] tunics-same-teal-and-dark: tunic value 0.29-0.35, healer near skin-grey; unitFactory.ts CLOTH_SHADE 0.8 to 1.0, TROUSER_SHADE as is [attempts: 1] — ref: tabs_screenshot_06 — ours: lineup_medieval.png
3. [unit-look] hoods-and-cones-swallow-head: drop hood and hood_liripipe from TALL_HATS, raise the cone seat so the eyes show [attempts: 0] — ref: trailer_3_sheet_02 r1c2 — ours: lineup_medieval.png, big_melee_result.png
4. [vfx] muzzle-lobes-apart: lobes spaced like balloons; projectileSystem.ts smoke scatter 0.5 to 0.3 so they fuse [attempts: 0] — ref: trailer_2_sheet_02 r1c1 — ours: war_machines_3800ms.png
5. [unit-look] cones-brimless-straight: wizard and witch cones need a wide brim and a kinked tip [attempts: 0] — ref: trailer_3_sheet_02 r1c2 — ours: lineup_medieval.png
6. [unit-look] spear-tips-gold: tip material from accent to dark iron ~(0.35,0.35,0.4); propBuilder.ts spear case [attempts: 0] — ref: tabs_screenshot_06 — ours: big_melee_2s.png
7. [battle-feel] stuck-spears-forest: result field is a forest of upright stuck spears; cap them or lay them over near the victors [attempts: 0] — ref: tabs_screenshot_02 — ours: big_melee_result.png
8. [unit-look] lineup-units-small: units ~90px in a 960px frame; move the lineup camera closer (not in capture.mjs) [attempts: 0] — ref: tabs_screenshot_06 — ours: lineup_medieval.png

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- tunics-same-teal-and-dark [attempts: 1] — CLOTH_ACCENT_WEIGHT 0.35: hues still 197 vs 205, healer desaturated to 0.22, value untouched
- result-shot-tusk-and-offcentre [attempts: 2] — fov 0.5 with shy 0.8 (and shy 0.5 before): tusk still x~80-510, long lens stacks the treeline behind the heads and removes the sky
- impact-burst-glow-ball [attempts: 2] — emissives ~0.6 and lit faceted foot: a putty ball on a sandstone mound, no fire hue
- red-skin-no-shade [attempts: 1] — WARM_SKIN_GLOW 0.18: lit side fell; the lit side is what is short
- victory-crossed-by-shafts [attempts: 1] — beta PI/2.25: shafts are the men's own, sky cut to a 10% strip
- streak-too-long [attempts: 1] — lengths 0.8/0.7: still 1.3x the shaft on screen, 1 px hairline
- clubs-shoulder-low [attempts: 1] — shoulder -1.45, jitter 0.5: walk swing still drops the arm
- field-tan [attempts: 1] — diffuse red 1.19: on screen still 217, ACES flattens it

## Notes for next iteration (max 5 lines)
- Spent (never retry, even when a re-audit lists them): impact burst colour/glow, mammoth hide colour, slam-no-airtime, charged-arms-outglow-head, head-pulse-zeus, giant healthScale, mammoth-no-trample, boulders lit colour, fireball lobes, grass tufts, presser-lean-capped, mammoth launch/mop-hat/tusks, airborne-sit-square, cloud bases, far ridge and its snow, corpses-flat, zeus skirt, idle legs, melee-no-downed-bodies, giant victory shot (alpha, beta, aim floor, lens, shy, sky), empty-hud-zero-budget (ref tile is a campaign countdown; sandbox counts up from 0). Never shrink enemy collision distance or lower ally contactBias below 0.55. Never edit capture.mjs.
- ACES: emissive 0.25 shows ~140, 0.65 ~190, 1.0 ~210; diffuse over 1 does not show. Bloom threshold 0.65 (main.ts). Red skin: GREEN_LIFT 0.14, critic: BLUE_LIFT 0.06 to 0.04 next. Muzzle smoke base (2.1,1.8,1.2) is at ref brightness: do not raise it.
- Probe uncommitted with `capture.mjs --iter 9123 --showcase-only` (~2 min); commit one gap per file (`git commit -- <file>`). Poses differ run to run. Critic's named lever can be wrong: probe it. cameraController.ts is CRLF: edit with a node script that matches the file's line endings.
- Victory sky: the treeline and ridge cover it, not the framing. camera.targetScreenOffset moves the eye (parallax), not the picture: the horizon stayed put and the men were cut at the waist.
- Shoulder rotation.x negative raises the arm. Streak is a mesh child "streak". HAT_OVERSIZE 1.3 for helms, TALL_HAT_OVERSIZE 1.6 for the TALL_HATS list (propBuilder.ts).
