# viking.longship
Status: open   Audited: 391 (re), 395, 396, 397, 398, 399, 400, 401   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a PASS (401)
b PASS (399)
c FAIL (0 since 401; CONFIRM 401)
 1. throw take-off in unit_viking.longship_ability: no carrier is in the frame at the hurl and the hull sits on the grass while the oarsmen heave their oars; 150 ms later it floats up from ground level with nobody throwing it - TABS: the two carriers stand under the keel with both arms up and the hull leaves their hands from overhead (ref: .blue.png, card "carried by 2 Longship Carriers")
 2. the oarsmen's oars in _struck/_release/_flight: the crew stand beside the landed hull empty-handed, no oar in hand or on the ground - TABS: the oarsmen disembark and attack enemy units with their oars (ref: .jpg, card Characteristics)
d PASS (cost 1000, hp 17.46x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] c throw take-off - blocker 1: the carriers let go from overhead and the hull leaves their fists above the keel line, not with a snap to the floor - ref: .blue.png - ours: unit_viking.longship_ability.png
2. [S] c oars after the crash - blocker 2: each disembarked oarsman keeps his oar, in hand and on the ground - ref: .jpg - ours: unit_viking.longship_struck.png
## Attempts (iter | gap | criterion | verdict)
392 | clinker hull [S] (b90ffb3) | a | approved (a.1 stands)
393 | rig [S] (fe36dfc + 9980e94, reverted) | a | rejected
394 | rig: mast/sail/yard out, three oars [S] (708a90c + a61028b) | a | approved (struck a.2)
395 | three Long-Boaters with the oars hung in their fists [S] (ffa5a93) | b | approved (narrowed b.1)
395 | team shields, dark half, rim, bronze boss [S] (512a007) | a | approved (struck a.3)
396 | hurl + AoE crush + oarsmen disembark [S] (1946694) | c | approved (c PASS)
397 | one faceted oval paddle blade [S] (4d811b7) | b | approved (b.1 narrowed)
398 | brown oar timber, narrower blade, stout crew (b94068d) | b | approved (b.1 stands)
399 | paddle head one head wide on a .neck + crew feet .3 (4aec762 + 116f015) | b | approved (b PASS)
400 | deep hull: 4 strakes, deck .4, stem, scroll stern (c0da83d) | a | approved (struck 1)
401 | two carriers + the ship at 1.8x held overhead (e0fbb2c) | a | approved (struck a.4; c reopened by CONFIRM)
## Rejected (last 4)
- rig [S] [1] - 393: a short mast, yard and two sheets - the rig is not in the reference at all; the T-frame reads as a gallows
## Notes (max 3 lines)
- 401: everything aboard sits under `ship` (SHIP.scale 1.8) at y = a carrier's fist minus the keel; at the hurl heaveLongshipCrew drops it to 0 and hides the carriers (a pop the CONFIRM flagged: c.1).
- 400: HULL rows 4, rowStep .13, deck .4, wall .705; timber (.2,.11,.055) + .35 self-light; OARS blade .34/.2; LONGSHIP_CREW feet .3, top 1.19.
- landLongshipCrew disables each oar node and drops the man at root-local ground positions: c.2 wants the oar kept.
