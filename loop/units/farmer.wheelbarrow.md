# farmer.wheelbarrow
Status: open   Audited: 375 (re)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (1 since 375)
 1. riders in unit_farmer.wheelbarrow_idle (also _windup): the Farmer now sits on the front lip with his white-socked legs out over the wheel, but the Apple Thrower still sits upright in the hay with legs hidden, and the tray is wide so the riders look small — TABS: riders straddle the narrow tray in line, loom large; Farmer on the front lip, legs splayed forward over the wheel, Apple Thrower astride behind (ref: .red.png, .png)
b PASS (375)
c PASS (375)
d PASS (cost 1000, hp 18.69x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a riders — blocker 1: narrow the tray toward a rider's hip width (WHEELBARROW tray) and seat the Apple Thrower on its rim, thighs over the side boards, shins outside (CREW_SEAT) — ref: .red.png — ours: unit_farmer.wheelbarrow_windup.png
## Attempts (iter | gap | criterion | verdict)
346-350 | crew on the cart, plank tray + hay, fork/apple, log wheel, ram, crew dress, riders fight, aimed stab, drum wheel [S]; afro [P] | a,b,c | approved
376 | riders on the tray: Farmer on the lip legs forward, Thrower astride (CREW_SEAT) [S] (78a73b0) | a | approved
## Rejected (last 4)
## Notes (max 3 lines)
- Crew bodies on root.metadata.wheelbarrowCrew; dressed in unitFactory dressWheelbarrowCrew; posed each tick by poseWheelbarrowCrew from sim _crewsFight.
- Sim reads of joint positions must settle world matrices first (capture replays a frame in one advanceTime call; renders refresh them).
- 376: the Thrower's splayed thighs (backSplay 1.0) still end inside the wide tray; the hay mound hides them.
