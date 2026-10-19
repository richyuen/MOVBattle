# ancient.ballista
Status: open   Audited: 378   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (1 since 378)
 1. frame in unit_ancient.ballista_idle and lineup_ancient: the box tops out around a man's shoulder, in grey-taupe timber — TABS: a chunky frame whose top stands above a man's head, warm red-brown wood in both team renders (ref: .red.png, .blue.png, factions/ancient.jpg)
 3. operator in _idle, _windup: bare team man ~2 m from the machine — TABS: helmeted team crewman crouched behind, holding the stock (ref: .blue.png, card)
b FAIL (0 since 378)
 1. loaded bolt in _idle: a thin rod — TABS: huge bolt, large black leaf head past the frame's front (ref: .red.png, .png)
 2. stock in _idle: missing — TABS: long trough/slider to the rear with winch and handles (ref: .red.png) [384 added trough + winch under a; not yet judged for b]
c FAIL (0 since 378)
 1. flying bolt in _release: thin dark rod a third of the deck long — TABS: massive bolt, black iron head (ref: .png). Blast and fling in _struck fine.
d PASS (cost 900, hp 3.75x, dmg 22.22x, cd 5.01x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a operator — blocker 3: helmeted team crewman crouched at the stock (vehicleBuilder addOperator) — ref: .blue.png — ours: unit_ancient.ballista_idle.png
2. [S] a frame — blocker 1: red-brown timber (BALLISTA_WOOD reads grey: lift red, glow), frame scaled up to tower over the crew (BALLISTA_* rig scale) — ref: factions/ancient.jpg — ours: lineup_ancient.png
## Attempts (iter | gap | criterion | verdict)
384 | box frame, torsion housings + team coil caps, plates, bound arms, trough + winch, 4 spoked wheels (BALLISTA_*) [S] (2fe1946 +0b8f457) | a | approved (struck a.2)
## Rejected (last 4)
## Notes (max 3 lines)
- Critic 378: _flight shows the bolt gone (70 m/s); bolt shape is judged in _release. A seated crew needs _idle framed on the machine's rear.
- wrapAsBody team-tints its main mesh's material on every mesh sharing it: main mesh is a coil cap (makeMat team), timber from materialFactory "wood".
