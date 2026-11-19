# renaissance.renaissance_fencer
Status: open   Audited: 612 (AUDIT x2), 613 (CONFIRM: passed b; critic kept b2)   Done: -
## Verdicts
a PASS (614 judge)
b FAIL (2 since 612; list from AUDIT 612): 2. Musketeers as a tight 8-wide row 1.8 m apart in stage_renaissance.renaissance_fencer_army.png — TABS: 8 Musketeers spread singly across the whole plaza width, several metres apart, in a loose staggered line (ref: reference/stages/renaissance.renaissance_fencer.png) | s3. Stray blue balloon in _army (struck 612) s1. Fencers as a front rank in the open in _army (struck 613)
c PASS (614 judge)
## Ranked gaps
1. [S] b Musketeers across the whole square — blocker 2: append team-1 zones over z -24..-5 in web/src/map/tabs/renaissance.ts placementZones (ancient_1 pattern; shared with boom b4), then re-lay the 8 Musketeers staggered over z -20..27 — ref: reference/stages/renaissance.renaissance_fencer.png — ours: stage_renaissance.renaissance_fencer_field.png
## Attempts (iter | gap | criterion | verdict)
612 | 1bf29290 balloon rig disposed with its unit (runtimeUnit.dispose) | b | APPROVE (struck 3; also farmer_1 b2, ancient_2 b5)
613 | 4fd62091+c5116a82 drawn two-storey corner loggia in team 1's back corner, Fencers inside (stage scenery fencerLoggia) | b | APPROVE (struck 1)
613 | 959a5f15 Musketeers singly, staggered, z -3.5..23.5 | b | APPROVE (no strike: not across the whole width)
614 | f135fc9e Musketeers staggered over z -4.5..27.6 | b | APPROVE (no strike: zone stops at z -5)
## Rejected (last 4)
## Notes (max 3 lines)
- b2 has 2 approved [S] in a row without a strike: a third makes it plateau.
- 613 critic: the loggia is whiter than the piazza's cream houses; the Survey's building is on the player's side, which the team-1 zone rules out.
- AUDIT2 named the same elements. The Survey puts the Fencers on the player's side; the c script needs them in the team-1 zone.
