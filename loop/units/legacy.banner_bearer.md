# legacy.banner_bearer
Status: open   Audited: 457, 461 (RE-AUDIT c, lineup)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4 (6 on a), and the count of approved [S] since the list was written)
a PASS (461: shako, coatee with epaulettes and white belts, white cuffs; BANNER_CUFFS)
b FAIL (2 since 457)
 3. grip in unit_legacy.banner_bearer_idle, one hand on the pole and the other raised and waving — TABS: both fists on the pole at the chest (ref: legacy.banner_bearer.jpg)
c PASS (462: the held ally wears a cyan ring inside the bearer's; BEARER_RING radius 2.2)
d FAIL (cost 100, hp 1.15x, dmg 0.00x, cd 3.00x; 457 stats; dmg 0: no blow, needs an [S])
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] legacy.banner_bearer.b grip — blocker 3: both fists on the pole at the chest (POLE_GRIP two-hand hold) — ref: legacy.banner_bearer.jpg — ours: unit_legacy.banner_bearer_idle.png
## Attempts (iter | gap | criterion | verdict)
457-458 | STAY_BANNER cross-beam and banners (c372d09e, 3244f182, 20dbf14b); POLE_GRIP.bearerPole (6864fd6b) | b | approved (struck 1, 2, 4)
459-461 | SHAKO (44da9220), BANNER_COATEE (16dedb8c), BANNER_CUFFS (e0b0812b) | a | approved (a PASS 461)
459-460 | BEARER_RING (502c506c); BEARER_AURA stay (f1ecb6fc), both shared | c | approved (struck 2)
461 | follow-ups 0c, 0d on f1ecb6fc (ring lifted, ring material) | c | dropped (no ring on the ally; reverted)
462 | [P] BEARER_RING radius 1.6 -> 2.2, root exception (d9f8f8c5, shared) | c | approved (struck 1, c PASS)
## Rejected (last 4)
## Notes (max 3 lines)
- CONFIRM watch (critic 461): a grey-mauve tunic hem shows under the white waist belt; TABS's coat runs to the hip with no grey skirt.
- d: dmg 0 needs a plain blow logged as a melee hit, an [S], not a stats knob.
