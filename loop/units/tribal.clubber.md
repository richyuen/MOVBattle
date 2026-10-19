# tribal.clubber
Status: open   Audited: 360   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (0 since 360)
 1. hair in unit_tribal.clubber_idle: a flat brown hood-shaped slab, straight strands — TABS: an unkempt curly dreadlock mop, wider than the head, framing the face over the beard (ref: tribal.clubber.red.png)
 2. loincloth in unit_tribal.clubber_idle: a small dark belt-pouch, tiny skull — TABS: ragged brown hide loincloth to mid-thigh, large tan skull at the centre, a bone tied each side (ref: tribal.clubber.red.png, .jpg)
 3. stance in unit_tribal.clubber_idle, lineup_tribal: short, stocky, knees bent — TABS: average-size Wobbler with long thin limbs, as tall as the spear thrower (ref: tribal.jpg, card Size 1.00x)
b FAIL (0 since 360)
 1. club in unit_tribal.clubber_idle/_windup: thin tapered stick an arm long, small grey-tan head — TABS: huge thick dark-brown club, head+torso long, bulb wider than the head (ref: tribal.clubber.red.png, .jpg)
 2. grip in unit_tribal.clubber_idle/_windup: held low across the waist pointing at the target — TABS: two-handed, upright against the shoulder, head above the hair (ref: tribal.clubber.red.png)
c PASS (360)
d PASS (cost 70, hp 1.00x, dmg 1.00x, cd 1.00x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] b club — blocker 1: a new thick dark-brown club mesh (head+torso long, bulb wider than the head) — ref: tribal.clubber.red.png — ours: unit_tribal.clubber_idle.png
2. [S] a hair — blocker 1: an unkempt curly dreadlock mop chunk, wider than the head, over the beard — ref: tribal.clubber.jpg — ours: unit_tribal.clubber_idle.png
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
- 325 bracelets: the bone mage's BRACELET cuff.
