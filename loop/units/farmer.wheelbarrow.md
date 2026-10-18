# farmer.wheelbarrow
Status: done   Audited: 339   Done: 350
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a PASS (350)
b PASS (347)
c PASS (350)
d PASS (cost 1000, hp 18.69x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
(none; minor if revisited: drum .82 of tray width vs nearly full; afro ~2/3 the render's size)
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
