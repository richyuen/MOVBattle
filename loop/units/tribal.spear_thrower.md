# tribal.spear_thrower
Status: open   Audited: 315   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (0 since 315)
 1. head in unit_tribal.spear_thrower_idle wears a black hair cap — TABS: bare team-colour head with a pale curved tusk each side on a brown headband strap (ref: tribal.spear_thrower.blue.png)
 2. loincloth in unit_tribal.spear_thrower_idle is a plain dark box — TABS: brown loincloth with rope belt, a skull at the centre and bones each side (ref: tribal.spear_thrower.red.png)
 3. neck in unit_tribal.spear_thrower_idle is a dark flat ring — TABS: one long pale fang hanging on a strap (ref: tribal.spear_thrower.blue.png)
b FAIL (0 since 315)
 1. spear in unit_tribal.spear_thrower_windup is hidden behind the torso, a stub at the shoulder — TABS: arm straight up, spear raised above the head (ref: tribal.spear_thrower.red.png)
 2. spearhead in unit_tribal.spear_thrower_release is a small dark triangle — TABS: a broad grey stone leaf lashed to the shaft with rope (ref: tribal.spear_thrower.jpg)
c PASS (317)
d PASS (stats 317: cost 120=120, hp -12%, dmg 0%, cd 0%)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] b spear stood up out of the fist — blocker 1: turn the hand (or re-seat the "shaft" node) about pi at the cock so the shaft stands up out of the fist over the crown, head forward and pitched at the foe, un-turned through the swing (release unchanged) — ref: tribal.spear_thrower.red.png — ours: unit_tribal.spear_thrower_windup.png
2. [S] b stone leaf head — blocker 2: broad grey faceted stone leaf lashed to the shaft with rope — ref: tribal.spear_thrower.jpg — ours: unit_tribal.spear_thrower_release.png
## Attempts (iter | gap | criterion | verdict)
316 | flat javelin (a76560b) | c | approved
317 | stick-and-launch (6f13b5a) | c | approved
318 | spear raised overhead (b194791) | b | rejected
## Rejected (last 4)
- spear raised overhead [S] [1] — 318: JAVELIN_COCK, the arm straight up (raise -2.8, elbow -0.1) — the javelin's +y runs toward the elbow, so the shaft hung DOWN the back of the head, leaf at the nape, point backward
## Notes (max 3 lines)
- 316: LAUNCH spear 20, 9.8 + solveLowArc. 317: LAUNCH.spear.throw 220 -> staggerFromBlow; _leaveAsLitter. Keys on shape "spear".
- The javelin rides the hand (no carry turn). Its +y runs fist -> elbow: turn the hand or node about pi at the cock, keep the let-go (a level point-first throw, fine). The two b gaps are one criterion.
