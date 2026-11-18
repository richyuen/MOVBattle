# map.dynasty
Status: open   Audited: 576 (AUDIT x2)   Done: -
## Verdicts
a PASS (582: struck 3; CONFIRM pending)
b FAIL (583: struck 5): 3. canal network in map_dynasty_top — TABS: canals cut the field into raised lawn terraces joined by stairs, not two straight grey bands (ref: reference/maps/wiki/dynasty.png)
c PASS (583 judge)

## Ranked gaps
1. [S] b long canal sheets — blocker 3: break each long sheet with dry lawn/stone blocks so four L-shaped pools remain (one per quadrant, each joined to its spur), hazards split to match — ref: reference/maps/wiki/dynasty.png — ours: map_dynasty_top.png

## Attempts (iter | gap | criterion | verdict)
583 | [S] canal spurs 4f1cb063 | b3 | APPROVE, no strike (attempts 2 on b3)
583 | [S] terrace stairs, outer lawns 2.4 m bf9994ed | b5 | APPROVE, struck b5
582 | [S] column cliffs 229f9b4d | a3 | APPROVE, struck a3
582 | [S] terrace branches 5b6181bc | b3 | rejected-kept (attempt 1); revert conflicted
582 | [S] perimeter loop 0c7d7a4e | b4 | APPROVE, struck b4
581 | [S] lawn terraces 9a58d04e; court approaches 63de26e1 | a4, b2 | 2 APPROVE, struck a4, b2, a6
576-579 | [S] pagoda, sky, island, courtyard, canals, torii | a, b | 6 APPROVE, struck a1, a2, a5, b1, b6

## Rejected (last 4)
582 | [S] b3 5b6181bc | attempts 1 | side channels hidden by continuous lawn; outer flights read as low slabs; rejected-kept after revert conflict

## Notes (max 3 lines)
- Stages: dynasty.samurai, art_of_war, renaissance.renaissance_vs_dynasty_3, wild_west.shogun_s_samurai (x30..34.9, |z|<=6.6).
- b3 has 2 [S] attempts: not pickable until starvation (588) or plateau. Spurs at x 34/-17 (back), -34/17 (front), |z| 17.6..27.
- 583 early CONFIRM unused (b still FAIL) but would fail a too: deep green lawns (TABS pastel mint), no cobble paths on lawns, small pagoda at the far edge (TABS large, beside the court), near-white blossom, thin blue prism cliffs. Report: output/loop/iter-583/confirm.md.
