# map.medieval_2
Status: open   Audited: 562 (AUDIT x2), 569 (CONFIRM: passed none; failed a, b), 572 (CONFIRM: passed b; failed a)   Done: -
## Verdicts
a FAIL (0 since 572; plateau, CONFIRM failed 2x): 1. giant twisting vine/tentacle around the central keep, missing from map_medieval_2_island.png — TABS: a huge brown vine coils up the tallest blue-roofed spire and over the walls (ref: reference/maps/meadow_medieval_2.png) 2. island underside in map_medieval_2_island.png: a smooth pale pink-beige slab — TABS: a faceted grey rock underside below a dark earth band (ref: reference/maps/meadow_medieval_2.png) 3. tree ring along the east and west rims in map_medieval_2_top.png: the side edges are open grass with only a couple of tree clumps — TABS: dense round bushy trees line the whole rim, from the castle down both sides to the pond (ref: reference/maps/meadow_medieval_2.png)
b PASS (570: struck 1; CONFIRM 572)
c PASS (572 judge)

## Ranked gaps
1. [R] a — keep vine, rock underside, side tree ring — blockers 1-3: rebuild the island's dressing from both CONFIRM lists (569, 572): coiling brown vine up the keep, faceted grey rock underside below a dark earth band, dense round oaks down both side rims to the pond — ref: reference/maps/meadow_medieval_2.png — ours: map_medieval_2_island.png, map_medieval_2_top.png

## Attempts (iter | gap | criterion | verdict)
565-569 | [S] own builder, pond, paths, castle facade, oaks, cottages, bowl, halves, meadow | a, b | 7 APPROVE struck a1-a5, b1-b4
570 | [S] front pond to the island lip (4e079a16); open sky behind the castle (4df6e5f8) | b, a | 2 APPROVE, struck b1, a2
571 | [S] drum towers + spired keep (b3ebd6d4); castle-foot oaks (c12b2649); grass swathes (a1735190) | a | 3 APPROVE, struck a1, a4
572 | [S] hedge domes and big domed oaks at the castle foot (afbebfe0) | a | APPROVE, struck a3 (a PASS); CONFIRM failed a

## Rejected (last 4)

## Notes (max 3 lines)
- Stages on it: challenge.knights_and_priests, challenge.twin_lords, fantasy_evil.storm_the_fortress. Base is campaign.adventure (regression scenarios): never edit it.
- CONFIRM 569 also asked for a 3-5 m mound under the castle. Critic 572: thicket oaks one even height, trunks read as a colonnade.
