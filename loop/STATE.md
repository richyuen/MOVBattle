# Loop state
Iteration: 0   Last re-audit: 0   Consecutive rejects: 0   Branch: main

## Scores (critic, 1-5 per dimension, from last audit)
battle-feel 2 | unit-look 2 | maps-light 2 | ui-flow 2 | camera 1 | vfx 1

## Focus (2-3 gaps this iteration)
- none yet (setup audit only)

## Last verdicts (one line per gap, verbatim critic header)
- none yet

## Ranked open gaps (max 8, attempts count in brackets)
1. [camera] Battle camera never leaves the placement view; on Countdown->Simulation swoop to a preset at ~1.2 unit heights, ~6 body lengths behind the front line, so units fill the lower two thirds [attempts: 0] — ref: tabs_screenshot_06 — ours: big_melee_5s.png
2. [ui-flow] Hide per-unit health bars in all modes (placement, battle, gallery) [attempts: 0] — ref: tabs_screenshot_06 — ours: closeup_pair_zeus_thor.png
3. [battle-feel] Melee resolves into a single-file column with a body gap between units; cut crowd separation radius and widen target engagement spread so lines compress two deep across a wide front [attempts: 0] — ref: tabs_screenshot_06 — ours: big_melee_5s.png
4. [maps-light] Arena has no visible edge; add a faceted island rim and a tree ring around the field and remove the grey mountain wall [attempts: 0] — ref: gameplay_sheet_01 r1c3 — ours: hud_placement.png
5. [vfx] Cannon shot has no muzzle smoke puff or visible ball; spawn a fat white smoke sphere cluster at the barrel and a black ball mesh on fire [attempts: 0] — ref: gameplay_sheet_05 r1c3 — ours: war_machines_4000ms.png
6. [ui-flow] Result overlay is a centered modal paragraph; replace with full-width dark top and bottom bands (winner text top, continue prompt bottom) and no dim over the scene [attempts: 0] — ref: gameplay_sheet_02 r1c2 — ours: big_melee_result.png
7. [unit-look] Team skin is pale and desaturated; raise team color saturation on skin to deep red / strong blue and tint gear with the same team color [attempts: 0] — ref: tabs_screenshot_06 — ours: lineup_medieval.png
8. [ui-flow] Unit tray is a text-chip bar with search and 14 tabs; render units as icon tiles in a centered arc with names below, move budget text to bottom-left [attempts: 0] — ref: gameplay_sheet_03 r3c2 — ours: hud_placement.png

## Rejected attempts (last 5, newest first; `rejected-kept` when the revert conflicted)
- none yet

## Notes for next iteration (max 5 lines)
- Seed audit evidence lives in output/loop/iter-0/. Regression set was 11/11 green at setup.
- Gap 1 (camera) and gap 2 (health bars) are the cheapest wins and touch different files; a good first pair.
- Keep gameplay scenario assertions green: battle-feel changes (gap 3) must keep crowd_topple_* and battlefeel_* passing.
