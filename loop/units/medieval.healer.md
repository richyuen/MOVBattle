# medieval.healer
Status: open   Audited: 355   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (1 since 355)
 2. robe in unit_medieval.healer_idle plain team — TABS: two gold bands collar to knee, gold hem and cuff trim, turned collar, grey rope belt (ref: medieval.healer.red.png, .blue.png)
b PASS (355)
c PASS (352)
d PASS (cost 180, hp 0.31x, dmg/cd skipped (Priest Staff ability))
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a robe trim — blocker 2: two gold bands collar to knee, gold hem and cuff trim, turned collar, grey rope belt (medievalDress) — ref: medieval.healer.red.png — ours: unit_medieval.healer_idle.png
## Attempts (iter | gap | criterion | verdict)
351 | gold heal beam orb to chest, ally gilded (HEAL_BEAM, GILD) [S] (8407591) | c | approved
352 | full gild: every opaque mesh on one shared gold material [S] (9e3fce4 +afcc44c) | c | approved
353 | priest staff: banded orb, cross finial, upright planted hold (PRIEST_STAFF, PRIEST_HOLD) [S] (03b4e5c) | b | approved
354 | priest robe: team robe skirt hips to shins (HEALER_ROBE, hangSkirt) [S] (62b021b) | a | approved
355 | tonsure head: cap dropped, grey fringe sides/back, grey beard (medievalDress TONSURE) [S] (e5f32a0 +cf8f774) | a | approved
## Rejected (last 4)
## Notes (max 3 lines)
- 355: he was not facing away (root yaw matches the others); the olive cap hid his face. His idle is near profile.
- critic 355: fringe an even strip at the back (TABS fuller tufts over the ears). critic 354: shirt hem flares over the skirt (TABS one robe).
