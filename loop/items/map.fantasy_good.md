# map.fantasy_good
Status: open   Audited: 587 (AUDIT x2), 595 (CONFIRM: failed a,b), 601 (CONFIRM: failed a,b)   Done: -
## Verdicts
a FAIL (plateau; 0 since601): 1. Shrine gate silhouettes in map_fantasy_good_island.png — TABS: massive multi-bay white-and-gold gates with substantial stepped buttresses and broad gold arch faces, rather than thin single-opening rectangular portals (ref: reference/maps/wiki/fantasy_good.png and reference/maps/heaven_good.png). 2. Shrine waterfalls in map_fantasy_good_top.png — TABS: conspicuous cyan channels descending beside the gates into the deep wells, rather than only small flat blue strips beside otherwise dry portals (ref: reference/maps/wiki/fantasy_good.png).
b FAIL (plateau; 0 since601): 1. Well footprint in map_fantasy_good_top.png — TABS: four large quadrant wells leaving a defined cross of walkways, rather than six small holes surrounded by a broad continuous plaza (ref: reference/maps/wiki/fantasy_good.png). 2. Gate placement in map_fantasy_good_island.png — TABS: gates occupy opposing ends of the field across the well-and-walkway layout, rather than both portals standing together along the same rear edge (ref: reference/maps/wiki/fantasy_good.png and reference/maps/heaven_good.png).
c PASS (601 judge)
## Ranked gaps
1. [R] a shrine/waterfall mechanism — blockers1,2: multi-bay buttressed gates and large cyan falls into wells; spec from CONFIRM595+601 — ref: reference/maps/wiki/fantasy_good.png, reference/maps/heaven_good.png — ours: map_fantasy_good_island.png
2. [R] b wells/walkways/gates — blockers1,2: four broad quadrant wells, cross routes, opposing gates; spec from CONFIRM595+601 — ref: reference/maps/wiki/fantasy_good.png — ours: map_fantasy_good_top.png
## Attempts (iter | gap | criterion | verdict)
601 | [S] arcade9e419281 | a1(old list) | APPROVE,struck1; a PASS -> second CONFIRM faileda,b
600 | arcade4834759a/gates79aae0c6/[P]spilla44979d1 | a | APPROVE,strucka2; a1 pillar clause cleared
599 | corruptionab0886e6/e8517b58; jog368eeb98; towers9a80277f | a5,b2,a2 | APPROVE,strucka5,b2
597 | pits6bbd3b7d/falls10bafbf2/ledgecfe386c3 | a4,a3,b2 | APPROVE,strucka4,a3
596 | pits65479838/deck788ad169 | b1,a6 | APPROVE,struckboth
591-595 | builder/deck/pits/parapets/towers/sky/steps/islets | a,b | APPROVE; CONFIRM595 faileda,b
## Rejected (last 4)
## Notes (max 3 lines)
- No stage. Both a/b plateau after second counted CONFIRM failure601; older Pirate b R has priority.
- CONFIRM well-count wording retained verbatim; current PITS/ledger has five, not six. Reconcile in R spec.
- Keep exposed front arcade, continuous front spill and connected ledge during rebuild.
