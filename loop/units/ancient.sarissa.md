# ancient.sarissa
Status: open   Audited: 378   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (1 since 378)
 1. crest in unit_ancient.sarissa_idle (also lineup_ancient; the helm itself now encloses the face, 381): a thin row of small knuckle blocks about a quarter of the bowl's height, side-on a fan of short spikes; the eye opening a full-width band rather than slots — TABS: a tall stepped boxy crest as tall as the bowl, brow to nape; narrow eye slots either side of the nose guard (ref: .red.png, .png)
 2. cape: none in _idle — TABS: team cape shoulders to calves, folded collar (ref: .png)
 3. belt in _idle: thin team band — TABS: big brown belt, dagger on the left hip, brown bracers (ref: .red.png, card)
b PASS (379)
c PASS (380)
d PASS (cost 120, hp 0.50x, dmg 0.16x, cd 1.00x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a crest — blocker 1: replace the knuckle row with 3-4 stacked flat slabs stepping up front to back, about 1x the bowl's height, team colour, seated brow to nape (propBuilder crested_helm; also clears hoplite a.1) — ref: .png, .red.png — ours: unit_ancient.sarissa_idle.png
2. [S] a cape — blocker 2: team cape chunk shoulders to calves, folded collar (ancientDress) — ref: .png — ours: unit_ancient.sarissa_idle.png
## Attempts (iter | gap | criterion | verdict)
379 | pike levelled in both fists at the hip, no disc (PIKE_LEVEL, _levelPike) [S] (0311c85 +f07a183) | b | approved
380 | backs up to keep pike distance inside .85 of reach, logged backstep (SARISSA_KEEP) [S] (9789cbd) | c | approved (c PASS)
381 | Corinthian helm: bowl, cheek/neck shell open at the face, face plates + slit, nose guard, 9-slab crest (CORINTH_HELM) [S] (bf11d67) | a | approved
## Rejected (last 4)
## Notes (max 3 lines)
- Critic 379 minors: in _idle the arms cross over the shaft; the pike is ~1.2x his height (TABS ~2.5x).
- crested_helm (propBuilder, CORINTH_HELM) is shared with the hoplite. Head probe: output/loop/probe_head.mjs (head-top frame: head x +-.08, y -.17..0, eyes y -.10..-.05).
