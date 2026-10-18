# medieval.healer
Status: open   Audited: 351   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (0 since 351)
 1. headgear in unit_medieval.healer_idle is an olive cap with a brim disc — TABS: bare head, grey tonsure fringe, grey beard (ref: medieval.healer.red.png)
 2. torso in unit_medieval.healer_idle is plain team ending at the hip — TABS: long team priest robe to the shins (ref: medieval.healer.blue.png)
 3. robe details missing in unit_medieval.healer_idle — TABS: two gold bands collar to knee, gold hem trim, turned collar, grey rope belt (ref: medieval.healer.red.png)
b FAIL (0 since 351)
 1. staff in unit_medieval.healer_idle/_release is a thick dark pole with a plain yellow ball over the shoulder — TABS: thin team staff, gold grip and butt cap, team globus cruciger (gold cross bands, finial), upright in one fist (ref: medieval.healer.blue.png)
c PASS (352)
d PASS (cost 180, hp 0.31x, dmg/cd skipped (Priest Staff ability))
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] b thin staff with globus cruciger — blocker 1: thin team staff upright in one fist, gold grip and butt cap, team orb with gold cross bands and finial — ref: medieval.healer.blue.png — ours: unit_medieval.healer_idle.png
2. [S] a priest robe — blocker 2: long team robe chunk to the shins — ref: medieval.healer.blue.png — ours: unit_medieval.healer_idle.png
## Attempts (iter | gap | criterion | verdict)
351 | gold heal beam orb to chest, ally gilded (HEAL_BEAM, GILD) [S] (8407591) | c | approved
352 | full gild: every opaque mesh on one shared gold material, restored after (GILD.coat, _gildMeshes) [S] (9e3fce4 +afcc44c) | c | approved
352 | HEAL_BEAM.core .07 -> .12 [P] (7a77ccb) | c | approved
## Rejected (last 4)
## Notes (max 3 lines)
- _struck shows the beamed ally; _flight shows the beam.
- critic 352: gild reads flat mustard, a little olive (TABS: warmer gold, orange shading) - cosmetic, c PASS.
