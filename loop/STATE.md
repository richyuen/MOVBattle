# Loop state
Iteration: 7   Last re-audit: 5   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 2 | unit-look 2 | maps-light 3 | ui-flow 3 | camera 3 | vfx 1

## Focus (2-3 gaps this iteration)
- rear-rank-press 1284499+a484aa7 — APPROVE (battle-feel 2->2)
- arena-ring ce2a008+0253e2d — APPROVE (maps-light 2->3)
- spell-solid-shapes d4ccbb1 — REJECT, reverted 6bbb4ee (vfx 1->1)

## Last verdicts (one line per gap, verbatim critic header)
- GAP: rear-rank-press (1284499, a484aa7) VERDICT: APPROVE SCORE: battle-feel 2/5 (previous: 2/5)
- GAP: arena-ring (ce2a008, 0253e2d) VERDICT: APPROVE SCORE: maps-light 3/5 (previous: 2/5)
- GAP: spell-solid-shapes (d4ccbb1) VERDICT: REJECT SCORE: vfx 1/5 (previous: 1/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [vfx] spell-solid-shapes: soft alpha halo on casts; sparks/fire additive gradient blobs; lightning never captured [attempts: 1] — ref: trailer_2_sheet_03 r3c2 — ours: closeup_state_reads.png
2. [maps-light] zones-match-slab: zones/nav bounds (160x240 per team) extend past the 184x96 slab; units can stand on nothing [attempts: 0] — ref: gameplay_sheet_01 r3c2 — ours: big_melee_placement.png
3. [battle-feel] fallen-ally-berth: fallen allies get a 2.6 m berth so the press opens around bodies; use ~0.9 m [attempts: 0] — ref: tabs_screenshot_01 — ours: big_melee_9s.png
4. [maps-light] island-edge: edge never visible; rectangular slab, ring 42x36 m; want small rounded island, cliff sides [attempts: 0] — ref: trailer_1_sheet_01 r1c1 — ours: big_melee_placement.png
5. [camera] placement-frame: placement camera shows grass to the border, not the whole arena and tree ring [attempts: 0] — ref: gameplay_sheet_01 r3c3 — ours: hud_placement.png
6. [battle-feel] engaged-rigid: units bolt upright between hits, rear archers idle rigid [attempts: 0] — ref: trailer_3_sheet_01 r1c2 — ours: big_melee_2s.png
7. [vfx] smoke-puff-light: smoke should be light grey faceted chunks larger than the unit [attempts: 0] — ref: trailer_2_sheet_02 r1c1 — ours: closeup_weapon_reads.png
8. [maps-light] divider-ground: magenta divider runs through the HUD; flat single-green ground, sparse spikes [attempts: 0] — ref: gameplay_sheet_01 r3c2 — ours: hud_placement.png

## Rejected attempts (last 5, newest first; `rejected-kept` when the revert conflicted)
- spell-solid-shapes [attempts: 1] — no capture shows a bolt/fireball; soft halo still in closeup_state_reads; commit also touched hit flash and explosion smoke
- camera-spread-radius [attempts: 1] — both-teams bbox with clamp 10-18 backs the camera off; sparse fights still empty
- cloth-second-tone [attempts: 1] — scale before preset blend is washed out by light presets; floor 0.24 reads black

## Notes for next iteration (max 5 lines)
- Regression scenarios are sensitive to the nav grid: changing getPlacementZones or obstacle extents shifts cell alignment (shield_wall failed); bisect with `capture.mjs --iter 99 --regression-only`.
- spillover_chain needs the wide radius around toppled/downed allies (_applyCrowdAvoidance); 0.9 m is untested.
- Captures hide VFX: zeus_thor closeup is idle, gallery closeups far oblique (main.ts:3125), war_machines shots near empty.
- Halo source unconfirmed: additive createSparks/createFire or GlowLayer (main.ts:254) on an emissive mesh.
- Critic liked opaque grey icosphere smoke chunks (reverted with d4ccbb1); reuse for smoke-puff-light.
