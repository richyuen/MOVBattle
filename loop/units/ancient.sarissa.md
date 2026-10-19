# ancient.sarissa
Status: open   Audited: 378   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (4 since 378)
 1. crest in unit_ancient.sarissa_idle: now a solid stepped arc, but the eye opening is still a band with a nose bar — TABS: narrow eye slots either side of the nose guard (ref: .red.png, .png)
 2. cape in _idle: a shell shoulders to calves with a shoulder roll, but it reads pale grey-blue, lighter than the tunic, and hangs straight behind — TABS: darker team cape, a folded collar wrapping the left shoulder onto the chest (ref: .png, .red.png)
 3. belt in _idle: thin team band — TABS: big brown belt, dagger on the left hip, brown bracers (ref: .red.png, card)
b PASS (379)
c PASS (380)
d PASS (cost 120, hp 0.49x, dmg 0.16x, cd 1.00x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a belt — blocker 3: big brown belt, dagger on the left hip, brown bracers (ancientDress dressSarissa) — ref: .red.png — ours: unit_ancient.sarissa_idle.png
2. [S] a eye slots — blocker 1: two narrow eye slots either side of a nose guard in place of the band (CORINTH_HELM) — ref: .red.png — ours: unit_ancient.sarissa_idle.png
3. [P] a cape colour (fallout of 3fd1971) — NEXT: [P] ancientDress.ts SARISSA_CAPE shade .62 -> .45, glow .12 -> .06; shows in unit_ancient.sarissa_idle.png, the cape at his sides darker than the tunic
## Attempts (iter | gap | criterion | verdict)
379 | pike levelled in both fists at the hip (PIKE_LEVEL) [S] (0311c85 +f07a183) | b | approved
380 | backs up to keep pike distance (SARISSA_KEEP) [S] (9789cbd) | c | approved (c PASS)
381-382 | Corinthian helm (CORINTH_HELM); crest as 4 stacked bands (CORINTH_CREST) [S] | a | approved
383 | (via hoplite 376288d) crest bands one solid swept strip each | a | approved
383 | dark team cape shoulders to calves, folded collar + roll (SARISSA_CAPE) [S] (3fd1971) | a | approved
## Rejected (last 4)
## Notes (max 3 lines)
- Critic 379 minors: in _idle the arms cross over the shaft; the pike is ~1.2x his height (TABS ~2.5x).
- crested_helm (propBuilder, CORINTH_HELM + CORINTH_CREST) is shared with the hoplite; a hoplite-only crest variant is ranked there. Head probe: output/loop/probe_head.mjs.
- Cape is ancientDress dressSarissa on the torso (open shell arc .56, gap at his front).
