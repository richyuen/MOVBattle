# map.high_ground
Status: open   Audited: 587 (AUDIT x2), 592 (CONFIRM: passed b; failed a), 593 (CONFIRM: passed a, b)   Done: -
## Verdicts
a PASS (593: struck 1; CONFIRM 593)
b PASS (598: struck 2; CONFIRM pending: the 593 CONFIRM predates 26e5a09e's bar-top mechanism, so b is re-confirmed fresh)
c PASS (598 judge)

## Ranked gaps
1. Evidence first: re-aim the gate shot (capture-world high_ground block, 598.0): no attacker entered x 27.5..36.5 |z|<4.6 in 40 s; catch a bar archer stepping off the crown's front edge (team 1 crossing x 27.5 at |z|<4.6, early in the battle) instead, then a fresh CONFIRM on b alone (a named confirmed).
2. If that CONFIRM fails b on the pop: [S] highGroundHeight lifts units onto the crown only from bar placement (a per-unit flag), not by position — critic 598 NEXT.

## Attempts (iter | gap | criterion | verdict)
598 | [S] gate block crown standable (units in the opening drawn at 24 m), team-1 bar zone first 26e5a09e | b2 | APPROVE, struck b2 (b PASS) (starvation)
593 | [S] gate bar raised into an 11.5 m gate block with crown 738ad5c3; evidence placed shot 5848b4ac | a1, b2 | APPROVE, struck a1 (a PASS), b2 wall-top clause; CONFIRM passed a, b
592 | [S] team-1 wall zones x 28..48 60051560 | b2 | APPROVE, no strike (attempt 2)
589-591 | [S] flat/ramp/platform, gate walls + bar, wall ramps, wall tops, clouds, kit sky | b1, b3, a1-a5 | APPROVE, struck all

## Rejected (last 4)

## Notes (max 3 lines)
- Builder tabs/high_ground.ts: sheetHeight shapes the mesh; highGroundHeight adds the crown (24 m) over x 27.5..36.5 |z|<4.6 for units. Zones: bar, right wall, left wall, then x>1. Stage: simulation.catapult_castle.
- Critic 598: a unit in the gate opening or stepping off the bar is drawn popping 12 m; the 598 battle shot shows the bar archers already down on the flat.
- 598.0 gate shot: no attacker reached the passage in 40 s (note in summary.json).
