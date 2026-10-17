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
c FAIL (1 since 315)
 1. (struck 316: flat javelin)
 2. squire in unit_tribal.spear_thrower_struck walks on untouched, no spear near him — TABS: the spear lands and launches the target (card damage 200, force 220). Shot re-aimed at the impact frame by the 315 evidence commit; judge there.
d PASS (stats 315: cost 120=120, hp -12%, dmg 0%, cd 0%)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] c stick-and-launch — blocker 2: spear impact applies the card's force 220 knockback and the spear stays stuck in the target for the struck frame — ref: card Weapons, tribal.spear_thrower.jpg — ours: unit_tribal.spear_thrower_struck.png
2. [S] b spear raised overhead — blocker 1: windup pose with the arm straight up and the javelin above the head — ref: tribal.spear_thrower.red.png — ours: unit_tribal.spear_thrower_windup.png
## Attempts (iter | gap | criterion | verdict)
316 | flat javelin (a76560b) | c | approved
## Rejected (last 4)
## Notes (max 3 lines)
- 316: projectileSystem LAUNCH table (spear: speed 20, gravity 9.8) + solveLowArc; flight keeps the lerp + 4At(1-t) form (A = gT^2/8). Keys on shape "spear", so the harpooner and the plain-spear fallback share it.
