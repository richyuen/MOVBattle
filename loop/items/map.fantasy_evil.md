# map.fantasy_evil
Status: open   Audited: 587 (AUDIT x2), 599 (CONFIRM: failed a,b)   Done: -
## Verdicts
a FAIL (0 since 599): 1. Ground surface in output/loop/iter-599/map_fantasy_evil_top.png — TABS: irregular broken stone platforms merge into chunky fractured rock; ours is dominated by a regular rectangular pavement grid across a flat circular courtyard (ref: reference/maps/wiki/fantasy_evil.png). 2. Right monumental statue in output/loop/iter-599/map_fantasy_evil_island.png — TABS: an enormous angular winged figure rises above the right cliffs; ours presents a narrow tapering spike beside a dark rock mass without the recognizable winged silhouette (ref: reference/maps/wiki/fantasy_evil.png). 3. Mushroom dressing in output/loop/iter-599/map_fantasy_evil_island.png — TABS: small vivid green mushroom clusters light the rocks; ours has conspicuous large dull magenta caps around the perimeter (ref: reference/maps/wiki/fantasy_evil.png).
b FAIL (0 since 599): 1. Interior platform network in output/loop/iter-599/map_fantasy_evil_top.png — TABS: substantial broken cliffs divide elevated islands and sunken routes, linked by broad stairs around the central shrine; ours has a mostly continuous paved plane divided by thin straight green channels around one rectangular raised platform (ref: reference/maps/wiki/fantasy_evil.png).
c PASS (599 judge)

## Ranked gaps
1. [S] b platform network — blocker 1: substantial elevated rock islands and sunken routes, broad stairs around the shrine — ref: reference/maps/wiki/fantasy_evil.png — ours: map_fantasy_evil_top.png
2. [S] a monumental winged statue — blocker 2: enormous angular winged figure above right cliffs — ref: reference/maps/wiki/fantasy_evil.png — ours: map_fantasy_evil_island.png
3. [S] a fractured ground — blocker 1: irregular broken stone platforms merging into chunky fractured rock — ref: reference/maps/wiki/fantasy_evil.png — ours: map_fantasy_evil_top.png

## Attempts (iter | gap | criterion | verdict)
599 | [S] leaning spire/chains f749b1d8 | a6 | APPROVE, struck a6 + collateral a5; b re-audit PASS; first CONFIRM failed a,b
597 | [S] backdrop crag heaped round the spire, ledge chains 89b4f29e (+4818fb5b glow-excluded) | a6 | APPROVE, no strike (rock-mass clause cleared) (attempt 1)
596 | [S] statue re-sited (18,15) f4eef72d (+990ecde8) | a5 | APPROVE, no strike (attempt 2); [P] rock mass lit da34040c REJECT
595 | [S] stairs da55aaca; green rim 27e30aa2; rock mass + chains 3b0cd8d4 | b2, a4, a6 | APPROVE, struck b2 (b PASS), a4, a6 slab clause
590-594 | [S] builder, void sky, basalt floor, plateau, crevices, rock ring, shrine, statue + spire | a1-a3, b1, b3, b4, a5 | APPROVE, struck all but a5

## Rejected (last 4)
596 | [P] a6 da34040c | rock mass under slab, unseen; reverted

## Notes (max 3 lines)
- STATUE (18,15), SPIRE (36,40); leaningSpire after backdropCrag. No dependent stage.
- Evidence 6864e50d raised island target to y8; full spire visible. Gap critic re-audited b PASS; CONFIRM replaced both lists above.
- First counted CONFIRM failure. Earlier596 early b PASS was unused.
