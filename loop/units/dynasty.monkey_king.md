# dynasty.monkey_king
Status: open   Audited: 411, 420 (RE-AUDIT a, b, c), 422 (CONFIRM: failed a, b), 429 (CONFIRM: failed a), 430 (CONFIRM: failed a)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (0 since 430; the CONFIRM 430 list) plateau (CONFIRM failed a three times: 422, 429, 430)
 1. In unit_dynasty.monkey_king_idle the torso is a bulky box wider than the shoulders, rounded into puffy shorts. TABS: a slender wobbler build, a narrow robed chest over a slim waist wrap (ref: reference/units/dynasty.monkey_king.red.png).
 2. The overall scale is about 1.45x his neighbours' height and about 2x their width in lineup_dynasty (right-hand unit beside the dragon). TABS: Size 1.15x, only a little taller than the dynasty soldiers (ref: card Infobox; reference/factions/dynasty.jpg, MK on the bridge at right).
 3. In unit_dynasty.monkey_king_idle the puffy shorts reach almost to the shoes, so there are no shins. TABS: knee-length puffy shorts above bare team shins with orange ankle bands over the pointy shoes (ref: dynasty.monkey_king.blue.png).
b PASS (427: staff 1.7x his height, long gold sleeve and short cap; CONFIRM 429, 430)
c PASS (418; RE-AUDIT 420; CONFIRM 422, 429, 430)
d PASS (cost 2000, hp 6.71x, dmg 0.73x, cd 0.41x; 430 stats; size 1.72 vs wiki 1.15)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [R] a build - blockers 1-3: rebuild his body proportions as a slim wobbler at size ~1.15 (unitVisuals iconic monkey_king scale 1.72, bulk 1.18 -> spec off the faction shot), a narrow robed chest and slim waist wrap (MONKEY_TRUNK/MONKEY_ROBE out/deep), MONKEY_SHORTS ending at the knee over bare shins with orange ankle bands; keep the 430 face, hair, crown, staff, tail; spec from all three CONFIRM lists - ref: dynasty.monkey_king.blue.png, reference/factions/dynasty.jpg - ours: unit_dynasty.monkey_king_idle, lineup_dynasty (CONFIRM 430)
## Attempts (iter | gap | criterion | verdict)
416-418 | MONKEY_STAFF, MONKEY_TAIL, jump_charge leap, BO_SHOVE | a,b,c | approved (b, c PASS)
420-424 | MONKEY_CROWN, MONKEY_FACE, MONKEY_SHORTS, MONKEY_ROBE, crown leaf feathers | a | approved (a PASS 422, CONFIRM failed a, b)
427 | MONKEY_RUYI staff rebuilt 1.7x, sleeve + cap ends (13e19096) | b | approved (b PASS)
428-429 | MONKEY_TRUNK slim trunk + waist wrap; MONKEY_HAIR curl ring (eea59cc5, e6fad918) | a | approved (a PASS 429; CONFIRM failed a)
430 | [R] MONKEY_FACE peach mask, cheeks, brow, muzzle, team strip; MONKEY_ROBE team all round, one orange band, no maroon trunk/skirt/cape (80235174) | a | approved (struck 1, 2; a PASS; CONFIRM failed a: plateau)
## Rejected (last 4)
## Notes (max 3 lines)
- 430 critic: the peach reads a little browner than the render's light orange. 429: crown hair one flat box, curls tan more than orange.
- MONKEY_TRUNK runs first in his dress block (unitFactory), so robe/scarf/sleeve are cut on the slim trunk; MONKEY_HAIR after MONKEY_FACE; no tunic skirt (unitFactory skirt chain). Tail frames him (rig 3.74 m).
- Rides _restMonkBo via "monkBoHolder"; staff MONKEY_RUYI.
