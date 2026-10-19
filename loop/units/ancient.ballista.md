# ancient.ballista
Status: open   Audited: 378, a 388 (re-audit)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (2 since 388)
 1. frame height in _idle, lineup_ancient: top about 0.8 of a man - TABS: above a man's head, ~1.3x a man (ref: .red.png, .blue.png, factions/ancient.jpg)
b FAIL (1 since 378)
 1. loaded bolt in _idle: the thick tapered shaft reads, but the leaf head hides behind the far housing cap, and in _windup it is edge-on, a thin spike - TABS: a big black leaf head reading past the frame's front (ref: .red.png)
c FAIL (0 since 378)
 1. flying bolt in _release: thin dark rod - TABS: massive bolt, black iron head (ref: .png); the loaded bolt stays in the trough in _flight. _struck fine.
d PASS (cost 900, hp 3.75x, dmg 22.22x, cd 5.01x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a frame - blocker 1: taller corner posts lifting the box, the top plank above a man's head - ref: factions/ancient.jpg - ours: lineup_ancient.png
2. [S] c flying bolt - blocker 1: projectile built from BALLISTA_BOLT (shaft + leaf head), loaded bolt hidden at fire - ref: .png - ours: _release, _flight
## Attempts (iter | gap | criterion | verdict)
384 | box frame, housings, bound arms, trough + winch, 4 spoked wheels (BALLISTA_*) [S] (2fe1946 +0b8f457) | a | approved
387 | crewman crouched beside the trough, arms up, iron helmet (BALLISTA_CREW) [S] (3b71139, reverted ce63321) | a | rejected
388 | crewman standing .3 behind the trough's end, leaning in, arms aimed at the winch handles, iron helmet (BALLISTA_CREW, BALLISTA_HELM) [S] (44de2f1) | a | approved (struck a.3)
389 | timber terracotta in linear space, plates two rows of four (BALLISTA_WOOD/PLATES) [S] (532010f) | a | approved (struck a.2)
389 | loaded bolt: thick tapered shaft, socket, long flat black leaf head (BALLISTA_BOLT) [S] (246a014) | b | approved (struck b.2, narrowed b.1)
## Rejected (last 4)
- operator [S] [1] — 387: crouched at x .3 under the beam, hips .42 — head buried in the beam, hands off the stock
## Notes (max 3 lines)
- Bolt shape judged in _release (_flight: gone). Stock top y ~1.12, rear end z -1.55, winch z -1.47. 388 minor: crewman stiff (TABS crouched).
- wrapAsBody team-tints its main mesh's material on every mesh sharing it: main mesh is a coil cap (makeMat team), timber "wood" BALLISTA_WOOD (.62,.3,.2) still renders grey-taupe.
- Crew pose: BALLISTA_CREW callback in addOperator, arms by aimLimb.
