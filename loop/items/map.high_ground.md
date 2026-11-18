# map.high_ground
Status: open   Audited: 587 (AUDIT x2), 592 (CONFIRM: passed b; failed a)   Done: -
## Verdicts
a FAIL (0 since 592, CONFIRM list): 1. gatehouse silhouette in map_high_ground_ground.png: the wall top runs at one flat height over the gate opening — TABS: the gate is a taller central block (the bar) standing clearly above two lower side walls, with units on top of it (ref: reference/maps/wiki/high_ground.png)
b FAIL (590: struck 3; CONFIRM 592 passed b, critic fails it): 2. Placement only on the flat ground in map_high_ground_battle — TABS: catapults stand on the wall tops and archers on the bar (ref: wiki/high_ground.png)
c PASS (592 judge)

## Ranked gaps
1. [S] a gatehouse — blocker 1: bar raised into a taller central gate block (top above the 7 m walls) over the opening, standable top — ref: wiki/high_ground.png — ours: map_high_ground_ground.png
2. evidence first for b2 (critic 592): map_high_ground_battle is 5 s in, defenders have left the walls; re-aim to a 0 s placement shot. b2 has 2 attempts (591, 592 approved, no strike): starvation pick or [R] only.

## Attempts (iter | gap | criterion | verdict)
592 | [S] team-1 wall zones x 28..48 over both walls and ramps 60051560 | b2 | APPROVE, no strike (3 units on a wall at 5 s) (attempt 2); CONFIRM failed a, passed b
591 | [S] wall tops standable 7abd9cdd; evidence pose 336cbba3 | b2 | APPROVE, no strike (attempt 1)
591 | [S] kit sky untoned eadae3e9 | a5 | APPROVE, struck a5
589-590 | [S] flat/ramp/platform 41f10807; gate walls + bar 2177a9ad; wall ramps b1715d8e; clouds bbb9869d | b1, b3, a1-a4 | APPROVE, struck all

## Rejected (last 4)

## Notes (max 3 lines)
- Builder tabs/high_ground.ts: sheet step 1 m, x -60..48 |z|<=22; gate walls x 28..36 |z| 5..20 top 19 m (standable), bar |z|<=5 4.5..7 up; wall ramps x 36..48. Zones: team 1 right wall (x 28..48 z 5..20) first, left wall, then x>1. Stage: simulation.catapult_castle.
- A standable bar top needs the gate closed (single-valued height field). A 2nd CONFIRM fail on a makes it plateau.
