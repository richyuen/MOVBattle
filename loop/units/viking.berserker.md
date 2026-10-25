# viking.berserker
Status: done   Audited: 391, 395, 396, 397, 398, 399   Done: 399
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a PASS (399) [[S] 399 the Brawler's leg kit (52ba964) struck a.4; CONFIRM 399 a/b/c/d all PASS]
b PASS (394)
c PASS (392)
d PASS (cost 250, hp 1.55x, dmg 1.07x, cd 0.76x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. none — done 399. Not blockers at lineup distance (CONFIRM): the helm dome is slate rather than team-dyed, the horns smaller/greyer than the tan sweep, the torso a sleeveless tunic rather than bare skin.
## Attempts (iter | gap | criterion | verdict: approved, rejected, rejected-kept, dropped)
392 | Super Jump (af3f259 + bd48ae1) | c | approved (c PASS)
393 | bearded crescents on both hafts (6cfe8b5 + 671a758) | b | approved (struck b.1)
394 | idle grip: both axes stood upright (ab4c5e2 + 1add642) | b | approved (b PASS)
395 | big dark beard + moustache, plaited braid and ties (ad8f6cf) | a | approved (struck a.1)
396 | cream fur belt with a big navy Landfall buckle (180a267 + 97c6946) | a | approved (struck a.2)
397 | six dark shards a side at the top of the chest front (6904e0d + e5927fe) | a | approved (a.3 narrowed)
398 | tufts hung off the shoulder joint, fanned across the flank (7c2acb6 + cf65ff1) | a | approved (struck a.3)
399 | the Brawler's leg kit: puffy trousers, cream fur calf rolls, brown boots (52ba964) | a | approved (struck a.4; DONE with CONFIRM 399)
## Rejected (last 4)
- (none in the last 5 iterations)
## Notes (max 3 lines)
- 399: unitFactory's berserker branch calls vikingDress brawlerLegs (BRAWLER_LEGS); the same cut on his own limb boxes, no bare shin between hem and boot.
- The stood pair starts at full weight (_pairAxeSpawned): the idle shot is 100 ms in, an ease from zero reads as absent.
- CONFIRM 399's near-misses are prose only (see Ranked gaps); a re-open would need a new audit.
