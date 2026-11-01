# legacy.poacher
Status: open   Audited: 457, 462 (RE-AUDIT lineup)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4 (6 on a), and the count of approved [S] since the list was written)
a FAIL (5 since 457)
 4. knees in unit_legacy.poacher_idle, bare team legs — TABS: tan knee caps (ref: legacy.poacher.blue.png)
b PASS (464: chunky tan short bow with rope wraps, in the weapon fist across the front, quiver on the back; POACHER_BOW bowGrip)
c FAIL (2 since 457)
 1. arrow origin in unit_legacy.poacher_release, the shaft leaves from the hat at head height while the bow hangs at the hip — TABS: the arrow leaves the drawn bow (ref: card Weapons Poacher Bow)
d PASS (cost 120, hp 0.55x, dmg 0.72x, cd 1.10x; 457 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] legacy.poacher.c draw at release — blocker 1: bow kept in the weapon fist on the march and drawn at release, arrow leaving the bow (proceduralAnimation bow carry/draw) — ref: card Weapons — ours: _release
2. [S] legacy.poacher.a knees — blocker 4: tan faceted knee caps over each knee joint — ref: legacy.poacher.blue.png — ours: _idle
## Attempts (iter | gap | criterion | verdict)
457-461 | POACHER_HAT, POACHER_HAIR, POACHER_COAT, POACHER_BELT, POACHER_BOOTS | a | approved (struck 1, 2, 3, 5, 6)
462 | quiver_back special (8e47a5ac) | b | approved (struck 2)
462 | HAND_LAUNCH arrow from the bow fist (2f129417) | c | approved (none struck: bow not drawn at release)
463 | POACHER_BOW chunky stave, rope wraps, iceBowCarry (7e2eb586) | b | approved (none struck: no fist on it)
464 | POACHER_BOW bowGrip in the fist (99c8103c); [P] wood darker (e968d1a0) | b | approved (struck 1; b PASS; wood spent for [P])
465 | SMALL_ARROW short shaft, projectileHint small_arrow (ec355f73, shared) | c | approved (struck 2)
## Rejected (last 4)
## Notes (max 3 lines)
- 459 critic (minor): leather very dark brown (TABS tan-orange); collar reads as beads. 465: the small arrow's shaft dark, TABS pale wood.
- 464 critic: walking (_windup) the bow hangs on his back by the quiver, the hand empty, and he fires with it there: CONFIRM will see it; c.1's draw fix should keep it in the fist.
