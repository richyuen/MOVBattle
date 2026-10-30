# pirate.flintlock
Status: open   Audited: 422   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (2 since 422)
 3. the shins in unit_pirate.flintlock_idle - bare - TABS: grey socks between the pant cuff and brown shoes (ref: pirate.flintlock.blue.png; card "socks")
 4. the sides of the head in unit_pirate.flintlock_idle - bare under the cap - TABS: long dark-team hair falling to the shoulders either side of the face (ref: pirate.flintlock.red.png; card "hair")
  (struck 1 at 423; 2 at 424)
b PASS (424: a pistol held out level in each fist at shoulder height)
c PASS (426: a flash and a ball from each pistol's bell, the pistols thrown away)
d PASS (cost 100, hp 0.55x, dmg 0.61x, cd 2.50x; 426 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a hair - blocker 4: long dark hair chunks falling to the shoulders either side of the face - ref: pirate.flintlock.red.png - ours: unit_pirate.flintlock_idle (426 rank 8)
2. [S] a socks - blocker 3: grey sock shells from the pant cuff to the shoe (pirateDress) - ref: pirate.flintlock.blue.png - ours: unit_pirate.flintlock_idle (426 rank 9)
## Attempts (iter | gap | criterion | verdict)
423 | PISTOL prop + _aimPistol held out (5b56edc3, caf27b2a) | b | approved (struck 1, 3)
423 | PIRATE_VEST open vest (e6ed0749) | a | approved (struck 1)
424 | off-hand pistol, _aimPistol both arms (785cfeb0) | b | approved (struck 2; b PASS)
424 | PIRATE_PANTS brown pants to mid-shin, turned cuff (87042b0e) | a | approved (struck 2)
425 | GUN_TOSS pistols thrown at the shot, disarmToFists (36eb9aaa) | c | approved (struck 2)
426 | PISTOL_SHOT flash + ball streak at each bell, spawnPistolShot (7e83d5a4) | c | approved (struck 1; c PASS)
## Rejected (last 4)
## Notes (max 3 lines)
- The "flintlock" prop (propBuilder PISTOL) is shared with gunslinger/quick_draw/bank_robbers/queen; the toss (GUN_TOSS.units) and the bell shot (_pistolBells, spawnPistolShot) are the flintlock's alone.
- 426 defect: the bell puff still about head-sized. 425: pistols fly straight up over his head (TABS cast aside). 424: pants warmer than the render's dusty mid-brown.
