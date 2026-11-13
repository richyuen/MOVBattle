# secret.banshee
Status: open   Audited: 527 (AUDIT x2)   Done: -
## Verdicts
a FAIL (1 since 527, 1 struck; RE-AUDIT due 531: idle camera changed by evidence 530.0)
 1. Legs in unit_secret.banshee_idle are full team legs — TABS: no legs; dark chains hang below the dress hem in their place (ref: secret.banshee.red.png; card Appearance)
 3. No crown in unit_secret.banshee_idle — TABS: a large team-coloured fan crown with gold spikes behind the head (ref: secret.banshee.red.png)
 4. No hair in unit_secret.banshee_idle — TABS: long dark wild hair framing the face (ref: secret.banshee.red.png)
 5. No chains around the body in unit_secret.banshee_idle — TABS: dark chains wrapped round the waist and trailing off the arms (ref: secret.banshee.red.png; card Appearance)
 6. Bare team arms in unit_secret.banshee_idle — TABS: gold armbands on both upper arms and dark shackles at the wrists (ref: secret.banshee.red.png)
 7. eyes in unit_secret.banshee_idle: no visible face — TABS: two glowing white eyes on a long team face (ref: secret.banshee.red.png)
b PASS (528: struck 1, 2, empty hands with spirit rings)
c FAIL (1 since 527, 1 struck)
 2. The release in unit_secret.banshee_release is a blade-pole swing that registers as fear — TABS: a ghostly curse cast from the hands that turns the target blue with spirits twirling round it (ref: card Weapons Banshee Hands)
d PASS (530 stats)
## Ranked gaps
1. [S] secret.banshee.a legless hem — blocker 1: hide the legs and hang dark chains below the hem — ref: secret.banshee.red.png — ours: unit_secret.banshee_idle
2. [S] secret.banshee.c hand curse — blocker 2: curse cast from the open hands that tints the target blue with orbiting spirit wisps — ref: card Weapons Banshee Hands — ours: unit_secret.banshee_release
3. [S] secret.banshee.a fan crown — blocker 3: team fan crown with gold spikes behind the head — ref: secret.banshee.red.png — ours: unit_secret.banshee_idle
## Attempts (iter | gap | criterion | verdict)
530 | Banshee Scream: pale-blue burst dome 4 m round her, enemies hurt, launched and flung, 10 s cooldown, logged "scream", BANSHEE_SCREAM (SS) (ac9de35a) | c | approved (struck 1)
529 | ragged cream gown to the knee, zigzag hem with team points, torn team holes, BANSHEE_GOWN (f1ccaab5) | a | approved (struck 2)
528 | empty hands, pale-blue spirit ring per wrist (bansheeSpiritRings), wing fans retired (dd424eab) | b | approved (struck 1, 2, b PASS)
## Rejected (last 4)
## Notes (max 3 lines)
- 530 evidence: idle swings .25 rad toward her front (capture nearFront); ability shots frame "scream" (ABILITY_PREF).
- 530 critic: the scream has ice-like crystal spikes and a solid dome (TABS wispy streamers; not blocking).
- 529 critic: gown top a square shelf wider than the shoulders; team zigzag border does not read.
