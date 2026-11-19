# map.fantasy_good
Status: open   Audited: 587 (AUDIT x2), 595 (CONFIRM: failed a,b), 601 (CONFIRM: failed a,b), 606 (CONFIRM: passed a, b)   Done: -
## Verdicts
a FAIL (plateau; 0 since601; list from CONFIRM 601; CONFIRM 606 passed a on this list): s1. Shrine gate silhouettes in map_fantasy_good_island.png (struck 606) 2. Shrine waterfalls in map_fantasy_good_top.png — TABS: conspicuous cyan channels descending beside the gates into the deep wells, rather than only small flat blue strips beside otherwise dry portals (ref: reference/maps/wiki/fantasy_good.png).
b PASS (606: struck 1, 2; CONFIRM 606)
c PASS (606 judge)
## Ranked gaps
1. [R] a2 gate water — opaque saturated cyan (emissive ~(.05,.55,.9), no alpha) with foam edges; a crest strip ABOVE the merlon line; a fall down the gate well's FAR wall (the one facing the top camera: z 31 for back-left is unreachable past the gate, so the well's +z wall via a channel, or the x wall nearest the frame edge) to a cyan floor pool, both gates — ref: reference/maps/wiki/fantasy_good.png — ours: map_fantasy_good_top.png
## Attempts (iter | gap | criterion | verdict)
606 r3 | [R] crest channel, gate-end curtains into wells 628c2755 | a2 | REJECT (pale see-through panes in _top), reverted 639fec40
606 r2 | [R] saturated sheets, fog off, unbroken falls 9b0909fd | a2 | APPROVE, no strike
606 | [R] multi-bay gatehouses, wide cascades 6d627f50 | a1,a2 | APPROVE, struck a1
606 | [R] quadrant wells |x| 6..27 |z| 6..31, gates at (-40,30),(40,-30) 57397d50 | b1,b2 | APPROVE, struck b1,b2; CONFIRM a,b PASS
591-601 | builder/deck/pits/parapets/towers/sky/islets/arcade/corruption | a,b | old lists struck; CONFIRM 595, 601 failed a,b
## Rejected (last 4)
606 r3 | [R] a2 628c2755 | gate curtains read as translucent pale glass from the top camera; crest hidden by merlons
## Notes (max 3 lines)
- No stage. b confirmed (606). a: when the critic passes a2, a is already CONFIRMed (606) -> D without another CONFIRM.
- The top camera (alpha -pi/2) sees -z faces and x faces near the frame edge only; 606 r2 cascade (far wall z -6 of the front-right well, fed along the walkway) read best.
- CONFIRM notes (not blockers): gold arch faces are thin trims, wells rectangular with plain plaza flanks, water paler than wiki cyan.
