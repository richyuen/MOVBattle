# secret.gatling_gun
Status: open   Audited: 527 (AUDIT x2), 532 (CONFIRM: passed c, d; failed a, b)   Done: -
## Verdicts
a FAIL (0 since 532, CONFIRM 532 list)
 1. second, smaller crewman beside the gun in unit_secret.gatling_gun_idle — TABS: a single Gatling Gun Operator behind the gun (ref: secret.gatling_gun.red.png / .blue.png / .jpg, card Characteristics "operated by a Gatling Gun Operator")
b FAIL (0 since 532, CONFIRM 532 list)
 1. barrel cluster in unit_secret.gatling_gun_windup — TABS: a bundle of about 8 separate grey barrels held by ring collars (ref: secret.gatling_gun.red.png, secret.gatling_gun.jpg)
 2. gun frame in unit_secret.gatling_gun_windup — TABS: a dark open trough frame along both sides of the barrel bundle with a wavy front edge (ref: secret.gatling_gun.red.png)
c PASS (528: struck 1, bullets with tracer lines; CONFIRM 532 passed)
d PASS (532 stats; CONFIRM 532 passed)
## Ranked gaps
1. [S] secret.gatling_gun.a one operator — blocker 1: drop the loader actor (linkedActorPresets; scenarios count crew=2: update composite_gatling_gun/operator_gatling_gun_crank_loss) — ref: secret.gatling_gun.jpg — ours: unit_secret.gatling_gun_idle
2. [S] secret.gatling_gun.b open barrel bundle — blocker 1: separate barrels read apart (gaps, dark rod between), not one grooved tube — ref: secret.gatling_gun.red.png — ours: unit_secret.gatling_gun_windup
3. [S] secret.gatling_gun.b open trough — blocker 2: dark open side frame with a wavy front, no solid grey box mount — ref: secret.gatling_gun.red.png — ours: unit_secret.gatling_gun_windup
## Attempts (iter | gap | criterion | verdict)
532 | crank gunner full height behind the breech, hands on it, GATLING_STAND (RU), offset -.78, scale .92 (6307e0d6) | a | approved (struck 2)
532 | beige unlit shirt and sleeves under a team vest with a V, gatlingGunnerShirt (16b934a1) | a | approved (struck 3, a PASS; CONFIRM failed a)
531 | crank gunner bare-headed, short dark hair with a quiff, GATLING_HAIR (bab41712) | a | approved (struck 1; 4 by lineup)
530 | field carriage: two tall spoked wheels with team tyres on an axle, GATLING_WHEELS (a57ca606) | b | approved (struck 2, b PASS)
529 | eight-barrel cluster, collars, breech, rails, side crank, GATLING_CLUSTER (9115e65d) | b | approved (struck 1)
528 | gatling_bullet projectile: brass slug, white tracer line, GATLING_BULLET (9e007d5c) | c | approved (struck 1, c PASS)
## Rejected (last 4)
## Notes (max 3 lines)
- 532 critic: idle right hand floats over the breech (GATLING_STAND only reads in windup); no moustache (card Appearance; minor).
- 530 critic: gun body pale grey, barrels read boxed (TABS dark slate cluster in an open trough) — now CONFIRM b.1/b.2.
- Hair and shirt gate on the crew actor with hat "none" (the loader keeps his bandana).
