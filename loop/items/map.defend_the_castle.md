# map.defend_the_castle
Status: open   Audited: 587 (AUDIT x2)   Done: -
## Verdicts
a FAIL (589: struck 1, 2, 3, 4): 5. Dark teal band across the upper sky in map_defend_the_castle_ground — TABS: light sky blue fading into pale haze (ref: stages/simulation.pit.png)
b FAIL (590: struck 2): 3. Single flat attacker ground in map_defend_the_castle_battle — TABS: separate lower platforms divided by deep gaps (ref: wiki/defend_the_castle.png foreground)
c PASS (590 judge)

## Ranked gaps
1. [S] b lower platforms — blocker 3: centre chasm lanes (|z| 6..14) extended from x -22 to the front edge x -60 as deep gaps with box colliders (watch c: team-0 zone splits) — ref: wiki/defend_the_castle.png — ours: map_defend_the_castle_battle.png
2. [S] a zenith — blocker 5 (kit paleSky out of image processing; see map.hill)

## Attempts (iter | gap | criterion | verdict)
590 | [S] three 12 m ramps split by 40 m chasms (castleHeight, chasm colliders) 5f1ae860 | b2 | APPROVE, struck b2
589 | [S] castle block, courtyard, gate, terrace, merlons, raised forecourt (defend_the_castle.ts) f2467ab3 | b1 | APPROVE, struck b1, b4, a1, a3
589 | [S] archer pillars (29,+-12) 57155431 | a2 | APPROVE, struck a2 (a4 struck by kit sky 8d4fd3bc)

## Rejected (last 4)

## Notes (max 3 lines)
- Builder tabs/defend_the_castle.ts on simKit: sheet x -60..64 |z|<=30, flat to -22, ramp to 10 m at 14; chasms x -22..14 at |z| 6..14 and 26..30 (-40 m, colliders); castle x 36..64. Stages: simulation.siege, legacy.siege (x 20..31.5, |z|<=22).
- Critic 589: castle walls rise straight from the 10 m floor (TABS: castle on its own raised block); pillars 24 m apart (TABS close, flanking the gate path).
