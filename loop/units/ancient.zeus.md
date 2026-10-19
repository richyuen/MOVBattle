# ancient.zeus
Status: open   Audited: 378   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (4 since 378)
 3. toga in _idle: drape a band half the trunk wide, bare belly above the belt; emblem thin and dark; a dark slab off his left shoulder — TABS: white fills below the diagonal to the belt, bright gold bolt (ref: .red.png)
b PASS (384)
c PASS (386)
d PASS (cost 2000, hp 14.04x, dmg 0.55x, cd 0.76x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a toga fill — blocker 3: white drape filling below the diagonal to the belt, bright gold bolt, no dark shoulder slab (dressZeusToga) — ref: .red.png — ours: unit_ancient.zeus_idle.png
## Attempts (iter | gap | criterion | verdict)
379 | blond jaw mass + bolt strands, bolt locks, temple leaves (dressZeus) [S] (f708157) | a | approved (struck a.2)
383-384 | thrown bolt; bolt leaves the fist (ZEUS_REARM); fist sparks (BOLT_SPARK) [S] | b,c | approved
385 | toga: bare trunk, white diagonal drape, gold bolt, triple gold belt (ZEUS_TOGA) [S] (3d11834) | a | approved
386 | bare team legs in strap sandals + ankle laces (ZEUS_SANDAL zeusLegs) [S] (fd8eb0f) | a | approved (struck a.4)
386 | lightning chain 3 hops, arcs + burst stay .6 s (ZEUS_CHAIN) [S] (ff36ed0) | c | approved (c PASS)
387 | beard: jaw + bib masses under 6 rows of 7 flat zig-zag slabs (ZEUS_BEARD) [S] (de591d4) | a | approved (struck a.1)
## Rejected (last 4)
## Notes (max 3 lines)
- 387 minor: beard a little greyer/paler than the ref's warm tan, a touch long. 386 minors: sandals chunky dark cuffs; chain arc short.
- Dark shoulder slab: likely the "cape" special (propBuilder buildSpecial). Capture: Zeus spars with 3 clustered squires.
- Toga ancientDress dressZeusToga + zeusLegs (unitFactory isZeus block). spawnZeusBolt in visualEffects; _zeusChain in simulationSystem.
