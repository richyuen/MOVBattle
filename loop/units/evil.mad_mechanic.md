# evil.mad_mechanic
Status: open   Audited: 489 (AUDIT x2), 498 (CONFIRM: passed b, c, d; failed a)   Done: -
## Verdicts
a FAIL (0 since 498)
 7. Build in lineup_evil (3rd from left): slab torso with blocky shoulder and upper-arm masses, clearly wider than the cultist and spiked-shield neighbours. TABS shows a slim, ordinary-proportioned mechanic, no broader than his neighbours (ref: reference/factions/evil.jpg, 3rd figure; evil.mad_mechanic.red.png)
 8. Shirt in unit_evil.mad_mechanic_idle: the sleeves and shoulders are the same dark purple-grey as the apron. TABS shows a light-grey long-sleeved shirt, rolled at the forearm, contrasting with the black apron bib (ref: evil.mad_mechanic.red.png; card Appearance "tattered clothing")
 9. Hair in unit_evil.mad_mechanic_idle: short orange-brown panels at the sides of the head that stop at the jaw. TABS shows long blond-brown hair falling past the shoulders from under the goggles (ref: evil.mad_mechanic.red.png; evil.mad_mechanic.png)
b PASS (492 claws turned; CONFIRM 498)
c PASS (493 light-blue claw flame jet; CONFIRM 498)
d PASS (498 stats; CONFIRM 498)
## Ranked gaps
1. [S] evil.mad_mechanic.a slim build — blocker 7: narrower trunk and upper arms (UV build / overalls shell), no wider than the cultist in lineup_evil — ref: reference/factions/evil.jpg — ours: lineup_evil.png
2. [S] evil.mad_mechanic.a light shirt — blocker 8: shirt sleeves and shoulders a light grey that stands off the black bib (read palette.png; --noglow swatch) — ref: evil.mad_mechanic.red.png — ours: unit_evil.mad_mechanic_idle.png
3. [S] evil.mad_mechanic.a long hair — blocker 9: blond-brown hair hanging past the shoulders from under the goggles (MECHANIC_HAIR) — ref: evil.mad_mechanic.red.png — ours: unit_evil.mad_mechanic_idle.png
## Attempts (iter | gap | criterion | verdict)
498 | near-black trousers torn open on team skin, bone tool ring at the left knee, evilDress mechanicTrousers (1e5aa045) | a | approved (struck 6; critic a PASS, CONFIRM failed a)
497 | Mechanic Tank, evilDress mechanicTank (34f6e472) | a | approved (struck 5)
497 | grey shirt sleeves rolled at the elbow, evilDress mechanicSleeves (75a3b139) | a | approved (struck 4)
496 | grey shirt under a dark bib with a tool emblem, evilDress mechanicOveralls (e89b1570) | a | approved (struck 3)
494-495 | goggles on the brow, top bun (a); ginger-brown hair to the shoulders (a) | a | approved
491-493 | claw gauntlets (b PASS); light-blue flame jet (c PASS) | b, c | approved
## Rejected (last 4)
## Notes (max 3 lines)
- 498 DEFECTS: some tear patches read edge-on as slivers ([P] MECHANIC_TROUSERS.proud .06 to .02 eligible). CONFIRM 498 contradicts 495/497 approvals on hair and sleeves: the earlier pieces do not read in the shots.
- Look is unitFactory HORNED_EVIL "evil.mad_mechanic" (apron) + evilDress mechanicGoggles, mechanicHair, mechanicOveralls, mechanicTank, mechanicSleeves, mechanicTrousers.
