# Loop state
Iteration: 159   Last re-audit: 155   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 4 | ui-flow 4 | camera 3 | vfx 3

## Focus (every pickable gap this iteration)
- battle-flat-profile 534fcb4 — APPROVE
- result-foreground-club ad1889a — REJECT (reverted 8dd881e)
- mammoth-legs-spikes f810481 — APPROVE
- club-log-pile 7401967 — APPROVE
- cannon-impact-balls 62bc841 — REJECT (reverted a7d6617)
- grass-sparse 40976cc — APPROVE
- giant-lean-cuts-blue 9e8ba61 — REJECT (reverted 790d2ac)

## Last verdicts (one line per gap, verbatim critic header)
- GAP: battle-flat-profile (534fcb4) VERDICT: APPROVE SCORE: camera 3/5 (previous: 3/5)
- GAP: result-foreground-club (ad1889a) VERDICT: REJECT SCORE: camera 3/5 (previous: 3/5)
- GAP: mammoth-legs-spikes (f810481) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: club-log-pile (7401967) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: cannon-impact-balls (62bc841) VERDICT: REJECT SCORE: vfx 3/5 (previous: 3/5)
- GAP: grass-sparse (40976cc) VERDICT: APPROVE SCORE: maps-light 4/5 (previous: 4/5)
- GAP: giant-lean-cuts-blue (9e8ba61) VERDICT: REJECT SCORE: camera 3/5 (previous: 3/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [camera] result-foreground-club: eye looks down on fallen clubs, tusk in corner; in `sideOn` pitch up 0.2 like the melee branch [attempts: 2] — ref: tabs_screenshot_02 — ours: big_melee_result.png
2. [unit-look] club-torso-thick: heads twice too thick; exempt "club" from one of `_s*1.25` / PROP_OVERSIZE [attempts: 0] — ref: trailer_3_sheet_01 r2c3 — ours: big_melee_5s.png
3. [unit-look] mammoth-legless-barrel: belly on the grass; uleg/lleg 0.55/0.45 to 0.8/0.65, raise hips and body 0.45 [attempts: 0] — ref: tabs_screenshot_01 — ours: big_melee_5s.png
4. [camera] giant-rears-clipped: army rears cut at both edges; with a giant radius = max(clearRadius, spanRadius over both rears), GIANT_LEAN stays 0.4 [attempts: 1] — ref: tabs_screenshot_01 — ours: big_melee_2s.png
5. [vfx] cannon-impact-balls: cream ball on an orange ball; coreMat/flashMat to saturated yellow (1, 0.85, 0.35), segments stay 6 [attempts: 1] — ref: trailer_3_sheet_03 r1c1 — ours: war_machines_1100ms.png
6. [maps-light] grass-bare-raised-eye: bare ground from above head height; blade cards 1.5x wider, no more blades [attempts: 0] — ref: tabs_screenshot_01 — ours: lineup_medieval.png
7. [battle-feel] melee-no-downed: all upright at 5s/9s; mammoth knocks down the men it touches [attempts: 0] — ref: tabs_screenshot_01 — ours: big_melee_9s.png
8. [camera] melee-no-foreground-rank: every man whole over a grass strip; clearRadius floor 6.0 to 5.0 when no giant [attempts: 0] — ref: tabs_screenshot_06 — ours: big_melee_5s.png

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- giant-lean-cuts-blue [attempts: 1] — GIANT_LEAN 0.25: the cut moved to red's rear, blue still clipped at 2s
- cannon-impact-balls [attempts: 1] — segments 6 to 2: a faceted rock; TABS fire is never faceted
- result-foreground-club [attempts: 2] — sideOn fov 0.65 + radius x1.23: clubs still across the bottom third, tusk in corner, horizon above middle
- battle-flat-profile [attempts: 1] — alpha -PI/2.3: 12 degrees, no visible recession (-PI/3 approved in 159)
- catapult-goalpost [attempts: 2] rejected-kept — arm -0.1, dark cw, team axle: posts still set the height, no team colour
- run-arms-one-splay [attempts: 1] — phase +PI: exact mirrors, a jumping-jack flap
- shields-never-lap [attempts: 1] — braced 0.7: bodies clip; shields are flat
- impact-dust-house-sphere [attempts: 2] — fireScale cap 1.35: still 2.5 men, a snowman

## Notes for next iteration (max 5 lines)
- Spent (never retry): mammoth hide/launch/hat/tusks/trample/flung, slam airtime, zeus glow/pulse/skirt, giant healthScale/victory shot, boulders (map), airborne sit, clouds, far ridge, corpses, idle legs/arms, downed bodies (check before gap 7), empty hud, witch brim/kink, lineup camera/unit size, spear length, catapult operator, streak length, red skin shade, impact dust, hoop colour, smoke diameters, fire segments, GIANT_LEAN. Never shrink enemy collision distance or lower ally contactBias below 0.55. Never edit capture.mjs.
- ACES: emissive 0.25 shows ~140, 0.65 ~190, 1.0 ~210; diffuse over 1 does not show. Bloom threshold 0.65. Pale accent on "metal" renders black: use "stone".
- Develop gaps as JSON patches (CRLF-safe node script), probe uncommitted with `capture.mjs --iter 9123 --showcase-only`, then `git checkout` and re-apply + commit per gap (`git commit <path> -F -`). Revert rejects newest first. The big_melee outcome and result shot change run to run (frame-time dependent): do not attribute them to one patch.
- wrapAsBody's 3rd arg is recoloured to the team colour (unitFactory:359). Idle lean (0.26+h*0.14: do not raise) drives lineups. CLOTH_SHADE also darkens armour. Mammoth hips at x +-0.46: legs over 0.9 wide overlap.
- Live: melee alpha -PI/3, FOLLOW_DROP 0.9 (do not raise), clearRadius depth + max(6.0, tall*1.35/0.58), GIANT_LEAN 0.4; mammoth legs 0.8/0.78 straight in `fur`; club head 0.25 x 0.14; BLADES 720000, open cells 0.15/0.12; catapult and hammer as in 158.
