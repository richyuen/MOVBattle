# tribal.stoner
Status: open   Audited: 315   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (2 since 315)
 1. (struck 321: long hair)
 2. (struck 320: one-shoulder garment)
 3. neck in unit_tribal.stoner_idle is a dark flat ring — TABS: three pale bones strung on a strap (ref: tribal.stoner.red.png)
b PASS (321)
c PASS (320)
d PASS (stats 315: cost 160=160, hp +1%, dmg 0%, cd 0%)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a bone necklace — blocker 3: a "bones" style in dressTribalNecklace, three boneStick bones hanging from the strap at the breastbone in place of the furCollar — ref: tribal.stoner.red.png — ours: unit_tribal.stoner_idle.png
## Attempts (iter | gap | criterion | verdict)
318 | forward toss (9a15b0d) | c | approved
319 | faceted boulder cradled two-handed (aa85160) | b | approved
320 | one-shoulder garment (586d90f + f87534f + e16240e) | a | approved
321 | charcoal lump (7f4d666 + 1595032) | b | approved
321 | long hair (7fe93b7 + 2f5823c) | a | approved
## Rejected (last 4)
## Notes (max 3 lines)
- 319: _carryBoulder (BOULDER_HOLD). 321: "boulder" = BOULDER_CHUNKS three jittered subdivision-1 icospheres merged (keep the name; subdivisions 0 means Babylon's default 4). Critic 321 (minor): reads as a peanut from some angles; a convex hull would fix it.
- 320: dressTribalTunic (unitFactory, TUNIC). 321: dressTribalHair "long" (tribalDress.ts, LONG_HAIR). Critic 321 (minor): in profile the hair is a flat-sided block with a level hem, TABS ragged splayed lock ends.
- Close-up check: a copy of inspect-prop.mjs with frameCamera at dist 2.2 and four yaws (yaw pi is his front) shows ornaments the side-on _idle cannot.
