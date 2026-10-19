# tribal.spear_thrower
Status: open   Audited: 360 (a, b re-audited 372)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (2 since 372)
 3. stance in unit_tribal.spear_thrower_idle and lineup_tribal: stooped torso, bent short legs, dark boot-like feet — TABS: lanky upright, long straight legs, plain team feet (ref: .red.png, factions/tribal.jpg)
 4. flap colour in unit_tribal.spear_thrower_idle (added 373 by cd8403d +483efeb): pale cream flap, same tone as skull and bones, merging into one pale blob; rope grey-brown — TABS: red-brown rope, a mid grey-brown hide flap clearly darker than the bone skull (ref: .red.png, .blue.png)
b PASS (372)
c PASS (360)
d PASS (cost 120, hp 0.55x, dmg 2.23x, cd 4.00x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a stance — blocker 3: upright lanky idle, straight long legs, plain team feet, no dark boot band — ref: .red.png — ours: lineup_tribal.png
2. [P] a flap colour (fallout of cd8403d) — blocker 4: SPEAR_LOIN.hide -> (.5,.38,.26), glow .2 -> .08, rope red-brown; NEXT shows in unit_tribal.spear_thrower_idle as a brown flap under the pale skull
## Attempts (iter | gap | criterion | verdict)
318-323 | spear raised [rej], spear stood up, stone head, tusk band, loincloth, fang necklace | a,b | approved
362-363 | knapped flint head (JAVELIN_LEAF); hung tusks (TUSK_BAND) [S] | a,b | approved
372 | chunky tusks: full girth .55 down, blunt point, root knob over the band (TUSK_BAND) [S] (e59b231) | a | approved
373 | own loincloth: 4 rope coils, narrow tan flap to mid-thigh, skull + crossed bones on the rope, no kilt (spearThrowerLoin, SPEAR_LOIN) [S] (cd8403d +bdad788 +483efeb) | a | approved
## Rejected (last 4)
- spear raised overhead [S] [1] — 318: JAVELIN_COCK alone (arm straight up) — the javelin's +y runs toward the elbow, so the shaft hung DOWN the back of the head
## Notes (max 3 lines)
- 316: LAUNCH spear 20, 9.8 + solveLowArc. 319: _standJavelin turns the "shaft" pi about the fist at the cock. 362 head: own-vertex kite "tip".
- tuskBand (TUSK_BAND); spearThrowerLoin in tribalDress (dressTribalLoincloth branches to it; unitFactory leaves out his hideKilt); FANG_NECKLACE. Rope colour is shared ropeMaterial (ROPE_COLOR): tint his own.
- His idle stance bends the knees forward; a narrow flap hangs behind the thighs unless it leans out (lean .3).
