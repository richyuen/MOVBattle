# map.pirate
Status: open   Audited: 576 (AUDIT x2), 587 (CONFIRM: passed c; failed a, b)   Done: -
## Verdicts
a FAIL (0 since 587, CONFIRM list): 1. ship hull colour in map_pirate_deck.png (light caramel/orange-tan planking) — TABS: dark brown-black hull with gold trim bands (ref: reference/maps/wiki/pirate.png) 2. ship hull shape in map_pirate_deck.png (box-sided hull with a flat square stern block) — TABS: curved galleon hull with a tall gilded stern castle and windowed transom (ref: reference/maps/wiki/pirate.png, right ship) 3. island underside in map_pirate_island.png (thin pale-cyan rim on a flat water disc, no slab below) — TABS: thick sand-coloured drum side under the water ring (ref: reference/maps/pirate_beach.png) 4. sky colour in map_pirate_island.png (saturated steel-teal sky) — TABS: pale powder/near-white cyan sky (ref: reference/maps/pirate_beach.png)
b FAIL (0 since 587, CONFIRM list): 1. ship placement in map_pirate_top.png (both ships sit at the two ends of the centre line, top and bottom of the frame, flanking both halves; map_pirate_battle.png shows no ship behind the enemy) — TABS: the two ships face each other across the sand, each moored behind one army's half with its gangplanks onto that army's ground (ref: reference/maps/wiki/pirate.png, red army at left ship's planks, blue at right ship's) 2. field outline in map_pirate_top.png (wide near-rectangular sand slab) — TABS: a sand strip running from the foreground beach up to the mountain, narrowed by lagoon inlets beside each ship (ref: reference/maps/wiki/pirate.png)
c PASS (587 judge)

## Ranked gaps
1. [S] b ship placement — blocker 1: galleons behind each army's half, planks onto each zone; move decks, rails, mountain clearance; check stage armies — ref: wiki/pirate.png — ours: map_pirate_top.png
2. [S] b spit outline — blocker 2: hourglass ends tapered to a point under the bell mountain — ref: wiki/pirate.png — ours: map_pirate_top.png
3. [S] a underside — blocker 3: thick sand drum side under the hourglass beach — ref: reference/maps/pirate_beach.png — ours: map_pirate_island.png
4. [S] a hulls — blockers 1, 2: dark brown-black curved hull, gilded stern transom — ref: wiki/pirate.png — ours: map_pirate_deck.png

## Attempts (iter | gap | criterion | verdict)
587 | [S] standable decks 22ba62eb (+ evidence fc94485f map_pirate_deck) | b5 | APPROVE, struck b5
587 | [S] hourglass bared (base oval, blades, waterfall hidden) 4ace43d4 | b3 | APPROVE, no strike (attempts 2 on b3); CONFIRM failed a, b -> CONFIRM lists
576-586 | [S] galleons (rebuilt 586), lagoon, sand island, bell mountain, beach, gangplanks, shore, tropic sky, golden sand; [P] stern 577 rejected | a, b | all [S] approved, struck a1-a6, b1, b2, b4

## Rejected (last 4)

## Notes (max 3 lines)
- Stages: pirate.x_marks_the_spot, a_rival_captain, spooky.plunder (x29..41.4, |z|<=9.9). Mountain (34,38), collider r 10.5. Decks y 3.6 (deckHeight), rails split at plank mouths.
- First CONFIRM failure 587 (a and b). Critic 587 fallout: batteries are loose barrels, TABS carriages at rail ports.
