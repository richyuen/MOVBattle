# viking.longship
Status: open   Audited: 391 (re), 395, 396, 397, 398   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (3 since 391)
 1. hull/prow in _idle: the dragon head reads, but the hull is a pale flat raft of stacked beams, the deck at gunwale height, the stern a bent stick - TABS: a deep dark-brown clinker hull curving up into the stem and a rolled scroll stern (ref: .jpg, .red.png)
 4. composition/scale in _idle/lineup_viking: a ground-level box ~1.5x a man - TABS: held overhead by carriers, ~3x a man, three oarsmen aboard (ref: .jpg, card "six units")
 (struck 2 at 394: the rig; struck 3 at 395: the shields)
b FAIL (2 since 391)
 1. crew oars in _idle: the oars are warm brown now and the men stouter with long horns, but the blades are still about 1.5 heads wide and two crew-heights tall, and the crew are cut off at the belt by the deck, not sunk to the chest in the hull - TABS: a brown paddle about a head wide, stocky horned oarsmen sunk to the chest in the hull (ref: .jpg)
c PASS (396)
 1. throw + AoE + disembark in _release/_flight (struck 396: the hull is hurled, the crash crushes and the oarsmen stand off the deck)
d PASS (cost 1000, hp 17.46x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] b crew - blocker 1: a rounded paddle head one head wide on a neck in place of the leaf blade, and the crew sunk deeper (to the chest, not the belt) - ref: .jpg - ours: unit_viking.longship_idle.png
2. [S] a deep hull - blocker 1: a deep dark clinker hull curving up into the stem, a rolled stern - ref: .jpg - ours: unit_viking.longship_idle.png
3. [S] a composition - blocker 4: a ship ~3x a man held overhead by carriers - ref: .jpg - ours: lineup_viking.png
## Attempts (iter | gap | criterion | verdict)
392 | clinker hull [S] (b90ffb3) | a | approved (a.1 stands)
393 | rig [S] (fe36dfc + 9980e94, reverted) | a | rejected
394 | rig: mast/sail/yard out, three oars [S] (708a90c + a61028b) | a | approved (struck a.2)
395 | three Long-Boaters with the oars hung in their fists [S] (ffa5a93) | b | approved (narrowed b.1)
395 | team shields, dark half, rim, bronze boss [S] (512a007) | a | approved (struck a.3)
396 | hurl + AoE crush + oarsmen disembark [S] (1946694) | c | approved (c PASS)
397 | one faceted oval paddle blade, not a two-cone spearhead [S] (4d811b7) | b | approved (b.1 narrowed)
398 | brown oar timber, narrower blade, stout crew sunk to the deck plank, tall horns (b94068d) | b | approved (b.1 stands: blades too big, crew cut at the belt)
## Rejected (last 4)
- rig [S] [1] - 393: a short mast, yard and two sheets - the rig is not in the reference at all; the T-frame reads as a gallows
## Notes (max 3 lines)
- 398: LONGSHIP_CREW feet .44 (the deck plank at .625 and the gunwale at .70 cut them at the waist), horn 3.2, crew bulk 1.3/head 1.35; OARS blade .5 wide .3 in the hull's brown, self-lit.
- The critic wants the deck's cut at the chest, so feet must drop further (to ~.2) with the oars re-hung; LONGSHIP_OARS row 397 must not be nudged.
- Carriers are still absent: that is a.4, not b.
