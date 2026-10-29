# viking.longship
Status: done   Audited: 391 (re), 395-402, 403 (CONFIRM), 407 (CONFIRM), 409 (CONFIRM)   Done: 409
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a PASS (409; CONFIRM 409)
b PASS (399; CONFIRM 403, 407, 409)
c PASS (403; CONFIRM 403, 407, 409)
d PASS (cost 1000, hp 17.46x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
## Attempts (iter | gap | criterion | verdict: approved, rejected, rejected-kept, dropped)
392-399 | clinker hull; rig (393 rejected); oars + crew; team shields; hurl + crush + disembark (c PASS 396); paddle blades, timber, stout crew (b PASS 399) [S] | a,b,c | approved
400-407 | deep hull; carriers + 1.8x ship; hurl height; oarsmen chop; rails; shield seams; SHEER; LONGSHIP_CARRIER | a,c | approved; CONFIRM 403, 407 failed a
408 | LONGSHIP_PROW: S-curved tube neck, head lifted .75, disc eyes with pupils (0b5a856) | a | approved (struck 1, 2)
409 | LONGSHIP_STERN: tall stern post curling into a spiral scroll (5c28a14) | a | approved (a PASS); CONFIRM passed - done
## Rejected (last 4)
- rig [S] [1] - 393: a short mast, yard and two sheets - the rig is not in the reference at all; the T-frame reads as a gallows
## Notes (max 3 lines)
- 409 CONFIRM (minor): the prow carving reads as a cartoon horse/dragon head, not TABS's flat carved scroll head; 408 critic: the neck is a thin tube.
- 409 critic (minor): the stern scroll tube is thinner than TABS's chunky carved post.
- 403: OAR_CHOP poses the landed crew; simulationSystem _chopOars lands the blows, not hit-logged.
