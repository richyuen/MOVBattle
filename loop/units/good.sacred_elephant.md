# good.sacred_elephant
Status: open   Audited: 481 (AUDIT x2)   Done: -
## Verdicts
a FAIL (5 since 481)
 5. scale in unit_good.sacred_elephant_idle and lineup_good_wide: an enormous beast whose mounted rider sits far above all humanoids — TABS: a smaller elephant whose seated rider is roughly two normal unit heights above the ground (ref: reference/factions/good.jpg, reference/units/good.sacred_elephant.blue.png).
b PASS (482 gap review)
c PASS (485 rider spear throws with pull)
d PASS (490 stats)
## Ranked gaps
1. [P] good.sacred_elephant.a scale — blocker 5: rig scale down until the rider sits about two unit heights high (fallout of 38f71664/52fdcb61); in lineup_good the rider's head comes into frame — ref: reference/factions/good.jpg — ours: lineup_good.png
2. [S] good.sacred_elephant.a scale — blocker 5: shrink the body so the seated rider sits about two unit heights up — ref: reference/factions/good.jpg — ours: lineup_good_wide.png
## Attempts (iter | gap | criterion | verdict)
490 | draped flank blanket, goodDress elephantBlanket (38f71664) | a | approved (struck 6)
490 | pale flared foot pads, ELEPHANT_FOOT (52fdcb61) | a | approved (struck 3)
489 | small folded hide ears (504716a7, b6f1d5ba) | a | approved (struck 2)
486 | rider white dress (c2caca9d) | a | approved (struck 4)
485 | rider spear throws (c9266f24) | c | approved (struck 1; c PASS)
485 | continuous trunk (a18bb6c5) | a | approved (struck 1)
482 | paired rider spears (f6e3fada) | b | approved (struck 1)
## Rejected (last 4)
## Notes (max 3 lines)
- Evidence 485: lineup_good_wide shows the rider whole (a.5 re-aimed there); rig 7.38 m; a scale change re-frames shots (LESSONS: RE-AUDIT risk).
- 490 DEFECTS: blanket lacks the big gold chevrons on its face; foot pads flare like a pedestal ledge.
- Ears are vehicleBuilder elephantEars (ELEPHANT_EAR); blanket goodDress elephantBlanket (torso frame, hull ellipsoid spec at its head).
