# ancient.shield_bearer
Status: open   Audited: 378   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (0 since 378)
 1. helmet in lineup_ancient (_idle: over the rim now): flat grey beret dome — TABS: dark iron legionary helmet, brim/neck guard, orange-trimmed cheek guards (ref: .red.png, .jpg)
 2. armour in lineup_ancient: plain team box tunic — TABS: dark brown lorica segmentata plates over the team tunic, sandals (ref: .jpg, card)
b FAIL (2 since 378)
 1. rim and laurels in unit_ancient.shield_bearer_idle (also lineup_ancient) read tan/ochre, beige-gold — TABS: saturated orange rim (~237,153,77) (ref: .red.png). Height chin-shin and laurel shape fixed 380.
c PASS (378)
d PASS (cost 100, hp 0.75x, dmg 0.33x, cd 1.30x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a legionary helmet — blocker 1: dark iron bowl, neck-guard brim, orange-trimmed cheek guards (ancientDress) — ref: .red.png — ours: lineup_ancient.png
2. [S] b orange rim — blocker 1: trim on its own flat self-lit material so the colour survives the cloth shading (SCUTUM_TRIM set 380: re-nudge = reversal) — ref: .red.png — ours: unit_ancient.shield_bearer_idle.png
3. [S] a lorica segmentata plates, sandals — blocker 2: ancientDress — ref: .jpg — ours: lineup_ancient.png
## Attempts (iter | gap | criterion | verdict)
378 | curved scutum upright in front, rim, laurels, boss; no sword (SCUTUM, _holdSlab) [S] (2940691) | b | approved
379 | scutum .5, chin .1, laurel sprays, trim lit .06 [S] (de5279a +3fd5e08, reverted) | b | rejected
380 | scutum chin-shin: hold reads holeUp (unitFactory kept it), laurels re-landed, trim (.9,.45,.16) [S] (f87fef0) | b | approved
## Rejected (last 4)
- scutum chin to shin [S] [1] — 379: still seated high (cause: unitFactory wiped metadata.holeUp, fixed 380)
## Notes (max 3 lines)
- Scutum root "scutumshield", metadata.holeUp = H/2 + chin; unitFactory keeps holeUp when it sets runtimeUnit. Probe: output/loop/probe_shield.mjs (--build).
- Critic 380 minor: laurel sprays thin and sparse (TABS bushy).
