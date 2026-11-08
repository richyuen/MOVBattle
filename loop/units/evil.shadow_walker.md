# evil.shadow_walker
Status: open   Audited: 489 (AUDIT x2)   Done: -
## Verdicts
a FAIL (2 since 489, 2 struck)
 3. torso in unit_evil.shadow_walker_idle: a team-blue jacket with a dark spiked plate on the chest — TABS: a dark sleeveless tattered vest with a jagged hem over team skin (ref: evil.shadow_walker.red.png)
 4. boots in unit_evil.shadow_walker_idle: plain team-blue tall boots — TABS: dark boots with tan spike fins up the shin (ref: evil.shadow_walker.red.png)
 5. knees in unit_evil.shadow_walker_idle: no knee pads — TABS: round dark knee pads, each with a tan spike (ref: evil.shadow_walker.red.png)
 6. hair in unit_evil.shadow_walker_idle is missing — TABS: long dark hair hangs from under the helmet to the shoulders (ref: evil.shadow_walker.red.png)
b FAIL (3 since 489, 1 struck)
 1. main hand in unit_evil.shadow_walker_windup: a dark four-point star on a short stick — TABS: a long, curved bone-tan dagger with a spiky back edge, held point-down (ref: evil.shadow_walker.red.png)
c FAIL (1 since 489, 1 struck)
 1. teleport in unit_evil.shadow_walker_ability/_ability_after: no smoke or shadow puff at departure or arrival — TABS: Assassin Poof vanishes him and puts him at the farthest enemy (card)
 3. hit mark in unit_evil.shadow_walker_struck: no green particles on the struck knight — TABS: each hit leaves stacking green particles on the target (card)
d PASS (493 stats)
## Ranked gaps
1. [S] evil.shadow_walker.c no poof — blocker 1: dark smoke puff at teleport departure and arrival (visualEffects + simulationSystem teleport) — ref: card Assassin Poof — ours: unit_evil.shadow_walker_ability.png
2. [S] evil.shadow_walker.b broad bone blade — blocker 1: one extruded crescent slab, wrist-wide, with a jagged spine — ref: evil.shadow_walker.red.png — ours: unit_evil.shadow_walker_idle.png
## Attempts (iter | gap | criterion | verdict)
493 | one-handed reverse-grip stab, proceduralAnimation DAGGER_STAB (7b49861b) | c | approved (struck 2)
492 | enclosing domed helm with four tan face bars, evilDress walkerHelm (3d7a1e02) | a | approved (struck 2)
491 | horns run out level, turn up at the tips (67a1ba53) | a | approved (struck 1)
490 | dagger point-down in a flat tan, boneDaggerHold (df94c995) | b | approved (no strike)
489 | curved bone dagger (2c327ce9); empty off hand (48281a0d) | b | approved (struck 2)
## Rejected (last 4)
## Notes (max 3 lines)
- 493 DEFECTS: the stab lands level rather than point-down from a reverse grip. 490: blade needle-thin (.075 of its length), TABS a broad crescent, wrist-wide.
- Look is unitFactory HORNED_EVIL "evil.shadow_walker" (horn path, helm). custom.dark_peasant/void_monarch summon evil.shadow_walker: never rename it.
