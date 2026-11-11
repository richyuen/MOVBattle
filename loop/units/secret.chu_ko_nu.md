# secret.chu_ko_nu
Status: open   Audited: 500 (AUDIT x2), 510 (CONFIRM: passed d; failed a, b, c), 511 (RE-AUDIT a, b x2)   Done: -
## Verdicts
a FAIL (2 since 511 RE-AUDIT, 2 struck)
 3. Tunic skirt stops at mid-thigh in unit_secret.chu_ko_nu_idle — TABS: knee-length team-coloured skirt with two orange hem bands (ref: reference/units/secret.chu_ko_nu.red.png).
 4. Plain shins in unit_secret.chu_ko_nu_idle — TABS: wrapped leggings with stacked orange/dark bands from knee to ankle (ref: reference/units/secret.chu_ko_nu.blue.png).
b FAIL (1 since 511 RE-AUDIT, 2 struck)
 2. Deep rectangular receiver dominates the torso in unit_secret.chu_ko_nu_idle — TABS: a narrower magazine sits above the stock, leaving the limbs as the dominant crossbow span (ref: reference/units/secret.chu_ko_nu.blue.png).
 4. Crossbow held upright with its limbs at hip height in unit_secret.chu_ko_nu_idle — TABS: held level across the chest, limbs at chest height and the stock running diagonally across the body (ref: reference/units/secret.chu_ko_nu.blue.png).
 5. crossbow in unit_secret.chu_ko_nu_windup — laid level but pointing backwards, prod and magazine trailing behind him away from the man he faces — TABS: the crossbow points ahead of him toward the enemy (ref: reference/units/secret.chu_ko_nu.jpg)
c FAIL (1 since 510 CONFIRM)
 1. Bolt train crosses the air above the visible weapon in unit_secret.chu_ko_nu_flight — TABS: the repeating crossbow bolts should leave the crossbow rail (ref: loop/cards/secret.chu_ko_nu.md, Weapons).
d PASS (514 stats)
## Ranked gaps
1. [S] secret.chu_ko_nu.a leggings — blocker 4: stacked orange/dark wrap bands from knee to ankle (secretDress chuKoNuLeggings) — ref: reference/units/secret.chu_ko_nu.blue.png — ours: unit_secret.chu_ko_nu_idle.png
2. [S] secret.chu_ko_nu.a skirt length — blocker 3: robe lower tier to the knee with two orange hem bands (secretDress chuKoNuRobe) — ref: reference/units/secret.chu_ko_nu.red.png — ours: unit_secret.chu_ko_nu_idle.png
3. [S] secret.chu_ko_nu.b bow lay — blocker 5: crossbow laid toward the current target every frame, backing off included — ref: reference/units/secret.chu_ko_nu.jpg — ours: unit_secret.chu_ko_nu_windup.png
## Attempts (iter | gap | criterion | verdict)
514 | loose team shirt sleeves to the wrist, secretDress chuKoNuSleeves (01ec5768) | a | approved (struck 1)
514 | cream unlit mitts with wrist bands, secretDress chuKoNuMitts (d85e50bc) | a | approved (struck 2)
514 | bow toward readyAim, lay flipped (09540a69, reverted 4d6431b2) | b | rejected
511 | level two-fist crossbow hold, PA _holdRepeatingCrossbow (7f696d24, 44e1c3fa) | b | approved (struck 1, 3; added 5)
511 | timed bolt train off the rail, SS RCB_VOLLEY (feef9d94) | c | approved (no strike: bow held reversed)
503-510 | hair/bun, robe tiers, harness, belt | a | approved
## Rejected (last 4)
514 | b.5 (09540a69) | attempts 1 | windup is a back-off without readyAim: bow trails
## Notes (max 3 lines)
- 514 probe: lay FromLookDirectionLH(-fwd) put the muzzle .5 m behind the fist; (fwd) puts it .7 m ahead. readyAim is only called in SS's press branch.
- 511: re-judge c.1 once the bow faces the man.
