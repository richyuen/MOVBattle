# viking.longship
Status: open   Audited: 391 (re), 395-402, 403 (CONFIRM), 407 (CONFIRM)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (1 since 407; the CONFIRM's list, struck 1, 2 at 408)
 3. stern post in unit_viking.longship_idle - a blunt log end barely above the gunwale - TABS: a tall stern curling into a spiral scroll (ref: viking.longship.jpg)
  (struck 1 at 408: a tall S-curved prow neck; struck 2 at 408: a big white disc eye with a black pupil)
b PASS (399; CONFIRM 403, 407)
c PASS (403; CONFIRM 403, 407)
d PASS (cost 1000, hp 17.46x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a stern scroll - blocker 3: a tall stern post off the keel end curling forward into a spiral scroll (a tube along a spiral), about two-thirds the prow's height (vehicleBuilder buildLongship) - ref: .jpg - ours: unit_viking.longship_idle.png
## Attempts (iter | gap | criterion | verdict: approved, rejected, rejected-kept, dropped)
392-399 | clinker hull; rig (393 rejected); oars + crew; team shields; hurl + crush + disembark (c PASS 396); paddle blades, timber, stout crew (b PASS 399) [S] | a,b,c | approved
400-403 | deep hull; carriers + 1.8x ship; hull keeps height at the hurl; oarsmen chop | a,c | approved; CONFIRM 403 failed a
404-406 | timber rails; shields with seams + boss; SHEER curved hull | a | approved (struck 1, 2, 3)
407 | LONGSHIP_CARRIER: braided brown beard, horned headband, round-buckle belt (562d7f1) | a | approved (a PASS); CONFIRM failed a (new list)
408 | LONGSHIP_PROW: S-curved tube neck, head lifted .75, disc eyes with pupils (0b5a856) | a | approved (struck 1, 2)
## Rejected (last 4)
- rig [S] [1] - 393: a short mast, yard and two sheets - the rig is not in the reference at all; the T-frame reads as a gallows
## Notes (max 3 lines)
- 408 critic (minor): the neck is a thin tube - TABS: a broad flat seahorse neck with a crest ridge.
- 407 gap critic (minor): the carriers' headband reads pale grey, not dark leather.
- 403: OAR_CHOP poses the landed crew; simulationSystem _chopOars lands the blows, not hit-logged.
