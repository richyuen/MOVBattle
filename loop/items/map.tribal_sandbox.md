# map.tribal_sandbox
Status: open   Audited: 555 (AUDIT x2), 566 (camera re-AUDIT x2), 567 (CONFIRM: failed a; passed b)   Done: -
## Verdicts
a FAIL (0 since 567): 1. Dark, chunky angular crowns form a low band across map_tribal_sandbox_ground.png — TABS: rounded faceted crowns in pumpkin orange, warm red and pale yellow form a high, varied canopy on slender pale trunks (ref: reference/maps/autumn_tribal_sandbox.png). 2. Three large blocks with broad, horizontal polygon caps dominate the near rim in map_tribal_sandbox_top.png — TABS: slanted, fractured grey-brown crags with smaller leaning slabs ranged around each mass (ref: reference/maps/wiki/tribal_sandbox.png). 3. Tall narrow spires rise beyond the back rim in map_tribal_sandbox_island.png — TABS: the distant silhouette is made up of low rim outcrops topped by groves against open teal sky (ref: reference/maps/autumn_tribal_sandbox.png).
b PASS (567 CONFIRM)
c PASS (567 judge)

## Ranked gaps
1. [S] a — blocker 1: round and spread light autumn crowns vertically, with visible pale trunks — ref: autumn_tribal_sandbox.png — ours: map_tribal_sandbox_ground.png
2. [S] a — blocker 2: fracture the three near-rim mesas and lean their caps — ref: wiki/tribal_sandbox.png — ours: map_tribal_sandbox_top.png
3. [S] a — blocker 3: replace spires with a low distant outcrop skyline — ref: autumn_tribal_sandbox.png — ours: map_tribal_sandbox_island.png

## Attempts (iter | gap | criterion | verdict)
555-559 | a: pillar/outcrop/heap, rim cliffs, birch ring, open sky + spires; field walls, boulders | a, b | 6 APPROVE, struck a1-a4, a6, b4
558-559 | [S]+[P] horseshoe boulder nooks, then 10 m inward (5e406f86, 1f72d189) | b2 | 2 APPROVE (stands)
561-562 | [S]+[P] red shrubs, then x2.5; rim mesas (6142c5b2, 61d4fb96, 22bf0f3a) | a5, b3 | 3 APPROVE struck a5, b3
563 | [S] nooks rebuilt as stacked flat-topped cliff blocks, birches on their tops (74f9cb20) | b2 | APPROVE struck 2
566 | [S] expand island, placement and collision footprint 1.45x (49d2750c) | b1 | APPROVE struck b1
567 | [S] staggered back rim cliffs (db48feef) | b2 | APPROVE struck b2; b PASS and confirmed
567 | [S] fractured rock nooks with boulders and slabs (03d00d50) | a1 | APPROVE struck a1
567 | [S] crowns at several heights along the shelves (96d8ba1d) | a2 | APPROVE struck a2; a PASS in review, then CONFIRM failed a

## Rejected (last 4)

## Notes (max 3 lines)
- No stages fought on it. World geometry, obstacles and placement expand 1.45x in the ground plane.
- Re-audit reopened a for the stone stacks and sparse crowns and identified the regular back wall as b2.
CONFIRM passed b; the low dark crowns, flat near-rim mesa caps, and distant spires reopened a.
