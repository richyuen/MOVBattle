# map.ancient_1
Status: open   Audited: 562 (AUDIT x2), 572 (CONFIRM: passed none; failed a, b)   Done: -
## Verdicts
a FAIL (0 since 572): 1. beige-khaki sky and haze in map_ancient_1_island — TABS: pale clear blue sky with white clouds (ref: reference/maps/greek_ancient_1.png) 2. pale lavender-blue tinted street ground in map_ancient_1_top — TABS: mid-grey paving split by white flagstone lines (ref: reference/maps/wiki/ancient_1.png) 3. town drawn as one fused white slab with domes on top in map_ancient_1_top — TABS: separate whitewashed houses with flat roofs, stairs and blue doors/shutters (ref: reference/maps/wiki/ancient_1.png) 4. thin blue rail edging the field in map_ancient_1_island — TABS: low white parapet wall with blue tile coping (ref: reference/maps/wiki/ancient_1.png) 5. lone grass tufts at the field corners in map_ancient_1_top — TABS: cypress clusters in raised white planters along the wall (ref: reference/maps/wiki/ancient_1.png) 6. bare streets and rooftops in map_ancient_1_ground — TABS: pots, barrels, pink-blossom and olive shrubs dressing roofs and lanes (ref: reference/maps/wiki/ancient_1.png)
b FAIL (0 since 572): 1. building block confined to the centre third with wide empty plazas on both ends in map_ancient_1_top — TABS: houses fill the length of the rectangle in long rows (ref: reference/maps/wiki/ancient_1.png) 2. no narrow lengthwise streets between the building rows in map_ancient_1_top — TABS: two 3-4-unit-wide streets link the left and right halves (ref: loop/cards/maps/ancient_1.md Overview) 3. low camera sees only rooftops, no street to fight on, in map_ancient_1_battle — TABS: armies stand on grey paved streets between house fronts (ref: reference/stages/dynasty.zeus_and_other_folks.png) 4. harbour water only a small pond on a detached rock slab behind the field in map_ancient_1_top — TABS: blue bay cutting into one corner of the island beside the statue headland (ref: reference/maps/wiki/ancient_1.png) 5. rooftop stairs barely visible as one thin ladder in map_ancient_1_top — TABS: broad stair flights up the building sides onto the roofs (ref: reference/stages/introduction.basic_formation.png)
c PASS (572 judge)

## Ranked gaps
1. [S] a — sky — blocker 1: clear pale blue sky and fog, clouds kept — ref: reference/maps/greek_ancient_1.png — ours: map_ancient_1_island.png
2. [S] b — houses fill the length — blocker 1: bands toward the side walls, zones (x >= 29) clear — ref: reference/maps/wiki/ancient_1.png — ours: map_ancient_1_top.png

## Attempts (iter | gap | criterion | verdict)
566-571 | [S] slab, streets, arch, domed houses, wall, planters, bay, statue | a, b | 5 APPROVE
572 | [S] lighthouse (b49c9e06); streets (86b2096b); pebbled underside (650af264) | a, b | 3 APPROVE struck a6, b2, a4; CONFIRM failed a, b
## Rejected (last 4)

## Notes (max 3 lines)
- Stages: introduction.basic_formation, adventure.final_destination_wheelbarrow, dynasty.zeus_and_other_folks, fantasy_evil.blasted_skirmish (enemies x >= 29).
- Evidence first: the battle camera sits over middle-band roofs since 572 (b3): re-aim it onto a street or plaza.
