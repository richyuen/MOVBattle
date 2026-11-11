# secret.chu_ko_nu
Status: open   Audited: 500 (AUDIT x2), 510 (CONFIRM: passed d; failed a, b, c)   Done: -
## Verdicts
a FAIL (0 since 510 CONFIRM)
 1. Exposed stick-thin upper arm in unit_secret.chu_ko_nu_idle — TABS: full blue shirt sleeve reaches the cuff (ref: reference/units/secret.chu_ko_nu.blue.png).
b FAIL (0 since 510 CONFIRM)
 1. Both hands hang clear of the stock in unit_secret.chu_ko_nu_windup — TABS: both hands support the crossbow (ref: reference/units/secret.chu_ko_nu.jpg).
 2. Deep rectangular receiver dominates the torso in unit_secret.chu_ko_nu_idle — TABS: a narrower magazine sits above the stock, leaving the limbs as the dominant crossbow span (ref: reference/units/secret.chu_ko_nu.blue.png).
c FAIL (0 since 510 CONFIRM)
 1. Bolt train crosses the air above the visible weapon in unit_secret.chu_ko_nu_flight — TABS: the repeating crossbow bolts should leave the crossbow rail (ref: loop/cards/secret.chu_ko_nu.md, Weapons).
d PASS (509 stats)
## Ranked gaps
1. [S] secret.chu_ko_nu.a full sleeves — blocker 1: dress both upper arms in full team-blue sleeves with pale cuffs — ref: secret.chu_ko_nu.blue.png — ours: unit_secret.chu_ko_nu_idle.png
2. [S] secret.chu_ko_nu.b two-handed carry — blocker 1: seat both hands on the stock through windup — ref: secret.chu_ko_nu.jpg — ours: unit_secret.chu_ko_nu_windup.png
3. [S] secret.chu_ko_nu.c bolt origin — blocker 1: align the burst with the visible rail throughout firing — ref: card Weapons — ours: unit_secret.chu_ko_nu_flight.png
## Attempts (iter | gap | criterion | verdict)
510 | waist strap, square buckle and hanging end (e8df8cbb, f1846fde) | a | approved (struck 4; CONFIRM failed a, b, c)
509 | waist belt (c3516851, reverted b317dbe1): hidden by crossbow in idle | a | dropped [S]
508 | leather shoulder harness and quiver (9b629415) | a | approved (struck 3)
506 | two overlapping robe tiers with orange hems (3b148781) | a | approved (struck 2)
503 | black hair, tall bun ringed in team, black headband with a team stripe, no conical hat, secretDress chuKoNuTopknot (945b798f) | a | approved (struck 1; 5 struck by lineup)
502 | "rcbMuzzle" slot on the crossbow nose, HAND_LAUNCH muzzle (b1963ee9) | c | approved (struck 1; c PASS)
501 | box stock, studded magazine with lever, wide swept bow arm, propBuilder REPEATING_CROSSBOW (87af4842) | b | approved (struck 1; b PASS)
## Rejected (last 4)
## Notes (max 3 lines)
- 510: opposite-side idle exposes the belt. The buckle passes the gap review but is partly obscured in that view.
