# viking.longship
Status: open   Audited: 391 (re), 395-402, 403 (CONFIRM), 407 (CONFIRM)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (0 since 407; the CONFIRM's list)
 1. prow neck in unit_viking.longship_idle - a squat box head sits just above the gunwale at the bow - TABS: a tall S-curved dragon/seahorse prow neck rising about a hull-depth above the hull, dominating the silhouette (ref: viking.longship.red.png, .blue.png, .jpg)
 2. prow eye in lineup_viking - a small white bead - TABS: a large white disc eye with a black pupil on the side of the head, readable at distance (ref: viking.longship.jpg, .blue.png)
 3. stern post in unit_viking.longship_idle - a blunt log end barely above the gunwale - TABS: a tall stern curling into a spiral scroll (ref: viking.longship.jpg)
b PASS (399; CONFIRM 403, 407)
c PASS (403; CONFIRM 403, 407)
d PASS (cost 1000, hp 17.46x)
## Ranked gaps (the CONFIRM gave none: each criterion's first blocker)
1. [S] a prow - blocker 1: a tall S-curved prow neck about a hull-depth over the gunwale, the head on top (vehicleBuilder buildLongship prow) - ref: .jpg - ours: unit_viking.longship_idle.png
## Attempts (iter | gap | criterion | verdict: approved, rejected, rejected-kept, dropped)
392-399 | clinker hull; rig (393 rejected); oars + crew; team shields; hurl + crush + disembark (c PASS 396); paddle blades, timber, stout crew (b PASS 399) [S] | a,b,c | approved
400-403 | deep hull (c0da83d); carriers + 1.8x ship (e0fbb2c); hull keeps height at the hurl (4c0305e); oarsmen chop (0d30de1) | a,c | approved; CONFIRM 403 failed a
404-406 | timber rails (e3fd388); shields with seams + boss (1bd1f2d); SHEER curved hull (b38c4d7) | a | approved (struck 1, 2, 3)
407 | LONGSHIP_CARRIER: braided brown beard, horned headband, round-buckle belt (562d7f1) | a | approved (struck 4, a PASS); CONFIRM failed a (new list)
## Rejected (last 4)
- rig [S] [1] - 393: a short mast, yard and two sheets - the rig is not in the reference at all; the T-frame reads as a gallows
## Notes (max 3 lines)
- 407 gap critic (minor): the carriers' headband reads pale grey, not dark leather.
- 406 critic (minor): the strake ends splay and overlap raggedly at bow and stern.
- 403: OAR_CHOP poses the landed crew; simulationSystem _chopOars lands the blows, not hit-logged.
