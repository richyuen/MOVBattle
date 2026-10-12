# Loop state
Iteration: 99   Last re-audit: 95   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 3 | ui-flow 4 | camera 4 | vfx 3

## Focus (every pickable gap this iteration)
- lightning-band-edge-on 0f69ddf — APPROVE
- cannon-operator-hands-air ea33ad7 — APPROVE
- cannon-crew-bare b9dd6ea — APPROVE
- clouds-cauliflower fe6e82e — APPROVE
- far-ridge-cones bba05e3 — REJECT (reverted 1555ba7)
- mammoth-plain cf33af5 — APPROVE

## Last verdicts (one line per gap, verbatim critic header)
- GAP: lightning-band-edge-on (0f69ddf) VERDICT: APPROVE SCORE: vfx 3/5 (previous: 3/5)
- GAP: cannon-operator-hands-air (ea33ad7) VERDICT: APPROVE SCORE: battle-feel 3/5 (previous: 3/5)
- GAP: cannon-crew-bare (b9dd6ea) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: clouds-cauliflower (fe6e82e) VERDICT: APPROVE SCORE: maps-light 3/5 (previous: 3/5)
- GAP: far-ridge-cones (bba05e3) VERDICT: REJECT SCORE: maps-light 3/5 (previous: 3/5)
- GAP: mammoth-plain (cf33af5) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [maps-light] far-ridge-cones: separate snow-capped cones, sky between; add infill mountains at x -35/0/32 (z 99, heights 14 to 19) in _createMountains, widen shoulder humps to offset 0.35, footprint 0.95/0.9; leave the colour consts [attempts: 1] — ref: trailer_3_sheet_01 r3c3 — ours: big_melee_2s.png
2. [maps-light] horizon-black-strip: hard black strip under the far treeline; find the far-rim mesh behind the trunks, give it hazed farRock colour or drop it below the lawn line [attempts: 0] — ref: trailer_3_sheet_02 r3c2 — ours: closeup_pair_zeus_thor.png
3. [battle-feel] launched-rigid-planks: launched knights fly in one straight-limbed T pose; per-unit random shoulder/hip/knee bend while airborne [attempts: 0] — ref: trailer_3_sheet_03 r1c2 — ours: war_machines_1100ms.png
4. [vfx] lightning-even-sawtooth: constant-width even zigzag, torso-sized star; shard thickness x0.5 to x2.2 random, swing factor 0.25 to 1.0, burst camera offset 0.5 to 0.2 [attempts: 0] — ref: trailer_2_sheet_03 r3c2 — ours: closeup_state_reads.png
5. [unit-look] cannon-plain-tube: smooth tube, plank, tan disc wheels; barrel tessellation 8, three raised bands, flared muzzle ring, red-brown carriage, near-black wheels [attempts: 0] — ref: tabs_screenshot_08 — ours: war_machines_3800ms.png
6. [unit-look] mammoth-tusk-kinked: six square slabs, half team-coloured, crest not black; ten segments (pitch step 0.24, length 0.33, tessellation 8), tip material on the last only, lengths x0.85 [attempts: 0] — ref: tabs_screenshot_01 — ours: big_melee_result.png
7. [battle-feel] bomb-crew-bent-bare: bomb cannon crew bent double and bare; crew pose torso 0.5 with straight rear leg, striped shirt and trousers [attempts: 0] — ref: tabs_screenshot_08 — ours: war_machines_3800ms.png
8. [maps-light] clouds-saucer: thin plates, crown a ring on top; puff centre scaling.y*0.35, middle y-scale 0.6, crown off-centre by size*0.3 [attempts: 0] — ref: tabs_screenshot_01 — ours: closeup_state_reads.png

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- far-ridge-cones [attempts: 1] — FAR_ROCK_SHADE warm, FAR_ROCK_MIX 0.22: colour not visible, cones untouched; TABS ridge is more hazed, not less
- bucket-helm-tall [attempts: 2] — scaling (0.9, 0.8, 0.9), pale steel: a wide near-white bin; the ref helm is tall and narrow
- grass-thin-scatter [attempts: 2] — BLADES 840000, PER_TUFT 7: tuft spacing unchanged, no patch edge
- red-team-maroon [attempts: 2] — team red lerped to coral: screen skin unchanged, cloth desaturated
- lightning-straight-blade [attempts: 1] — knee offsets doubled: still two long bands
- backdrop-peaks-ice-blue [attempts: 1] — FAR_ROCK warm brown: invisible under scene fog (ridges now fog-free)
- tribal-apron-outside-ring [attempts: 1] — back-row spread to 1.38: two trees float off the lawn rim
- front-lines-body-apart [attempts: 1] — enemy collision at 0.7 of summed radii: topple scenarios lose their push

## Notes for next iteration (max 5 lines)
- Spent (never retry): red-team-maroon/dusty, corpses-all-flat/identical-prone, zeus-no-robe-skirt, muzzle-smoke-one-ball, upright-idle-locked-legs, placement-armies-specks, fireball-balloon-stack, helm shape/colour, grass tuft spacing. Do not shrink the enemy collision distance in _resolveLivingCollisions.
- Rendering: ACES tone mapping crushes material red; judge colours by sampled screen pixel. Rims were pipeline bloom (main.ts), not the glow layer.
- Units: TEAM_COLORS[1] must not be mutated. Bomb cannon crew are linked units (linkedActorPresets "secret.bomb_cannon", pose case "crew" in runtimeUnit); the pirate operator is static: buildCannon addOperator + dressCannonCrew (critic wants him behind the breech, x 0.3, z -0.75, yaw 0, sleeves hooped).
- Lightning: `side` is Cross(dir, eye - bolt centre); star is two 3-sided discs (radius 0.3) under `lburst`. Far ridge consts at mapBuilder line 19; clouds in _createClouds (underside clamped at y 0).
- Source files have MIXED line endings: edit with a unique-string replace that matches \r?\n (or the Edit tool); never line-number sed, never shell heredocs with backslashes.
