# dynasty.monkey_king
Status: done   Audited: 411, 420 (RE-AUDIT a, b, c), 422 (CONFIRM: failed a, b), 429 (CONFIRM: failed a), 430 (CONFIRM: failed a), 433 (CONFIRM: passed)   Done: 433
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a PASS (433: [R] leg cut struck 3; shorts to an orange knee band, team shin, orange anklet on a low pointy shoe; CONFIRM 433)
b PASS (427: staff 1.7x his height, long gold sleeve and short cap; CONFIRM 429, 430, 433)
c PASS (418; RE-AUDIT 420; CONFIRM 422, 429, 430, 433: leap, clones, staff blow)
d PASS (cost 2000, hp 6.71x, dmg 0.73x, cd 0.41x; 433 stats; size 1.25 vs wiki 1.15)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
## Attempts (iter | gap | criterion | verdict)
416-418 | MONKEY_STAFF, MONKEY_TAIL, jump_charge leap, BO_SHOVE | a,b,c | approved (b, c PASS)
420-424 | MONKEY_CROWN, MONKEY_FACE, MONKEY_SHORTS, MONKEY_ROBE, crown leaf feathers | a | approved (a PASS 422, CONFIRM failed a, b)
427 | MONKEY_RUYI staff rebuilt 1.7x, sleeve + cap ends (13e19096) | b | approved (b PASS)
428-429 | MONKEY_TRUNK slim trunk + waist wrap; MONKEY_HAIR curl ring (eea59cc5, e6fad918) | a | approved (a PASS 429; CONFIRM failed a)
430 | [R] MONKEY_FACE peach mask, team robe, one orange band (80235174) | a | approved (struck 1, 2; CONFIRM failed a: plateau)
432 | [R] MONKEY_BUILD scale 1.25 bulk .85, shorts to .72 of the thigh, orange bands, dark wrap (82d77ccb) | a | approved (struck 1, 2)
433 | [R] MONKEY_SHORTS cut off the knee joint, team shin + boot, band proud, anklet on the shoe (d21e71e8, 890391e8) | a | approved (struck 3; a PASS; CONFIRM passed, D)
## Rejected (last 4)
## Notes (max 3 lines)
- 433 critic: shin between band and anklet ~.12 of his height in the crouch (TABS .17). CONFIRM 433: shorts a little less puffy, off hand floats over the staff.
- MONKEY_TRUNK runs first in his dress block (unitFactory); MONKEY_SHORTS recolours the shin + foot meshes to team cloth (the body shade read as boots).
- Rides _restMonkBo via "monkBoHolder"; staff MONKEY_RUYI. Tail frames him (rig 2.72 m).
