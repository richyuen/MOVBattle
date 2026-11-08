# evil.shadow_walker
Status: open   Audited: 489 (AUDIT x2)   Done: -
## Verdicts
a FAIL (2 since 489, 2 struck)
 3. torso in unit_evil.shadow_walker_idle: a team-blue jacket with a dark spiked plate on the chest — TABS: a dark sleeveless tattered vest with a jagged hem over team skin (ref: evil.shadow_walker.red.png)
 4. boots in unit_evil.shadow_walker_idle: plain team-blue tall boots — TABS: dark boots with tan spike fins up the shin (ref: evil.shadow_walker.red.png)
 5. knees in unit_evil.shadow_walker_idle: no knee pads — TABS: round dark knee pads, each with a tan spike (ref: evil.shadow_walker.red.png)
 6. hair in unit_evil.shadow_walker_idle is missing — TABS: long dark hair hangs from under the helmet to the shoulders (ref: evil.shadow_walker.red.png)
b PASS (495 broad bone crescent dagger)
c FAIL (2 since 489, 2 struck)
 3. hit mark in unit_evil.shadow_walker_struck: no green particles on the struck knight — TABS: each hit leaves stacking green particles on the target (card)
d PASS (495 stats)
## Ranked gaps
1. [S] evil.shadow_walker.a vest — blocker 3: dark sleeveless tattered vest with a jagged hem over team skin, replacing the blue jacket — ref: evil.shadow_walker.red.png — ours: unit_evil.shadow_walker_idle.png
2. [S] evil.shadow_walker.c hit mark — blocker 3: stacking green particles on the struck target (visualEffects + simulationSystem melee hit) — ref: loop/cards/evil.shadow_walker.md — ours: unit_evil.shadow_walker_struck.png
## Attempts (iter | gap | criterion | verdict)
495 | broad bone crescent dagger, flat blade section baked before flattening, propBuilder BONE_DAGGER (a808e403) | b | approved (struck 1; b PASS)
495 | dark violet Assassin Poof cloud at departure and arrival, visualEffects spawnShadowPoof (97ea0360, 36f79506) | c | approved (struck 1)
493 | one-handed reverse-grip stab, proceduralAnimation DAGGER_STAB (7b49861b) | c | approved (struck 2)
492 | enclosing domed helm with four tan face bars, evilDress walkerHelm (3d7a1e02) | a | approved (struck 2)
491 | horns run out level, turn up at the tips (67a1ba53) | a | approved (struck 1)
489-490 | curved bone dagger, point-down, empty off hand | b | approved
## Rejected (last 4)
## Notes (max 3 lines)
- 495: poof lives .8 s so it clears before the windup (1.4 s hid the dagger). 493 DEFECTS: the stab lands level rather than point-down.
- Look is unitFactory HORNED_EVIL "evil.shadow_walker" (horn path, helm). custom.dark_peasant/void_monarch summon evil.shadow_walker: never rename it.
