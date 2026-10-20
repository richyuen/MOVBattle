# farmer.halfling
Status: open   Audited: 375 (re), a 391   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (4 since 388; 1 rejected [S] since 388)
 1. legs in unit_farmer.halfling_idle: the bare shin between the shorts cuff and the foot fur about half the shorts' length, feet almost under the hips - TABS: shins about as long as the shorts, feet well apart (ref: .blue.png, .red.png) [[S] only, no [P] re-splay]
 2. foot fur in _idle: a compact dark-brown tuft now, but small and on the outer side of the ankle - TABS: a tuft across the top of each foot, about its width (ref: .red.png)
 4. shorts in _idle: light team, near the jacket's - TABS: dark team shorts, clearly darker (ref: .blue.png; card)
 (struck 3: the vest V, 391)
b PASS (383)
c PASS (375)
d PASS (cost 50, hp 1.50x, dmg 0.17x, cd 1.50x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a legs - blocker 1: lengthen the bare shin segment (a longer lower leg joint, or the foot set lower below the shorts cuff) so the shin is about as long as the shorts, feet set apart by the stance's hip offset - ref: .blue.png - ours: unit_farmer.halfling_idle.png
2. [S] a foot fur - blocker 2: a shock of 10-14 fanned shards on a pad centred over the instep, as wide as the foot (halflingFootFur) - ref: .red.png - ours: unit_farmer.halfling_idle.png
## Attempts (iter | gap | criterion | verdict)
339-387 | mitts, mop, jacket, shorts, belt, feet, Jump, Grab, coat, sleeves, cuff, belt ring, stance [S]; belt bar [P] | a,b,c | approved
388 | vest cut in a deep V: lower block + two shoulder panels [S] (ad8de9a +e1a75a4 +c549a26) | a | approved (narrowed a.3)
389 | foot fur a compact dark tuft inside the foot (HALFLING_TUFT) [S] (cd0bed8 +b505810) | a | approved (narrowed a.2)
391 | vest one light panel + closed white V slab to the belt, team .3 toward white [S] (6eefbb3) | a | approved (struck a.3)
391 | foot fur rooted on the toe's top face, spread across the instep [S] (bef7e5f) | a | approved (a.2 stands; still lumpy/off-centre)
## Rejected (last 4)
- vest [S] [1] - 390: V to the belt, one-sided faceFront pieces - the white V vanished, a dark gap showed
- foot fur [P] [1] - 390: tuft inX 0, clump .8 - still rooted at the ankle off to the side
## Notes (max 3 lines)
- 391 a.2: the tuft is on the instep now but reads as rounded lumps, narrower than the foot; next is a fan of 10-14 shards on a pad centred on the foot's middle.
- 391 a.4: the shorts are still a light team colour; the card calls them dark team shorts.
- dressHalfling (unitFactory) keeps shorts + feet; coat, sleeves, vest, V, belt are farmerDress halflingJacket; tuft halflingFootFur. Stance HALFLING_STANCE.
