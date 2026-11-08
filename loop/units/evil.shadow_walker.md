# evil.shadow_walker
Status: open   Audited: 489 (AUDIT x2)   Done: -
## Verdicts
a FAIL (3 since 489, 3 struck)
 4. boots in unit_evil.shadow_walker_idle: plain team-blue tall boots — TABS: dark boots with tan spike fins up the shin (ref: evil.shadow_walker.red.png)
 5. knees in unit_evil.shadow_walker_idle: no knee pads — TABS: round dark knee pads, each with a tan spike (ref: evil.shadow_walker.red.png)
 6. hair in unit_evil.shadow_walker_idle is missing — TABS: long dark hair hangs from under the helmet to the shoulders (ref: evil.shadow_walker.red.png)
b PASS (495 broad bone crescent dagger)
c FAIL (2 since 489, 2 struck)
 3. hit mark in unit_evil.shadow_walker_struck: no green particles on the struck knight — TABS: each hit leaves stacking green particles on the target (card)
d PASS (496 stats)
## Ranked gaps
1. [S] evil.shadow_walker.a hair — blocker 6: long dark hair from under the helm to the shoulders — ref: evil.shadow_walker.red.png — ours: unit_evil.shadow_walker_idle.png
2. [S] evil.shadow_walker.a knees — blocker 5: round dark knee pads each with a tan spike — ref: evil.shadow_walker.red.png — ours: unit_evil.shadow_walker_idle.png
3. [S] evil.shadow_walker.c hit mark — blocker 3: stacking green particles on the struck target (visualEffects + simulationSystem melee hit) — ref: loop/cards/evil.shadow_walker.md — ours: unit_evil.shadow_walker_struck.png
## Attempts (iter | gap | criterion | verdict)
496 | near-black sleeveless vest, jagged hem and top, straps, over team-skin trunk and arms out of the glow, evilDress walkerVest (7c0bfd4f, 4b82d4a0) | a | approved (struck 3)
495 | broad bone crescent dagger, flat blade section baked before flattening, propBuilder BONE_DAGGER (a808e403) | b | approved (struck 1; b PASS)
495 | dark violet Assassin Poof cloud at departure and arrival, visualEffects spawnShadowPoof (97ea0360, 36f79506) | c | approved (struck 1)
493 | one-handed reverse-grip stab, proceduralAnimation DAGGER_STAB (7b49861b) | c | approved (struck 2)
492 | enclosing domed helm with four tan face bars, evilDress walkerHelm (3d7a1e02) | a | approved (struck 2)
489-491 | horns out level (a); curved bone dagger, empty off hand (b) | a, b | approved
## Rejected (last 4)
## Notes (max 3 lines)
- 496 DEFECTS: the idle frames his back three-quarter (helm bars face away): evidence commit first to turn the idle to his front before more a picks.
- Look is unitFactory HORNED_EVIL "evil.shadow_walker" (horn path, helm) + evilDress walkerVest. custom.dark_peasant/void_monarch summon evil.shadow_walker: never rename it.
