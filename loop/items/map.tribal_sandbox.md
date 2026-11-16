# map.tribal_sandbox
Status: open   Audited: 555 (AUDIT x2)   Done: -
## Verdicts
a PASS (562: struck 5)
b FAIL (563: struck 2): 1. field size in map_tribal_sandbox_top.png — TABS: a large map, much bigger than Tribal 1/2, with an open centre for large armies; ours is the same small oval as tribal_1 (ref: loop/cards/maps/tribal_sandbox.md Overview; reference/maps/autumn_tribal_sandbox.png)
c PASS (563 judge)
## Ranked gaps
1. [S] b — blocker 1: grow the island rim, field and zones ~1.4-1.5x and move the ring, nooks, mesas and cliffs out with it. Evidence first: the top pose (radius 135, beta 0.72) and island pose (clamped 120) frame about +-70 m, and nav bounds come from the zones; re-aim the poses in an evidence commit before the geometry
## Attempts (iter | gap | criterion | verdict)
555-559 | a: pillar/outcrop/heap, rim cliffs, birch ring, open sky + spires; field walls, boulders | a, b | 6 APPROVE, struck a1-a4, a6, b4
558-559 | [S]+[P] horseshoe boulder nooks, then 10 m inward (5e406f86, 1f72d189) | b2 | 2 APPROVE (stands)
561-562 | [S]+[P] red shrubs, then x2.5; rim mesas (6142c5b2, 61d4fb96, 22bf0f3a) | a5, b3 | 3 APPROVE struck a5, b3
563 | [S] nooks rebuilt as stacked flat-topped cliff blocks, birches on their tops (74f9cb20) | b2 | APPROVE struck 2
## Rejected (last 4)
## Notes (max 3 lines)
- No stages fought on it. Critic 563: birches on the blocks are bare-trunk lollipops; blocks 4.5-7 m are small next to TABS's 10-15 m masses.
- 563 skipped blocker 1: a 1.4x scale puts the rim at ~76 m, past the capture frame (see Ranked gaps).
- a PASS by the critic only: CONFIRM it when the item would be done. Critic 562: mesas are clean hexagonal prisms.
