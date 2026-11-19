# dynasty.catapults
Status: done   Audited: 610 (AUDIT x2), 612 (CONFIRM: passed b)   Done: 612
## Verdicts
a PASS (612 judge)
b PASS (612: struck 3; CONFIRM 612)
c PASS (612 judge)
## Ranked gaps
## Attempts (iter | gap | criterion | verdict)
611 | 6faa88dd diagonal echelon receding left | b | APPROVE (no strike)
612 | 01ec6438 echelon at the bridge east foot, 2.5 m | b | APPROVE (struck 1,2)
612 | 25d54b72 per-unit stage yaw ([id,x,z,yaw]), Catapults -70 deg | b | APPROVE (struck 3); CONFIRM -> D
## Rejected (last 4)
## Notes (max 3 lines)
- Stage enemy tuples take an optional yaw (degrees, + toward +z), applied at spawn in main.ts applyCampaignPlacements.
- Map: medieval_1. Preserve the scripted army counts.
