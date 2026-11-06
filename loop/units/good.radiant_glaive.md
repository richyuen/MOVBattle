# good.radiant_glaive
Status: open   Audited: 481 (AUDIT x2)   Done: -
## Verdicts
a FAIL (0 since 481)
 1. build in unit_good.radiant_glaive_idle: short bent legs under a broad vest — TABS: a slender upright long-legged fighter (ref: reference/units/good.radiant_glaive.red.png).
 2. headgear in unit_good.radiant_glaive_idle: brown hair and a green ring — TABS: a square gold helmet with a tall team diamond front and a trailing team strand (ref: reference/units/good.radiant_glaive.blue.png).
 3. torso dress in unit_good.radiant_glaive_idle: a plain dark team vest over bare arms — TABS: a gold-trimmed team vest over baggy white uneven sleeves (ref: reference/units/good.radiant_glaive.red.png).
 4. back dress in unit_good.radiant_glaive_idle: bare back outline — TABS: a team cape with a gold bottom line (ref: reference/units/good.radiant_glaive.jpg; card Appearance).
 5. lower dress in unit_good.radiant_glaive_idle: plain dark pants and grey boots — TABS: team pants carrying gold diamond and shin lines above short white gold-banded shoes (ref: reference/units/good.radiant_glaive.red.png).
b FAIL (2 since 481)
 3. shield carry in unit_good.radiant_glaive_windup.png: the round board floats in front of the torso while the empty left hand trails behind the hip — TABS: the shield is carried on the off hand/forearm (ref: reference/units/good.radiant_glaive.red.png; card Off Hand) (introduced by aa07d7e5 at web/src/units/propBuilder.ts:attachProps).
c FAIL (0 since 481)
 1. attack in unit_good.radiant_glaive_release and unit_good.radiant_glaive_flight: the halberd remains gripped through a melee swing — TABS: the glaive is thrown as a glowing bouncing projectile (ref: reference/units/good.radiant_glaive.jpg; loop/cards/good.radiant_glaive.md Characteristics).
d PASS (483 stats)
## Ranked gaps
1. [S] good.radiant_glaive.b connected shield carry — blocker 3: left-forearm mount and carry pose keep the shield connected in idle and windup — ref: reference/units/good.radiant_glaive.red.png — ours: unit_good.radiant_glaive_windup.png.
10. [S] good.radiant_glaive.c bouncing throw — blocker 1: release the curved glaive as a luminous bouncing projectile — ref: loop/cards/good.radiant_glaive.md Characteristics — ours: unit_good.radiant_glaive_release.png and unit_good.radiant_glaive_flight.png.
## Attempts (iter | gap | criterion | verdict)
483 | luminous shield (aa07d7e5) | b | approved (struck 1; added b.3)
482 | curved gold glaive (8a86950f) | b | approved (struck 1)
## Rejected (last 4)
## Notes (max 3 lines)
- 483 luminous disc cleared b.2; new b.3 attributed to its torso-rooted mount; connect offhand/forearm next.
