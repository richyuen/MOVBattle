# pirate.blunderbuss
Status: open   Audited: 422, 426 (RE-AUDIT c)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (1 since 422)
 1. the head in unit_pirate.blunderbuss_idle - a small round tan cap - TABS: a flat wooden plank hat as wide as the shoulders, a barrel lid worn level (ref: pirate.blunderbuss.red.png)
 3. the forearms in unit_pirate.blunderbuss_idle - bare team - TABS: brown stave bracers with black straps on each arm (ref: pirate.blunderbuss.red.png; card "large straps around their arms")
 4. the sides of the head in unit_pirate.blunderbuss_idle - bare - TABS: dark-brown hair falling to the shoulders either side of the face (ref: pirate.blunderbuss.blue.png)
  (struck 2 at 426)
b FAIL (1 since 422)
 1. the main-hand prop in unit_pirate.blunderbuss_idle - TABS: a blunderbuss ... the whole as long as the man is tall (ref: pirate.blunderbuss.red.png, pirate.blunderbuss.jpg; card Main Hand Blunderbuss)
  (struck 2 at 425; 1's mace, stock, barrel and bell clauses at 425)
c FAIL (1 since 426)
 2. the knight in unit_pirate.blunderbuss_struck - standing on its feet mid-lunge with the sword raised, untouched - TABS: blown off its feet by the shot (card Weapons: force 650)
  (struck 1 at 426)
d PASS (cost 160, hp 2.49x, dmg 0.45x, cd 4.00x; 426 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] c shot knockback - blocker 2: applyBlastLaunch on the direct target along the shot line (_fireShotgun) so the knight is off his feet in _struck - ref: card Weapons force 650 - ours: unit_pirate.blunderbuss_struck (426 rank 2)
2. [S] a plank hat - blocker 1: a flat wooden barrel-lid hat as wide as the shoulders worn level, replacing the cap (pirateDress) - ref: pirate.blunderbuss.red.png - ours: unit_pirate.blunderbuss_idle (426 rank 3)
3. [S] b gun rebuild - blocker 1: rebuild BLUNDERBUSS as a long separate stock + barrel + bell so it is as long as the man is tall (an [S], not a .long nudge) - ref: pirate.blunderbuss.jpg - ours: unit_pirate.blunderbuss_idle (426 NEXT)
## Attempts (iter | gap | criterion | verdict)
425 | BLUNDERBUSS prop + _aimBlunderbuss two-hand low hold (28779788) | b | approved (struck 2; 1 down to its length)
426 | BLUNDERBUSS_RECOIL shooter thrown off his feet (fb6f0227) | c | approved (struck 1)
426 | BARREL_ARMOUR staves, hoops, shoulder straps (c311013a) | a | approved (struck 2)
426 | [P] BLUNDERBUSS.long .62 -> .9 (d0bc1b09) | b | rejected (ledger reversal), reverted
## Rejected (last 4)
- gun length [P] [1] - 426: BLUNDERBUSS.long .9 - ledger reversal of the 425 row (an [S] rebuild may set it)
## Notes (max 3 lines)
- Gun: propBuilder case "blunderbuss" (BLUNDERBUSS_OFF_GRIP, smoke at "musketMuzzle"), held by _aimBlunderbuss; shot simulationSystem _fireShotgun (BLUNDERBUSS_RECOIL after the pellets).
- 426 defects: he lands face-down, not on his back; the barrel's brown darker than TABS's mid-brown and the hoops barely separate.
