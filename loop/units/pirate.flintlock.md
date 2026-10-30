# pirate.flintlock
Status: open   Audited: 422, 430 (CONFIRM: failed a)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (0 since 430; the CONFIRM 430 list)
 1. The bandana is a fixed maroon cap on the blue man in unit_pirate.flintlock_idle (top of head). TABS: the bandana is team-coloured, blue on the blue unit and red on the red one (ref: reference/units/pirate.flintlock.blue.png, .red.png; reference/factions/pirate.jpg, leftmost unit).
 2. The hair is a pair of team-dark panels down both sides of the head to the shoulders, in unit_pirate.flintlock_idle and in lineup_pirate (leftmost unit, maroon panels). TABS: ginger/orange-brown locks hang either side of the face from under the bandana, the brightest accent on the unit (ref: pirate.flintlock.blue.png; reference/factions/pirate.jpg, leftmost unit, orange locks).
b PASS (424: a pistol held out level in each fist at shoulder height; CONFIRM 430)
c PASS (426: a flash and a ball from each pistol's bell, the pistols thrown away; CONFIRM 430)
d PASS (cost 100, hp 0.55x, dmg 0.61x, cd 2.50x; 430 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a bandana - blocker 1: the "bandana" hat built in the team colour (shade) instead of its fixed maroon, as CANNON_BANDANNA does for the cannon - ref: pirate.flintlock.blue.png - ours: unit_pirate.flintlock_idle (CONFIRM 430)
2. [S] a ginger locks - blocker 2: PIRATE_HAIR in a fixed ginger (~.75,.32,.18 off the palette) on both teams, top lowered so the slabs do not read as a hood - ref: pirate.flintlock.blue.png - ours: unit_pirate.flintlock_idle (CONFIRM 430; was the 429 [P])
## Attempts (iter | gap | criterion | verdict)
423-424 | PISTOL prop + _aimPistol, off-hand pistol (5b56edc3, caf27b2a, 785cfeb0) | b | approved (b PASS)
423-424 | PIRATE_VEST, PIRATE_PANTS (e6ed0749, 87042b0e) | a | approved (struck 1, 2)
425-426 | GUN_TOSS, PISTOL_SHOT (36eb9aaa, 7e83d5a4) | c | approved (c PASS)
429 | PIRATE_HAIR locks from under the cap to the shoulders, back fall (a216eda0, 70fa9c2c) | a | approved (struck 4)
430 | PLAIN_SOCKS grey sock from the pant cuff into the shoe (4fd14183) | a | approved (struck 3; a PASS; CONFIRM failed a)
## Rejected (last 4)
## Notes (max 3 lines)
- The "flintlock" prop (propBuilder PISTOL) is shared with gunslinger/quick_draw/bank_robbers/queen; the toss (GUN_TOSS.units) and the bell shot (_pistolBells, spawnPistolShot) are the flintlock's alone.
- 430 defect (critic): the feet read team blue, not brown leather shoes. 429: locks team-dark, slab tops stand proud beside the cap (hood-like).
- 426: the bell puff still about head-sized. 425: pistols fly straight up over his head (TABS cast aside).
