# legacy.banner_bearer
Status: open   Audited: 457, 461 (RE-AUDIT c, lineup)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4 (6 on a), and the count of approved [S] since the list was written)
a PASS (461: shako, coatee with epaulettes and white belts, white cuffs; BANNER_CUFFS)
b FAIL (2 since 457)
 3. grip in unit_legacy.banner_bearer_idle, one hand on the pole and the other raised and waving — TABS: both fists on the pole at the chest (ref: legacy.banner_bearer.jpg)
c FAIL (0 since 461)
 1. aura in unit_legacy.banner_bearer_release, the capture records stay at 17 ms but the ally knight standing on the bearer's cyan ring has no ring at his feet — TABS: a cyan ring round the feet of each held ally (ref: legacy.banner_bearer.jpg, card Characteristics)
d FAIL (cost 100, hp 1.15x, dmg 0.00x, cd 3.00x; 457 stats; dmg 0: no blow, needs an [S])
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] legacy.banner_bearer.c aura — blocker 1: the BEARER_AURA ring in cyan at each held ally's feet, over the grass (the ring mesh must exist) — ref: legacy.banner_bearer.jpg — ours: unit_legacy.banner_bearer_release.png
2. [S] legacy.banner_bearer.b grip — blocker 3: both fists on the pole at the chest (POLE_GRIP two-hand hold) — ref: legacy.banner_bearer.jpg — ours: unit_legacy.banner_bearer_idle.png
## Attempts (iter | gap | criterion | verdict)
457-458 | STAY_BANNER cross-beam and banners (c372d09e, 3244f182, 20dbf14b); POLE_GRIP.bearerPole (6864fd6b) | b | approved (struck 1, 2, 4)
459 | BEARER_RING ground torus (502c506c, shared) | c | approved (struck 2)
459-461 | SHAKO (44da9220), BANNER_COATEE (16dedb8c), BANNER_CUFFS (e0b0812b) | a | approved (a PASS 461)
460 | BEARER_AURA stay (f1ecb6fc, shared) | c | approved (none struck: not seen)
461 | follow-ups 0c, 0d on f1ecb6fc (ring lifted, ring material) | c | dropped (no ring on the ally; reverted)
## Rejected (last 4)
## Notes (max 3 lines)
- CONFIRM watch (critic 461): a grey-mauve tunic hem shows under the white waist belt; TABS's coat runs to the hip with no grey skirt.
- The aura ring never appears on the ally: probe applyAura first (see the flag bearer's note).
