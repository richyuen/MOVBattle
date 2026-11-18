# map.spooky_2
Status: open   Audited: 576 (AUDIT x2)   Done: -
## Verdicts
a FAIL (579: struck 1, 2): 3. thorn thickets in map_spooky_2_top — TABS: giant dark thorn masses blocking the left and right paths (ref: card Overview; reference/maps/wiki/spooky_2.png) 4. pumpkin shrine in map_spooky_2_top — TABS: a large jack-o-lantern on a dead-tree mound where the pagoda stood (ref: reference/maps/wiki/spooky_2.png) 5. leafy round trees in map_spooky_2_ground — TABS: black leafless twisted trees only (ref: card Overview) 6. island sides in map_spooky_2_island — TABS: blue rock-column cliffs, not a stalactite slab (ref: reference/maps/spooky_2.png) 7. Torii gate in map_spooky_2_top — TABS: a dark torii at the left corner; ours has none (ref: reference/maps/wiki/spooky_2.png)
b FAIL (584: struck 3): 1. dynasty terrace layout in map_spooky_2_top — TABS: Dynasty's square island rotated 180 degrees, with canals turned to fog, terraces and outer loop path (ref: card Overview; reference/maps/wiki/spooky_2.png) 2. arched bridges in map_spooky_2_top — TABS: big stone arched bridges and a wide central wooden stair cross the fog channels (ref: reference/maps/wiki/spooky_2.png) 4. field outline in map_spooky_2_top — TABS: square with notched corners, not an oval (ref: reference/maps/spooky_2.png)
c PASS (584 judge)

## Ranked gaps
1. [S] a shrine on the wrong edge — blocker 4: re-site pumpkinShrine to the far edge right of centre (about x 12..17, z +38), clear the hedge and ring trees there, thicker arching trunks — ref: reference/maps/wiki/spooky_2.png — ours: map_spooky_2_top.png
2. [S] a pale leafy round trees ring the island — blocker 5: replace every leafy ring tree with a black leafless twisted tree — ref: card Overview — ours: map_spooky_2_ground.png
3. [S] b fog channels are uncrossed strips — blocker 2: stone arched bridges and the wide central wooden stair over both channels — ref: reference/maps/wiki/spooky_2.png — ours: map_spooky_2_top.png

## Attempts (iter | gap | criterion | verdict)
584 | [S] grated court 09c46949, 83d01f33 | b3 | APPROVE, struck b3
584 | [S] pumpkin shrine at (-17,-38) 96f80159 (starvation) | a4 | APPROVE, no strike (attempt 1: near edge, TABS far edge)
579 | [S] night sky d8e18d58; night turf b20691d0 | a | 2 APPROVE, struck a2, a1
579 | [S] grate ca88f7b3 (+2; revert fc6bf11f) | b | dropped after 2 follow-ups, no glow
578 | [S] 43348d28 | b | APPROVE, no strike (fog and loop path; no courtyard or terraces)

## Rejected (last 4)

## Notes (max 3 lines)
- Stages: spooky.war, wild_west.spooky_army, fantasy_good.vicious_terror (candleheads at (7,+-6) on the court's corners: no collider there). Fog channels are drawn only.
- 584: the shrine is on the near-left edge, half behind the hedge; the wiki has it on the far edge right of centre. Court is flat (blocker b1 wants terraces and stairs).
