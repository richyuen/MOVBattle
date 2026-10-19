# farmer.wheelbarrow
Status: open   Audited: 375 (re)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (2 since 375)
 1. riders in unit_farmer.wheelbarrow_idle (also _windup): tray now narrow and the Thrower straddles it, but the Farmer and the Thrower sit far apart along a long, deep-boarded tray and still look small; the Thrower's shins hang plumb and thin against the boards — TABS: riders bunched in line, looming over a short tray, the Farmer reclined back against the Thrower with legs splayed forward over the wheel, the Thrower's legs splayed forward and out around him (ref: .red.png, .png)
b PASS (375)
c PASS (375)
d PASS (cost 1000, hp 18.69x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a bunched riders — blocker 1: short tray (trayLong down), the Farmer reclined back against the Thrower, a new lean pose for the front rider (WHEELBARROW.trayLong, CREW_SEAT lipIn/backSeat + Farmer spine lean) — ref: .red.png — ours: unit_farmer.wheelbarrow_idle.png
2. [S] a Thrower's legs — blocker 1: thighs splayed forward and out around the Farmer, shins outside the boards ahead of him; lower the side boards so the riders rise above the tray (CREW_SEAT back*, side board height) — ref: .png — ours: unit_farmer.wheelbarrow_windup.png
## Attempts (iter | gap | criterion | verdict)
346-350 | crew on the cart, plank tray + hay, fork/apple, log wheel, ram, crew dress, riders fight, aimed stab, drum wheel [S]; afro [P] | a,b,c | approved
376 | riders on the tray: Farmer on the lip legs forward, Thrower astride (CREW_SEAT) [S] (78a73b0) | a | approved
377 | narrow tray .2, flat hay bed, Thrower on the rim, knees rolled so shins hang outside (HAY_BED, CREW_SEAT) [S] (aa835d7 +4f65905) | a | approved
## Rejected (last 4)
## Notes (max 3 lines)
- Crew bodies on root.metadata.wheelbarrowCrew; dressed in unitFactory dressWheelbarrowCrew; posed each tick by poseWheelbarrowCrew from sim _crewsFight (arms only, not legs).
- Sim reads of joint positions must settle world matrices first (capture replays a frame in one advanceTime call; renders refresh them).
- 377: at rig scale a thigh is ~.11; a knee bent only about x swings the shin round a splayed thigh, so roll the knee (z) by the splay to hang it.
