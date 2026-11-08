# evil.shadow_walker
Status: open   Audited: 489 (AUDIT x2)   Done: -
## Verdicts
a FAIL (4 since 489, 4 struck)
 4. boots in unit_evil.shadow_walker_idle: plain team-blue tall boots — TABS: dark boots with tan spike fins up the shin (ref: evil.shadow_walker.red.png)
 5. knees in unit_evil.shadow_walker_idle: no knee pads — TABS: round dark knee pads, each with a tan spike (ref: evil.shadow_walker.red.png)
b PASS (495 broad bone crescent dagger)
c PASS (497 stacking green marks on the struck man)
d PASS (497 stats)
## Ranked gaps
1. [S] evil.shadow_walker.a spiked boots — blocker 4: dark boot shells with tan spike fins up the shin — ref: evil.shadow_walker.red.png — ours: unit_evil.shadow_walker_idle.png
2. [S] evil.shadow_walker.a knee pads — blocker 5: round dark knee pads, each with a tan spike — ref: evil.shadow_walker.red.png — ours: unit_evil.shadow_walker_idle.png
## Attempts (iter | gap | criterion | verdict)
497 | long near-black hair from under the helm to the shoulders, evilDress walkerHair (7c77bf2f, 29acc06f) | a | approved (struck 6)
497 | stacking green orbs circling the struck man's chest, one more per blow, visualEffects WALKER_MARK + simulationSystem _walkerMarks (7de67bfc, d838dbbe) | c | approved (struck 3; c PASS)
496 | near-black sleeveless vest, jagged hem and top, straps, over team-skin trunk and arms out of the glow, evilDress walkerVest (7c0bfd4f, 4b82d4a0) | a | approved (struck 3)
495 | broad bone crescent dagger, flat blade section baked before flattening, propBuilder BONE_DAGGER (a808e403) | b | approved (struck 1; b PASS)
495 | dark violet Assassin Poof cloud at departure and arrival, visualEffects spawnShadowPoof (97ea0360, 36f79506) | c | approved (struck 1)
493 | one-handed reverse-grip stab, proceduralAnimation DAGGER_STAB (7b49861b) | c | approved (struck 2)
492 | enclosing domed helm with four tan face bars, evilDress walkerHelm (3d7a1e02) | a | approved (struck 2)
489-491 | horns out level (a); curved bone dagger, empty off hand (b) | a, b | approved
## Rejected (last 4)
## Notes (max 3 lines)
- 497 evidence 15e766b8: the idle swings .25 rad (near front-on); RE-AUDIT a and b on the new idle at 498. Critic 497 tidy: move WALKER_MARK below SHADOW_POOF's const on the next touch.
- Look is unitFactory HORNED_EVIL "evil.shadow_walker" (horn path, helm) + evilDress walkerVest, walkerHair. custom.dark_peasant/void_monarch summon evil.shadow_walker: never rename it.
