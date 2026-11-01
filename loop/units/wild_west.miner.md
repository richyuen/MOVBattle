# wild_west.miner
Status: open   Audited: 444, 452 (CONFIRM: passed c; failed a, b), 455 (CONFIRM: passed b, c; failed a), 457 (CONFIRM: failed a), 458 (CONFIRM: failed a)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4 (6 on a), and the count of approved [S] since the list was written)
a FAIL (0 since 458; CONFIRM list) plateau (CONFIRM failed a 4 times: 452, 455, 457, 458)
 1. two bead eyes in unit_wild_west.miner_idle (and lineup_wild_west, 2nd figure from left) — hidden under the hat brim, only the mustache shows below it — TABS: two large white bead eyes fully visible between the brim and the mustache (ref: reference/units/wild_west.miner.red.png, .blue.png, reference/factions/wild_west.jpg 2nd figure)
 2. chest between the suspender straps in unit_wild_west.miner_idle — near-white pale lilac/pale blue, clearly lighter than the face skin, reads as a white shirt — TABS: chest is plain team skin, the same tone as the face, with dark team-colour straps (ref: reference/units/wild_west.miner.red.png, .blue.png)
b PASS (454: pick shouldered upright past the hat, fist at the chin, two-handed in the windup; PICK_SHOULDER; CONFIRM 455)
c PASS (451: the iron head comes down in front of him onto the man, blast after; _aimPick; CONFIRM 452)
d PASS (cost 200, hp 2.72x, dmg 1.07x, cd 3.49x; 457 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [R] a plateau - one rebuild from the CONFIRM 458 list: MINER_HAT kept in shape (the 458 [R] cleared the stovepipe) but seated off the eyes' world tops (LESSONS: eyes hang off the neck; seat .03 H, slope ~.22 per critic 458), and MINER_OVERALLS' shirt at the team skin tone (lift 0, not .35 toward white); give the CONFIRM a --noglow chest swatch for blocker 2 - ref: red.png, blue.png - ours: unit_wild_west.miner_idle, lineup_wild_west
## Attempts (iter | gap | criterion | verdict)
445-446 | MINER_PICK long haft + POLE_GRIP.minerHaft | b | approved (b PASS)
447-455 | MINER_CAP, OVERALLS, MOUSTACHE, BOOTS, UPRIGHT, HAT, LEGS, SLEEVES | a | approved
447-451 | MINER_BLAST burst; _aimPick haft along _aimTip | c | approved (c PASS)
453-454 | PICK_SHOULDER rest, palm at the chin (0a616333, aeb80c8a) | b | approved (b PASS; CONFIRM 455 passed b)
457 | [R] MINER_BUILD lanky trunk bulk .84 torsoWidth .92, legLength 1.16, waist band flush, slim trouser legs (b6a093c2) | a | approved (struck 1, 2; a PASS; CONFIRM failed a on the hat)
458 | [R] MINER_HAT slouched: lampshade brim 2.2 W slope .3, tapered crown, blunt cap (db88c15a) | a | approved (struck 1; added 2 eyes under the brim; CONFIRM failed a: eyes, chest colour)
## Rejected (last 4)
## Notes (max 3 lines)
- unitVisuals miner: scale 1.12, bulk .84, torsoWidth .92, legLength 1.16, upperLegWidth .88, lowerLegWidth .8, posePreset brute (its shoulder splay kept for PICK_SHOULDER).
- MINER_HAT 458: sides 8, crown 1.16, brim 2.2, slope .3, top .62, tall .5, cap .32/.16, tilt .1; its brim edge sits on the eyes (seat .06 H).
- 453 probe: the sunk idle stance bowed the head - that was the "back of the head" (not a camera turn).
