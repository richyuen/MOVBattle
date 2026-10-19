# ancient.zeus
Status: open   Audited: 378   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (2 since 378)
 1. beard in unit_ancient.zeus_idle (also lineup_ancient): a sparse fringe of thin pale-straw needle strands — TABS: huge shaggy dirty-blond beard, a dense mass of jagged bolt-like hairs to the chest (ref: .red.png)
 3. toga in _idle: drape a band half the trunk wide, bare belly above the belt; emblem thin and dark; a dark slab off his left shoulder — TABS: white fills below the diagonal to the belt, bright gold bolt (ref: .red.png)
 4. legs in _idle: dark-blue trousers, grey boots — TABS: bare team legs, brown strap sandals (ref: .red.png)
b PASS (384)
c FAIL (2 since 378)
 3. impact in unit_ancient.zeus_struck: the man just falls, no burst or chain arcs — TABS: small burst, chain arcs to nearby units (ref: card Characteristics)
d PASS (cost 2000, hp 14.04x, dmg 0.55x, cd 0.76x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a legs — blocker 4: bare team legs plus brown strap sandals (reuse ancientDress strapSandals) — ref: .red.png — ours: unit_ancient.zeus_idle.png
2. [S] a toga — blocker 3: drape's lower edge to the belt on the front, bright emblem, no dark shoulder slab (dressZeusToga) — ref: .red.png — ours: unit_ancient.zeus_idle.png
3. [S] c impact — blocker 3: small burst plus 2-3 zig-zag arcs to units within 1.5 m, abilityLog (simulationSystem) — ref: card — ours: unit_ancient.zeus_struck.png
## Attempts (iter | gap | criterion | verdict)
379 | blond jaw mass + bolt strands, bolt locks, temple leaves (dressZeus) [S] (f708157) | a | approved (struck a.2)
383-384 | thrown bolt (spawnZeusBolt); bolt leaves the fist (ZEUS_REARM) [S] (c0d24d5, 1eb7af4) | c | approved (struck c.1, c.2)
384 | small zig-zag sparks in each fist (BOLT_SPARK) [S] (d6d2a01) | b | approved (b PASS)
385 | toga: bare trunk, white diagonal drape, gold bolt, triple gold belt, no sash (ZEUS_TOGA) [S] (3d11834) | a | approved
## Rejected (last 4)
## Notes (max 3 lines)
- 379 fallout: beard wants fewer thick tufts (~.35) on a bigger jaw mass, warmer tan. 384 minor: raised spark ~2x TABS (BOLT_SPARK.long .14 -> .1).
- Chain arcs need 2-3 men clustered near the struck one (critic 378). Dark shoulder slab: likely the "cape" special (propBuilder buildSpecial).
- Toga ancientDress dressZeusToga (called from unitFactory's isZeus block; bodyMaterial stays white for pelvis/skirt). spawnZeusBolt from rightHand.
