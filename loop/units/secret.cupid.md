# secret.cupid
Status: open   Audited: 515 (AUDIT x2)   Done: -
## Verdicts
a PASS (518: struck 5; curls, wings, diaper, bare body and feet)
b FAIL (1 since 515, 1 struck)
 2. arrow in unit_secret.cupid_windup — TABS: arrow with a pink heart head; ours is a plain dark shaft (ref: secret.cupid.blue.png)
c FAIL (0 since 515)
 1. projectile in unit_secret.cupid_release/_flight — TABS: heart-headed arrow trailing pink hearts; ours is a plain dark arrow with a steel tip (ref: secret.cupid.png)
 2. missing: lovestruck status — summary records only volley/missile/impact, and unit_secret.cupid_struck shows no hearts on the hit knight, who doesn't turn on his allies (ref: card Characteristics)
d PASS (518 stats)
## Ranked gaps
1. [S] secret.cupid.b heart arrow — blocker 2: pink heart arrowhead on the nocked arrow (bow_ready drawn_arrow is a glow orb at the string hand: needs a real arrow mesh aimed at the bow hand) — ref: reference/units/secret.cupid.blue.png — ours: unit_secret.cupid_windup.png
2. [S] secret.cupid.c heart projectile — blocker 1: heart-headed arrow trailing pink hearts (projectile shape + trail) — ref: reference/units/secret.cupid.png — ours: unit_secret.cupid_flight.png
3. [S] secret.cupid.c lovestruck — blocker 2: lovestruck status with hearts over the hit unit, which turns on its allies — ref: loop/cards/secret.cupid.md — ours: unit_secret.cupid_struck.png
## Attempts (iter | gap | criterion | verdict)
518 | bare team feet, grey boot gone, secretDress cupidFeet (341eb7f4) | a | approved (struck 5; a PASS)
517 | cream diaper on a bare team body, no tunic, secretDress cupidDiaper (7159b2bf) | a | approved (struck 4)
516 | golden curly mop, secretDress cupidHair (463d1578) | a | approved (struck 3, 2 by lineup)
516 | orange heart bow, pink hearts on limbs and tips, propBuilder HEART_BOW (2cd491c9) | b | approved (struck 1)
515 | white layered feather wings on a magenta bar, propBuilder CUPID_WINGS (dd1e07c2) | a | approved (struck 1)
## Rejected (last 4)
## Notes (max 3 lines)
- 516: the unlit bow sits in the glow layer (glow-brightened); exclude it if a colour blocker comes up.
