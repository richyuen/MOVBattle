# pirate.boom_and_the_units_go_down
Status: open   Audited: 613 (AUDIT x2), 614 (CONFIRM: passed b; critic kept b4)   Done: -
## Verdicts
a PASS (614 judge)
b FAIL (1 since 613; list from AUDIT 613): 4. the army is shifted off centre to one side of the square (z 2..22) in stage_pirate.boom_and_the_units_go_down_field.png — TABS: the army spans the square's width in front of the palazzi (ref: reference/stages/pirate.boom_and_the_units_go_down.thumb.png) | s1. Fencers and Halberds one shared line in _army (struck 613) s3. units 1.8 m apart in _army (struck 613) s2. Musketeers one straight rank in _army (struck 614)
c PASS (614 judge)
## Ranked gaps
1. [S] b army spans the square — blocker 4: append a team-1 zone over z -24..-5 in web/src/map/tabs/renaissance.ts placementZones (ancient_1 street-zone pattern; shared with renaissance_fencer b2), then re-lay the three layers and the V over z -20..28; re-check every renaissance stage for misplacement — ref: reference/stages/pirate.boom_and_the_units_go_down.thumb.png — ours: stage_pirate.boom_and_the_units_go_down_field.png
## Attempts (iter | gap | criterion | verdict)
613 | c635404b three loose layers z 0.5..23.3, Fencers front, Halberds, Musketeers back | b | APPROVE (struck 1,3)
614 | 090d6a67 layers widened over z -4..28 | b | APPROVE (no strike: zone stops at z -5)
614 | 546a125c Musketeer V behind the Halberds | b | APPROVE (struck 2)
## Rejected (last 4)
## Notes (max 3 lines)
- The renaissance team-1 zone is z -5..29; the square runs z -24.5..29.5.
- AUDIT2 named the same elements.
- Preserve the scripted army counts.
