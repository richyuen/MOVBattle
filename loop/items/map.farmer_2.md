# map.farmer_2
Status: done   Audited: 555 (AUDIT x2), 560 (CONFIRM: passed b; failed a), 561 (CONFIRM: failed a), 563 (CONFIRM: failed a), 564 (CONFIRM: failed a), 565 (CONFIRM: passed a; critic failed a), 566 (CONFIRM: passed a, b)   Done: 566
## Verdicts
a PASS (566: struck 3; CONFIRM 566)
b PASS (560: struck 4; CONFIRM 560)
c PASS (566 judge)

## Ranked gaps


## Attempts (iter | gap | criterion | verdict)
555-559 | a: wheat, sheaves, olive meadow + furrows; b: walls, path, fence, alley | a, b | 11 APPROVE
560-561 | [S] farmhouse + pines, round island, stone walls, earth bowl, olive crowns + lumps | a, b | 5 APPROVE struck a1, a2, a3, a5, b4
563 | [R] khaki meadow, pale wheat, oak wall -> stacked-crown olives + bush clumps (115b231d) | a1-4 | APPROVE struck 1, 2, 4
564 | [R] tree groups of 2-3 with 4-block crowns over bush masses, hedge, 6 cottage-high heaps, warmer taller wheat (8992d360) | a1-3 | APPROVE (critic PASS a); CONFIRM failed a
565 | [R] rim discs -> bush+boulder masses, pale tan cottage, straw-gold wheat on a straw floor, alley strip gone (b84ba5a1) | a1-4 | APPROVE struck 1, 2, 4; CONFIRM passed a
566 | [R] swept wheat, separated warm heads and stems (1e5f5680+e6c89ac4) | a3 | APPROVE struck a3; CONFIRM a, b -> D

## Rejected (last 4)
## Notes (max 3 lines)
- Team 1 armies stand in x 2..41, z -26..18. All three campaign stages passed army and battle checks in 566.
- Wheat stem and head meshes share instance transforms, with separate unlit colours and glow exclusion.
