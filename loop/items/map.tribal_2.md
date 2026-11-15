# map.tribal_2
Status: open   Audited: 555 (AUDIT x2)   Done: -
## Verdicts
a FAIL (561: struck 3): 6. stone dog shrine in map_tribal_2_top.png — TABS: a small shrine with two stone dogs where the mountain runs toward the front (ref: loop/cards/maps/tribal_2.md Overview)
b FAIL (559: struck 3): 1. right side of the field in map_tribal_2_top.png — TABS: the mountain takes the right third of the island and pushes the open field to a bowl on the left and centre; ours keeps a symmetric open oval (ref: reference/maps/wiki/tribal_2.png) 2. field outline in map_tribal_2_top.png — TABS: a round island with the field running to the ring at the rim; ours is a rounded-rectangle slab with a bare margin outside the tree oval (ref: reference/maps/wiki/tribal_2.png) 4. no boulder rubble line along the mountain foot in map_tribal_2_top — TABS: loose boulders and stones edge the field below the mountain (ref: reference/maps/wiki/tribal_2.png; reference/stages/spooky.cave.png)
c PASS (561 judge)
## Ranked gaps
1. [S] a — blocker 6: shrine set piece (small stone plinth/gate, two seated stone dogs) at the mountain's front-right foot (keep x >= 41: stages stand at x <= 40)
2. [S] b — blocker 2: round island outline (ellipse 54 x 48; tribal_1's remap kit, own copy) with the field running to the ring
3. [P] b — blocker 4: footRubble x 41.5..44.5 -> ~37.5..40.5 so the line shows on the open sand (fallout of 2a0f2cce) — map_tribal_2_top.png
4. [S] b — blocker 1: mountain mass over the right third — only if the 3 stages' enemy x allow it (they reach x 40; foot is x 45)
## Attempts (iter | gap | criterion | verdict)
555-558 | a: mountain + cave, birch ring, open sky | a | 3 APPROVE, struck 1, 2, 5
556 | [S] field wall stones cleared (6b645833) | b5 | APPROVE struck 5
559 | [S] three orange earth tiers + white flecks (8dfa1e8d) | a4 | APPROVE struck 4
559 | [S] slab rocks, bones, skulls before the cave (688e5790) | b3 | APPROVE struck 3
561 | [S] back-left cliff run of slab blocks + seven front boulder piles, solid (81facedd) | a3 | APPROVE struck 3
561 | [S] boulder rubble line along the mountain foot x 41.5..44.5 (2a0f2cce) | b4 | APPROVE (stands: hidden under the tree band)
## Rejected (last 4)
## Notes (max 3 lines)
- Stages on it: challenge.a_warm_welcome, dynasty.area_of_effect, spooky.cave (team 1 stands at x <= 40).
- Critic 561: back-left cliff reads as separate slabs (TABS a continuous low stepped ledge wall). Critic 559: cave slabs pale lavender-white.
