# Loop state
Iteration: 96   Last re-audit: 95   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 3 | ui-flow 4 | camera 4 | vfx 3

## Focus (every pickable gap this iteration)
- far-ridges-fogged-out 07967ea — APPROVE
- cannon-crew-no-lunge dd1b785 — APPROVE
- red-team-maroon 8c54d64 — REJECT (reverted abe42dc)
- lightning-shaded-bars d194af2 — APPROVE
- sky-zenith-too-dark f1ab991 — APPROVE
- bucket-helm-oversized d223a46 — APPROVE
- grass-cone-carpet 43b8163 — APPROVE
- victory-title-bold cb80215 — APPROVE

## Last verdicts (one line per gap, verbatim critic header)
- GAP: far-ridges-fogged-out (07967ea) VERDICT: APPROVE SCORE: maps-light 3/5 (previous: 3/5)
- GAP: cannon-crew-no-lunge (dd1b785) VERDICT: APPROVE SCORE: battle-feel 3/5 (previous: 3/5)
- GAP: red-team-maroon (8c54d64) VERDICT: REJECT SCORE: unit-look 3/5 (previous: 3/5)
- GAP: lightning-shaded-bars (d194af2) VERDICT: APPROVE SCORE: vfx 3/5 (previous: 3/5)
- GAP: sky-zenith-too-dark (f1ab991) VERDICT: APPROVE SCORE: maps-light 3/5 (previous: 3/5)
- GAP: bucket-helm-oversized (d223a46) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: grass-cone-carpet (43b8163) VERDICT: APPROVE SCORE: maps-light 3/5 (previous: 3/5)
- GAP: victory-title-bold (cb80215) VERDICT: APPROVE SCORE: ui-flow 4/5 (previous: 4/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [unit-look] red-team-maroon: skin is wine and cloth wine, TABS is one saturated coral (235,99,109); lerp team-1 skin toward (1, 0.45, 0.42), same lift on the cloth blend [attempts: 1] — ref: tabs_screenshot_01 — ours: big_melee_2s.png
2. [ui-flow] victory-title-thin: title and hint stroke ratio 0.13 vs TABS 0.20; font-weight 600 on #resultTitle and .result-actions .btn [attempts: 0] — ref: gameplay_sheet_02 — ours: big_melee_result.png
3. [battle-feel] cannon-crew-plank-lean: crew lean with straight legs and hanging arms; lead hip -1.0, lead knee +1.0, shoulders -1.3 in the "crew" pose [attempts: 0] — ref: tabs_screenshot_08 — ours: war_machines_3800ms.png
4. [vfx] lightning-straight-blade: bolt is one near-straight band, burst is a half-hidden triangle; double the knee offsets in spawnLightning [attempts: 0] — ref: trailer_2_sheet_03 — ours: closeup_state_reads.png
5. [maps-light] glow-halo-rims: clouds and far ridges carry white bloom rims; exclude cloud and far-ridge meshes from the glow layer [attempts: 0] — ref: tabs_screenshot_01 — ours: war_machines_3800ms.png
6. [maps-light] far-ridges-all-white: ridges are near-white icebergs, TABS has grey-tan rock under white crests; darken FAR_ROCK and its shade about 15% [attempts: 0] — ref: trailer_3_sheet_01 — ours: big_melee_2s.png
7. [unit-look] bucket-helm-pale-slab: helm is pale grey and 1.45 times as tall as wide, TABS is dark steel; helm material to about (0.38, 0.38, 0.42) [attempts: 0] — ref: trailer_3_sheet_01 — ours: closeup_weapon_reads.png
8. [maps-light] grass-even-sprigs: same-sized sprigs at even spacing, TABS has dense patches and bare ground; drop about 40% of cells by seed, raise PER_TUFT in the rest [attempts: 0] — ref: tabs_screenshot_02 — ours: big_melee_2s.png

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- red-team-maroon [attempts: 1] — skin lerped 0.27 to warm white: dusty mauve, saturation halved; cloth still wine, mammoth harness pink
- backdrop-peaks-ice-blue [attempts: 1] — FAR_ROCK warm brown: invisible under scene fog (ridges now fog-free)
- tribal-apron-outside-ring [attempts: 1] — back-row spread to 1.38: band unchanged, two trees float off the lawn rim
- front-lines-body-apart [attempts: 1] — enemy collision at 0.7 of summed radii: topple scenarios lose their push
- muzzle-smoke-one-ball [attempts: 2] — lobe base 0.2: TABS puffs are fat and bigger than a head
- zeus-no-robe-skirt [attempts: 2] — a barrel and a leg still pokes through
- corpses-all-flat [attempts: 2] — curl hidden in grass, six bodies in one pose
- crowns-second-hue-lemon [attempts: 1] — the yellow material was untouched and still lemon

## Notes for next iteration (max 5 lines)
- Spent (never retry): corpses-all-flat, zeus-no-robe-skirt, muzzle-smoke-one-ball, upright-idle-locked-legs, placement-armies-specks, fireball-balloon-stack. Blast-lift cuts stall battle_recap_result_legacy_tank_shell. Do not shrink the enemy collision distance in _resolveLivingCollisions.
- Sky: `skyDome` in main.ts, base (0.43, 0.78, 0.68), deep end (0.33, 0.74, 0.65), mint haze below y 420. Far ridge materials are fog-free (made in mapBuilder near paintFarProps, FAR_ROCK consts line 19); the comment there saying they stand past the fog's far end is wrong, fix it when touching.
- Units: TEAM_COLORS[1] is (0.8, 0.16, 0.2), do not mutate; skin is teamColor.scale(0.9) in unitFactory (line 115) and also tints trousers and vehicle paint. Hats get x1.1 in buildHat and x1.25 PROP_OVERSIZE. Crew pose keys off _linkedRoleLabel "loader".
- Air pose: hashes 21, 23-32, 40-54 taken; pose-only, no Math.random(). Lightning burst is two 3-sided discs under `lburst` in spawnLightning.
- EOLs are mixed CRLF/LF: edit with an EOL-preserving replace, not line-number sed. In-file edits only.
