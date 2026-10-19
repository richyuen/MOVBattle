# medieval.archer
Status: open   Audited: 355   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (4 since 355)
 2. sleeves in unit_medieval.archer_idle read neutral grey (about RGB 145,138,134), not beige/tan; a tan cloth shell (359) also rendered grey while the brown vambraces beside it render brown — TABS: beige/tan upper sleeves, about RGB 212,191,159 (ref: medieval.archer.red.png)
b PASS (355)
c PASS (358)
d PASS (cost 140, hp 0.50x, dmg 2.12x, cd 4.00x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a sleeve material — blocker 2: read the sleeve mesh's material back at capture time to find what greys it (a later arm repaint in unitFactory, or the "cloth" cache key), then give the sleeve a material that pass cannot touch and a more saturated tan in the vambrace's working range — ref: medieval.archer.red.png — ours: unit_medieval.archer_idle.png
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
## Rejected (last 4)
- sleeves [S] [1] — 359: tan shell (.84,.7,.48) rendered neutral grey — something recolours it or the cloth material greys light colours
## Notes (max 3 lines)
- Hood shell was one-sided before 359 (culled from outside, the self-lit head showed through). critic 359: crown an onion peak (minor).
- archer_idle cannot show the belt (bow covers the waist); archer_release does. No further [P] on ARCHER_ARMS.
