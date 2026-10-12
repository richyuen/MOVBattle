# Loop state
Iteration: 95   Last re-audit: 95   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 3 | ui-flow 4 | camera 4 | vfx 3

## Focus (every pickable gap this iteration)
- sky-no-horizon-haze 6c228da — APPROVE
- red-team-tan-bodies 6980a47 — APPROVE
- victory-bands-thin fdd18fc — APPROVE
- backdrop-peaks-ice-blue 29e5f08 — REJECT (reverted 18d28aa)
- grass-spikes-bury-bodies 6ce6a17 — APPROVE
- mammoth-pole-legs 76e191a — APPROVE
- lightning-hollow-outline db33e41 — APPROVE
- cannon-crew-stand-idle 8b3ed73 — APPROVE

## Last verdicts (one line per gap, verbatim critic header)
- GAP: sky-no-horizon-haze (6c228da) VERDICT: APPROVE SCORE: maps-light 3/5 (previous: 3/5)
- GAP: red-team-tan-bodies (6980a47) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: victory-bands-thin (fdd18fc) VERDICT: APPROVE SCORE: ui-flow 4/5 (previous: 4/5)
- GAP: backdrop-peaks-ice-blue (29e5f08) VERDICT: REJECT SCORE: maps-light 3/5 (previous: 3/5)
- GAP: grass-spikes-bury-bodies (6ce6a17) VERDICT: APPROVE SCORE: maps-light 3/5 (previous: 3/5)
- GAP: mammoth-pole-legs (76e191a) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: lightning-hollow-outline (db33e41) VERDICT: APPROVE SCORE: vfx 3/5 (previous: 3/5)
- GAP: cannon-crew-stand-idle (8b3ed73) VERDICT: APPROVE SCORE: battle-feel 3/5 (previous: 3/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [maps-light] far-ridges-fogged-out: ridges render pale grey-green, not rock; fogEnabled=false on farRock/farRockShade/farSnow [attempts: 0] — ref: trailer_3_sheet_01 — ours: big_melee_2s.png
2. [battle-feel] cannon-crew-no-lunge: crew lean slightly, legs locked, identical; torso 0.55 and split hips in the "crew" pose [attempts: 0] — ref: tabs_screenshot_08 — ours: war_machines_3800ms.png
3. [unit-look] red-team-maroon: red skin is dark wine, TABS is coral; lift red skin value, cut saturation a little [attempts: 0] — ref: tabs_screenshot_01 — ours: big_melee_2s.png
4. [vfx] lightning-shaded-bars: bolt is lit even-width boxes, no strike burst; disableLighting on boltMat, short flat burst at the target [attempts: 0] — ref: trailer_2_sheet_03 — ours: closeup_state_reads.png
5. [maps-light] sky-zenith-too-dark: sky top is (40,153,138) vs TABS (85,189,166); raise the dome's deep end to about (0.33, 0.74, 0.65) [attempts: 0] — ref: tabs_screenshot_01 — ours: war_machines_3800ms.png
6. [unit-look] bucket-helm-oversized: squire helms are grey blocks wider than the torso; scale to about 1.15x head [attempts: 0] — ref: tabs_screenshot_06 — ours: closeup_weapon_reads.png
7. [maps-light] grass-cone-carpet: blades are fat cones spread evenly; halve `half`, tighten tufts [attempts: 0] — ref: tabs_screenshot_02 — ours: war_machines_3800ms.png
8. [ui-flow] victory-title-bold: title and hint bold on near-black, stray RESET; font-weight normal, band rgb(22,27,34) [attempts: 0] — ref: gameplay_sheet_02 — ours: big_melee_result.png

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- backdrop-peaks-ice-blue [attempts: 1] — FAR_ROCK warm brown, mixes 0.25: invisible, scene fog (70-170) overrides the ridge materials at z 96-101; superseded by far-ridges-fogged-out
- tribal-apron-outside-ring [attempts: 1] — back-row spread to 1.38: band unchanged, two trees float off the lawn rim
- front-lines-body-apart [attempts: 1] — enemy collision and press at 0.7 of summed radii: regression, topple scenarios lose their push
- muzzle-smoke-one-ball [attempts: 2] — lobe base 0.2: TABS puffs are fat and bigger than a head
- zeus-no-robe-skirt [attempts: 2] — x 1.45, z 2.2, length 1.6: a barrel and a leg still pokes through
- corpses-all-flat [attempts: 2] — side roll plus curl: curl hidden in grass, six bodies in one pose
- crowns-second-hue-lemon [attempts: 1] — leaves (0.90, 0.38, 0.30): the yellow material was untouched and still lemon

## Notes for next iteration (max 5 lines)
- Spent (never retry): corpses-all-flat, zeus-no-robe-skirt, muzzle-smoke-one-ball, upright-idle-locked-legs, placement-armies-specks, fireball-balloon-stack. Blast-lift cuts stall battle_recap_result_legacy_tank_shell. Do not shrink the enemy collision distance in _resolveLivingCollisions.
- Sky: `skyDome` in main.ts, base (0.43, 0.78, 0.68) minus t over y/700, plus a mint haze below y 420; fog (0.62, 0.86, 0.76) in main.ts and mapBuilder restoreSandboxSceneLook must move together. Far props are painted in paintFarProps (FAR_ROCK consts, line 19).
- Units: TEAM_COLORS[1] is (0.8, 0.16, 0.2), do not mutate; skin is teamColor.scale(0.9) in unitFactory; warm trousers come from skin (`legBase`). getCloth materials are shared: no emissive. Pose "crew" is in runtimeUnit _applyPoseOverlay; "vehicle" has no case and vehicle bodies alias joints.
- Air pose: hashes 21, 23-32, 40-54 taken; pose-only, no Math.random(). Grass height is `h` in _createFieldBlades; mammoth hips are 0.46 out.
- EOLs: main.ts, mapBuilder.ts, unitFactory.ts, runtimeUnit.ts, linkedActorPresets.ts are CRLF (add \r in inserted lines); grep -n the line before sed by number.
