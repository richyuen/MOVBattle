# secret.bomb_on_a_stick
Status: open   Audited: 500 (AUDIT x2)   Done: -
## Verdicts
a FAIL (1 since 500, 1 struck)
 2. headband in unit_secret.bomb_on_a_stick_idle — none; TABS a team headband round the top of the head (ref: secret.bomb_on_a_stick.red.png)
 3. shirt in unit_secret.bomb_on_a_stick_idle — a dark team torso; TABS a beige baggy shirt with elbow-length rolled sleeves (ref: secret.bomb_on_a_stick.red.png)
 4. vest in unit_secret.bomb_on_a_stick_idle — none; TABS an open team vest over the shirt (ref: secret.bomb_on_a_stick.red.png)
 5. trousers in unit_secret.bomb_on_a_stick_idle — straight legs; TABS baggy knee-length team breeches with cuffs and a stitched patch on the left leg (ref: secret.bomb_on_a_stick.red.png)
b FAIL (2 since 500, 1 struck)
 2. off arm in unit_secret.bomb_on_a_stick_idle — wrapped up over the crown to grip the haft behind the head; TABS both fists together on the upright stick at the waist (ref: secret.bomb_on_a_stick.red.png) (added 502, introduced by 28cf5772 at propBuilder.ts:buildBombStick)
c PASS (504 blast consumes the bomb and kills the bomber)
d PASS (504 stats)
## Ranked gaps
1. [S] secret.bomb_on_a_stick.a headband — blocker 2: wrap a team band around the crown over the hair — ref: secret.bomb_on_a_stick.red.png — ours: unit_secret.bomb_on_a_stick_idle.png
2. [S] secret.bomb_on_a_stick.b waist grip — blocker 2: bring both grip anchors ahead of the torso at belt height and stand the pole upright — ref: secret.bomb_on_a_stick.red.png — ours: unit_secret.bomb_on_a_stick_idle.png
## Attempts (iter | gap | criterion | verdict)
505 | shaggy ginger crown locks and tapered back braid (c4965761) | a | approved (struck 1)
504 | blast consumes the bomb and launches the bomber (7aac0f42) | c | approved (struck 2)
503 | walks in to the pole's reach (manifest engageRangeOverride 2.6), smack with a blast on the man's chest, no throw, SS _tryBombSmack BOMB_SMACK (bf9a5a70, cb05da8e) | c | approved (struck 1)
502 | grip wrap named hpoint, off fist on the haft by _twoHandPole, propBuilder BOMB_STICK (28cf5772) | b | approved (struck 1; added 2: off arm over the crown)
501 | head-high pole topped by a big black bomb, orange bands, lit fuse, BOMB_STICK on the halberd grip (8b3c4a36) | b | approved (no strike: held one-handed)
## Rejected (last 4)
## Notes (max 3 lines)
- 504 DEFECTS: recoil throws the bomber low and sideways; TABS lifts the bomber above the blast.
- 502 DEFECTS: the stick shoulders diagonally behind the head (not _restHalberd: no "haxe" child), so the hpoint span puts the off fist over the crown.
- Capture 504: off-camera reserves on both teams let _flight show the blast aftermath (07093d34).
