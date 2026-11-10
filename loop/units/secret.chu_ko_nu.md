# secret.chu_ko_nu
Status: open   Audited: 500 (AUDIT x2)   Done: -
## Verdicts
a FAIL (3 since 500, 4 struck)
 4. belt in unit_secret.chu_ko_nu_idle — none; TABS a dark belt with a buckle and a hanging end (ref: secret.chu_ko_nu.red.png)
b PASS (501 repeating crossbow across the chest)
c PASS (502 bolts leave the crossbow's nose)
d PASS (509 stats)
## Ranked gaps
1. [S] secret.chu_ko_nu.a buckle the robe at the waist — blocker 4: fit a dark belt with a square buckle and a hanging leather end — ref: secret.chu_ko_nu.red.png — ours: unit_secret.chu_ko_nu_idle.png
## Attempts (iter | gap | criterion | verdict)
509 | waist belt (c3516851, reverted b317dbe1): hidden by crossbow in idle | a | dropped [S]
508 | leather shoulder harness and quiver (9b629415) | a | approved (struck 3)
506 | two overlapping robe tiers with orange hems (3b148781) | a | approved (struck 2)
503 | black hair, tall bun ringed in team, black headband with a team stripe, no conical hat, secretDress chuKoNuTopknot (945b798f) | a | approved (struck 1; 5 struck by lineup)
502 | "rcbMuzzle" slot on the crossbow nose, HAND_LAUNCH muzzle (b1963ee9) | c | approved (struck 1; c PASS)
501 | box stock, studded magazine with lever, wide swept bow arm, propBuilder REPEATING_CROSSBOW (87af4842) | b | approved (struck 1; b PASS)
## Rejected (last 4)
## Notes (max 3 lines)
- Evidence commit first: crossbow hides the waist in idle; re-aim before retrying belt.
- 501/502 DEFECTS: in _windup/_flight the crossbow rides upright behind the shoulder, prod pointing back, arm hanging (TABS level across the chest in both hands); a CONFIRM may fail b on it.
- 503 DEFECTS: hair and bun render dark maroon-brown.
