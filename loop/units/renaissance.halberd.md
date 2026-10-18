# renaissance.halberd
Status: open   Audited: 327   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (1 since 327)
 2. body in unit_renaissance.halberd_idle is plain team colour — TABS: cream half-tabard over one side, brown banded padded sleeves, dark-grey gauntlets, belt (ref: renaissance.halberd.blue.png)
b FAIL (2 since 327)
 2. in unit_renaissance.halberd_windup the off hand rises beside the sallet a hand's width off the shaft (the weapon fist is on it since 329) — TABS: both fists on the shaft (ref: renaissance.halberd.red.png, renaissance.halberd.jpg)
c FAIL (0 since 327)
 1. unit_renaissance.halberd_release/_flight: no chop, the pole stays upright and the empty hands push — TABS: vertical overhead chop with the axe head (ref: card Characteristics)
d PASS (cost 400, hp 5.74x, dmg 0.92x, cd 1.00x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] c vertical overhead chop — blocker 1: two-handed raise and chop down with the axe head — ref: card Characteristics — ours: unit_renaissance.halberd_release.png
2. [S] b off hand closed on the shaft — blocker 2: clamp the grip point to the off arm's reach before solving (_twoHandPole) — ref: renaissance.halberd.red.png — ours: unit_renaissance.halberd_windup.png
3. [S] a body — blocker 2: cream half-tabard over one shoulder, banded brown sleeves, dark gauntlets, belt — ref: renaissance.halberd.blue.png — ours: unit_renaissance.halberd_idle.png
## Attempts (iter | gap | criterion | verdict)
327 | halberd head: axe, back spike, point [S] (547179c + bc80d12) | b | approved
328 | black sallet [S] (0860943) | a | approved
329 | two-handed grip, halberd seated in the fist [S] (0f6980a + db2d934) | b | approved
## Rejected (last 4)
## Notes (max 3 lines)
- Critic 328 defect on the sallet: squat round bucket; TABS taller, ridged crown, visor step over a clearly team slit (SALLET).
- HALBERD is shared with good.radiant_glaive. seatPoleInFist (SEATED_POLES) turns it about the fist; POLE_GRIP pins pole carriers to carry pick 0.4.
- _offArmTo's analytic solve is ~20 deg off (clubber too, left alone); pole callers pass settle 2.
