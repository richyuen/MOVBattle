# secret.raptor_rider
Status: open   Audited: 515 (AUDIT x2), 519 (RE-AUDIT a, b x2)   Done: -
## Verdicts
a FAIL (0 since 519)
 1. rider's build in unit_secret.raptor_rider_idle — TABS: lanky Wobbler with a narrow bare chest and long thin arms; ours is a square slab torso wider than the raptor's neck (ref: secret.raptor_rider.red.png)
 2. rider's head in unit_secret.raptor_rider_idle — TABS: team face with brown shoulder-length hair; ours is a grey-beige lumpy mask/helmet (ref: secret.raptor_rider.blue.png)
 3. green-black feather headdress in unit_secret.raptor_rider_idle — TABS: upright fan of dark feathers on a headband; ours has none (ref: secret.raptor_rider.red.png)
 4. cord necklace with a green feather pendant in unit_secret.raptor_rider_idle — TABS: dark cord at the neck with a green leaf/feather charm (card Appearance "tribal trinkets"); ours has a bare neck (ref: secret.raptor_rider.blue.png)
 5. fur loincloth in unit_secret.raptor_rider_idle — TABS: bare team torso over a dark fur loincloth; ours is a team box tunic (ref: secret.raptor_rider.jpg)
b FAIL (1 since 519, 1 struck)
 1. spear in unit_secret.raptor_rider_idle — TABS: short wooden spear with a dark knapped stone head and wrist binding; ours is a long thin pole with a steel leaf tip, taller than the man (ref: secret.raptor_rider.red.png)
 3. plank shield wood in unit_secret.raptor_rider_idle — TABS: mid red-brown weathered planks; ours is a near-black board, its planks unreadable behind the glowing white bones (ref: secret.raptor_rider.red.png)
c FAIL (0 since 515)
 1. trample bursts under the mount in unit_secret.raptor_rider_release/_flight — TABS: cavalry trample explosions where it runs; ours has none (ref: card Characteristics)
 2. charging mount in unit_secret.raptor_rider_release/_flight — TABS: the raptor runs the rider into the target (hit-and-run); ours has the box static while the rider thrusts from a standing pose (ref: secret.raptor_rider.jpg)
d PASS (519 stats)
## Ranked gaps
1. [S] secret.raptor_rider.b spear — blocker 1: short wooden spear with a knapped stone head and wrist binding
2. [S] secret.raptor_rider.a rider's build — blocker 1: lanky narrow bare-chested torso with long thin arms
3. [S] secret.raptor_rider.c charging mount — blocker 2: the raptor runs the rider through the target
4. [P] secret.raptor_rider.b plank wood shade — blocker 3: PLANK_SHIELD.wood to about (0.45, 0.22, 0.14), bones out of the glow (fallout of [S] 604033c4)
## Attempts (iter | gap | criterion | verdict)
519 | plank shield of four rough boards, lashed crossed bones, skull, stood upright on the off side of the trunk, propBuilder PLANK_SHIELD (604033c4, 135e2158) | b | approved (struck 2; added 3 wood shade)
518 | dark raptor mount, open toothed jaw, spikes, two-jointed legs, rider lifted onto its back, propBuilder buildRaptorMount RAPTOR_MOUNT (8e341463) | a | approved (struck 1, 4 by lineup)
## Rejected (last 4)
## Notes (max 3 lines)
- 518: the mount is a linked actor with the rider's id: gate dress on visual.special.
- 519: audit2 flags the hide colour (TABS near-black olive-grey, ours maroon); audit 1 no blocker.
