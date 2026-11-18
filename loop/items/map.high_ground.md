# map.high_ground
Status: open   Audited: 587 (AUDIT x2)   Done: -
## Verdicts
a FAIL (590: struck 4): 5. Dark teal band across the upper sky in map_high_ground_ground — TABS: light sky blue fading into pale haze (ref: wiki/high_ground.png)
b FAIL (590: struck 3): 2. Placement only on the flat ground in map_high_ground_battle — TABS: catapults stand on the wall tops and archers on the bar (ref: wiki/high_ground.png)
c PASS (590 judge)

## Ranked gaps
1. [S] b wall tops — blocker 2: wall tops and bar as drawn-height plateaus in the team-1 zone reached by the ramps, colliders on their outer faces and along the ramp sides; the battle shot must place units there (check capture-world's battle army first) — ref: wiki/high_ground.png — ours: map_high_ground_battle.png
2. [S] a zenith — blocker 5 (kit paleSky out of image processing; see map.hill)

## Attempts (iter | gap | criterion | verdict)
590 | [S] wall ramps |z| 8..17, x 48 -> 36 rising 7 m (highGroundHeight) b1715d8e | b3 | APPROVE, struck b3
590 | [S] kit cloud banks bbb9869d | a4 | APPROVE, struck a4
589 | [S] flat, ramp, 12 m platform (high_ground.ts) 41f10807 | b1 | APPROVE, struck b1, a1, a3
589 | [S] gate walls + bar 2177a9ad | a2 | APPROVE, struck a2

## Rejected (last 4)

## Notes (max 3 lines)
- Builder tabs/high_ground.ts on simKit: sheet x -60..48 |z|<=22, flat to -24, ramp to 12 m at x 10; gate walls x 28..36 |z| 5..20 top +7, bar |z|<=5 from +4.5; wall ramps x 36..48 |z| 8..17. Stage: simulation.catapult_castle (9 catapults x 20, |z|<=16).
- Critic 589: gateway sits 18 m back (TABS at the ramp's head), bar flush with the walls (TABS taller). Critic 590: ramp sides have no colliders.
