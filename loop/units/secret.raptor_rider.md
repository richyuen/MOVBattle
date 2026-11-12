# secret.raptor_rider
Status: open   Audited: 515 (AUDIT x2), 519 (RE-AUDIT a, b x2)   Done: -
## Verdicts
a FAIL (1 since 519, 2 struck)
 2. rider's head in unit_secret.raptor_rider_idle — TABS: team face with brown shoulder-length hair; ours is a grey-beige lumpy mask/helmet (ref: secret.raptor_rider.blue.png)
 3. green-black feather headdress in unit_secret.raptor_rider_idle — TABS: upright fan of dark feathers on a headband; ours has none (ref: secret.raptor_rider.red.png)
 5. fur loincloth in unit_secret.raptor_rider_idle — TABS: bare team torso over a dark fur loincloth; ours is a team box tunic (ref: secret.raptor_rider.jpg)
b PASS (524: struck 3, weathered red-brown planks)
c FAIL (1 since 515, 1 struck)
 1. trample bursts under the mount in unit_secret.raptor_rider_release/_flight — TABS: cavalry trample explosions where it runs; ours has none (ref: card Characteristics)
d PASS (519 stats)
## Ranked gaps
1. [S] secret.raptor_rider.c trample bursts — blocker 1: dust/explosion bursts at the mount's feet while charging (the sim already logs "trample" at 1150 ms; make it visible) — ref: card Characteristics — ours: unit_secret.raptor_rider_release
2. [S] secret.raptor_rider.a feather headdress — blocker 3: an upright fan of dark green-black feathers on a headband — ref: secret.raptor_rider.red.png — ours: unit_secret.raptor_rider_idle
3. [S] secret.raptor_rider.a rider's head — blocker 2: replace the grey-beige mask with a team face and brown shoulder-length hair — ref: secret.raptor_rider.blue.png — ours: unit_secret.raptor_rider_idle
## Attempts (iter | gap | criterion | verdict)
524 | four red-brown planks each its own shade, grain, splintered tops, bones out of the glow, propBuilder PLANK_WEATHER (fb46a15f) | b | approved (struck 3, b PASS)
523 | short wooden spear, lashed faceted stone tip (5472e586) | b | approved (struck 1)
521 | give the rider a narrow bare torso and long thin arms (307b20ca) | a | approved (struck 1 and 4 by lineup)
520 | raptor runs him through his man and on, legs striding, simulationSystem RAPTOR_CHARGE, RU _tendRaptorGait (2adeaa70) | c | approved (struck 2)
519 | plank shield of four rough boards, lashed crossed bones, skull, propBuilder PLANK_SHIELD (604033c4, 135e2158) | b | approved (struck 2; added 3 wood shade)
518 | dark raptor mount, open toothed jaw, spikes, two-jointed legs, propBuilder buildRaptorMount RAPTOR_MOUNT (8e341463) | a | approved (struck 1, 4 by lineup)
## Rejected (last 4)
## Notes (max 3 lines)
- 518: the mount is a linked actor with the rider's id: gate dress on visual.special.
- 519: audit2 flags the hide colour (TABS near-black olive-grey, ours maroon); audit 1 no blocker.
- c last attempted 520: starving in 526 (pick it in 525).
