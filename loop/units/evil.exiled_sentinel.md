# evil.exiled_sentinel
Status: open   Audited: 489 (AUDIT x2)   Done: -
## Verdicts
a FAIL (4 since 489, 4 struck)
 3. body in unit_evil.exiled_sentinel_idle: plain team-blue plate armour all over — TABS: a dark uniform with team skin at the face and hands only (ref: evil.exiled_sentinel.blue.png)
b PASS (490 matching right pavise)
c PASS (494 pavises catch frontal arrows, stuck in the boards)
d PASS (494 stats)
## Ranked gaps
1. [S] evil.exiled_sentinel.a dark uniform — blocker 3: near-black cloth over the torso box, yoke and upper/lower arms, team skin only at face and hands (evilDress sentinelUniform) — ref: evil.exiled_sentinel.blue.png — ours: unit_evil.exiled_sentinel_idle.png
## Attempts (iter | gap | criterion | verdict)
494 | near-black leggings in rows of team diamond spikes, evilDress sentinelLeggings (1c20c66c) | a | approved (struck 4)
494 | pavises catch frontal arrows, projectileSystem catchOnBoards + simulationSystem SENTINEL_CATCH (fb3bd010) | c | approved (struck 2; c PASS)
493 | pavises swap for two bloodied axes while he fights, propBuilder SENTINEL_AXE + RuntimeUnit _tendSentinelAxes (7387478e, d837acc3) | c | approved (struck 1)
492 | tall black shoulder spikes, evilDress sentinelShoulderSpikes (9a91a5a5) | a | approved (struck 5)
491 | ginger mane, evilDress sentinelMane (d2525821) | a | approved (struck 2)
490 | right pavise "paviseShieldRight", sword hidden in the fist (cc597223) | b | approved (struck 1; b PASS)
489 | spiked cone hat (ab3c3690); upright coffin pavise (a755e889) | a, b | approved
## Rejected (last 4)
## Notes (max 3 lines)
- 494 DEFECTS: leg diamonds denser and chunkier than TABS; only one arrow caught in the pair. 493: axe hafts read as long poles gripped mid-shaft.
- Capture (evidence 494): he spars 8 m off against three archers; ability pair pavise_block framed as the idle. Axes hold 2.5 s after a blow, boards (and their arrows) off meanwhile.
- The Void Cultist no longer summons him (494).
