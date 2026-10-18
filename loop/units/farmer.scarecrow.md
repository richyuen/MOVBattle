# farmer.scarecrow
Status: open   Audited: 339   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (2 since 339)
 3. clothes in lineup_farmer plain — TABS: brown patched trousers, suspenders, team shirt, hay at cuffs (ref: farmer.scarecrow.red.png)
 4. pose in unit_farmer.scarecrow_idle walking, no crows — TABS: T-pose, crows perched on elbows and hands (ref: farmer.scarecrow.png)
b PASS (341)
c FAIL (1 since 339)
 2. release from low arms and slingshot in _release — TABS: crows leave T-posed arms, A-pose reload (ref: card)
 3. missing: hover on Big Crow Wings (ref: card Abilities)
d PASS (cost 1200, hp 1.38x, dmg 5.56x, cd 9.00x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [P] c FLYING_CROW wings spread sideways (pivot rotation/lift so the blades lie out flat) — fallout of d8ad061 — NEXT shot: unit_farmer.scarecrow_flight.png
2. [S] c T-pose launch and A-pose reload — blocker 2: scarecrow attack pose (proceduralAnimation) — ref: card Characteristics — ours: unit_farmer.scarecrow_release.png
3. [S] a patched brown trousers, suspenders, hay cuffs — blocker 3: scarecrow dress — ref: farmer.scarecrow.red.png — ours: lineup_farmer.png
4. [S] a T-pose with perched crows — blocker 4 — ref: farmer.scarecrow.png — ours: unit_farmer.scarecrow_idle.png
## Attempts (iter | gap | criterion | verdict)
339 | big black crow wings, team wrists (CROW_WINGS) [S] (185ca19) | a | approved
340 | full-head sack mask, team button eyes (SACK, hat sack_mask) [S] (44d5b86) | a | approved
341 | black crow in each fist (HELD_CROW, weapon crow) [S] (6718e9a) | b | approved
342 | flying crow missiles (FLYING_CROW, projectileSystem) [S] (d8ad061) | c | approved
## Rejected (last 4)
## Notes (max 3 lines)
- 339 critic: feathers read as a thin saw edge (TABS broad layered fan). Wings ride the scarecrow_post special; preset iconic_scarecrow is live (hat set there too).
- 342 critic: flying crows' wings stand upright like tombstones (TABS spread out sideways). Crow mesh is ProjectileSystem._buildFlyingCrow; flap in the flight update.
- Weapon set in both table entry and preset iconic_scarecrow.
