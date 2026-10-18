# renaissance.balloon_archer
Status: open   Audited: 327   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (1 since 327)
 2. body in unit_renaissance.balloon_archer_idle is a plain team tunic — TABS: team doublet with cream vertical stripes, puffed slashed sleeves, brown belt, knee breeches, tan stockings (ref: renaissance.balloon_archer.blue.png)
b PASS (330)
c PASS (333)
d PASS (cost 200, hp 1.09x vs 1.00x, dmg 0.39x, cd 1.50x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a striped doublet — blocker 2: cream vertical stripes, puffed slashed sleeves, brown belt, knee breeches, tan stockings — ref: renaissance.balloon_archer.blue.png — ours: unit_renaissance.balloon_archer_idle.png
## Attempts (iter | gap | criterion | verdict)
327 | black brim hat, no head balloon [S] (d747d43) | a | approved
329 | light-grey longbow [S] (ea71dc1 + c2aff34) | b | approved
330 | longbow length [P] (d3cb713) | b | approved
332 | balloon float [S] (c99a50c + 08c4efd) | c | approved
333 | team ball on the arrow [S] (4e0e02c) | c | approved
## Rejected (last 4)
## Notes (max 3 lines)
- Float: BALLOON_ARROWS -> spawn option balloons -> RuntimeUnit.floatOnBalloons (BALLOON_FLOAT), logged "float"; the arrow's BALLOON_BALL is hidden on the hit.
- Critic nits: two of three balloons read in _ability_after (332); hat brim short (327); arrow out of frame in _flight (333).
- The longbow is the shared "bow" with weaponVariant longbow (LONGBOW); _idle sees the archer from behind.
