# viking.jarl
Status: open   Audited: 391, 396   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (1 since 391; 1 rejected [S] since 391) [plateau]
 1. bear pelt in unit_viking.jarl_idle — TABS: a bear-head hood with two googly eyes and teeth, the brown fur draping to the hips (ref: .jpg, .red.png, card "most notable"); ours: no pelt, a blue horned helm over a barrel torso
 2. beard in _idle/_windup — TABS: a large brown braided beard tied at the end (ref: .jpg, .red.png); ours: the thin brown cone nose, no beard
 3. chest/arms in _idle — TABS: a shirtless chest with maroon arm wraps and fur wrist cuffs (ref: .jpg, .red.png); ours: a blue tunic with a V panel and bare blue forearms
 4. legs in _flight — TABS: puffy team pants with big cream fur calf cuffs and brown boots (ref: .red.png); ours: slim blue pants and plain blue boots
b PASS (392)
c PASS (396)
d PASS (cost 1500, hp 13.81x, dmg 2.50x, cd 1.24x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [R] a bear-head hood - blocker 1: a bear skull with googly eyes and teeth, brown fur to the hips, the horned helm off (curtainAhead <= 0, curtainOut >= 1.0, eyes .26 H on the skull's front, a short centred snout with nose and teeth) - ref: .jpg - ours: unit_viking.jarl_idle.png
2. [S] a beard - blocker 2: a large brown braided beard tied at the end - ref: .jpg - ours: unit_viking.jarl_idle.png
3. [S] a chest/arms - blocker 3: shirtless chest, maroon arm wraps, fur wrist cuffs - ref: .red.png - ours: unit_viking.jarl_idle.png
4. [S] a legs - blocker 4: puffy team pants, cream calf cuffs, brown boots - ref: .red.png - ours: unit_viking.jarl_flight.png
## Attempts (iter | gap | criterion | verdict)
392 | Jarl Axe: long haft, dark bearded crescent, bronze collar, two fists (halberd type) (0b6bed2 + 92c5442) | b | approved (b PASS)
393 | bear-head hood and fur drape, horned helm off (JARL_PELT) (b7b4463 + 1df50c9) | a | approved (no strike: a.1 stands)
394 | bear pelt retry: rounded skull, eyes on its front, curtains, rounded shoulder mass (df2b922 + bae3bb7 + a5904a5, reverted 1ec0c3a) | a | rejected
396 | his own chop: lands .42 m under the crown, trunk pitched, off foot deeper (6b98556) | c | approved (c PASS)
## Rejected (last 4)
- bear pelt retry [S] [2] - 394: a rounded fur skull with googly eyes on its front, curtains, a rounded shoulder mass - the near curtain stood in front of his face and hid the eyes; the snout read as a pale block off to one side
## Notes (max 3 lines)
- 396: CHOP_JARL (below .42, pitch .52, step -.56) found by the bear pelt's skull; the release shows both fists on the haft with the axe head at the man's helmet, the struck frame has him down.
- a.1's next attempt follows the critic's recipe in Ranked gap 1 with the curtain BEHIND the face plane; the 394 reverted to the 393 pelt (a flat crate).
- JARL_PELT: head-frame e for the skull, torso W/H/D + shoulderW for the pelt.
