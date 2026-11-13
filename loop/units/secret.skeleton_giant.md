# secret.skeleton_giant
Status: open   Audited: 527 (AUDIT x2), 533 (CONFIRM: passed b, c, d; failed a)   Done: -
## Verdicts
a FAIL (1 since 533, CONFIRM 533 list)
 1. squat build in unit_secret.skeleton_giant_idle: a wide team cloth block runs from mid-chest to the knees over short legs — TABS: a lanky skeleton with a thin rib cage, long thin bone legs, and ragged team shorts only from the hips to mid-thigh (ref: secret.skeleton_giant.jpg, secret.skeleton_giant.blue.png)
 2. rounded bucket helmet with boxy ear flaps and a front brim in unit_secret.skeleton_giant_idle — TABS: a Corinthian-style team helmet that falls like a hood to the shoulders, with long cheek guards framing the bone face (ref: secret.skeleton_giant.red.png, secret.skeleton_giant.jpg)
 3. oversized cream block feet in unit_secret.skeleton_giant_idle — TABS: small thin bone feet below the greaves (ref: secret.skeleton_giant.blue.png)
 4. greaves shown only as short team cuffs just below the knee in unit_secret.skeleton_giant_idle (red cuffs over the cream feet in lineup_secret_3) — TABS: team greaves running from knee to ankle over the shins (ref: secret.skeleton_giant.red.png; card Appearance "greaves")
b PASS (528: struck 2, Stiffy Shield; CONFIRM 533 passed)
c PASS (532: struck 1, sword chop with a slash arc; CONFIRM 533 passed)
d PASS (534 stats; CONFIRM 533 passed)
## Ranked gaps
1. [P] secret.skeleton_giant.a build — blocker 1: bulk 1.7 -> ~1.2 and GIANT_BUILD hem .42 -> ~.3, fallout of [S] 5144914b — ref: secret.skeleton_giant.jpg — ours: lineup_secret_3.png
2. [S] secret.skeleton_giant.a thin bone feet — blocker 3: small thin bone feet below the greaves — ref: secret.skeleton_giant.blue.png — ours: unit_secret.skeleton_giant_idle.png
3. [S] secret.skeleton_giant.a Corinthian hood helmet — blocker 2: team helmet falling to the shoulders with long cheek guards (GIANT_HELM) — ref: secret.skeleton_giant.jpg — ours: unit_secret.skeleton_giant_idle.png
4. [S] secret.skeleton_giant.a greaves — blocker 4: greaves knee to ankle (GIANT_GREAVE) — ref: secret.skeleton_giant.red.png — ours: unit_secret.skeleton_giant_idle
## Attempts (iter | gap | criterion | verdict)
534 | no skirt, slim pelvis, Stiffy shorts cut to mid-thigh, legLength .92 -> 1.2, GIANT_BUILD (5144914b) | a | approved (no strike)
533 | [P] scale 2.35 -> 3.0 (707b9ec2) | a | approved (struck 3; CONFIRM failed a)
532 | slash crescent GIANT_SLASH; team greaves GIANT_GREAVE (35fde574, e01c074c) | c, a | approved (c PASS; struck 5)
527-531 | Stiffy body; Giant Fear; Giant Stiffy Sword; GIANT_HELM; Stiffy Shield | a, b, c | approved
## Rejected (last 4)
## Notes (max 3 lines)
- 534 critic: cloth now starts at the waist and the legs are longer, but the shorts end just above the knee and the rib cage is about two heads wide (bulk 1.7).
- 531 critic: a team/grey torso slab shows behind the ribs (minor). Ability shots frame giant_fear (ABILITY_PREF).
- 527 critic: blade renders cool grey-white (TABS warm bone-tan).
