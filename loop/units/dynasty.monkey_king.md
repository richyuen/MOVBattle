# dynasty.monkey_king
Status: open   Audited: 411, 420 (RE-AUDIT a, b, c), 422 (CONFIRM: failed a, b)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (1 since 422; the CONFIRM list, the 420 list cleared at 422)
 2. blonde hair in unit_dynasty.monkey_king_idle - TABS: an orange-blonde ring of hair curling over the crown and down both cheeks, framing the dark face (ref: card Appearance "blonde hair and a dark colored face"; reference/units/dynasty.monkey_king.red.png)
 3. trunk in unit_dynasty.monkey_king_idle - TABS: a slim trunk under the half robe, shoulders about a quarter of the figure's height across and narrower than the puffy shorts (ref: reference/units/dynasty.monkey_king.red.png; reference/factions/dynasty.jpg)
  (struck 1 at 424)
b PASS (427: staff 1.7x his height, long gold sleeve and short cap)
c PASS (418; RE-AUDIT 420; CONFIRM 422)
d PASS (cost 2000, hp 6.71x, dmg 0.73x, cd 0.41x; 427 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a slim trunk - blocker 3: narrow the trunk under the half robe to about a quarter of his height, narrower than the shorts - ref: dynasty.monkey_king.red.png - ours: unit_dynasty.monkey_king_idle (427 rank 9)
2. [S] a blond hair ring - blocker 2: MONKEY_FACE tufts grown into a curling orange-blond faceted ring over the crown and down both cheeks, framing the dark face plate - ref: dynasty.monkey_king.red.png - ours: unit_dynasty.monkey_king_idle (427 rank 10)
## Attempts (iter | gap | criterion | verdict)
416-418 | MONKEY_STAFF, MONKEY_TAIL, jump_charge leap, BO_SHOVE | a,b,c | approved (b, c PASS)
420 | MONKEY_CROWN circlet + feather antennae (6c4aff46) | a | approved (struck 1)
421 | MONKEY_FACE dark plate, tan muzzle, blond tufts (2dc865d6) | a | approved (struck 2)
422 | MONKEY_SHORTS shorts, gold cuffs, pointy shoes (8db34616, b9adb0a3) | a | approved (struck 3)
422 | MONKEY_ROBE half robe, gold strips, scarf (6ff201bb) | a | approved (struck 4; a PASS, CONFIRM failed a, b)
424 | MONKEY_CROWN leaf feathers with a gold spine (87217f77) | a | approved (struck 1)
427 | MONKEY_RUYI staff rebuilt 1.7x, sleeve + cap ends, centred on the chest (13e19096) | b | approved (struck 1; b PASS)
## Rejected (last 4)
## Notes (max 3 lines)
- 427 defect: the far (left) end overhangs his fist by less than an arm. 424: feathers a head tall (render ~1.3 heads).
- Trunk = vis bulk 1.18 + robe out 1.14: a.3 may be the body (unitVisuals iconic_monkey_king). Tail frames him (rig 3.77 m).
- Rides _restMonkBo via "monkBoHolder"; staff MONKEY_RUYI (replaced MONKEY_STAFF at 427). b passed by one critic only: a CONFIRM decides it when a passes.
