# tribal.spear_thrower
Status: open   Audited: 315   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (0 since 315)
 1. head in unit_tribal.spear_thrower_idle wears a black hair cap — TABS: bare team-colour head with a pale curved tusk each side on a brown headband strap (ref: tribal.spear_thrower.blue.png)
 2. loincloth in unit_tribal.spear_thrower_idle is a plain dark box — TABS: brown loincloth with rope belt, a skull at the centre and bones each side (ref: tribal.spear_thrower.red.png)
 3. neck in unit_tribal.spear_thrower_idle is a dark flat ring — TABS: one long pale fang hanging on a strap (ref: tribal.spear_thrower.blue.png)
b PASS (320)
c PASS (317)
d PASS (stats 317: cost 120=120, hp -12%, dmg 0%, cd 0%)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a tusk headband — blocker 1: bare head, a brown strap round it and a pale curved tusk each side; drop the black hair cap — ref: tribal.spear_thrower.blue.png — ours: unit_tribal.spear_thrower_idle.png
2. [S] a ornamented loincloth — blocker 2: brown flap, rope belt, skull at the centre, bones each side (shared tribal mechanism) — ref: tribal.spear_thrower.red.png — ours: unit_tribal.spear_thrower_idle.png
## Attempts (iter | gap | criterion | verdict)
317 | stick-and-launch (6f13b5a) | c | approved
318 | spear raised overhead (b194791) | b | rejected
319 | spear stood up out of the fist (c8f0e70) | b | approved
320 | stone leaf head (4e68c1c) | b | approved
## Rejected (last 4)
- spear raised overhead [S] [1] — 318: JAVELIN_COCK alone (arm straight up) — the javelin's +y runs toward the elbow, so the shaft hung DOWN the back of the head
## Notes (max 3 lines)
- 316: LAUNCH spear 20, 9.8 + solveLowArc. 317: LAUNCH.spear.throw 220 -> staggerFromBlow. 319: _standJavelin turns the "shaft" pi about the fist at the cock; the javelin's +y runs fist -> elbow.
- 320: javelin "tip" is a jittered flat icosphere leaf (JAVELIN_LEAF, HEAD 0.15 x 0.095, JAVELIN_STONE grey e0.15), barbs stone, three rope tori. Critic 320 (minor): the leaf a little paler than the reference's charcoal.
- The hair mop comes from unitFactory's bareSkinned branch (dropped only under bone_mask/antler_skull): the headband gap must skip it for this unit.
