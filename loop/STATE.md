# Loop state
Iteration: 94   Last re-audit: 90   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 3 | ui-flow 4 | camera 4 | vfx 3

## Focus (every pickable gap this iteration)
- front-lines-body-apart 99ee435 — APPROVE
- tribal-apron-outside-ring 4ab0c15 — APPROVE
- sky-top-emerald d9fec31 — APPROVE
- fireball-lemon-band decdd39 — APPROVE
- flung-bodies-starfish 6ef6bdc — APPROVE
- budget-coin-hollow-blue-digits 01f748e — APPROVE

## Last verdicts (one line per gap, verbatim critic header)
- GAP: front-lines-body-apart (99ee435) VERDICT: APPROVE SCORE: battle-feel 3/5 (previous: 3/5)
- GAP: tribal-apron-outside-ring (4ab0c15) VERDICT: APPROVE SCORE: maps-light 3/5 (previous: 3/5)
- GAP: sky-top-emerald (d9fec31) VERDICT: APPROVE SCORE: maps-light 3/5 (previous: 3/5)
- GAP: fireball-lemon-band (decdd39) VERDICT: APPROVE SCORE: vfx 3/5 (previous: 3/5)
- GAP: flung-bodies-starfish (6ef6bdc) VERDICT: APPROVE SCORE: battle-feel 3/5 (previous: 3/5)
- GAP: budget-coin-hollow-blue-digits (01f748e) VERDICT: APPROVE SCORE: ui-flow 4/5 (previous: 4/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [battle-feel] flung-torsos-straight: flung torsos read as straight planks; add a hashed hip/spine fold of 0.3 to 0.9 rad in the air pose [attempts: 0] — ref: trailer_3_sheet_03 r1c1 — ours: war_machines_1100ms.png
2. [maps-light] sky-dark-saturated: dome is 25-45 points darker than TABS at every height, worst at the horizon; raise the horizon base (0.43, 0.78, 0.68) toward (0.52, 0.83, 0.74), leave the divisor [attempts: 0] — ref: tabs_screenshot_01 — ours: big_melee_2s.png
3. [battle-feel] front-flanks-apart: only the centre shield pair touches at 2 s, flanks a body apart, no bodies underfoot; let a bracer also press when its target is inside the bracer's own reach [attempts: 0] — ref: tabs_screenshot_01 — ours: big_melee_2s.png
4. [vfx] fireball-amber-balls-on-top: discrete amber spheres sit on top of the cream heart, no orange fringe at the base; pull flashMat lobes inside the heart, keep flameMat low and outside [attempts: 0] — ref: trailer_3_sheet_03 r1c1 — ours: war_machines_1100ms.png
5. [maps-light] tribal-white-mountains: white low-poly mountains stand behind the tribal tree ring [attempts: 0] — ref: tabs_screenshot_01 — ours: big_melee_5s.png
6. [maps-light] tribal-lip-and-lawn-margin: grey lip and bare lawn margin still outside the ring on the left and right bulges; shelf reach to 0 or darken cliffRock to slate [attempts: 0] — ref: gameplay_sheet_01 r1c3 — ours: hud_placement.png
7. [ui-flow] budget-row-pills: rows sit in outlined pills and the icon is a plain disc, not a crest; drop the per-row border in `.budget-label > span` [attempts: 0] — ref: gameplay_sheet_03 r3c2 — ours: hud_placement.png
8. [ui-flow] result-band-wording: band reads "PRESS [SPACE] TO PLAY AGAIN" with a stray "RESET" label [attempts: 0] — ref: gameplay_sheet_02 r1c2 — ours: big_melee_result.png

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- tribal-apron-outside-ring [attempts: 1] — back-row spread to 1.38: band unchanged, two trees float off the lawn rim (shelf cut approved in 94)
- front-lines-body-apart [attempts: 1] — enemy collision and press at 0.7 of summed radii: regression, topple scenarios lose their push (brace-on-brace press approved in 94)
- muzzle-smoke-one-ball [attempts: 2] — lobe base 0.2: TABS puffs are fat and bigger than a head; before that smokeLife 0.9
- zeus-no-robe-skirt [attempts: 2] — x 1.45, z 2.2, length 1.6: a barrel and a leg still pokes through; before that z 1.7 apron
- corpses-all-flat [attempts: 2] — side roll plus curl: curl hidden in grass, six bodies in one pose; before that roll only
- crowns-second-hue-lemon [attempts: 1] — leaves (0.90, 0.38, 0.30) and emissive 0.30: the yellow material was untouched and still lemon

## Notes for next iteration (max 5 lines)
- Spent (never retry): corpses-all-flat, zeus-no-robe-skirt, muzzle-smoke-one-ball, upright-idle-locked-legs, placement-armies-specks, fireball-balloon-stack. Blast-lift cuts stall battle_recap_result_legacy_tank_shell. Do not shrink the enemy collision distance in _resolveLivingCollisions. Melee press is the `presses` line in simulationSystem (bracers press only bracers; crowd_topple_clubber_vs_protector is rush vs brace, so watch it).
- Sky is the `skyDome` mesh in main.ts (vertex colours, horizon (0.43, 0.78, 0.68), graded over y/700 of radius 1000); fog is the horizon colour, also in mapBuilder restoreSandboxSceneLook, so a horizon change must move both. Shelf is `_islandSlab("islandShelf", ..., 0.05)` plus a fixed 0.03 reach.
- Air pose: hashes 21, 23-32, 40-54 taken; torso already has fold(), twist, roll, pitch; leftOut 0.3-1.2, rightOut 0.7-1.2. Pose-only, no Math.random().
- TEAM_COLORS[1] is (0.8, 0.16, 0.2); do not mutate. getCloth materials are shared: no emissive. Budget numerals are white for both sides; icons are the two ::after rules, pink #f4b8b0.
- EOLs: main.ts and mapBuilder.ts are CRLF; sed -i by line number is safe everywhere (check the line with grep -n first). Edit index.html by line number.
