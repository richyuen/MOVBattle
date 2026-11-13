# secret.gatling_gun
Status: open   Audited: 527 (AUDIT x2)   Done: -
## Verdicts
a FAIL (0 since 527)
 1. Operator headgear in unit_secret.gatling_gun_idle is a giant black top hat with a yellow dot floating over the gun — TABS: bare head with short dark hair (ref: secret.gatling_gun.red.png, .jpg)
 2. Operator in unit_secret.gatling_gun_idle sits low inside the cart — TABS: stands upright behind the gun, hands on the breech (ref: secret.gatling_gun.jpg)
 3. Operator clothing in unit_secret.gatling_gun_windup is plain team — TABS: a beige shirt with a team vest (ref: secret.gatling_gun.red.png; card Appearance)
 4. No mustache in unit_secret.gatling_gun_windup — TABS: a brown mustache (ref: secret.gatling_gun.red.png; card Appearance)
b PASS (530: struck 2, spoked field carriage)
c PASS (528: struck 1, bullets with tracer lines)
d PASS (530 stats)
## Ranked gaps
1. [S] secret.gatling_gun.a operator — blocker 1: bare head with short dark hair, no top hat (the crank_gunner actor's captain_hat) — ref: secret.gatling_gun.red.png — ours: unit_secret.gatling_gun_idle
## Attempts (iter | gap | criterion | verdict)
530 | field carriage: two tall spoked wooden wheels with team tyres on an axle, cradle on the axle, slab and small wheels gone, GATLING_WHEELS (a57ca606) | b | approved (struck 2, b PASS)
529 | eight-barrel cluster, two collars, breech, dark rails and yoke, side crank, GATLING_CLUSTER (9115e65d) | b | approved (struck 1)
528 | gatling_bullet projectile: brass slug, white tracer line, speed 48, GATLING_BULLET (9e007d5c) | c | approved (struck 1, c PASS)
## Rejected (last 4)
## Notes (max 3 lines)
- 530 critic: gun body pale grey, barrels read boxed (TABS dark slate cluster in an open trough; not a blocker).
- 530: the operators stood on the old chassis bed; with it gone check their seat (a.2) at the next pick.
- audit2 c adds an RPM ramp (starts slow, speeds up); 528 critic: not a blocker.
