# legacy.banner_bearer
Status: open   Audited: 457   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4 (6 on a), and the count of approved [S] since the list was written)
a FAIL (0 since 457)
 1. headgear in unit_legacy.banner_bearer_idle, bald head — TABS: a tall team shako with a gold front plate and a plume (ref: legacy.banner_bearer.red.png, card Appearance)
 2. torso in unit_legacy.banner_bearer_idle, plain team body — TABS: a military coatee with gold epaulettes and a white cross-belt (ref: legacy.banner_bearer.blue.png)
 3. cuffs in unit_legacy.banner_bearer_idle, bare team forearms — TABS: white cuffs (ref: legacy.banner_bearer.red.png)
 4. feet in unit_legacy.banner_bearer_idle, team feet — TABS: white shoes under slim team trousers (ref: legacy.banner_bearer.blue.png)
b FAIL (2 since 457)
 3. grip in unit_legacy.banner_bearer_idle, one hand on the pole and the other raised and waving — TABS: both fists on the pole at the chest (ref: legacy.banner_bearer.jpg)
c FAIL (0 since 457)
 1. effect in unit_legacy.banner_bearer_release, the capture records a heal at 17 ms and nothing shows around the bearer — TABS: the Stay banner keeps allied units stationary (ref: card Characteristics)
 2. aura ring in unit_legacy.banner_bearer_release, none — TABS: a team-coloured circle on the ground around the bearer that marks the units it affects (ref: legacy.banner_bearer.jpg)
d FAIL (cost 100, hp 1.15x, dmg 0.00x, cd 3.00x; 457 stats; dmg 0: no blow, needs an [S])
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] legacy.banner_bearer.c aura ring — blocker 2: team ground circle round the bearer marking the held units — ref: legacy.banner_bearer.jpg — ours: unit_legacy.banner_bearer_release.png
2. [P] legacy.banner_bearer.b grip — blocker 3: POLE_GRIP.bearerPole off-fist target onto the shaft at the chest (fallout of [S] 6864fd6b) — ref: legacy.banner_bearer.jpg — ours: unit_legacy.banner_bearer_idle.png
3. [S] legacy.banner_bearer.a shako — blocker 1: tall team shako with a gold plate and plume (legacyDress) — ref: legacy.banner_bearer.red.png — ours: unit_legacy.banner_bearer_idle.png
## Attempts (iter | gap | criterion | verdict)
457 | STAY_BANNER gold cross-beam, two team banners with tower emblems; pole upright (c372d09e, 3244f182) | b | approved (struck 1, 2; added 4)
458 | POLE_GRIP.bearerPole (6864fd6b, shared) none struck; STAY_BANNER beam 1.0 H, banners at the ends (20dbf14b) | b | approved (struck 4)
## Rejected (last 4)
## Notes (max 3 lines)
