# tribal.clubber
Status: done   Audited: 360   Done: 367
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a PASS (367)
b PASS (361)
c PASS (360)
d PASS (cost 70, hp 1.00x, dmg 1.00x, cd 1.00x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
## Attempts (iter | gap | criterion | verdict)
322-325 | hair and beard, loincloth, tusk necklace, bracelets | a | approved
361 | cudgel (CLUB) [S] (6b4a076); dreadlock mop (d59089b) | a,b | approved
362 | ragged hide loincloth (RAGGED_LOIN) [S]; [P] mop darker, wider (e4f3774) | a | approved
365 | upright lanky stance: default pose, scale .95, bulk .8, legs 1.08, arms 1.1 [S] (6fba04b) | a | approved
366 | curly mop: 22 three-piece hooked locks, crown tufts (curlyMop, CURLY_MOP) [S] (6ca5eb6) | a | approved
367 | loincloth re-cut as 5 separate torn mid-brown strips, tan skull (RAGGED_STRIPS) [S] (d0909d5) | a | approved
## Rejected (last 4)
## Notes (max 3 lines)
- 367 hide: dressTribalLoincloth `ragged` branch builds RAGGED_STRIPS ribbons (RAGGED_LOIN keeps skull/bone sizes); boneSkull takes a material (tan for him).
- Hair: curlyMop + tribalBeard in DREAD_MOP.clubberColor. critic 367 (minor): loin bones lie more level than TABS's diagonal pair.
- 365 stance: unitVisuals proportions + posePreset "default" (was "brute"); heavy_carry walk kept.
