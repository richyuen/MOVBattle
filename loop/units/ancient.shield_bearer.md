# ancient.shield_bearer
Status: open   Audited: 378   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (1 since 378; 1 rejected [S] since 378)
 2. armour in unit_ancient.shield_bearer_windup (idle and lineup can't show it behind the scutum): plain team tunic (383's hoops a fat grey-mauve barrel, reverted) — TABS: thin dark brown lorica plates fitted to the team tunic, flat shoulder strips, sandals (ref: .jpg, card)
b PASS (381)
c PASS (378)
d PASS (cost 100, hp 0.76x, dmg 0.33x, cd 1.30x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a lorica — blocker 2: re-land LORICA (git show a4076de) as fitted hoops at a fixed 1.04-1.06 of the trunk (no cumulative step), dark brown (~.3,.18,.12) low glow, flat shoulder strips lying on the deltoid (ancientDress dressShieldBearer) — ref: .jpg — ours: unit_ancient.shield_bearer_windup.png
## Attempts (iter | gap | criterion | verdict)
378-381 | scutum upright, chin to shin, laurels, flat trim (SCUTUM, SCUTUM_TRIM_FLAT) [S] | b | approved (379 one rejected)
382 | legionary helmet (LEGION_HELM) [S] (c7d3111) | a | approved (struck a.1)
383 | lorica: 5 hoops proud 1.1 + .04 step, 3 leather half-shells per shoulder (LORICA) [S] (a4076de, reverted 4c77e18) | a | rejected
## Rejected (last 4)
- scutum chin to shin [S] [1] — 379: still seated high (cause: unitFactory wiped metadata.holeUp, fixed 380)
- lorica [S] [1] — 383: hoops + shoulder shells — bands too proud, cumulative step ballooned into a barrel twice the body's width, grey-mauve (haze + glow); the man reads hunchbacked
## Notes (max 3 lines)
- Scutum root "scutumshield", metadata.holeUp = H/2 + chin; unitFactory keeps holeUp. Probe: output/loop/probe_shield.mjs (--build).
- Flat colour recipe: "unlit" material, emissive set for ACES (red >1, blue ~0), glow.addExcludedMesh; LEGION_HELM reuses it.
- Trunk armour is judged in _windup/_release (side-on); the trunk's lerp to brown under blue reads grey: use a fixed brown, not team lerp.
