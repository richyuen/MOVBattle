# ancient.zeus
Status: open   Audited: 378   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (1 since 378)
 1. beard in unit_ancient.zeus_idle (also lineup_ancient): a sparse fringe of thin pale-straw needle strands — TABS: huge shaggy dirty-blond beard, a dense mass of jagged bolt-like hairs to the chest (ref: .red.png)
 3. toga in _idle: grey box vest both shoulders, brown strap — TABS: bright white toga from the left shoulder only, gold lightning emblem, triple gold belt, knee skirt (ref: .red.png)
 4. legs in _idle: dark-blue trousers, grey boots — TABS: bare team legs, brown strap sandals (ref: .red.png)
b FAIL (0 since 378)
 1. thunderbolts in _idle: two giant straight glassy spikes crossing the torso — TABS: small jagged zig-zag sparks crackling from each fist at the sides (ref: .red.png)
 2. left hand empty in _windup — TABS: a bolt in each hand (card Off Hand)
c FAIL (1 since 378)
 2. held bolt stays in the raised hand through _release/_flight (a vertical bolt from the fist into the sky) — TABS: it leaves the hand as the thrown bolt (ref: .png)
 3. impact in unit_ancient.zeus_struck: rings gone, but no burst or chain arcs show; the man just falls — TABS: small burst, chain arcs to nearby units (ref: card)
d PASS (cost 2000, hp 14.04x, dmg 0.55x, cd 0.76x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] c held bolt — blocker 2: hide the raised-hand bolt from the throw until the cooldown re-arms, so _flight shows an empty fist (proceduralAnimation / propBuilder) — ref: .png — ours: unit_ancient.zeus_flight.png
2. [S] b small jagged sparks from each fist, no giant glassy spikes — blocker 1 — ref: .red.png — ours: unit_ancient.zeus_idle.png
3. [S] a toga from the left shoulder, gold bolt emblem, triple gold belt, knee skirt — blocker 3 — ref: .red.png — ours: unit_ancient.zeus_idle.png
## Attempts (iter | gap | criterion | verdict)
379 | blond jaw mass + bolt strands, bolt locks, temple leaves (dressZeus) [S] (f708157) | a | approved (struck a.2)
383 | thrown bolt: one zig-zag hand to chest, spark burst, no sheets/rings (spawnZeusBolt) [S] (c0d24d5) | c | approved (struck c.1)
## Rejected (last 4)
## Notes (max 3 lines)
- 379 fallout: beard wants fewer thick tufts (~.35) on a bigger jaw mass, warmer tan.
- Chain arcs need 2-3 men clustered near the struck one (evidence, critic 378).
- 383 minor: bolt a pale band, ~3 kinks (TABS white core, many kinks). spawnZeusBolt from rightHand.
