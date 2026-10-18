# renaissance.halberd
Status: open   Audited: 327   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (2 since 327)
 2. half-tabard in lineup_renaissance reads pale grey-white, and the belt is not readable over it — TABS: tan-cream half-tabard over one side with a brown belt across the waist (ref: renaissance.halberd.blue.png)
b PASS (330)
c FAIL (1 since 330)
 2. in unit_renaissance.halberd_release the shaft comes down level at head height and the axe head ends a pole-length past the knight — TABS: the axe head brought down onto him (ref: card Characteristics "vertical chop")
 3. in unit_renaissance.halberd_flight the halberd is already back up at ~45 deg — TABS: the blow stays down on the man for a beat (ref: card Characteristics)
d PASS (cost 400, hp 5.74x, dmg 0.92x, cd 1.00x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] c chop onto the man — blocker 2: swing ending with the axe head down on the foe, not a pole-length past him — ref: card Characteristics — ours: unit_renaissance.halberd_release.png
2. [P] a tabard colour (fallout of 333 dress [S] c23f17c) — unitFactory.ts HALBERD_CREAM warmer, darker tan ~(0.8, 0.62, 0.38) — NEXT shot: lineup_renaissance.png (halberdier's tabard)
## Attempts (iter | gap | criterion | verdict)
327 | halberd head: axe, back spike, point [S] (547179c + bc80d12) | b | approved
328 | black sallet [S] (0860943) | a | approved
329 | two-handed grip, halberd seated in the fist [S] (0f6980a + db2d934) | b | approved
330 | vertical chop [S] (04be0ae) | c | approved
333 | dress: half-tabard, rolled sleeves, gauntlets, belt [S] (c23f17c) | a | approved
## Rejected (last 4)
## Notes (max 3 lines)
- HALBERD is shared with good.radiant_glaive. _poseHalberd stands the pole in the world; the chop is a strike-at-man (blowLandsIn) with no _aimBlow mark. CHOP row approved 330: a [P] on it is a reversal before 350.
- dressHalberd (HALBERD_DRESS): the tabard is on the weapon side, so _idle (off side) does not show it; lineup does. The old flared team skirt hides the belt.
- _offArmTo's analytic solve is ~20 deg off; pole callers pass settle 2.
