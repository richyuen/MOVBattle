# ancient.shield_bearer
Status: open   Audited: 378   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (1 since 378)
 2. armour in lineup_ancient: plain team box tunic — TABS: dark brown lorica segmentata plates over the team tunic, sandals (ref: .jpg, card)
b PASS (381)
c PASS (378)
d PASS (cost 100, hp 0.76x, dmg 0.33x, cd 1.30x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a lorica segmentata — blocker 2: dark brown overlapping hoop plates round the trunk, shoulder plates, over the team tunic (ancientDress) — ref: .jpg — ours: lineup_ancient.png
## Attempts (iter | gap | criterion | verdict)
378 | curved scutum upright in front, rim, laurels, boss; no sword (SCUTUM, _holdSlab) [S] (2940691) | b | approved
379 | scutum .5, chin .1, laurel sprays, trim lit .06 [S] (de5279a +3fd5e08, reverted) | b | rejected
380 | scutum chin-shin: hold reads holeUp, laurels re-landed, trim (.9,.45,.16) [S] (f87fef0) | b | approved
381 | trim + laurels on a flat unlit material out of the glow layer (SCUTUM_TRIM_FLAT) [S] (0550f5d +a2d3543) | b | approved (b PASS)
382 | legionary helmet: iron bowl, orange band, neck guard, edged cheek guards + studs (LEGION_HELM) [S] (c7d3111) | a | approved (struck a.1)
## Rejected (last 4)
- scutum chin to shin [S] [1] — 379: still seated high (cause: unitFactory wiped metadata.holeUp, fixed 380)
## Notes (max 3 lines)
- Scutum root "scutumshield", metadata.holeUp = H/2 + chin; unitFactory keeps holeUp. Probe: output/loop/probe_shield.mjs (--build).
- Flat colour recipe: "unlit" material, emissive set for ACES (red >1, blue ~0), glow.addExcludedMesh; LEGION_HELM reuses it.
- Critic 382 minor: helm bowl sits a little high and round like a pot (TABS lower, flatter).
