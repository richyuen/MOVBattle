# legacy.blowdarter
Status: open   Audited: 457, 462 (RE-AUDIT lineup)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4 (6 on a), and the count of approved [S] since the list was written)
a FAIL (1 since 457)
 2. chest in unit_legacy.blowdarter_idle, plain team torso — TABS: a tan feathered scarf in a V with white feathers hanging (ref: legacy.blowdarter.blue.png, card Appearance)
 3. legs in unit_legacy.blowdarter_idle, team legs to the feet — TABS: brown knee-length pants with a fringed team-band hem (ref: legacy.blowdarter.red.png)
b FAIL (0 since 457)
 1. blowpipe in unit_legacy.blowdarter_idle, a short stick on the back, empty hands forward — TABS: a long wooden blowgun held at the mouth in both hands, crossed arms (ref: legacy.blowdarter.red.png)
 2. blowpipe in unit_legacy.blowdarter_windup, not visible — TABS: blowgun levelled at the mouth (ref: legacy.blowdarter.png)
c FAIL (0 since 457)
 1. dart origin in unit_legacy.blowdarter_release, the shaft leaves from the hat and no pipe is at the mouth — TABS: the dart leaves the blowgun muzzle (ref: legacy.blowdarter.png)
 2. projectile in unit_legacy.blowdarter_ability_after, an arrow-length shaft — TABS: a small blowdart (ref: card Weapons)
 3. poison in unit_legacy.blowdarter_struck, status:poison is recorded but the target shows no tint or effect — TABS: the hit unit is poisoned and slowly dies (ref: card Characteristics)
d PASS (cost 220, hp 1.08x, dmg 0.16x, cd 0.90x; 457 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] legacy.blowdarter.b blowpipe — blocker 1: blowgun held level at the mouth in both hands, crossed-arm pose, dart from its muzzle (clears b.1, b.2, c.1's pipe clause) — ref: legacy.blowdarter.red.png — ours: _idle
2. [S] legacy.blowdarter.a chest — blocker 2: tan V scarf with 5-6 white feather slabs — ref: legacy.blowdarter.blue.png — ours: _idle
## Attempts (iter | gap | criterion | verdict)
462 | BLOWDARTER_HAIR brown bob, bare head (918046b8) | a | approved (struck 1; 4, 5 by the lineup test)
462 | MOUTH_LAUNCH dart from the head front (2f129417, half) | c | rejected (reverted 24f067a4)
## Rejected (last 4)
- MOUTH_LAUNCH [S] 1 - 462: dart launched from the head-box front - still leaves at crown height, no pipe at the mouth
## Notes (max 3 lines)
- The dart origin waits for the blowgun hold (b.1): launch from the pipe muzzle, not the head.
- 462 critic (minor): the hair cap is a flat slab overhanging the brow; TABS hugs the crown with a parting.
