# secret.gatling_gun
Status: open   Audited: 527 (AUDIT x2), 532 (CONFIRM: passed c, d; failed a, b)   Done: -
## Verdicts
a PASS (533: struck 1, one operator)
b FAIL (1 since 532, CONFIRM 532 list)
 2. gun frame in unit_secret.gatling_gun_windup — TABS: a dark open trough frame along both sides of the barrel bundle with a wavy front edge (ref: secret.gatling_gun.red.png)
c PASS (528: struck 1, bullets with tracer lines; CONFIRM 532 passed)
d PASS (533 stats; CONFIRM 532 passed)
## Ranked gaps
1. [S] secret.gatling_gun.b open trough — blocker 2: replace the grey box and rails with two dark side cheeks along the bundle, joined under it, a scalloped front edge below the muzzles (vehicleBuilder buildGatlingGun) — ref: secret.gatling_gun.red.png — ours: unit_secret.gatling_gun_windup
## Attempts (iter | gap | criterion | verdict)
533 | one operator, loader actor dropped, scenarios crew=1 (ee015aa3) | a | approved (struck 1, a PASS)
533 | open barrel bundle round a dark core, rim-ring muzzles, front plate, GATLING_BUNDLE (4466da30) | b | approved (struck 1)
532 | crank gunner full height behind the breech, GATLING_STAND (6307e0d6) | a | approved (struck 2)
532 | beige shirt under a team vest, gatlingGunnerShirt (16b934a1) | a | approved (struck 3, a PASS; CONFIRM failed a)
531 | bare head, dark hair with a quiff, GATLING_HAIR (bab41712) | a | approved (struck 1; 4 by lineup)
530 | two tall spoked wheels, GATLING_WHEELS (a57ca606) | b | approved (struck 2, b PASS)
528-529 | GATLING_CLUSTER (9115e65d); gatling_bullet tracer (9e007d5c) | b, c | approved
## Rejected (last 4)
## Notes (max 3 lines)
- 533 critic: no moustache on the operator (card Appearance; CONFIRM's call).
- 532 critic: idle right hand floats over the breech (GATLING_STAND only reads in windup).
- Hair and shirt gate on the crew actor with hat "none".
