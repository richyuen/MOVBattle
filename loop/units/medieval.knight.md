# medieval.knight
Status: open   Audited: 351   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (1 since 351)
 2. no cape in unit_medieval.knight_idle — TABS: team cape off the shoulders (ref: medieval.knight.png)
 3. torso team cloth in unit_medieval.knight_idle — TABS: grey plate cuirass with fauld, plated legs, grey sabatons (ref: medieval.knight.png)
b PASS (351)
c PASS (351)
d PASS (cost 650, hp 7.65x, dmg 1.00x, cd 0.76x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a plate cuirass — blocker 3: grey cuirass with fauld replacing the tabard, plated legs, sabatons — ref: medieval.knight.png — ours: unit_medieval.knight_idle.png
2. [S] a cape — blocker 2: team cape off the shoulders — ref: medieval.knight.png — ours: unit_medieval.knight_idle.png
3. [P] a ARMET.rail .75->1.0, proud .05->.12 (fallout of 58cfa04) — the visor frame stands up over the crown — shows in lineup_medieval (red knight's head)
## Attempts (iter | gap | criterion | verdict)
351 | Knight Charge dash, battered aside on contact (KNIGHT_CHARGE) [S] (b806f45) | c | approved
353 | open armet: grey dome, cheek/back plates, bevor, face open, team barred visor frame (ARMET) [S] (58cfa04 +4459ae6) | a | approved
## Rejected (last 4)
## Notes (max 3 lines)
- critic 351: dash reads as a brisk run, no lowered-shield bash pose.
- _idle faces away from the camera: the helm front shows in lineup_medieval, _windup and _ability.
