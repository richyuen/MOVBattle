# simulation.wall
Status: open   Audited: 617 (AUDIT x2), 618 (AUDIT x2)   Done: -
## Verdicts
a PASS (618 judge)
b FAIL (0 since 618; list from AUDIT 618): 1. the ten Berserkers stand behind the ground infantry in stage_simulation.wall_field.png — TABS: five stand on each wall top beside the corridor (ref: reference/stages/simulation.wall.png; card Survey). | s2. front shield-and-spear phalanx visible in the corridor in stage_simulation.wall_field.png (struck 618) | s3. separate ten-Sarissa reserve behind the phalanx in stage_simulation.wall_army.png (struck 618)
c PASS (618 judge)
## Ranked gaps
1. [S] b wall-top Berserkers — blocker 1: seat five per wall crown with stage-specific height and valid runtime departures — ref: reference/stages/simulation.wall.png — ours: stage_simulation.wall_field.png
## Attempts (iter | gap | criterion | verdict)
618 | 0bea9c00+87255cd9 corridor phalanx and field evidence | b2 | APPROVE (struck 2)
618 | defa4af0 sheltered reserve | b3 | APPROVE (struck 3)
## Rejected (last 4)
## Notes (max 3 lines)
- 1547b2af re-aimed army; 87255cd9 exposed slot floor in field. Two fresh AUDITs agree on the single remaining blocker.
- Stage-only enemy slot zone keeps wall colliders and hazards active; sandbox placement unchanged.
