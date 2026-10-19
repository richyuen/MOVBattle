# renaissance.jouster
Status: open   Audited: 368 (re)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (1 since 368; 1 [S] rejected)
 3. helm crest in unit_renaissance.jouster_idle: a twisted spiral horn (370 try: a pale lavender flat rake of finger-blades, read as a claw/antler) — TABS: a dense, bushy, saturated team feather clump on the helm and on the chanfron (ref: .png, .blue.png, card "colored feathers")
b PASS (370)
c PASS (369)
d PASS (cost 1000, hp 8.28x vs 8.32x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a feather plume rebuild — blocker 3: 6-9 fat faceted ico or flattened-cone fronds packed with no gaps, each nearly a head wide, stacked up and curling back (no side fan), team colour glow <= .1 to match the caparison; helm and chanfron — ref: .blue.png — ours: unit_renaissance.jouster_idle.png
## Attempts (iter | gap | criterion | verdict)
328-337 | lance, heater, couch, plate rider, chanfron, caparison [S] | a,b,c | approved
368 | arched neck, low head, front eyes, chestnut coat (BARDED_NECK) [S] (f271f4d) | a | approved
369 | canter charge through the man, trample; hgait_* leg pivots (JOUSTER_CHARGE, HORSE_GAIT) [S] (5ac2a1e) | c | approved
370 | candy-stripe lance: team band helix half of each turn on a tan shaft (LANCE_CANDY, LANCE_TAN) [S] (14e00d6) | b | approved
370 | feather plume: 7 flat 3-blade feathers fanned off helm and poll (featherPlume) [S] (38081d7 +1edcdf2, reverted) | a | rejected
## Rejected (last 4)
- feather plume [S] [1] — 370: fan of 7 flat stepped blades, sky between them — read as a claw/rake/antler, pale lavender (cloth glow .2)
## Notes (max 3 lines)
- LANCE shared with secret.cavalry; _couchLance (COUCH). _holdHeater. dressJouster (JOUSTER_HELM tufts plume). buildHorse shared with wild_west.lasso's pinto (barded changes in !pinto).
- Charge: simulationSystem JOUSTER_CHARGE on the ChargeSpec path; setCharging speeds HORSE_GAIT. Critic 370 minor: lance tan pale/creamy, team band light.
- Plume lesson: team cloth glow .2 washes out to lavender; flat blades read as fingers. Pack volumes, no gaps.
