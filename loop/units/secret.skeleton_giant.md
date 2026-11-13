# secret.skeleton_giant
Status: open   Audited: 527 (AUDIT x2), 533 (CONFIRM: passed b, c, d; failed a)   Done: -
## Verdicts
a FAIL (1 since 533, CONFIRM 533 list, 3 struck)
 2. rounded bucket helmet with boxy ear flaps and a front brim in unit_secret.skeleton_giant_idle — TABS: a Corinthian-style team helmet that falls like a hood to the shoulders, with long cheek guards framing the bone face (ref: secret.skeleton_giant.red.png, secret.skeleton_giant.jpg)
 3. oversized cream block feet in unit_secret.skeleton_giant_idle — TABS: small thin bone feet below the greaves (ref: secret.skeleton_giant.blue.png)
b PASS (528: struck 2, Stiffy Shield; CONFIRM 533 passed)
c PASS (532: struck 1, sword chop with a slash arc; CONFIRM 533 passed)
d PASS (535 stats; CONFIRM 533 passed)
## Ranked gaps
1. [S] secret.skeleton_giant.a Corinthian hood helmet — blocker 2: replace the bucket in skeletonGiantHelm: a crown falling as a hood to the shoulders, long cheek guards down both sides of the bone face, an eye slot — ref: secret.skeleton_giant.jpg — ours: unit_secret.skeleton_giant_idle
2. [S] secret.skeleton_giant.a thin bone feet — blocker 3: small thin bone feet below the greaves, in place of the cream blocks — ref: secret.skeleton_giant.blue.png — ours: unit_secret.skeleton_giant_idle
## Attempts (iter | gap | criterion | verdict)
535 | [P] bulk 1.7 -> 1.2, GIANT_BUILD hem .42 -> .3 (9d4cbe06) | a | approved (struck 1, 4 by lineup)
534 | no skirt, slim pelvis, Stiffy shorts to mid-thigh, legLength .92 -> 1.2, GIANT_BUILD (5144914b) | a | approved (no strike)
533 | [P] scale 2.35 -> 3.0 (707b9ec2) | a | approved (struck 3; CONFIRM failed a)
532 | slash crescent GIANT_SLASH; team greaves GIANT_GREAVE (35fde574, e01c074c) | c, a | approved (c PASS; struck 5)
527-531 | Stiffy body; Giant Fear; Giant Stiffy Sword; GIANT_HELM; Stiffy Shield | a, b, c | approved
## Rejected (last 4)
## Notes (max 3 lines)
- 535 critic: shorts hip to thigh, ribs bare, greaves knee to ankle now read in the lineup; helmet and feet remain.
- 531 critic: a team/grey torso slab shows behind the ribs (minor). Ability shots frame giant_fear (ABILITY_PREF).
- 527 critic: blade renders cool grey-white (TABS warm bone-tan).
