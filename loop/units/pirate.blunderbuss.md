# pirate.blunderbuss
Status: open   Audited: 422, 426 (RE-AUDIT c), 431 (CONFIRM: failed a)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (0 since 431; the CONFIRM 431 list)
 1. thighs and shins in unit_pirate.blunderbuss_idle are bare team blue — TABS: banded wooden barrel staves around both thighs and both shins (ref: pirate.blunderbuss.blue.png, pirate.blunderbuss.jpg, card Appearance "large straps around their arms, legs")
b PASS (431: full-length gun, dropped stock, long fore stock, flared lipped barrel; CONFIRM 431)
c PASS (427: recoil throws him; the shot throws the knight off his feet; CONFIRM 431)
d PASS (cost 160, hp 2.49x, dmg 0.45x, cd 4.00x; 431 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a leg staves - blocker 1: BARREL_BRACERS' stave cuffs with black straps round both thighs and both shins (barrelBracers on the leg limbs) - ref: pirate.blunderbuss.blue.png - ours: unit_pirate.blunderbuss_idle, lineup_pirate (CONFIRM 431)
## Attempts (iter | gap | criterion | verdict)
425-427 | BLUNDERBUSS prop + _aimBlunderbuss; RECOIL; BLAST | b, c | approved (c PASS)
426-430 | BARREL_ARMOUR; PLANK_HAT; BARREL_BRACERS; BLUNDERBUSS_HAIR | a | approved (a PASS 430)
426 | [P] BLUNDERBUSS.long .62 -> .9 (d0bc1b09) | b | rejected (ledger reversal), reverted
431 | BLUNDERBUSS rebuilt full length (8addafc1) | b | approved (struck 1; b PASS; CONFIRM passed b, failed a)
## Rejected (last 4)
- gun length [P] [1] - 426: BLUNDERBUSS.long .9 - ledger reversal of the 425 row (an [S] rebuild may set it)
## Notes (max 3 lines)
- Gun: propBuilder case "blunderbuss" (rebuilt 431), held by _aimBlunderbuss; shot simulationSystem _fireShotgun.
- 431 critic: the bell's flare modest (TABS wide trumpet). 427: knight launched mostly up. 426: lands face-down.
