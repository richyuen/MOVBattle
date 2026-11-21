# wild_west.leading_cacti
Status: open   Audited: 619 (AUDIT x2)   Done: -
## Verdicts
a PASS (620 judge)
b FAIL (0 since 619; list from AUDIT 619): s1. four leading Cacti in stage_wild_west.leading_cacti_army.png (struck 619) | s2. three Miners behind each leader in stage_wild_west.leading_cacti_army.png (struck 619) | 3. the army stands beside perimeter cacti at the town's outer edge in stage_wild_west.leading_cacti_field.png — TABS: the four lanes occupy the open ground before the shopfronts (ref: reference/stages/wild_west.leading_cacti.png).
c PASS (620 judge)
## Ranked gaps
1. [S] b town-street formation — blocker 3: move the four lanes together to open shopfront ground — ref: reference/stages/wild_west.leading_cacti.png — ours: stage_wild_west.leading_cacti_field.png
## Attempts (iter | gap | criterion | verdict)
619 | 2bbbde3d Cactus lane leaders | b1 | APPROVE (struck 1)
619 | 33e6a0ad three-Miner files | b2 | APPROVE (struck 2)
620 | 9dac8173+155eb43f+29d441ac lanes x18..27 before the rim-row shopfronts (stage zone x16.5..28.5,z-29..-15) | b3 | dropped (a Miner still on a street prop after 2 follow-ups)
## Rejected (last 4)
## Notes (max 3 lines)
- 620: street props stand along z -25..-28 at x ~18..28 (checkStage hit z -27.5, -26, then (27,-25)). Read obstacle positions first (game.checkStage moves) and lay the lanes from them in one commit.
- Camera: the army shot sits ~21 m west of the centroid; keep the centroid x >= 22 so it clears the inner-rank building (x -22..-0.6, z -28..-19).
