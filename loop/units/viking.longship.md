# viking.longship
Status: open   Audited: 391 (re), 395, 396, 397, 398, 399, 400   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (5 since 391)
 4. composition/scale in _idle/lineup_viking: a ground-level box ~1.5x a man - TABS: held overhead by carriers, ~3x a man, three oarsmen aboard (ref: .jpg, card "six units")
  (struck 1 at 400: the deep brown clinker hull, its side standing above the deck, the stem into the dragon's neck and the rolled scroll stern; struck 2 at 394: the rig; struck 3 at 395: the shields)
b PASS (399) [[S] 399 the paddle head on a neck + crew sunk to the chest (4aec762 + 116f015) struck b.1]
c PASS (396)
 1. throw + AoE + disembark in _release/_flight (struck 396: the hull is hurled, the crash crushes and the oarsmen stand off the deck)
d PASS (cost 1000, hp 17.46x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a scale - blocker 4: two carriers holding the hull overhead, the ship about 3x a man - ref: .jpg - ours: unit_viking.longship_idle.png
## Attempts (iter | gap | criterion | verdict)
392 | clinker hull [S] (b90ffb3) | a | approved (a.1 stands)
393 | rig [S] (fe36dfc + 9980e94, reverted) | a | rejected
394 | rig: mast/sail/yard out, three oars [S] (708a90c + a61028b) | a | approved (struck a.2)
395 | three Long-Boaters with the oars hung in their fists [S] (ffa5a93) | b | approved (narrowed b.1)
395 | team shields, dark half, rim, bronze boss [S] (512a007) | a | approved (struck a.3)
396 | hurl + AoE crush + oarsmen disembark [S] (1946694) | c | approved (c PASS)
397 | one faceted oval paddle blade, not a two-cone spearhead [S] (4d811b7) | b | approved (b.1 narrowed)
398 | brown oar timber, narrower blade, stout crew sunk to the deck plank (b94068d) | b | approved (b.1 stands)
399 | paddle head one head wide on a .neck + crew feet .44 -> .3 (4aec762 + 116f015) | b | approved (b PASS)
400 | deep hull: 4 strakes to .705, deck .4, deep timber, bow stem, rolled scroll stern (c0da83d) | a | approved (struck 1)
## Rejected (last 4)
- rig [S] [1] - 393: a short mast, yard and two sheets - the rig is not in the reference at all; the T-frame reads as a gallows
## Notes (max 3 lines)
- 400: HULL rows 4, rowStep .13, strake .15, deck .4, wall .705 (side stands .3 over the deck); timber (0.2,0.11,0.055) + .35 self-light, dark (0.13,0.07,0.035); bow stem a tapered column into the dragon neck; scroll = two cylinders across the stern head.
- 400 critic: only a.4 is left on a - the ship sits on the ground; TABS has two carriers holding it overhead at ~3x a man. Carriers were absent at 399 too.
- 399: OARS blade .34 tall/.2 wide on a .neck .1, flat .25; LONGSHIP_CREW feet .3, top 1.19 (the torso .509..721).
