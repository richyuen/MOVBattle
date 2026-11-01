# wild_west.dynamite_thrower
Status: open   Audited: 444, 454 (CONFIRM: passed b, c; failed a)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (0 since 454; CONFIRM list)
 1. team-colour shirt on the torso in lineup_wild_west (red team, leftmost unit) renders olive-brown, not red; the gunslinger's torso in the same frame is red-mauve — TABS: red shirt on the red team (ref: reference/units/wild_west.dynamite_thrower.red.png; card Appearance "a team color shirt")
 2. sleeves in unit_wild_west.dynamite_thrower_idle: the arms are bare light-blue skin sticks from shoulder to hand — TABS: long dark team-colour sleeves down to the wrist, only the hands in skin colour (ref: reference/units/wild_west.dynamite_thrower.blue.png)
b PASS (452: upright bundle at the belly in both hands, released for the 1 s throw; DYNAMITE_HOLD + throwWindupCap; CONFIRM 454)
c PASS (444: lit bundle thrown one-handed, blast flash and debris, the knight flung; throw at 1150 ms; CONFIRM 454)
d PASS (cost 100, hp 0.63x, dmg 0.22x, cd 49.5x; 454 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a shirt - blocker 1: no wildwest_leather vest; team-cloth shirt on the trunk (GUNSLINGER_SUIT / QUICK_DRAW_VEST pattern) - ref: red.png - ours: lineup_wild_west (CONFIRM 454)
2. [S] a sleeves - blocker 2: team sleeves to the wrist (DEADEYE_SHIRT limb-shell pattern, team cloth, dark shade) - ref: blue.png - ours: unit_wild_west.dynamite_thrower_idle (CONFIRM 454)
## Attempts (iter | gap | criterion | verdict)
449 | DYNAMITE_WIRES black two-leg wire per stick, fuse black (3adeea7c) | b | approved (struck 2)
449 | PEAK_HAT (wildWestDress, shared with the deadeye) hat "peak_hat" (221f3f5a) | a | approved (struck 1)
451-452 | DYNAMITE_HOLD + throwWindupCap 1 s (rejected c3d7f4df, resubmit 8326af8e) | b | approved (struck 1; b PASS)
452 | DYNAMITE_SKIRT knee skirt, gold stripe pair per face, gold hem band (d87b2f79) | a | approved (struck 2)
453 | DYNAMITE_BOOTS black boots, folded cuff (7d3f3350); [P] skirt teamGlow 0 (13a8ccd3) | a | approved (struck 4)
454 | WESTERN_BRAID on her off side (e92d6925) | a | approved (struck 3; a PASS; CONFIRM passed b, c, failed a)
## Rejected (last 4)
- two-handed hold [S] [1] - 451: _holdDynamite held through the fire event, no throw (c regression)
## Notes (max 3 lines)
- Her throw windup was cooldown x .36 (~30 s at cd 49.5x); visualConfig.throwWindupCap 1 caps it (452).
- 452 critic: the held bundle is squat (DYNAMITE_HOLD.size .78 -> .95 [P]).
- 453 critic: the skirt a muted mauve-pink (TABS saturated red), the stripes cream-white (TABS gold) - not blockers.
