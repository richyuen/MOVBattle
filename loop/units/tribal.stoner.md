# tribal.stoner
Status: open   Audited: 315   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (1 since 315)
 1. hair in unit_tribal.stoner_idle is a short black cap — TABS: long messy dark-brown hair to the shoulders (ref: tribal.stoner.blue.png)
 2. (struck 320: one-shoulder garment)
 3. neck in unit_tribal.stoner_idle is a dark flat ring — TABS: three pale bones strung on a strap (ref: tribal.stoner.red.png)
b FAIL (1 since 315)
 1. boulder in unit_tribal.stoner_idle/_release is an even twenty-face solid in mid grey (319: faceted and wider than the torso now) — TABS: an irregular charcoal-brown lump, faces of unequal size, the darkest thing on the man (ref: tribal.stoner.blue.png)
 2. (struck 319: faceted boulder cradled two-handed)
c PASS (320)
d PASS (stats 315: cost 160=160, hp +1%, dmg 0%, cd 0%)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] b charcoal lump — blocker 1: replace the jittered icosahedron with an uneven hull (2-3 squashed chunks merged, unequal faces) in dark charcoal-brown; a [P] re-nudge of BOULDER_JITTER/COLOR is a ledger reversal — ref: tribal.stoner.blue.png — ours: unit_tribal.stoner_release.png
2. [S] a long hair — blocker 1: messy dark-brown dreadlock chunks to the shoulders — ref: tribal.stoner.jpg — ours: unit_tribal.stoner_idle.png
## Attempts (iter | gap | criterion | verdict)
318 | forward toss (9a15b0d) | c | approved
319 | faceted boulder cradled two-handed (aa85160) | b | approved
320 | one-shoulder garment (586d90f + f87534f + e16240e) | a | approved
## Rejected (last 4)
## Notes (max 3 lines)
- 318: LAUNCH.stone { 18, 9.8, held: true }. 319: "boulder" jittered subdivision-1 icosphere (BOULDER_JITTER, WIDE 0.3); _carryBoulder spreads the mitts (BOULDER_HOLD).
- 320: dressTribalTunic (unitFactory, TUNIC): four-sided wrap and skirt turned pi/4, sized off torsoM + _yoke vertices in the torso frame (bounds go stale; round sleeves left the box corners out). Critic 320: points jut at the hip not the hem, loincloth box shows through the skirt front, the one strap does not read.
- c passed 320: _struck (far rig, impact+9) shows the squire thrown back among shards.
