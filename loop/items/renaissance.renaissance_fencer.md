# renaissance.renaissance_fencer
Status: open   Audited: 612 (AUDIT x2), 613 (CONFIRM: passed b; critic kept b2)   Done: -
## Verdicts
a PASS (613 judge)
b FAIL (1 since 612; list from AUDIT 612): 2. Musketeers as a tight 8-wide row 1.8 m apart in stage_renaissance.renaissance_fencer_army.png — TABS: 8 Musketeers spread singly across the whole plaza width, several metres apart, in a loose staggered line (ref: reference/stages/renaissance.renaissance_fencer.png) | s3. Stray blue balloon in _army (struck 612) s1. Fencers as a front rank in the open in _army (struck 613)
c PASS (613 judge)
## Ranked gaps
1. [S] b Musketeers across the whole width — blocker 2: re-lay the 8 Musketeers as staggered singles over z -20..24 (zone permitting), so _field shows them across the full square — ref: reference/stages/renaissance.renaissance_fencer.png — ours: stage_renaissance.renaissance_fencer_field.png
## Attempts (iter | gap | criterion | verdict)
612 | 1bf29290 balloon rig disposed with its unit (runtimeUnit.dispose) | b | APPROVE (struck 3; also farmer_1 b2, ancient_2 b5)
613 | 4fd62091+c5116a82 drawn two-storey corner loggia in team 1's back corner, Fencers inside (stage scenery fencerLoggia) | b | APPROVE (struck 1)
613 | 959a5f15 Musketeers singly, staggered, z -3.5..23.5 | b | APPROVE (no strike: not across the whole width)
## Rejected (last 4)
## Notes (max 3 lines)
- 613 critic: the loggia is whiter than the piazza's cream houses; the Survey's building is on the player's side, which the team-1 zone rules out.
- AUDIT2 named the same elements. The Survey puts the Fencers on the player's side; the c script needs them in the team-1 zone.
- Preserve the scripted army counts.
