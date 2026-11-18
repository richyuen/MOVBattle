# map.dynasty
Status: open   Audited: 576 (AUDIT x2), 588 (CONFIRM: passed none; failed a, b)   Done: -
## Verdicts
a FAIL (0 since 588, CONFIRM list): 1. Field grass colour in map_dynasty_ground.png — TABS: soft, pale pastel green with a light texture, not saturated pure green (ref: reference/stages/dynasty.art_of_war.png, reference/maps/wiki/dynasty.png) 2. Cobblestone path loop around the field in map_dynasty_top.png — TABS: a wide grey cobblestone path runs around the whole field just inside the tree ring (ref: reference/maps/wiki/dynasty.png) 3. Blossom hedges inside the field in map_dynasty_ground.png — TABS: pink/lilac blossom shrubs line the inner terrace walls and flank the stairs (ref: reference/stages/wild_west.shogun_s_samurai.png) 4. Island underside in map_dynasty_island.png — TABS: lumpy grey-blue boulder cliffs with green moss patches, not a smooth saturated-blue column prism (ref: reference/maps/dynasty.png) 5. Cherry trees of the ring in map_dynasty_island.png — TABS: large lilac-pink clustered canopies on tall, twisted brown trunks, standing apart, not dense rows of small white-pink puffs on short sticks (ref: reference/maps/dynasty.png) 6. Pagoda body in map_dynasty_island.png — TABS: an open frame of pink-red columns under dark curved roofs, on a stone platform with wooden stairs, not white walls on a white plinth (ref: reference/maps/dynasty.png)
b FAIL (0 since 588, CONFIRM list; critic 588 struck b3): 1. Pagoda position in map_dynasty_top.png — TABS: the pagoda stands over the north canal close behind the centre courtyard, with arched bridges on both sides and stairs down toward the pit; ours sits on the rim grass outside the canal system (ref: reference/maps/wiki/dynasty.png) 2. Canal outlets at the island edge in map_dynasty_island.png — TABS: canals run off the island edge as waterfalls under arched stone bridges at the front, which notches the outline (ref: reference/maps/dynasty.png front-left, reference/maps/wiki/dynasty.png bottom-left and bottom-centre bridges)
c PASS (592 judge)

## Ranked gaps
1. [S] a loop clear — blocker 2 (attempt 2): prune or move every ring tree whose trunk lies within 3 m of the cobble ribbon's centre line — ref: wiki/dynasty.png — ours: map_dynasty_top.png
2. [S] b pagoda re-sited — blocker 1: over the north canal behind the court, arched bridges either side — ref: wiki/dynasty.png — ours: map_dynasty_top.png

## Attempts (iter | gap | criterion | verdict)
592 | [S] perimeter loop as 5 m rounded pale cobble ribbon (route x .88) 66229760 | a2 | APPROVE, no strike (trees stand on it at the sides) (attempt 1)
588 | [S] L pools 334b790d | b3 | APPROVE, struck b3; CONFIRM failed a, b
576-583 | [S] 13 approved (pagoda .. spurs), 582 branches rejected-kept | a, b | struck a1-a6, b1, b2, b4-b6

## Rejected (last 4)
582 | [S] b3 5b6181bc | rejected-kept (revert conflict)

## Notes (max 3 lines)
- Stages: dynasty.samurai, art_of_war, renaissance_vs_dynasty_3, wild_west.shogun_s_samurai. A 2nd CONFIRM fail makes a criterion plateau.
- Critic 588: the right arched court bridge lands on a dry pool block (canalPools).
