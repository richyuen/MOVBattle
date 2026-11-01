# wild_west.miner
Status: done   Audited: 444, 452 (CONFIRM: passed c; failed a, b), 455 (CONFIRM: passed b, c; failed a), 457 (CONFIRM: failed a), 458 (CONFIRM: failed a), 459 (CONFIRM: passed a)   Done: 459
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4 (6 on a), and the count of approved [S] since the list was written)
a PASS (459: [R] MINER_LOOK, eyes shown under the lifted brim, chest at the team skin tone on the --noglow swatch; CONFIRM 459)
b PASS (454: pick shouldered upright past the hat, fist at the chin, two-handed in the windup; PICK_SHOULDER; CONFIRM 455)
c PASS (451: the iron head comes down in front of him onto the man, blast after; _aimPick; CONFIRM 452)
d PASS (cost 200, hp 2.72x, dmg 1.07x, cd 3.49x; 457 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
## Attempts (iter | gap | criterion | verdict)
445-446 | MINER_PICK long haft + POLE_GRIP.minerHaft | b | approved (b PASS)
447-455 | MINER_CAP, OVERALLS, MOUSTACHE, BOOTS, UPRIGHT, HAT, LEGS, SLEEVES | a | approved
447-451 | MINER_BLAST burst; _aimPick haft along _aimTip | c | approved (c PASS)
453-454 | PICK_SHOULDER rest, palm at the chin (0a616333, aeb80c8a) | b | approved (b PASS; CONFIRM 455 passed b)
457 | [R] MINER_BUILD lanky trunk bulk .84 torsoWidth .92, legLength 1.16, waist band flush, slim trouser legs (b6a093c2) | a | approved (struck 1, 2; a PASS; CONFIRM failed a on the hat)
458 | [R] MINER_HAT slouched: lampshade brim 2.2 W slope .3, tapered crown, blunt cap (db88c15a) | a | approved (struck 1; added 2 eyes under the brim; CONFIRM failed a: eyes, chest colour)
459 | [R] MINER_LOOK hat lift .2 H, slope .22, shirt lift 0 (5bbb0646) | a | approved (struck 1, 2; a PASS; CONFIRM passed a)
## Rejected (last 4)
## Notes (max 3 lines)
- unitVisuals miner: scale 1.12, bulk .84, torsoWidth .92, legLength 1.16, upperLegWidth .88, lowerLegWidth .8, posePreset brute (its shoulder splay kept for PICK_SHOULDER).
- MINER_HAT 459: sides 8, crown 1.16, brim 2.2, slope .22, top .62, tall .5, cap .32/.16, tilt .1, lift .2.
- CONFIRM 459 minor (not blockers): boots near black (TABS dark brown), crown straighter than the crumpled TABS hat.
