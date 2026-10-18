# tribal.clubber
Status: open   Audited: 315   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (3 since 315)
 1. (struck 322: hair and beard)
 2. (struck 323: ornamented loincloth)
 3. (struck 324: tusk necklace)
 4. wrists in unit_tribal.clubber_idle are bare — TABS: a pale bracelet on each wrist (ref: tribal.clubber.red.png)
b PASS (317)
c PASS (315)
d PASS (stats 317: cost 70=70, hp 1.00x, dmg 1.00x, cd 1.00x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a bracelets — blocker 4: add tribal.clubber to tribalDress.ts BRACELETS, a pale band (or ring of short bones) on each wrist — ref: tribal.clubber.red.png — ours: unit_tribal.clubber_idle.png
## Attempts (iter | gap | criterion | verdict)
316 | club mesh (3af648b) | b | approved
317 | two-handed grip (6a1bbe4) | b | approved
322 | hair and beard (940436d) | a | approved
323 | ornamented loincloth (914ddb9) | a | approved
324 | tusk necklace (54f0b6b) | a | approved
## Rejected (last 4)
## Notes (max 3 lines)
- 316 club: CreateTube radius profile (CLUB_LONG/GRIP/HEAD). 317: _offhandToGrip solves the left arm onto the shaft; _twoHanded keys on any club with an empty off hand.
- 322/323: dressTribalHair "long_beard", beard shared as tribalBeard. Beard and necklace show in lineup_tribal, not _idle.
- 324 necklace: NECKLACES "tusks" (TUSK_NECKLACE, hornOnRope). Critic (polish): U sags to mid-chest, tusks short; TABS right under the beard, ~a head tall.
