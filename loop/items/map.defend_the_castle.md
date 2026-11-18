# map.defend_the_castle
Status: open   Audited: 587 (AUDIT x2)   Done: -
## Verdicts
a FAIL (589: struck 1, 2, 3, 4): 5. Dark teal band across the upper sky in map_defend_the_castle_ground — TABS: light sky blue fading into pale haze (ref: stages/simulation.pit.png)
b FAIL (589: struck 1, 4): 2. No ramps in map_defend_the_castle_top — TABS: three ramps or paths climb from the attackers' ground to the castle forecourt (ref: card Overview, wiki/defend_the_castle.png) 3. Single flat attacker ground in map_defend_the_castle_battle — TABS: separate lower platforms divided by deep gaps (ref: wiki/defend_the_castle.png foreground)
c PASS (589 judge)

## Ranked gaps
1. [S] b three approach paths — blocker 2: castleHeight split into three 8 m ramps at z -20, 0, 20 with void gaps between — ref: wiki/defend_the_castle.png — ours: map_defend_the_castle_top.png
2. [S] b split attacker ground — blocker 3: separate lower platforms divided by void gaps (watch the 120 s limit and stuck-in-hazard) — ref: wiki/defend_the_castle.png — ours: map_defend_the_castle_battle.png
3. [P] a sky hue — blocker 5 (kit paleSky blue, see map.bridge)

## Attempts (iter | gap | criterion | verdict)
589 | [S] castle block, courtyard, gate, terrace, merlons, raised forecourt (defend_the_castle.ts) f2467ab3 | b1 | APPROVE, struck b1, b4, a1, a3
589 | [S] archer pillars (29,+-12) 57155431 | a2 | APPROVE, struck a2 (a4 struck by kit sky 8d4fd3bc)

## Rejected (last 4)

## Notes (max 3 lines)
- Builder tabs/defend_the_castle.ts on simKit: sheet x -60..64 |z|<=30, flat to -22, ramp to 10 m at 14; castle x 36..64 (walls top 18, gate |z|<=4, terrace x 54+ top 14). Stages: simulation.siege, legacy.siege (x 20..31.5, |z|<=22).
- Critic 589: castle walls rise straight from the 10 m floor (TABS: castle on its own raised block); pillars 24 m apart (TABS close, flanking the gate path).
