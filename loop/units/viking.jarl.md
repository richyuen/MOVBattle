# viking.jarl
Status: open   Audited: 391   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (1 since 391; 1 rejected [S] since 391)
 1. bear pelt in unit_viking.jarl_idle — TABS: a bear-head hood with two googly eyes and teeth, the brown fur draping to the hips (ref: .jpg, .red.png, card "most notable"); ours: no pelt, a blue horned helm over a barrel torso
 2. beard in _idle/_windup — TABS: a large brown braided beard tied at the end (ref: .jpg, .red.png); ours: the thin brown cone nose, no beard
 3. chest/arms in _idle — TABS: a shirtless chest with maroon arm wraps and fur wrist cuffs (ref: .jpg, .red.png); ours: a blue tunic with a V panel and bare blue forearms
 4. legs in _flight — TABS: puffy team pants with big cream fur calf cuffs and brown boots (ref: .red.png); ours: slim blue pants and plain blue boots
b PASS (392)
c FAIL (0 since 391)
 1. the strike in _release/_struck — TABS: the two-handed bearded poleaxe swung down and connects (ref: .jpg, card Jarl Axe); ours: a one-handed greatsword chop whose blade is planted in the ground beside the downed target
d PASS (cost 1500, hp 13.81x, dmg 2.50x, cd 1.24x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a bear pelt - blocker 1: curtains behind the face (curtainAhead <= 0, curtainOut >= 1.0), googly eyes .26 high on the skull's FRONT, a short centred snout with nose and teeth (jarlPelt) - ref: .jpg - ours: unit_viking.jarl_idle.png
2. [S] a beard - blocker 2: a large brown braided beard tied at the end - ref: .jpg - ours: unit_viking.jarl_idle.png
3. [S] a chest/arms - blocker 3: shirtless chest, maroon arm wraps, fur wrist cuffs - ref: .red.png - ours: unit_viking.jarl_idle.png
4. [S] a legs - blocker 4: puffy team pants, cream calf cuffs, brown boots - ref: .red.png - ours: unit_viking.jarl_flight.png
5. [S] c strike - blocker 1: a two-handed overhead poleaxe chop onto the target - ref: .jpg - ours: unit_viking.jarl_release.png
## Attempts (iter | gap | criterion | verdict: approved, rejected, rejected-kept, dropped)
392 | Jarl Axe: long haft, dark bearded crescent, bronze collar, two fists (halberd type) [S] (0b6bed2 + 92c5442) | b | approved (b PASS)
393 | bear-head hood and fur drape, horned helm off (JARL_PELT) [S] (b7b4463 + 1df50c9) | a | approved (no strike: a.1 stands)
394 | bear pelt retry: rounded skull, eyes on its front, curtains, rounded shoulder mass [S] (df2b922 + bae3bb7 + a5904a5, reverted 1ec0c3a) | a | rejected
## Rejected (last 4)
- bear pelt retry [S] [2] - 394: a rounded fur skull with googly eyes on its front, curtains, a rounded shoulder mass - the near curtain stood in front of his face and hid the eyes; the snout read as a pale block off to one side
## Notes (max 3 lines)
- 394: reverted to the 393 pelt (a flat crate); the next attempt follows the critic's recipe in Ranked gap 1 with the curtain BEHIND the face plane.
- c.1 text predates the halberd chop: re-check _struck before picking it.
- JARL_PELT: head-frame e for the skull, torso W/H/D + shoulderW for the pelt.
