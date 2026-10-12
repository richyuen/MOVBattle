# Loop state
Iteration: 48   Last re-audit: 45   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 3 | unit-look 3 | maps-light 3 | ui-flow 4 | camera 4 | vfx 3

## Focus (2-3 gaps this iteration)
- muzzle-and-spell-white-blowout 211e2c3 — APPROVE
- idle-stance-narrow-from-front f60f794 — APPROVE
- hit-debris-on-every-hit 7df5552 — APPROVE

## Last verdicts (one line per gap, verbatim critic header)
- GAP: muzzle-and-spell-white-blowout (211e2c3) VERDICT: APPROVE SCORE: vfx 3/5 (previous: 3/5)
- GAP: idle-stance-narrow-from-front (f60f794) VERDICT: APPROVE SCORE: battle-feel 3/5 (previous: 3/5)
- GAP: hit-debris-on-every-hit (7df5552) VERDICT: APPROVE SCORE: vfx 3/5 (previous: 3/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [unit-look] box-mitt-hands-and-rod-limbs: cube hands as large as the head on stick arms [attempts: 2] — ref: trailer_1_sheet_01 — ours: big_melee_9s.png
2. [vfx] lightning-reads-as-grey-plank: straight grey bars as wide as a torso, not small kinked flat-white shards [attempts: 0] — ref: trailer_2_sheet_03 — ours: closeup_state_reads.png
3. [battle-feel] idle-arms-hang-symmetric: both arms hang straight down; second machine's crew still upright posts [attempts: 0] — ref: trailer_1_sheet_01 — ours: lineup_medieval.png
4. [vfx] impact-dust-row-of-tan-lumps: cannon hits lay a line of same-size tan blobs, not one fat burst [attempts: 0] — ref: trailer_3_sheet_03 — ours: war_machines_1100ms.png
5. [maps-light] unit-shadows-pale-and-short: melee units barely mark the grass [attempts: 1] — ref: trailer_3_sheet_01 — ours: big_melee_5s.png
6. [maps-light] placement-arena-square-slab: hard-edged rectangle floating in flat teal [attempts: 2] — ref: trailer_1_sheet_01 — ours: hud_placement.png
7. [camera] melee-camera-inside-the-crowd: foreground bodies fill and clip the frame, hiding the clash [attempts: 0] — ref: trailer_3_sheet_01 — ours: big_melee_9s.png
8. [maps-light] tree-crowns-cast-no-shadow: dark pill blotches on crowns, no ground shadow; sky one flat tone [attempts: 1] — ref: trailer_3_sheet_01 — ours: closeup_weapon_reads.png

## Rejected attempts (last 5, newest first; `rejected-kept` when the revert conflicted)
- tree-crowns-cast-no-shadow [attempts: 1] — crowns and rocks shade themselves near-black; no boulder pool
- unit-shadows-pale-and-short [attempts: 1] — kernel 12 + light rebalance: still no silhouette; crowns went near-black
- shadows-noon-blobs [attempts: 1] — sun angle alone: trees cast nothing, unit shadows pale half-body smears
- back-ridge-pale-slab [attempts: 1] — height cut alone leaves the band; footprint makes it from the raised camera
- lightning-soft-beam-fog-ball [attempts: 1] — straight bar still main read; halo remains

## Notes for next iteration (max 5 lines)
- Gap 2: spawnLightning: amp floor (len*0.14 leaves short bolts straight), thinner shards, flat white (raise emissive; stays glow-excluded).
- Gap 3: idle: raise the weapon arm forward, bend the off arm; pass addOperator's pose callback to the other crewed machine in war_machines.
- Gap 4: find what lays dust along the cannon shot line (per-body spawnImpactDust?); one fat burst at the impact instead.
- Debris follow-up (unranked): keep the largest chunk full size on the ground; add grey/wood tones.
- Pickable next: 2, 3, 4, 7 (1 and 6 are at 2 attempts; 5 and 8 are in Rejected).
