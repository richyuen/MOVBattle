# dynasty.monkey_king
Status: open   Audited: 411, 420 (RE-AUDIT a, b, c), 422 (CONFIRM: failed a, b), 429 (CONFIRM: failed a)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (0 since 429; the CONFIRM 429 list) plateau (CONFIRM failed a twice: 422, 429)
 1. face in unit_dynasty.monkey_king_idle is a flat dark-brown rectangular plate that reads as a visor — TABS: a light tan/orange baboon mask with a protruding muzzle and a team-coloured nose strip (ref: reference/units/dynasty.monkey_king.red.png, .blue.png)
 2. a khaki/maroon panel covers the chest and back in unit_dynasty.monkey_king_idle and lineup_dynasty (right end) and reads as an armour plate — TABS: the robe is team-coloured with one thin orange diagonal band from the shoulder (ref: reference/units/dynasty.monkey_king.blue.png)
b PASS (427: staff 1.7x his height, long gold sleeve and short cap; CONFIRM 429)
c PASS (418; RE-AUDIT 420; CONFIRM 422, 429)
d PASS (cost 2000, hp 6.71x, dmg 0.73x, cd 0.41x; 429 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [R] a face + robe - blockers 1, 2: rebuild MONKEY_FACE as a light tan/orange baboon mask (protruding muzzle, team nose strip, the bead eyes in it) inside the MONKEY_HAIR ring, and MONKEY_ROBE's chest/back panel as plain team cloth with one thin orange diagonal band from the shoulder; spec from both CONFIRM lists (422: hair, crown; 429: face, panel) - ref: dynasty.monkey_king.blue.png, .red.png - ours: unit_dynasty.monkey_king_idle, lineup_dynasty (CONFIRM 429)
## Attempts (iter | gap | criterion | verdict)
416-418 | MONKEY_STAFF, MONKEY_TAIL, jump_charge leap, BO_SHOVE | a,b,c | approved (b, c PASS)
420-422 | MONKEY_CROWN, MONKEY_FACE (2dc865d6), MONKEY_SHORTS, MONKEY_ROBE | a | approved (a PASS 422, CONFIRM failed a, b)
424 | MONKEY_CROWN leaf feathers with a gold spine (87217f77) | a | approved (struck 1)
427 | MONKEY_RUYI staff rebuilt 1.7x, sleeve + cap ends, centred on the chest (13e19096) | b | approved (struck 1; b PASS)
428 | MONKEY_TRUNK trunk + yoke .7 wide, shoulders drawn in, team waist wrap (eea59cc5) | a | approved (struck 3)
429 | MONKEY_HAIR orange-blonde curl ring + crown hair (e6fad918) | a | approved (struck 2; a PASS; CONFIRM failed a: plateau)
## Rejected (last 4)
## Notes (max 3 lines)
- 429 defects: crown hair one flat box, curls tan more than orange, ring open over the brow (sweep 2.2). 428: waist wrap hidden under robe and staff.
- MONKEY_TRUNK runs first in his dress block (unitFactory), so robe/scarf/sleeve are cut on the slim trunk; MONKEY_HAIR after MONKEY_FACE. Tail frames him (rig 3.78 m).
- Rides _restMonkBo via "monkBoHolder"; staff MONKEY_RUYI.
