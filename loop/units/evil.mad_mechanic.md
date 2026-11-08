# evil.mad_mechanic
Status: open   Audited: 489 (AUDIT x2)   Done: -
## Verdicts
a FAIL (3 since 489, 3 struck)
 4. arms in unit_evil.mad_mechanic_idle: bare team arms — TABS: grey sleeves rolled to the forearm (ref: evil.mad_mechanic.red.png)
 5. back in unit_evil.mad_mechanic_idle: nothing behind him — TABS: a dark spiked round fuel tank with soul-smoke tentacles floating behind the shoulder (ref: evil.mad_mechanic.png; card Mechanic Tank)
 6. legs in unit_evil.mad_mechanic_idle are plain dark trousers — TABS: dark trousers with torn patches showing team skin and a tool ring at the knee (ref: evil.mad_mechanic.red.png)
b PASS (492 claws turned: cuff up the forearm, jaws past the fist)
c PASS (493 light-blue claw flame jet at 4.5 m)
d PASS (496 stats)
## Ranked gaps
1. [S] evil.mad_mechanic.a fuel tank — blocker 5: dark spiked round tank with soul-smoke tentacles floating behind the shoulder — ref: evil.mad_mechanic.png — ours: unit_evil.mad_mechanic_idle.png
2. [S] evil.mad_mechanic.a sleeves — blocker 4: grey rolled sleeves on the upper arms (evilDress mechanicOveralls) — ref: evil.mad_mechanic.red.png — ours: unit_evil.mad_mechanic_idle.png
## Attempts (iter | gap | criterion | verdict)
496 | grey collared shirt under a dark bib with a bone tool emblem, straps, evilDress mechanicOveralls (e89b1570) | a | approved (struck 3)
495 | long ginger-brown hair to the shoulders, bun recoloured, evilDress mechanicHair (7d131c39) | a | approved (struck 2)
494 | goggles pushed up on the brow over a top bun, eyes uncovered, evilDress mechanicGoggles (6b26e43f) | a | approved (struck 1)
493 | light-blue flame jet from the claw, simulationSystem MECHANIC_FIRE + spawnFlameJet look (99b7a8fc, eee93888) | c | approved (struck 1; c PASS)
491-492 | claw gauntlets both hands, then turned half a turn (a395751d, 287847f9, 42fd82fe) | b | approved (b PASS)
## Rejected (last 4)
## Notes (max 3 lines)
- 496 DEFECTS: the collar does not read as a turned-down collar; the team-skin glow washes the neck. 495: hair a shade darker than the render.
- Look is unitFactory HORNED_EVIL "evil.mad_mechanic" (apron, no helm) + evilDress mechanicGoggles, mechanicHair, mechanicOveralls (trunk/yoke grey shirt). Arms SKIN.
