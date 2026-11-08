# evil.exiled_sentinel
Status: open   Audited: 489 (AUDIT x2)   Done: -
## Verdicts
a FAIL (3 since 489, 3 struck)
 3. body in unit_evil.exiled_sentinel_idle: plain team-blue plate armour all over — TABS: a dark uniform with team skin at the face and hands only (ref: evil.exiled_sentinel.blue.png)
 4. leggings in unit_evil.exiled_sentinel_idle: smooth armoured legs — TABS: dark leggings covered in rows of team-coloured diamond spikes (ref: evil.exiled_sentinel.red.png)
b PASS (490 matching right pavise)
c FAIL (1 since 489, 1 struck)
 2. missing: projectile blocking by the pavises — TABS: the shields catch incoming arrows, which stick in their faces (ref: evil.exiled_sentinel.jpg)
d PASS (493 stats)
## Ranked gaps
1. [S] evil.exiled_sentinel.a spiked leggings — blocker 4: dark leg shells with rows of team diamond spikes — ref: evil.exiled_sentinel.red.png — ours: unit_evil.exiled_sentinel_idle.png
2. [S] evil.exiled_sentinel.a team plate — blocker 3: a near-black uniform (torso, arm and leg shells) with team only at face and hands — ref: evil.exiled_sentinel.blue.png — ours: unit_evil.exiled_sentinel_idle.png
3. [S] evil.exiled_sentinel.c no arrow catching — blocker 2: pavises stop frontal arrows, which stay stuck in the board — ref: evil.exiled_sentinel.jpg — ours: unit_evil.exiled_sentinel_struck.png
## Attempts (iter | gap | criterion | verdict)
493 | pavises swap for two bloodied axes while he fights, propBuilder SENTINEL_AXE + RuntimeUnit _tendSentinelAxes (7387478e, d837acc3) | c | approved (struck 1)
492 | tall black shoulder spikes, evilDress sentinelShoulderSpikes (9a91a5a5) | a | approved (struck 5)
491 | ginger mane, evilDress sentinelMane (d2525821) | a | approved (struck 2)
490 | right pavise "paviseShieldRight", sword hidden in the fist (cc597223) | b | approved (struck 1; b PASS)
489 | spiked cone hat (ab3c3690); upright coffin pavise (a755e889) | a, b | approved
## Rejected (last 4)
## Notes (max 3 lines)
- 493 DEFECTS: axe hafts read as long poles gripped mid-shaft, one head shows (TABS short one-handed axes, heads above the fist).
- 490: the sword stays in the right fist with isVisible false; the axes ride the fists switched off until he attacks (hold 2.5 s).
- Void Cultist summons evil.exiled_sentinel today (card says it should not).
