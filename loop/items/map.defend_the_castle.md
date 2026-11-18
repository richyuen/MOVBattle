# map.defend_the_castle
Status: done   Audited: 587 (AUDIT x2), 591 (CONFIRM: passed none; failed a, b), 592 (CONFIRM: passed a, b)   Done: 592
## Verdicts
a PASS (592: struck 1; CONFIRM 592)
b PASS (592: struck 1; CONFIRM 592)
c PASS (592 judge)

## Ranked gaps

## Attempts (iter | gap | criterion | verdict)
592 | [S] V chasms: lanes 11 m / front gaps 7 m, V to -40 m, sheet step 1 m 9dcd3891 | b1 | APPROVE, struck b1 (b PASS)
592 | [S] merlons removed, plain stepped wall runs 18/15 m 395d7f38 | a1 | APPROVE, struck a1 (a PASS); CONFIRM passed a, b -> D
591 | [S] front platforms e417622a; kit sky eadae3e9 | b3, a5 | APPROVE, struck b3, a5
589-590 | [S] castle block f2467ab3; archer pillars 57155431; three ramps 5f1ae860 | b1, b2, a2 | APPROVE, struck b1, b2, b4, a1-a3

## Rejected (last 4)

## Notes (max 3 lines)
- Builder tabs/defend_the_castle.ts on simKit: sheet x -60..64 |z|<=30 step 1; V lanes |z| 5..16 and 26..30 on the approach, front gaps |z| 8..15; team-0 zones |z|<=8, 15..26. Stages: simulation.siege, legacy.siege.
- Critic 592: faint dark-blue blobs on the right V wall in stage_simulation.siege_army (check if units); back stair faint from the top.
