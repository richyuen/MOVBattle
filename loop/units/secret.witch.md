# secret.witch
Status: open   Audited: 527 (AUDIT x2)   Done: -
## Verdicts
a FAIL (1 since 527, 2 struck)
 1. Body in unit_secret.witch_idle is a team-skinned humanoid — TABS: a Stiffy skeleton of cream bones under the clothes (ref: secret.witch.red.png; card Appearance "looks like a Stiffy")
 4. No robe in unit_secret.witch_idle — TABS: a tattered dark team robe/tunic with a lighter team sash and belt (ref: secret.witch.red.png)
 5. She stands on her feet in unit_secret.witch_idle — TABS: she rides a long floating broom that hangs below her between the legs (ref: secret.witch.red.png, secret.witch.png; card Appearance)
 6. Legs in unit_secret.witch_idle are full team legs in boots — TABS: trousers torn off above the knee over bare bone shins, with sandals (ref: secret.witch.red.png)
b FAIL (1 since 527, 1 struck)
 2. Staff shaft in unit_secret.witch_windup is a smooth straight grey-brown pipe — TABS: a knobbly brown wooden staff with lashed bindings under the mushroom (ref: secret.witch.red.png)
c FAIL (2 since 527, 2 struck)
 3. The struck target in unit_secret.witch_struck only gets a pink head glow — TABS: mushrooms grow on the victim, which turns on its allies while poisoned (ref: card Characteristics)
d PASS (534 stats)
## Ranked gaps
1. [S] secret.witch.c mushrooms on the victim — blocker 3: on a mushroom_spell hit, small magenta toadstools on his head and shoulders for the poison's length, his targeting flipped to his allies — ref: card Characteristics — ours: unit_secret.witch_struck
2. [S] secret.witch.a broom — blocker 5: a long dark-wood broom floating under her between the legs, seated pose — ref: secret.witch.red.png — ours: unit_secret.witch_idle
3. [S] secret.witch.a Stiffy body — blocker 1: one SKELETON_UNITS entry, cream bone under the clothes — ref: secret.witch.red.png — ours: unit_secret.witch_idle
4. [S] secret.witch.a robe — blocker 4: dark tattered team tunic with a pale sash and belt in secretDress — ref: secret.witch.red.png — ours: unit_secret.witch_idle
5. [S] secret.witch.b branch — blocker 2: crooked branch with 2-3 bends, paler rope wraps on the visible upper third — ref: secret.witch.red.png — ours: unit_secret.witch_windup
## Attempts (iter | gap | criterion | verdict)
534 | mushroom spell missile: spotted magenta toadstool in a violet aura, MUSHROOM_SPELL (bb0b15da) | c | approved (struck 2)
530 | brimless team hood-hat, crooked spire, WITCH_HOOD (69d439c2, 03b0aab4) | a | approved (struck 2; 3 by lineup)
530 | [P] WITCH_STAFF thick .04->.07, ropeAt .06->.12 (1553b2ba) | b | approved (no strike)
529 | two clones side by side, 8 s life, max 2 (ae04607c) | c | approved (struck 1)
528 | Witch Staff: knobbly lashed branch, team mushroom cap, WITCH_STAFF (69681de4) | b | approved (struck 1)
## Rejected (last 4)
## Notes (max 3 lines)
- 529: the clones copy her look and her missile, so every a and c fix reaches them too.
- 530 critic: the hood is a straight-sided drum and the spire's kinks do not show (TABS soft tapering hood).
- 530 critic: the staff's rope wraps still hide behind the hat spire in _windup. b starves after 535.
