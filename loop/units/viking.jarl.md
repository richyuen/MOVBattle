# viking.jarl
Status: open   Audited: 391, 396, 400   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (2 since 391; 1 rejected [S], 1 approved [R] since 391)
 2. beard in _idle/_windup - TABS: a large brown braided beard tied at the end (ref: .jpg, .red.png); ours: the thin brown cone nose, no beard
 3. chest/arms in _idle - TABS: a shirtless chest with maroon arm wraps and fur wrist cuffs (ref: .jpg, .red.png); ours: a blue tunic with a V panel and bare blue forearms
 4. legs in _flight - TABS: puffy team pants with big cream fur calf cuffs and brown boots (ref: .red.png); ours: slim blue pants and plain blue boots
 5. pelt drape in unit_viking.jarl_idle - TABS: brown fur curtains from the bear head down to the hips (ref: .red.png, .jpg); ours: side flaps end at the shoulders and the shoulder fur is boxy pads that stop at the chest (added 400)
  (struck 1 at 400: the bear-head hood - two googly eyes, a centred snout, teeth, the horned helm off)
b PASS (392)
c PASS (396)
d PASS (cost 1500, hp 13.81x, dmg 2.50x, cd 1.24x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a pelt drape - blocker 5: fur curtains from the hood down to the hips - ref: .red.png - ours: unit_viking.jarl_idle.png
2. [S] a beard - blocker 2: a large brown braided beard tied at the end - ref: .jpg - ours: unit_viking.jarl_idle.png
3. [S] a chest/arms - blocker 3: shirtless chest, maroon arm wraps, fur wrist cuffs - ref: .red.png - ours: unit_viking.jarl_idle.png
4. [S] a legs - blocker 4: puffy team pants, cream calf cuffs, brown boots - ref: .red.png - ours: unit_viking.jarl_flight.png
## Attempts (iter | gap | criterion | verdict)
392 | Jarl Axe: long haft, dark bearded crescent, bronze collar, two fists (halberd type) (0b6bed2 + 92c5442) | b | approved (b PASS)
393 | bear-head hood and fur drape, horned helm off (JARL_PELT) (b7b4463 + 1df50c9) | a | approved (no strike: a.1 stands)
394 | bear pelt retry: rounded skull, eyes on its front, curtains, rounded shoulder mass (df2b922 + bae3bb7 + a5904a5, reverted 1ec0c3a) | a | rejected
396 | his own chop: lands .42 m under the crown, trunk pitched, off foot deeper (6b98556) | c | approved (c PASS)
400 | [R] bear-head hood rebuilt from the skull down (f80dd04) | a | approved (struck 1; added 5)
## Rejected (last 4)
- bear pelt retry [S] [2] - 394: a rounded fur skull with googly eyes on its front, curtains, a rounded shoulder mass - the near curtain stood in front of his face and hid the eyes; the snout read as a pale block off to one side
## Notes (max 3 lines)
- 400: JARL_PELT skull 1.3W/.95H/1.3D of the head at .58 H, eyes .24 at .6 H on the front (.eyeProud 1.2), muzzle .44W tipped .34 with a nose and 3 teeth, ears .2 at .85 W/1.3 H, curtains .3W x .8D at 1.12 W and z -.16, drapeDrop 1.0.
- 400 critic: the hood now reads (eyes, snout, teeth); the curtain/fur must reach the hips - the shoulder panels still read as boxy pads that stop at the chest.
- 396: CHOP_JARL (below .42, pitch .52, step -.56). JARL_PELT: head-frame e for the skull, torso W/H/D + shoulderW for the pelt.
