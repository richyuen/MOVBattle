# Loop state
Iteration: 93   Last re-audit: 90   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 3 | ui-flow 4 | camera 4 | vfx 3

## Focus (every pickable gap this iteration)
- impact-burst-tricolour 1125969 — APPROVE
- sky-flat-one-teal 7c38c39 — APPROVE
- flung-limbs-tucked 23a9a7c — APPROVE
- budget-icons-small-pale 465ffe1 — APPROVE
- tribal-apron-outside-ring ed95575 — REJECT (reverted 7334e7a)
- front-lines-body-apart 02b75f8 — rejected before review: regression (reverted 72ed722)

## Last verdicts (one line per gap, verbatim critic header)
- GAP: impact-burst-tricolour (1125969) VERDICT: APPROVE SCORE: vfx 3/5 (previous: 3/5)
- GAP: sky-flat-one-teal (7c38c39) VERDICT: APPROVE SCORE: maps-light 3/5 (previous: 3/5)
- GAP: flung-limbs-tucked (23a9a7c) VERDICT: APPROVE SCORE: battle-feel 3/5 (previous: 3/5)
- GAP: budget-icons-small-pale (465ffe1) VERDICT: APPROVE SCORE: ui-flow 4/5 (previous: 4/5)
- GAP: tribal-apron-outside-ring (ed95575) VERDICT: REJECT SCORE: maps-light 3/5 (previous: 3/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [battle-feel] front-lines-body-apart: lines stay a body apart at 2 s, no two-deep pile underfoot [attempts: 1] — ref: tabs_screenshot_01 — ours: big_melee_2s.png
2. [maps-light] tribal-apron-outside-ring: grey band is the islandShelf ledge, not missing trees; cut its ragged reach 0.14 -> 0.05, keep back-row spread 1.24 + 0.06 [attempts: 1] — ref: gameplay_sheet_01 r1c3 — ours: hud_placement.png
3. [maps-light] sky-top-emerald: top renders (15,146,110) against TABS (53,169,150); blue term 0.68 - 0.10*t and grade over y/700 [attempts: 0] — ref: tabs_screenshot_01 — ours: big_melee_2s.png
4. [unit-look] zeus-no-robe-skirt: leg clips through a barrel-wide robe; wants a slim body-width robe [attempts: 2] — ref: gameplay_sheet_06 r3c1 — ours: closeup_pair_zeus_thor.png
5. [vfx] muzzle-smoke-one-ball: one white sphere plus pellets; wants equal grey faceted lumps in a bank [attempts: 2] — ref: trailer_2_sheet_02 r1c1 — ours: war_machines_1100ms.png
6. [vfx] fireball-lemon-band: flashMat lobes are flat lemon patches between cream heart and orange fringe; diffuse -> about (1, 0.7, 0.2) [attempts: 0] — ref: trailer_3_sheet_03 r1c1 — ours: war_machines_1100ms.png
7. [battle-feel] flung-bodies-starfish: airborne bodies share one symmetric straight-limbed spread; leftOut 0.3 + h(51) * 0.9 so the arms differ [attempts: 0] — ref: trailer_3_sheet_03 r1c1 — ours: war_machines_1100ms.png
8. [ui-flow] budget-coin-hollow-blue-digits: coin is an outline ring and numerals pale blue; fill the coin, numerals white [attempts: 0] — ref: gameplay_sheet_03 r3c2 — ours: hud_placement.png

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- tribal-apron-outside-ring [attempts: 1] — back-row spread to 1.38: band unchanged, two trees float off the lawn rim (54 by 48)
- front-lines-body-apart [attempts: 1] — enemy collision and press at 0.7 of summed radii: regression, crowd_topple_clubber_vs_protector and battlefeel_attack_interrupt_charge lose their push and topple
- sky-flat-one-teal [attempts: 1] — fog only: sky still one flat colour (dome approved in 93)
- muzzle-smoke-one-ball [attempts: 2] — lobe base 0.2: TABS puffs are fat and bigger than a head; before that smokeLife 0.9
- zeus-no-robe-skirt [attempts: 2] — x 1.45, z 2.2, length 1.6: a barrel and a leg still pokes through; before that z 1.7 apron
- corpses-all-flat [attempts: 2] — side roll plus curl: curl hidden in grass, six bodies in one pose; before that roll only
- crowns-second-hue-lemon [attempts: 1] — leaves (0.90, 0.38, 0.30) and emissive 0.30: the yellow material was untouched and still lemon

## Notes for next iteration (max 5 lines)
- Spent (never retry): corpses-all-flat, zeus-no-robe-skirt, muzzle-smoke-one-ball, upright-idle-locked-legs, placement-armies-specks, fireball-balloon-stack. Blast-lift cuts stall battle_recap_result_legacy_tank_shell. Do not shrink the enemy collision distance in _resolveLivingCollisions: topple scenarios need the full-radius push.
- Sky is the `skyDome` mesh in main.ts (vertex colours, pale (0.43, 0.78, 0.68) at the horizon, deep by y/450 of radius 1000); fog is the horizon colour, also in mapBuilder restoreSandboxSceneLook; themes disable the dome. Ring is 210 trees plus a 16-tree back row, spread 1.24-1.30.
- Air pose: hashes 21, 23-32, 40-54 taken; arms use leftOut/rightOut and leftBend/rightBend; iter 89 narrowed a wide leg V. Pose-only, no Math.random().
- TEAM_COLORS[1] is (0.8, 0.16, 0.2); do not mutate. getCloth materials are shared: no emissive. Budget icons are the two ::after rules, pink #f4b8b0, 24px.
- EOLs: main.ts and mapBuilder.ts are CRLF, so multi-line edits need a script that normalises and restores; sed -i mid-line edits are safe. Edit index.html by line number.
