# legacy.banner_bearer
Status: open   Audited: 457   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4 (6 on a), and the count of approved [S] since the list was written)
a FAIL (2 since 457)
 3. cuffs in unit_legacy.banner_bearer_idle, bare team forearms — TABS: white cuffs (ref: legacy.banner_bearer.red.png)
b FAIL (2 since 457)
 3. grip in unit_legacy.banner_bearer_idle, one hand on the pole and the other raised and waving — TABS: both fists on the pole at the chest (ref: legacy.banner_bearer.jpg)
c FAIL (2 since 457)
 1. effect in unit_legacy.banner_bearer_release, the capture records a heal at 17 ms and nothing shows around the bearer — TABS: the Stay banner keeps allied units stationary (ref: card Characteristics)
d FAIL (cost 100, hp 1.15x, dmg 0.00x, cd 3.00x; 457 stats; dmg 0: no blow, needs an [S])
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] legacy.banner_bearer.a white cuffs — blocker 3: a white limbShell on each forearm's lower third (BANNER_COATEE.cuff) — ref: legacy.banner_bearer.red.png — ours: unit_legacy.banner_bearer_idle.png
2. [S] legacy.banner_bearer.b grip — blocker 3: both fists on the pole at the chest (POLE_GRIP two-hand hold) — ref: legacy.banner_bearer.jpg — ours: unit_legacy.banner_bearer_idle.png
## Attempts (iter | gap | criterion | verdict)
457 | STAY_BANNER gold cross-beam, two team banners with tower emblems; pole upright (c372d09e, 3244f182) | b | approved (struck 1, 2; added 4)
458 | POLE_GRIP.bearerPole (6864fd6b, shared) none struck; STAY_BANNER beam 1.0 H, banners at the ends (20dbf14b) | b | approved (struck 4)
459 | BEARER_RING ground torus 1.6 H, team colour (502c506c, shared) | c | approved (struck 2)
459 | SHAKO tall team shako, dark peak, gold plate and band, white plume (44da9220) | a | approved (struck 1, 4: feet hidden in the lineup)
460 | BANNER_COATEE team coat, gold epaulettes, white cross-belt and waist belt (16dedb8c) | a | approved (struck 2)
460 | BEARER_AURA stay on allies in the ring, ring at their feet, no heal (f1ecb6fc, shared) | c | approved (none struck: not seen in the pair)
## Rejected (last 4)
## Notes (max 3 lines)
- c.1 evidence first (critic 460): capture.mjs must frame _release/_flight on a whole ally inside the ring (held in place, his aura ring) before another c gap.
- 460 [P] eb73db0b made his ring cyan for both teams (the flag bearer's gap; critic: toward his reference).
