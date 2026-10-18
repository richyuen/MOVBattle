# tribal.spear_thrower
Status: open   Audited: 315   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (0 since 315)
 1. head in unit_tribal.spear_thrower_idle wears a black hair cap — TABS: bare team-colour head with a pale curved tusk each side on a brown headband strap (ref: tribal.spear_thrower.blue.png)
 2. loincloth in unit_tribal.spear_thrower_idle is a plain dark box — TABS: brown loincloth with rope belt, a skull at the centre and bones each side (ref: tribal.spear_thrower.red.png)
 3. neck in unit_tribal.spear_thrower_idle is a dark flat ring — TABS: one long pale fang hanging on a strap (ref: tribal.spear_thrower.blue.png)
b FAIL (1 since 315)
 1. (struck 319: spear stood up out of the fist)
 2. spearhead in unit_tribal.spear_thrower_release is a small dark triangle — TABS: a broad grey stone leaf lashed to the shaft with rope (ref: tribal.spear_thrower.jpg)
c PASS (317)
d PASS (stats 317: cost 120=120, hp -12%, dmg 0%, cd 0%)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] b stone leaf head — blocker 2: a flat broad grey stone leaf (a flattened faceted wedge about a head long, half as wide) with a rope wrap at its base replacing the small dark cone, propBuilder "javelin" — ref: tribal.spear_thrower.jpg — ours: unit_tribal.spear_thrower_release.png (and _windup)
2. [S] a tusk headband — blocker 1: a pale curved tusk each side on a brown headband strap replacing the black hair cap — ref: tribal.spear_thrower.blue.png — ours: unit_tribal.spear_thrower_idle.png
## Attempts (iter | gap | criterion | verdict)
316 | flat javelin (a76560b) | c | approved
317 | stick-and-launch (6f13b5a) | c | approved
318 | spear raised overhead (b194791) | b | rejected
319 | spear stood up out of the fist (c8f0e70) | b | approved
## Rejected (last 4)
- spear raised overhead [S] [1] — 318: JAVELIN_COCK alone (arm straight up) — the javelin's +y runs toward the elbow, so the shaft hung DOWN the back of the head
## Notes (max 3 lines)
- 316: LAUNCH spear 20, 9.8 + solveLowArc. 317: LAUNCH.spear.throw 220 -> staggerFromBlow; _leaveAsLitter. Keys on shape "spear".
- 319: _standJavelin turns the "shaft" pi about the fist at the cock (JAVELIN_COCK arm up; JAVELIN_UNTURN back over the whip, square at the let-go; the missile copy has its own frame). Critic 319 (minor): the stood shaft leans ~45 deg forward in _windup, TABS within ~15 deg of vertical.
- The javelin rides the hand (no carry turn); its +y runs fist -> elbow.
