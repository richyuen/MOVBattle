# pirate.flintlock
Status: open   Audited: 422, 430 (CONFIRM: failed a)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (1 since 430; the CONFIRM 430 list)
 2. The hair is a pair of team-dark panels down both sides of the head to the shoulders, in unit_pirate.flintlock_idle and in lineup_pirate (leftmost unit, maroon panels). TABS: ginger/orange-brown locks hang either side of the face from under the bandana, the brightest accent on the unit (ref: pirate.flintlock.blue.png; reference/factions/pirate.jpg, leftmost unit, orange locks).
  (struck 1 at 431)
b PASS (424: a pistol held out level in each fist at shoulder height; CONFIRM 430)
c PASS (426: a flash and a ball from each pistol's bell, the pistols thrown away; CONFIRM 430)
d PASS (cost 100, hp 0.55x, dmg 0.61x, cd 2.50x; 431 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a ginger locks - blocker 2: PIRATE_HAIR for the flintlock in a fixed ginger (~.75,.32,.18, read off output/loop/palette.png) on both teams instead of team x.42 - ref: pirate.flintlock.blue.png, reference/factions/pirate.jpg - ours: unit_pirate.flintlock_idle, lineup_pirate (critic 431)
2. [S] a lock shape - blocker 2: pirateHair locks as two or three thinner hanging lumps per side from under the dome, top lowered so they do not form a hood panel - ref: pirate.flintlock.blue.png - ours: unit_pirate.flintlock_idle (critic 431)
## Attempts (iter | gap | criterion | verdict)
423-426 | PISTOL + _aimPistol, off-hand pistol; PIRATE_VEST, PIRATE_PANTS; GUN_TOSS, PISTOL_SHOT | a,b,c | approved (b, c PASS)
429 | PIRATE_HAIR locks from under the cap to the shoulders (a216eda0, 70fa9c2c) | a | approved (struck 4)
430 | PLAIN_SOCKS grey sock from the pant cuff into the shoe (4fd14183) | a | approved (struck 3; a PASS; CONFIRM failed a)
431 | team CANNON_BANDANNA dome, accent bandana hat off (6561ba6f) | a | approved (struck 1)
## Rejected (last 4)
## Notes (max 3 lines)
- The "flintlock" prop (propBuilder PISTOL) is shared with gunslinger/quick_draw/bank_robbers/queen; the toss (GUN_TOSS.units) and the bell shot are the flintlock's alone.
- 430 defect (critic): the feet read team blue, not brown leather shoes. 429: locks team-dark, slab tops stand proud beside the cap (hood-like).
- Bandana since 431 is cannonBandanna (hat "none" in unitVisuals).
