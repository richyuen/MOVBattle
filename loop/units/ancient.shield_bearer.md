# ancient.shield_bearer
Status: done   Audited: 378   Done: 385
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a PASS (385)
b PASS (381)
c PASS (378)
d PASS (cost 100, hp 0.76x, dmg 0.33x, cd 1.30x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
## Attempts (iter | gap | criterion | verdict)
378-381 | scutum upright, chin to shin, laurels, flat trim (SCUTUM, SCUTUM_TRIM_FLAT) [S] | b | approved (379 one rejected)
382 | legionary helmet (LEGION_HELM) [S] (c7d3111) | a | approved (struck a.1)
383 | lorica: 5 hoops proud 1.1 + .04 step, 3 leather half-shells per shoulder (LORICA) [S] (a4076de, reverted 4c77e18) | a | rejected
384 | lorica re-land: 4 fitted hoops 1.05 + seams, flat deltoid strips (LORICA) [S] (89b02e6 +8c5060d) | a | approved (armour cleared)
385 | sandals: strapSandals on bare team feet + 3 shin laces (SB_SANDAL) [S] (9c57271) | a | approved (a PASS)
## Rejected (last 4)
- scutum chin to shin [S] [1] — 379: still seated high (cause: unitFactory wiped metadata.holeUp, fixed 380)
- lorica [S] [1] — 383: hoops + shoulder shells — bands too proud, cumulative step ballooned into a barrel twice the body's width, grey-mauve; the man reads hunchbacked
## Notes (max 3 lines)
- Scutum root "scutumshield", metadata.holeUp = H/2 + chin; unitFactory keeps holeUp. Probe: output/loop/probe_shield.mjs (--build); torso-local extents: output/loop/probe_local.mjs.
- Flat colour recipe: "unlit" material, emissive set for ACES (red >1, blue ~0), glow.addExcludedMesh; LEGION_HELM reuses it.
- Critic 385 minors: straps read grey-brown under swiftshader; shin above the laces is dark team cloth.
