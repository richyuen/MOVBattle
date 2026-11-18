# map.high_ground
Status: open   Audited: 587 (AUDIT x2)   Done: -
## Verdicts
a PASS (591: struck 5; CONFIRM pending)
b FAIL (590: struck 3): 2. Placement only on the flat ground in map_high_ground_battle — TABS: catapults stand on the wall tops and archers on the bar (ref: wiki/high_ground.png)
c PASS (591 judge)

## Ranked gaps
1. [S] b defenders on walls and bar — blocker 2: bar top (|z|<=5, x 28..36) a plateau at wall height, team-1 zones over both wall tops and the bar filled first by the skirmish; then a battle pose from the ramp foot as wiki high_ground.png — ref: wiki/high_ground.png — ours: map_high_ground_battle.png

## Attempts (iter | gap | criterion | verdict)
591 | [S] wall tops standable (height plateaus, face + ramp-side colliders, right wall-top zone) 7abd9cdd; evidence battle pose 336cbba3 | b2 | APPROVE, no strike (one unit on one wall, edge-on) (attempt 1)
591 | [S] kit sky untoned eadae3e9 (via map.hill) | a5 | APPROVE, struck a5 (a PASS)
590 | [S] wall ramps b1715d8e; kit cloud banks bbb9869d | b3, a4 | APPROVE, struck b3, a4
589 | [S] flat, ramp, 12 m platform 41f10807; gate walls + bar 2177a9ad | b1, a2 | APPROVE, struck b1, a1-a3

## Rejected (last 4)

## Notes (max 3 lines)
- Builder tabs/high_ground.ts: sheet step 1 m, x -60..48 |z|<=22; gate walls x 28..36 |z| 5..20 top 19 m (standable), bar |z|<=5 4.5..7 up; wall ramps x 36..48 |z| 8..17. Zones: team 1 right wall top first, then x>1. Stage: simulation.catapult_castle.
- Battle pose: POSE_OVERRIDE battle target (24,12,8) r 58 alpha pi+.35 beta .95.
