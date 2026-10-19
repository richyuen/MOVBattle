# ancient.zeus
Status: open   Audited: 378   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (1 since 378)
 1. beard in unit_ancient.zeus_idle (also lineup_ancient): a sparse fringe of thin pale-straw needle strands — TABS: huge shaggy dirty-blond beard, a dense mass of jagged bolt-like hairs to the chest (ref: .red.png)
 3. toga in _idle: grey box vest both shoulders, brown strap — TABS: bright white toga from the left shoulder only, gold lightning emblem, triple gold belt, knee skirt (ref: .red.png)
 4. legs in _idle: dark-blue trousers, grey boots — TABS: bare team legs, brown strap sandals (ref: .red.png)
b PASS (384)
c FAIL (2 since 378)
 3. impact in unit_ancient.zeus_struck: the man just falls, no burst or chain arcs — TABS: small burst, chain arcs to nearby units (ref: card Characteristics)
d PASS (cost 2000, hp 14.04x, dmg 0.55x, cd 0.76x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a toga from the left shoulder, gold bolt emblem, triple gold belt, knee skirt — blocker 3 — ref: .red.png — ours: unit_ancient.zeus_idle.png
2. [S] c impact — blocker 3: small white-cyan burst at the hit plus 2-3 short zig-zag arcs to units within 1.5 m, logged in abilityLog (simulationSystem) — ref: card — ours: unit_ancient.zeus_struck.png
## Attempts (iter | gap | criterion | verdict)
379 | blond jaw mass + bolt strands, bolt locks, temple leaves (dressZeus) [S] (f708157) | a | approved (struck a.2)
383 | thrown bolt: one zig-zag hand to chest, spark burst, no sheets/rings (spawnZeusBolt) [S] (c0d24d5) | c | approved (struck c.1)
384 | held bolt leaves the fist at the throw, back .6 of the cooldown on (ZEUS_REARM) [S] (1eb7af4) | c | approved (struck c.2)
384 | small zig-zag sparks in each fist, off hand too (BOLT_SPARK) [S] (d6d2a01) | b | approved (b PASS)
## Rejected (last 4)
## Notes (max 3 lines)
- 379 fallout: beard wants fewer thick tufts (~.35) on a bigger jaw mass, warmer tan. 384 minor: raised spark ~2x TABS (BOLT_SPARK.long .14 -> .1).
- Chain arcs need 2-3 men clustered near the struck one (evidence, critic 378).
- spawnZeusBolt from rightHand; held bolt hidden by animator letGoOfThrow(prop, rearmIn), re-enabled in update.
