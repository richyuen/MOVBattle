# secret.banshee
Status: open   Audited: 527 (AUDIT x2), 531 (RE-AUDIT a x2)   Done: -
## Verdicts
a FAIL (0 since 531, RE-AUDIT 531 list)
 1. Legs in unit_secret.banshee_idle are full team legs, two legs and boots standing below the hem — TABS: no legs; dark chains hang below the dress hem in their place (ref: secret.banshee.red.png; card Appearance)
 2. Headgear in unit_secret.banshee_idle is a flat grey dish round the neck (the base hood) with no crown — TABS: a large team-coloured fan crown with gold spikes standing behind the head (ref: secret.banshee.red.png)
 3. Eyes in unit_secret.banshee_idle: the head is a plain round ball with no eyes — TABS: two glowing white eyes on a long, pointed team face (ref: secret.banshee.red.png)
 4. No hair in unit_secret.banshee_idle — TABS: long dark wild hair framing the face (ref: secret.banshee.red.png)
 5. No chains around the body in unit_secret.banshee_idle — TABS: dark chains wrapped round the waist and trailing off the arms (ref: secret.banshee.red.png; card Appearance)
 6. Bare team upper arms in unit_secret.banshee_idle — TABS: two gold armbands on each upper arm (ref: secret.banshee.red.png)
b PASS (528: struck 1, 2, empty hands with spirit rings)
c FAIL (1 since 527, 1 struck)
 2. The release in unit_secret.banshee_release is a blade-pole swing that registers as fear — TABS: a ghostly curse cast from the hands that turns the target blue with spirits twirling round it (ref: card Weapons Banshee Hands)
d PASS (531 stats)
## Ranked gaps
1. [S] secret.banshee.a chain legs — blocker 1: hide the leg meshes under the gown and hang 2-3 dark chain-link strands from the hem to the ground — ref: secret.banshee.red.png — ours: unit_secret.banshee_idle.png
2. [S] secret.banshee.a fan crown — blocker 2: drop the "hood" hat in unitVisuals, a tall faceted team fan crown behind the head with gold edge ribs and 5 gold spikes — ref: secret.banshee.red.png — ours: unit_secret.banshee_idle.png
3. [S] secret.banshee.a face — blocker 3: two large glowing white bead eyes high on the head plus a lengthened, downward-pointed team face/chin wedge — ref: secret.banshee.red.png — ours: unit_secret.banshee_idle.png
4. [S] secret.banshee.c hand curse — blocker 2: curse cast from the open hands that tints the target blue with orbiting spirit wisps — ref: card Weapons Banshee Hands — ours: unit_secret.banshee_release
## Attempts (iter | gap | criterion | verdict)
530 | Banshee Scream: pale-blue burst dome 4 m round her, BANSHEE_SCREAM (SS) (ac9de35a) | c | approved (struck 1)
529 | ragged cream gown to the knee, zigzag hem, BANSHEE_GOWN (f1ccaab5) | a | approved (struck 2)
528 | empty hands, pale-blue spirit ring per wrist (bansheeSpiritRings), wing fans retired (dd424eab) | b | approved (struck 1, 2, b PASS)
## Rejected (last 4)
## Notes (max 3 lines)
- 531 re-audit (audit2): the slate hood disc reads as a hat brim at lineup distance (TABS team ragged collar points); shackles dropped at the 6 cap; skin lilac-pink (swatch if raised). 530: scream spikes icy, not wispy.
- 530 evidence: idle swings .25 rad toward her front (capture nearFront); ability shots frame "scream" (ABILITY_PREF).
