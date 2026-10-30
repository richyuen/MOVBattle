# pirate.blunderbuss
Status: open   Audited: 422, 426 (RE-AUDIT c)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a PASS (430: dark-brown bob under the plank hat past the jaw)
b FAIL (1 since 422)
 1. the main-hand prop in unit_pirate.blunderbuss_idle - TABS: a blunderbuss ... the whole as long as the man is tall (ref: pirate.blunderbuss.red.png, pirate.blunderbuss.jpg; card Main Hand Blunderbuss)
  (struck 2 at 425; 1's mace, stock, barrel and bell clauses at 425)
c PASS (427: recoil throws him; the shot throws the knight off his feet)
d PASS (cost 160, hp 2.49x, dmg 0.45x, cd 4.00x; 430 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] b gun rebuild - blocker 1: rebuild BLUNDERBUSS with a long stock and barrel so the whole gun is about the man's standing height (an [S], the [P] on .long is spent as a reversal) - ref: pirate.blunderbuss.red.png, pirate.blunderbuss.jpg - ours: unit_pirate.blunderbuss_idle (430 rank 4; starving at 431)
## Attempts (iter | gap | criterion | verdict)
425 | BLUNDERBUSS prop + _aimBlunderbuss two-hand low hold (28779788) | b | approved (struck 2; 1 down to its length)
426 | BLUNDERBUSS_RECOIL shooter thrown off his feet (fb6f0227) | c | approved (struck 1)
426 | BARREL_ARMOUR staves, hoops, shoulder straps (c311013a) | a | approved (struck 2)
426 | [P] BLUNDERBUSS.long .62 -> .9 (d0bc1b09) | b | rejected (ledger reversal), reverted
427 | BLUNDERBUSS_BLAST the man shot is launched along the line (9afd1177) | c | approved (struck 2; c PASS)
427 | PLANK_HAT three boards and a batten on the crown, bandana dropped (01fa4757) | a | approved (struck 1)
428 | BARREL_BRACERS stave cuffs with two black straps on each forearm and upper arm (d6d8e60a) | a | approved (struck 3)
430 | BLUNDERBUSS_HAIR pirateHair bob in dark brown + crown cap under the plank (ed8b9edd) | a | approved (struck 4; a PASS)
## Rejected (last 4)
- gun length [P] [1] - 426: BLUNDERBUSS.long .9 - ledger reversal of the 425 row (an [S] rebuild may set it)
## Notes (max 3 lines)
- Gun: propBuilder case "blunderbuss", held by _aimBlunderbuss; shot simulationSystem _fireShotgun (BLUNDERBUSS_BLAST on the target, BLUNDERBUSS_RECOIL on him).
- 427 defects: knight launched mostly up (lift 7 vs fling 6), TABS thrown back along the shot.
- 426 defects: he lands face-down, not on his back; barrel brown darker than TABS's mid-brown.
