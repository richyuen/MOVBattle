# legacy.peasant
Status: open   Audited: 457, 461 (RE-AUDIT lineup)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4 (6 on a), and the count of approved [S] since the list was written)
a FAIL (5 since 457)
 1. build in unit_legacy.peasant_idle, a short squat figure (size 0.62) about half the knight's height in _windup — TABS: a full-size 1.00x lanky man (ref: legacy.peasant.red.png, card Infobox Size 1.00x)
b PASS (457 audit)
c PASS (457 audit)
d PASS (cost 30, hp 0.32x, dmg 0.25x, cd 0.75x; 457 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] legacy.peasant.a build — blocker 1: a lanky 1.00x frame with legs to half the height (MINER_BUILD-style), replacing scale .62 — ref: legacy.peasant.red.png — ours: unit_legacy.peasant_idle.png
## Attempts (iter | gap | criterion | verdict)
457 | PEASANT_HOOD team cowl, peak, collar (863f64ea) | a | rejected (reverted da3672d0)
458 | PEASANT_HOOD resubmit, the cowl gap turned onto the face (2692a0f1) | a | approved (struck 2)
459 | PEASANT_DRESS team dress body, short sleeves, knee skirt with a front point (b3a3379d) | a | approved (struck 4)
460 | PEASANT_BELT 12 cream lumps round the waist, twisted by turns (9012c361) | a | approved (none struck: thin spaced shards, not a rope)
461 | PEASANT_LEGS cuffed pants to mid-shin, tan socks, brown shoes (a1d34191) | a | approved (struck 6)
461 | PEASANT_FRINGE dark locks out of the hood (5978f032) | a | approved (struck 3)
461 | [P] PEASANT_BELT fat .8, lump .5, 14 lumps (a4a2f336) | a | approved (struck 5; row spent for [P])
## Rejected (last 4)
- PEASANT_HOOD [S] 1 - 457: team cowl with a peak and a neck collar - the arc's gap faced backward (rotation.y = PI/2 + PI*open), burying the face and eyes
## Notes (max 3 lines)
- 458: the hood gap faces the face with rotation.y = PI/2 + PI*open + PI (457 had no +PI and buried the face).
- 461 critic (minor): the fringe locks stand proud of the face like blinkers (PEASANT_FRINGE.proud .04 -> 0, colour toward (.12,.08,.06)); the socks read grey-khaki.
