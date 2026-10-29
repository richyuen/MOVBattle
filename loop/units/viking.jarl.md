# viking.jarl
Status: open   Audited: 391, 396, 400, 401, 402, 403 (re-audit a), 406 (CONFIRM)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (1 since 406; the CONFIRM's list, struck 1 at 407)
 2. bear head in unit_viking.jarl_idle: a small brown cap with stub ears, no snout, googly eyes or fangs above the face - TABS: a large bear head sits on top of the head, with googly eyes and fangs overhanging the face (ref: viking.jarl.red.png, card Appearance)
 3. beard in unit_viking.jarl_idle: a short brown chin beard - TABS: a long braided beard hanging to mid-chest, tied with a band (ref: viking.jarl.red.png)
 4. knee trim in unit_viking.jarl_idle: thick white fur rolls at the knees - TABS: tan cloth wraps on the shins above brown leather boots (ref: viking.jarl.red.png, card Appearance)
  (struck 1 at 407: long fur flaps down the front to the belt)
b FAIL (1 since 406; the CONFIRM's list, struck 1 at 407)
 2. carry pose in unit_viking.jarl_idle: the haft stands vertical in front of the face - TABS: the haft is held two-handed diagonally across the body, head out to the side (ref: viking.jarl.red.png)
  (struck 1 at 407: a dark steel crescent bearded blade)
c PASS (396; CONFIRM 406)
d PASS (cost 1500, hp 13.81x, dmg 2.50x, cd 1.24x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] b carry pose - blocker 2: a two-handed diagonal haft across the hips, head out to his right (proceduralAnimation jarl idle carry) - ref: viking.jarl.red.png - ours: unit_viking.jarl_idle.png
2. [S] a bear head - blocker 2: a large bear head on top, with snout, googly eyes and fangs over the brow (vikingDress jarlPelt hood) - ref: viking.jarl.red.png - ours: unit_viking.jarl_idle.png
## Attempts (iter | gap | criterion | verdict)
392-396 | Jarl Axe (b PASS); bear hood + drape; pelt retry (394 rejected); his own chop (c PASS) | a,b,c | approved
400-405 | [R] bear-head hood; curtains + strips; JARL_BEARD + _RUN; JARL_WRAPS; brawlerLegs | a | approved
406 | JARL_BELT: belt + round buckle; mantle and tunicSkirt off (293835c) | a | approved (struck 2, a PASS); CONFIRM failed a, b (new lists)
407 | JARL_CRESCENT: dark steel crescent blade, honed band (f6b95a5) | b | approved (struck 1)
407 | JARL_FLAPS: shoulder caps + long front flaps to the belt; jarlPeltSide and chest strips gone (4859953 + 22d7ed7) | a | approved (struck 1)
## Rejected (last 4)
- bear pelt retry [S] [2] - 394: a rounded fur skull with googly eyes on its front, curtains, a rounded shoulder mass - the near curtain stood in front of his face and hid the eyes
## Notes (max 3 lines)
- 407 critic: the flaps start at separate shoulder caps apart from the hood's curtains (two pieces), and in lineup they cover most of the torso like a vest; the honed band does not show; the upright haft turns the blade edge-on in the idle.
- 406 gap critic: the red-team bare chest renders dull tan-brown in lineup_viking (the ice archer's a.2 torso tint under viking_fur).
- 401: JARL_PELT curtainFoot -1.1. 396: CHOP_JARL.
