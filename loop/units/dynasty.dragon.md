# dynasty.dragon
Status: open   Audited: 411, 419 (CONFIRM), 420 (RE-AUDIT a, b, c)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (2 since 420)
 3. carrier clothing in unit_dynasty.dragon_idle: plain team boxes, no trim - TABS: a Chinese tunic and trousers edged orange at collar, cuffs and hem (ref: dynasty.dragon.blue.png)
 4. muzzle in unit_dynasty.dragon_idle: a smooth team ball sitting on a flat box jaw, plain pink from brow to lip - TABS: a squared snout with a tan rim along the upper lip and gold diamond markings on the cheeks (ref: dynasty.dragon.red.png)
 5. body in lineup_dynasty: a level hairline band whose pale edge discs stand taller than the band itself, so from the side the body reads as a string of discs on a stick - TABS: the ribbon hangs on edge from the poles, a broad band from the side with the scallops a small fringe along its lower edge (ref: dynasty.dragon.jpg) (added 421, 0a4f9754)
  (struck 1 at 420; 2 at 421)
b FAIL (0 since 420)
 1. rear poles in unit_dynasty.dragon_idle: end in black stumps on the headless torsos, no hands on them - TABS: each carrier grips his pole with both hands at chest height (ref: dynasty.dragon.jpg)
 2. front pole in unit_dynasty.dragon_windup: hangs beside the running carrier, both his arms swinging free of it - TABS: he keeps a two-handed hold on it as he walks (ref: dynasty.dragon.jpg)
 3. front pole in unit_dynasty.dragon_idle: team blue - TABS: orange-red with a dark wrapped grip like the three behind it (ref: dynasty.dragon.jpg)
c PASS (421: opaque white plume with yellow lobes, ba799e89 + 8027d61c; burning man 419)
d PASS (cost 1000, hp 18.78x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] b carrier grip - blocker 1: the pole's foot lowered to the carrier's chest, both arms as two boxes each in the trouser shade up to fists on the pole (dragonForm carrier) - ref: dynasty.dragon.jpg - ours: unit_dynasty.dragon_idle
2. [S] a ribbon on edge - blocker 5: the band built with its width vertical (.6 h tall, tapering), scallops a small fringe on the lower edge, fins on the top edge - ref: dynasty.dragon.jpg - ours: lineup_dynasty, unit_dynasty.dragon_windup
## Attempts (iter | gap | criterion | verdict)
416-419 | FLAME_JET, DRAGON_FORM, DRAGON_CARRIER, [P] poles, BODY_FLAMES | a,b,c | approved; CONFIRM 419 failed a, b, c
420 | carrier heads, poles beside them (0f7dd79c) | a | approved (struck 1)
421 | FLAME_JET plume (ba799e89, 8027d61c) | c | approved (c PASS)
421 | DRAGON_FORM flat band (0a4f9754, 87e08299) | a | approved (struck 2; added 5)
421 | [P] fists skin .12/.1 (91a86b90, reverted) | b | rejected
## Rejected (last 4)
- fists in skin, .12/.1 [P] [1] - 421: ledger reversal of the 420 DRAGON_CARRIER row
## Notes (max 3 lines)
- 421 critic: the band lies level, .05 h thick: from the ground only the scallops show (TABS hangs it on edge). The b fix is a pose: pole foot at the chest, two-box arms in the trouser shade.
- 421 critic: yellow lobes near half the plume ([P] FLAME_JET.lobe .4 on offer). 420: framed by his mesh top (rig 5.70 m).
