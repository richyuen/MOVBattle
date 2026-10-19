# ancient.sarissa
Status: open   Audited: 378   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (0 since 378)
 1. helmet in unit_ancient.sarissa_idle (also lineup_ancient): dome, flat cheek plates, team half-dome crest floating above — TABS: Corinthian helmet enclosing the face (eye slots, nose guard), tall stepped crest brow to nape on the bowl (ref: .red.png, .png)
 2. cape: none in _idle — TABS: team cape shoulders to calves, folded collar (ref: .png)
 3. belt in _idle: thin team band — TABS: big brown belt, dagger on the left hip, brown bracers (ref: .red.png, card)
b PASS (379)
c PASS (380)
d PASS (cost 120, hp 0.50x, dmg 0.16x, cd 1.00x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a Corinthian helmet — blocker 1: face-enclosing helmet lathe with eye slots and nose guard, tall stepped crest on the bowl, no floating dome (ancientDress) — ref: .red.png — ours: unit_ancient.sarissa_idle.png
2. [S] a cape — blocker 2: rigid team cape wedge from shoulders to calves, folded collar — ref: .png — ours: unit_ancient.sarissa_idle.png
## Attempts (iter | gap | criterion | verdict)
379 | pike levelled in both fists at the hip, no disc (PIKE_LEVEL, _levelPike) [S] (0311c85 +f07a183) | b | approved
380 | backs up to keep pike distance inside .85 of reach, logged backstep (SARISSA_KEEP) [S] (9789cbd) | c | approved (c PASS)
## Rejected (last 4)
## Notes (max 3 lines)
- Critic 379 minors: in _idle the arms cross over the shaft; the pike is ~1.2x his height (TABS ~2.5x).
- Critic 380 minor: he still closes to ~1.5 m before the first thrust (engageRange 2.5 from polearm_melee; card range 5).
