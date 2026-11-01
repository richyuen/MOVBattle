# legacy.peasant
Status: open   Audited: 457   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4 (6 on a), and the count of approved [S] since the list was written)
a FAIL (1 since 457)
 1. build in unit_legacy.peasant_idle, a short squat figure (size 0.62) about half the knight's height in _windup — TABS: a full-size 1.00x lanky man (ref: legacy.peasant.red.png, card Infobox Size 1.00x)
 3. hair in unit_legacy.peasant_idle, none — TABS: dark shaggy fringe hanging out of the hood over the eyes (ref: legacy.peasant.red.png)
 4. torso in unit_legacy.peasant_idle, plain team body block — TABS: a knee-length team dress with short sleeves and a pointed hem (ref: legacy.peasant.blue.png, card Appearance)
 5. waist in unit_legacy.peasant_idle, no belt — TABS: a thick cream braided rope belt (ref: legacy.peasant.red.png)
 6. lower legs in unit_legacy.peasant_idle, team legs to the feet — TABS: cuffed team pants above tan socks and brown shoes (ref: legacy.peasant.blue.png)
b PASS (457 audit)
c PASS (457 audit)
d PASS (cost 30, hp 0.32x, dmg 0.25x, cd 0.75x; 457 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] legacy.peasant.a torso — blocker 4: a sleeved knee-length team dress with a pointed hem (legacyDress) — ref: legacy.peasant.blue.png — ours: unit_legacy.peasant_idle.png
2. [S] legacy.peasant.a full-size build — blocker 1: PEASANT_BUILD preset at 1.00x with lanky legs, replacing the 0.62 scale — ref: legacy.peasant.red.png — ours: unit_legacy.peasant_idle.png
## Attempts (iter | gap | criterion | verdict)
457 | PEASANT_HOOD team cowl, peak, collar (863f64ea) | a | rejected (reverted da3672d0)
458 | PEASANT_HOOD resubmit, the cowl gap turned onto the face (2692a0f1) | a | approved (struck 2)
## Rejected (last 4)
- PEASANT_HOOD [S] 1 - 457: team cowl with a peak and a neck collar - the arc's gap faced backward (rotation.y = PI/2 + PI*open), burying the face and eyes
## Notes (max 3 lines)
- 458: the hood gap faces the face with rotation.y = PI/2 + PI*open + PI (457 had no +PI and buried the face).
