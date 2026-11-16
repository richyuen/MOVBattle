# map.medieval_2
Status: open   Audited: 562 (AUDIT x2)   Done: -
## Verdicts
a FAIL (566: struck 1): 2. Ring trees in map_medieval_2_ground are pale white-green lollipop trees — TABS: dark-green lumpy oaks with twisted trunks, clustered at the castle and the corners (ref: reference/maps/wiki/medieval_2.png) 3. Island underside in map_medieval_2_island is a navy slab with black stalactites — TABS: rounded grey-brown earthen underside (ref: reference/maps/meadow_medieval_2.png) 4. Ruined red-roof houses absent in map_medieval_2_top — TABS: collapsed red-roof cottages and a fallen tower at the front-right corner (ref: reference/maps/wiki/medieval_2.png) 5. Grass in map_medieval_2_ground is dark olive-brown — TABS: bright yellow-green meadow (ref: reference/maps/wiki/medieval_2.png)
b FAIL (565: struck 1, 2, 3): 4. Team zones in map_medieval_2_top are four pads around the pools — TABS: two halves facing across open meadow (ref: reference/stages/challenge.twin_lords.png)
c PASS (566 judge)

## Ranked gaps
1. [S] a — blocker 2: twisted oaks clustered around the castle and corners — ref: wiki/medieval_2.png — ours: map_medieval_2_ground.png
2. [S] b — blocker 4: one placementZone per team (merge each side's two pads into one half, clear of the pond z <= -30); keep stage spots (x 28..37, z -26..-6) inside
3. [S] a — blocker 5: bright yellow-green meadow (grass/groundMat/blades recoloured)

## Attempts (iter | gap | criterion | verdict)
565 | [S] own builder; lagoons + plank out, one front pond (-6, -39) with 3 water circles, pink path network to the gate; pond ground cleared (61b2ec07+4e086afe) | b1 | APPROVE struck 1, 2, 3
566 | [S] crenellated castle facade, ivy and arched gate (373e0c1c+c3ddcf73) | a1 | APPROVE struck a1

## Rejected (last 4)
## Notes (max 3 lines)
- Stages on it: challenge.knights_and_priests, challenge.twin_lords, fantasy_evil.storm_the_fortress. Base is campaign.adventure (regression scenarios): never edit it.
- The front haze crown band (hazeTreeline, both bands) is hidden by the pond clear.
