# wild_west.leading_cacti
Status: open   Audited: 619 (AUDIT x2), 621 (CONFIRM: passed b; failed -)   Done: -
## Verdicts
a PASS (621 judge)
b FAIL (0 since 619; list from AUDIT 619; CONFIRM 621 passed b, critic 621 kept 3): s1. four leading Cacti in stage_wild_west.leading_cacti_army.png (struck 619) | s2. three Miners behind each leader in stage_wild_west.leading_cacti_army.png (struck 619) | 3. the army stands beside perimeter cacti at the town's outer edge in stage_wild_west.leading_cacti_field.png — TABS: the four lanes occupy the open ground before the shopfronts (ref: reference/stages/wild_west.leading_cacti.png).
c PASS (621 judge)
## Ranked gaps
1. [S] b shopfront backdrop — blocker 3: lanes on open ground directly before a facade row that faces the army camera (top-row shopfronts z ~31 facing -z, or the church end), stage zone in main.ts moved with them — ref: reference/stages/wild_west.leading_cacti.png — ours: stage_wild_west.leading_cacti_army.png / _field.png
## Attempts (iter | gap | criterion | verdict)
619 | 2bbbde3d Cactus lane leaders | b1 | APPROVE (struck 1)
619 | 33e6a0ad three-Miner files | b2 | APPROVE (struck 2)
620 | 9dac8173+155eb43f+29d441ac lanes x18..27 before the rim-row shopfronts | b3 | dropped (a Miner on a street prop after 2 follow-ups)
621 | 5d526992 lanes x20.8..29.2, z -22.4..-13.4 (stage zone 24.75,-17.9 11x11) | b3 | APPROVE (no strike: facades beside, not behind, in _army)
## Rejected (last 4)
## Notes (max 3 lines)
- b3 has 2 attempts: not pickable in batch mode (solo mode or starvation). The army camera looks +x from ~21 m west of the centroid, so a backdrop of facades needs the town row east of the army or a camera re-aim.
- Obstacles: a prop near (18,-11.5) and street props z -25..-28 at x 18..28 (checkStage moves). Validate with --check-only on the working tree before committing.
