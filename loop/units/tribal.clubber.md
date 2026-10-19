# tribal.clubber
Status: open   Audited: 360   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (2 since 360)
 1. hair in unit_tribal.clubber_idle: mid-brown locks a little splayed, still a straight curtain about head-wide — TABS: an unkempt curly dreadlock mop, wider than the head, dark brown, framing the face over the beard (ref: tribal.clubber.red.png)
 2. loincloth in unit_tribal.clubber_idle: pale beige card across the hips to the top of the thigh, tongues merged, white skull — TABS: ragged mid-brown hide strips to mid-thigh, torn hem, large tan skull, a bone each side (ref: tribal.clubber.red.png, .jpg)
 3. stance in unit_tribal.clubber_idle, lineup_tribal: short, stocky, knees bent — TABS: average-size Wobbler with long thin limbs, as tall as the spear thrower (ref: tribal.jpg, card Size 1.00x)
b PASS (361)
c PASS (360)
d PASS (cost 70, hp 1.00x, dmg 1.00x, cd 1.00x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a stance — blocker 3: upright long-limbed stance as tall as the spear thrower, knees straight — ref: tribal.jpg — ours: lineup_tribal.png
2. [S] a hair curl — blocker 1: clubber-only curl, each lock kinked outward in two or more bends, an outer ring of short clumps on top — ref: tribal.clubber.red.png — ours: unit_tribal.clubber_idle.png
3. [P] a hide length (fallout of da977ab) — blocker 2: RAGGED_LOIN.long .75 -> 1.0; NEXT shows in unit_tribal.clubber_idle as the hide reaching mid-thigh
## Attempts (iter | gap | criterion | verdict)
322 | hair and beard (940436d) | a | approved
323 | ornamented loincloth (914ddb9) | a | approved
324 | tusk necklace (54f0b6b) | a | approved
325 | bracelets, joins BRACELETS (e8a2cc0) | a | approved
361 | cudgel: knobbly faceted lathe (CLUB) [S] (6b4a076) | b | approved
361 | dreadlock mop over the beard (dreads_beard) [S] (d59089b) | a | approved
362 | ragged hide loincloth (RAGGED_LOIN) [S] (da977ab +20e52ec) | a | approved
362 | [P] mop darker, wider (DREAD_MOP.clubberSplay/.clubberColor) (e4f3774) | a | approved
## Rejected (last 4)
## Notes (max 3 lines)
- 361 club: CLUB lathe, root still "club". 362 hide: dressTribalLoincloth `ragged` branch (clubber only); critic: tongues merge into one card, skull white.
- 322-324: tribalBeard, LOINCLOTHS, NECKLACES "tusks". Hair: dreadMop(clubberColor, DREAD_MOP.clubber .8, clubberSplay .62) + tribalBeard.
- 325 bracelets: the bone mage's BRACELET cuff.
