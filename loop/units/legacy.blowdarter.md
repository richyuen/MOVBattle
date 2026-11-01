# legacy.blowdarter
Status: open   Audited: 457, 462 (RE-AUDIT lineup)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4 (6 on a), and the count of approved [S] since the list was written)
a FAIL (1 since 457)
 2. chest in unit_legacy.blowdarter_idle, plain team torso — TABS: a tan feathered scarf in a V with white feathers hanging (ref: legacy.blowdarter.blue.png, card Appearance)
 3. legs in unit_legacy.blowdarter_idle, team legs to the feet — TABS: brown knee-length pants with a fringed team-band hem (ref: legacy.blowdarter.red.png)
b PASS (463: a long tan banded blowgun at the mouth in both fists, crossed arms; BLOWGUN + BLOWGUN_HOLD)
c FAIL (2 since 457)
 3. poison in unit_legacy.blowdarter_struck, status:poison is recorded but the target shows no tint or effect — TABS: the hit unit is poisoned and slowly dies (ref: card Characteristics)
d PASS (cost 220, hp 1.08x, dmg 0.16x, cd 0.90x; 457 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] legacy.blowdarter.c poison — blocker 3: a green poison tint/bubbles on the target while status:poison runs — ref: card Characteristics — ours: _struck
2. [S] legacy.blowdarter.a scarf — blocker 2: legacyDress BLOWDARTER_SCARF tan feathered V with white feathers hanging — ref: legacy.blowdarter.blue.png — ours: _idle
3. [S] legacy.blowdarter.a legs — blocker 3: legacyDress BLOWDARTER_PANTS brown knee pants with a fringed team hem — ref: legacy.blowdarter.red.png — ours: _idle
## Attempts (iter | gap | criterion | verdict)
462 | BLOWDARTER_HAIR brown bob, bare head (918046b8) | a | approved (struck 1; 4, 5 by the lineup test)
462 | MOUTH_LAUNCH dart from the head front (2f129417, half) | c | rejected (reverted 24f067a4)
463 | BLOWGUN banded tube + BLOWGUN_HOLD at the mouth (67888276) | b | approved (struck 1, 2; b PASS)
464 | HAND_LAUNCH "muzzle" from the blowgunMuzzle node (b42e6e1c) | c | approved (struck 1)
465 | BLOW_DART needle and team tuft, projectileHint blowdart (ec355f73, shared) | c | approved (struck 2)
## Rejected (last 4)
- MOUTH_LAUNCH [S] 1 - 462: dart launched from the head-box front - still leaves at crown height, no pipe at the mouth
## Notes (max 3 lines)
- 462 critic (minor): the hair cap is a flat slab overhanging the brow; TABS hugs the crown with a parting.
- 465 critic (minor): the dart's white streak is long and reads as a shaft at the frame edge.
