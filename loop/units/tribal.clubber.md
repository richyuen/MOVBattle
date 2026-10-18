# tribal.clubber
Status: done   Audited: 315   Done: 325
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a PASS (325)
b PASS (317)
c PASS (315)
d PASS (stats 317: cost 70=70, hp 1.00x, dmg 1.00x, cd 1.00x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
(none)
## Attempts (iter | gap | criterion | verdict)
316 | club mesh (3af648b) | b | approved
317 | two-handed grip (6a1bbe4) | b | approved
322 | hair and beard (940436d) | a | approved
323 | ornamented loincloth (914ddb9) | a | approved
324 | tusk necklace (54f0b6b) | a | approved
325 | bracelets, joins BRACELETS (e8a2cc0) | a | approved
## Rejected (last 4)
## Notes (max 3 lines)
- 316 club: CreateTube radius profile (CLUB_LONG/GRIP/HEAD). 317: _offhandToGrip solves the left arm onto the shaft; _twoHanded keys on any club with an empty off hand.
- 322-324: tribalBeard, LOINCLOTHS, NECKLACES "tusks" (critic: U sags low, tusks short). Beard and necklace show in lineup_tribal, not _idle.
- 325 bracelets: the bone mage's BRACELET cuff (critic, cosmetic: TABS has two or three long tan spiked bones along the arm, not a ladder of short white ones).
