# map.hill
Status: done   Audited: 587 (AUDIT x2), 591 (CONFIRM: passed a, b)   Done: 591
## Verdicts
a PASS (591: struck 4; CONFIRM 591)
b PASS (589: struck 1; CONFIRM 591)
c PASS (591 judge)

## Ranked gaps

## Attempts (iter | gap | criterion | verdict)
591 | [S] kit sky + clouds untoned (simKit untoned/paleSky/cloudBanks) eadae3e9 | a4 | APPROVE, struck a4 (also bridge/corridor/low_ground/castle/high_ground a5)
590 | [S] cloud banks z 200-230, y -25..35 (simKit cloudBanks) e8ee5a82 | a3 | APPROVE, struck a3
589 | [E] ground shot re-aimed 00cf09ce + cc5ef659 | a1 | re-audit struck a1
589 | [S] bounded block, void round, zones (hill.ts) 90341a4e | b1 | APPROVE, struck b1 (b PASS)
589 | [S] cloud banks z 450-540 de48f83f | a3 | REJECT, reverted 5093c46c
588 | [S] crest ec25b08c; grid ridge + pale sky 1eb72e07 (+cfd5d291) | b2, a1 | APPROVE, struck b2, b3, a2

## Rejected (last 4)
589 | [S] a3 de48f83f | attempts 1 | clouds never rendered (out of the island shot's frame, y 40-80 at z 450-540)

## Notes (max 3 lines)
- Builder tabs/hill.ts: sheet x -60..76 |z|<=28, 400 m skirt, void x -90..100 z +-60. Stage: simulation.hill (x 20..25.9).
- CONFIRM 591: ramp gentler than the wiki's (not noticed at distance).
