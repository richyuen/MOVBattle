# evil.exiled_sentinel
Status: open   Audited: 489 (AUDIT x2), 495 (CONFIRM: passed a, c; failed b)   Done: -
## Verdicts
a PASS (495 dark uniform; CONFIRM 495)
b FAIL (0 since 495)
 1. pavise length in unit_evil.exiled_sentinel_idle: each shield runs only from the belly to the knee, about 3/8 of the unit's height — TABS: each Norman pavise is about half the unit's height and covers him from shoulder to mid-shin (ref: reference/units/evil.exiled_sentinel.blue.png)
 2. pavise carry height in unit_evil.exiled_sentinel_idle: the two shields hang low, side by side in front of the hips, with their tops at the belly, so the whole slab torso and the shoulder spikes show above them — TABS: the shield tops sit at the shoulder line, flanking the neck, so the pair reads as a full-front wall with only the head, hat and shoulder spikes above it (ref: reference/units/evil.exiled_sentinel.red.png; reference/units/evil.exiled_sentinel.jpg)
c PASS (494 pavises catch frontal arrows; CONFIRM 495)
d PASS (495 stats)
## Ranked gaps
1. [S] evil.exiled_sentinel.b pavise length — blocker 1: coffin board about half his height, shoulder to mid-shin (propBuilder PAVISE) — ref: evil.exiled_sentinel.blue.png — ours: unit_evil.exiled_sentinel_idle.png
2. [S] evil.exiled_sentinel.b carry height — blocker 2: torso mount raised so the board tops sit at the shoulder line, flanking the neck — ref: evil.exiled_sentinel.red.png — ours: unit_evil.exiled_sentinel_idle.png
## Attempts (iter | gap | criterion | verdict)
495 | near-black uniform over trunk and arms, spiked bracers, collar, evilDress sentinelUniform (5d269f55) | a | approved (struck 3; a PASS)
494 | near-black leggings in rows of team diamond spikes, evilDress sentinelLeggings (1c20c66c) | a | approved (struck 4)
494 | pavises catch frontal arrows, projectileSystem catchOnBoards + simulationSystem SENTINEL_CATCH (fb3bd010) | c | approved (struck 2; c PASS)
493 | pavises swap for two bloodied axes while he fights (7387478e, d837acc3) | c | approved (struck 1)
489-492 | cone hat, mane, shoulder spikes (a); coffin pavises, right pavise (b) | a, b | approved
## Rejected (last 4)
## Notes (max 3 lines)
- 495 DEFECTS: bracer spikes small. b was PASS since 490; CONFIRM 495 failed it on board size and carry height (LEDGER PB:PAVISE torso mount).
- Capture (evidence 494): he spars 8 m off against three archers; ability pair pavise_block framed as the idle. Axes hold 2.5 s after a blow.
