# farmer.halfling
Status: open   Audited: 375 (re), a 391, 397   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (5 since 388; 1 rejected [S] since 388)
 1. legs in unit_farmer.halfling_idle: the forward shin is a real bare segment on a nearly straight knee but still shorter than the shorts, and the feet are a walk stride, not well apart - TABS: shins about as long as the shorts, feet planted well outside the hips (ref: .blue.png, .red.png) [[S] only, no [P] re-splay]
 2. foot fur in _idle: still a small dark lump on the outer ankle - TABS: a tuft across the top of each foot, about its width (ref: .red.png)
 4. shorts in _idle: still light team blue, near the jacket's - TABS: dark team shorts, clearly darker (ref: .blue.png; card)
 (struck 3: the vest V, 391)
b PASS (383)
c PASS (375)
d PASS (cost 50, hp 1.50x, dmg 0.17x, cd 1.50x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a legs - blocker 1: lengthen the lower-leg segment past shinLength 1.5 and plant both feet in a wide A-stance in _idle, not a walk stride (bodyBuilder shinLength + the idle plant) - ref: .blue.png - ours: unit_farmer.halfling_idle.png
2. [S] a foot fur - blocker 2: a tuft across the top of each foot, about its width - ref: .red.png - ours: unit_farmer.halfling_idle.png
## Attempts (iter | gap | criterion | verdict: approved, rejected, rejected-kept, dropped)
339-387 | mitts, mop, jacket, shorts, belt, feet, Jump, Grab, coat, sleeves, cuff, belt ring, stance [S]; belt bar [P] | a,b,c | approved
388 | vest cut in a deep V: lower block + two shoulder panels [S] (ad8de9a +e1a75a4 +c549a26) | a | approved (narrowed a.3)
389 | foot fur a compact dark tuft inside the foot (HALFLING_TUFT) [S] (cd0bed8 +b505810) | a | approved (narrowed a.2)
391 | vest one light panel + closed white V slab to the belt, team .3 toward white [S] (6eefbb3) | a | approved (struck a.3)
391 | foot fur rooted on the toe's top face, spread across the instep [S] (bef7e5f) | a | approved (a.2 stands; still lumpy/off-centre)
397 | shinLength 1.5 lower leg + hip offset .22 -> .34, knee .02 (4fe6fd1) | a | approved (a.1 narrowed)
## Rejected (last 4)
- vest [S] [1] - 390: V to the belt, one-sided faceFront pieces - the white V vanished, a dark gap showed
- foot fur [P] [1] - 390: tuft inX 0, clump .8 - still rooted at the ankle off to the side
## Notes (max 3 lines)
- 397: bodyBuilder BodyProportions.shinLength (optional, on top of legLength) stretches the lower leg only; the halfling is 1.5. HALFLING_STANCE spread .34, knee .02.
- 397 critic: the feet are still a walk stride, not planted wide; the shorts are still light team.
- dressHalfling (unitFactory) keeps shorts + feet; coat, sleeves, vest, V, belt are farmerDress halflingJacket; tuft halflingFootFur. Stance HALFLING_STANCE.
