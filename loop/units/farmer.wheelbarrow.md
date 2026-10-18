# farmer.wheelbarrow
Status: open   Audited: 339   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (4 since 339)
 3. (narrowed 348: braces, legs, log face cleared) wheel in unit_farmer.wheelbarrow_idle is a thin 8 cm log slice — TABS: a broad cut-log drum almost as wide as the tray (ref: farmer.wheelbarrow.red.png, farmer.wheelbarrow.png)
b PASS (347)
c FAIL (2 since 339)
 2. (narrowed 349: apple throw cleared) Farmer's stab in unit_farmer.wheelbarrow_ability/_ability_after is a short arm push of the fork level at shoulder height; the tines pass over the man at the wheel — TABS: "the Farmer stabs any enemy units up close" (ref: card Characteristics, farmer.wheelbarrow.png)
d PASS (cost 1000, hp 18.69x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] c Farmer's stab aimed at the man — blocker 2: arm and fork driven along the seat->target line (pitch and yaw), tines reaching him, blow landed at the end of the drive (F.draw + F.drive) — ref: card, farmer.wheelbarrow.png — ours: unit_farmer.wheelbarrow_ability_after.png
2. [S] a cut-log drum wheel — blocker 3: the 8 cm slice replaced by a drum about the tray's width, bark round its tread, rings on both faces (LOG_WHEEL) — ref: farmer.wheelbarrow.red.png — ours: unit_farmer.wheelbarrow_idle.png
## Attempts (iter | gap | criterion | verdict)
346 | three crew on the cart, cart at man scale (WHEELBARROW) [S] (4ecb105) | a | approved
347 | bolted team-painted plank tray, hay mound seat (TRAY_PLANK) [S] (07f763c +45203bc) | a | approved
347 | riders' fork and apple (CREW_FORK, CREW_APPLE, holdInFist) [S] (b2fe249 +332b611) | b | approved
348 | cut-log wheel, braces, two legs (LOG_WHEEL) [S] (adb75af) | a | approved
348 | ram: mammoth charge driven through, logged "trample" (WHEELBARROW_RAM) [S] (10aa302) | c | approved
349 | crew dressed: hood/socks/hem, beard, afro, overalls [S] (fb4fe35) | a | approved
349 | riders fight: held-apple throw "throw", fork stab "stab" [S] (81f76b1) | c | approved
## Rejected (last 4)
## Notes (max 3 lines)
- Crew bodies on root.metadata.wheelbarrowCrew (wheelbarrowCrew()); dressed in unitFactory dressWheelbarrowCrew; arms posed each tick by poseWheelbarrowCrew from sim _crewsFight.
- 349 fallout [P]: AFRO wide 1.6->2.0, back .3->.12, up .42->.3 (beret-like, small; shows in _idle). Thrower's head reads grey (pre-existing).
- 348: no trample dust, ram ~2x walk vs card 3x (WHEELBARROW_RAM.speed 1.7), wheel does not spin.
