# viking.jarl
Status: open   Audited: 391, 396, 400, 401, 402, 403 (re-audit a), 406 (CONFIRM)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (2 since 406; the CONFIRM's list, struck 1 at 407, 2 at 408)
 3. beard in unit_viking.jarl_idle: a short brown chin beard - TABS: a long braided beard hanging to mid-chest, tied with a band (ref: viking.jarl.red.png)
 4. knee trim in unit_viking.jarl_idle: thick white fur rolls at the knees - TABS: tan cloth wraps on the shins above brown leather boots (ref: viking.jarl.red.png, card Appearance)
  (struck 1 at 407: long fur flaps down the front; struck 2 at 408: a bear head on top with eyes, snout and fangs)
b PASS (408; struck 1 at 407, 2 at 408)
c PASS (396; CONFIRM 406)
d PASS (cost 1500, hp 13.81x, dmg 2.50x, cd 1.24x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a long beard - blocker 3: a braided plait from the chin to mid-chest with a band, torso-hung clear of the haft (vikingDress JARL_BEARD_RUN) - ref: viking.jarl.red.png - ours: unit_viking.jarl_idle.png
2. [S] a shin wraps - blocker 4: tan cloth shin wraps over brown boots in place of the knee fur rolls - ref: viking.jarl.red.png - ours: unit_viking.jarl_idle.png
3. [P] b fallout of the 408 JARL_REST [S]: JARL_REST.across .95 -> 1.15, a flatter carry, blade clear of the chin - shows in unit_viking.jarl_idle.png
## Attempts (iter | gap | criterion | verdict)
392-396 | Jarl Axe (b PASS); bear hood + drape; pelt retry (394 rejected); his own chop (c PASS) | a,b,c | approved
400-406 | [R] bear-head hood; curtains + strips; JARL_BEARD + _RUN; JARL_WRAPS; brawlerLegs; JARL_BELT | a | approved; CONFIRM 406 failed a, b
407 | JARL_CRESCENT dark steel crescent (f6b95a5) | b | approved (struck 1)
407 | JARL_FLAPS shoulder caps + front flaps (4859953 + 22d7ed7) | a | approved (struck 1)
408 | bear head raised and enlarged: high googly eyes, snout, nose, fangs clear of his eyes (1bc6d8d) | a | approved (struck 2)
408 | JARL_REST: diagonal two-handed rest through _restHalberd, blade broadside (e6d2ba3 + f25a459) | b | approved (struck 2, b PASS)
## Rejected (last 4)
- bear pelt retry [S] [2] - 394: a rounded fur skull with googly eyes on its front, curtains, a rounded shoulder mass - the near curtain stood in front of his face and hid the eyes
## Notes (max 3 lines)
- 408: the axe rests through _restHalberd (it stands the shaft in the world), not the carry attitude; 408.6's attitude branch had no effect.
- 408 critic: the bear head reads as a small perched head with no pelt down his back; 407: the flaps cover most of the torso like a vest.
- 406: the red-team bare chest renders tan-brown in lineup_viking (viking_fur trunk tint).
