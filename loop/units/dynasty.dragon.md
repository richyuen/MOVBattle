# dynasty.dragon
Status: open   Audited: 411, 419 (CONFIRM), 420 (RE-AUDIT a, b, c)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (4 since 420)
 3. carrier clothing in unit_dynasty.dragon_idle: plain team boxes, no trim - TABS: a Chinese tunic and trousers edged orange at collar, cuffs and hem (ref: dynasty.dragon.blue.png)
  (struck 1 at 420; 2 at 421; 5 at 422; 4 at 424)
b FAIL (2 since 420)
 2. front pole in unit_dynasty.dragon_windup: hangs beside the running carrier, both his arms swinging free of it - TABS: he keeps a two-handed hold on it as he walks (ref: dynasty.dragon.jpg)
  (struck 1 at 422; 3 at 424)
c PASS (421: opaque white plume with yellow lobes, ba799e89 + 8027d61c; burning man 419)
d PASS (cost 1000, hp 18.78x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a carrier trim - blocker 3: orange edge strips at each carrier's collar, sleeve cuffs, tunic hem and trouser cuffs - ref: dynasty.dragon.blue.png - ours: unit_dynasty.dragon_idle (424 rank 9)
2. [S] b front hold - blocker 2: the front carrier's two fists solved onto the head pole's grip in every living state (he is the real humanoid) - ref: dynasty.dragon.jpg - ours: unit_dynasty.dragon_windup (424 rank 10)
## Attempts (iter | gap | criterion | verdict)
416-420 | FLAME_JET, DRAGON_FORM, DRAGON_CARRIER, [P] poles, BODY_FLAMES, carrier heads (0f7dd79c) | a,b,c | approved; CONFIRM 419 failed a, b, c
421 | FLAME_JET plume (ba799e89, 8027d61c) | c | approved (c PASS)
421 | DRAGON_FORM flat band (0a4f9754, 87e08299) | a | approved (struck 2; added 5)
422 | DRAGON_CARRIER two-box arms, fists on the pole at the chest (bf9ce7a9) | b | approved (struck 1)
422 | DRAGON_FORM band on edge, fringe below, fins on top (e7926245) | a | approved (struck 5)
424 | DRAGON_MUZZLE squared snout, tan lip rim, gold diamonds (576ac9b3) | a | approved (struck 4)
424 | FRONT_GRIP orange-red head pole, dark wrapped grip (8ceb87bb) | b | approved (struck 3)
## Rejected (last 4)
- fists in skin, .12/.1 [P] [1] - 421: ledger reversal of the 420 DRAGON_CARRIER row
## Notes (max 3 lines)
- 424 defects: muzzle diamonds big plates on the front (TABS small flecks on cheeks and brow). 422: grip + stacked fists one dark column; band edges dead level; fins an even sawtooth.
- The front carrier is the real humanoid; his head pole "dragonPole" is now DRAGON_CARRIER.poleColor with FRONT_GRIP bands. Framed by his mesh top (rig 5.70 m).
