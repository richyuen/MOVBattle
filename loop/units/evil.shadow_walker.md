# evil.shadow_walker
Status: open   Audited: 489 (AUDIT x2), 498 (RE-AUDIT a, b x2)   Done: -
## Verdicts
a FAIL (2 since 498, 2 struck)
 7. horns in unit_evil.shadow_walker_idle: pale grey-white — TABS: tan/khaki bone horns (ref: evil.shadow_walker.red.png)
b PASS (495 broad bone crescent dagger; re-audit 498 kept)
c PASS (497 stacking green marks on the struck man)
d PASS (498 stats)
## Ranked gaps
1. [S] evil.shadow_walker.a horns — blocker 7: bone-tan horn material (WALKER_HORN, the helm bars' (.6,.42,.18)), judged on a --noglow swatch — ref: evil.shadow_walker.red.png — ours: unit_evil.shadow_walker_idle.png
## Attempts (iter | gap | criterion | verdict)
498 | near-black boots, three tan fins up each shin, navy shin guards hidden, evilDress walkerBoots (eb3df4ba, 37602f6a) | a | approved (struck 4)
498 | round dark knee pads with a tan spike, evilDress walkerKneePads (cb8a83fa) | a | approved (struck 5)
497 | long near-black hair from under the helm to the shoulders, evilDress walkerHair (7c77bf2f, 29acc06f) | a | approved (struck 6)
497 | stacking green orbs circling the struck man's chest, WALKER_MARK (7de67bfc, d838dbbe) | c | approved (struck 3; c PASS)
496 | near-black sleeveless vest over team skin, evilDress walkerVest (7c0bfd4f, 4b82d4a0) | a | approved (struck 3)
495 | broad bone crescent dagger, BONE_DAGGER (a808e403) | b | approved (struck 1; b PASS)
495 | violet Assassin Poof cloud, spawnShadowPoof (97ea0360, 36f79506) | c | approved (struck 1)
489-493 | horns level, helm with tan bars (a); dagger (b); reverse-grip stab (c) | a, b, c | approved
## Rejected (last 4)
## Notes (max 3 lines)
- 498 DEFECTS: boot fins short, lying close to the shell; knee pads merge with the boot tops (TABS pads dark team-red). Horn colour is colour-only: swatch with probe_close --noglow.
- Look is unitFactory HORNED_EVIL "evil.shadow_walker" (horn path, helm) + evilDress walkerVest, walkerHair, walkerBoots, walkerKneePads. custom.dark_peasant/void_monarch summon evil.shadow_walker: never rename it.
