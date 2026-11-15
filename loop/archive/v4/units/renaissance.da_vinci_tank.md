# renaissance.da_vinci_tank
Status: done   Audited: 368 (re)   Done: 338
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a PASS (368)
b PASS (368)
c PASS (368) (minor: balls stream from one muzzle; TABS sprays every side)
d PASS (cost 4000, hp 62.02x, dmg 0.58x, cd 1.75x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
(none; unit done)
## Attempts (iter | gap | criterion | verdict)
329-331 | cannonballs, spinning drum, two-tier plank roof, 16 barrels [S] (495e7d1, 7b89341, e4c2a2f, da39ed0) | c, a, b | approved
332 | scale: radii x1.4, heights kept [P] (caea7ba) | a | rejected
334 | taller roof by tier pitch (DAVINCI_PITCH) [S] (519d913 + 52df144) | a | rejected
337 | whole-machine scale 1.9x, flat-topped cap [S] (412d16c; evidence 09659a9) | a | approved
338 | upper tier as its own hat: collar, proud lip [S] (60fa561) | a | approved
338 | DAVINCI_SCALE 1.9 -> 2.3, pilot seat [P] (4f53c4b; evidence cf75f69) | a | approved
## Rejected (last 4)
- scale [P] [1] — 332: DAVINCI_ROOF radii and DAVINCI_CANNON.out x1.4 — widening without height flattened the roof to ~15 deg
- taller roof [S] [1] — 334: tiers raised at 41/54 deg — a witch-hat cone with a spike cap; TABS gets its height from overall size
## Notes (max 3 lines)
- Roof, drum, barrels, collar ride "davinci_spin"; base, wheels, Da Vinci, sockets ride "davinci_chassis"; both grown by DAVINCI_SCALE.
- 338 critic: at 2.3x ~2.0 halberdiers tall and ~3.5 men across vs TABS ~1.7/2.6 (within "about"); collar+lip read as one thick band in _idle.
- Pilot offset in linkedActorPresets scaled by hand (2.25, .64); metrics height DAVINCI_PEAK x scale; lineup lastApart 3.0 in scenarios.ts.
