# map.viking_sandbox
Status: open   Audited: 562 (AUDIT x2), 568 (CONFIRM: passed b; failed a), 569 (CONFIRM: passed b; failed a), 572 (CONFIRM: passed b; failed a)   Done: -
## Verdicts
a FAIL (0 since 572; plateau, CONFIRM failed 3x): 1. great carved gate in the arena wall, not readable in map_viking_sandbox_top.png — TABS: a tall carved ice gate with spiral rune panels, hung with chains, on the left wall (ref: reference/maps/wiki/viking_sandbox.png) 2. tall free-standing ice obelisks and spikes above the rim in map_viking_sandbox_island.png — TABS: the wall is stepped terraces of columnar ice cliff with a flat snowy top, plus only a few large crystal clusters on one side (ref: reference/maps/winter_viking_sandbox.png) 3. floor snow/ice balance in map_viking_sandbox_top.png: the floor is mostly pale blue ice with small white snow islands — TABS: broad white snow sheets cover much of the floor, with large cracked blue-ice patches showing through, most of it under the walls and in the centre (ref: reference/maps/wiki/viking_sandbox.png)
b PASS (568: CONFIRM; 572 CONFIRM)
c PASS (572 judge)

## Ranked gaps
1. [R] a — gate, skyline, floor balance — blockers 1-3: rebuild from the 571 and 572 CONFIRM lists: a big carved rune gate with chains readable from the top shot, rimPeaks and jutting columns cut so the terraces run level with a few crystal clusters on one side, snow sheets covering about half the floor — ref: reference/maps/wiki/viking_sandbox.png, reference/maps/winter_viking_sandbox.png — ours: map_viking_sandbox_top.png, map_viking_sandbox_island.png

## Attempts (iter | gap | criterion | verdict)
563-568 | [S] own builder, ice-cliff wall, junk removed, snow floor, cyan sky, gate, glacier underside, circular arena | a, b | 8 APPROVE struck a1-a5, b1-b4
569 | [S] fractured shelves, cracked sheet, rim peaks (eb3c33ae+16dc5699, b5799593, 2be8528a) | a | 3 APPROVE struck a1-a3
571 | [R] plated ice with snow tongues; broken ledges between jutting columns (c47c5fef) | a | APPROVE, struck a1, a2; added a3
572 | [S] thick ledge caps on ice bodies resting on the tier below (17023fc0) | a | APPROVE, struck a3 (a PASS); CONFIRM failed a

## Rejected (last 4)

## Notes (max 3 lines)
- Pirate Arrows and Arrow uses x 29..36, |z| <= 10. Placement zones are clipped to |x| <= 44.
- Critic 571: snow islands read as flat decals with no lip. Critic 572: cap faces lavender-grey.
