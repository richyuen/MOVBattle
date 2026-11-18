# map.hill
Status: open   Audited: 587 (AUDIT x2)   Done: -
## Verdicts
a FAIL (590: struck 3): 4. Dark teal band across the upper sky in map_hill_ground — TABS: light sky blue with white clouds (ref: wiki/hill.png)
b PASS (589: struck 1)
c PASS (590 judge)

## Ranked gaps
1. [S] a zenith — blocker 4: simKit paleSky sphere out of image processing (ACES darkens its blue to teal; it is already unlit and fog-free), kit-wide: also castle a5, high_ground a5, bridge/corridor/low_ground a5 — ref: wiki/hill.png — ours: map_hill_ground.png top third
2. [P] a cloud white (fallout of e8ee5a82, to 593): simKit cloudBanks colours read flat light grey; top white (1,1,1) -> brighter via image-processing exclusion with the sky — ours: map_hill_island.png
3. [S] a slope bands (critic NEXT, not a blocker): brighter 5 m bands across the ramp through a hill-only grid material — ours: map_hill_ground.png

## Attempts (iter | gap | criterion | verdict)
590 | [S] cloud banks z 200-230, y -25..35 (simKit cloudBanks) e8ee5a82 | a3 | APPROVE, struck a3
589 | [E] ground shot re-aimed 00cf09ce + cc5ef659 | a1 | re-audit struck a1
589 | [S] bounded block, void round, zones (hill.ts) 90341a4e | b1 | APPROVE, struck b1 (b PASS)
589 | [S] cloud banks z 450-540 de48f83f | a3 | REJECT, reverted 5093c46c (attempt 1 on a3)
588 | [S] crest ec25b08c; grid ridge + pale sky 1eb72e07 (+cfd5d291) | b2, a1 | APPROVE, struck b2, b3, a2

## Rejected (last 4)
589 | [S] a3 de48f83f | attempts 1 | clouds never rendered (out of the island shot's frame, y 40-80 at z 450-540)

## Notes (max 3 lines)
- Builder tabs/hill.ts: sheet x -60..76 |z|<=28 (foot -24, 10 m at 22, crest to 28, 4 m flat from 40), 400 m skirt, void x -90..100 z +-60; zones x<-1 / x>1. Stage: simulation.hill (x 20..25.9).
- map_hill_ground pose: capture-world.mjs POSE_OVERRIDE (target (12,6,0), radius 64, alpha -2.8, beta 1.4). Clouds: banks [-110,-18,200,170], [60,-12,230,190], [190,-20,210,130].
