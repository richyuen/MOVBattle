# dynasty.monk
Status: open   Audited: 411   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (1 since 411)
 1. face in unit_dynasty.monk_idle: a plain head with bead eyes - TABS: a tengu mask (a scowling face with brows and a nose) under the hat (ref: dynasty.monk.red.png, card Appearance)
 2. hat in unit_dynasty.monk_idle: a mustard straw cone with a dark navy lump behind it - TABS: a team-coloured conical hat with a gold rim and nothing behind it (ref: dynasty.monk.red.png)
 3. arm armour in unit_dynasty.monk_idle: bare blue arms - TABS: team-coloured lamellar plates banded down both arms (ref: dynasty.monk.jpg)
 4. trousers in unit_dynasty.monk_idle: slim legs - TABS: wide team-coloured robe trousers over gold-banded greaves (ref: dynasty.monk.red.png)
b PASS (411)
c FAIL (1 since 411)
 2. knockback in unit_dynasty.monk_flight: the knight stays upright in place - TABS: force 250 sends the target staggering back (ref: card Weapons)
  (struck 1 at 412: the bo swung two-handed into the target)
d PASS (cost 250, hp 9.06x, dmg 0.30x, cd 0.60x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] c knockback - blocker 2: the force-250 backward impulse plus a stagger/topple on the bo's hit (simulationSystem melee hit) - ref: card Weapons - ours: unit_dynasty.monk_flight.png
2. [S] a team hat - blocker 2: the conical hat tinted to the team with a gold rim, the navy lump behind it removed - ref: dynasty.monk.red.png - ours: unit_dynasty.monk_idle.png
3. [P] a tengu brows, fallout of 412.2: TENGU_MASK brows raised clear of the eye tops and out past the eye beads, thicker; the plate up round the eyes - shows in unit_dynasty.monk_idle
## Attempts (iter | gap | criterion | verdict)
411 | MONK_STAFF bo + _restMonkBo level across the chest (0f878ea) | b | approved (struck 1; b PASS)
412 | TENGU_MASK: mask plate, nose, fanged grimace (2070597) | a | approved (none struck: brows hidden behind eyes/brim)
412 | MONK_SWING: bo cocked over the shoulder, swept across the man; blow held to the hit (3b45ede + 52ae020) | c | approved (struck 1)
## Rejected (last 4)
## Notes (max 3 lines)
- 411 audit: the bead necklace is present and reads.
- 412 critic (minor): at release his near arm reaches into the knight ahead of the shaft.
- 411 critic (minor): the bo tilts up at the off end and is a little shorter than his arm span; the side-on windup shows it end-on.
