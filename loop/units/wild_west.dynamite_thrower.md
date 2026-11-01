# wild_west.dynamite_thrower
Status: open   Audited: 444   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (3 since 444)
  (struck 1 at 449; 2 at 452; 4 at 453)
 3. braided hair in unit_wild_west.dynamite_thrower_idle: none — TABS: brown braid over the off shoulder (ref: red.png)
b PASS (452: upright bundle at the belly in both hands, released for the 1 s throw; DYNAMITE_HOLD + throwWindupCap)
c PASS (444: lit bundle thrown one-handed, blast flash and debris, the knight flung; 452 throw at 1150 ms)
d PASS (cost 100, hp 0.63x, dmg 0.22x, cd 49.5x; 453 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a braid - blocker 3: unitFactory westernBraid(scene, body, -1) on her (WESTERN_BRAID, the Deadeye's at 453), under the peaked brim - ref: red.png - ours: unit_wild_west.dynamite_thrower_idle (critic 452, 453)
## Attempts (iter | gap | criterion | verdict)
449 | DYNAMITE_WIRES black two-leg wire per stick, fuse black (3adeea7c) | b | approved (struck 2)
449 | PEAK_HAT (wildWestDress, shared with the deadeye) hat "peak_hat" (221f3f5a) | a | approved (struck 1)
451 | DYNAMITE_HOLD _holdDynamite upright bundle at the belly, palms by the lockbox solve, size .78, fist seat only in Attacking+throw (c3d7f4df) | b | rejected (reverted 8a086de6 by hand, conflict)
452 | DYNAMITE_HOLD resubmit, released on Attacking+throw; throwWindupCap 1 s in runtimeUnit throw_release (8326af8e) | b | approved (struck 1; b PASS)
452 | DYNAMITE_SKIRT knee skirt, 6-face cylinder, gold stripe pair per face, gold hem band (d87b2f79) | a | approved (struck 2)
453 | DYNAMITE_BOOTS black boots, folded cuff .32-.46 of the shin, shaft to the sole, black feet (7d3f3350) | a | approved (struck 4)
453 | [P] DYNAMITE_SKIRT.teamGlow .12 -> 0 (13a8ccd3) | a | approved
## Rejected (last 4)
- two-handed hold [S] [1] - 451: _holdDynamite, released only on Attacking && motion "throw" - the hold stayed through the fire event, no throw in release/flight (c regression); second hand at the bundle's side, not across its front
## Notes (max 3 lines)
- Her throw windup was cooldown x .36 (~30 s at cd 49.5x); visualConfig.throwWindupCap 1 caps it (452), so the capture sees the throw at 1150 ms.
- 452 critic: the held bundle is squat (DYNAMITE_HOLD.size .78 -> .95 [P]); the trunk reads a dark brown vest, TABS a team V-neck shirt (not a blocker).
- 453 critic: the skirt a muted mauve-pink (TABS saturated red), the stripes cream-white (TABS gold) - not blockers.
