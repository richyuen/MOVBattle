# secret.gatling_gun
Status: open   Audited: 527 (AUDIT x2), 532 (CONFIRM: passed c, d; failed a, b), 534 (CONFIRM: passed a, b, c, d)   Done: -
## Verdicts
a PASS (533: struck 1, one operator; CONFIRM 534 passed)
b FAIL (0 since 534; CONFIRM 534 passed b, the gap critic added 3)
 3. barrel bundle hidden behind tall flat slab-sided trough cheeks in unit_secret.gatling_gun_windup (only the top of the barrels peeks over a closed grey box) — TABS: a low frame whose wavy top edge runs under the bundle's middle, so the barrels show above it from the side (ref: secret.gatling_gun.jpg) introduced by c9d9173d at vehicleBuilder.ts:buildGatlingGun (GATLING_TROUGH cheeks .hi over the axis)
c PASS (528: struck 1, bullets with tracer lines; CONFIRM 532, 534 passed)
d PASS (534 stats; CONFIRM 532, 534 passed)
## Ranked gaps
1. [S] secret.gatling_gun.b lower wavy-topped trough cheeks — blocker 3: cheeks under the bundle's centre line, scalloped top edge on each side — ref: secret.gatling_gun.jpg — ours: unit_secret.gatling_gun_windup.png
## Attempts (iter | gap | criterion | verdict)
534 | open trough frame: side cheeks, floor, scalloped front band, GATLING_TROUGH (c9d9173d) | b | approved (struck 2; added 3)
533 | one operator, loader actor dropped, scenarios crew=1 (ee015aa3) | a | approved (struck 1, a PASS)
533 | open barrel bundle round a dark core, rim-ring muzzles, front plate, GATLING_BUNDLE (4466da30) | b | approved (struck 1)
532 | crank gunner behind the breech, GATLING_STAND; shirt under a team vest (6307e0d6, 16b934a1) | a | approved (struck 2, 3)
528-531 | GATLING_CLUSTER; tracer bullets; GATLING_WHEELS; GATLING_HAIR | a, b, c | approved
## Rejected (last 4)
## Notes (max 3 lines)
- 534 critic: the frame shade is close to the barrels' grey (TABS charcoal frame on lighter barrels).
- 533 critic: no moustache on the operator; 532: idle right hand floats over the breech (minor).
- Hair and shirt gate on the crew actor with hat "none".
