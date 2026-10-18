# renaissance.halberd
Status: open   Audited: 327   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (2 since 327)
 2. half-tabard in lineup_renaissance reads pale grey-white, and the belt is not readable over it — TABS: tan-cream half-tabard over one side with a brown belt across the waist (ref: renaissance.halberd.blue.png)
b PASS (330)
c PASS (335)
d PASS (cost 400, hp 5.74x, dmg 0.92x, cd 1.00x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a tan half-tabard and belt — blocker 2: a brown belt strap mesh standing proud over the tabard at the waist, and the tabard on a self-lit tan material so it stops greying white (not a HALBERD_CREAM re-nudge) — ref: renaissance.halberd.blue.png — ours: lineup_renaissance.png
## Attempts (iter | gap | criterion | verdict)
327 | halberd head: axe, back spike, point [S] (547179c + bc80d12) | b | approved
328 | black sallet [S] (0860943) | a | approved
329 | two-handed grip [S] (0f6980a + db2d934) | b | approved
330 | vertical chop [S] (04be0ae) | c | approved
333 | dress: half-tabard, rolled sleeves, gauntlets, belt [S] (c23f17c) | a | approved
334 | chop onto the man: aimed at his crown, shaft drawn back through the fists [S] (b6a163f) | c | approved
335 | blow held down: own clock from the land (CHOP_DOWN) [S] (8899946) | c | approved
## Rejected (last 4)
## Notes (max 3 lines)
- HALBERD is shared with good.radiant_glaive. _poseHalberd stands the pole; _chopOnto (CHOP_ONTO) aims the land; _holdChopDown (CHOP_DOWN) keeps it down 0.35 s past the attack. Critic 335 nit: the axe rests flat at head height rather than biting down.
- dressHalberd (HALBERD_DRESS): the tabard is on the weapon side, so _idle (off side) does not show it; lineup does. Cream cloth greys: self-light it (mf.get cloth, emissiveIntensity) rather than retint.
- _offArmTo's analytic solve is ~20 deg off; pole callers pass settle 2.
