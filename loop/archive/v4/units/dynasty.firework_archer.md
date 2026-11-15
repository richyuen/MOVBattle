# dynasty.firework_archer
Status: done   Audited: 411, 421 (CONFIRM)   Done: 421
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a PASS (421: darker banded shin wraps over bare feet in strap sandals, 1801625a; hair 412, robe + sash 417; CONFIRM 421)
b PASS (420: the bow stood near upright at her front, ends over the head and below the hip, 59a5baca; fat nocked rocket 419; CONFIRM 421)
c PASS (420: she looses from a planted draw with the rocket nocked, 1cb514fd; the rocket in flight 413, the burst 418; CONFIRM 421)
d PASS (cost 180, hp 0.62x, dmg 0.27x, cd 4.00x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
## Attempts (iter | gap | criterion | verdict)
412-413 | ARCHER_HAIR, firework_bow, FIREWORK_ROCKET tube | a, b, c | approved
417-419 | ARCHER_ROBE, FIREWORK_BURST + blast (evidence 79d583da), FIREWORK_NOCK (rebuilt fat 419) | a, c, b | approved
420 | DRAWS_BEFORE_LOOSE planted full draw (1cb514fd); FIREWORK_REST upright bow (59a5baca) | c, b | approved (c PASS, b PASS)
421 | ARCHER_LEGS shin wraps + strapSandals (1801625a) | a | approved (struck 4; a PASS; CONFIRM passed)
## Rejected (last 4)
## Notes (max 3 lines)
- 421 critic: the wraps are five coarse hoops (TABS a dozen fine turns); 420: the string stays straight in _release (TABS a V to the hand), tip caps unreadable. Not blockers at lineup distance.
- Her burn status is logged at the decision (`fire` + `status:fire`, target hurt at 400 ms) while the rocket leaves at `throw` 1900 ms: the impact note is the burn, not a second rocket.
- A bow with the carry mark rests via _restIceBow as a world pose (FIREWORK_REST): clear rotationQuaternion outside the rest.
