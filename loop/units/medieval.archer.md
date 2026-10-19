# medieval.archer
Status: open   Audited: 355   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (1 since 355)
 1. hood in unit_medieval.archer_idle barely darker than the skin, open forehead to chin, a thin dark rim; capelet the chest's tone — TABS: dark navy hood, tight oval brow to chin, cloth over the forehead, capelet a separate dark layer (ref: medieval.archer.blue.png)
 2. arms in unit_medieval.archer_idle bare team — TABS: beige sleeves on the upper arm, brown vambraces wrist to elbow (ref: medieval.archer.red.png)
 3. no belt, no boots in unit_medieval.archer_idle — TABS: brown belt, brown cuffed knee boots (ref: medieval.archer.red.png)
b PASS (355)
c FAIL (1 since 351)
 2. arrow in unit_medieval.archer_release is a dark shaft, small blue tip — TABS: red shaft, large black broadhead (ref: medieval.archer.blue.png)
d PASS (cost 140, hp 0.50x, dmg 2.12x, cd 4.00x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a arms — blocker 2: beige upper-arm sleeves and brown vambraces wrist to elbow — ref: medieval.archer.red.png — ours: unit_medieval.archer_idle.png
2. [S] c arrow — blocker 2: red-shaft arrow, large black broadhead, team fletching — ref: medieval.archer.blue.png — ours: unit_medieval.archer_release.png
3. [P] a hood (fallout of e32ac81, 356) — blocker 1: ARCHER_HOOD.shade .5 -> .32, brow .58 -> .3; NEXT: unit_medieval.archer_idle, cowl dark navy over the forehead
## Attempts (iter | gap | criterion | verdict)
352 | brown longbow (weaponVariant brown_longbow) [S] (a8bc13d) | b | approved
354 | planted full-draw release: arrow leaves at the loose [S] (e9a6c71) | c | approved
355 | hip quiver: off hip, team band, team-fletched red arrows (QUIVER_HIP) [S] (d75f622 +7078d43) | b | approved
356 | hood: dark team cowl open at the face, liripipe, capelet; green cap dropped (ARCHER_HOOD) [S] (e32ac81 +ee64656) | a | approved
## Rejected (last 4)
## Notes (max 3 lines)
- 356: he was NOT facing away (probe: his chest faces the idle camera); the old green cap covered his whole face. No evidence commit needed.
- critic 355: quiver leather near-black brown (TABS warmer red-brown). critic 354: at the loose the draw hand is above the hood.
- Arrow leaves ~1.5 s later since 354 (release = throw at 1900 ms): archer regression scenarios may shift at the checkpoint.
