# secret.artemis
Status: open   Audited: 538 (AUDIT x2), 546 (CONFIRM: failed a, b, c), 547 (RE-AUDIT x2, c.2), 550 (CONFIRM: passed b, c; failed a), 551 (CONFIRM: passed b, c; failed a), 552 (CONFIRM: passed a; gap critic kept a.1)   Done: -
## Verdicts
a FAIL (0 since 552, [R] 552 struck 2)
 1. build in unit_secret.artemis_idle — squat block figure: the dress hides the legs down to the feet, so the visible legs are a fraction of the height. TABS: a lanky wobbler whose legs are about half the height, with long bare shins (ref: secret.artemis.red.png, secret.artemis.jpg)
b PASS (549: struck 1; CONFIRM 550, 551)
c PASS (549: struck 1; CONFIRM 550, 551)
d PASS (552 stats)
## Ranked gaps
1. [S] secret.artemis.a build — blocker 1: artemisDress hem measured after the 1.4 leg stretch, so the skirt ends just under the knee and the long bare shins show — ref: secret.artemis.red.png, secret.artemis.jpg — ours: unit_secret.artemis_idle.png
## Attempts (iter | gap | criterion | verdict)
552 | [R] legs 1.4 + lowerLegWidth .85, ARTEMIS_DRESS on the hip, hem .14 under the knee, bare legs in the arm shade (ff45c728) | a | approved (struck 2; CONFIRM passed a, gap critic kept 1)
551 | [R] leather back quiver ARTEMIS_QUIVER (a2d3db32) | a | approved (struck 1; CONFIRM failed a)
550 | open strap sandals ARTEMIS_SANDAL (b4f1b1e3) | a | approved (struck 2; CONFIRM failed a)
549 | drawing fist on the nock ARTEMIS_NOCK (57b5c54c); charged shaft ARTEMIS_SHAFT (a4d86a7a) | b, c | approved (b, c PASS)
539-548 | band, dress, chiton, bow, fan volley, bun and braid, bodice, charged arrow, split string | a, b, c | approved
## Rejected (last 4)
## Notes (max 3 lines)
- 552 critic: the hem lands ~2/3 down the shin, not .14 under the knee: kneeY/footY in the hip frame may miss the 1.4 stretch; measure joint world positions.
- 552 CONFIRM leftover: head top a flat yellow cylinder (TABS a rounded orange ridged bun).
- The quiver must not return as the old propBuilder hip one.
