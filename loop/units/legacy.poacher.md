# legacy.poacher
Status: done   Audited: 457, 462 (RE-AUDIT lineup), 467 (CONFIRM: passed a, b, c, d)   Done: 467
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4 (6 on a), and the count of approved [S] since the list was written)
a PASS (467: dark wide-brim hat with team band, white hair and braids, brown fur-collared coat, tan belt, tan knee caps, tan boots; POACHER_KNEES; CONFIRM 467)
b PASS (464: chunky tan short bow with rope wraps, in the weapon fist across the front, quiver on the back; POACHER_BOW bowGrip; CONFIRM 467)
c PASS (467: draws before he looses, the small arrow leaving the drawn bow; DRAWS_BEFORE_LOOSE + SMALL_ARROW; CONFIRM 467)
d PASS (cost 120, hp 0.55x, dmg 0.72x, cd 1.10x; 467 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
## Attempts (iter | gap | criterion | verdict)
457-461 | POACHER_HAT, POACHER_HAIR, POACHER_COAT, POACHER_BELT, POACHER_BOOTS | a | approved (struck 1, 2, 3, 5, 6)
462-464 | quiver_back (8e47a5ac); POACHER_BOW (7e2eb586), bowGrip (99c8103c), [P] wood (e968d1a0, spent) | b | approved (b PASS 464)
462-465 | HAND_LAUNCH bow fist (2f129417); SMALL_ARROW (ec355f73) | c | approved (struck 2)
467 | DRAWS_BEFORE_LOOSE draw then loose (8faddfa9) | c | approved (struck 1; c PASS; CONFIRM passed)
467 | POACHER_KNEES tan knee caps (c676cf71, shared) | a | approved (struck 4; a PASS; CONFIRM passed)
## Rejected (last 4)
## Notes (max 3 lines)
- CONFIRM 467 (minor): the coat chocolate brown (TABS orange-brown) and hangs to mid-thigh; the arrow not visible in _flight.
- 467 critic (minor): no arrow on the string in _windup; knee caps khaki-grey near the boot shade.
