# Loop state
Iteration: 57   Last re-audit: 55   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 3 | ui-flow 4 | camera 4 | vfx 3

## Focus (2-3 gaps this iteration)
- helm-tall-grey-tube a4e1f64 — APPROVE
- cannon-blast-yellow-ball fd8a1ef — APPROVE
- tray-sides-vertical f705ee2 — APPROVE

## Last verdicts (one line per gap, verbatim critic header)
- GAP: helm-tall-grey-tube (a4e1f64) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: cannon-blast-yellow-ball (fd8a1ef) VERDICT: APPROVE SCORE: vfx 3/5 (previous: 3/5)
- GAP: tray-sides-vertical (f705ee2) VERDICT: APPROVE SCORE: ui-flow 4/5 (previous: 4/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [maps-light] arena-flat-rectangle: rounded island, river, fields, buildings; less pine wall and haze [attempts: 0] — ref: gameplay_sheet_02 r1c3 — ours: hud_placement.png
2. [unit-look] torso-flat-box: tapered faceted torsos and limbs with clothing shapes [attempts: 0] — ref: tabs_screenshot_04 — ours: closeup_pair_zeus_thor.png
3. [vfx] flame-tongues-needle-cones: blunt fat lobes, near-white core grading to orange [attempts: 0] — ref: trailer_3_sheet_02 r2c1 — ours: war_machines_1100ms.png
4. [battle-feel] flung-bodies-stiff-upright: bodies fold and trail limp limbs [attempts: 0] — ref: trailer_3_sheet_03 r1c2 — ours: war_machines_1100ms.png
5. [unit-look] helm-torso-wide-pale: narrower than shoulders, team-tinted, wide slit [attempts: 0] — ref: trailer_2_sheet_02 r1c1 — ours: closeup_weapon_reads.png
6. [vfx] lightning-thin-streaks: fat jagged solid white-cyan polygons [attempts: 0] — ref: trailer_2_sheet_03 r3c2 — ours: closeup_state_reads.png
7. [ui-flow] tabs-filled-round-tiles: outline pointed-bottom shields, tray joined to budget arc [attempts: 0] — ref: gameplay_sheet_03 r3c2 — ours: hud_placement.png
8. [unit-look] mammoth-stacked-boxes: faceted organic giant silhouette [attempts: 0] — ref: gameplay_sheet_02 r3c3 — ours: big_melee_9s.png

## Rejected attempts (last 5, newest first; `rejected-kept` when the revert conflicted)
- grass-foreground-and-drift [attempts: 1] — clearance 5, eye 1.1, x-follow: bottom 27% still bare grass
- fireball-cream-not-fire [attempts: 1] — (1,.85,.32) still renders cream, translucent; crown knob grey
- front-line-does-not-compress [attempts: 1] — regression: pack-scaled solver radii failed crowd_topple, spillover_chain
- idle-arms-hang-symmetric [attempts: 1] — raised weapon arm did not show on knight/Zeus
- tree-crowns-cast-no-shadow [attempts: 1] — crowns and rocks shade themselves near-black

## Notes for next iteration (max 5 lines)
- Gap 3: visualEffects tongue loop: diameterTop ~0.35, cap tongueLeans ~0.9, flashMat toward cream-white.
- Gap 5: propBuilder great_helm: diameterBottom ~0.20, top ~0.17, slit width ~0.12, grey 20% toward accent.
- Gap 7: index.html .faction-tab transparent bg + pointed bottom (clip-path); #factionLabel::before fill ~0.6.
- Tray slab is #factionLabel::before (perspective rotateX); label/grid have 44px side margins for the flare.
- No new Math.random in VFX or poses. Prefer gaps in different files: 3 (visualEffects), 5 (propBuilder), 7 (index.html).
