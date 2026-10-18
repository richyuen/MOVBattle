# medieval.healer
Status: open   Audited: 351   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (1 since 351)
 1. headgear in unit_medieval.healer_idle is an olive cap with a brim disc — TABS: bare head, grey tonsure fringe, grey beard (ref: medieval.healer.red.png)
 3. robe details missing in unit_medieval.healer_idle — TABS: two gold bands collar to knee, gold hem trim, turned collar, grey rope belt (ref: medieval.healer.red.png)
b PASS (353)
c PASS (352)
d PASS (cost 180, hp 0.31x, dmg/cd skipped (Priest Staff ability))
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a tonsure — blocker 1: bare head, grey tonsure fringe, grey beard, replacing the olive cap — ref: medieval.healer.red.png — ours: unit_medieval.healer_idle.png
2. [S] a robe trim — blocker 3: two gold bands collar to knee, gold hem trim, turned collar, grey rope belt — ref: medieval.healer.red.png — ours: unit_medieval.healer_idle.png
## Attempts (iter | gap | criterion | verdict)
351 | gold heal beam orb to chest, ally gilded (HEAL_BEAM, GILD) [S] (8407591) | c | approved
352 | full gild: every opaque mesh on one shared gold material [S] (9e3fce4 +afcc44c) | c | approved
352 | HEAL_BEAM.core .07 -> .12 [P] (7a77ccb) | c | approved
353 | priest staff: banded orb, cross finial, upright planted hold (PRIEST_STAFF, PRIEST_HOLD) [S] (03b4e5c) | b | approved
354 | priest robe: team robe skirt hips to shins (HEALER_ROBE, hangSkirt) [S] (62b021b) | a | approved
## Rejected (last 4)
## Notes (max 3 lines)
- critic 354: the shirt's flared hem sits over the skirt at the hip, reads tunic over skirt (TABS one unbroken robe).
- critic 353 (cosmetic, b PASS): orb half a head across (TABS a head), shaft mid blue not navy.
