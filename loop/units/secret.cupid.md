# secret.cupid
Status: open   Audited: 515 (AUDIT x2)   Done: -
## Verdicts
a FAIL (2 since 515, 3 struck)
 4. diaper in unit_secret.cupid_idle — TABS: cream cloth diaper on a bare team body; ours wears a team vest and tunic (ref: secret.cupid.blue.png)
 5. grey boots in unit_secret.cupid_idle — TABS: bare team feet (ref: secret.cupid.red.png)
b FAIL (1 since 515, 1 struck)
 2. arrow in unit_secret.cupid_windup — TABS: arrow with a pink heart head; ours is a plain dark shaft (ref: secret.cupid.blue.png)
c FAIL (0 since 515)
 1. projectile in unit_secret.cupid_release/_flight — TABS: heart-headed arrow trailing pink hearts; ours is a plain dark arrow with a steel tip (ref: secret.cupid.png)
 2. missing: lovestruck status — summary records only volley/missile/impact, and unit_secret.cupid_struck shows no hearts on the hit knight, who doesn't turn on his allies (ref: card Characteristics)
d PASS (516 stats)
## Ranked gaps
1. [S] secret.cupid.a diaper — blocker 4: bare team body, cream faceted diaper at the hips, no vest/tunic (secretDress cupidDiaper) — ref: reference/units/secret.cupid.blue.png — ours: unit_secret.cupid_idle.png
2. [S] secret.cupid.b heart arrow — blocker 2: pink heart arrowhead on the nocked arrow (propBuilder drawn_arrow, HEART_BOW's heart) — ref: reference/units/secret.cupid.blue.png — ours: unit_secret.cupid_windup.png
3. [S] secret.cupid.c heart projectile — blocker 1: heart-headed arrow trailing pink hearts (projectile shape + trail) — ref: reference/units/secret.cupid.png — ours: unit_secret.cupid_flight.png
## Attempts (iter | gap | criterion | verdict)
516 | golden curly mop, secretDress cupidHair (463d1578) | a | approved (struck 3, 2 by lineup)
516 | orange heart bow, pink hearts on limbs and tips, propBuilder HEART_BOW (2cd491c9) | b | approved (struck 1)
515 | white layered feather wings on a magenta bar, propBuilder CUPID_WINGS (dd1e07c2) | a | approved (struck 1)
## Rejected (last 4)
## Notes (max 3 lines)
- 516: the unlit bow sits in the glow layer (glow-brightened); exclude it if a colour blocker comes up.
