# Loop state
Iteration: 55   Last re-audit: 55   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 3 | ui-flow 4 | camera 4 | vfx 3

## Focus (2-3 gaps this iteration)
- tribal-torso-not-team-skin 8e4f74a — APPROVE
- cube-hands-oversized a1426c8 — APPROVE
- tray-solid-dark-slab 49653fd — APPROVE

## Last verdicts (one line per gap, verbatim critic header)
- GAP: tribal-torso-not-team-skin (8e4f74a) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: cube-hands-oversized (a1426c8) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: tray-solid-dark-slab (49653fd) VERDICT: APPROVE SCORE: ui-flow 4/5 (previous: 4/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [unit-look] tribal-hair-missing: dark-brown faceted hair mop on every tribal head [attempts: 0] — ref: tabs_screenshot_01 — ours: big_melee_9s.png
2. [unit-look] loincloth-belt-not-skirt: one solid hide skirt, hips to mid-thigh [attempts: 0] — ref: tabs_screenshot_01 — ours: big_melee_2s.png
3. [unit-look] torso-crate-box: tapered faceted chest narrowing to the waist [attempts: 0] — ref: tabs_screenshot_04 — ours: closeup_pair_zeus_thor.png
4. [unit-look] hands-ball-not-slab: flattened faceted mitts wider than the wrist [attempts: 0] — ref: tabs_screenshot_06 — ours: closeup_weapon_reads.png
5. [maps-light] arena-plate-not-landmass: shaped island with river, bridge, buildings [attempts: 0] — ref: gameplay_sheet_02 r1c3 — ours: hud_placement.png
6. [vfx] cannon-blast-yellow-ball: white-hot flat burst, ragged flame tongues, smoke [attempts: 0] — ref: trailer_3_sheet_02 r2c1 — ours: war_machines_1100ms.png
7. [ui-flow] tray-dome-not-flat-shelf: flat top, flared sides, shield tabs above the edge, darker tint [attempts: 0] — ref: gameplay_sheet_03 r3c2 — ours: hud_placement.png
8. [unit-look] helm-tall-grey-tube: fitted faceted helmets near head size [attempts: 0] — ref: trailer_3_sheet_02 r1c1 — ours: closeup_weapon_reads.png

## Rejected attempts (last 5, newest first; `rejected-kept` when the revert conflicted)
- grass-foreground-and-drift [attempts: 1] — clearance 5, eye 1.1, x-follow: bottom 27% still bare grass
- fireball-cream-not-fire [attempts: 1] — (1,.85,.32) still renders cream, translucent; crown knob grey
- front-line-does-not-compress [attempts: 1] — regression: pack-scaled solver radii failed crowd_topple, spillover_chain
- idle-arms-hang-symmetric [attempts: 1] — raised weapon arm did not show on knight/Zeus
- tree-crowns-cast-no-shadow [attempts: 1] — crowns and rocks shade themselves near-black

## Notes for next iteration (max 5 lines)
- Gap 2: unitFactory bareSkinned branch, hip caps lower and scaled ~(1.7, 2.2, 1.7). Gap 1: hair prop for FactionId.Tribal.
- Gap 4: bodyBuilder mitt() scale ~(0.6, 0.8, 0.4), segments 2. Gap 7 first step: tray/budget alpha .14 -> ~.3.
- Gap 3 is a slice of the old box-torsos gap (2 failed attempts): only touch torsoTop/torsoBottom taper.
- Gap 6: fireball colour has flip-flopped cream/yellow across audits; add a pale core mesh, don't recolour the body.
- No new Math.random in VFX or poses. Gaps 1-4 all sit in unitFactory/bodyBuilder; mix in 5, 6 or 7.
