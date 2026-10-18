# tribal.mammoth
Status: open   Audited: 315   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (1 since 315)
 1. (struck 323: brown fur hide)
 2. legs in unit_tribal.mammoth_idle are bare — TABS: a blue ankle band with dots and a stripe on each leg (ref: tribal.mammoth.blue.png)
 3. head in unit_tribal.mammoth_windup carries a flat blue cap — TABS: a dark-brown shaggy mane chunk over head and shoulders (ref: tribal.mammoth.red.png)
 4. face in unit_tribal.mammoth_windup is plain — TABS: a team-colour marking from the forehead down the trunk (ref: tribal.mammoth.blue.png, card Appearance)
b PASS (315)
c PASS (323)
d PASS (stats 315: cost 2200=2200, hp +1%, dmg and cd none on the wiki)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a mane — blocker 3: a dark-brown jittered faceted mane chunk over the crown, nape and hump in place of the blue cap (dome/crest/topknot crestMat) — ref: tribal.mammoth.red.png — ours: unit_tribal.mammoth_windup.png
2. [S] a ankle bands — blocker 2: a team-colour band with a stripe and dots round each leg above the foot — ref: tribal.mammoth.blue.png — ours: unit_tribal.mammoth_idle.png
## Attempts (iter | gap | criterion | verdict)
323 | brown fur hide (85c87e9 + 11b021e) | a | approved
323 | Mammoth Charge (7d01e90) | c | approved
## Rejected (last 4)
## Notes (max 3 lines)
- 323 hide: MAMMOTH_HIDE/MAMMOTH_FUR in vehicleBuilder (mammoth-only; the sacred elephant passes its own hide). Critic: trunk near-black (trunkMat lerp 0.6), body jitter hardly reads.
- 323 charge: MAMMOTH_CHARGE + _trampleCharges in simulationSystem, RuntimeUnit.startCharge; "charge_impact" stages it at d 8. Critic (minor): dust not visible, no walking trample.
