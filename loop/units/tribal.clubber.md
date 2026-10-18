# tribal.clubber
Status: open   Audited: 315   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (1 since 315)
 1. (struck 322: hair and beard)
 2. loincloth in unit_tribal.clubber_idle is a plain dark-grey box — TABS: brown loincloth tied with rope, a pale skull at the centre and a bone each side (ref: tribal.clubber.red.png)
 3. neck in unit_tribal.clubber_idle is a dark flat ring — TABS: a necklace of three pale tusks on a rope (ref: tribal.clubber.blue.png)
 4. wrists in unit_tribal.clubber_idle are bare — TABS: a pale bracelet on each wrist (ref: tribal.clubber.red.png)
b PASS (317)
c PASS (315)
d PASS (stats 317: cost 70=70, hp 1.00x, dmg 1.00x, cd 1.00x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a ornamented loincloth — blocker 2: add tribal.clubber to LOINCLOTHS (dressTribalLoincloth) — ref: tribal.clubber.red.png — ours: unit_tribal.clubber_idle.png
2. [S] a tusk necklace — blocker 3: dressTribalNecklace "tusks" style, three pale tusks on a rope, dropping the fur collar — ref: tribal.clubber.blue.png — ours: unit_tribal.clubber_idle.png
## Attempts (iter | gap | criterion | verdict)
316 | club mesh (3af648b) | b | approved
317 | two-handed grip (6a1bbe4) | b | approved
322 | hair and beard (940436d) | a | approved
## Rejected (last 4)
## Notes (max 3 lines)
- 316 club: CreateTube radius profile (CLUB_LONG/GRIP/HEAD). 317: _offhandToGrip solves the left arm onto the shaft; _twoHanded keys on any club with an empty off hand.
- 322: dressTribalHair "long_beard" (CLUBBER_HAIR_COLOR, BEARD; the beard shows in lineup_tribal, not the from-behind _idle). Critic 322: hair a smooth flat-topped bucket, TABS a ragged tousled mop.
