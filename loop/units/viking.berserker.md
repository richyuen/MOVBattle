# viking.berserker
Status: open   Audited: 391, 395, 396, 397, 398   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (2 since 396)
 4. fur calf cuffs in _flight - TABS: big cream fur cuffs over brown boots (ref: .red.png); ours: slim blue legs and plain blue boots
 (struck 1 at 393: the axe heads; struck 2 at 394: the idle grip; struck 3 at 395: the beard; struck 4 at 396: the fur belt; struck 3 at 398: armpit hair, dark tufts in the hollow under each arm)
b PASS (394)
c PASS (392)
d PASS (cost 250, hp 1.55x, dmg 1.07x, cd 0.76x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a fur calf cuffs - blocker 4: cream fur rolls over brown boots (the brawler's kit), not slim blue legs; a new mesh, not a value nudge - ref: .red.png - ours: unit_viking.berserker_flight.png
## Attempts (iter | gap | criterion | verdict: approved, rejected, rejected-kept, dropped)
392 | Super Jump (af3f259 + bd48ae1) | c | approved (c PASS)
393 | bearded crescents on both hafts (6cfe8b5 + 671a758) | b | approved (struck b.1)
394 | idle grip: both axes stood upright (ab4c5e2 + 1add642) | b | approved (b PASS)
395 | big dark beard + moustache, plaited braid and ties (ad8f6cf) | a | approved (struck a.1)
396 | cream fur belt with a big navy Landfall buckle (180a267 + 97c6946) | a | approved (struck a.2)
397 | six dark shards a side at the top of the chest front (6904e0d + e5927fe) | a | approved (a.3 narrowed)
398 | tufts hung off the shoulder joint, fanned across the flank (7c2acb6 + cf65ff1) | a | approved (struck a.3)
## Rejected (last 4)
- (none in the last 5 iterations)
## Notes (max 3 lines)
- 398: BERSERKER_ARMPITS { in .95, across .16, drop .02, arc .12, front .95, tufts 6, len .52, wide .26, lean .3, splay .5 }, each shard parented to the shoulder joint, so they swing with the arm and sit in the crease in _windup.
- The tufts are thin shards; a fuller tuft was not asked for at lineup distance.
- The stood pair starts at full weight (_pairAxeSpawned): the idle shot is 100 ms in, an ease from zero reads as absent.
