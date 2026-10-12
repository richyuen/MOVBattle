# Loop state
Iteration: 63   Last re-audit: 60   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 3 | ui-flow 4 | camera 4 | vfx 3

## Focus (2-3 gaps this iteration)
- shadows-short-and-faint be39255 — APPROVE
- shoulder-caps-still-beads 6b019e5 — APPROVE
- knight-single-value-red 7bfc97e — APPROVE

## Last verdicts (one line per gap, verbatim critic header)
- GAP: shadows-short-and-faint (be39255) VERDICT: APPROVE SCORE: maps-light 3/5 (previous: 3/5)
- GAP: shoulder-caps-still-beads (6b019e5) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: knight-single-value-red (7bfc97e) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [unit-look] great-helm-team-red: helm is the lightest team-red block, should be steel-grey gear [attempts: 0] — ref: trailer_1_sheet_01 r2c1 — ours: closeup_weapon_reads.png
2. [maps-light] shadows-hard-black-fused: hard-edged, near-black, one mass over the red placement half [attempts: 0] — ref: trailer_3_sheet_02 r3c3 — ours: hud_placement.png
3. [maps-light] flat-rectangle-map: flat slab, brown rim, one-tone sky; no cliffed island, gradient or cloud bank [attempts: 0] — ref: trailer_1_sheet_01 r1c1 — ours: hud_placement.png
4. [unit-look] knight-chest-helm-wide: chest only helm-wide, armoured arms bare skin-red, Thor shoulders still balls [attempts: 0] — ref: trailer_1_sheet_01 r2c1 — ours: closeup_pair_zeus_thor.png
5. [vfx] cannon-impact-crystal-shards: yellow/orange shards over grey lumps, not white puff, black ball, dust [attempts: 0] — ref: trailer_3_sheet_03 r3c1 — ours: war_machines_1100ms.png
6. [battle-feel] upright-idle-thin-front: standing units bolt upright, arms hanging; front has gaps, single-layer pile [attempts: 0] — ref: tabs_screenshot_06 — ours: big_melee_5s.png
7. [unit-look] no-neutral-accents: no tabard, emblem, fur or trim on armoured units; torsos plain tubes [attempts: 0] — ref: tabs_screenshot_06 — ours: lineup_medieval.png
8. [ui-flow] placed-units-no-blob: at placement altitude units have no ground shadow, one smudge per team [attempts: 0] — ref: gameplay_sheet_02 r1c3 — ours: big_melee_placement.png

## Rejected attempts (last 5, newest first; `rejected-kept` when the revert conflicted)
- placement-haze-washes-teams [attempts: 2] — sun pos + autoCalcShadowZBounds + blur 16: unit shadows vanished, trunk strips only
- fire-orange-not-fringe [attempts: 1] — orange mass went up (4/7 tongues); grey smoke reads as rocks
- tabs-filled-round-tiles [attempts: 1] — point on wrong end; hollow tabs float off the tray
- grass-foreground-and-drift [attempts: 1] — clearance 5, eye 1.1, x-follow: bottom 27% still bare grass
- fireball-cream-not-fire [attempts: 1] — (1,.85,.32) still renders cream, translucent; crown knob grey

## Notes for next iteration (max 5 lines)
- Gap 1: propBuilder "great_helm" case: steel grey (0.6,0.6,0.65) with a light team tint, as "helmet" has.
- Gap 2: main.ts shadowGen.darkness about 0.4-0.5; leave the sun (-0.4,-0.6,0.6, shadowMinZ 10) alone. PCF, no blur.
- Gap 4: Thor is not isArmored, so his caps are still 1.55; armoured chestTop flare is 1.24, waist 1.12.
- Armour value is CLOTH_SHADE .8 x ARMOUR_SHADE .65; shaded red knights already near brown-black, go no darker.
- main.ts and unitFactory.ts are LF in the index: in-line sed substitutions or a node script are both safe.
