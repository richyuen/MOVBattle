# viking.longship
Status: open   Audited: 391 (re), 395, 396, 397   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (3 since 391)
 1. hull/prow in _idle: the dragon head reads, but the hull is a pale flat raft of stacked beams, the deck at gunwale height, the stern a bent stick - TABS: a deep dark-brown clinker hull curving up into the stem and a rolled scroll stern (ref: .jpg, .red.png)
 4. composition/scale in _idle/lineup_viking: a ground-level box ~1.5x a man - TABS: held overhead by carriers, ~3x a man, three oarsmen aboard (ref: .jpg, card "six units")
 (struck 2 at 394: the rig; struck 3 at 395: the shields)
b FAIL (2 since 391)
 1. crew oars in _idle: the blades are flat ovals now, not spearhead diamonds, but they are near-black discs taller than the crew, and the men are slim mannequins with pinhead horns standing on the deck - TABS: a brown paddle about a head wide, stocky horned oarsmen sunk to the chest in the hull (ref: .jpg)
c PASS (396)
 1. throw + AoE + disembark in _release/_flight (struck 396: the hull is hurled, the crash crushes and the oarsmen stand off the deck)
d PASS (cost 1000, hp 17.46x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] b crew - blocker 1: stocky horned bodies sunk to the chest in the hull, fists on the shafts (LONGSHIP_CREW) - ref: .jpg - ours: unit_viking.longship_idle.png
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
## Rejected (last 4)
- rig [S] [1] - 393: a short mast, yard and two sheets - the rig is not in the reference at all; the T-frame reads as a gallows
## Notes (max 3 lines)
- 397: the blade is one octagonal slab (CreateCylinder tessellation 8, rotated flat, scaled bladeWide x blade x thickness); OARS.blade .5, bladeWide .42. It reads near-black and taller than the crew.
- 396: LONGSHIP_HURL (reach 5.5, rise 7.5, radius 3.1); hurl logged at take-off, ship_crash + a hit at the landing; RuntimeUnit.landings is the touchdown clock.
- Carriers are still absent: that is a.4, not c. The crew are bare slim mannequins with pinhead horns (b.1).
