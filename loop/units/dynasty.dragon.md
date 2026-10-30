# dynasty.dragon
Status: open   Audited: 411, 419 (CONFIRM), 420 (RE-AUDIT a, b, c)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (3 since 420)
 3. carrier clothing in unit_dynasty.dragon_idle: plain team boxes, no trim - TABS: a Chinese tunic and trousers edged orange at collar, cuffs and hem (ref: dynasty.dragon.blue.png)
 4. muzzle in unit_dynasty.dragon_idle: a smooth team ball sitting on a flat box jaw, plain pink from brow to lip - TABS: a squared snout with a tan rim along the upper lip and gold diamond markings on the cheeks (ref: dynasty.dragon.red.png)
  (struck 1 at 420; 2 at 421; 5 at 422)
b FAIL (1 since 420)
 2. front pole in unit_dynasty.dragon_windup: hangs beside the running carrier, both his arms swinging free of it - TABS: he keeps a two-handed hold on it as he walks (ref: dynasty.dragon.jpg)
 3. front pole in unit_dynasty.dragon_idle: team blue - TABS: orange-red with a dark wrapped grip like the three behind it (ref: dynasty.dragon.jpg)
  (struck 1 at 422)
c PASS (421: opaque white plume with yellow lobes, ba799e89 + 8027d61c; burning man 419)
d PASS (cost 1000, hp 18.78x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] b front carrier grip - blocker 2: DRAGON_CARRIER two-box arms and stacked fists on the head pole at chest height for the front carrier, replacing his free-swinging humanoid arms - ref: dynasty.dragon.jpg - ours: unit_dynasty.dragon_windup
2. [S] a muzzle - blocker 4: a squared snout box with a tan lip-rim box and two gold diamond cheek plates in place of the icosphere ball - ref: dynasty.dragon.red.png - ours: unit_dynasty.dragon_idle
3. [S] a carrier trim - blocker 3: orange edge boxes at the collar, cuffs and hem of each carrier's trunk and leg boxes - ref: dynasty.dragon.blue.png - ours: unit_dynasty.dragon_idle
4. [S] b front pole colour - blocker 3: the head pole built in DRAGON_CARRIER.poleColor with a dark wrapped grip cylinder, replacing the team-blue pole mesh - ref: dynasty.dragon.jpg - ours: unit_dynasty.dragon_idle
## Attempts (iter | gap | criterion | verdict)
416-420 | FLAME_JET, DRAGON_FORM, DRAGON_CARRIER, [P] poles, BODY_FLAMES, carrier heads (0f7dd79c) | a,b,c | approved; CONFIRM 419 failed a, b, c
421 | FLAME_JET plume (ba799e89, 8027d61c) | c | approved (c PASS)
421 | DRAGON_FORM flat band (0a4f9754, 87e08299) | a | approved (struck 2; added 5)
422 | DRAGON_CARRIER two-box arms, fists on the pole at the chest (bf9ce7a9) | b | approved (struck 1)
422 | DRAGON_FORM band on edge, fringe below, fins on top (e7926245) | a | approved (struck 5)
## Rejected (last 4)
- fists in skin, .12/.1 [P] [1] - 421: ledger reversal of the 420 DRAGON_CARRIER row
## Notes (max 3 lines)
- 422 defects: grip + stacked fists merge into one dark column; the pole crosses each carrier's face (TABS: a little to the side); the band's edges dead level (TABS undulates), fins an even sawtooth (TABS taller near the head).
- The front carrier is the real humanoid; his head pole is team cloth ("dragonPole"), not DRAGON_CARRIER.poleColor. Framed by his mesh top (rig 5.70 m).
