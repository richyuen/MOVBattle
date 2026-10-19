# medieval.healer
Status: open   Audited: 355   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (3 since 355)
 2. collar in unit_medieval.healer_idle thin gold lapel strips that merge into the chest bands and a narrow strip over the shoulder — TABS: a broad gold turned collar lying open in a V wide over the shoulders (ref: medieval.healer.red.png)
b PASS (355)
c PASS (352)
d PASS (cost 180, hp 0.31x, dmg/cd skipped (Priest Staff ability))
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [P] a collar width (fallout of 3ab7173, 357) — blocker 2: lapel and shoulder-strip width about x2.5 (HEALER_TRIM.collar reach and the lapel's inner edge); NEXT: unit_medieval.healer_idle, gold at the neck and shoulder — ref: medieval.healer.red.png
## Attempts (iter | gap | criterion | verdict)
351 | gold heal beam orb to chest, ally gilded (HEAL_BEAM, GILD) [S] (8407591) | c | approved
352 | full gild: every opaque mesh on one shared gold material [S] (9e3fce4 +afcc44c) | c | approved
353 | priest staff (PRIEST_STAFF) [S] (03b4e5c) | b | approved
354 | priest robe: team robe skirt hips to shins (HEALER_ROBE, hangSkirt) [S] (62b021b) | a | approved
355 | tonsure head (TONSURE) [S] (e5f32a0 +cf8f774) | a | approved
356 | robe trim: gold bands, hem, cuffs, collar torus, rope belt (healerRobeTrim, HEALER_TRIM) [S] (7462491) | a | approved
357 | collar: gold lapels on chestFrontAt in a V, gold shoulder strips; torus dropped (HEALER_TRIM.collar .72) [S] (3ab7173) | a | approved
## Rejected (last 4)
## Notes (max 3 lines)
- critic 357: lapels as thin as the robe bands, so they read as part of them; TABS collar is 2-3 band-widths wide.
- critic 355: fringe an even strip at the back (TABS fuller tufts over the ears). critic 354: shirt hem flares over the skirt.
