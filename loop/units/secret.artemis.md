# secret.artemis
Status: done   Audited: 538 (AUDIT x2), 546 (CONFIRM: failed a, b, c), 547 (RE-AUDIT x2, c.2), 550 (CONFIRM: passed b, c; failed a), 551 (CONFIRM: passed b, c; failed a), 552 (CONFIRM: passed a; gap critic kept a.1), 553 (CONFIRM: passed a, b, c; gap critic added a.2), 554 (CONFIRM: passed a, b, c)   Done: 554
## Verdicts
a PASS (554: struck 2; CONFIRM 552, 553, 554)
b PASS (549: struck 1; CONFIRM 550, 551, 553)
c PASS (549: struck 1; CONFIRM 550, 551, 553)
d PASS (554 stats)
## Ranked gaps
## Attempts (iter | gap | criterion | verdict)
554 | [P] artemisPeplum in the ARTEMIS_CHITON cloth, not the bare-arm material (2c63862f) | a | approved (struck 2; a PASS)
553 | straight shallow skirt to the knee (flare 1.18, deep .9, hem .02) under a light peplum ARTEMIS_DRESS (d041bc48) | a | approved (struck 1; added 2: peplum in the arm material)
552 | [R] legs 1.4 + lowerLegWidth .85, ARTEMIS_DRESS on the hip, hem .14 under the knee, bare legs in the arm shade (ff45c728) | a | approved (struck 2; CONFIRM passed a, gap critic kept 1)
551 | [R] leather back quiver ARTEMIS_QUIVER (a2d3db32) | a | approved (struck 1; CONFIRM failed a)
550 | open strap sandals ARTEMIS_SANDAL (b4f1b1e3) | a | approved (struck 2; CONFIRM failed a)
539-549 | band, dress, chiton, bow, fan volley, bun and braid, bodice, charged arrow, split string, nock, shaft | a, b, c | approved
## Rejected (last 4)
## Notes (max 3 lines)
- Probe 553: hip 1.44, knee .73, head top 2.61 m.
- The quiver must not return as the old propBuilder hip one.
