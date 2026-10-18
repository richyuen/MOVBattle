# farmer.wheelbarrow
Status: open   Audited: 339   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (3 since 339)
 1. crew in unit_farmer.wheelbarrow_idle are three bare team mannequins — TABS: Farmer (liripipe hood, white socks) front, Apple Thrower (beard) behind, Traveller (brown afro, overalls) on the handles (ref: farmer.wheelbarrow.red.png)
 3. (narrowed 348: braces, legs, log face cleared) wheel in unit_farmer.wheelbarrow_idle is a thin 8 cm log slice — TABS: a broad cut-log drum almost as wide as the tray (ref: farmer.wheelbarrow.red.png, farmer.wheelbarrow.png)
b PASS (347)
c FAIL (1 since 339)
 2. missing: riders' pitchfork stab and apple throw from the moving cart (ref: farmer.wheelbarrow.png)
d PASS (cost 1000, hp 18.69x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a dress the crew — blocker 1: Farmer's liripipe hood and white socks on the front rider, a beard on the Apple Thrower, brown afro and overalls on the Traveller (reuse dressFarmerLegs / the farmer hood) — ref: farmer.wheelbarrow.red.png — ours: unit_farmer.wheelbarrow_idle.png
2. [S] c riders fight — blocker 2: an apple projectile thrown from the Apple Thrower's fist, the front Farmer stabbing men the cart passes — ref: farmer.wheelbarrow.png — ours: unit_farmer.wheelbarrow_release.png
3. [S] a log drum — blocker 3: the log a wide drum (thick ~ trayWide*.8), faceted bark round its length, braces out to its ends (LOG_WHEEL) — ref: farmer.wheelbarrow.red.png — ours: unit_farmer.wheelbarrow_idle.png
## Attempts (iter | gap | criterion | verdict)
346 | three crew on the cart, cart at man scale (WHEELBARROW) [S] (4ecb105) | a | approved
347 | bolted team-painted plank tray, hay mound seat (TRAY_PLANK) [S] (07f763c +45203bc) | a | approved
347 | riders' fork and apple (CREW_FORK, CREW_APPLE, holdInFist) [S] (b2fe249 +332b611) | b | approved
348 | cut-log wheel, braces, two legs (LOG_WHEEL) [S] (adb75af) | a | approved
348 | ram: mammoth charge driven through, logged "trample" (WHEELBARROW_RAM) [S] (10aa302) | c | approved
## Rejected (last 4)
## Notes (max 3 lines)
- Cart is buildWheelbarrow in vehicleBuilder: rig scaled WHEELBARROW.scale 2.2, crew are addOperator men; props via holdInFist in the pose callbacks.
- 348 critic: no dust or speed read at the trample, ram ~2x walk vs card 3x (WHEELBARROW_RAM.speed 1.7); wheel does not spin.
