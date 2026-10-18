# tribal.mammoth
Status: open   Audited: 315   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (3 since 315)
 1. (struck 323: brown fur hide)
 2. (struck 325: ankle bands)
 3. (struck 324: mane)
 4. face in unit_tribal.mammoth_windup is plain — TABS: a team-colour marking from the forehead down the trunk (ref: tribal.mammoth.blue.png, card Appearance)
b PASS (315)
c PASS (323)
d PASS (stats 315: cost 2200=2200, hp +1%, dmg and cd none on the wiki)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a face marking — blocker 4: a flat team-colour paint strip from the forehead between the eyes, angled past the eye down the top of the trunk, plus two or three paint dots on the trunk, in tuskTipMat — ref: tribal.mammoth.blue.png — ours: unit_tribal.mammoth_windup.png
2. [P] a ankle band flush — fallout of 0207b28: ANKLE_BAND wide 0.64->0.61, stripeTall 0.05->0.035, dot z-squash 0.45->0.2 — ref: tribal.mammoth.blue.png — ours: unit_tribal.mammoth_idle.png
   NEXT: [P] vehicleBuilder.ts ANKLE_BAND. Shows in unit_tribal.mammoth_idle: thinner rings nearly flush with the leg, flat dots.
## Attempts (iter | gap | criterion | verdict)
323 | brown fur hide (85c87e9 + 11b021e) | a | approved
323 | Mammoth Charge (7d01e90) | c | approved
324 | mane (6d8c95a) | a | approved
325 | ankle bands (0207b28) | a | approved
## Rejected (last 4)
## Notes (max 3 lines)
- 323 hide: MAMMOTH_HIDE/MAMMOTH_FUR (mammoth-only; the sacred elephant passes its own hide and shaves by mesh name, ELEPHANT_SHAVED). 323 charge: MAMMOTH_CHARGE + _trampleCharges.
- 324 mane: MAMMOTH_MANE. Critic (polish): only slightly darker than the coat; _windup crops the head top.
- 325 ankles: ANKLE_BAND (ankleStripe, ankleDot in tuskTipMat on kneeJoint; shaved on the elephant). The brow square is browPaint (paintMat) on neck.
