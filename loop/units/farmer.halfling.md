# farmer.halfling
Status: open   Audited: 375 (re), a 391, 397, 398   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (6 since 388; 1 rejected [S] since 388)
 1. legs in unit_farmer.halfling_idle: the forward shin is a real bare segment on a nearly straight knee but still shorter than the shorts, and the feet are a walk stride, not well apart - TABS: shins about as long as the shorts, feet planted well outside the hips (ref: .blue.png, .red.png) [[S] only, no [P] re-splay]
 2. foot fur in _idle: still a small dark lump on the outer ankle - TABS: a tuft across the top of each foot, about its width (ref: .red.png)
 4. shorts in _idle: still light team blue, near the jacket's - TABS: dark team shorts, clearly darker (ref: .blue.png; card)
 5. shin length in _idle: now reads LONGER than the shorts, about twice them - TABS: shins about as long as the shorts (ref: .blue.png) (added 398)
 6. feet in _idle: the right foot still sits nearer the camera than the left - TABS: both feet level side by side (ref: .blue.png) (added 398)
 (struck 3: the vest V, 391)
b PASS (383)
c PASS (375)
d PASS (cost 50, hp 1.50x, dmg 0.17x, cd 1.50x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a foot fur - blocker 2: a tuft strip across each boot top, about its width - ref: .red.png - ours: unit_farmer.halfling_idle.png
2. [S] a shorts hem - blocker 5: the shorts' leg reaches lower on the thigh so the bare shin reads at the shorts' length again (the 398 overshoot) - ref: .blue.png - ours: unit_farmer.halfling_idle.png
## Attempts (iter | gap | criterion | verdict: approved, rejected, rejected-kept, dropped)
339-391 | mitts, mop, jacket, shorts, belt, feet, Jump, Grab, coat, sleeves, cuff, belt ring, stance, vest, foot fur [S]; belt bar [P] | a,b,c | approved
397 | shinLength 1.5 lower leg + hip offset .22 -> .34, knee .02 (4fe6fd1) | a | approved (a.1 narrowed)
398 | shinLength 1.95 + a planted wide stance (.52 splay, .34 turned back at the knee) (58a4a23) | a | approved (a.1 stands; added 5, 6)
## Rejected (last 4)
- vest [S] [1] - 390: V to the belt, one-sided faceFront pieces - the white V vanished, a dark gap showed
- foot fur [P] [1] - 390: tuft inX 0, clump .8 - still rooted at the ankle off to the side
- stance [P] [2] - spent (HALFLING_STANCE row, ledger)
## Notes (max 3 lines)
- 398: shinLength 1.95 (bodyBuilder), HALFLING_STANCE spread .52 with .34 of the splay turned back at the knee so the soles lie flat; the idle sink follows the effective leg angle.
- 398 critic: the feet are now planted well apart with flat soles, but the shin overshoots the shorts and the right foot still sits nearer the camera.
- dressHalfling (unitFactory) keeps shorts + feet; coat, sleeves, vest, V, belt are farmerDress halflingJacket; tuft halflingFootFur. Stance HALFLING_STANCE.
