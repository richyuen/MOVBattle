# tribal.spear_thrower
Status: done   Audited: 360 (a, b re-audited 372)   Done: 374
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a PASS (374)
b PASS (372)
c PASS (360)
d PASS (cost 120, hp 0.55x, dmg 2.23x, cd 4.00x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
## Attempts (iter | gap | criterion | verdict)
318-323 | spear raised [rej], spear stood up, stone head, tusk band, loincloth, fang necklace | a,b | approved
362-373 | knapped flint head; hung tusks; chunky tusks (TUSK_BAND); own loincloth (SPEAR_LOIN) [S] | a,b | approved
374 | upright stance: javelin man always hip-shot, crouch <= .04, lean .08-.14; bulk .82, legs/arms 1.12 (JAVELIN_UPRIGHT) [S] (9fcac3a) | a | approved
374 | flap mid-brown (.5,.38,.26) glow .08, own red-brown rope (SPEAR_LOIN hide, ropeTint) [P] (5780739) | a | approved
## Rejected (last 4)
- spear raised overhead [S] [1] — 318: JAVELIN_COCK alone (arm straight up) — the javelin's +y runs toward the elbow, so the shaft hung DOWN the back of the head
## Notes (max 3 lines)
- 316: LAUNCH spear 20, 9.8 + solveLowArc. 319: _standJavelin turns the "shaft" pi about the fist at the cock. 362 head: own-vertex kite "tip".
- tuskBand (TUSK_BAND); spearThrowerLoin in tribalDress (own rope material). Upright idle keyed on holding a javelin (_javelin()) in _buildIdlePose.
- Critic 374 minor: feet squarish blocks a little wider than the shin; rope a touch orange-tan.
