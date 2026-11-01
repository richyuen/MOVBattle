# wild_west.miner
Status: open   Audited: 444, 452 (CONFIRM: passed c; failed a, b), 455 (CONFIRM: passed b, c; failed a), 457 (CONFIRM: failed a)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4 (6 on a), and the count of approved [S] since the list was written)
a FAIL (0 since 457; CONFIRM list) plateau (CONFIRM failed a 3 times: 452, 455, 457)
 1. hat in unit_wild_west.miner_idle: a straight-sided cylinder crown (stovepipe/top-hat silhouette) with a narrow flat brim — TABS: a tapered, faceted crown over a wide brim that tilts down at the front and sides, a slouched prospector's hat (ref: reference/units/wild_west.miner.red.png, wild_west.miner.blue.png, reference/factions/wild_west.jpg 2nd from left)
b PASS (454: pick shouldered upright past the hat, fist at the chin, two-handed in the windup; PICK_SHOULDER; CONFIRM 455)
c PASS (451: the iron head comes down in front of him onto the man, blast after; _aimPick; CONFIRM 452)
d PASS (cost 200, hp 2.72x, dmg 1.07x, cd 3.49x; 457 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [R] a plateau - one rebuild of MINER_HAT from the CONFIRM 457 list: a tapered faceted crown narrowing to its top over a wide brim sloping down at the front and sides (PEAK_HAT's lampshade brim is the precedent), keeping the team colour - ref: red.png, blue.png, faction jpg - ours: unit_wild_west.miner_idle, lineup_wild_west (CONFIRM 457)
## Attempts (iter | gap | criterion | verdict)
445-446 | MINER_PICK long haft + POLE_GRIP.minerHaft | b | approved (b PASS)
447-455 | MINER_CAP, OVERALLS, MOUSTACHE, BOOTS, UPRIGHT, HAT, LEGS, SLEEVES | a | approved
447-451 | MINER_BLAST burst; _aimPick haft along _aimTip | c | approved (c PASS)
453-454 | PICK_SHOULDER rest, palm at the chin (0a616333, aeb80c8a) | b | approved (b PASS; CONFIRM 455 passed b)
457 | [R] MINER_BUILD lanky trunk bulk .84 torsoWidth .92, legLength 1.16, waist band flush, slim trouser legs (b6a093c2) | a | approved (struck 1, 2; a PASS; CONFIRM failed a on the hat)
## Rejected (last 4)
## Notes (max 3 lines)
- unitVisuals miner: scale 1.12, bulk .84, torsoWidth .92, legLength 1.16, upperLegWidth .88, lowerLegWidth .8, posePreset brute (its shoulder splay kept for PICK_SHOULDER).
- The hat is wildWestDress MINER_HAT (8-sided crown 1.2 W, brim 1.85 W, slope .16, top .86): the CONFIRM reads it as a stovepipe; the 454 critic also called the crown near-straight with a flat top.
- 453 probe: the sunk idle stance bowed the head - that was the "back of the head" (not a camera turn).
