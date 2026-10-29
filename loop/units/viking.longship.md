# viking.longship
Status: open   Audited: 391 (re), 395-402   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a PASS (401)
b PASS (399)
c FAIL (1 since 401; CONFIRM 401; struck 1 at 402)
 2. the oarsmen's oars in _struck/_release/_flight: the crew stand beside the landed hull empty-handed, no oar in hand or on the ground - TABS: the oarsmen disembark and attack enemy units with their oars (ref: .jpg, card Characteristics)
d PASS (cost 1000, hp 17.46x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] c oars after the crash - blocker 2: each oarsman keeps his oar in his fist at the disembark and the landed crew swing it two-handed as their blow (vehicleBuilder landLongshipCrew + simulationSystem crew melee) - ref: .jpg - ours: unit_viking.longship_struck.png
## Attempts (iter | gap | criterion | verdict: approved, rejected, rejected-kept, dropped)
392-395 | clinker hull; rig (393 rejected, reverted); mast out + three oars; three Long-Boaters with oars; team shields [S] | a,b | approved
396 | hurl + AoE crush + oarsmen disembark [S] (1946694) | c | approved (c PASS)
397-399 | one oval paddle blade; brown timber, stout crew; paddle head on a neck, crew feet .3 [S] | b | approved (b PASS 399)
400 | deep hull: 4 strakes, deck .4, stem, scroll stern (c0da83d) | a | approved (struck 1)
401 | two carriers + the ship at 1.8x held overhead (e0fbb2c) | a | approved (struck a.4; c reopened by CONFIRM)
402 | hull keeps its carried height at the hurl, carriers pinned at the take-off, hull sunk to the keel over .85 of the airtime (4c0305e) | c | approved (struck c.1)
## Rejected (last 4)
- rig [S] [1] - 393: a short mast, yard and two sheets - the rig is not in the reference at all; the T-frame reads as a gallows
## Notes (max 3 lines)
- 402: heaveLongshipCrew pins rig.stood (world spots); flyLongshipHull each flight step keeps the carriers there in the root's frame and sinks ship.y = shipY (1 - k); landLongshipCrew drops the hull to 0 and hides the carriers. Critic: the arc reads flat in _ability_after (TABS pitches and tumbles) - not a blocker.
- landLongshipCrew disables each oar node and drops the man at root-local ground positions: c.2 wants the oar kept in the fist and swung.
- 400: HULL rows 4, rowStep .13, deck .4, wall .705; timber (.2,.11,.055) + .35 self-light; LONGSHIP_CREW feet .3, top 1.19.
