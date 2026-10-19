# renaissance.jouster
Status: done   Audited: 368 (re)   Done: 371
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a PASS (371)
b PASS (370)
c PASS (369)
d PASS (cost 1000, hp 8.28x vs 8.32x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
## Attempts (iter | gap | criterion | verdict)
328-337 | lance, heater, couch, plate rider, chanfron, caparison [S] | a,b,c | approved
368 | arched neck, low head, front eyes, chestnut coat (BARDED_NECK) [S] (f271f4d) | a | approved
369 | canter charge through the man, trample; hgait_* leg pivots (JOUSTER_CHARGE, HORSE_GAIT) [S] (5ac2a1e) | c | approved
370 | candy-stripe lance: team band helix half of each turn on a tan shaft (LANCE_CANDY, LANCE_TAN) [S] (14e00d6) | b | approved
370 | feather plume: 7 flat 3-blade feathers fanned off helm and poll (featherPlume) [S] (38081d7 +1edcdf2, reverted) | a | rejected
371 | feather clump: packed rings of fat icos on helm and poll (featherClump, FEATHER_CLUMP) [S] (ae2a04b) | a | approved
## Rejected (last 4)
- feather plume [S] [1] — 370: fan of 7 flat stepped blades, sky between them — read as a claw/rake/antler, pale lavender (cloth glow .2)
## Notes (max 3 lines)
- LANCE shared with secret.cavalry; _couchLance (COUCH). _holdHeater. dressJouster (JOUSTER_HELM.clump); chanfron plume CHANFRON.clump; both renaissanceDress featherClump. buildHorse shared with wild_west.lasso's pinto.
- Charge: simulationSystem JOUSTER_CHARGE on the ChargeSpec path; setCharging speeds HORSE_GAIT. Critic 370 minor: lance tan pale/creamy, team band light.
- Critic 371 minor: helm clump about 1.4 helms tall and upright (TABS about 1 helm, leaning back a little).
