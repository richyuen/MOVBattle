# farmer.scarecrow
Status: open   Audited: 339   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (3 since 339)
 3. clothes in lineup_farmer plain — TABS: brown patched trousers, suspenders, team shirt, hay at cuffs (ref: farmer.scarecrow.red.png)
b PASS (341)
c FAIL (2 since 339)
 2. A-pose reload not shown: needs a shot of the scarecrow ~1-2 s after the volley (release half cleared 345) — TABS: A-pose reload, elbow crows gone (ref: card)
 3. missing: hover on Big Crow Wings (ref: card Abilities)
d PASS (cost 1200, hp 1.38x, dmg 5.56x, cd 9.00x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a team shirt, brown patched trousers, team-button suspenders, hay at the cuffs and shoes — blocker 3: unitFactory scarecrow dress — ref: farmer.scarecrow.red.png — ours: lineup_farmer.png
2. evidence commit first: a scarecrow reload shot (e.g. _ability_after framed on him at release + 1.2 s) for blocker 2; then [S] c hover on Big Crow Wings — blocker 3: feet off the ground under a slow wing beat — ref: card Abilities — ours: unit_farmer.scarecrow_flight.png
## Attempts (iter | gap | criterion | verdict)
339 | big black crow wings, team wrists (CROW_WINGS) [S] (185ca19) | a | approved
340 | full-head sack mask, team button eyes (SACK, hat sack_mask) [S] (44d5b86) | a | approved
341 | black crow in each fist (HELD_CROW, weapon crow) [S] (6718e9a) | b | approved
342 | flying crow missiles (FLYING_CROW, projectileSystem) [S] (d8ad061) | c | approved
343 | flying crow wings beat shallow about level (FLYING_CROW.beat/.lift) [P] (d6343bd) | c | approved
344 | T-pose idle/walk, crow perched on each elbow (TPOSE, buildPerchedCrow) [S] (c3ffda9) | a | approved
345 | TPOSE.perch .035 -> .07 [P] (06e5c87) | a | approved
345 | T held through the throw, A-pose reload, perches hidden (TPOSE.a/.after, noteReload) [S] (29f6cf4) | c | approved
## Rejected (last 4)
## Notes (max 3 lines)
- T/A pose is proceduralAnimation _holdTPose (crowHeldBody in the fist); RuntimeUnit.setAttackCooldown calls animator.noteReload(cooldown). A-pose starts TPOSE.after s past the volley (417 ms in capture).
- FLYING_CROW must not be re-nudged as [P] (343 critic). Crow mesh is ProjectileSystem._buildFlyingCrow.
- 339 critic: feathers read as a thin saw edge (TABS broad layered fan). Wings ride the scarecrow_post special.
