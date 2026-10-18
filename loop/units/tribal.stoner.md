# tribal.stoner
Status: open   Audited: 315   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (0 since 315)
 1. hair in unit_tribal.stoner_idle is a short black cap — TABS: long messy dark-brown hair to the shoulders (ref: tribal.stoner.blue.png)
 2. torso in unit_tribal.stoner_idle is bare with a dark loincloth box — TABS: a brown garment to mid-thigh hung from a strap over the right shoulder (ref: tribal.stoner.jpg, card Appearance)
 3. neck in unit_tribal.stoner_idle is a dark flat ring — TABS: three pale bones strung on a strap (ref: tribal.stoner.red.png)
b FAIL (1 since 315)
 1. boulder in unit_tribal.stoner_idle/_release is an even twenty-face solid in mid grey (319: faceted and wider than the torso now) — TABS: an irregular charcoal-brown lump, faces of unequal size, the darkest thing on the man (ref: tribal.stoner.blue.png)
 2. (struck 319: faceted boulder cradled two-handed)
c FAIL (1 since 315)
 1. (struck 318: forward toss)
 2. squire in unit_tribal.stoner_struck (319: from the far rig, 9 ticks after the landing) is on his feet, nothing near him — TABS: the stone crushes and knocks back the target (card Characteristics). Critic 319: the re-aimed shot shows him thrown back off his feet amid shards and a burst; reads cleared, to be struck at its next review.
d PASS (stats 315: cost 160=160, hp +1%, dmg 0%, cd 0%)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [P] b irregular charcoal chunk — blocker 1: BOULDER_JITTER 0.2 -> 0.35, BOULDER_COLOR -> (0.2, 0.17, 0.15), fallout of aa85160 (319) — ref: tribal.stoner.blue.png — ours: unit_tribal.stoner_release.png
2. [S] a one-shoulder garment — blocker 2: a brown faceted tunic chunk to mid-thigh hung from a strap over the right shoulder — ref: tribal.stoner.jpg — ours: unit_tribal.stoner_idle.png
## Attempts (iter | gap | criterion | verdict)
318 | forward toss (9a15b0d) | c | approved
319 | faceted boulder cradled two-handed (aa85160) | b | approved
## Rejected (last 4)
## Notes (max 3 lines)
- 318: LAUNCH.stone { 18, 9.8, held: true }, only with options.heldProp. Evidence 22f8d75: a short throw's _flight at 45% of the way to the hit; 319 cd9ae05: its _struck from the far rig at impact+9.
- 319: "boulder" is a jittered subdivision-1 icosphere (BOULDER_JITTER, WIDE 0.3); _carryBoulder spreads the mitts to BOULDER_HOLD of the rock's width each frame. _idle is from behind the man (the far hand hides in the rock); _release shows both mitts.
