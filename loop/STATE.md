# Loop state
Iteration: 65   Last re-audit: 65   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 3 | ui-flow 4 | camera 4 | vfx 3

## Focus (2-3 gaps this iteration)
- grass-sparse-cone-spikes e073152 — APPROVE
- limbs-pencil-thin cdf0284 — APPROVE
- battle-cam-too-far-back 30ccf14 — APPROVE

## Last verdicts (one line per gap, verbatim critic header)
- GAP: grass-sparse-cone-spikes (e073152) VERDICT: APPROVE SCORE: maps-light 3/5 (previous: 3/5)
- GAP: limbs-pencil-thin (cdf0284) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: battle-cam-too-far-back (30ccf14) VERDICT: APPROVE SCORE: camera 4/5 (previous: 4/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [maps-light] grass-ankle-high-tombstones: ankle-high identical upright trapezoids, bare patches near camera; TABS knee-high, leaning, hides feet [attempts: 0] — ref: tabs_screenshot_02 — ours: closeup_pair_zeus_thor.png
2. [camera] battle-cam-dead-sky-half: front rank 33% of frame, horizon at 80%, top 45% empty; TABS 43%, horizon 70% [attempts: 0] — ref: tabs_screenshot_06 — ours: big_melee_5s.png
3. [unit-look] shins-spike-pegs-no-boot: shins taper to dark points, sleeves step in to thin forearms, hands small balls [attempts: 0] — ref: tabs_screenshot_08 — ours: closeup_weapon_reads.png
4. [unit-look] torso-flat-box-no-cloth: torsos plain one-colour boxes; no belts, stripes, fur chunks [attempts: 0] — ref: tabs_screenshot_06 — ours: lineup_medieval.png
5. [vfx] cannon-burst-yellow-crystals: tall yellow-orange prisms on a white blob, not white puff, black ball, dust [attempts: 0] — ref: trailer_3_sheet_02 — ours: war_machines_1100ms.png
6. [maps-light] arena-square-slab-flat-sky: ruled rectangle island, straight tan side strips, one-tone sky [attempts: 0] — ref: gameplay_sheet_01 — ours: hud_placement.png
7. [battle-feel] launched-bodies-stiff-star: airborne units hold a rigid spread-eagle; TABS ragdolls fold and tumble [attempts: 0] — ref: tabs_screenshot_01 — ours: war_machines_1100ms.png
8. [ui-flow] victory-shot-backs-to-camera: result shot frames the mammoth's rump over empty grass [attempts: 0] — ref: tabs_screenshot_01 — ours: big_melee_result.png

## Rejected attempts (last 5, newest first; `rejected-kept` when the revert conflicted)
- placement-haze-washes-teams [attempts: 2] — sun pos + autoCalcShadowZBounds + blur 16: unit shadows vanished, trunk strips only
- fire-orange-not-fringe [attempts: 1] — orange mass went up (4/7 tongues); grey smoke reads as rocks
- tabs-filled-round-tiles [attempts: 1] — point on wrong end; hollow tabs float off the tray
- grass-foreground-and-drift [attempts: 1] — clearance 5, eye 1.1, x-follow: bottom 27% still bare grass
- fireball-cream-not-fire [attempts: 1] — (1,.85,.32) still renders cream, translucent; crown knob grey

## Notes for next iteration (max 5 lines)
- Gap 1: _createFieldBlades h to 0.2+rand*0.25, lean 0.06 to 0.15, bare-cell threshold 0.25 to 0.1. Grass has flip-flopped (35.1-39.1).
- Gap 2: cameraController pitchUp back to 0.17; clearRadius depth+4.5, floor 6, or spanRadius /0.7. Eye stays 1.1 m.
- Gap 3: bodyBuilder LOWER_LIMB_STEP toward 1.0, handDiameter base 0.1 to 0.13. LIMB_THIN is now 0.9.
- Gap 7: 50.2 tried folding launched bodies and was reverted; read that diff first.
- shadowGen.darkness is 0.45; unit shadows are faint already, do not raise it.
