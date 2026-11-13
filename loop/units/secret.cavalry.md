# secret.cavalry
Status: open   Audited: 527 (AUDIT x2), 532 (CONFIRM: passed a, c, d; failed b)   Done: -
## Verdicts
a PASS (532: struck 3, 4; CONFIRM 532 passed)
b FAIL (0 since 532, CONFIRM 532 list)
 1. spearhead in unit_secret.cavalry_windup — TABS: a large silver leaf-shaped blade, about a quarter of the spear's length, with two small side blades at its base (ref: secret.cavalry.red.png / .blue.png, card Appearance "spear head with two smaller ones")
c PASS (530: struck 1, pull-back charge and hoof shockwaves; CONFIRM 532 passed)
d PASS (532 stats; CONFIRM 532 passed)
## Ranked gaps
1. [S] secret.cavalry.b spearhead — blocker 1: steel leaf blade ~1/4 of the spear long with two side prongs at its base, unlit pale steel so it is not team-tinted (CAVALRY_SPEAR blade .13 reads as a needle) — ref: secret.cavalry.blue.png — ours: unit_secret.cavalry_windup
## Attempts (iter | gap | criterion | verdict)
532 | grey plate arms, pauldrons, gorget under a team tabard, cavalryArmour (32b21a31) | a | approved (struck 3)
532 | horse neck in team cloth and a chest skirt to the knees with cream hem, CAV_CHEST (horse style "cavalry" = secret_royal) (31368387) | a | approved (struck 4, a PASS)
531 | rider seated on the horse's back, CAVALRY_SEAT.lift .5 (0190b5cd) | a | approved (struck 2)
530 | CAVALRY_CHARGE pull-back and run through, hoof shockwave rings CAVALRY_WAVE (489d21ae) | c | approved (struck 1, c PASS)
527-529 | flagged team spear CAVALRY_SPEAR, [P] flagW/flagL, flagGap; grey knight helm CAV_HELM | b, a | approved (struck b.1-3, a.1)
## Rejected (last 4)
## Notes (max 3 lines)
- The horse actor carries visual.special "mount_horse"; rider dress gates on special !== "mount_horse". The cavalry horse is the only secret_royal horse (propBuilder style "cavalry").
- 532 critic: tabard chest shows pale chevron stripes (busier than TABS plain; minor); chest skirt has no peytral detail (minor).
- 530 critic: the shockwave reads as dust clods, not a pale ripple (not blocking).
