# renaissance.halberd
Status: open   Audited: 327   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (2 since 327)
 2. half-tabard in lineup_renaissance reads pale grey-white, and the belt is not readable over it — TABS: tan-cream half-tabard over one side with a brown belt across the waist (ref: renaissance.halberd.blue.png)
b PASS (330)
c FAIL (2 since 330)
 3. in unit_renaissance.halberd_flight the halberd is stood straight up again, head over his sallet — TABS: the blow stays down on the man for a beat (ref: card Characteristics)
d PASS (cost 400, hp 5.74x, dmg 0.92x, cd 1.00x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] c blow held down — blocker 3: hold the landed tilt and slide ~0.3 s after the hit before the raise (_animateHalberdChop) — ref: card Characteristics — ours: unit_renaissance.halberd_flight.png
2. [S] a tan half-tabard and belt — blocker 2: self-lit HALBERD_CREAM tabard and a brown belt band standing proud over it — ref: renaissance.halberd.blue.png — ours: lineup_renaissance.png
## Attempts (iter | gap | criterion | verdict)
327 | halberd head: axe, back spike, point [S] (547179c + bc80d12) | b | approved
328 | black sallet [S] (0860943) | a | approved
329 | two-handed grip [S] (0f6980a + db2d934) | b | approved
330 | vertical chop [S] (04be0ae) | c | approved
333 | dress: half-tabard, rolled sleeves, gauntlets, belt [S] (c23f17c) | a | approved
334 | chop onto the man: aimed at his crown, shaft drawn back through the fists [S] (b6a163f) | c | approved
## Rejected (last 4)
## Notes (max 3 lines)
- HALBERD is shared with good.radiant_glaive. _poseHalberd stands the pole; _chopOnto (CHOP_ONTO) aims the land at the aimBlowAt mark (_chopMark), _slideHalberd draws the shaft back. CHOP row approved 330: no [P] on it before 350 (the hold is an [S]).
- dressHalberd (HALBERD_DRESS): the tabard is on the weapon side, so _idle (off side) does not show it; lineup does. Cream cloth greys: self-light it (glow) rather than retint.
- _offArmTo's analytic solve is ~20 deg off; pole callers pass settle 2.
