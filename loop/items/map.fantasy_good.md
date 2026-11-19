# map.fantasy_good
Status: open   Audited: 587 (AUDIT x2), 595 (CONFIRM: failed a,b), 601 (CONFIRM: failed a,b), 606 (CONFIRM: passed a, b)   Done: -
## Verdicts
a FAIL (plateau; 0 since601; list from CONFIRM 601; CONFIRM 606 passed a on this list): s1. Shrine gate silhouettes in map_fantasy_good_island.png (struck 606) 2. Shrine waterfalls in map_fantasy_good_top.png — TABS: conspicuous cyan channels descending beside the gates into the deep wells, rather than only small flat blue strips beside otherwise dry portals (ref: reference/maps/wiki/fantasy_good.png).
b PASS (606: struck 1, 2; CONFIRM 606)
c PASS (607 judge)
## Ranked gaps
1. [R] a2 one continuous stream per gate (critic 607 r3): a cyan sheet down the end buttress's FIELD-side face into the deck channel, the channel bright, then the stepped ledges (b8072e41, kept); vines (13,-20), (-24,9) moved out to the obelisk wells; rocks mid-grey; foam only at lips (no vertical stripes). A new mechanism, not a colour re-nudge (607 r2 was rejected as one) — ref: reference/maps/wiki/fantasy_good.png lower right — ours: map_fantasy_good_top.png
## Attempts (iter | gap | criterion | verdict)
607 r3 | [R] stepped hex-column cascades from gate channels b8072e41 | a2 | APPROVE, no strike
607 r2 | [R] gate stone out of glow, deeper cyan, foam streaks 5fcb8b7d | a2 | REJECT (flat panels; colour re-nudge), reverted ab3f294e
607 | [R] opaque gate water on merlons, end curtains, 8 m far-wall falls 0911dd25 | a2 | APPROVE, no strike
606 | [R] wells/diagonal gates 57397d50; gatehouses 6d627f50; sheets 9b0909fd; curtains 628c2755 (rejected) | b1,b2,a1,a2 | struck b1,b2,a1; CONFIRM a,b PASS
591-601 | builder/deck/pits/parapets/towers/sky/islets/arcade/corruption | a,b | old lists struck; CONFIRM 595, 601 failed a,b
## Rejected (last 4)
607 r2 | [R] a2 5fcb8b7d | flat wall panels, streaks unseen; water colour counted as a re-nudge of 9b0909fd
606 r3 | [R] a2 628c2755 | gate curtains read as translucent pale glass from the top camera; crest hidden by merlons
## Notes (max 3 lines)
- No stage. b confirmed (606). a: a critic PASS on a2 makes it D (CONFIRM 606 passed a). Dry 5: one more round with no strike parks a.
- Gate water reads pale because the glow layer blooms the white gate stone and marble over it (pixels ~(143,173,203) vs (0,126,196) in the wells); excluding the tower stone from glow fixed it (607 r2, reverted with that gap).
- CONFIRM notes (not blockers): gold arch faces thin trims, wells rectangular with plain plaza flanks, water paler than wiki cyan.
