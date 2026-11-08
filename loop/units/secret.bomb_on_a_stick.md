# secret.bomb_on_a_stick
Status: open   Audited: 500 (AUDIT x2)   Done: -
## Verdicts
a FAIL (0 since 500)
 1. hair in unit_secret.bomb_on_a_stick_idle — a bald team head; TABS shaggy ginger hair with a long braid down the back (ref: secret.bomb_on_a_stick.red.png)
 2. headband in unit_secret.bomb_on_a_stick_idle — none; TABS a team headband round the top of the head (ref: secret.bomb_on_a_stick.red.png)
 3. shirt in unit_secret.bomb_on_a_stick_idle — a dark team torso; TABS a beige baggy shirt with elbow-length rolled sleeves (ref: secret.bomb_on_a_stick.red.png)
 4. vest in unit_secret.bomb_on_a_stick_idle — none; TABS an open team vest over the shirt (ref: secret.bomb_on_a_stick.red.png)
 5. trousers in unit_secret.bomb_on_a_stick_idle — straight legs; TABS baggy knee-length team breeches with cuffs and a stitched patch on the left leg (ref: secret.bomb_on_a_stick.red.png)
b FAIL (2 since 500, 1 struck)
 2. off arm in unit_secret.bomb_on_a_stick_idle — wrapped up over the crown to grip the haft behind the head; TABS both fists together on the upright stick at the waist (ref: secret.bomb_on_a_stick.red.png) (added 502, introduced by 28cf5772 at propBuilder.ts:buildBombStick)
c FAIL (0 since 500)
 1. attack in unit_secret.bomb_on_a_stick_release — throws the bomb as a projectile from 6 m; TABS charges in and smacks the target with the bomb still on the stick (ref: card Characteristics; Weapons "Bludgeon - Melee")
 2. self-destruct in unit_secret.bomb_on_a_stick_flight — the bomber stands unharmed; TABS's blast kills the bomber too (ref: secret.bomb_on_a_stick.png)
d PASS (502 stats)
## Ranked gaps
1. [S] secret.bomb_on_a_stick.c smack — blocker 1: charge into melee and swing the bomb on the stick into the target, no throw — ref: card Characteristics — ours: unit_secret.bomb_on_a_stick_release.png
2. [S] secret.bomb_on_a_stick.b upright carry — blocker 2: shaft upright in front, fists stacked at the waist (POLE_GRIP span for the bomb stick) — ref: secret.bomb_on_a_stick.red.png — ours: unit_secret.bomb_on_a_stick_idle.png
3. [S] secret.bomb_on_a_stick.a hair — blocker 1: shaggy ginger hair with a long back braid — ref: secret.bomb_on_a_stick.red.png — ours: unit_secret.bomb_on_a_stick_idle.png
## Attempts (iter | gap | criterion | verdict)
502 | grip wrap named hpoint, off fist on the haft by _twoHandPole, propBuilder BOMB_STICK (28cf5772) | b | approved (struck 1; added 2: off arm over the crown)
501 | head-high pole topped by a big black bomb, orange bands, lit fuse, BOMB_STICK on the halberd grip (8b3c4a36) | b | approved (no strike: held one-handed)
## Rejected (last 4)
## Notes (max 3 lines)
- 501: weapon is the halberd variant bomb_stick (no fist bomb to clone for the throw); c still throws a bomb projectile.
- 502 DEFECTS: the stick shoulders diagonally behind the head (not _restHalberd: no "haxe" child), so the hpoint span puts the off fist over the crown.
