# map.ancient_1
Status: open   Audited: 562 (AUDIT x2), 572 (CONFIRM: passed none; failed a, b)   Done: -
## Verdicts
a FAIL (574: struck 2, 3): 4. thin blue rail edging the field in map_ancient_1_island — TABS: low white parapet wall with blue tile coping (ref: reference/maps/wiki/ancient_1.png) 5. lone grass tufts at the field corners in map_ancient_1_top — TABS: cypress clusters in raised white planters along the wall (ref: reference/maps/wiki/ancient_1.png) 6. bare streets and rooftops in map_ancient_1_ground — TABS: pots, barrels, pink-blossom and olive shrubs dressing roofs and lanes (ref: reference/maps/wiki/ancient_1.png) 7. dark navy-charcoal paving across map_ancient_1_top — TABS: light-mid grey paving (ref: reference/maps/wiki/ancient_1.png)
b FAIL (574: struck 1, 2, 3, 5): 4. harbour water only a small pond on a detached rock slab behind the field in map_ancient_1_top — TABS: blue bay cutting into one corner of the island beside the statue headland (ref: reference/maps/wiki/ancient_1.png)
c PASS (574 judge)

## Ranked gaps
1. [S] b — harbour bay — blocker 4: cut a blue bay into the back-left corner of the town slab beside the statue headland, inside the island outline (bayHeadland) — ref: reference/maps/wiki/ancient_1.png — ours: map_ancient_1_top.png
2. [S] a — cypress planters — blocker 5: 3-5 tall cypress cones in raised rectangular white planters along the wall — ref: reference/maps/wiki/ancient_1.png — ours: map_ancient_1_top.png
3. [P] a — paving tone — blocker 7: flagstones pavement diffuse 0.27 -> 0.4 (fallout of e03012d5, 574), shows in map_ancient_1_top and map_ancient_1_battle — ref: reference/maps/wiki/ancient_1.png

## Attempts (iter | gap | criterion | verdict)
566-572 | [S] slab, streets, houses, wall, planters, bay, statue, lighthouse, underside | a, b | 8 APPROVE; CONFIRM 572 failed a, b
573 | [S] clear blue sky and haze (61adfc2c) | a | APPROVE, struck a1
574 | [S] outer house rows along the long walls (536b4f76) | b | APPROVE, struck b1, b3, b5
574 | [S] separate houses, alleys, alley stairs (422bf815) | a | APPROVE, struck a3 and b2
574 | [S] irregular flagstone paving (e03012d5+e3d80f84) | a | APPROVE, struck a2; added a7 (too dark)

## Rejected (last 4)

## Notes (max 3 lines)
- Stages: introduction.basic_formation, adventure.final_destination_wheelbarrow, dynasty.zeus_and_other_folks, fantasy_evil.blasted_skirmish (enemies x 29..40.5, |z| <= 18: houses stay out of |x| >= 25 within |z| < 21).
- Evidence 574 (ae94bb09): battle shot frames the player army's box from an elevated diagonal.
- Critic 574: outer houses plain boxes; domes sit on ordinary roofs (TABS: churches with octagonal drums).
