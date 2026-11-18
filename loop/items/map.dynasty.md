# map.dynasty
Status: open   Audited: 576 (AUDIT x2), 588 (CONFIRM: passed none; failed a, b)   Done: -
## Verdicts
a FAIL (597 [R]: struck 3, 6; list from 588 CONFIRM): 1. Field grass colour in map_dynasty_ground.png — TABS: soft, pale pastel green with a light texture, not saturated pure green (ref: reference/stages/dynasty.art_of_war.png, reference/maps/wiki/dynasty.png) 2. Cobblestone path loop around the field in map_dynasty_top.png — TABS: a wide grey cobblestone path runs around the whole field just inside the tree ring (ref: reference/maps/wiki/dynasty.png) 4. Island underside in map_dynasty_island.png — TABS: lumpy grey-blue boulder cliffs with green moss patches, not a smooth saturated-blue column prism (ref: reference/maps/dynasty.png) 5. Cherry trees of the ring in map_dynasty_island.png — TABS: large lilac-pink clustered canopies on tall, twisted brown trunks, standing apart, not dense rows of small white-pink puffs on short sticks (ref: reference/maps/dynasty.png)
b PASS (595: struck 2; CONFIRM pending)
c PASS (597 judge)

## Ranked gaps
1. [S] a5 + a2 cherry ring as 8-10 big single trees on the island rim (crowns off the loop), which uncovers the whole cobble loop in _top — ref: dynasty.png — ours: map_dynasty_island.png, _top
2. [S] a1 lawn toward mint (.42,.62,.4) with a light speckle texture (critic sampled ours (118,176,103) vs ref (131,190,142)) — ours: map_dynasty_ground.png
3. [S] a4 cliff stone pale grey-blue toward (.5,.6,.66), lower self-light (597 reads cobalt) — ours: map_dynasty_island.png
4. [P] fallout of 5e04109e: stair-cheek shrub clumps at |z| 5.8 stand in the dynasty stage armies (samurai, art_of_war _army): pull them back against the terrace faces

## Attempts (iter | gap | criterion | verdict)
597 | [R] garden look rebuild 5e04109e (lawn, open pagoda, k%4 cherries, teal cliffs + shoulder moss, shrub rows) | a | APPROVE, struck a3, a6
596 | [S] cherry grove 2fb7605e; boulder cliffs 534e1920 | a5, a4 | APPROVE, no strike (attempt 1 each)
592-595 | [S] cobble loop 66229760, loop clear 0097f9bc (a2 x2); pagoda re-sited 4612ee6b; outlets 65195d10 | a2, b1, b2 | APPROVE; struck b1, b2
576-588 | [S] 14 approved, 582 rejected-kept | a, b | old lists struck; CONFIRM 588 failed a, b

## Rejected (last 4)
582 | [S] b3 5b6181bc | rejected-kept (revert conflict)

## Notes (max 3 lines)
- Stages: dynasty.samurai, art_of_war, renaissance_vs_dynasty_3, wild_west.shogun_s_samurai. OUTLETS x -34, 17. cherryGrove (k%4), blossomShrubs run last; Garden look spec at the file head.
- a plateau cleared by the 597 [R] strikes; attempts on a1, a2 now 2+ (a2 starvation or [R] only).
- Critic 597: front cherry stretch still a wall of crowns; loop hidden at sides/back; cliffs cobalt; lawn flat.
