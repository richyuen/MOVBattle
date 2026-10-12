# Loop state
Iteration: 100   Last re-audit: 100   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 3 | ui-flow 4 | camera 4 | vfx 3

## Focus (every pickable gap this iteration)
- clouds-saucer 6a09fbd — APPROVE
- horizon-black-strip e349924 — APPROVE
- lightning-even-sawtooth 6e23460 — APPROVE
- far-ridge-cones f2128c9 — REJECT (reverted 81119b3)
- cannon-plain-tube 69f032a — APPROVE
- mammoth-tusk-kinked 2f4b057 — APPROVE
- launched-rigid-planks e39a27c — APPROVE
- bomb-crew-bent-bare 62fdaee — APPROVE

## Last verdicts (one line per gap, verbatim critic header)
- GAP: clouds-saucer (6a09fbd) VERDICT: APPROVE SCORE: maps-light 3/5 (previous: 3/5)
- GAP: horizon-black-strip (e349924) VERDICT: APPROVE SCORE: maps-light 3/5 (previous: 3/5)
- GAP: lightning-even-sawtooth (6e23460) VERDICT: APPROVE SCORE: vfx 3/5 (previous: 3/5)
- GAP: far-ridge-cones (f2128c9) VERDICT: REJECT SCORE: maps-light 3/5 (previous: 3/5)
- GAP: cannon-plain-tube (69f032a) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: mammoth-tusk-kinked (2f4b057) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)
- GAP: launched-rigid-planks (e39a27c) VERDICT: APPROVE SCORE: battle-feel 3/5 (previous: 3/5)
- GAP: bomb-crew-bent-bare (62fdaee) VERDICT: APPROVE SCORE: unit-look 3/5 (previous: 3/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [maps-light] far-ridge-cones: SPENT, see Rejected [attempts: 2] — ref: trailer_3_sheet_01 r2c2 — ours: big_melee_2s.png
2. [vfx] lightning-square-beams: shards are parallel-sided box beams with elbows; addShard: 4-sided CreateCylinder tapering thickness*2.2 to *0.3 [attempts: 0] — ref: trailer_2_sheet_03 r3c2 — ours: closeup_state_reads.png
3. [unit-look] mammoth-tusk-overlong: tusks sweep a body length forward and over the head; buildMammoth tusk length/splay factor 0.85 to 0.6 [attempts: 0] — ref: tabs_screenshot_01 — ours: big_melee_5s.png
4. [battle-feel] launched-cloud-height-starfish: flung bodies symmetric spread-eagle; _flailInAir fold bias 0.5 to 0.8, opposite-sign offset on the two shoulder terms [attempts: 0] — ref: trailer_3_sheet_03 r1c3 — ours: war_machines_1100ms.png
5. [unit-look] bomb-crew-overlap: gunner and loader merge into one blob; linkedActorPresets "secret.bomb_cannon" offsets x +0.45 / -0.45 [attempts: 0] — ref: tabs_screenshot_08 — ours: war_machines_1100ms.png
6. [unit-look] cannon-disc-wheels-long-barrel: bomb barrel long and unbanded, wheels taller than the gun; buildBombCannon two bands, bombBarrel height 1.0 to 0.7; buildCannon smaller wheels [attempts: 0] — ref: tabs_screenshot_08 — ours: war_machines_3800ms.png
7. [maps-light] clouds-one-size: every cloud the same low bank; _createClouds one in three size x2.2, crown y-scale 0.55 to 0.9 [attempts: 0] — ref: tabs_screenshot_01 — ours: closeup_state_reads.png
8. [unit-look] mammoth-bald-dome-head: smooth dome, no shaggy topknot, thin trunk; buildMammoth dark faceted topknot chunk, thicker trunk [attempts: 0] — ref: tabs_screenshot_01 — ours: big_melee_result.png

## Rejected attempts (last 8, newest first; `rejected-kept` when the revert conflicted)
- far-ridge-cones [attempts: 2] — top 0.5, cap 0.12, shoulders 0.35/0.9: flat-topped mesas, snow invisible; critic wanted top 0.3, cap 0.22, sizes 0.9/0.65
- far-ridge-cones [attempts: 1] — FAR_ROCK_SHADE warm, FAR_ROCK_MIX 0.22: colour not visible
- bucket-helm-tall [attempts: 2] — scaling (0.9, 0.8, 0.9), pale steel: a wide near-white bin
- grass-thin-scatter [attempts: 2] — BLADES 840000, PER_TUFT 7: tuft spacing unchanged
- red-team-maroon [attempts: 2] — team red lerped to coral: screen skin unchanged
- lightning-straight-blade [attempts: 1] — knee offsets doubled: still two long bands
- tribal-apron-outside-ring [attempts: 1] — back-row spread to 1.38: two trees float off the lawn rim
- front-lines-body-apart [attempts: 1] — enemy collision at 0.7 of summed radii: topple scenarios lose their push

## Notes for next iteration (max 5 lines)
- Spent (never retry): far-ridge-cones, red-team-maroon/dusty, corpses-all-flat, zeus-no-robe-skirt, muzzle-smoke-one-ball, upright-idle-locked-legs, placement-armies-specks, fireball-balloon-stack, helm shape/colour, grass tuft spacing. Do not shrink the enemy collision distance in _resolveLivingCollisions.
- Rendering: ACES tone mapping crushes material red; judge colours by sampled screen pixel. A 77.4 critic rejected a constant forward curl on flyers: keep the fold signed per unit.
- Units: TEAM_COLORS[1] must not be mutated. Bomb crew are linked units (linkedActorPresets, pose case "crew" in runtimeUnit, dressed by dressCannonCrew from unitFactory); bomb cannon disposes the field barrel meshes by name.
- Tusks: buildMammoth lays 12 eased pieces via tuskAt; scale length and splay together. Lightning shards: addShard in visualEffects.
- Source files have MIXED line endings: use the Edit tool (single-line old_string); never line-number sed.
