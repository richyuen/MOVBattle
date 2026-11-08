# secret.chu_ko_nu
Status: open   Audited: 500 (AUDIT x2)   Done: -
## Verdicts
a FAIL (0 since 500)
 1. hat in unit_secret.chu_ko_nu_idle — a black conical straw hat; TABS a topknot bun with a black/team headband (ref: secret.chu_ko_nu.red.png)
 2. tunic in unit_secret.chu_ko_nu_idle — a short team torso; TABS a long team robe to the knees with orange trim bands at the hem (ref: secret.chu_ko_nu.red.png)
 3. harness in unit_secret.chu_ko_nu_idle — none; TABS brown leather shoulder straps and a quiver strap (ref: secret.chu_ko_nu.red.png)
 4. belt in unit_secret.chu_ko_nu_idle — none; TABS a dark belt with a buckle and a hanging end (ref: secret.chu_ko_nu.red.png)
 5. leggings in unit_secret.chu_ko_nu_idle — plain legs; TABS banded wrapped leggings (ref: secret.chu_ko_nu.red.png)
b PASS (501 repeating crossbow across the chest)
c PASS (502 bolts leave the crossbow's nose)
d PASS (502 stats)
## Ranked gaps
1. [S] secret.chu_ko_nu.a topknot — blocker 1: replace the conical hat with a black bun and a black/team headband — ref: secret.chu_ko_nu.red.png — ours: unit_secret.chu_ko_nu_idle.png
2. [S] secret.chu_ko_nu.a robe — blocker 2: knee-length team robe with orange hem bands — ref: secret.chu_ko_nu.red.png — ours: unit_secret.chu_ko_nu_idle.png
## Attempts (iter | gap | criterion | verdict)
502 | "rcbMuzzle" slot on the crossbow nose, HAND_LAUNCH muzzle (b1963ee9) | c | approved (struck 1; c PASS)
501 | box stock, studded magazine with lever, wide swept bow arm, propBuilder REPEATING_CROSSBOW (87af4842) | b | approved (struck 1; b PASS)
## Rejected (last 4)
## Notes (max 3 lines)
- 501/502 DEFECTS: in _windup/_flight the crossbow rides upright behind the shoulder, prod pointing back, arm hanging (TABS level across the chest in both hands); a CONFIRM may fail b on it.
