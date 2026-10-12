# Loop state
Iteration: 92   Last re-audit: 90   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 3 | ui-flow 4 | camera 4 | vfx 3

## Focus (every pickable gap this iteration)
- zeus-no-robe-skirt 46fa600 — REJECT (reverted 8c82e26)
- flung-torsos-rigid-planks d923355 — APPROVE
- muzzle-smoke-one-ball f9b0345 — REJECT (reverted a1110f7)
- impact-burst-tricolour 50262ac — REJECT (reverted 1095567)
- tribal-rim-flanks-bare 78be176 — APPROVE
- budget-plain-boxes 5b63f82 — APPROVE
- sky-flat-one-teal 39a9abd — REJECT (reverted bb07732)

## Last verdicts (one line per gap, verbatim critic header)
- GAP: zeus-no-robe-skirt (46fa600) VERDICT: REJECT SCORE: unit-look 3/5 (previous: 3/5)
- GAP: flung-torsos-rigid-planks (d923355) VERDICT: APPROVE SCORE: battle-feel 3/5 (previous: 3/5)
- GAP: muzzle-smoke-one-ball (f9b0345) VERDICT: REJECT SCORE: vfx 3/5 (previous: 3/5)
- GAP: impact-burst-tricolour (50262ac) VERDICT: REJECT SCORE: vfx 3/5 (previous: 3/5)
- GAP: tribal-rim-flanks-bare (78be176) VERDICT: APPROVE SCORE: maps-light 3/5 (previous: 3/5)
- GAP: budget-plain-boxes (5b63f82) VERDICT: APPROVE SCORE: ui-flow 4/5 (previous: 4/5)
- GAP: sky-flat-one-teal (39a9abd) VERDICT: REJECT SCORE: maps-light 3/5 (previous: 3/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [vfx] impact-burst-tricolour: keep the cream heart; only cut flameMat emissive to about (0.5, 0.18, 0) so the fringe renders orange, not lemon [attempts: 1] — ref: trailer_3_sheet_03 r1c1 — ours: war_machines_1100ms.png
2. [maps-light] sky-flat-one-teal: backdrop is clearColor, fog cannot tint it; clearColor alpha 0 plus a canvas CSS gradient (0.14, 0.62, 0.46) top to (0.43, 0.78, 0.68) horizon, fogColor = horizon end [attempts: 1] — ref: tabs_screenshot_01 — ours: big_melee_2s.png
3. [unit-look] zeus-no-robe-skirt: leg clips through a barrel-wide robe; wants a slim body-width robe [attempts: 2] — ref: gameplay_sheet_06 r3c1 — ours: closeup_pair_zeus_thor.png
4. [vfx] muzzle-smoke-one-ball: one white sphere plus pellets; wants equal grey faceted lumps in a bank [attempts: 2] — ref: trailer_2_sheet_02 r1c1 — ours: war_machines_1100ms.png
5. [battle-feel] flung-limbs-tucked: widen shoulder and hip abduction in the air-pose variants so arms and legs splay near full extension [attempts: 0] — ref: trailer_3_sheet_03 r1c2 — ours: war_machines_1100ms.png
6. [ui-flow] budget-icons-small-pale: colour the two ::after icons pink (about #f4b8b0), about 24px tall [attempts: 0] — ref: gameplay_sheet_02 r1c3 — ours: hud_placement.png
7. [maps-light] tribal-apron-outside-ring: grey apron shows at upper left and right; back row spread upper bound 1.30 -> 1.38 [attempts: 0] — ref: gameplay_sheet_01 r1c3 — ours: hud_placement.png
8. [battle-feel] front-lines-body-apart: lines stay a body apart at 2 s, no two-deep pile underfoot [attempts: 0] — ref: tabs_screenshot_01 — ours: big_melee_2s.png

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- sky-flat-one-teal [attempts: 1] — fog (0.30, 0.74, 0.60) only: sky still one flat colour, far meshes fade to a tint not behind them
- impact-burst-tricolour [attempts: 1] — all three mats (1, 0.6, 0.04): TABS has a cream-white heart; renders lemon balloons
- muzzle-smoke-one-ball [attempts: 2] — lobe base 0.2: TABS puffs are fat and bigger than a head; before that smokeLife 0.9
- zeus-no-robe-skirt [attempts: 2] — x 1.45, z 2.2, length 1.6: a barrel and a leg still pokes through; before that z 1.7 apron
- corpses-all-flat [attempts: 2] — side roll plus curl: curl hidden in grass, six bodies in one pose; before that roll only
- crowns-second-hue-lemon [attempts: 1] — leaves (0.90, 0.38, 0.30) and emissive 0.30: the yellow material was untouched and still lemon
- grass-knee-high-carpet [attempts: 2] — half 0.025+s*0.02: needles, cards must be wide; before that patchHeight cut
- far-band-level-berry-hedge [attempts: 2] — height 5-11: giant trunkless balls; before that 2-6.5: hidden below the ring

## Notes for next iteration (max 5 lines)
- Spent (never retry): corpses-all-flat, zeus-no-robe-skirt, muzzle-smoke-one-ball, upright-idle-locked-legs, placement-armies-specks, fireball-balloon-stack. Blast-lift cuts stall battle_recap_result_legacy_tank_shell.
- Ring is 210 trees, plus a 16-tree back row at +Z over 3.0 rad, spread 1.24-1.30 (seeds 121-124). Sky and fog are (0.14, 0.62, 0.46), in main.ts and mapBuilder restoreSandboxSceneLook. trailer_3_sheet_03 r3c1 is not TABS.
- Air pose: roll is 0.4-0.7 rad signed (hash 50; 21, 23-32, 40-50 taken); iter 89 narrowed a wide leg V, so splay arms first. Pose-only, no Math.random(); limp pose uses `pick`/`fall` bits.
- TEAM_COLORS[1] is (0.8, 0.16, 0.2); do not mutate. getCloth materials are shared: no emissive. Faction tabs use clip-path. Budget spans have radius 0 19px 19px 0.
- EOLs: git warns LF->CRLF on every file; sed -i mid-line edits are safe, never append `\r`. Edit index.html by line number.
