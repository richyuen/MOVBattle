# evil.exiled_sentinel
Status: open   Audited: 489 (AUDIT x2)   Done: -
## Verdicts
a FAIL (2 since 489, 2 struck)
 3. body in unit_evil.exiled_sentinel_idle: plain team-blue plate armour all over — TABS: a dark uniform with team skin at the face and hands only (ref: evil.exiled_sentinel.blue.png)
 4. leggings in unit_evil.exiled_sentinel_idle: smooth armoured legs — TABS: dark leggings covered in rows of team-coloured diamond spikes (ref: evil.exiled_sentinel.red.png)
 5. shoulders in unit_evil.exiled_sentinel_idle: rounded pauldrons — TABS: a row of tall black spikes standing up over both shoulders, behind the shields (ref: evil.exiled_sentinel.red.png)
b PASS (490 matching right pavise)
c FAIL (0 since 489)
 1. shield-to-axe swap in unit_evil.exiled_sentinel_release/_flight: he bashes with the blue slab still held and no axes appear — TABS: at close range both shields turn into two bloodied horseman's axes that do the striking (card)
 2. missing: projectile blocking by the pavises — TABS: the shields catch incoming arrows, which stick in their faces (ref: evil.exiled_sentinel.jpg)
d PASS (491 stats)
## Ranked gaps
1. [S] evil.exiled_sentinel.a shoulder spikes — blocker 5: evilDress sentinelShoulderSpikes, 4-5 tall black 4-sided spikes per shoulder rising behind the pavise tops, replacing the pauldrons — ref: evil.exiled_sentinel.red.png — ours: unit_evil.exiled_sentinel_idle.png
2. [S] evil.exiled_sentinel.c shield-to-axe swap — blocker 1: at melee range, pavises hidden and two bloodied horseman's axes swung — ref: card Characteristics — ours: unit_evil.exiled_sentinel_release.png
3. [S] evil.exiled_sentinel.a spiked leggings — blocker 4: dark leg shells with rows of team diamond spikes — ref: evil.exiled_sentinel.red.png — ours: unit_evil.exiled_sentinel_idle.png
## Attempts (iter | gap | criterion | verdict)
491 | ginger mane, evilDress sentinelMane (d2525821) | a | approved (struck 2)
490 | right pavise "paviseShieldRight", sword hidden in the fist (cc597223) | b | approved (struck 1; b PASS)
489 | spiked cone hat, evilDress sentinelConeHat (ab3c3690) | a | approved (struck 1)
489 | upright coffin pavise, propBuilder PAVISE torso mount (a755e889) | b | approved (struck 2)
## Rejected (last 4)
## Notes (max 3 lines)
- 489 DEFECTS: cone lean/brim reads witch-like; pavise .42 of height (TABS ~half again taller); torso-mounted, tips in windup.
- 490: the sword stays in the right fist with isVisible false (for the c axe swap); fists do not grip the boards; the blow is an empty raised fist.
- Void Cultist summons evil.exiled_sentinel today (card says it should not).
