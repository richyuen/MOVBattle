# spooky.vampire
Status: done   Audited: 434, 444 (CONFIRM: passed a, b, c)   Done: 444
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a PASS (444: team vest with a white V at mid-chest, white sleeves, dark belt band before the vest; hair, beard, fangs, spiked collar; CONFIRM 444)
b PASS (434: empty clawed Hungry Hands; CONFIRM 444)
c PASS (444: jumps onto the man and hangs at his neck drinking, blood welling; bat form for far men; CONFIRM 444)
d PASS (cost 200, hp 3.05x, cd 2.50x; 444 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
## Attempts (iter | gap | criterion | verdict)
434 | VAMPIRE_CLAWS empty clawed hands (b8e42cdb) | b | approved (b PASS)
437 | VAMPIRE_BAT bat form during the swoop (2c02833c) | c | approved (struck 1)
438-443 | VAMPIRE_HAIR, VAMPIRE_COLLAR, VAMPIRE_BEARD, VAMPIRE_VEST x2; cape gap rejected 442 | a | approved (struck 1, 3, 2)
438-439 | VAMPIRE_BITE latch + BITE_POSE x2 | c | dropped x2 (pose not visible in _release)
444 | VAMPIRE_LATCH jump onto the man, pinned at his neck, draughts + BLOOD_DRAIN (9e904930) | c | approved (struck 2; c PASS)
444 | VAMPIRE_VEST V .12 under the trunk top to mid-chest, torso-frame belt band (681b8603, d1b8f3f4) | a | approved (struck 4; a PASS)
## Rejected (last 4)
- white V [S] [1] - 442: cape arc gap + V .64 of W - chest read as a white shirt in an open jacket
## Notes (max 3 lines)
- Latch fallout (critic 444): his head rides above the man's head, not at the neck; his right arm stays up in the claw pose. Belt fallout: V a small floating triangle (vUnder .06, vWide .6 would meet the collar).
