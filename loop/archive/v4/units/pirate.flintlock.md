# pirate.flintlock
Status: done   Audited: 422, 430 (CONFIRM: failed a), 432 (CONFIRM: passed)   Done: 432
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a PASS (432: ginger strands either side of the face under the team bandana; CONFIRM 432)
b PASS (424: a pistol held out level in each fist at shoulder height; CONFIRM 430, 432)
c PASS (426: a flash and a ball from each pistol's bell, the pistols thrown away; CONFIRM 430, 432)
d PASS (cost 100, hp 0.55x, dmg 0.61x, cd 2.50x; 432 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
## Attempts (iter | gap | criterion | verdict)
423-426 | PISTOL + _aimPistol, off-hand pistol; PIRATE_VEST, PIRATE_PANTS; GUN_TOSS, PISTOL_SHOT | a,b,c | approved (b, c PASS)
429 | PIRATE_HAIR locks from under the cap to the shoulders (a216eda0, 70fa9c2c) | a | approved (struck 4)
430 | PLAIN_SOCKS grey sock from the pant cuff into the shoe (4fd14183) | a | approved (struck 3; a PASS; CONFIRM failed a)
431 | team CANNON_BANDANNA dome, accent bandana hat off (6561ba6f) | a | approved (struck 1)
432 | FLINTLOCK_LOCKS ginger strands in place of PIRATE_HAIR (0ddfd8fa, 6d30b7c6) | a | approved (struck 2; a PASS; CONFIRM passed: D)
## Rejected (last 4)
## Notes (max 3 lines)
- The "flintlock" prop (propBuilder PISTOL) is shared with gunslinger/quick_draw/bank_robbers/queen; the toss (GUN_TOSS.units) and the bell shot are the flintlock's alone.
- 432 CONFIRM: feet team blue (TABS brown shoes), chest opening narrow, pistols greyer than the render's wood. Not blockers.
