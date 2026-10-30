# dynasty.monkey_king
Status: open   Audited: 411, 420 (RE-AUDIT a, b, c), 422 (CONFIRM: failed a, b)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (0 since 422; the CONFIRM list, the 420 list cleared at 422)
 1. crown feathers in unit_dynasty.monkey_king_idle - TABS: two broad leaf-shaped team-coloured feathers with a gold spine, each as tall as the head and a quarter as wide, leaning outward in a V from the crown either side of the tail (ref: reference/units/dynasty.monkey_king.blue.png)
 2. blonde hair in unit_dynasty.monkey_king_idle - TABS: an orange-blonde ring of hair curling over the crown and down both cheeks, framing the dark face (ref: card Appearance "blonde hair and a dark colored face"; reference/units/dynasty.monkey_king.red.png)
 3. trunk in unit_dynasty.monkey_king_idle - TABS: a slim trunk under the half robe, shoulders about a quarter of the figure's height across and narrower than the puffy shorts (ref: reference/units/dynasty.monkey_king.red.png; reference/factions/dynasty.jpg)
b FAIL (0 since 422; the CONFIRM list)
 1. staff length in unit_dynasty.monkey_king_idle - TABS: the staff runs about 1.7x the figure's height, each end reaching a full arm's length past the hand, wider than the whole arm span by half again (ref: reference/units/dynasty.monkey_king.red.png; reference/units/dynasty.monkey_king.jpg)
c PASS (418; RE-AUDIT 420; CONFIRM 422)
d PASS (cost 2000, hp 6.71x, dmg 0.73x, cd 0.41x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a crown feathers - blocker 1: MONKEY_CROWN feathers as broad leaf blades (featherWide ~.25 of the head, a gold spine ridge), not .2 e.x rods - ref: dynasty.monkey_king.blue.png - ours: unit_dynasty.monkey_king_idle
2. [S] b staff length - blocker 1: MONKEY_STAFF.long to ~1.7 of his height - ref: dynasty.monkey_king.red.png - ours: unit_dynasty.monkey_king_idle
3. [S] a blond hair ring - blocker 2: MONKEY_FACE tufts grown into a curling orange-blond ring over the crown and down both cheeks - ref: dynasty.monkey_king.red.png - ours: unit_dynasty.monkey_king_idle
## Attempts (iter | gap | criterion | verdict)
416-418 | MONKEY_STAFF, MONKEY_TAIL, jump_charge leap, BO_SHOVE | a,b,c | approved (b, c PASS)
420 | MONKEY_CROWN circlet + feather antennae (6c4aff46) | a | approved (struck 1)
421 | MONKEY_FACE dark plate, tan muzzle, blond tufts (2dc865d6) | a | approved (struck 2)
422 | MONKEY_SHORTS shorts, gold cuffs, pointy shoes (8db34616, b9adb0a3) | a | approved (struck 3)
422 | MONKEY_ROBE half robe, gold strips, scarf (6ff201bb) | a | approved (struck 4; a PASS, CONFIRM failed a, b)
## Rejected (last 4)
## Notes (max 3 lines)
- 422 defects: puff barrel-wide; toe a spike (TABS a broad curled toe); right trunk half tan (TABS skin + one orange strap); scarf thin (TABS a broad V collar).
- Trunk = vis bulk 1.18 + robe out 1.14: CONFIRM a.3 may be the body (unitVisuals iconic_monkey_king). Tail frames him (rig 3.80 m).
- Starts at 8 m (jump_charge), rides _restMonkBo via "monkBoHolder"; staff MONKEY_STAFF long 1.35.
