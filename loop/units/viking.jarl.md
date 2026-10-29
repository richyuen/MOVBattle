# viking.jarl
Status: open   Audited: 391, 396, 400, 401, 402, 403 (re-audit a), 406 (CONFIRM)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (0 since 406; the CONFIRM's list)
 1. bear pelt in unit_viking.jarl_idle: two flat rectangular brown slabs standing on the shoulders like a backpack - TABS: the pelt hangs from the bear head over both shoulders as long fur flaps down the front to the belt, framing the chest (ref: viking.jarl.red.png)
 2. bear head in unit_viking.jarl_idle: a small brown cap with stub ears, no snout, googly eyes or fangs above the face - TABS: a large bear head sits on top of the head, with googly eyes and fangs overhanging the face (ref: viking.jarl.red.png, card Appearance)
 3. beard in unit_viking.jarl_idle: a short brown chin beard - TABS: a long braided beard hanging to mid-chest, tied with a band (ref: viking.jarl.red.png)
 4. knee trim in unit_viking.jarl_idle: thick white fur rolls at the knees - TABS: tan cloth wraps on the shins above brown leather boots (ref: viking.jarl.red.png, card Appearance)
b FAIL (0 since 406; the CONFIRM's list)
 1. Jarl Axe head in unit_viking.jarl_idle: a rounded oval blue-grey paddle - TABS: a crescent bearded axe blade, dark steel (ref: viking.jarl.jpg)
 2. carry pose in unit_viking.jarl_idle: the haft stands vertical in front of the face - TABS: the haft is held two-handed diagonally across the body, head out to the side (ref: viking.jarl.red.png)
c PASS (396; CONFIRM 406)
d PASS (cost 1500, hp 13.81x, dmg 2.50x, cd 1.24x)
## Ranked gaps (the CONFIRM gave none: each criterion's first blocker)
1. [S] a pelt - blocker 1: the side slabs (jarlPeltSide) replaced by long fur flaps from the bear head down the chest front to the belt - ref: .red.png - ours: unit_viking.jarl_idle.png
2. [S] b axe head - blocker 1: a dark steel crescent bearded blade on the Jarl Axe (propBuilder JARL_AXE) - ref: .jpg - ours: unit_viking.jarl_windup.png
## Attempts (iter | gap | criterion | verdict)
392-396 | Jarl Axe (b PASS); bear hood + drape (393); bear pelt retry (394 rejected); his own chop (c PASS) | a,b,c | approved
400-403 | [R] bear-head hood (f80dd04); pelt curtains + mantle + chest strips (fd578de); JARL_BEARD (03c2cf1); JARL_BEARD_RUN (76b6c7d) | a | approved
404-405 | JARL_WRAPS maroon forearm wraps + elbow fur (9e3df06); brawlerLegs (a3fb035) | a | approved
406 | JARL_BELT: belt + round buckle; mantle and tunicSkirt off (293835c) | a | approved (struck 2, a PASS); CONFIRM failed a, b (new lists)
## Rejected (last 4)
- bear pelt retry [S] [2] - 394: a rounded fur skull with googly eyes on its front, curtains, a rounded shoulder mass - the near curtain stood in front of his face and hid the eyes
## Notes (max 3 lines)
- 406 gap critic: the red-team bare chest renders dull tan-brown in lineup_viking, unlike the pink arms (the ice archer's a.2 torso tint under viking_fur); the buckle is half hidden by the shaft fist in the idle.
- 403 evidence (88e3f00): lineup_viking stands him clear of the longship's hull.
- 401: JARL_PELT curtainFoot -1.1, torso jarlPeltChest strips. 396: CHOP_JARL.
