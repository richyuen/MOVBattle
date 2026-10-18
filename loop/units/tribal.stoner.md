# tribal.stoner
Status: open   Audited: 315   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (0 since 315)
 1. hair in unit_tribal.stoner_idle is a short black cap — TABS: long messy dark-brown hair to the shoulders (ref: tribal.stoner.blue.png)
 2. torso in unit_tribal.stoner_idle is bare with a dark loincloth box — TABS: a brown garment to mid-thigh hung from a strap over the right shoulder (ref: tribal.stoner.jpg, card Appearance)
 3. neck in unit_tribal.stoner_idle is a dark flat ring — TABS: three pale bones strung on a strap (ref: tribal.stoner.red.png)
b FAIL (0 since 315)
 1. boulder in unit_tribal.stoner_idle is a smooth grey ball narrower than the torso — TABS: a dark faceted irregular boulder wider than the torso (ref: tribal.stoner.blue.png)
 2. grip in unit_tribal.stoner_idle is one hand at the hip — TABS: both hands cradling the rock before the belly (card Weapon Type Two-handed; ref: tribal.stoner.red.png)
c FAIL (1 since 315)
 1. (struck 318: forward toss)
 2. squire in unit_tribal.stoner_struck is on his feet, nothing near him — TABS: the stone crushes and knocks back the target (card Characteristics). Critic 318: the shot cannot show it (camera inside the impact dust, squire thrown out of frame); re-aim by evidence commit: _struck from the far rig at impact+9 ticks.
d PASS (stats 315: cost 160=160, hp +1%, dmg 0%, cd 0%)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] b faceted boulder cradled two-handed — blockers 1 and 2: a dark irregular faceted chunk wider than the torso held before the belly in both hands — ref: tribal.stoner.blue.png — ours: unit_tribal.stoner_idle.png
2. [S] a one-shoulder garment — blocker 2: brown tunic chunk to mid-thigh hung from a right-shoulder strap — ref: tribal.stoner.jpg — ours: unit_tribal.stoner_idle.png
3. (c blocker 2 unranked until the _struck re-aim lands; if the man flies sky-high, the knockback, card force 15, is the next [S])
## Attempts (iter | gap | criterion | verdict)
318 | forward toss (9a15b0d) | c | approved
## Rejected (last 4)
## Notes (max 3 lines)
- 318: LAUNCH.stone { 18, 9.8, held: true }, only with options.heldProp (a catapult keeps the lob). Evidence 22f8d75: a throw landing within 15 ticks takes _flight at 45% of the way to the hit.
- Critic 318: the flying boulder is the catalogue's smooth sphere bursting into chunks (pre-existing). Idle shows one hand at the hip though _carryBoulder exists: check the placement frame.
