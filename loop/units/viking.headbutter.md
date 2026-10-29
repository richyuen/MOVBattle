# viking.headbutter
Status: open   Audited: 391, 395, 396, 400, 401, 402 (CONFIRM), 407 (CONFIRM)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (0 since 407; the CONFIRM's list)
 1. torso garment in lineup_viking - reads as a grey-brown leather vest/plate over the chest with a hanging flap (the blue idle: a dark navy vest), not the team skin - TABS: a plain team-coloured short-sleeved tunic, red on red team, broken only by a brown belt (ref: viking.headbutter.red.png)
 2. braid colour in unit_viking.headbutter_idle - pale tan/beige rope segments - TABS: copper/ginger-brown braids (ref: viking.headbutter.red.png, .blue.png); colour-only: judge on a --noglow swatch
b PASS (391; CONFIRM 402, 407)
c PASS (401; CONFIRM 402, 407)
d PASS (cost 90, hp 0.69x, dmg 0.25x, cd 0.76x)
## Ranked gaps (the CONFIRM gave none: each criterion's first blocker)
1. [S] a torso - blocker 1: the vest/plate and its hip flap off (HEADBUTTER_KIT, viking_fur preset), the trunk a plain team tunic under the belt - ref: .red.png - ours: lineup_viking.png
## Attempts (iter | gap | criterion | verdict)
392-396 | spiked cap; braids; Headbutt (c); belt, bracers, fur boot cuffs, boots [S] | a,c | approved
400-401 | unlit cream fur + buckle; head-first DIVE + leap + sprawl (c PASS); bracer fur, belt to the waist | a,c | approved
402-405 | HEADBUTTER_CREAM + belt; headSize 1.3 + HEADBUTTER_CAP; band off the eye tops; brawlerLegs | a | approved; CONFIRM 402 failed a
406 | standSquare + legLength 1.22 (e25bd21, reverted) | a | rejected
407 | HEADBUTTER_LEGS: trousers to mid-shin cuffs, short boots; shinLength 1.75, torsoLength .82 (ff93093) | a | approved (struck 2, a PASS); CONFIRM failed a (new list)
## Rejected (last 4)
- legs [S] [1] - 406: upright square stance and legLength 1.22 - belt-to-sole unmoved at 41%: the boots and cuffs take the leg
## Notes (max 3 lines)
- 407 probe: belt at ~50% of his height, cuff tops ~23% (TABS 58%, 25%); the gap critic passed the legs.
- 404 critic (not a blocker): the side flaps stand out as dark blocks at eye level; TABS's cap sides drop flush over the ears.
- 402: HEADBUTTER_KIT beltTall .44 at -.4; HEADBUTTER_CREAM (0.8,0.6,0.35) cloth self-lit .42.
