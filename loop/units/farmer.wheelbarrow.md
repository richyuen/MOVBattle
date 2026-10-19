# farmer.wheelbarrow
Status: open   Audited: 375 (re)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (0 since 375)
 1. riders in unit_farmer.wheelbarrow_idle (also _windup): sit waist-deep in the hay like in a tub, legs hidden — TABS: riders straddle the narrow tray in line, loom large; Farmer on the front lip, white-socked legs splayed forward over the wheel, Apple Thrower astride behind (ref: .red.png, .png)
b PASS (375)
c PASS (375)
d PASS (cost 1000, hp 18.69x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a riders seated on the tray — blocker 1: Farmer on the front lip, legs splayed forward over the wheel, Apple Thrower astride behind, not sunk in hay — ref: .red.png — ours: unit_farmer.wheelbarrow_windup.png
## Attempts (iter | gap | criterion | verdict)
346 | three crew on the cart, cart at man scale (WHEELBARROW) [S] (4ecb105) | a | approved
347 | bolted team-painted plank tray, hay mound seat (TRAY_PLANK) [S] (07f763c +45203bc) | a | approved
347 | riders' fork and apple (CREW_FORK, CREW_APPLE, holdInFist) [S] (b2fe249 +332b611) | b | approved
348 | cut-log wheel, braces, two legs (LOG_WHEEL) [S] (adb75af) | a | approved
348 | ram: mammoth charge driven through, logged "trample" (WHEELBARROW_RAM) [S] (10aa302) | c | approved
349 | crew dressed: hood/socks/hem, beard, afro, overalls [S] (fb4fe35) | a | approved
349 | riders fight: held-apple throw "throw", fork stab "stab" [S] (81f76b1) | c | approved
350 | stab aimed down the shoulder->chest line, hit at drive end (CREW_FIGHT aimCrewStab) [S] (b0cfd14 +6b93c12) | c | approved
350 | cut-log drum wheel, bark staves (LOG_WHEEL) [S] (6298fe0) | a | approved
350 | afro broader, forward (AFRO) [P] (109f875) | a | approved
## Rejected (last 4)
## Notes (max 3 lines)
- Crew bodies on root.metadata.wheelbarrowCrew; dressed in unitFactory dressWheelbarrowCrew; posed each tick by poseWheelbarrowCrew from sim _crewsFight.
- Sim reads of joint positions must settle world matrices first (capture replays a frame in one advanceTime call; renders refresh them).
