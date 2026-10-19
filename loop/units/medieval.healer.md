# medieval.healer
Status: open   Audited: 355   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (2 since 355)
 2. collar in unit_medieval.healer_idle two small gold tabs at the neck — TABS: broad gold turned collar lying open in a V over the shoulders (ref: medieval.healer.red.png)
b PASS (355)
c PASS (352)
d PASS (cost 180, hp 0.31x, dmg/cd skipped (Priest Staff ability))
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a collar — blocker 2: two flat gold lapel plates in a V on the chest front (chestFrontAt), replacing the hidden torus — ref: medieval.healer.red.png — ours: unit_medieval.healer_idle.png
## Attempts (iter | gap | criterion | verdict)
351 | gold heal beam orb to chest, ally gilded (HEAL_BEAM, GILD) [S] (8407591) | c | approved
352 | full gild: every opaque mesh on one shared gold material [S] (9e3fce4 +afcc44c) | c | approved
353 | priest staff: banded orb, cross finial, upright planted hold (PRIEST_STAFF) [S] (03b4e5c) | b | approved
354 | priest robe: team robe skirt hips to shins (HEALER_ROBE, hangSkirt) [S] (62b021b) | a | approved
355 | tonsure head: cap dropped, grey fringe sides/back, grey beard (TONSURE) [S] (e5f32a0 +cf8f774) | a | approved
356 | robe trim: two gold bands, hem band, cuffs, collar torus, rope belt (healerRobeTrim, HEALER_TRIM) [S] (7462491) | a | approved
## Rejected (last 4)
## Notes (max 3 lines)
- critic 356: the collar torus sits inside the shoulder yoke (the visible chest is the yoke hull, not torsoMesh); bands thin, a little olive.
- critic 355: fringe an even strip at the back (TABS fuller tufts over the ears). critic 354: shirt hem flares over the skirt.
