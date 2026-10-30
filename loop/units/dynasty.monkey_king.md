# dynasty.monkey_king
Status: open   Audited: 411, 420 (RE-AUDIT a, b, c), 422 (CONFIRM: failed a, b), 429 (CONFIRM: failed a), 430 (CONFIRM: failed a)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (0 since 430; the CONFIRM 430 list; [R] 432 approved, struck 1, 2) plateau (CONFIRM failed a three times: 422, 429, 430)
 3. In unit_dynasty.monkey_king_idle the puffy shorts reach almost to the shoes, so there are no shins. TABS: knee-length puffy shorts above bare team shins with orange ankle bands over the pointy shoes (ref: dynasty.monkey_king.blue.png).
  (struck 1, 2 at 432)
b PASS (427: staff 1.7x his height, long gold sleeve and short cap; CONFIRM 429, 430)
c PASS (418; RE-AUDIT 420; CONFIRM 422, 429, 430; 432 critic: staff, clones, leap intact)
d PASS (cost 2000, hp 6.71x, dmg 0.73x, cd 0.41x; 432 stats; size 1.25 vs wiki 1.15)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [R] a leg cut - blocker 3: rebuild the MONKEY_SHORTS leg cut so the shorts end at the knee joint on the thigh (not .72 of a thigh mesh that runs past the knee), a plain team shin, the orange ankle band and a low pointy shoe, so the shin shows in the idle crouch - ref: dynasty.monkey_king.blue.png - ours: unit_dynasty.monkey_king_idle (critic 432)
## Attempts (iter | gap | criterion | verdict)
416-418 | MONKEY_STAFF, MONKEY_TAIL, jump_charge leap, BO_SHOVE | a,b,c | approved (b, c PASS)
420-424 | MONKEY_CROWN, MONKEY_FACE, MONKEY_SHORTS, MONKEY_ROBE, crown leaf feathers | a | approved (a PASS 422, CONFIRM failed a, b)
427 | MONKEY_RUYI staff rebuilt 1.7x, sleeve + cap ends (13e19096) | b | approved (b PASS)
428-429 | MONKEY_TRUNK slim trunk + waist wrap; MONKEY_HAIR curl ring (eea59cc5, e6fad918) | a | approved (a PASS 429; CONFIRM failed a)
430 | [R] MONKEY_FACE peach mask, team robe, one orange band (80235174) | a | approved (struck 1, 2; CONFIRM failed a: plateau)
432 | [R] MONKEY_BUILD scale 1.25 bulk .85, shorts to .72 of the thigh, orange bands, dark wrap (82d77ccb) | a | approved (struck 1, 2)
## Rejected (last 4)
## Notes (max 3 lines)
- 432 critic: robe runs long shoulder to hip so the shorts read squat; shoeTall .45 and the idle crouch hide the shin. Thigh mesh runs past the knee joint.
- MONKEY_TRUNK runs first in his dress block (unitFactory), so robe/scarf/sleeve are cut on the slim trunk; MONKEY_HAIR after MONKEY_FACE. Tail frames him (rig 2.72 m).
- Rides _restMonkBo via "monkBoHolder"; staff MONKEY_RUYI.
