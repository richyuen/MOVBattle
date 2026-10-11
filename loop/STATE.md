# Loop state
Iteration: 9   Last re-audit: 5   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 2 | unit-look 2 | maps-light 3 | ui-flow 3 | camera 4 | vfx 1

## Focus (2-3 gaps this iteration)
- lines-collide aa5eb74 — APPROVE (battle-feel 2->2)
- mammoth-launch cc286a6 — REJECT, reverted a12e07c
- nav-match-slab 2ba9a51 — REJECT, reverted c9cf372

## Last verdicts (one line per gap, verbatim critic header)
- GAP: lines-collide (aa5eb74) VERDICT: APPROVE SCORE: battle-feel 2/5 (previous: 2/5)
- GAP: mammoth-launch (cc286a6) VERDICT: REJECT SCORE: battle-feel 2/5 (previous: 2/5)
- GAP: nav-match-slab (2ba9a51) VERDICT: REJECT SCORE: maps-light 3/5 (previous: 3/5)

## Ranked open gaps (max 8, attempts count in brackets)
1. [battle-feel] mammoth-launch-proof: no body leaves the ground at the mammoth; needs airborne-height scenario proof; 0.7 topple clamp cuts launches [attempts: 1] — ref: trailer_3_sheet_01 r1c3 — ours: big_melee_9s.png
2. [battle-feel] melee-stop-distance: fronts a body width apart at 5 s, contact one rank deep; rear units idle [attempts: 0] — ref: trailer_2_sheet_02 r1c1 — ours: big_melee_5s.png
3. [vfx] impact-debris: big hits show no dust/debris chunks; magic is a diffuse white blob [attempts: 0] — ref: tabs_screenshot_09 — ours: closeup_weapon_reads.png
4. [battle-feel] upright-poses: fighters rigid and vertical, no lean or windmilling arms [attempts: 0] — ref: tabs_screenshot_01 — ours: big_melee_5s.png
5. [unit-look] mammoth-shape: box with slab ears, no curved tusks, trunk or fur mass [attempts: 0] — ref: tabs_screenshot_01 — ours: big_melee_9s.png
6. [unit-look] body-faceting: smooth cylinder torsos, bucket heads, not faceted low-poly [attempts: 0] — ref: trailer_3_sheet_01 r3c1 — ours: big_melee_2s.png
7. [maps-light] campaign-slab-nav: campaign maps lack navBounds/placementZones; slab is a bare rectangle, no cliff face [attempts: 1] — ref: trailer_1_sheet_01 r1c1 — ours: hud_placement.png
8. [ui-flow] tray-icons: tray is text pills with prices and search box, not line-art icon tiles in an arc [attempts: 0] — ref: gameplay_sheet_01 r3c2 — ours: hud_placement.png

## Rejected attempts (last 5, newest first; `rejected-kept` when the revert conflicted)
- nav-match-slab [attempts: 1] — no evidence file shows a nav clip; campaign half untouched; max edges unsnapped
- mammoth-launch [attempts: 1] — no airborne body in any still; no scenario exercises the launch path
- spell-solid-shapes [attempts: 1] — no capture shows a bolt/fireball; soft halo still in closeup_state_reads
- camera-spread-radius [attempts: 1] — both-teams bbox with clamp 10-18 backs the camera off; sparse fights still empty
- cloth-second-tone [attempts: 1] — scale before preset blend is washed out by light presets; floor 0.24 reads black

## Notes for next iteration (max 5 lines)
- Iter 10 is a re-audit. Nav grid phase matters: plain +-92/+-48 bounds failed shield_wall; snapping min edges to the old 1.25 lattice passed.
- Launch needs proof first: add airborne/height asserts to crowd_topple_mammoth_pressure and put it in capture.mjs's list; lift caps are runtimeUnit applyDamage (0.95), _enterTopple (0.7), _die (1.35).
- big_melee mammoth (x=11) only reaches the front at ~9 s, behind its own line; stills rarely catch a slam.
- Critic's next edit for lines: melee units advance until body radii touch instead of halting at weapon reach.
- Digest tile labels for trailer_3_sheet_01 are off (launch is r1c3); war_machines shots are near empty.
