# ancient.sarissa
Status: open   Audited: 378   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (2 since 378)
 1. crest in unit_ancient.sarissa_idle (also lineup_ancient): now about the bowl's height, but a fan of thin layered blades, a mohawk from the front; the eye opening a band with a nose bar, not two slots — TABS: a tall stepped boxy crest, brow to nape, broad flat-sided blocks, about a third of the bowl's width; narrow eye slots either side of the nose guard (ref: .red.png, .png)
 2. cape: none in _idle — TABS: team cape shoulders to calves, folded collar (ref: .png)
 3. belt in _idle: thin team band — TABS: big brown belt, dagger on the left hip, brown bracers (ref: .red.png, card)
b PASS (379)
c PASS (380)
d PASS (cost 120, hp 0.49x, dmg 0.16x, cd 1.00x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a cape — blocker 2: team cape chunk shoulders to calves, folded collar (ancientDress) — ref: .png — ours: unit_ancient.sarissa_idle.png
2. [S] a crest slabs — blocker 1: each CORINTH_CREST band one solid strip along the arc (a single box/ribbon per band, not 12 blocks), wider; eye slots — ref: .red.png — ours: unit_ancient.sarissa_idle.png
## Attempts (iter | gap | criterion | verdict)
379 | pike levelled in both fists at the hip, no disc (PIKE_LEVEL, _levelPike) [S] (0311c85 +f07a183) | b | approved
380 | backs up to keep pike distance inside .85 of reach, logged backstep (SARISSA_KEEP) [S] (9789cbd) | c | approved (c PASS)
381 | Corinthian helm: bowl, cheek/neck shell, face plates + slit, nose guard, 9-slab crest (CORINTH_HELM) [S] (bf11d67) | a | approved
382 | crest as 4 stacked bands of 12 short blocks along the bowl's top line (CORINTH_CREST) [S] (bc537dc +5dcf082 +f61cdaa) | a | approved
## Rejected (last 4)
## Notes (max 3 lines)
- Critic 379 minors: in _idle the arms cross over the shaft; the pike is ~1.2x his height (TABS ~2.5x).
- crested_helm (propBuilder, CORINTH_HELM + CORINTH_CREST) is shared with the hoplite (hoplite a.1). Head probe: output/loop/probe_head.mjs.
- 382 looks: band height/thickness alone did not stop the blade read; the block seams are the cause (critic).
