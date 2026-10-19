# ancient.ballista
Status: open   Audited: 378   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (1 since 378; 1 rejected [S] since 378)
 1. frame in _idle, lineup_ancient: box tops out at a man's shoulder, grey-taupe timber — TABS: frame top above a man's head, warm red-brown wood (ref: .red.png, .blue.png, factions/ancient.jpg)
 3. operator in _idle, _windup: bare team man ~2 m off — TABS: helmeted team crewman crouched behind, holding the stock (ref: .blue.png) [387: _idle a rear three-quarter, 5b88632; re-audit pending]
b FAIL (0 since 378)
 1. loaded bolt in _idle: a thin rod — TABS: huge bolt, large black leaf head past the frame's front (ref: .red.png, .png)
 2. stock in _idle: missing — TABS: long trough to the rear with winch and handles (ref: .red.png) [384 trough + winch; not yet judged for b]
c FAIL (0 since 378)
 1. flying bolt in _release: thin dark rod — TABS: massive bolt, black iron head (ref: .png). Blast and fling in _struck fine.
d PASS (cost 900, hp 3.75x, dmg 22.22x, cd 5.01x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a operator — blocker 3: crewman behind the trough's rear end (not under the beam beside it), hips high so head and helmet clear the stock top, hands on its rear handles (vehicleBuilder) — ref: .blue.png — ours: _idle
2. [S] b loaded bolt — blocker 1: huge bolt, big black leaf head past the frame front — ref: .red.png — ours: _idle
3. [S] a frame — blocker 1: red-brown timber (BALLISTA_WOOD reads grey), frame scaled to tower over the crew — ref: factions/ancient.jpg — ours: lineup_ancient.png
## Attempts (iter | gap | criterion | verdict)
384 | box frame, housings, bound arms, trough + winch, 4 spoked wheels (BALLISTA_*) [S] (2fe1946 +0b8f457) | a | approved (struck a.2)
387 | crewman crouched beside the trough, arms up, iron helmet (BALLISTA_CREW) [S] (3b71139, reverted ce63321) | a | rejected
## Rejected (last 4)
- operator [S] [1] — 387: crouched at x .3 under the beam, hips .42 — head and helmet buried in the stock beam, hands not on the stock
## Notes (max 3 lines)
- _flight shows the bolt gone (70 m/s); bolt shape is judged in _release. Stock top y ~1.08, rear end z -1.55. Operator root at hip height (~.72 standing).
- wrapAsBody team-tints its main mesh's material on every mesh sharing it: main mesh is a coil cap (makeMat team), timber "wood".
- Crew pose callbacks set joints statically: hip -x thigh forward, knee +x bends, torso +x leans.
