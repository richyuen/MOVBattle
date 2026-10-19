# medieval.archer
Status: open   Audited: 355   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (2 since 355)
 1. hood in unit_medieval.archer_idle barely darker than the skin, open forehead to chin, a thin dark rim; capelet the chest's tone — TABS: dark navy hood, tight oval brow to chin, cloth over the forehead, capelet a separate dark layer (ref: medieval.archer.blue.png)
 2. sleeves in unit_medieval.archer_idle pale grey-white — TABS: beige/tan upper sleeves (ref: medieval.archer.red.png)
 3. no belt, no boots in unit_medieval.archer_idle — TABS: brown belt, brown cuffed knee boots (ref: medieval.archer.red.png)
b PASS (355)
c FAIL (1 since 351)
 2. arrow in unit_medieval.archer_release is a dark shaft, small blue tip — TABS: red shaft, large black broadhead (ref: medieval.archer.blue.png)
d PASS (cost 140, hp 0.50x, dmg 2.12x, cd 4.00x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a belt and boots — blocker 3: brown belt, brown cuffed knee boots — ref: medieval.archer.red.png — ours: unit_medieval.archer_idle.png
2. [S] c arrow — blocker 2: red-shaft arrow, large black broadhead mesh — ref: medieval.archer.blue.png — ours: unit_medieval.archer_release.png
3. [P] a hood (fallout of e32ac81, 356) — blocker 1: ARCHER_HOOD.shade .5 -> .32, brow .58 -> .3; NEXT: unit_medieval.archer_idle, cowl dark navy over the forehead
## Attempts (iter | gap | criterion | verdict)
352 | brown longbow (weaponVariant brown_longbow) [S] (a8bc13d) | b | approved
354 | planted full-draw release: arrow leaves at the loose [S] (e9a6c71) | c | approved
355 | hip quiver (QUIVER_HIP) [S] (d75f622 +7078d43) | b | approved
356 | hood: dark team cowl, liripipe, capelet (ARCHER_HOOD) [S] (e32ac81 +ee64656) | a | approved
357 | arms: beige upper sleeves, brown vambraces with dark straps (archerArms, ARCHER_ARMS) [S] (825dee2) | a | approved
## Rejected (last 4)
## Notes (max 3 lines)
- critic 357: ARCHER_ARMS.beige (.86,.78,.6) washes to grey-white: a warmer darker tan (no [P] listed; fold into the belt/boots pass).
- critic 355: quiver leather near-black. Arrow leaves at 1900 ms since 354: archer regression scenarios may shift at the checkpoint.
