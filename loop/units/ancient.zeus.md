# ancient.zeus
Status: open   Audited: 378   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (3 since 378)
 1. beard in unit_ancient.zeus_idle (also lineup_ancient): a sparse fringe of thin pale-straw needle strands — TABS: huge shaggy dirty-blond beard, a dense mass of jagged bolt-like hairs to the chest (ref: .red.png)
 3. toga in _idle: drape a band half the trunk wide, bare belly above the belt; emblem thin and dark; a dark slab off his left shoulder — TABS: white fills below the diagonal to the belt, bright gold bolt (ref: .red.png)
b PASS (384)
c PASS (386)
d PASS (cost 2000, hp 14.04x, dmg 0.55x, cd 0.76x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a beard — blocker 1: dense shaggy dirty-blond mass of 30+ broad jagged zig-zag hair slabs from cheeks and chin to mid-chest (ancientDress ZEUS_BEARD) — ref: .red.png — ours: unit_ancient.zeus_idle.png
2. [S] a toga fill — blocker 3: white drape filling below the diagonal to the belt, bright gold bolt, no dark shoulder slab (dressZeusToga) — ref: .red.png — ours: unit_ancient.zeus_idle.png
## Attempts (iter | gap | criterion | verdict)
379 | blond jaw mass + bolt strands, bolt locks, temple leaves (dressZeus) [S] (f708157) | a | approved (struck a.2)
383-384 | thrown bolt (spawnZeusBolt); bolt leaves the fist (ZEUS_REARM) [S] (c0d24d5, 1eb7af4) | c | approved (struck c.1, c.2)
384 | small zig-zag sparks in each fist (BOLT_SPARK) [S] (d6d2a01) | b | approved (b PASS)
385 | toga: bare trunk, white diagonal drape, gold bolt, triple gold belt, no sash (ZEUS_TOGA) [S] (3d11834) | a | approved
386 | bare team legs in strap sandals + ankle laces (ZEUS_SANDAL zeusLegs) [S] (fd8eb0f) | a | approved (struck a.4)
386 | lightning chain 3 hops, arcs + burst stay .6 s (ZEUS_CHAIN) [S] (ff36ed0, evidence 7d839dd) | c | approved (c PASS)
## Rejected (last 4)
## Notes (max 3 lines)
- 379 fallout: beard wants fewer thick tufts (~.35) on a bigger jaw mass, warmer tan. 386 minors: sandals chunky dark cuffs (TABS thin straps); chain arc short.
- Dark shoulder slab: likely the "cape" special (propBuilder buildSpecial). Capture: Zeus spars with 3 clustered squires (evidence 386).
- Toga ancientDress dressZeusToga + zeusLegs (unitFactory isZeus block). spawnZeusBolt(from, to, chain) in visualEffects; _zeusChain in simulationSystem.
