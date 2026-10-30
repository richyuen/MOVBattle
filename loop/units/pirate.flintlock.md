# pirate.flintlock
Status: open   Audited: 422   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (3 since 422)
 3. the shins in unit_pirate.flintlock_idle - bare - TABS: grey socks between the pant cuff and brown shoes (ref: pirate.flintlock.blue.png; card "socks")
  (struck 1 at 423; 2 at 424; 4 at 429)
b PASS (424: a pistol held out level in each fist at shoulder height)
c PASS (426: a flash and a ball from each pistol's bell, the pistols thrown away)
d PASS (cost 100, hp 0.55x, dmg 0.61x, cd 2.50x; 426 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a socks - blocker 3: grey sock shells from the pant cuff to the shoe (limbShell, like pirateSocks without the team bands) - ref: pirate.flintlock.blue.png - ours: unit_pirate.flintlock_idle (429 rank 1)
2. [P] a hair colour - fallout of 429 PIRATE_HAIR: fixed ginger (~.75,.32,.18) for team x.42, PIRATE_HAIR.top .62 -> ~.4 - shows in unit_pirate.flintlock_idle beside the face (429 rank 5)
## Attempts (iter | gap | criterion | verdict)
423 | PISTOL prop + _aimPistol held out (5b56edc3, caf27b2a) | b | approved (struck 1, 3)
423 | PIRATE_VEST open vest (e6ed0749) | a | approved (struck 1)
424 | off-hand pistol, _aimPistol both arms (785cfeb0) | b | approved (struck 2; b PASS)
424 | PIRATE_PANTS brown pants to mid-shin, turned cuff (87042b0e) | a | approved (struck 2)
425 | GUN_TOSS pistols thrown at the shot, disarmToFists (36eb9aaa) | c | approved (struck 2)
426 | PISTOL_SHOT flash + ball streak at each bell, spawnPistolShot (7e83d5a4) | c | approved (struck 1; c PASS)
429 | PIRATE_HAIR locks from under the cap to the shoulders, back fall (a216eda0, 70fa9c2c) | a | approved (struck 4)
## Rejected (last 4)
## Notes (max 3 lines)
- The "flintlock" prop (propBuilder PISTOL) is shared with gunslinger/quick_draw/bank_robbers/queen; the toss (GUN_TOSS.units) and the bell shot (_pistolBells, spawnPistolShot) are the flintlock's alone.
- 429 defects: locks team-dark, TABS ginger on both teams; slab tops stand proud beside the cap (hood-like). 426: the bell puff still about head-sized. 425: pistols fly straight up over his head (TABS cast aside). 424: pants warmer than the render's dusty mid-brown.
