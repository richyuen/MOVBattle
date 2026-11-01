# wild_west.miner
Status: open   Audited: 444, 452 (CONFIRM: passed c; failed a, b), 455 (CONFIRM: passed b, c; failed a)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (0 since 455; CONFIRM list) plateau (CONFIRM failed a twice: 452, 455)
 1. torso a wide rectangular block (pale shirt slab broader than the shoulders, with a protruding waist slab) in unit_wild_west.miner_idle — TABS: slim narrow-chested torso, standard lanky TABS build (ref: reference/units/wild_west.miner.red.png; reference/factions/wild_west.jpg second from left)
 2. legs short and stubby under the block torso in unit_wild_west.miner_idle — TABS: long thin overall legs making up about half the figure's height (ref: reference/units/wild_west.miner.blue.png)
b PASS (454: pick shouldered upright past the hat, fist at the chin, two-handed in the windup; PICK_SHOULDER; CONFIRM 455)
c PASS (451: the iron head comes down in front of him onto the man, blast after; _aimPick; CONFIRM 452)
d PASS (cost 200, hp 2.72x, dmg 1.07x, cd 3.49x; 455 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [R] a plateau - one rebuild from both CONFIRM lists (452: hat, legs, sleeves, boots - cleared 452-455; 455: slim lanky build - unitVisuals bulk 1.22 / scale down, minerOveralls waist slab .over 1.06 gone or flush, longer legs to half the height) - ref: red.png, faction jpg - ours: unit_wild_west.miner_idle, lineup_wild_west (CONFIRM 455)
## Attempts (iter | gap | criterion | verdict)
445-446 | MINER_PICK long haft + POLE_GRIP.minerHaft | b | approved (b PASS)
447-453 | MINER_CAP, MINER_OVERALLS, MINER_MOUSTACHE, MINER_BOOTS, MINER_UPRIGHT | a | approved
447-451 | MINER_BLAST burst; _aimPick haft along _aimTip | c | approved (c PASS)
453-454 | PICK_SHOULDER rest, palm at the chin (0a616333, aeb80c8a) | b | approved (b PASS; CONFIRM 455 passed b)
454 | MINER_HAT tall 8-sided team crown, sloped brim (96109e64) | a | approved (struck 1)
455 | MINER_LEGS dark team overall legs, shade .3 (63a28bba, 8ad8d441) | a | approved (struck 2)
455 | MINER_SLEEVES dark sleeves, tan glove cuffs and hands (b906f385) | a | approved (struck 4; a PASS; CONFIRM failed a)
## Rejected (last 4)
## Notes (max 3 lines)
- unitVisuals miner: scale 1.12, bulk 1.22, headSize 1.04, posePreset brute; the CONFIRM 455 block torso is the bulk + MINER_OVERALLS waist box (.over 1.06).
- 454 critic: the crown near-straight with a flat top, brim narrow (TABS tapers, wider sloped brim) - not a blocker.
- 453 probe: the sunk idle stance bowed the head - that was the "back of the head" (not a camera turn).
