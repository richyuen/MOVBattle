# secret.cavalry
Status: done   Audited: 527 (AUDIT x2), 532 (CONFIRM: passed a, c, d; failed b), 533 (CONFIRM: passed a, c, d; failed b), 534 (CONFIRM: passed a, b, c, d)   Done: 534
## Verdicts
a PASS (532: struck 3, 4; CONFIRM 532, 533, 534 passed)
b PASS (534 [R]: struck 1, shield upright on his left; CONFIRM 534 passed)
c PASS (530: struck 1, pull-back charge and hoof shockwaves; CONFIRM 532, 534 passed)
d PASS (534 stats; CONFIRM 532, 534 passed)
## Ranked gaps
## Attempts (iter | gap | criterion | verdict)
534 | [R] Cavalry Shield stood upright on the hip frame beside the horse's neck, face forward, chin to below the saddle, CAV_SHIELD (48478b9e, 21b3bc3f) | b | approved (struck 1, b PASS; CONFIRM passed, D)
534 | evidence: unit_secret.cavalry_shield, rig 14, the idle's mirror (cb0fe209) | b | -
533 | big silver leaf spearhead with two hooked side blades, CAVALRY_HEAD (e5417888) | b | approved (struck 1; CONFIRM failed b: shield)
532 | grey plate arms, pauldrons, gorget under a team tabard; horse neck cloth and chest skirt (32b21a31, 31368387) | a | approved (struck 3, 4, a PASS)
527-531 | spear, flags, helm, seat lift, charge and shockwaves | a, b, c | approved
## Rejected (last 4)
## Notes (max 3 lines)
- The horse actor carries visual.special "mount_horse"; rider dress gates on special !== "mount_horse".
- 534 critics: shield cross reads white (TABS cream); pennant one strip along the shaft (TABS three hanging); minor.
- The shield side shows only in unit_secret.cavalry_shield; the weapon-side idle sees it past the horse's head.
