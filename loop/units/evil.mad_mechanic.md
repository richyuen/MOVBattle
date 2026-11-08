# evil.mad_mechanic
Status: open   Audited: 489 (AUDIT x2)   Done: -
## Verdicts
a FAIL (1 since 489, 1 struck)
 2. hair in unit_evil.mad_mechanic_idle: none — TABS: long ginger-blond hair falling past the ears to the shoulders (ref: evil.mad_mechanic.blue.png)
 3. torso in unit_evil.mad_mechanic_idle: a black vest block — TABS: a grey collared shirt under dark overalls, with a bone-white tool emblem on the bib (ref: evil.mad_mechanic.red.png)
 4. arms in unit_evil.mad_mechanic_idle: bare team arms — TABS: grey sleeves rolled to the forearm (ref: evil.mad_mechanic.red.png)
 5. back in unit_evil.mad_mechanic_idle: nothing behind him — TABS: a dark spiked round fuel tank with soul-smoke tentacles floating behind the shoulder (ref: evil.mad_mechanic.png; card Mechanic Tank)
 6. legs in unit_evil.mad_mechanic_idle are plain dark trousers — TABS: dark trousers with torn patches showing team skin and a tool ring at the knee (ref: evil.mad_mechanic.red.png)
b PASS (492 claws turned: cuff up the forearm, jaws past the fist)
c PASS (493 light-blue claw flame jet at 4.5 m)
d PASS (494 stats)
## Ranked gaps
1. [S] evil.mad_mechanic.a hair — blocker 2: long ginger-blond hair panels from under the strap to the shoulders, in the bun's colour (evilDress) — ref: evil.mad_mechanic.blue.png — ours: unit_evil.mad_mechanic_idle.png
2. [S] evil.mad_mechanic.a shirt and overalls — blocker 3: grey collared shirt under a dark bib with a bone tool emblem — ref: evil.mad_mechanic.red.png — ours: unit_evil.mad_mechanic_idle.png
3. [S] evil.mad_mechanic.a fuel tank — blocker 5: dark spiked round tank floating behind the shoulder — ref: evil.mad_mechanic.png — ours: unit_evil.mad_mechanic_idle.png
## Attempts (iter | gap | criterion | verdict)
494 | goggles pushed up on the brow over a top bun, eyes uncovered, evilDress mechanicGoggles (6b26e43f) | a | approved (struck 1)
493 | light-blue flame jet from the claw, simulationSystem MECHANIC_FIRE + spawnFlameJet look (99b7a8fc, eee93888) | c | approved (struck 1; c PASS)
492 | claw frame turned half a turn about x (42fd82fe) | b | approved (struck 1, 2; b PASS)
491 | claw gauntlets both hands, propBuilder MECHANIC_CLAW (a395751d, 287847f9) | b | approved (no strike)
## Rejected (last 4)
## Notes (max 3 lines)
- 494 DEFECTS: the bun reads pale tan and small (TABS ginger-brown, matching the long hair: fix with a.2). Idle shot is now taken 250 ms after placement (evidence 494.0b: the claw crossed the face).
- Look is unitFactory HORNED_EVIL "evil.mad_mechanic" (apron, no helm) + evilDress mechanicGoggles. Projectile hint is still bomb but unused (the fire branch comes first).
