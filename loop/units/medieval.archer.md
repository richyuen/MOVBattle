# medieval.archer
Status: open   Audited: 351   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (0 since 351)
 1. headgear in unit_medieval.archer_idle is a green ball cap, flat green collar disc, green stick — TABS: team hood framing the face, liripipe tail, short team shoulder cape (ref: medieval.archer.blue.png)
 2. bare team arms in unit_medieval.archer_idle — TABS: beige sleeves, brown vambraces wrist to elbow (ref: medieval.archer.jpg)
 3. no belt or boots in unit_medieval.archer_idle — TABS: brown belt, brown cuffed boots (ref: medieval.archer.red.png)
b FAIL (1 since 351)
 2. quiver in unit_medieval.archer_idle is a black tube across the back — TABS: brown/red quiver at the hip, team-fletched arrows (ref: medieval.archer.blue.png)
c FAIL (1 since 351)
 2. arrow in unit_medieval.archer_release is a dark shaft, small blue tip — TABS: red shaft, large black broadhead (ref: medieval.archer.blue.png)
d PASS (cost 140, hp 0.50x, dmg 2.12x, cd 4.00x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] c arrow — blocker 2: red-shaft arrow, large black broadhead, team fletching, held and flying — ref: medieval.archer.blue.png — ours: unit_medieval.archer_release.png
2. [S] a team hood — blocker 1: team hood framing the face, liripipe tail, short shoulder cape — ref: medieval.archer.blue.png — ours: unit_medieval.archer_idle.png
3. [S] b hip quiver — blocker 2: brown hip quiver with team-fletched arrows, replacing the black back tube — ref: medieval.archer.blue.png — ours: unit_medieval.archer_idle.png
## Attempts (iter | gap | criterion | verdict)
352 | brown longbow (weaponVariant brown_longbow) [S] (a8bc13d) | b | approved
353 | longbow length BROWN_LONGBOW.long 1.4 [P] (e1336bb) | b | approved
354 | planted full-draw release: arrow leaves at the loose (bowReleasesIn, DRAWS_BEFORE_LOOSE) [S] (e9a6c71) | c | approved
## Rejected (last 4)
## Notes (max 3 lines)
- critic 354: at the loose the draw hand is above the hood (TABS at the cheek, elbow level); a stray white line runs off the right of _release.
- Arrow now leaves ~1.5 s later (release = throw at 1900 ms): archer regression scenarios may shift at the checkpoint.
