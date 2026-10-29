# ancient.zeus
Status: done   Audited: 378, 398, 399, 400, 406 (CONFIRM)   Done: 406
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a PASS (406; CONFIRM 406)
  (struck 1 at 387: the beard; struck 2 at 385: the toga; 3 at 406: the bolt seated clear of the beard's foot)
b PASS (384; CONFIRM 406)
c PASS (386; CONFIRM 406)
d PASS (cost 2000, hp 14.04x, dmg 0.55x, cd 0.76x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
## Attempts (iter | gap | criterion | verdict)
379-389 | beard + locks; thrown bolt, REARM, SPARK, sandals, chain (c PASS 386); toga (385); ZEUS_BEARD (387); toga fill, one-sided drape (388-389) [S] | a,b,c | approved
391-400 | [R] waist bands + flat bolt (391 rejected); [R] toga trim rebuilt (398); orange-gold at .55 (399 rejected); emblem high, unlit gold (400) | a | mixed
405 | emblem links in render group 1, drawn after the glow merge (7738aea) | a | approved (colour clause struck)
406 | zeusBeardFootInTorso: emblem top .boltGap .08 under the beard's measured foot (31197fe) | a | approved (struck 3, a PASS); CONFIRM agreed -> done
## Rejected (last 4)
- toga trim [R] [1] - 391: three waist bands, a flat gold bolt, a white skirt - the bolt a pale sliver under the beard, the bands khaki
- toga trim [S] [1] - 399: orange-gold + top .1 lower + 7.5 cm stand-off - still dusty pink-grey beside the belt, the hand's bloom veils its lower half
## Notes (max 3 lines)
- 406 critics (not blockers): the emblem now sits low by the belt, behind the lowered fist; TABS has it high on the shoulder strap.
- 405: runtimeUnit.ts:1053 resets a flung body's meshes to render group 0 on landing, so a flung Zeus loses the emblem's group 1 (a small guard owed).
- Look from the iconic_zeus preset; toga ancientDress dressZeusToga + zeusLegs.
