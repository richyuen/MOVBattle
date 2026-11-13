# secret.gatling_gun
Status: open   Audited: 527 (AUDIT x2)   Done: -
## Verdicts
a FAIL (0 since 527)
 1. Operator headgear in unit_secret.gatling_gun_idle is a giant black top hat with a yellow dot floating over the gun — TABS: bare head with short dark hair (ref: secret.gatling_gun.red.png, .jpg)
 2. Operator in unit_secret.gatling_gun_idle sits low inside the cart — TABS: stands upright behind the gun, hands on the breech (ref: secret.gatling_gun.jpg)
 3. Operator clothing in unit_secret.gatling_gun_windup is plain team — TABS: a beige shirt with a team vest (ref: secret.gatling_gun.red.png; card Appearance)
 4. No mustache in unit_secret.gatling_gun_windup — TABS: a brown mustache (ref: secret.gatling_gun.red.png; card Appearance)
b FAIL (0 since 527)
 1. Gun in unit_secret.gatling_gun_idle is three separate thin pipes out of a box — TABS: one long cluster of ~8 barrels held by rings in a long dark frame (ref: secret.gatling_gun.red.png)
 2. Carriage in unit_secret.gatling_gun_idle is a flat blue slab on four small solid wheels — TABS: an axle with two tall spoked wheels with team rims (ref: secret.gatling_gun.red.png, .jpg)
c PASS (528: struck 1, bullets with tracer lines)
d PASS (528 stats)
## Ranked gaps
1. [S] secret.gatling_gun.b barrel cluster — blocker 1: one long cluster of ~8 barrels held by two collar rings, a side crank, a frame — ref: secret.gatling_gun.red.png — ours: unit_secret.gatling_gun_idle
2. [S] secret.gatling_gun.a operator — blocker 1: bare head with short dark hair, no top hat — ref: secret.gatling_gun.red.png — ours: unit_secret.gatling_gun_idle
## Attempts (iter | gap | criterion | verdict)
528 | gatling_bullet projectile: brass slug, white tracer line, speed 48, GATLING_BULLET (9e007d5c) | c | approved (struck 1, c PASS)
## Rejected (last 4)
## Notes (max 3 lines)
- audit2 c adds an RPM ramp (starts slow, speeds up); 528 critic: not a blocker.
