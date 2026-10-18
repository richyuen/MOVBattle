# farmer.wheelbarrow
Status: open   Audited: 339   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (2 since 339)
 1. crew in unit_farmer.wheelbarrow_idle are three bare team mannequins (placement cleared 346) — TABS: Farmer (liripipe hood, white socks) front, Apple Thrower (beard) behind, Traveller (brown afro, overalls) on the handles (ref: farmer.wheelbarrow.red.png)
 3. wheel a black disc, no legs — TABS: cut-log wheel on braces, two legs (ref: farmer.wheelbarrow.red.png)
b PASS (347)
c FAIL (0 since 339)
 1. cart stands still in _release/_flight/_struck — TABS: fast ram that runs units over (ref: card, speed 3x)
 2. missing: riders' pitchfork stab and apple throw from the moving cart (ref: farmer.wheelbarrow.png)
d PASS (cost 1000, hp 18.69x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a wheel — blocker 3: cut-log wheel (bark rim, light end-grain face, bolted hub) on wooden braces, two legs under the tray — ref: farmer.wheelbarrow.red.png — ours: unit_farmer.wheelbarrow_idle.png
2. [S] a dress the crew — blocker 1: Farmer's liripipe hood, Apple Thrower's beard, Traveller's afro and overalls; riders' head/hand material to team skin — ref: farmer.wheelbarrow.red.png — ours: unit_farmer.wheelbarrow_idle.png
3. [S] c ram — blocker 1: cart driven at speed into the enemy, knocking and running over units on contact — ref: card Characteristics — ours: unit_farmer.wheelbarrow_release.png
## Attempts (iter | gap | criterion | verdict)
346 | three crew on the cart, cart at man scale (WHEELBARROW) [S] (4ecb105) | a | approved
347 | bolted team-painted plank tray, hay mound seat (TRAY_PLANK) [S] (07f763c +45203bc) | a | approved
347 | riders' fork and apple (CREW_FORK, CREW_APPLE, holdInFist) [S] (b2fe249 +332b611) | b | approved
## Rejected (last 4)
## Notes (max 3 lines)
- Cart is buildWheelbarrow in vehicleBuilder: rig scaled WHEELBARROW.scale 2.2, crew are addOperator men; props via holdInFist in the pose callbacks.
- 347 critic: hay mound a smooth pale dome (TABS golden hay, straw ends); side view stacks fork tines into one scoop; red riders' heads lavender-grey.
