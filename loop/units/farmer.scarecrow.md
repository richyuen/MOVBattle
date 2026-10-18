# farmer.scarecrow
Status: open   Audited: 339   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a PASS (346)
b PASS (341)
c FAIL (2 since 339)
 3. missing: hover on Big Crow Wings (ref: card Abilities)
d PASS (cost 1200, hp 1.38x, dmg 5.56x, cd 9.00x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] c hover — blocker 3: Big Crow Wings keep him hovered off the turf with a slow wing beat, a fall takes no damage — ref: card Abilities / farmer.scarecrow.png — ours: unit_farmer.scarecrow_release.png
## Attempts (iter | gap | criterion | verdict)
339 | big black crow wings, team wrists (CROW_WINGS) [S] (185ca19) | a | approved
340 | full-head sack mask, team button eyes (SACK) [S] (44d5b86) | a | approved
341 | black crow in each fist (HELD_CROW) [S] (6718e9a) | b | approved
342 | flying crow missiles (FLYING_CROW) [S] (d8ad061) | c | approved
343 | flying crow wing beat (FLYING_CROW.beat/.lift) [P] (d6343bd) | c | approved
344 | T-pose idle/walk, perched elbow crows (TPOSE) [S] (c3ffda9) | a | approved
345 | TPOSE.perch .07 [P] (06e5c87) | a | approved
345 | T held through the throw, A-pose reload (TPOSE.a/.after) [S] (29f6cf4) | c | approved
346 | evidence: unit_farmer.scarecrow_reload shot (18a8120) | c | blocker 2 cleared
346 | team shirt, suspendered patched trousers, straw, roped shoes (SCARECROW_DRESS) [S] (5cd3e3a) | a | approved
## Rejected (last 4)
## Notes (max 3 lines)
- T/A pose is proceduralAnimation _holdTPose; RuntimeUnit.setAttackCooldown calls animator.noteReload. capture.mjs RELOAD_SHOT takes _reload 72 ticks past the volley.
- FLYING_CROW must not be re-nudged as [P] (343). 346 critic: a held crow stays in each fist through the reload (TABS hands empty), not a blocker.
- Tunic skirt is skipped for the scarecrow in unitFactory (shirt tucked in).
