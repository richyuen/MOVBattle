# map.medieval_2
Status: open   Audited: 562 (AUDIT x2), 569 (CONFIRM: passed none; failed a, b)   Done: -
## Verdicts
a FAIL (571: struck 1, 4): 3. Isolated angular crowns leave most of the castle base bare in map_medieval_2_island.png — TABS: dense layered oaks crowd the foot of the wall (ref: reference/maps/wiki/medieval_2.png).
b PASS (570: struck 1; pending CONFIRM)
c PASS (571 judge)

## Ranked gaps
1. [S] a — castle foot — blocker 3: second and third depths of overlapping 1.4-1.8x oak canopies with understorey bushes hiding the wall base (x -46..-16 and 10..44) in castleOaks — ref: reference/maps/wiki/medieval_2.png — ours: map_medieval_2_island.png

## Attempts (iter | gap | criterion | verdict)
565-569 | [S] own builder, pond, paths, castle facade, oaks, cottages, bowl, halves, meadow | a, b | 7 APPROVE struck a1-a5, b1-b4
570 | [S] front pond to the island lip (4e079a16) | b | APPROVE, struck b1
570 | [S] open sky behind the castle (4df6e5f8) | a | APPROVE, struck a2
571 | [S] drum-towered curtain under a spired keep (b3ebd6d4) | a | APPROVE, struck a1
571 | [S] layered broad oaks at the castle foot (c12b2649) | a | APPROVE (blocker 3 stands)
571 | [S] bushy grass swathes with lawn lanes (a1735190) | a | APPROVE, struck a4

## Rejected (last 4)

## Notes (max 3 lines)
- Stages on it: challenge.knights_and_priests, challenge.twin_lords, fantasy_evil.storm_the_fortress. Base is campaign.adventure (regression scenarios): never edit it.
- Early CONFIRM 571 (not counted: item not would-be-done) failed a on: beige flat underside (TABS grey rocky cliff tapering to a point), no vine on the keep, castle on flat field (TABS raised mound), sparse single tree row at the wall; passed b. See output/loop/iter-571/confirm.md.
- Critic 571: castle should sit on a 3-5 m mound; swathe edges too rectangular.
