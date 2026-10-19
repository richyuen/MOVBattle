# tribal.clubber
Status: open   Audited: 360   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (3 since 360)
 1. hair in unit_tribal.clubber_idle: mid-brown locks a little splayed, still a straight curtain about head-wide — TABS: an unkempt curly dreadlock mop, wider than the head, dark brown, framing the face over the beard (ref: tribal.clubber.red.png)
 2. loincloth in unit_tribal.clubber_idle: pale beige card across the hips to the top of the thigh, tongues merged, white skull — TABS: ragged mid-brown hide strips to mid-thigh, torn hem, large tan skull, a bone each side (ref: tribal.clubber.red.png, .jpg)
b PASS (361)
c PASS (360)
d PASS (cost 70, hp 1.00x, dmg 1.00x, cd 1.00x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a hair — blocker 1: a curly dark-brown mop wider than the head, each lock kinked outward, framing the face over the beard (DREAD_MOP clubber branch) — ref: tribal.clubber.red.png — ours: unit_tribal.clubber_idle.png
2. [S] a loincloth — blocker 2: mid-brown ragged hide strips to mid-thigh, a large tan skull, a bone each side — ref: tribal.clubber.red.png — ours: unit_tribal.clubber_idle.png
## Attempts (iter | gap | criterion | verdict)
322-325 | hair and beard, loincloth, tusk necklace, bracelets | a | approved
361 | cudgel: knobbly faceted lathe (CLUB) [S] (6b4a076) | b | approved
361 | dreadlock mop over the beard (dreads_beard) [S] (d59089b) | a | approved
362 | ragged hide loincloth (RAGGED_LOIN) [S] (da977ab +20e52ec) | a | approved
362 | [P] mop darker, wider (DREAD_MOP.clubberSplay/.clubberColor) (e4f3774) | a | approved
365 | upright lanky stance: default pose, scale .95, bulk .8, legs 1.08, arms 1.1 [S] (6fba04b) | a | approved
## Rejected (last 4)
## Notes (max 3 lines)
- 361 club: CLUB lathe, root still "club". 362 hide: dressTribalLoincloth `ragged` branch (clubber only); critic: tongues merge into one card, skull white.
- Hair: dreadMop(clubberColor, DREAD_MOP.clubber .8, clubberSplay .62) + tribalBeard. 325 bracelets: the bone mage's BRACELET cuff.
- 365 stance: unitVisuals proportions + posePreset "default" (was "brute"); heavy_carry walk kept.
