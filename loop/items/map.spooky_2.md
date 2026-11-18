# map.spooky_2
Status: open   Audited: 576 (AUDIT x2)   Done: -
## Verdicts
a FAIL (579: struck 1, 2): 3. thorn thickets in map_spooky_2_top — TABS: giant dark thorn masses blocking the left and right paths (ref: card Overview; reference/maps/wiki/spooky_2.png) 4. pumpkin shrine in map_spooky_2_top — TABS: a large jack-o-lantern on a dead-tree mound where the pagoda stood (ref: reference/maps/wiki/spooky_2.png) 5. leafy round trees in map_spooky_2_ground — TABS: black leafless twisted trees only (ref: card Overview) 6. island sides in map_spooky_2_island — TABS: blue rock-column cliffs, not a stalactite slab (ref: reference/maps/spooky_2.png) 7. Torii gate in map_spooky_2_top — TABS: a dark torii at the left corner; ours has none (ref: reference/maps/wiki/spooky_2.png)
b FAIL (585: struck 2's stair clause): 1. dynasty terrace layout in map_spooky_2_top — TABS: Dynasty's square island rotated 180 degrees, with canals turned to fog, terraces and outer loop path (ref: card Overview; reference/maps/wiki/spooky_2.png) 2. arched bridges in map_spooky_2_top — TABS: big stone arched bridges (ref: reference/maps/wiki/spooky_2.png) 4. field outline in map_spooky_2_top — TABS: square with notched corners, not an oval (ref: reference/maps/spooky_2.png)
c PASS (585 judge)

## Ranked gaps
1. [S] a leafy round trees — blocker 5: swap the pale round-crowned ring trees for black leafless twisted trees — ref: loop/cards/maps/spooky_2.md Overview — ours: map_spooky_2_ground.png
2. [S] a thorn thickets — blocker 3: giant dark thorn masses blocking the left and right outer paths — ref: reference/maps/wiki/spooky_2.png — ours: map_spooky_2_top.png
3. [S] b arched bridges — blocker 2: stone bridges moved inboard (|x| ~30), 3 m arch, dark underside, stone darker than the fog — ref: reference/maps/wiki/spooky_2.png — ours: map_spooky_2_top.png

## Attempts (iter | gap | criterion | verdict)
585 | [S] shrine re-sited to (14,38) 6ad3b2cd | a4 | APPROVE, no strike (attempts 2 on a4: mound and pumpkins lost in the dark, thin trees)
585 | [S] channel bridges 45cc5ae9 | b2 | APPROVE, stair clause struck (attempt 1)
584 | [S] grated court 09c46949, 83d01f33 | b3 | APPROVE, struck b3
584 | [S] pumpkin shrine at (-17,-38) 96f80159 (starvation) | a4 | APPROVE, no strike (near edge)
579 | [S] night sky d8e18d58; night turf b20691d0 | a | 2 APPROVE, struck a2, a1
579 | [S] grate ca88f7b3 (+2; revert fc6bf11f) | b | dropped after 2 follow-ups, no glow
578 | [S] 43348d28 | b | APPROVE, no strike (fog and loop path; no courtyard or terraces)

## Rejected (last 4)

## Notes (max 3 lines)
- Stages: spooky.war, wild_west.spooky_army, fantasy_good.vicious_terror (candleheads at (7,+-6) on the court's corners: no collider there). Fog channels drawn only; bridge decks carry units via result.height.
- a4 has 2 [S] attempts: next is starvation (590) or plateau. Critic's next for it: a stepped stone dais ringed by candle-lit pumpkins and big multi-limb trees.
- Stone bridges at x +-44 read as pale stubs the colour of the fog.
