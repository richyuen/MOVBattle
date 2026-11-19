# map.pirate
Status: done   Audited: 576 (AUDIT x2), 592 (CONFIRM: failed a,b), 599 (CONFIRM: failed a,b), 602 (CONFIRM: passed a; passed b, round 2)   Done: 602
## Verdicts
a PASS (602: struck 1; CONFIRM 602)
b PASS (602: struck 1 [R], 2 [S]; CONFIRM 602 r2)
c PASS (602 judge)
## Ranked gaps
(none)
## Attempts (iter | gap | criterion | verdict)
602 | [R] z-strip galleons 92afd9c8 (+evidence a499d822) | b1 | APPROVE, struck b1; critic added b2 (base palms on the turned strip)
602 | [S] rising stern castle 264c9d94/36a587e7 | a1 | APPROVE, struck a1; CONFIRM a PASS
602 | [S] open sand c3b103ee (+evidence 8a51d844 ground/battle pose) | b2 | APPROVE, struck b2; CONFIRM b PASS -> D
601 | [R] layout e0ec78a8 | b1 | REJECT, reverted d62511b6
576-601 | hull/galleons/shore/deck/stern | a,b | old lists struck; CONFIRM592/599 failed a,b
## Rejected (last 4)
601 | [R] b1 e0ec78a8 | longer hulls leave broad empty shore; R clears no blocker; reverted
594 | [S] a2 29222f58 | transom faced +-x, invisible; reverted
## Notes (max 3 lines)
- Done 602 (solo, 2 rounds). Ships: local frame baked by SHIP_S 1.5 at x +-29 keel along z; strip stations along z; zones per team: strip half then own deck.
- Stage armies on +x deck (x 19..32); capture army target y 8.2 matches deck 8.4. CONFIRM notes for later: mirror-symmetric ships, cylinder sails, strip straight.
