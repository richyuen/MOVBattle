# map.defend_the_castle
Status: open   Audited: 587 (AUDIT x2)   Done: -
## Verdicts
a FAIL (0 since 587): 1. No castle in map_defend_the_castle_island — TABS: a big grid-lined castle block with a walled courtyard, an inner stair and crenellated parapets (ref: reference/maps/wiki/defend_the_castle.png) 2. No archer poles in map_defend_the_castle_ground — TABS: two tall square pillars before the castle gate (ref: wiki/defend_the_castle.png, stages/simulation.siege.thumb.png) 3. No grid lines in map_defend_the_castle_ground — TABS: grid on every face (ref: wiki/defend_the_castle.png) 4. Grey sky band in map_defend_the_castle_island — TABS: pale cyan haze (ref: wiki/defend_the_castle.png)
b FAIL (0 since 587): 1. Flat empty team-1 half in map_defend_the_castle_top — TABS: the castle fills the defenders' end (ref: stages/simulation.siege.png) 2. No ramps in map_defend_the_castle_top — TABS: three ramps or paths climb from the attackers' ground to the castle forecourt (ref: card Overview, wiki/defend_the_castle.png) 3. Single flat attacker ground in map_defend_the_castle_battle — TABS: separate lower platforms divided by deep gaps (ref: wiki/defend_the_castle.png foreground) 4. No raised forecourt in map_defend_the_castle_top — TABS: an elevated square before the gate where the poles stand (ref: stages/legacy.siege.png)
c PASS (587 judge)

## Ranked gaps
1. [S] b castle builder — blocker 1: new web/src/map/tabs/defend_the_castle.ts: grid castle block with a walled courtyard at the team-1 end — ref: reference/maps/wiki/defend_the_castle.png — ours: map_defend_the_castle_top.png
2. [S] b forecourt, pillars and ramps — blockers 2, 4: raised forecourt with two square pillars, three ramps from the attackers' platforms — ref: wiki/defend_the_castle.png — ours: map_defend_the_castle_top.png
3. [S] a grid and sky — blockers 3, 4: simulation.ts's grid floor and pale sky — ref: wiki/defend_the_castle.png — ours: map_defend_the_castle_ground.png

## Attempts (iter | gap | criterion | verdict)

## Rejected (last 4)

## Notes (max 3 lines)
- Renders the bare campaign.simulation plane (no builder). Stages: simulation.siege, legacy.siege (its .thumb.png shows a Legacy field: judge from .png).
