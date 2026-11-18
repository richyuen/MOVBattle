# map.pirate
Status: open   Audited: 576 (AUDIT x2)   Done: -
## Verdicts
a PASS (586: struck 1, 5; CONFIRM pending)
b FAIL (587: struck 5): 3. beach outline in map_pirate_top — TABS: an hourglass sand spit narrowing toward the back mountain, not a rectangle (ref: reference/maps/wiki/pirate.png)
c PASS (587 judge)

## Ranked gaps
1. [S] b spit outline — blocker 3 (2 attempts: starvation 592): taper the hourglass stations at both x ends to a rounded point (half width 7 -> 2 m over the last 10 m), back end under the bell mountain (critic 587 NEXT) — ref: wiki/pirate.png — ours: map_pirate_top.png
2. [P] a ripple tone — fallout of 05e50f52 (eligible to 589): ripple emissive (0.2, 0.13, 0.05) -> (0.06, 0.04, 0.01) — ours: map_pirate_ground.png

## Attempts (iter | gap | criterion | verdict)
587 | [S] standable decks 22ba62eb (+ evidence fc94485f map_pirate_deck) | b5 | APPROVE, struck b5
587 | [S] hourglass bared (base oval, blades, waterfall hidden) 4ace43d4 | b3 | APPROVE, no strike (attempts 2 on b3)
576-586 | [S] galleons (rebuilt 586), lagoon, sand island, bell mountain, beach, gangplanks, shore, tropic sky, golden sand; [P] stern 577 rejected | a, b | all [S] approved, struck a1-a6, b1, b2, b4

## Rejected (last 4)

## Notes (max 3 lines)
- Stages: pirate.x_marks_the_spot, a_rival_captain, spooky.plunder (x29..41.4, |z|<=9.9). Mountain (34,38), collider r 10.5. Decks y 3.6 (deckHeight), rails split at plank mouths.
- 587 early CONFIRM unused (b still FAIL) but would fail a and b: hulls caramel and boxy (TABS dark brown-black, curved, gilded transom), no sand drum under the beach, sky steel-teal (TABS pale), ships rotated 90 deg (TABS: each behind one army's half), spit outline. Report: output/loop/iter-587/confirm.md.
- Critic 587 fallout: batteries are loose barrels, TABS carriages at rail ports.
