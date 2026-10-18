# medieval.healer
Status: open   Audited: 351   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (0 since 351)
 1. headgear in unit_medieval.healer_idle is an olive cap with a brim disc — TABS: bare head, grey tonsure fringe, grey beard (ref: medieval.healer.red.png)
 2. torso in unit_medieval.healer_idle is plain team ending at the hip — TABS: long team priest robe to the shins (ref: medieval.healer.blue.png)
 3. robe details missing in unit_medieval.healer_idle — TABS: two gold bands collar to knee, gold hem trim, turned collar, grey rope belt (ref: medieval.healer.red.png)
b PASS (353)
c PASS (352)
d PASS (cost 180, hp 0.31x, dmg/cd skipped (Priest Staff ability))
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a priest robe — blocker 2: long team robe chunk to the shins — ref: medieval.healer.blue.png — ours: unit_medieval.healer_idle.png
2. [S] a tonsure — blocker 1: bare head, grey tonsure fringe, grey beard, replacing the olive cap — ref: medieval.healer.red.png — ours: unit_medieval.healer_idle.png
## Attempts (iter | gap | criterion | verdict)
351 | gold heal beam orb to chest, ally gilded (HEAL_BEAM, GILD) [S] (8407591) | c | approved
352 | full gild: every opaque mesh on one shared gold material (GILD.coat, _gildMeshes) [S] (9e3fce4 +afcc44c) | c | approved
352 | HEAL_BEAM.core .07 -> .12 [P] (7a77ccb) | c | approved
353 | priest staff: thin team shaft, gold sleeve/cap, banded orb, cross finial, upright planted hold (PRIEST_STAFF, PRIEST_HOLD) [S] (03b4e5c) | b | approved
## Rejected (last 4)
## Notes (max 3 lines)
- _struck shows the beamed ally; _flight shows the beam (it leaves the new orb).
- critic 353 (cosmetic, b PASS): orb half a head across (TABS a head), finial crossbar unseen, gold bronze-brown, shaft mid blue not navy.
