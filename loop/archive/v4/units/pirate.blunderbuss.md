# pirate.blunderbuss
Status: done   Audited: 422, 426 (RE-AUDIT c), 431 (CONFIRM: failed a), 432 (CONFIRM: passed)   Done: 432
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a PASS (432: stave barrels with black straps round both thighs and shins; CONFIRM 432)
b PASS (431: full-length gun, dropped stock, long fore stock, flared lipped barrel; CONFIRM 431, 432)
c PASS (427: recoil throws him; the shot throws the knight off his feet; CONFIRM 431, 432)
d PASS (cost 160, hp 2.49x, dmg 0.45x, cd 4.00x; 432 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
## Attempts (iter | gap | criterion | verdict)
425-427 | BLUNDERBUSS prop + _aimBlunderbuss; RECOIL; BLAST | b, c | approved (c PASS)
426-430 | BARREL_ARMOUR; PLANK_HAT; BARREL_BRACERS; BLUNDERBUSS_HAIR | a | approved (a PASS 430)
426 | [P] BLUNDERBUSS.long .62 -> .9 (d0bc1b09) | b | rejected (ledger reversal), reverted
431 | BLUNDERBUSS rebuilt full length (8addafc1) | b | approved (b PASS; CONFIRM passed b, failed a)
432 | BARREL_GREAVES stave barrels on thighs and shins (11be8ee6) | a | approved (struck 1; a PASS; CONFIRM passed: D)
## Rejected (last 4)
- gun length [P] [1] - 426: BLUNDERBUSS.long .9 - ledger reversal of the 425 row (an [S] rebuild may set it)
## Notes (max 3 lines)
- Gun: propBuilder case "blunderbuss" (rebuilt 431), held by _aimBlunderbuss; shot simulationSystem _fireShotgun. Legs: barrelGreaves (braceLimb shared with barrelBracers).
- 432 critics: staves darker chocolate than the render's mid brown; bare knee between barrels barely shows.
