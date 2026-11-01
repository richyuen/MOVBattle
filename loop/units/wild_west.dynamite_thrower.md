# wild_west.dynamite_thrower
Status: open   Audited: 444   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (1 since 444)
  (struck 1 at 449)
 2. skirt in unit_wild_west.dynamite_thrower_idle: short dark tunic hem at the hip, no stripes — TABS: knee-length team skirt with vertical gold stripes and a gold hem band (ref: red.png; card Appearance)
 3. braided hair in unit_wild_west.dynamite_thrower_idle: none — TABS: brown braid over the off shoulder (ref: red.png)
 4. boots in unit_wild_west.dynamite_thrower_idle: plain team feet — TABS: black knee boots with a folded cuff (ref: red.png; card Appearance)
b FAIL (1 since 444)
  (struck 2 at 449)
 1. dynamite grip in unit_wild_west.dynamite_thrower_idle: bundle horizontal on the shoulder, one hand — TABS: upright bundle in front of the belly in both hands (ref: red.png; card Two-handed)
c PASS (444: lit bundle thrown one-handed, blast flash and debris, the knight flung)
d PASS (cost 100, hp 0.63x, dmg 0.22x, cd 49.5x; 451 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] b two-handed hold resubmit - blocker 1: _holdDynamite released across the whole ranged attack (warm-up to spawn) so the overhand toss returns - ref: red.png - ours: unit_wild_west.dynamite_thrower_release (critic 451)
2. [S] a striped skirt - blocker 2: wildWestDress knee-length team skirt with vertical gold stripes and a gold hem band - ref: red.png - ours: unit_wild_west.dynamite_thrower_idle (critic 449, 451)
## Attempts (iter | gap | criterion | verdict)
449 | DYNAMITE_WIRES black two-leg wire per stick, fuse black (3adeea7c) | b | approved (struck 2)
449 | PEAK_HAT (wildWestDress, shared with the deadeye) hat "peak_hat" (221f3f5a) | a | approved (struck 1)
451 | DYNAMITE_HOLD _holdDynamite upright bundle at the belly, palms by the lockbox solve, size .78, fist seat only in Attacking+throw (c3d7f4df) | b | rejected (reverted 8a086de6 by hand, conflict)
## Rejected (last 4)
- two-handed hold [S] [1] - 451: _holdDynamite, released only on Attacking && motion "throw" - the hold stayed through the fire event, no throw in release/flight (c regression); second hand at the bundle's side, not across its front
## Notes (max 3 lines)
- Her throw windup is cooldown x .36 (runtimeUnit _resolvePrimaryAttackWindup, throw_release) and her cd is 49.5x: ~30 s, so release = "fire" at 383 ms and the bundle never leaves inside the capture window ("target never hurt", 449 and 451). The hold resubmit must key off the fire/warm-up, and the throw needs its own short windup (card warm-up 1 s) to read.
- 449 evidence item (bundle across her head in the idle): the 451 hold cleared it; with the hold reverted it is back - the resubmit clears it again, else an evidence commit first.
- 449 critic: wires splay like a whisk, the curled tail does not read (not a blocker).
