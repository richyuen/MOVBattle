# secret.bomb_on_a_stick
Status: open   Audited: 500 (AUDIT x2)   Done: -
## Verdicts
a FAIL (2 since 500, 2 struck)
 2. headband in unit_secret.bomb_on_a_stick_idle — none; TABS a team headband round the top of the head (ref: secret.bomb_on_a_stick.red.png)
 4. vest in unit_secret.bomb_on_a_stick_idle — none; TABS an open team vest over the shirt (ref: secret.bomb_on_a_stick.red.png)
 5. trousers in unit_secret.bomb_on_a_stick_idle — straight legs; TABS baggy knee-length team breeches with cuffs and a stitched patch on the left leg (ref: secret.bomb_on_a_stick.red.png)
b PASS (507 upright two-handed waist grip in idle and windup)
c PASS (504 blast consumes the bomb and kills the bomber)
d PASS (504 stats)
## Ranked gaps
1. [S] secret.bomb_on_a_stick.a add the open vest — blocker 4: fit team-colored front panels over the sides of the cream shirt — ref: secret.bomb_on_a_stick.blue.png — ours: unit_secret.bomb_on_a_stick_idle.png
2. [S] secret.bomb_on_a_stick.a rebuild the breeches — blocker 5: add puffy knee-length trouser shells with cuffs and a stitched left patch — ref: secret.bomb_on_a_stick.red.png — ours: unit_secret.bomb_on_a_stick_idle.png
3. [S] secret.bomb_on_a_stick.a wrap the headband — blocker 2: fit a team-colored band between the forehead and the ginger fringe — ref: secret.bomb_on_a_stick.blue.png — ours: unit_secret.bomb_on_a_stick_idle.png
## Attempts (iter | gap | criterion | verdict)
508 | laced cream shirt with rolled sleeves (ca58ecb9) | a | approved (struck 3)
507 | upright waist carry with a close upper grip (3fd52380) | b | approved (struck 2; b PASS)
505 | shaggy ginger crown locks and tapered back braid (c4965761) | a | approved (struck 1)
504 | blast consumes the bomb and launches the bomber (7aac0f42) | c | approved (struck 2)
503 | walks in to the pole's reach (manifest engageRangeOverride 2.6), smack with a blast on the man's chest, no throw, SS _tryBombSmack BOMB_SMACK (bf9a5a70, cb05da8e) | c | approved (struck 1)
502 | grip wrap named hpoint, off fist on the haft by _twoHandPole, propBuilder BOMB_STICK (28cf5772) | b | approved (struck 1; added 2: off arm over the crown)
501 | head-high pole topped by a big black bomb, orange bands, lit fuse, BOMB_STICK on the halberd grip (8b3c4a36) | b | approved (no strike: held one-handed)
## Rejected (last 4)
## Notes (max 3 lines)
- 508: cream shirt and rolled cuffs read. Headband, vest and breeches remain.
- 504 DEFECTS: recoil throws the bomber low and sideways; TABS lifts the bomber above the blast.
- Capture 504: off-camera reserves on both teams let _flight show the blast aftermath (07093d34).
