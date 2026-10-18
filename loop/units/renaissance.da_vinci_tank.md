# renaissance.da_vinci_tank
Status: open   Audited: 327   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (0 since 327)
 1. hull in unit_renaissance.da_vinci_tank_idle is a smooth steep team cone — TABS: low wide two-tier conical roof of team planks with dark seams and rivets (ref: renaissance.da_vinci_tank.red.png)
 2. no dark wooden drum under the roof in unit_renaissance.da_vinci_tank_idle — TABS: dark plank drum below the roof edge carrying the cannons (ref: renaissance.da_vinci_tank.red.png)
 3. detached blue cup floats behind the tank in unit_renaissance.da_vinci_tank_idle/_windup/_release/_flight — TABS: no loose piece (ref: renaissance.da_vinci_tank.blue.png)
 4. tank in lineup_renaissance is about two men wide — TABS: roof spans about four men (ref: reference/factions/renaissance.jpg)
b FAIL (0 since 327)
 1. cannons in unit_renaissance.da_vinci_tank_idle are ~8 thin short team stubs on the cone — TABS: 16 thick dark-grey octagonal barrels with muzzle rings around the drum, out about half the roof radius (ref: renaissance.da_vinci_tank.red.png)
c PASS (330)
d PASS (cost 4000, hp 62.02x, dmg 0.58x, cd 1.75x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a two-tier plank roof over a dark drum — blockers 1+2 (+3 the loose cup): wide shallow two-tier team plank roof with dark seams over a dark plank drum — ref: renaissance.da_vinci_tank.red.png — ours: unit_renaissance.da_vinci_tank_idle.png
2. [S] b 16 thick octagonal barrels — blocker 1: 16 dark-grey octagonal barrels with muzzle rings round the drum, out ~half the roof radius — ref: renaissance.da_vinci_tank.red.png — ours: unit_renaissance.da_vinci_tank_idle.png
## Attempts (iter | gap | criterion | verdict)
329 | cannonballs that shatter on impact [S] (495e7d1) | c | approved
330 | spinning drum [S] (7b89341) | c | approved
## Rejected (last 4)
## Notes (max 3 lines)
- The hull, barrels, muzzle sockets and viewport ride "davinci_spin" (vehicleBuilder); RuntimeUnit._spinDrum turns it (DRUM_SPIN). A rebuilt roof/drum/barrels must stay under that node.
- Critic 329 defect on the shot: streaks start on the cone's flank above the stubs, not at the muzzles (davinci_ball, spawnShatter).
