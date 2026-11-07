# evil.exiled_sentinel
Status: open   Audited: 489 (AUDIT x2)   Done: -
## Verdicts
a FAIL (1 since 489, 1 struck)
 2. hair in unit_evil.exiled_sentinel_idle: none — TABS: a bushy ginger mane framing the face under the cone (ref: evil.exiled_sentinel.blue.png; card "ginger hair")
 3. body in unit_evil.exiled_sentinel_idle: plain team-blue plate armour all over — TABS: a dark uniform with team skin at the face and hands only (ref: evil.exiled_sentinel.blue.png)
 4. leggings in unit_evil.exiled_sentinel_idle: smooth armoured legs — TABS: dark leggings covered in rows of team-coloured diamond spikes (ref: evil.exiled_sentinel.red.png)
 5. shoulders in unit_evil.exiled_sentinel_idle: rounded pauldrons — TABS: a row of tall black spikes standing up over both shoulders, behind the shields (ref: evil.exiled_sentinel.red.png)
b FAIL (1 since 489, 1 struck)
 1. main hand in unit_evil.exiled_sentinel_idle: a short black club/axe handle held out sideways — TABS: a tall Norman pavise standing upright, from about the shoulder to the shin (ref: evil.exiled_sentinel.red.png)
c FAIL (0 since 489)
 1. shield-to-axe swap in unit_evil.exiled_sentinel_release/_flight: he bashes with the blue slab still held and no axes appear — TABS: at close range both shields turn into two bloodied horseman's axes that do the striking (card)
 2. missing: projectile blocking by the pavises — TABS: the shields catch incoming arrows, which stick in their faces (ref: evil.exiled_sentinel.jpg)
d PASS (489 stats)
## Ranked gaps
1. [S] evil.exiled_sentinel.b right pavise — blocker 1: a mirrored buildPavise in the main hand replacing the sword, both scaled shoulder-to-shin and held upright — ref: evil.exiled_sentinel.red.png — ours: unit_evil.exiled_sentinel_idle.png
2. [S] evil.exiled_sentinel.a ginger mane — blocker 2: evilDress sentinelMane, a bushy faceted ginger mass framing the face under the cone — ref: evil.exiled_sentinel.blue.png — ours: unit_evil.exiled_sentinel_idle.png
3. [S] evil.exiled_sentinel.c shield-to-axe swap — blocker 1: in melee hide the pavises, two bloodied horseman's axes swing the blow — ref: card — ours: unit_evil.exiled_sentinel_release.png
## Attempts (iter | gap | criterion | verdict)
489 | spiked cone hat, evilDress sentinelConeHat (ab3c3690) | a | approved (struck 1)
489 | upright coffin pavise, propBuilder PAVISE torso mount (a755e889) | b | approved (struck 2)
## Rejected (last 4)
## Notes (max 3 lines)
- 489 critic DEFECTS: cone's lean and wide base read as a witch's brim; pavise .42 of height (TABS ~half again taller); torso-mounted, it tips flat in windup.
- Void Cultist summons evil.exiled_sentinel today (card says it should not).
