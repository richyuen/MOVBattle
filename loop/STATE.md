# Loop state
Iteration: 101   Last re-audit: 100   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 3 | ui-flow 4 | camera 4 | vfx 3

## Focus (every pickable gap this iteration)
- lightning-square-beams 9816923 — APPROVE
- mammoth-tusk-overlong a88def1 — APPROVE
- launched-cloud-height-starfish 9472406 — APPROVE
- bomb-crew-overlap f377c83 — APPROVE
- cannon-disc-wheels-long-barrel 17c1488 — REJECT (reverted a693eba)
- clouds-one-size d21bd18 — APPROVE
- mammoth-bald-dome-head bb2994e — APPROVE

## Last verdicts (one line per gap, verbatim critic header)
- GAP: lightning-square-beams (9816923) VERDICT: APPROVE SCORE: vfx 3/5 (previous: 3/5)
- GAP: mammoth-tusk-overlong (a88def1) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: launched-cloud-height-starfish (9472406) VERDICT: APPROVE SCORE: battle-feel 3/5 (previous: 3/5)
- GAP: bomb-crew-overlap (f377c83) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: cannon-disc-wheels-long-barrel (17c1488) VERDICT: REJECT SCORE: unit-look 3/5 (previous: 3/5)
- GAP: clouds-one-size (d21bd18) VERDICT: APPROVE SCORE: maps-light 3/5 (previous: 3/5)
- GAP: mammoth-bald-dome-head (bb2994e) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [unit-look] cannon-disc-wheels-long-barrel: small solid tan discs under a long thin barrel; buildCannon wheel diameter 0.58 dark, barrel height 1.1 to 0.8, diameterTop 0.17 to 0.22; buildBombCannon bombBarrel 0.7 with two bombBand rings [attempts: 1] — ref: tabs_screenshot_08 — ours: war_machines_3800ms.png
2. [battle-feel] launched-cloud-height: cannon-flung bodies scatter singly up to cloud height; halve the vertical launch impulse for explosion hits [attempts: 0] — ref: trailer_3_sheet_03 r1c2 — ours: war_machines_1100ms.png
3. [unit-look] mammoth-topknot-spikes: pointed near-black spikes, short trunk; buildMammoth topknot diameterTop h*0.7, diameterBottom h*1.5, trunkSegments 5 to 7, eye 0.13 to 0.2 [attempts: 0] — ref: tabs_screenshot_01 — ours: big_melee_result.png
4. [vfx] explosion-smooth-balls: stack of smooth round yellow/white balls; puff sphere segments 2-3, blast 1.5x wider, one orange-white mass [attempts: 0] — ref: trailer_3_sheet_03 r1c1 — ours: war_machines_3800ms.png
5. [maps-light] clouds-high-flat-underside: big banks float high with grey undersides; _createClouds sink the i % 3 === 0 banks to the treeline [attempts: 0] — ref: tabs_screenshot_01 — ours: war_machines_3800ms.png
6. [vfx] lightning-one-chain: one white chain, long straight arm, no rim; addShard scaling.z 0.25, diameterBottom thickness*3.2, cap segment length 1.2 [attempts: 0] — ref: trailer_2_sheet_03 r3c2 — ours: closeup_state_reads.png
7. [unit-look] humans-boxy-torsos: wide torsos, block pauldrons, thick short limbs; bodyBuilder limb girth -15%, length +10% [attempts: 0] — ref: tabs_screenshot_06 — ours: lineup_medieval.png
8. [battle-feel] bomb-crew-side-overlap: crew overlap from the side; linkedActorPresets "secret.bomb_cannon" loader z -0.48 to -0.85 [attempts: 0] — ref: tabs_screenshot_08 — ours: war_machines_1100ms.png

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- cannon-disc-wheels-long-barrel [attempts: 1] — wheels 0.55 to 0.46: backwards, TABS wheels are as tall as the gun; shorten the barrel instead (bomb barrel 0.7 + bands was liked)
- far-ridge-cones [attempts: 2] — top 0.5, cap 0.12: flat-topped mesas, snow invisible
- bucket-helm-tall [attempts: 2] — scaling (0.9, 0.8, 0.9), pale steel: a wide near-white bin
- grass-thin-scatter [attempts: 2] — BLADES 840000, PER_TUFT 7: tuft spacing unchanged
- red-team-maroon [attempts: 2] — team red lerped to coral: screen skin unchanged
- lightning-straight-blade [attempts: 1] — knee offsets doubled: still two long bands
- tribal-apron-outside-ring [attempts: 1] — back-row spread to 1.38: two trees float off the lawn rim
- front-lines-body-apart [attempts: 1] — enemy collision at 0.7 of summed radii: topple scenarios lose their push

## Notes for next iteration (max 5 lines)
- Spent (never retry): far-ridge-cones, red-team-maroon, corpses-all-flat, zeus-no-robe-skirt, muzzle-smoke-one-ball, upright-idle-locked-legs, placement-armies-specks, fireball-balloon-stack, helm shape/colour, grass tuft spacing. Do not shrink enemy collision distance in _resolveLivingCollisions.
- Rendering: ACES crushes material red; judge colours by screen pixel. Flyer fold and lead arm stay signed per unit (_wobblePhase); critic also wants hip swing 0.45 to 0.25.
- Units: TEAM_COLORS[1] must not be mutated. Bomb crew are linked units (linkedActorPresets, pose "crew"); bomb cannon disposes field barrel meshes by name, so name new rings bombBand.
- Tusks: 0.6 length is right; next is steeper first two tuskPitches. Lightning shards: 4-sided CreateCylinder aimed with lookAt(b, 0, PI/2, 0), thin end at b.
- These source files are LF in the working tree; Edit and sed both work. Commit with `git commit -F -` heredoc.
