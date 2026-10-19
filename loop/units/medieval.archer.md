# medieval.archer
Status: done   Audited: 355   Done: 360
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a PASS (360)
b PASS (355)
c PASS (358)
d PASS (cost 140, hp 0.50x, dmg 2.12x, cd 4.00x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
## Attempts (iter | gap | criterion | verdict)
352 | brown longbow (weaponVariant brown_longbow) [S] (a8bc13d) | b | approved
354 | planted full-draw release [S] (e9a6c71) | c | approved
355 | hip quiver (QUIVER_HIP) [S] (d75f622 +7078d43) | b | approved
356 | hood: dark team cowl, liripipe, capelet (ARCHER_HOOD) [S] (e32ac81 +ee64656) | a | approved
357 | arms: beige upper sleeves, brown vambraces (ARCHER_ARMS) [S] (825dee2) | a | approved
358 | belt and boots (archerKit, ARCHER_KIT) [S] (dbfaa66) | a | approved
358 | arrow: red shaft, black broadhead (BROADHEAD) [S] (f886865) | c | approved
359 | hood: tight oval, rim, two-sided shell, capelet hem (ARCHER_HOOD) [S] (cdc15b5 +e8bbf78) | a | approved
359 | sleeves: tan cloth shells (ARCHER_SLEEVE) [S] (a43c08b, reverted f1af07a) | a | rejected
360 | sleeve material: shells re-landed in warmCloth, arm+stub, unglow [S] (6c6eb29 +3d9f92d) | a | approved
## Rejected (last 4)
- sleeves [S] [1] — 359: tan shell (.84,.7,.48) rendered neutral grey (lighting, found 360)
## Notes (max 3 lines)
- critic 360 (minor): sleeves flat pale slabs, about twice the forearm's width (upper-arm rig). Crown of the hood an onion peak (359, minor).
- archer_idle cannot show the belt (bow covers the waist); archer_release does. No further [P] on ARCHER_ARMS.
