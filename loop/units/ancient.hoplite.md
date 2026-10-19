# ancient.hoplite
Status: done   Audited: 378   Done: 385
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a PASS (385)
b PASS (383)
c PASS (381)
d PASS (cost 180, hp 1.26x, dmg 0.49x, cd 0.75x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
## Attempts (iter | gap | criterion | verdict)
379-382 | aspis (ASPIS); dory low at the hip (DORY_CARRY); thrust (DORY_THRUST); carry aimed (DORY_AIM) [S] | b,c | approved
383 | crest bands each one solid swept strip, wide .42 (CORINTH_CREST, sweptBar) [S] (376288d) | a | approved
383 | aspis rim on flat unlit trim, three big tapered wave swirls (ASPIS_WAVE) [S] (0c3eee8) | b | approved (b PASS)
384 | dark brown greaves + rim, team foot in a brown sandal (HOPLITE_LEGS) [S] (d611ead) | a | approved (struck a.2)
385 | crest: one flat-topped box on a stalk, own hat type hoplite_helm (HOPLITE_CREST) [S] (f6b09dd +79ce333) | a | approved (a PASS)
## Rejected (last 4)
## Notes (max 3 lines)
- Hat "hoplite_helm" = CORINTH_HELM bowl + HOPLITE_CREST (sarissa keeps crested_helm + CORINTH_CREST). Aspis on body.torso at ASPIS; probe output/loop/probe_hoplite.mjs.
- Legs: ancientDress dressHoplite; sandals are the shared strapSandals (shield bearer uses it too).
- Critic 385 minor: crest box stands ~.45 of the bowl above it (TABS ~.65).
