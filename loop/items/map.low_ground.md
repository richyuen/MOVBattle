# map.low_ground
Status: done   Audited: 587 (AUDIT x2), 591 (CONFIRM: passed b; failed a), 592 (CONFIRM: passed a, b)   Done: 592
## Verdicts
a PASS (592: struck 1; CONFIRM 592)
b PASS (588: struck 1, 2, 3; CONFIRM 591)
c PASS (592 judge)

## Ranked gaps

## Attempts (iter | gap | criterion | verdict)
592 | [S] bank facets share one lighting normal (0,.96,-.28) 52bed45f | a1 | APPROVE, struck a1 (a PASS); CONFIRM passed a, b -> D
591 | [S] kit sky untoned eadae3e9 (via map.hill) | a5 | APPROVE, struck a5
591 | [S] unlit bank sheets c8082cb0 (+51f659a2, f37f2aeb) | a (CONFIRM 589 bank) | dropped, reverted (rendered lighter than the flats)
588-589 | [S] grid slab with trough ae6ad36b; pale sky 98ebf959; [P] kit haze 8d4fd3bc | a, b | APPROVE, struck b1-b3, a1-a4

## Rejected (last 4)

## Notes (max 3 lines)
- Builder tabs/low_ground.ts: slab x +-60 |z|<=22, floor |x|<=10, banks to 7 m at |x| 20; shadeBanks bends bank normals. Stage: simulation.pit.
- Critic 592: bank a slightly cooler grey than TABS' warm beige (minor).
