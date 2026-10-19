# ancient.ballista
Status: open   Audited: 378, a 388 (re-audit)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (1 since 388)
 1. frame height in _idle, lineup_ancient: top about 0.8 of a man — TABS: above a man's head, ~1.3x a man (ref: .red.png, .blue.png, factions/ancient.jpg)
 2. timber in _idle, lineup_ancient: grey-taupe — TABS: warm red-brown, dark iron plates on the top plank (ref: .red.png, .blue.png, factions/ancient.jpg)
b FAIL (0 since 378)
 1. loaded bolt in _idle: a thin rod — TABS: huge bolt, large black leaf head past the frame's front (ref: .red.png, .png)
 2. stock in _idle: missing — TABS: long trough to the rear with winch and handles (ref: .red.png) [384 trough + winch, unjudged]
c FAIL (0 since 378)
 1. flying bolt in _release: thin dark rod — TABS: massive bolt, black iron head (ref: .png). Blast and fling in _struck fine.
d PASS (cost 900, hp 3.75x, dmg 22.22x, cd 5.01x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a timber — blocker 2: warm red-brown wood material (BALLISTA_WOOD reads grey), dark iron plates on the top plank — ref: .blue.png — ours: _idle
2. [S] b loaded bolt — blocker 1: huge bolt, big black leaf head past the frame front — ref: .red.png — ours: _idle
3. [S] a frame — blocker 1: taller posts, the top plank ~1.3x a man (replaces the 384 frame; values reset) — ref: factions/ancient.jpg — ours: lineup_ancient.png
## Attempts (iter | gap | criterion | verdict)
384 | box frame, housings, bound arms, trough + winch, 4 spoked wheels (BALLISTA_*) [S] (2fe1946 +0b8f457) | a | approved
387 | crewman crouched beside the trough, arms up, iron helmet (BALLISTA_CREW) [S] (3b71139, reverted ce63321) | a | rejected
388 | crewman standing .3 behind the trough's end, leaning in, arms aimed at the winch handles, iron helmet (BALLISTA_CREW, BALLISTA_HELM) [S] (44de2f1) | a | approved (struck a.3)
## Rejected (last 4)
- operator [S] [1] — 387: crouched at x .3 under the beam, hips .42 — head buried in the beam, hands off the stock
## Notes (max 3 lines)
- Bolt shape judged in _release (_flight: gone). Stock top y ~1.12, rear end z -1.55, winch z -1.47. 388 minor: crewman stiff (TABS crouched).
- wrapAsBody team-tints its main mesh's material on every mesh sharing it: main mesh is a coil cap (makeMat team), timber "wood" BALLISTA_WOOD (.62,.3,.2) still renders grey-taupe.
- Crew pose: BALLISTA_CREW callback in addOperator, arms by aimLimb.
