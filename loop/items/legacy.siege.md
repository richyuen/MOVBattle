# legacy.siege
Status: open   Audited: 621 (AUDIT x2)   Done: -
## Verdicts
a PASS (621 judge)
b FAIL (0 since 621; list from AUDIT 621): 1. Musketeers in stage_legacy.siege_field.png: eight stand in one row at ground level between the two front pillars, not on the walls — TABS: four Musketeers on top of each side wall, overlooking the field (ref: reference/stages/legacy.siege.png; card Survey). 2. Brawlers in stage_legacy.siege_army.png: nine stand in one straight line across the plain in front of the castle — TABS: three Brawlers in each of the three openings between the walls and pillars (ref: card Survey; legacy.siege.png). 3. Jarls in stage_legacy.siege_army.png: one at the right end of the Brawler line and two at the left of the Fencer line — TABS: one Jarl behind each three-Brawler group (ref: card Survey). 4. Kings in stage_legacy.siege_army.png: both at the left end of the front line on open ground — TABS: two Kings on opposite sides of the raised back platform (ref: card Survey; legacy.siege.png). 5. Fencers in stage_legacy.siege_field.png: eight in a second straight line on the plain in front of the castle — TABS: four Fencers with each King on the back platform (ref: card Survey).
c PASS (621 judge)
## Ranked gaps
1. [S] legacy.siege.b Musketeers onto the wall tops — blocker 1: four per side wall at wall height (simulation.siege x 37.5, z +-7..22, y 15/18 is the done precedent) — ref: reference/stages/legacy.siege.png — ours: stage_legacy.siege_field.png
2. [S] legacy.siege.b Brawler trios in the three openings — blocker 2: trios at each opening (simulation.siege x 26, z -20/0/20) with a Jarl behind each (also blocker 3) — ref: card Survey — ours: stage_legacy.siege_army.png
3. [S] legacy.siege.b Kings and Fencers on the back platform — blocker 4: a King each side with four Fencers (simulation.siege Kings 59,+-19; Fencers 57,+-16..22, y14), also blocker 5 — ref: reference/stages/legacy.siege.png — ours: stage_legacy.siege_field.png
## Attempts (iter | gap | criterion | verdict)
## Rejected (last 4)
## Notes (max 3 lines)
- AUDIT2 corroborates all five; the thumb shows a meadow, not this castle: judge from the wiki png and Survey.
- simulation.siege (D) is the same map and Survey: copy its group placements, stage zones and crown seats (main.ts checkStage, stagePresentation.ts).
