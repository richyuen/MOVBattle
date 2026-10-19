# ancient.shield_bearer
Status: open   Audited: 378   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (0 since 378)
 1. helmet in lineup_ancient (_idle hides it behind the scutum): flat grey beret dome — TABS: dark iron legionary helmet, brim/neck guard, orange-trimmed cheek guards (ref: .red.png, .jpg)
 2. armour in lineup_ancient: plain team box tunic — TABS: dark brown lorica segmentata plates over the team tunic, sandals (ref: .jpg, card)
b FAIL (1 since 378)
 1. scutum in unit_ancient.shield_bearer_idle (also _flight): held too high, top rim a head over his helmet, bottom at mid-thigh; rim cream/beige not orange; laurels read as zigzag letters — TABS: top rim at the chin with helmet and eyes over it, bottom at the shin, orange rim (~237,153,77), two feathered laurel arcs (ref: .red.png, .jpg)
c PASS (378)
d PASS (cost 100, hp 0.75x, dmg 0.33x, cd 1.30x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] b scutum seat — blocker 1: re-seat the board at full height (.74) so the fists grip its middle and its top lands at the chin; re-land the leafy laurels (SCUTUM_LAUREL of de5279a) — ref: .red.png — ours: unit_ancient.shield_bearer_idle.png
2. [S] a legionary helmet with cheek guards — blocker 1: ancientDress — ref: .jpg — ours: lineup_ancient.png
3. [S] a lorica segmentata plates, sandals — blocker 2: ancientDress — ref: .jpg — ours: lineup_ancient.png
## Attempts (iter | gap | criterion | verdict)
378 | curved scutum upright in front, rim, laurels, iron boss; no sword (SCUTUM, _holdSlab) [S] (2940691) | b | approved (also cleared c: shield bash)
379 | scutum .5 tall, chin .1, laurel sprays with a knot, trim lit .06 [S] (de5279a +3fd5e08, reverted) | b | rejected
## Rejected (last 4)
- scutum chin to shin [S] [1] — 379: board shrunk .74 -> .5 and still seated high, its bottom rose to the waist; rim still beige (laurels themselves matched)
## Notes (max 3 lines)
- Scutum root "scutumshield", metadata.holeUp = H/2 + SCUTUM.chin; the mount scales it 1.9 on the hand. The capture camera sits below the rim, so his head hides behind it.
- While the board hides him, judge a in lineup_ancient (critic 378).
