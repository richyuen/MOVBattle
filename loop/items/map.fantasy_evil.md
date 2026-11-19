# map.fantasy_evil
Status: open   Audited: 587 (AUDIT x2), 599 (CONFIRM: failed a,b), 601 (CONFIRM: failed a,b)   Done: -
## Verdicts
a FAIL (plateau; 0 since601): 1. Broken shrine silhouettes in map_fantasy_evil_island.png — TABS: several towering fractured slab shrines around the perimeter, including the large jagged shrine at the right and the broken left gate, rather than a near-uniform ring of basalt posts dominated by one giant winged figure (ref: reference/maps/wiki/fantasy_evil.png and reference/maps/void_evil.png). 2. Green mushroom clusters in map_fantasy_evil_top.png — TABS: conspicuous groups of pale green mushroom caps on ledges throughout the ruins, rather than predominantly bare ledges with flat neon green channels supplying the green accents (ref: reference/maps/wiki/fantasy_evil.png).
b FAIL (plateau; 0 since601): 1. Interior chasm footprint in map_fantasy_evil_top.png — TABS: large deep open chambers separate the raised routes and expose tall vertical basalt walls, rather than narrow luminous channels surrounding a broad mostly solid central platform (ref: reference/maps/wiki/fantasy_evil.png and reference/maps/void_evil.png).
c PASS (601 judge)
## Ranked gaps
1. [R] a fractured shrine perimeter — blockers1,2: towering broken shrines and conspicuous pale-green fungi on ledges; spec from CONFIRM599+601 — ref: reference/maps/wiki/fantasy_evil.png, reference/maps/void_evil.png — ours: map_fantasy_evil_island.png
2. [R] b chasm/routes — blocker1: deep open chambers, tall walls between raised routes, broad stairs; spec from CONFIRM599+601 — ref: reference/maps/wiki/fantasy_evil.png — ours: map_fantasy_evil_top.png
## Attempts (iter | gap | criterion | verdict)
601 | [S] mushrooms e40ca4f6; islands12ddab5e | a3,b1(old list) | APPROVE,struckboth; a/b PASS -> second CONFIRM faileda,b
600 | shelvesbb5ee8bb/monumentd0fccfc5/floorff505e0b,b79bc009 | b1,a2,a1 | APPROVE,strucka1,a2
599 | spire/chainsf749b1d8 | a6 | APPROVE,strucka6,a5; first CONFIRM faileda,b
597 | crag/chains89b4f29e/4818fb5b | a6 | APPROVE,no strike
596 | statuef4eef72d/990ecde8; [P]da34040c | a5,a6 | S APPROVE; P REJECT
595 | stairsda55aaca/rim27e30aa2/rock3b0cd8d4 | b2,a4,a6 | APPROVE,struckb2,a4,a6slab
590-594 | void/floor/shrine/statue | a,b | old lists struck
## Rejected (last 4)
596 | [P] a6 da34040c | rock mass under slab unseen; reverted
## Notes (max 3 lines)
- No stage. Second counted CONFIRM failure601 puts a/b at plateau; R needs respective599+601 lists.
- Four outer sheer islands/stairs and central3m shelf pass script play. Green caps replace inherited hill domes.
- Keep explicit wall colliders at walk-in cliffs and whole-island camera685f65a9.
