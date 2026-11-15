# medieval.bard
Status: done   Audited: 355   Done: 358
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a PASS (358)
b PASS (355)
c PASS (354)
d PASS (cost 60, hp 0.71x, dmg 0.58x, cd 1.00x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
## Attempts (iter | gap | criterion | verdict)
351 | banjo (BANJO, BANJO_HOLD) [S] (e179db7) | b | approved
353 | Banjo Walk: lure, run off round his man (BANJO_WALK) [S] (68d8302 +53c3633) | c | approved
354 | music notes off his head during the walk (MUSIC_NOTE) [S] (a20bb74 +3c65ac0) | c | approved
355 | floppy hat (FLOPPY_HAT) [S] (216bf92) | a | approved
356 | peasant vest (bardVest, BARD_VEST) [S] (ffdb80c +df7b94b) | a | approved
357 | tunic: V and mid-thigh skirt, dark hem band (bardTunic, BARD_TUNIC) [S] (cfd130d) | a | approved
358 | legs: cream knee socks, brown shoes, team ankle bows (bardLegs, BARD_LEGS) [S] (bef3298) | a | approved
## Rejected (last 4)
## Notes (max 3 lines)
- critic 358: socks read pale grey more than cream (polish). critic 357: toggles pale grey, TABS beige. critic 355: hat sits low.
- bardTunic runs from unitFactory after the hip skirt is hung (dressMedieval runs before it and cannot see the skirt).
