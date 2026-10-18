# tribal.mammoth
Status: open   Audited: 315   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (2 since 315)
 1. (struck 323: brown fur hide)
 2. legs in unit_tribal.mammoth_idle are bare — TABS: a blue ankle band with dots and a stripe on each leg (ref: tribal.mammoth.blue.png)
 3. (struck 324: mane)
 4. face in unit_tribal.mammoth_windup is plain — TABS: a team-colour marking from the forehead down the trunk (ref: tribal.mammoth.blue.png, card Appearance)
b PASS (315)
c PASS (323)
d PASS (stats 315: cost 2200=2200, hp +1%, dmg and cd none on the wiki)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a ankle bands — blocker 2: buildMammoth legCuff becomes a team-colour band with one stripe and a ring of dots near the foot of each leg — ref: tribal.mammoth.blue.png — ours: unit_tribal.mammoth_idle.png
2. [S] a face marking — blocker 4: replace the brow square with a team-colour stripe from the forehead down the trunk, plus a dot or two on the trunk — ref: tribal.mammoth.blue.png — ours: unit_tribal.mammoth_windup.png
## Attempts (iter | gap | criterion | verdict)
323 | brown fur hide (85c87e9 + 11b021e) | a | approved
323 | Mammoth Charge (7d01e90) | c | approved
324 | mane (6d8c95a) | a | approved
## Rejected (last 4)
## Notes (max 3 lines)
- 323 hide: MAMMOTH_HIDE/MAMMOTH_FUR in vehicleBuilder (mammoth-only; the sacred elephant passes its own hide and shaves by mesh name, ELEPHANT_SHAVED). Trunk near-black (trunkMat lerp 0.6).
- 323 charge: MAMMOTH_CHARGE + _trampleCharges in simulationSystem, RuntimeUnit.startCharge; "charge_impact" stages it at d 8.
- 324 mane: MAMMOTH_MANE (jittered dome/crest/topknot, maneLock). Critic (polish): only slightly darker than the coat, locks unreadable, _windup crops the head top.
