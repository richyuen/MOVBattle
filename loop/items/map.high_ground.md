# map.high_ground
Status: open   Audited: 587 (AUDIT x2), 592 (CONFIRM: passed b; failed a), 593 (CONFIRM: passed a, b)   Done: -
## Verdicts
a PASS (593: struck 1; CONFIRM 593)
b FAIL (593: struck b2 clause "catapults stand on the wall tops"; CONFIRM 592/593 passed b, critic fails it): 2. Placement only on the flat ground in map_high_ground_placed — TABS: archers on the bar (ref: wiki/high_ground.png)
c PASS (593 judge)

## Ranked gaps
1. [S] b bar placement — blocker 2: standable gate-block top (height field over x 27..37 |z|<5.5 only where units are placed; gate stays walkable below) with a team-1 zone over it and the right wall — ref: wiki/high_ground.png — ours: map_high_ground_placed.png. b2 has 2 attempts: starvation pick or [R] only.

## Attempts (iter | gap | criterion | verdict)
593 | [S] gate bar raised into an 11.5 m gate block with crown 738ad5c3; evidence placed shot 5848b4ac | a1, b2 | APPROVE, struck a1 (a PASS), b2 wall-top clause; CONFIRM passed a, b
592 | [S] team-1 wall zones x 28..48 over both walls and ramps 60051560 | b2 | APPROVE, no strike (attempt 2); CONFIRM failed a, passed b
591 | [S] wall tops standable 7abd9cdd; evidence pose 336cbba3 | b2 | APPROVE, no strike (attempt 1)
589-591 | [S] flat/ramp/platform, gate walls + bar, wall ramps, clouds, kit sky | b1, b3, a1-a5 | APPROVE, struck all

## Rejected (last 4)

## Notes (max 3 lines)
- Builder tabs/high_ground.ts: sheet step 1 m, x -60..48 |z|<=22; gate walls x 28..36 |z| 5..20 top 19 m (standable); gate block x 27..37 |z|<=5.5 from 16.5 to 23.5 m (drawn only); wall ramps x 36..48. Zones: right wall, left wall, then x>1. Stage: simulation.catapult_castle.
- A standable bar top needs a single-valued height field: units under the gate would be drawn on the roof. The placed shot (0 s) is the b2 shot.
- Critic 593: the placed army stands on one wall only; the stage's catapults stand on the flat before the wall.
