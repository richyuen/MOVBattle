# secret.skeleton_giant
Status: open   Audited: 527 (AUDIT x2), 533 (CONFIRM: passed b, c, d; failed a)   Done: -
## Verdicts
a FAIL (0 since 533, CONFIRM 533 list)
 1. squat build in unit_secret.skeleton_giant_idle: a wide team cloth block runs from mid-chest to the knees over short legs — TABS: a lanky skeleton with a thin rib cage, long thin bone legs, and ragged team shorts only from the hips to mid-thigh (ref: secret.skeleton_giant.jpg, secret.skeleton_giant.blue.png)
 2. rounded bucket helmet with boxy ear flaps and a front brim in unit_secret.skeleton_giant_idle — TABS: a Corinthian-style team helmet that falls like a hood to the shoulders, with long cheek guards framing the bone face (ref: secret.skeleton_giant.red.png, secret.skeleton_giant.jpg)
 3. oversized cream block feet in unit_secret.skeleton_giant_idle — TABS: small thin bone feet below the greaves (ref: secret.skeleton_giant.blue.png)
 4. greaves shown only as short team cuffs just below the knee in unit_secret.skeleton_giant_idle (red cuffs over the cream feet in lineup_secret_3) — TABS: team greaves running from knee to ankle over the shins (ref: secret.skeleton_giant.red.png; card Appearance "greaves")
b PASS (528: struck 2, Stiffy Shield; CONFIRM 533 passed)
c PASS (532: struck 1, sword chop with a slash arc; CONFIRM 533 passed)
d PASS (533 stats; CONFIRM 533 passed)
## Ranked gaps
1. [S] secret.skeleton_giant.a lanky build — blocker 1: ragged shorts hips to mid-thigh only (retire the chest-to-knee skirt), longer thin bone legs — ref: secret.skeleton_giant.jpg — ours: unit_secret.skeleton_giant_idle
2. [S] secret.skeleton_giant.a Corinthian helm — blocker 2: hood-like helm down to the shoulders with long cheek guards (GIANT_HELM) — ref: secret.skeleton_giant.red.png — ours: unit_secret.skeleton_giant_idle
3. [S] secret.skeleton_giant.a greaves and feet — blocker 4: greaves knee to ankle (GIANT_GREAVE), then small bone feet (3) — ref: secret.skeleton_giant.red.png — ours: unit_secret.skeleton_giant_idle
## Attempts (iter | gap | criterion | verdict)
533 | [P] scale 2.35 -> 3.0 (707b9ec2) | a | approved (struck 3; CONFIRM failed a)
532 | slash crescent, GIANT_SLASH (SS) (35fde574) | c | approved (struck 1, c PASS)
532 | team greaves over the bone shins, GIANT_GREAVE (e01c074c) | a | approved (struck 5)
531 | Stiffy bone body via dressSkeleton (aad23125) | a | approved (struck 1, 4)
531 | Giant Fear burst, GIANT_FEAR (d7859f2a) | c | approved (struck 2)
527-528 | Giant Stiffy Sword; GIANT_HELM; Stiffy Shield | b, a | approved (struck b.1, b.2, a.2)
## Rejected (last 4)
## Notes (max 3 lines)
- 532 critic: the slash arc is lerped between him and the man, not off the blade; anchor to the sword's sweep if c is reopened.
- 531 critic: a team/grey torso slab shows behind the ribs (minor). Ability shots frame giant_fear (ABILITY_PREF).
- 527 critic: blade renders cool grey-white (TABS warm bone-tan).
