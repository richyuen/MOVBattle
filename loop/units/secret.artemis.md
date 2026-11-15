# secret.artemis
Status: open   Audited: 538 (AUDIT x2), 546 (CONFIRM: failed a, b, c), 547 (RE-AUDIT x2, c.2), 550 (CONFIRM: passed b, c; failed a), 551 (CONFIRM: passed b, c; failed a), 552 (CONFIRM: passed a; gap critic kept a.1), 553 (CONFIRM: passed a, b, c; gap critic added a.2)   Done: -
## Verdicts
a FAIL (1 since 552, [R] 552 struck 2; 553 struck 1)
 2. light skin-shade peplum band between the bodice and the dark skirt in unit_secret.artemis_idle, reading as a bare midriff — TABS: the tunic is one team cloth from the shoulders to its hem over the darker skirt (ref: secret.artemis.red.png, secret.artemis.blue.png)
b PASS (549: struck 1; CONFIRM 550, 551, 553)
c PASS (549: struck 1; CONFIRM 550, 551, 553)
d PASS (553 stats)
## Ranked gaps
1. [S] secret.artemis.a peplum reads as a bare midriff — blocker 2: give the artemisPeplum mesh the tunic/bodice cloth instead of the bare-arm material (secretDress.ts:artemisDress) — ref: secret.artemis.blue.png — ours: unit_secret.artemis_idle
## Attempts (iter | gap | criterion | verdict)
553 | straight shallow skirt to the knee (flare 1.18, deep .9, hem .02) under a light peplum ARTEMIS_DRESS (d041bc48) | a | approved (struck 1; added 2: peplum in the arm material)
552 | [R] legs 1.4 + lowerLegWidth .85, ARTEMIS_DRESS on the hip, hem .14 under the knee, bare legs in the arm shade (ff45c728) | a | approved (struck 2; CONFIRM passed a, gap critic kept 1)
551 | [R] leather back quiver ARTEMIS_QUIVER (a2d3db32) | a | approved (struck 1; CONFIRM failed a)
550 | open strap sandals ARTEMIS_SANDAL (b4f1b1e3) | a | approved (struck 2; CONFIRM failed a)
539-549 | band, dress, chiton, bow, fan volley, bun and braid, bodice, charged arrow, split string, nock, shaft | a, b, c | approved
## Rejected (last 4)
## Notes (max 3 lines)
- Probe 553: hip 1.44, knee .73, hem was .61, head top 2.61 m; the hem was right, the wide deep cone hid the shins.
- 553 CONFIRM passed a, b, c: fixing a.2 (a material swap on artemisPeplum, use the chiton/torso cloth) makes her D.
- The quiver must not return as the old propBuilder hip one.
