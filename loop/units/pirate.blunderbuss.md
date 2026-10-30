# pirate.blunderbuss
Status: open   Audited: 422, 426 (RE-AUDIT c)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (2 since 422)
 3. the forearms in unit_pirate.blunderbuss_idle - bare team - TABS: brown stave bracers with black straps on each arm (ref: pirate.blunderbuss.red.png; card "large straps around their arms")
 4. the sides of the head in unit_pirate.blunderbuss_idle - bare - TABS: dark-brown hair falling to the shoulders either side of the face (ref: pirate.blunderbuss.blue.png)
  (struck 2 at 426; 1 at 427)
b FAIL (1 since 422)
 1. the main-hand prop in unit_pirate.blunderbuss_idle - TABS: a blunderbuss ... the whole as long as the man is tall (ref: pirate.blunderbuss.red.png, pirate.blunderbuss.jpg; card Main Hand Blunderbuss)
  (struck 2 at 425; 1's mace, stock, barrel and bell clauses at 425)
c PASS (427: recoil throws him; the shot throws the knight off his feet)
d PASS (cost 160, hp 2.49x, dmg 0.45x, cd 4.00x; 427 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a bracers - blocker 3: brown stave bracers with black straps on each forearm (BARREL_ARMOUR staves on limbShell) - ref: pirate.blunderbuss.red.png - ours: unit_pirate.blunderbuss_idle (427 rank 5)
2. [S] a hair - blocker 4: dark-brown shoulder-length hair either side of the face, seating the plank - ref: pirate.blunderbuss.blue.png - ours: unit_pirate.blunderbuss_idle (427 rank 6)
3. [S] b gun rebuild - blocker 1: rebuild BLUNDERBUSS as a long separate stock + barrel + bell so it is as long as the man is tall (an [S], not a .long nudge) - ref: pirate.blunderbuss.jpg - ours: unit_pirate.blunderbuss_idle (426 NEXT)
## Attempts (iter | gap | criterion | verdict)
425 | BLUNDERBUSS prop + _aimBlunderbuss two-hand low hold (28779788) | b | approved (struck 2; 1 down to its length)
426 | BLUNDERBUSS_RECOIL shooter thrown off his feet (fb6f0227) | c | approved (struck 1)
426 | BARREL_ARMOUR staves, hoops, shoulder straps (c311013a) | a | approved (struck 2)
426 | [P] BLUNDERBUSS.long .62 -> .9 (d0bc1b09) | b | rejected (ledger reversal), reverted
427 | BLUNDERBUSS_BLAST the man shot is launched along the line (9afd1177) | c | approved (struck 2; c PASS)
427 | PLANK_HAT three boards and a batten on the crown, bandana dropped (01fa4757) | a | approved (struck 1)
## Rejected (last 4)
- gun length [P] [1] - 426: BLUNDERBUSS.long .9 - ledger reversal of the 425 row (an [S] rebuild may set it)
## Notes (max 3 lines)
- Gun: propBuilder case "blunderbuss", held by _aimBlunderbuss; shot simulationSystem _fireShotgun (BLUNDERBUSS_BLAST on the target, BLUNDERBUSS_RECOIL on him).
- 427 defects: plank sits a gap above the crown (hair would seat it); knight launched mostly up (lift 7 vs fling 6), TABS thrown back along the shot.
- 426 defects: he lands face-down, not on his back; barrel brown darker than TABS's mid-brown.
