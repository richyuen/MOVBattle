# secret.clams
Status: open   Audited: 515 (AUDIT x2), 525 (CONFIRM: passed c; failed a, b)   Done: -
## Verdicts
a FAIL (0 since 525, CONFIRM list)
 1. pale blue squashed-sphere "clam shell" disc ringing the thighs below the rope belt in unit_secret.clams_idle (also lineup_secret_2, second unit from left, the blue ring round his legs) — TABS: straight tan trousers run uncovered from the rope belt down to the boots; no shell or disc at the hips or thighs (ref: secret.clams.red.png, secret.clams.blue.png; card Appearance "pants and shoes with ropes around them")
b FAIL (0 since 525, CONFIRM list)
 1. clam hands in unit_secret.clams_idle and unit_secret.clams_windup are small slim pointed shells, shorter than the head and much thinner — TABS: each hand is a fat faceted grey clam longer and about as wide as the head, the biggest shapes at the ends of his arms (ref: secret.clams.red.png, secret.clams.png)
c PASS (524: struck 2; CONFIRM 525 passed)
d PASS (525 stats)
## Ranked gaps
1. [S] secret.clams.a hip disc — blocker 1: drop the legacy propBuilder "clam_shell" special disc on body.hip from the main actor (set by the secret_clams preset in unitVisuals; check the clam critters before removing it) — ref: secret.clams.blue.png — ours: unit_secret.clams_idle
2. [S] secret.clams.b clam hands — blocker 1: fat faceted grey clams about head-length and head-wide at each hand, bead eye at the tip (replaces CLAM_HAND geometry) — ref: secret.clams.red.png — ours: unit_secret.clams_windup
## Attempts (iter | gap | criterion | verdict)
525 | brown boots, rust rope cuff and two wraps, secretDress clamsBoots CLAM_BOOT (d6371769) | a | approved (struck 6, a PASS; CONFIRM failed a)
525 | tan trousers, rope belt ring, knot, two ends, tunic skirt off, secretDress clamsTrousers CLAM_TROUSER (955447c8) | a | approved (struck 5)
524 | clams thrown from alternate hands .15 s apart, each a summon where it lands, simulationSystem CLAM_THROW (19c243c3) | c | approved (struck 2, c PASS)
524 | dark lower half-shell collar, deep team inside, pale lip, secretDress clamsCollar CLAM_COLLAR (0662d3b5, 44a4985b) | a | approved (struck 3)
523 | tan laced shirt with rolled sleeves, main actor only (53ebabd6, ab43da19) | a | approved (struck 4)
521 | rebuild the summoner around a lanky Wobbler rig (16906db2) | a | approved (struck 1)
520 | summons are gaping grey clams with red mouths and bead eyes over a hidden halfling, count 3, CLAM_CRITTER (1be75f32) | c | approved (struck 1, 3)
516 | grey scalloped fan shell behind the head, secretDress clamsHat CLAM_HAT (deb199cb, 30b1375a) | a | approved (struck 2)
515 | grey clam half-shells with bead eyes over each hand, secretDress clamsHands (e79fae3e) | b | approved (struck 1; b PASS)
## Rejected (last 4)
## Notes (max 3 lines)
- 524: limbBox(torsoMesh).wide on his slim rig is about half the shown half-width: size dress off a probe_close.
- 525: the hip disc is not listed by probe_bbox for his own meshes; grep propBuilder case "clam_shell".
- 516 DEFECTS: the shell fan is lopsided (tall on his right, low on his left); TABS symmetric behind the head.
