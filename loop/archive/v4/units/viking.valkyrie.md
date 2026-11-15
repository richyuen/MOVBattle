# viking.valkyrie
Status: done   Audited: 391, 400, 401, 402, 404 (CONFIRM), 406 (CONFIRM)   Done: 406
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a PASS (404; CONFIRM 404, 406)
  (struck 4 at 404: the belt and ring at the waist; struck 1 at 394, 2 at 401, 3 at 402, the armour split at 403)
b PASS (406; CONFIRM 406)
  (struck 1 at 405: the blade about her height; struck 2 at 406: gold winged hilts)
c PASS (393; CONFIRM 404, 406)
d PASS (cost 500, hp 1.86x, dmg 1.68x, cd 0.50x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
## Attempts (iter | gap | criterion | verdict)
391-394 | off-hand sword (b PASS); flight FLY (392 rejected, 393 approved, c PASS); layered feather wings (struck a.1) [S] | a,b,c | approved
400-404 | her own helm; cream feathers, band, crest; VALKYRIE_COLLAR; VALKYRIE_ARMOUR; belt seated off torsoMesh (a PASS 404) | a | approved
405 | VALKYRIE_SWORD slab cut .98 of her height in both fists (2e4602e) | b | approved (struck 1)
406 | SWORD_WINGS: winged gold hilt, 3 feather slabs a side, gold grip and pommel (4d48164) | b | approved (struck 2, b PASS); CONFIRM agreed -> done
## Rejected (last 4)
- flight [S] [1] - 392: swoop keyed to every flying_hover unit (would throw the done balloon_archer) and the hover did not hold in her standing state
## Notes (max 3 lines)
- 406 critics (not blockers): the hilt wings a little large and spiky; helmet wings small; the collar cream, not tan.
- 394: unitVisuals wingStyle "layered"; `fly: true` keeps her valkyrieFly marker so FLY still finds her.
