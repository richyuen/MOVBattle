# secret.cavalry
Status: open   Audited: 527 (AUDIT x2), 532 (CONFIRM: passed a, c, d; failed b), 533 (CONFIRM: passed a, c, d; failed b)   Done: -
## Verdicts
a PASS (532: struck 3, 4; CONFIRM 532, 533 passed)
b FAIL plateau (0 since 533, CONFIRM 533 list; CONFIRM failed b twice: next pick one [R])
 1. off-hand shield lying flat across the rider's lap in unit_secret.cavalry_idle (face-up, seen from above behind the horse's chanfron) and edge-on as a thin dark bar in unit_secret.cavalry_windup — TABS: a big heater shield held upright on the rider's left beside the horse's neck, face forward, team colour with a cream cross, about shoulder to hip in size (ref: secret.cavalry.red.png, secret.cavalry.blue.png; card Characteristics "Cavalry Shield")
c PASS (530: struck 1, pull-back charge and hoof shockwaves; CONFIRM 532 passed)
d PASS (533 stats; CONFIRM 532 passed)
## Ranked gaps
1. [R] secret.cavalry.b mounted shield hold — blocker 1: specify from CONFIRM 532 (spearhead, cleared 533) and 533 (shield) lists; re-seat the kite shield upright on the rider's left arm beside the horse's neck, face forward, shoulder-to-hip sized, held through windup — ref: secret.cavalry.red.png — ours: unit_secret.cavalry_idle, _windup
## Attempts (iter | gap | criterion | verdict)
533 | big silver leaf spearhead with two hooked side blades, CAVALRY_HEAD (e5417888) | b | approved (struck 1; CONFIRM failed b: shield)
532 | grey plate arms, pauldrons, gorget under a team tabard, cavalryArmour (32b21a31) | a | approved (struck 3)
532 | horse neck in team cloth and chest skirt, CAV_CHEST (31368387) | a | approved (struck 4, a PASS)
531 | rider seated on the horse's back, CAVALRY_SEAT.lift .5 (0190b5cd) | a | approved (struck 2)
530 | CAVALRY_CHARGE pull-back and run through, CAVALRY_WAVE (489d21ae) | c | approved (struck 1, c PASS)
527-529 | flagged team spear CAVALRY_SPEAR, [P] flagW/flagL, flagGap; grey knight helm CAV_HELM | b, a | approved (struck b.1-3, a.1)
## Rejected (last 4)
## Notes (max 3 lines)
- The horse actor carries visual.special "mount_horse"; rider dress gates on special !== "mount_horse". The cavalry horse is the only secret_royal horse (propBuilder style "cavalry").
- 533 critic: spear side hooks thin and short (TABS clear little crescents; minor).
- 532 critic: tabard chest pale chevron stripes; chest skirt no peytral detail (minor).
