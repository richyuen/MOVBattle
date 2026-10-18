# medieval.archer
Status: open   Audited: 355   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (0 since 355)
 1. headgear in unit_medieval.archer_idle a green eared ball cap over a flat green collar disc — TABS: team hood framing the face, liripipe tail, short team shoulder capelet (ref: medieval.archer.blue.png)
 2. arms in unit_medieval.archer_idle bare team — TABS: beige sleeves on the upper arm, brown vambraces wrist to elbow (ref: medieval.archer.red.png)
 3. no belt, no boots in unit_medieval.archer_idle — TABS: brown belt, brown cuffed knee boots (ref: medieval.archer.red.png)
b PASS (355)
c FAIL (1 since 351)
 2. arrow in unit_medieval.archer_release is a dark shaft, small blue tip — TABS: red shaft, large black broadhead (ref: medieval.archer.blue.png)
d PASS (cost 140, hp 0.50x, dmg 2.12x, cd 4.00x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a hood — blocker 1: team hood framing the face, liripipe tail, short shoulder capelet; re-aim the idle to his front first — ref: medieval.archer.blue.png — ours: unit_medieval.archer_idle.png
2. [S] c arrow — blocker 2: red-shaft arrow, large black broadhead, team fletching, held and flying — ref: medieval.archer.blue.png — ours: unit_medieval.archer_release.png
## Attempts (iter | gap | criterion | verdict)
352 | brown longbow (weaponVariant brown_longbow) [S] (a8bc13d) | b | approved
353 | longbow length BROWN_LONGBOW.long 1.4 [P] (e1336bb) | b | approved
354 | planted full-draw release: arrow leaves at the loose (bowReleasesIn, DRAWS_BEFORE_LOOSE) [S] (e9a6c71) | c | approved
355 | hip quiver: tall quiver on the off hip, team band, team-fletched red arrows (quiver_hip, QUIVER_HIP) [S] (d75f622 +7078d43) | b | approved
## Rejected (last 4)
## Notes (max 3 lines)
- EVIDENCE: unit_medieval.archer_idle shows his back (his bow ready stance turns him .6-.95 rad off his root yaw, the idle camera follows the root): a.1 cannot be judged until it is re-aimed.
- critic 355: quiver leather near-black brown (TABS warmer red-brown). critic 354: at the loose the draw hand is above the hood (TABS at the cheek).
- Arrow leaves ~1.5 s later since 354 (release = throw at 1900 ms): archer regression scenarios may shift at the checkpoint.
