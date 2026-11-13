# secret.witch
Status: open   Audited: 527 (AUDIT x2)   Done: -
## Verdicts
a FAIL (2 since 527, 4 struck)
 4. No robe in unit_secret.witch_idle — TABS: a tattered dark team robe/tunic with a lighter team sash and belt (ref: secret.witch.red.png)
 5. She stands on her feet in unit_secret.witch_idle — TABS: she rides a long floating broom that hangs below her between the legs (ref: secret.witch.red.png, secret.witch.png; card Appearance)
b PASS (535: struck 2, crooked lashed branch)
c FAIL (2 since 527, 2 struck)
 3. The struck target in unit_secret.witch_struck only gets a pink head glow — TABS: mushrooms grow on the victim, which turns on its allies while poisoned (ref: card Characteristics)
d PASS (535 stats)
## Ranked gaps
1. [S] secret.witch.a broom — blocker 5: a long dark floating broom under her between the legs, bristle end hanging behind, her seated on it and lifted off the ground (witchBroom in secretDress) — ref: secret.witch.red.png — ours: unit_secret.witch_idle
2. [S] secret.witch.a robe — blocker 4: tattered dark team robe over the ribs with a lighter sash and belt — ref: secret.witch.red.png — ours: unit_secret.witch_idle
3. [S] secret.witch.c mushrooms on the victim — blocker 3: on a mushroom_spell hit, small magenta toadstools on his head and shoulders for the poison's length, his targeting flipped to his allies — ref: card Characteristics — ours: unit_secret.witch_struck
## Attempts (iter | gap | criterion | verdict)
535 | Stiffy body, SKELETON_UNITS (a156627c) | a | approved (struck 1, 6)
535 | crooked staff, three kinks, pale tan cord criss-cross over the upper third, WITCH_STAFF (cbb156f0) | b | approved (struck 2, b PASS)
534 | mushroom spell missile, MUSHROOM_SPELL (bb0b15da) | c | approved (struck 2)
530 | brimless team hood-hat, crooked spire, WITCH_HOOD (69d439c2, 03b0aab4) | a | approved (struck 2; 3 by lineup)
528-530 | two clones; Witch Staff WITCH_STAFF; [P] staff thick/ropeAt | b, c | approved
## Rejected (last 4)
## Notes (max 3 lines)
- 529: the clones copy her look and her missile, so every a and c fix reaches them too.
- 535 critic: dressSkeleton gives her a ragged team piece hip to knee and a team flap behind; ribs bare. Staff kinks mild at idle distance.
- 530 critic: the hood is a straight-sided drum and the spire's kinks do not show (TABS soft tapering hood). c starves after 539.
