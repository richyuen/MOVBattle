# viking.longship
Status: open   Audited: 391 (re), 395-402, 403 (CONFIRM)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (0 since 403; the CONFIRM's list - the gap critic had a PASS since 401)
 1. team-coloured gunwale rails (two long blue bars running the length of the hull over the shield row) in unit_viking.longship_idle - TABS: the hull is brown wood throughout, team colour only on the hanging shields (ref: .red.png, .jpg)
 2. shield faces in unit_viking.longship_idle: a dark disc with only a team-coloured crescent - TABS: the whole shield face team colour with brown plank lines, a wooden rim and a dark boss (ref: .blue.png, .jpg; card Appearance "Brawler shields")
 3. hull silhouette in unit_viking.longship_idle: a straight-sided rectangular box with a flat top - TABS: a curved boat hull whose sheer sweeps up into a tall bow and a curled stern (ref: .jpg, .red.png)
 4. carriers in unit_viking.longship_idle: plain team mannequins - TABS: bearded vikings with a brown braided beard, a horned headband and a belt with a round buckle (ref: .red.png, .blue.png)
b PASS (399; CONFIRM 403)
c PASS (403; CONFIRM 403)
d PASS (cost 1000, hp 17.46x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a rails - blocker 1: the gunwale rails in the hull timber, not the team body material (vehicleBuilder hull rails) - ref: .jpg - ours: unit_viking.longship_idle.png
2. [S] a shields - blocker 2: full team-colour shield faces with plank lines, a wooden rim and a dark boss (the Brawler board's cut) - ref: .blue.png - ours: unit_viking.longship_idle.png
## Attempts (iter | gap | criterion | verdict: approved, rejected, rejected-kept, dropped)
392-399 | clinker hull; rig (393 rejected); oars + crew; team shields; hurl + crush + disembark (c PASS 396); paddle blades, timber, stout crew (b PASS 399) [S] | a,b,c | approved
400 | deep hull: 4 strakes, deck .4, stem, scroll stern (c0da83d) | a | approved (struck 1)
401 | two carriers + the ship at 1.8x held overhead (e0fbb2c) | a | approved (a PASS; c reopened by CONFIRM)
402 | hull keeps its carried height at the hurl, carriers pinned, hull sunk over .85 of the airtime (4c0305e) | c | approved (struck c.1)
403 | the landed oarsmen keep their oars and chop two-handed; each downstroke lands LONGSHIP_OARS on the nearest foe (0d30de1) | c | approved (c PASS); CONFIRM failed a
## Rejected (last 4)
- rig [S] [1] - 393: a short mast, yard and two sheets - the rig is not in the reference at all; the T-frame reads as a gallows
## Notes (max 3 lines)
- 403: OAR_CHOP (vehicleBuilder swingLongshipCrew) poses the landed crew; simulationSystem _chopOars lands the blows, not hit-logged (the crash is the logged hit).
- 402: heaveLongshipCrew pins rig.stood; flyLongshipHull sinks ship.y over the flight; landLongshipCrew drops the hull and hides the carriers.
- 400: HULL rows 4, deck .4, wall .705; timber (.2,.11,.055) + .35 self-light; values in LEDGER's compacted viking row.
