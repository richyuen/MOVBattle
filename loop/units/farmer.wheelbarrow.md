# farmer.wheelbarrow
Status: open   Audited: 339   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (1 since 339)
 1. crew in unit_farmer.wheelbarrow_idle are three bare team mannequins (placement cleared 346) — TABS: Farmer (liripipe hood, white socks) front, Apple Thrower (beard) behind, Traveller (brown afro, overalls) on the handles (ref: farmer.wheelbarrow.red.png)
 2. tray a plain dark box with blue band — TABS: bolted planks painted team colour, heaped with hay (ref: farmer.wheelbarrow.blue.png)
 3. wheel a black disc, no legs — TABS: cut-log wheel on braces, two legs (ref: farmer.wheelbarrow.red.png)
b FAIL (0 since 339)
 1. no crew props in unit_farmer.wheelbarrow_windup — TABS: Farmer's pitchfork, Apple Thrower's red apple (ref: farmer.wheelbarrow.blue.png)
c FAIL (0 since 339)
 1. cart stands still in _release/_flight/_struck — TABS: fast ram that runs units over (ref: card, speed 3x)
 2. missing: riders' pitchfork stab and apple throw from the moving cart (ref: farmer.wheelbarrow.png)
d PASS (cost 1000, hp 18.69x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] b crew props — blocker 1: a pitchfork in the front rider's fists, a red apple in the Apple Thrower's raised hand (reuse the pitchfork prop, a red faceted ball) — ref: farmer.wheelbarrow.blue.png — ours: unit_farmer.wheelbarrow_windup.png
2. [S] a tray — blocker 2: bolted plank tray painted team colour, heaped with a faceted hay mound — ref: farmer.wheelbarrow.blue.png — ours: unit_farmer.wheelbarrow_idle.png
3. [S] a dress the crew — blocker 1: Farmer's liripipe hood (pointed_cowl LIRIPIPE), Apple Thrower's beard, Traveller's afro and overalls; riders' head/hand material to team skin — ref: farmer.wheelbarrow.red.png — ours: unit_farmer.wheelbarrow_idle.png
4. (unranked, after the riders) [S] c ram — blocker 1 — ref: card — ours: unit_farmer.wheelbarrow_release.png
## Attempts (iter | gap | criterion | verdict)
346 | three crew on the cart, cart at man scale (WHEELBARROW) [S] (4ecb105) | a | approved
## Rejected (last 4)
## Notes (max 3 lines)
- Cart is buildWheelbarrow in vehicleBuilder: rig scaled WHEELBARROW.scale 2.2, crew are addOperator men seated by man.hip (vehicle bodies get no attachProps).
- 346 critic: riders sit down in the tray (TABS: straddle on top of the hay, legs splayed wide); red-team riders' heads/fists read pale grey-lilac.
