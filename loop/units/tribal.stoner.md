# tribal.stoner
Status: open   Audited: 360   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (1 since 360)
 2. garment in unit_tribal.stoner_idle: grey-brown tunic over both shoulders, flared skirt — TABS: reddish-brown one-strap hide dress, other shoulder bare, ragged hem mid-thigh (ref: tribal.stoner.red.png, card Appearance)
b PASS (360)
c PASS (360)
d PASS (cost 160, hp 0.63x, dmg 1.66x, cd 4.99x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a garment — blocker 2: one-strap reddish-brown hide dress, ragged mid-thigh hem, other shoulder bare — ref: tribal.stoner.red.png — ours: unit_tribal.stoner_idle.png
## Attempts (iter | gap | criterion | verdict)
318 | forward toss (9a15b0d) | c | approved
319 | faceted boulder cradled two-handed (aa85160) | b | approved
320 | one-shoulder garment (586d90f + f87534f + e16240e) | a | approved
321 | charcoal lump (7f4d666 + 1595032) | b | approved
321 | long hair (7fe93b7 + 2f5823c) | a | approved
322 | bone necklace (55b683b) | a | approved
361 | dreadlock mop (dreadMop, DREAD_MOP) [S] (a7be412) | a | approved
## Rejected (last 4)
## Notes (max 3 lines)
- 320: dressTribalTunic (unitFactory, TUNIC). 361: HAIR_STYLES "dreads" (dreadMop) replaces "long". Critic 361 (minor): mop mid-brown, a bit narrow and tidy.
- 319: _carryBoulder (BOULDER_HOLD). 321: "boulder" = BOULDER_CHUNKS merged jittered icospheres.
- 322: dressTribalNecklace "bones" (BONE_NECKLACE). Critic 322 (minor): the idle lean swings the bones off the chest.
