# map.medieval_2
Status: open   Audited: 562 (AUDIT x2), 569 (CONFIRM: passed none; failed a, b)   Done: -
## Verdicts
a FAIL (0 since 569): 1. A broad straight curtain wall dominates map_medieval_2_island.png — TABS: a tall spired keep rises above rounded crenellated wall sections (ref: reference/maps/meadow_medieval_2.png). 2. A dark detached mountain shelf spans the sky behind the keep in map_medieval_2_top.png — TABS: open pale cyan sky frames the island (ref: reference/maps/meadow_medieval_2.png). 3. Isolated angular crowns leave most of the castle base bare in map_medieval_2_island.png — TABS: dense layered oaks crowd the foot of the wall (ref: reference/maps/wiki/medieval_2.png). 4. Sparse dark tufts stand apart over the meadow in map_medieval_2_ground.png — TABS: dense low grass forms soft swathes around the paths (ref: reference/maps/wiki/medieval_2.png).
b FAIL (0 since 569): 1. A continuous lawn strip encloses the pond at the front of map_medieval_2_island.png — TABS: shallow water fills the front shelf to the draping island lip (ref: reference/maps/meadow_medieval_2.png).
c PASS (569 judge)

## Ranked gaps
1. [S] b — blocker 1: extend the shallow pond shelf to the front edge — ref: reference/maps/meadow_medieval_2.png — ours: map_medieval_2_island.png
2. [S] a — blocker 2: remove the detached mountain shelf behind the castle — ref: reference/maps/meadow_medieval_2.png — ours: map_medieval_2_top.png
3. [S] a — blocker 1: shape the castle into rounded walls with a higher spired keep — ref: reference/maps/meadow_medieval_2.png — ours: map_medieval_2_island.png

## Attempts (iter | gap | criterion | verdict)
565 | [S] own builder; lagoons + plank out, one front pond (-6, -39) with 3 water circles, pink path network to the gate; pond ground cleared (61b2ec07+4e086afe) | b1 | APPROVE struck 1, 2, 3
566 | [S] crenellated castle facade, ivy and arched gate (373e0c1c+c3ddcf73) | a1 | APPROVE struck a1
567 | [S] twisted oaks around the castle and corners (b64c0a48) | a2 | APPROVE struck a2
568 | [S] collapsed red-roof cottages and fallen tower (6d892fbe) | a4 | APPROVE, struck a4
569 | [S] rounded earthen bowl (489d2940) | a3 | APPROVE, struck a3
569 | [S] opposing deployment halves (41c29446) | b4 | APPROVE, struck b4
569 | [S] green meadow with low grass (8c56cdf8) | a5 | APPROVE, struck a5

## Rejected (last 4)

## Notes (max 3 lines)
- Stages on it: challenge.knights_and_priests, challenge.twin_lords, fantasy_evil.storm_the_fortress. Base is campaign.adventure (regression scenarios): never edit it.
- The front haze crown band (hazeTreeline, both bands) is hidden by the pond clear.
