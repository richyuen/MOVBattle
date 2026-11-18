# map.dynasty
Status: open   Audited: 576 (AUDIT x2), 588 (CONFIRM: passed none; failed a, b)   Done: -
## Verdicts
a FAIL (0 since 588, CONFIRM list): 1. Field grass colour in map_dynasty_ground.png — TABS: soft, pale pastel green with a light texture, not saturated pure green (ref: reference/stages/dynasty.art_of_war.png, reference/maps/wiki/dynasty.png) 2. Cobblestone path loop around the field in map_dynasty_top.png — TABS: a wide grey cobblestone path runs around the whole field just inside the tree ring (ref: reference/maps/wiki/dynasty.png) 3. Blossom hedges inside the field in map_dynasty_ground.png — TABS: pink/lilac blossom shrubs line the inner terrace walls and flank the stairs (ref: reference/stages/wild_west.shogun_s_samurai.png) 4. Island underside in map_dynasty_island.png — TABS: lumpy grey-blue boulder cliffs with green moss patches, not a smooth saturated-blue column prism (ref: reference/maps/dynasty.png) 5. Cherry trees of the ring in map_dynasty_island.png — TABS: large lilac-pink clustered canopies on tall, twisted brown trunks, standing apart, not dense rows of small white-pink puffs on short sticks (ref: reference/maps/dynasty.png) 6. Pagoda body in map_dynasty_island.png — TABS: an open frame of pink-red columns under dark curved roofs, on a stone platform with wooden stairs, not white walls on a white plinth (ref: reference/maps/dynasty.png)
b PASS (595: struck 2; CONFIRM pending)
c PASS (595 judge)

## Ranked gaps
1. [S] a ring trees — blocker 5: fewer, larger lilac canopies on tall twisted brown trunks standing apart — ref: maps/dynasty.png — ours: map_dynasty_island.png
2. [S] a underside — blocker 4: lumpy grey-blue boulder cliffs with moss patches replacing columnCliffs (keep the outlet gaps) — ref: maps/dynasty.png — ours: map_dynasty_island.png
3. [S] a pagoda body — blocker 6: open frame of pink-red columns under dark curved roofs on a grey platform (pagoda() at PAGODA (0,19)) — ref: maps/dynasty.png — ours: map_dynasty_island.png

## Attempts (iter | gap | criterion | verdict)
595 | [S] two front canal outlets, waterfalls, arched bridges, cliff gaps 65195d10 | b2 | APPROVE, struck b2 (b PASS)
594 | [S] pagoda re-sited (0,19) over the north canal, stair to the court, side bridges x +-12.5 4612ee6b | b1 | APPROVE, struck b1
592-593 | [S] 5 m cobble loop 66229760; loop clear 0097f9bc | a2 | APPROVE, no strike x2 (a2 attempts 2)
576-588 | [S] 14 approved (pagoda .. L pools), 582 rejected-kept | a, b | struck a1-a6, b1-b6 (old lists); CONFIRM 588 failed a, b

## Rejected (last 4)
582 | [S] b3 5b6181bc | rejected-kept (revert conflict)

## Notes (max 3 lines)
- Stages: dynasty.samurai, art_of_war, renaissance_vs_dynasty_3, wild_west.shogun_s_samurai. A 2nd CONFIRM fail makes a criterion plateau. OUTLETS x -34, 17 (z -30..-47.6, bridge z -39).
- a: 2 approved [S] in a row, no strike (592, 593); a third makes it plateau. a2 has 2 attempts.
- Critic 595: falls are flat plates, no spray; outlet notch a slot, not a deep bay.
