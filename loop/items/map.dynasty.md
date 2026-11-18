# map.dynasty
Status: open   Audited: 576 (AUDIT x2)   Done: -
## Verdicts
a PASS (582: struck 3; CONFIRM pending)
b FAIL (582: struck 4): 3. canal network in map_dynasty_top — TABS: canals cut the field into raised lawn terraces joined by stairs, not two straight grey bands (ref: reference/maps/wiki/dynasty.png) 5. stair flights between terraces in map_dynasty_battle — TABS: wide stone stairs climb between lawn levels (ref: reference/stages/wild_west.shogun_s_samurai.png)
c PASS (582 judge)

## Ranked gaps
1. [S] b visible canal branches — blocker 3: cut lawn openings around side-channel water and expose stone banks, with dry crossings — ref: reference/maps/wiki/dynasty.png — ours: map_dynasty_top.png
2. [S] b broad terrace stairs — blocker 5: expose wide stepped climbs between inner and outer lawns — ref: reference/stages/wild_west.shogun_s_samurai.png — ours: map_dynasty_battle.png

## Attempts (iter | gap | criterion | verdict)
582 | [S] column cliffs 229f9b4d | a3 | APPROVE, struck a3
582 | [S] terrace branches 5b6181bc | b3 | rejected-kept (attempt 1); revert conflicted with later path; aborted per step 7
582 | [S] perimeter loop 0c7d7a4e | b4 | APPROVE, struck b4
581 | [S] lawn terraces 9a58d04e | a4 | APPROVE, struck a4
581 | [S] four court approaches 63de26e1 | b2 | APPROVE, struck b2 and collateral a6
576 | [S] 83a6bd2f | a | APPROVE, struck a1
577 | [S] b1711009 | a | APPROVE, struck a5
577 | [S] 83c9ca4a | b | APPROVE, struck b1
578 | [S] 61f64ff8, d3dab59a | b | APPROVE, no strike (court/pit cleared; N/S water and stairs missing)
579 | [S] canals d888588d, b326fec0 | a | APPROVE, struck a2
579 | [S] rim torii 6fce1036 | b | APPROVE, struck b6

## Rejected (last 4)
582 | [S] b3 5b6181bc | attempts 1 | side channels hidden by continuous lawn; outer flights read as low slabs; rejected-kept after revert conflict

## Notes (max 3 lines)
- Stages: dynasty.samurai, art_of_war, renaissance.renaissance_vs_dynasty_3, wild_west.shogun_s_samurai (x30..34.9, |z|<=6.6).
- 582: a3/b4 cleared; b3/b5 remain. Early CONFIRM unused: item was not would-be-done.
- 5b6181bc remains under the loop's conflicting-revert rule; cut lawn geometry before another branch attempt.
