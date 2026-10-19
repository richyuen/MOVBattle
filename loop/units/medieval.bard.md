# medieval.bard
Status: open   Audited: 355   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (3 since 355)
 2. legs/feet in unit_medieval.bard_idle bare team to the ground — TABS: cream knee socks, brown shoes with team bows (ref: medieval.bard.blue.png)
b PASS (355)
c PASS (354)
d PASS (cost 60, hp 0.71x, dmg 0.58x, cd 1.00x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a legs — blocker 2: cream knee socks on the shins, brown shoes with team-coloured bows — ref: medieval.bard.blue.png — ours: unit_medieval.bard_idle.png
## Attempts (iter | gap | criterion | verdict)
351 | banjo (BANJO, BANJO_HOLD) [S] (e179db7) | b | approved
353 | Banjo Walk: lure, run off round his man (BANJO_WALK) [S] (68d8302 +53c3633) | c | approved
354 | music notes off his head during the walk (MUSIC_NOTE) [S] (a20bb74 +3c65ac0) | c | approved
355 | floppy hat (FLOPPY_HAT) [S] (216bf92) | a | approved
356 | peasant vest: dark shells of torso+yoke, V panel, X lacing, toggles (bardVest, BARD_VEST) [S] (ffdb80c +df7b94b) | a | approved
357 | tunic: one tunic cloth for the V and a mid-thigh skirt with a dark hem band; toggles larger (bardTunic, BARD_TUNIC) [S] (cfd130d) | a | approved
## Rejected (last 4)
## Notes (max 3 lines)
- critic 357: toggles render pale grey, TABS beige (minor). critic 355: hat sits low, brim half-hides the eyes (FLOPPY_HAT.dip/seat fallout).
- bardTunic runs from unitFactory after the hip skirt is hung (dressMedieval runs before it and cannot see the skirt).
