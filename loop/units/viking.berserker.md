# viking.berserker
Status: open   Audited: 391, 395, 396, 397   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (1 since 396)
 3. armpit hair in _idle/_windup - TABS: dark hair in the hollow under each arm (ref: card "both of their armpits are hairy", .red.png); ours: six brown shards a side on the trunk's FRONT face, inboard of the arm; the armpit hollow is still bare blue and _windup shows none in the crease
 4. fur calf cuffs in _flight - TABS: big cream fur cuffs over brown boots (ref: .red.png); ours: slim blue legs and plain blue boots
 (struck 1 at 393: the axe heads; struck 2 at 394: the idle grip; struck 3 at 395: the beard; struck 4 at 396: the fur belt)
b PASS (394)
c PASS (392)
d PASS (cost 250, hp 1.55x, dmg 1.07x, cd 0.76x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a armpits - blocker 3: hang the shards off the ARM joint into the armpit hollow, not the trunk front, so _idle shows hair under both arms - ref: .red.png - ours: unit_viking.berserker_idle.png
2. [S] a fur calf cuffs - blocker 4: cream fur rolls over brown boots (the brawler's kit), not slim blue legs - ref: .red.png - ours: unit_viking.berserker_flight.png
## Attempts (iter | gap | criterion | verdict)
392 | Super Jump (af3f259 + bd48ae1) | c | approved (c PASS)
393 | bearded crescents on both hafts (6cfe8b5 + 671a758) | b | approved (struck b.1)
394 | idle grip: both axes stood upright (ab4c5e2 + 1add642) | b | approved (b PASS)
395 | big dark beard + moustache, plaited braid and ties (ad8f6cf) | a | approved (struck a.1)
396 | cream fur belt with a big navy Landfall buckle (180a267 + 97c6946) | a | approved (struck a.2)
397 | six dark shards a side at the top of the chest front (6904e0d + e5927fe) | a | approved (a.3 narrowed)
## Rejected (last 4)
## Notes (max 3 lines)
- 397: BERSERKER_ARMPITS { in .82, drop .16, front .99, tufts 6, len .34, wide .22, lean .55, spread .22 }; placed off the trunk mesh's box (bb.maximum.y - .16 of the trunk height), so they sit high on the chest front.
- 397 critic: the tufts must come off the ARM joint into the crease; the trunk front reads as stickers.
- The stood pair starts at full weight (_pairAxeSpawned): the idle shot is 100 ms in, an ease from zero reads as absent.
