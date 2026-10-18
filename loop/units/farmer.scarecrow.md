# farmer.scarecrow
Status: open   Audited: 339   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (3 since 339)
 3. clothes in lineup_farmer plain — TABS: brown patched trousers, suspenders, team shirt, hay at cuffs (ref: farmer.scarecrow.red.png)
b PASS (341)
c FAIL (1 since 339)
 2. release from low arms and slingshot in _release — TABS: crows leave T-posed arms, A-pose reload (ref: card)
 3. missing: hover on Big Crow Wings (ref: card Abilities)
d PASS (cost 1200, hp 1.38x, dmg 5.56x, cd 9.00x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a team shirt, brown patched trousers, team-button suspenders, hay at the cuffs — blocker 3: scarecrow dress — ref: farmer.scarecrow.red.png — ours: lineup_farmer.png
2. [S] c crows leave from the T-posed arms, then an A-pose reload — blocker 2 — ref: card Characteristics — ours: unit_farmer.scarecrow_release.png
3. [P] a TPOSE.perch .035 -> ~.07 so the elbow crows stand clear above the wings — fallout of c3ffda9 (344) — NEXT shot: lineup_farmer.png, the crows on both arms
## Attempts (iter | gap | criterion | verdict)
339 | big black crow wings, team wrists (CROW_WINGS) [S] (185ca19) | a | approved
340 | full-head sack mask, team button eyes (SACK, hat sack_mask) [S] (44d5b86) | a | approved
341 | black crow in each fist (HELD_CROW, weapon crow) [S] (6718e9a) | b | approved
342 | flying crow missiles (FLYING_CROW, projectileSystem) [S] (d8ad061) | c | approved
343 | flying crow wings beat shallow about level (FLYING_CROW.beat/.lift) [P] (d6343bd) | c | approved
344 | T-pose idle/walk, crow perched on each elbow (TPOSE, buildPerchedCrow) [S] (c3ffda9) | a | approved
## Rejected (last 4)
## Notes (max 3 lines)
- T-pose is proceduralAnimation _holdTPose (keyed on rightHand child crowHeldBody), eases out when attacking; perches ride the shoulders, set upright each frame. _idle is side-on: the lineup shows the T.
- FLYING_CROW must not be re-nudged as [P] (343 critic). Crow mesh is ProjectileSystem._buildFlyingCrow; flap in the flight update.
- 339 critic: feathers read as a thin saw edge (TABS broad layered fan). Wings ride the scarecrow_post special.
