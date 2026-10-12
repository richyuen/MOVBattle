# Loop state
Iteration: 115   Last re-audit: 115   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 3 | ui-flow 4 | camera 4 | vfx 3

## Focus (every pickable gap this iteration)
- ground-salmon-not-ochre 853e987 — APPROVE
- trunks-navy-not-cream af89f72 — APPROVE
- fireball-discs-flame 917c0e8 — APPROVE
- charge-lean-shallow 3e851dd — APPROVE
- crown-lit-pink 22f9021 — APPROVE
- tusk-grey-not-ivory 26dcc7e — APPROVE
- crown-no-orange e55992d — APPROVE
- cannon-carriage-lavender 9bedcf4 — APPROVE

## Last verdicts (one line per gap, verbatim critic header)
- GAP: ground-salmon-not-ochre (853e987) VERDICT: APPROVE SCORE: maps-light 3/5 (previous: 3/5)
- GAP: trunks-navy-not-cream (af89f72) VERDICT: APPROVE SCORE: maps-light 3/5 (previous: 3/5)
- GAP: fireball-discs-flame (917c0e8) VERDICT: APPROVE SCORE: vfx 3/5 (previous: 3/5)
- GAP: charge-lean-shallow (3e851dd) VERDICT: APPROVE SCORE: battle-feel 3/5 (previous: 3/5)
- GAP: crown-lit-pink (22f9021) VERDICT: APPROVE SCORE: maps-light 3/5 (previous: 3/5)
- GAP: tusk-grey-not-ivory (26dcc7e) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: crown-no-orange (e55992d) VERDICT: APPROVE SCORE: maps-light 3/5 (previous: 3/5)
- GAP: cannon-carriage-lavender (9bedcf4) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [vfx] fireball-discs-separate: two hard peach circles beside the ball vs one fused mass; visualEffects.ts lobe reach 0.65 to 0.45 [attempts: 1] — ref: trailer_3_sheet_03 r1c1 — ours: war_machines_1100ms.png
2. [unit-look] tusk-white-not-ivory: 190-204,180-195,169-182 B/R 0.89 vs 161-190,127-159,108-136 B/R 0.67-0.72; vehicleBuilder.ts tuskMat (1.0,0.82,0.58) to (0.80,0.60,0.40) [attempts: 1] — ref: tabs_screenshot_01 — ours: big_melee_result.png
3. [battle-feel] charge-lean-half: walkers pitch 23 degrees, shield front rank upright, vs 45; proceduralAnimation.ts walk torso.rotation.x 0.40 to 0.55 [attempts: 1] — ref: gameplay_sheet_05 r3c2 — ours: big_melee_2s.png
4. [maps-light] trunk-top-haze: pale smudge 183,109,99 on crown 213,97,72 at each trunk top; mapBuilder.ts glow?.addExcludedMesh(trunkMesh) beside the canopy exclusions [attempts: 0] — ref: tabs_screenshot_01 — ours: closeup_pair_zeus_thor.png
5. [unit-look] carriage-bed-taupe: bed top 111-130,93-108,89-99 B/R 0.76-0.80 vs 157-168,110-122,102-109 B/R 0.65; vehicleBuilder.ts buildCannon wood to getMaterialFactory().get("wood", same, { emissive (0.20,0.10,0.05) }) [attempts: 1] — ref: tabs_screenshot_08 — ours: war_machines_3800ms.png
6. [maps-light] trunks-grey-not-cream: 195,186,186 B/R 0.95-1.0 vs lit 227,212,193 B/R 0.85; mapBuilder.ts trunk.diffuseColor (0.80,0.74,0.66) to (0.86,0.74,0.56) [attempts: 1] — ref: tabs_screenshot_01 — ours: lineup_medieval.png
7. [unit-look] mammoth-mop-hat: cap 46,44,77 indigo vs tuft 44,37,73 blending into hide; vehicleBuilder.ts crestMat makeMat(...) to getMaterialFactory().get("wood", sameLerp, hideLight) [attempts: 1] — ref: tabs_screenshot_01 — ours: big_melee_result.png
8. [maps-light] ground-ochre-overshoot: field G/R 0.72-0.73 vs 0.65-0.69; mapBuilder.ts grass.diffuseColor (0.98,0.52,0.24) to (0.98,0.48,0.24) [attempts: 1] — ref: gameplay_sheet_01 r1c3 — ours: hud_placement.png

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- mammoth-mop-hat [attempts: 1] — Lerp weight 0.6: mop still darker than head, indigo; it has no self-light
- mammoth-no-launch [attempts: 2] — lift 13-17: farmer airborne and "steady" at 2.1s, fails battlefeel_spillover_chain
- shove-attack-fold [attempts: 1] — half shove pitch while Attacking: folds still there at 5s
- mammoth-mop-beret [attempts: 1] — dome (0, 0.5, 0.52): still two lumps, reads as a cap peak
- fireball-no-orange [attempts: 2] — flashMat emissive (0.7, 0.45, 0.15): 0% orange, lit cloth base clips
- shadow-red-stain [attempts: 1] — darkness 0.2: R landed, G/B overshoot, shade blood red
- airborne-sit-square [attempts: 2] — Sit hip 0.5-0.85, knees 0.15-0.6: knees straight
- crown-shade-brown [attempts: 1] — diffuse blue 0.46: shade set by brown ambient, lit side went pink

## Notes for next iteration (max 5 lines)
- Spent (never retry): mammoth-no-launch, airborne-sit-square, fireball-no-orange, cloud-level-bases, far-ridge-cones, red-team-maroon, corpses-all-flat, zeus-no-robe-skirt, muzzle-smoke-one-ball, upright-idle-locked-legs, placement-armies-specks, fireball-balloon-stack, helm shape/colour, grass tuft spacing. Never shrink enemy collision distance.
- ACES crushes material red and lifts G/B; judge by screen pixel. Fire mats are unlit; the orange discs are flameMat (lobes i=1,3), flashMat is the straw lobes. TEAM_COLORS[1] must not be mutated.
- One gap, one change: the critic rejects scope creep and any commit claim not visible on screen; keep code comments true.
- Attempts 1 on open gaps 1-3, 5, 6, 8 are residuals of gaps approved in 115, one try left each. Open but unlisted: crown lit faces 15-25 R dim (red crown emissive multiplier (0.72,0.45,1.1) to (0.80,0.45,1.0)); re-measure ground shade hue. Walk lean ceiling is the 0.6 shove clamp.
- Self-light goes through factory get(cat, c, { emissive }); never mutate cached makeMat materials. Edit with a single-occurrence replace keeping line endings (mapBuilder.ts is LF, the rest CRLF); commit with `git commit <file> -F -` heredoc.
