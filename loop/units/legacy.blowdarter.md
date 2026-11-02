# legacy.blowdarter
Status: open   Audited: 457, 462 (RE-AUDIT lineup), 468 (CONFIRM: passed b, c; failed a)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4 (6 on a), and the count of approved [S] since the list was written)
a FAIL (0 since 468)
 1. pants colour in unit_legacy.blowdarter_idle — TABS: the knee pants are team-coloured (red on red, blue-violet on blue) with a tan fringed hem; ours are solid brown from belt to knee, also brown thighs in lineup_legacy, centre, the crouched red figure (ref: legacy.blowdarter.red.png, legacy.blowdarter.blue.png, legacy.blowdarter.png)
 2. feathered V scarf in unit_legacy.blowdarter_idle — TABS: a large tan V over the chest front with white feather drops, the unit's most readable accent from the front; ours shows only a thin tan edge strip with white tips beside the near arm, and none of it reads in lineup_legacy (ref: legacy.blowdarter.red.png, card Appearance "feathery scarf-type accessory")
 3. hair shape in unit_legacy.blowdarter_idle — TABS: a dark-brown bob with a centre part and side locks down to the jaw, framing the face; ours is a flat brown slab behind the head with a flat lid overhanging the brow, which reads as a cap or mortarboard (ref: legacy.blowdarter.blue.png)
b PASS (463: a long tan banded blowgun at the mouth in both fists, crossed arms; BLOWGUN + BLOWGUN_HOLD; CONFIRM 468)
c PASS (467: dart from the blowgun at the mouth, the struck man dyed green and drained; BLOW_DART + POISON; CONFIRM 468)
d PASS (cost 220, hp 1.08x, dmg 0.16x, cd 0.90x; 468 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] evidence: capture.mjs shoots unit_legacy.blowdarter_idle before the blowgun aim turns the trunk, so the chest front faces the camera (critic 468; blocker 2 cannot be judged side-on)
2. [S] legacy.blowdarter.a pants — blocker 1: team thighs (or no shell), a tan hem band and tan fringe tabs at the knee — ref: legacy.blowdarter.red.png — ours: _idle
3. [S] legacy.blowdarter.a hair — blocker 3: a bob with a centre part and side locks to the jaw, in place of the slab and lid — ref: legacy.blowdarter.blue.png — ours: _idle
## Attempts (iter | gap | criterion | verdict)
462 | BLOWDARTER_HAIR brown bob, bare head (918046b8) | a | approved (struck 1; 4, 5 by the lineup test)
462 | MOUTH_LAUNCH dart from the head front (2f129417, half) | c | rejected (reverted 24f067a4)
463 | BLOWGUN banded tube + BLOWGUN_HOLD at the mouth (67888276) | b | approved (struck 1, 2; b PASS)
464 | HAND_LAUNCH "muzzle" from the blowgunMuzzle node (b42e6e1c) | c | approved (struck 1)
465 | BLOW_DART needle and team tuft, projectileHint blowdart (ec355f73, shared) | c | approved (struck 2)
467 | POISON green dye, 4 dps for 6 s (ab237b96) | c | approved (struck 3; c PASS)
468 | BLOWDARTER_SCARF tan V, 5 white feathers (6539168f, shared) | a | approved (none struck: seen edge-on)
468 | BLOWDARTER_PANTS brown thighs, team fringed hem (6539168f, shared) | a | rejected (hunk reverted a49b8e78)
## Rejected (last 4)
- MOUTH_LAUNCH [S] 1 - 462: dart launched from the head-box front - still leaves at crown height, no pipe at the mouth
- BLOWDARTER_PANTS [S] 1 - 468: brown pants, team fringed hem - colours inverted against the renders (team shorts, tan fringe)
## Notes (max 3 lines)
- 468: the CONFIRM list replaced the 457 list (pants blocker now follows the renders: team shorts, tan fringe; the card's "brown" is wrong).
- 468 CONFIRM (minor): the red feather streamer on the pipe is missing. 465 critic (minor): the dart's white streak reads as a shaft.
- 467: the poison dye stays on the skin, the clothes faint.
