# dynasty.monk
Status: open   Audited: 411   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (2 since 411)
 3. arm armour in unit_dynasty.monk_idle: bare blue arms - TABS: team-coloured lamellar plates banded down both arms (ref: dynasty.monk.jpg)
 4. trousers in unit_dynasty.monk_idle: slim legs - TABS: wide team-coloured robe trousers over gold-banded greaves (ref: dynasty.monk.red.png)
  (struck 2 at 413: team kasa, gold rim, boulder clear; struck 1 at 413 by lineup: the tengu mask reads)
b PASS (411)
c FAIL (1 since 411)
 2. knockback in unit_dynasty.monk_flight: the knight stays upright in place - TABS: force 250 sends the target staggering back (ref: card Weapons)
  (struck 1 at 412: the bo swung two-handed into the target)
d PASS (cost 250, hp 9.06x, dmg 0.30x, cd 0.60x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a robe trousers and greaves - blocker 4: wide team trouser shells to the knee over gold-banded greave shells (limbShell, as NINJA_TROUSERS) - ref: dynasty.monk.red.png - ours: unit_dynasty.monk_idle.png
2. [S] c knockback - blocker 2: the bo hit applies force 250 so the target staggers back visibly in _flight - ref: card Weapons - ours: unit_dynasty.monk_flight.png
3. [S] a arm plates - blocker 3: team lamellar plate shells banded down both arms - ref: dynasty.monk.jpg - ours: unit_dynasty.monk_idle.png
## Attempts (iter | gap | criterion | verdict)
411 | MONK_STAFF bo + _restMonkBo level across the chest (0f878ea) | b | approved (struck 1; b PASS)
412 | TENGU_MASK: mask plate, nose, fanged grimace (2070597) | a | approved (none struck: brows hidden behind eyes/brim)
412 | MONK_SWING: bo cocked over the shoulder, swept across the man; blow held to the hit (3b45ede + 52ae020) | c | approved (struck 1)
413 | KASA_GOLD team kasa + gold rim/knob; idle swing .3 off the boulder (75c0cb4; evidence b9005cd + c00e8e5) | a | approved (struck 2; 1 by lineup)
## Rejected (last 4)
## Notes (max 3 lines)
- 411 audit: the bead necklace is present and reads.
- 412 critic (minor): at release his near arm reaches into the knight ahead of the shaft.
- 411 critic (minor): the bo tilts up at the off end and is a little shorter than his arm span; the side-on windup shows it end-on.
