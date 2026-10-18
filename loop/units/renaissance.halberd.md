# renaissance.halberd
Status: open   Audited: 327   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (1 since 327)
 2. body in unit_renaissance.halberd_idle is plain team colour — TABS: cream half-tabard over one side, brown banded padded sleeves, dark-grey gauntlets, belt (ref: renaissance.halberd.blue.png)
b PASS (330)
c FAIL (1 since 330)
 2. in unit_renaissance.halberd_release the shaft comes down level at head height and the axe head ends a pole-length past the knight — TABS: the axe head brought down onto him (ref: card Characteristics "vertical chop")
 3. in unit_renaissance.halberd_flight the halberd is already back up at ~45 deg — TABS: the blow stays down on the man for a beat (ref: card Characteristics)
d PASS (cost 400, hp 5.74x, dmg 0.92x, cd 1.00x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [P] c chop lands on the man (fallout of 330 chop [S]) — proceduralAnimation.ts CHOP.landed 1.95->~1.6, CHOP.hold .1->.2 — NEXT shot: unit_renaissance.halberd_release.png (axe head on the helm), _flight still down
2. [S] a body — blocker 2: cream half-tabard over one shoulder, banded brown sleeves, dark gauntlets, belt — ref: renaissance.halberd.blue.png — ours: unit_renaissance.halberd_idle.png
## Attempts (iter | gap | criterion | verdict)
327 | halberd head: axe, back spike, point [S] (547179c + bc80d12) | b | approved
328 | black sallet [S] (0860943) | a | approved
329 | two-handed grip, halberd seated in the fist [S] (0f6980a + db2d934) | b | approved
330 | vertical chop [S] (04be0ae) | c | approved
## Rejected (last 4)
## Notes (max 3 lines)
- HALBERD is shared with good.radiant_glaive (it chops too now). _poseHalberd stands the pole in the world (axis + edge) over its rest; the chop is a strike-at-man (blowLandsIn) with no _aimBlow mark.
- _offArmTo's analytic solve is ~20 deg off; pole callers pass settle 2.
- Critic 328 defect on the sallet: squat round bucket; TABS taller, ridged crown, visor step over a team slit (SALLET).
