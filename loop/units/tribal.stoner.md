# tribal.stoner
Status: open   Audited: 360   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (5 since 360; 1 [S] rejected)
 4. skirt in unit_tribal.stoner_idle (also _windup): close brown sleeve per thigh to about mid-thigh, but a stiff square box, no torn hem showing, its rear edge standing off the buttock in the windup — TABS: a reddish-brown skirt hanging close to mid-thigh with a ragged hem (ref: tribal.stoner.red.png)
b PASS (360)
c PASS (360)
d PASS (cost 160, hp 0.63x, dmg 1.66x, cd 4.99x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a skirt — blocker 4: replace the square per-thigh boxes with a reddish-brown ring of tongues hanging close to mid-thigh, a jagged torn hem, its rear tied to the hips (no stand-off) — ref: tribal.stoner.red.png — ours: unit_tribal.stoner_idle.png, _windup
## Attempts (iter | gap | criterion | verdict)
318-322 | forward toss; boulder, garment, lump, hair; bone necklace | a,b,c | approved
361-363 | dreadlock mop [S]; one-strap hide dress [S]; curved strap [S] | a | approved
364 | close-hung skirt: hip band + torn tongues, no kilt (HIDE_SKIRT) [S] (6ebde62, reverted) | a | rejected
365 | skirt per thigh: waist band + torn hip-joint panels, no kilt (HIDE_SKIRT) [S] (8db2654) | a | approved
366 | strap: solid dark band proud of the shoulder, rolled hem on the slant (HIDE_EDGE) [S] (d06e5d0) | a | approved
## Rejected (last 4)
- close-hung skirt [S] [1] — 364: pelvis-box depth (zk) made a deep hip-rigid box jutting out behind; too short (ended at the thigh top)
## Notes (max 3 lines)
- 362: dressTribalHideDress; strap "tunicStrap" (solid band, 366), hem "tunicHem", waist band "tunicSkirt", thigh panels "tunicSkirtPanel" (365).
- critic 365 (minor): hem tears (HIDE_DRESS.rag .16) do not read at capture distance. critic 366 (minor): strap a shade darker than the garment.
- 319: _carryBoulder. 361 hair "dreads". 322: necklace "bones".
