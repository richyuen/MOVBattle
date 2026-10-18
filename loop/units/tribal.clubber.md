# tribal.clubber
Status: open   Audited: 315   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (2 since 315)
 1. (struck 322: hair and beard)
 2. (struck 323: ornamented loincloth)
 3. neck in unit_tribal.clubber_idle is a dark flat ring — TABS: a necklace of three pale tusks on a rope (ref: tribal.clubber.blue.png)
 4. wrists in unit_tribal.clubber_idle are bare — TABS: a pale bracelet on each wrist (ref: tribal.clubber.red.png)
b PASS (317)
c PASS (315)
d PASS (stats 317: cost 70=70, hp 1.00x, dmg 1.00x, cd 1.00x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a tusk necklace — blocker 3: NECKLACES "tusks", three short pale curved tusks hung point down from a rope (reuse fangNecklace's curved tube), dropping the fur collar — ref: tribal.clubber.blue.png — ours: unit_tribal.clubber_idle.png
2. [S] a bracelets — blocker 4: add tribal.clubber to BRACELETS (bone mage's) — ref: tribal.clubber.red.png — ours: unit_tribal.clubber_idle.png
## Attempts (iter | gap | criterion | verdict)
316 | club mesh (3af648b) | b | approved
317 | two-handed grip (6a1bbe4) | b | approved
322 | hair and beard (940436d) | a | approved
323 | ornamented loincloth (914ddb9) | a | approved
## Rejected (last 4)
## Notes (max 3 lines)
- 316 club: CreateTube radius profile (CLUB_LONG/GRIP/HEAD). 317: _offhandToGrip solves the left arm onto the shaft; _twoHanded keys on any club with an empty off hand.
- 322: dressTribalHair "long_beard"; 323 beard shared as tribalBeard (chieftain too). The beard shows in lineup_tribal, not the from-behind _idle.
- 323 critic (minor): the dark kilt block under the loincloth still wraps the hips; TABS only the front flap, skin at the sides.
