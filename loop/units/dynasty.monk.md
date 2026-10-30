# dynasty.monk
Status: open   Audited: 411   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a PASS (415)
b PASS (411)
c FAIL (1 since 411)
 2. knockback in unit_dynasty.monk_flight: the knight stays upright in place - TABS: force 250 sends the target staggering back (ref: card Weapons)
  (struck 1 at 412: the bo swung two-handed into the target)
d PASS (cost 250, hp 9.06x, dmg 0.30x, cd 0.60x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] c knockback - blocker 2: the bo hit applies force 250 so the target staggers back visibly in _flight (runtimeUnit knockback impulse) - ref: card Weapons - ours: unit_dynasty.monk_flight.png
## Attempts (iter | gap | criterion | verdict)
411 | MONK_STAFF bo + _restMonkBo level across the chest (0f878ea) | b | approved (struck 1; b PASS)
412 | TENGU_MASK: mask plate, nose, fanged grimace (2070597) | a | approved (none struck: brows hidden behind eyes/brim)
412 | MONK_SWING: bo cocked over the shoulder, swept across the man; blow held to the hit (3b45ede + 52ae020) | c | approved (struck 1)
413 | KASA_GOLD team kasa + gold rim/knob; idle swing .3 off the boulder (75c0cb4; evidence b9005cd + c00e8e5) | a | approved (struck 2; 1 by lineup)
414 | MONK_TROUSERS: wide trousers, gold-banded greaves (a6bbc47) | a | approved (struck 4)
415 | MONK_ARM_PLATES: team lamellar rows, gold rims, both arms (4db0bf1d) | a | approved (struck 3; a PASS)
## Rejected (last 4)
## Notes (max 3 lines)
- 411 audit: the bead necklace is present and reads.
- 412 critic (minor): at release his near arm reaches into the knight ahead of the shaft.
- 411 critic (minor): the bo tilts up at the off end and is a little shorter than his arm span; the side-on windup shows it end-on.
