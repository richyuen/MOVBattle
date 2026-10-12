# Loop state
Iteration: 102   Last re-audit: 100   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 3 | ui-flow 4 | camera 4 | vfx 3

## Focus (every pickable gap this iteration)
- cannon-disc-wheels-long-barrel c33040d — APPROVE
- launched-cloud-height 4920c5b — REJECT (reverted 5eb161e)
- mammoth-topknot-spikes 4c42b1f — APPROVE
- explosion-smooth-balls 4bf6cb9 — REJECT (reverted e059d76)
- clouds-high-flat-underside 18b1f4a — APPROVE
- lightning-one-chain cc37c05 — APPROVE
- humans-boxy-torsos 238923c — APPROVE
- bomb-crew-side-overlap 933401b — APPROVE

## Last verdicts (one line per gap, verbatim critic header)
- GAP: cannon-disc-wheels-long-barrel (c33040d) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: launched-cloud-height (4920c5b) VERDICT: REJECT SCORE: battle-feel 3/5 (previous: 3/5)
- GAP: mammoth-topknot-spikes (4c42b1f) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: explosion-smooth-balls (4bf6cb9) VERDICT: REJECT SCORE: vfx 3/5 (previous: 3/5)
- GAP: clouds-high-flat-underside (18b1f4a) VERDICT: APPROVE SCORE: maps-light 3/5 (previous: 3/5)
- GAP: lightning-one-chain (cc37c05) VERDICT: APPROVE SCORE: vfx 3/5 (previous: 3/5)
- GAP: humans-boxy-torsos (238923c) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: bomb-crew-side-overlap (933401b) VERDICT: APPROVE SCORE: battle-feel 3/5 (previous: 3/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [battle-feel] blast-lift-too-low: cannon hits knock bodies over, no cluster goes up; projectileSystem applyBlastLaunch(outward, 1 + 1.5*falloff, 8 + 4*falloff) [attempts: 1] — ref: trailer_3_sheet_03 r1c2 — ours: war_machines_1100ms.png
2. [vfx] explosion-detached-caps: separate cream/yellow/orange balls, floating orange caps, one man tall; spawnExplosionBurst lobeHeights [0.5, 0.05, 0.55, -0.15, 0.6, 0.35], lobes 1-5 flashMat [attempts: 1] — ref: trailer_3_sheet_03 r1c1 — ours: war_machines_3800ms.png
3. [maps-light] cloud-slab-undersides: flat grey-bottomed slabs above the canopy; _createClouds big height 8 + seed*3, non-big size 6 + seed*5 [attempts: 0] — ref: tabs_screenshot_01 — ours: big_melee_2s.png
4. [unit-look] cannon-solid-wheels: solid slabs, no spokes; buildCannon wheel to CreateTorus diameter 0.58 thickness 0.06, spoke width 0.05 [attempts: 0] — ref: tabs_screenshot_08 — ours: war_machines_3800ms.png
5. [vfx] lightning-no-cyan-rim: grey-white see-through shards, no rim, white star flash; addShard cyan (0.3, 0.9, 1.0) backing shard x1.3, boltMat alpha 1 [attempts: 0] — ref: trailer_2_sheet_03 r3c2 — ours: closeup_state_reads.png
6. [unit-look] mammoth-topknot-black-prism: near-black upright hexagonal block; topknot to CreateSphere segments 3 scaled (h*1.5, h*0.8, h*1.5), eye 0.16 [attempts: 0] — ref: tabs_screenshot_01 — ours: big_melee_9s.png
7. [unit-look] sleeve-blocks-wide: square puffed sleeves, thick thighs; bodyBuilder SLEEVE_BULK 1.35 to 1.15 [attempts: 0] — ref: tabs_screenshot_06 — ours: closeup_pair_zeus_thor.png
8. [unit-look] clubber-club-overlong: clubs longer than the clubber; propBuilder "club" handle 0.6*s to 0.4*s, head 0.45*s to 0.35*s [attempts: 0] — ref: trailer_3_sheet_01 r2c3 — ours: big_melee_2s.png

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- explosion-smooth-balls [attempts: 1] — segments 3, fire root 1.5 wide: still separate balls, orange caps float above
- launched-cloud-height [attempts: 1] — lift 4-6: apex under half a body, a knock-over; keep lift 8-12, cut outward speed
- far-ridge-cones [attempts: 2] — top 0.5, cap 0.12: flat-topped mesas, snow invisible
- bucket-helm-tall [attempts: 2] — scaling (0.9, 0.8, 0.9), pale steel: a wide near-white bin
- grass-thin-scatter [attempts: 2] — BLADES 840000, PER_TUFT 7: tuft spacing unchanged
- red-team-maroon [attempts: 2] — team red lerped to coral: screen skin unchanged
- lightning-straight-blade [attempts: 1] — knee offsets doubled: still two long bands
- tribal-apron-outside-ring [attempts: 1] — back-row spread to 1.38: two trees float off the lawn rim

## Notes for next iteration (max 5 lines)
- Spent (never retry): far-ridge-cones, red-team-maroon, corpses-all-flat, zeus-no-robe-skirt, muzzle-smoke-one-ball, upright-idle-locked-legs, placement-armies-specks, fireball-balloon-stack, helm shape/colour, grass tuft spacing. Never shrink enemy collision distance.
- ACES crushes material red; judge colours by screen pixel. TEAM_COLORS[1] must not be mutated. Bomb cannon disposes field barrel meshes by name.
- Lightning shards are flattened toward the camera (scaling 0.25 on the cross axis facing the eye); critic wants the strike star gone.
- Some source files are CRLF in the working tree: normalise before exact-match edits. Commit with `git commit -F -` heredoc.
