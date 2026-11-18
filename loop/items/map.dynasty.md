# map.dynasty
Status: open   Audited: 576 (AUDIT x2), 588 (CONFIRM: passed none; failed a, b)   Done: -
## Verdicts
a FAIL plateau (596; 0 since 588, CONFIRM list): 1. Field grass colour in map_dynasty_ground.png — TABS: soft, pale pastel green with a light texture, not saturated pure green (ref: reference/stages/dynasty.art_of_war.png, reference/maps/wiki/dynasty.png) 2. Cobblestone path loop around the field in map_dynasty_top.png — TABS: a wide grey cobblestone path runs around the whole field just inside the tree ring (ref: reference/maps/wiki/dynasty.png) 3. Blossom hedges inside the field in map_dynasty_ground.png — TABS: pink/lilac blossom shrubs line the inner terrace walls and flank the stairs (ref: reference/stages/wild_west.shogun_s_samurai.png) 4. Island underside in map_dynasty_island.png — TABS: lumpy grey-blue boulder cliffs with green moss patches, not a smooth saturated-blue column prism (ref: reference/maps/dynasty.png) 5. Cherry trees of the ring in map_dynasty_island.png — TABS: large lilac-pink clustered canopies on tall, twisted brown trunks, standing apart, not dense rows of small white-pink puffs on short sticks (ref: reference/maps/dynasty.png) 6. Pagoda body in map_dynasty_island.png — TABS: an open frame of pink-red columns under dark curved roofs, on a stone platform with wooden stairs, not white walls on a white plinth (ref: reference/maps/dynasty.png)
b PASS (595: struck 2; CONFIRM pending)
c PASS (596 judge)

## Ranked gaps
1. [R] a (plateau, next [R] slot): one rebuild aimed at the whole list — pale pastel lawn, pagoda as an open red-column frame, blossom shrub rows on the terrace walls, cherries pale (.9,.72,.88) every 4th tree, moss on the cliff faces. Spec at the head of the rewritten pieces.

## Attempts (iter | gap | criterion | verdict)
596 | [S] cherry grove: every 3rd ring tree a big twisted cherry 2fb7605e | a5 | APPROVE, no strike (canopy/trunk clause cleared; standing apart and hue stand) (attempt 1)
596 | [S] boulder cliff courses with moss replace column prisms 534e1920 | a4 | APPROVE, no strike (prism clause cleared; moss not visible) (attempt 1)
595 | [S] two front canal outlets, waterfalls, arched bridges, cliff gaps 65195d10 | b2 | APPROVE, struck b2 (b PASS)
594 | [S] pagoda re-sited (0,19), stair to the court, side bridges 4612ee6b | b1 | APPROVE, struck b1
592-593 | [S] 5 m cobble loop 66229760; loop clear 0097f9bc | a2 | APPROVE, no strike x2 (a2 attempts 2)
576-588 | [S] 14 approved (pagoda .. L pools), 582 rejected-kept | a, b | struck a1-a6, b1-b6 (old lists); CONFIRM 588 failed a, b

## Rejected (last 4)
582 | [S] b3 5b6181bc | rejected-kept (revert conflict)

## Notes (max 3 lines)
- Stages: dynasty.samurai, art_of_war, renaissance_vs_dynasty_3, wild_west.shogun_s_samurai. OUTLETS x -34, 17. cherryGrove runs last in buildDynasty; columnCliffs is now boulder courses.
- a plateau 596: approved [S] with no strike 592, 593, 596, 596. A 2nd CONFIRM fail on b makes b plateau.
- Critic 596: crowns read violet, a closed wall; cliff band even and flat-bottomed, moss under the lawn lip.
