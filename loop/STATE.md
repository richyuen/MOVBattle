# Loop state
Iteration: 97   Last re-audit: 95   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 3 | ui-flow 4 | camera 4 | vfx 3

## Focus (every pickable gap this iteration)
- red-team-maroon 30e0a0e — REJECT (reverted c39dd45)
- victory-title-thin 88415de — APPROVE
- cannon-crew-plank-lean ba28ce9 — APPROVE
- lightning-straight-blade 76c5dcf — REJECT (reverted 3cc3536)
- glow-halo-rims bcb14ca — APPROVE
- far-ridges-all-white 5d30092 — APPROVE
- bucket-helm-pale-slab 112d067 — REJECT (reverted 6542285)
- grass-even-sprigs 73c0d3f — REJECT (reverted e94cb3e)

## Last verdicts (one line per gap, verbatim critic header)
- GAP: red-team-maroon (30e0a0e) VERDICT: REJECT SCORE: unit-look 3/5 (previous: 3/5)
- GAP: victory-title-thin (88415de) VERDICT: APPROVE SCORE: ui-flow 4/5 (previous: 4/5)
- GAP: cannon-crew-plank-lean (ba28ce9) VERDICT: APPROVE SCORE: battle-feel 3/5 (previous: 3/5)
- GAP: lightning-straight-blade (76c5dcf) VERDICT: REJECT SCORE: vfx 3/5 (previous: 3/5)
- GAP: glow-halo-rims (bcb14ca) VERDICT: APPROVE SCORE: maps-light 3/5 (previous: 3/5)
- GAP: far-ridges-all-white (5d30092) VERDICT: APPROVE SCORE: maps-light 3/5 (previous: 3/5)
- GAP: bucket-helm-pale-slab (112d067) VERDICT: REJECT SCORE: unit-look 3/5 (previous: 3/5)
- GAP: grass-even-sprigs (73c0d3f) VERDICT: REJECT SCORE: maps-light 3/5 (previous: 3/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [unit-look] red-team-dusty (was red-team-maroon): skin on screen (149,92,88), TABS (235,99,109); material input about (1, 0.24, 0.24), verify by sampled pixel [attempts: 2] — ref: tabs_screenshot_01 — ours: big_melee_2s.png
2. [maps-light] grass-thin-scatter (was grass-even-sprigs): isolated tufts, TABS has ground-hiding patches beside bare ground; BLADES to 840000 with PER_TUFT 7, cell jitter 3 to 1 [attempts: 1] — ref: tabs_screenshot_02 — ours: big_melee_2s.png
3. [vfx] lightning-long-bands (was lightning-straight-blade): two long straight bands, burst a half-hidden triangle; segments = round(len / 0.4) clamped 8 to 20 [attempts: 1] — ref: trailer_2_sheet_03 — ours: closeup_state_reads.png
4. [unit-look] bucket-helm-tall (was bucket-helm-pale-slab): helm 1.45 times as tall as wide, TABS is squat pale blue-grey; steel to about (0.6, 0.66, 0.72), height to 1.1 times width [attempts: 1] — ref: trailer_1_sheet_01 r2c1 — ours: closeup_weapon_reads.png
5. [battle-feel] corpses-identical-prone (same as spent corpses-all-flat): six dead knights in one pose and heading; randomize death yaw and limb angles [attempts: 2] — ref: trailer_2_sheet_02 — ours: war_machines_3800ms.png
6. [battle-feel] cannon-crew-upright: torso lean 0.55 rad and the right gun's lone crewman stands straight; torso.rotation.x to about 0.9 (loader 0.75), check he takes the "crew" pose [attempts: 0] — ref: tabs_screenshot_08 — ours: war_machines_3800ms.png
7. [maps-light] far-ridge-lit-faces-white: sunlit faces (202,211,209) match the snow and lean mint; FAR_ROCK to about (0.5, 0.48, 0.44), FAR_ROCK_MIX to 0.3 [attempts: 0] — ref: trailer_3_sheet_01 — ours: closeup_weapon_reads.png
8. [ui-flow] victory-hint-font: hint is a different typeface from the title; same font-family on .result-actions .btn as #resultTitle [attempts: 0] — ref: gameplay_sheet_02 — ours: big_melee_result.png

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- red-team-maroon [attempts: 2] — team red lerped 0.85 to (1, 0.45, 0.42): screen skin still (149,92,88), cloth saturation fell 0.68 to 0.40, harness pink
- lightning-straight-blade [attempts: 1] — knee offsets doubled: still two long bands, shards too long, burst untouched
- bucket-helm-pale-slab [attempts: 1] — steel (0.38, 0.38, 0.42): darker than the tabard, the close ref is pale blue-grey; height untouched
- grass-even-sprigs [attempts: 1] — PER_TUFT 7 at fixed BLADES cut tufts 43%, coverage halved, no patch edges
- backdrop-peaks-ice-blue [attempts: 1] — FAR_ROCK warm brown: invisible under scene fog (ridges now fog-free)
- tribal-apron-outside-ring [attempts: 1] — back-row spread to 1.38: band unchanged, two trees float off the lawn rim
- front-lines-body-apart [attempts: 1] — enemy collision at 0.7 of summed radii: topple scenarios lose their push
- muzzle-smoke-one-ball [attempts: 2] — lobe base 0.2: TABS puffs are fat and bigger than a head

## Notes for next iteration (max 5 lines)
- Spent (never retry): red-team-maroon/dusty, corpses-all-flat/identical-prone, zeus-no-robe-skirt, muzzle-smoke-one-ball, upright-idle-locked-legs, placement-armies-specks, fireball-balloon-stack. Do not shrink the enemy collision distance in _resolveLivingCollisions.
- Rendering: ACES tone mapping crushes material red (input 0.87 shows as 0.58); judge colours by sampled screen pixel. Rims were pipeline bloom (main.ts, weight now 0.15), not the glow layer; raise bloomThreshold if revisited.
- Units: TEAM_COLORS[1] is (0.8, 0.16, 0.2), do not mutate; skin is teamColor.scale(0.9) in unitFactory. Hats get x1.1 in buildHat and x1.25 PROP_OVERSIZE. Crew pose is case "crew" in runtimeUnit, keyed off _linkedRoleLabel "loader".
- Lightning burst is two 3-sided discs under `lburst` in spawnLightning. Far ridge consts are at mapBuilder line 19.
- EOLs are mixed CRLF/LF: use a byte-exact single-line replace, not line-number sed or multi-line patterns.
