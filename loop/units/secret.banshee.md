# secret.banshee
Status: open   Audited: 527 (AUDIT x2), 531 (RE-AUDIT a x2)   Done: -
## Verdicts
a FAIL (1 since 531, 1 struck)
 2. Headgear in unit_secret.banshee_idle is a flat grey dish round the neck (the base hood) with no crown — TABS: a large team-coloured fan crown with gold spikes standing behind the head (ref: secret.banshee.red.png)
 3. Eyes in unit_secret.banshee_idle: the head is a plain round ball with no eyes — TABS: two glowing white eyes on a long, pointed team face (ref: secret.banshee.red.png)
 4. No hair in unit_secret.banshee_idle — TABS: long dark wild hair framing the face (ref: secret.banshee.red.png)
 5. No chains around the body in unit_secret.banshee_idle — TABS: dark chains wrapped round the waist and trailing off the arms (ref: secret.banshee.red.png; card Appearance)
 6. Bare team upper arms in unit_secret.banshee_idle — TABS: two gold armbands on each upper arm (ref: secret.banshee.red.png)
b PASS (528: struck 1, 2, empty hands with spirit rings)
c PASS (535: struck 2, two-handed hand curse)
d PASS (535 stats)
## Ranked gaps
1. [S] secret.banshee.a fan crown — blocker 2: drop the "hood" hat, a tall team fan of plates behind the head with gold edge ribs and gold spikes — ref: secret.banshee.red.png — ours: unit_secret.banshee_idle.png
2. [S] secret.banshee.a face — blocker 3: two large glowing white bead eyes high on the head plus a long, downward-pointed team face wedge — ref: secret.banshee.red.png — ours: unit_secret.banshee_idle.png
3. [S] secret.banshee.a hair — blocker 4: long dark wild hair framing the face — ref: secret.banshee.red.png — ours: unit_secret.banshee_idle.png
## Attempts (iter | gap | criterion | verdict)
535 | Banshee Hands curse: both palms out, ghost streams, target dyed blue with orbiting wisps, BANSHEE_CURSE, GHOST_CURSE, CURSE_CAST (10c9405b, 109bd5be) | c | approved (struck 2, c PASS)
534 | no legs, hover .16, three dark chains under the hem, bansheeChainLegs (c60e101a) | a | approved (struck 1)
530 | Banshee Scream: pale-blue burst dome 4 m round her, BANSHEE_SCREAM (SS) (ac9de35a) | c | approved (struck 1)
529 | ragged cream gown to the knee, zigzag hem, BANSHEE_GOWN (f1ccaab5) | a | approved (struck 2)
528 | empty hands, spirit ring per wrist, wing fans retired (dd424eab) | b | approved (struck 1, 2, b PASS)
## Rejected (last 4)
## Notes (max 3 lines)
- 535 critic: the curse dye shows only on bare skin of an armoured man (tabard, plate stay their colour); not blocking.
- 531 re-audit: the slate hood disc reads as a hat brim at lineup distance. 534 critic: chains end well above the ground.
- 530 evidence: idle swings .25 rad toward her front (capture nearFront); ability shots frame "scream" (ABILITY_PREF).
