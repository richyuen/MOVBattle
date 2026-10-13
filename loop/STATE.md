# Loop state
Iteration: 160   Last re-audit: 160   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 4 | ui-flow 4 | camera 3 | vfx 3

## Focus (every pickable gap this iteration)
- fireball-burns-cream 54419bd — REJECT (reverted 3d16f19)
- cannonball-team-navy 4323c48 — REJECT (reverted 468faf9)
- press-arms-level 37490d3 — APPROVE
- tribal-hair-skullcap dd9fe79 — APPROVE
- grass-bare-raised-eye 9aaad4a — REJECT (reverted 1e2b722)
- shoulder-bead 18aa309 — APPROVE
- shields-never-lap f3e7896 — APPROVE

## Last verdicts (one line per gap, verbatim critic header)
- GAP: fireball-burns-cream (54419bd) VERDICT: REJECT SCORE: vfx 3/5 (previous: 3/5)
- GAP: cannonball-team-navy (4323c48) VERDICT: REJECT SCORE: vfx 3/5 (previous: 3/5)
- GAP: press-arms-level (37490d3) VERDICT: APPROVE SCORE: battle-feel 3/5 (previous: 3/5)
- GAP: tribal-hair-skullcap (dd9fe79) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: grass-bare-raised-eye (9aaad4a) VERDICT: REJECT SCORE: maps-light 4/5 (previous: 4/5)
- GAP: shoulder-bead (18aa309) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: shields-never-lap (f3e7896) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [vfx] fireball-snowman: pale ball on an orange ball; emissives stay, lobeSizes[1] 1.0 to 0.6, [3] 0.9 to 0.55 [attempts: 2] — ref: trailer_3_sheet_03 r1c1 — ours: war_machines_1100ms.png
2. [maps-light] grass-bare-raised-eye: bare ground from above; `half` stays, blade h (0.12+v*0.15) to (0.2+v*0.2) [attempts: 1] — ref: tabs_screenshot_01 — ours: lineup_medieval.png
3. [vfx] cannonball-small-smooth: stone shot small, smooth, team navy; diameter 0.35 to 0.5, segments 3 flat-shaded, colour (0.1,0.1,0.11) [attempts: 1] — ref: trailer_3_sheet_03 r2c1 — ours: war_machines_3800ms.png
4. [battle-feel] press-upright-third: a third of the press stands straight; _buildShovePose `h(1) < 0.34` to `< 0.15` [attempts: 0] — ref: trailer_3_sheet_01 r2c3 — ours: big_melee_5s.png
5. [unit-look] zeus-shoulder-grey: grey shoulder balls on blue arms; unitFactory set Zeus `_[lr]ShoulderCap` to body.skinMaterial [attempts: 0] — ref: tabs_screenshot_02 — ours: closeup_pair_zeus_thor.png
6. [unit-look] shields-stop-at-hip: round shields never touch; disc rshield 0.36 to 0.44, rim 0.4 to 0.48 [attempts: 0] — ref: tabs_screenshot_06 — ours: big_melee_2s.png
7. [unit-look] hair-globe: hair a regular ball; hair.scaling (1.2, 0.85, 1.15), z -0.14 to -0.22 x headSize [attempts: 0] — ref: gameplay_sheet_02 r2c2 — ours: big_melee_9s.png
8. [vfx] burst-black-button: dark ball shows in front of the fire; hide the ballMat sphere at burst start [attempts: 0] — ref: trailer_3_sheet_03 r1c2 — ours: war_machines_1100ms.png

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- grass-bare-raised-eye [attempts: 1] — half x1.5: squat cones, still bare; raise height instead
- cannonball-team-navy [attempts: 1] — near-black stone: no shot in flight in either frame, claim not visible
- fireball-burns-cream (= cannon-impact-balls) [attempts: 2] — emissives under white: lemon paint; cream heart IS the TABS look
- giant-lean-cuts-blue [attempts: 1] — GIANT_LEAN 0.25: the cut moved to red's rear
- result-foreground-club [attempts: 2] — sideOn fov 0.65 + radius x1.23: clubs still across the bottom third
- catapult-goalpost [attempts: 2] rejected-kept — arm -0.1, dark cw, team axle: posts still set the height
- run-arms-one-splay [attempts: 1] — phase +PI: exact mirrors, a jumping-jack flap
- impact-dust-house-sphere [attempts: 2] — fireScale cap 1.35: still 2.5 men, a snowman

## Notes for next iteration (max 5 lines)
- Spent (never retry): mammoth hide/launch/hat/tusks/trample/flung, slam airtime, zeus glow/pulse/skirt, giant healthScale/victory shot, boulders (map), airborne sit, clouds, far ridge, corpses, idle legs/arms, downed bodies, empty hud, witch brim/kink, lineup camera/unit size, spear length, catapult operator, streak length, red skin shade, impact dust, hoop colour, smoke diameters, fire segments/emissives, GIANT_LEAN, blade width. Never shrink enemy collision distance or lower ally contactBias below 0.55. Never edit capture.mjs (no in-flight shot exists: stone edits cannot be evidenced).
- ACES: emissive 0.25 shows ~140, 0.65 ~190, 1.0 ~210; diffuse over 1 does not show. Bloom threshold 0.65. Pale accent on "metal" renders black: use "stone".
- Commit per gap with `git commit <path> -F -`; revert rejects newest first. The big_melee outcome and result shot change run to run: do not attribute them to one patch.
- wrapAsBody's 3rd arg is recoloured to the team colour (unitFactory:359). Idle lean (0.26+h*0.14: do not raise) drives lineups. CLOTH_SHADE also darkens armour. Mammoth hips at x +-0.46.
- Live: melee alpha -PI/3, FOLLOW_DROP 0.9, clearRadius depth + max(6.0, tall*1.35/0.58), GIANT_LEAN 0.4; shove spread 0.15+h*0.3; hair 1.5x head at y 0.24; bare shoulder cap 1.3; rshield 0.36/0.4; BLADES 720000.
