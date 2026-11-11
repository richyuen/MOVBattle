# secret.raptor_rider
Status: open   Audited: 515 (AUDIT x2)   Done: -
## Verdicts
a FAIL (1 since 515, 2 struck)
 2. rider's head in unit_secret.raptor_rider_idle — TABS: team face with brown shoulder-length hair; ours is a grey lumpy mask/helmet (ref: secret.raptor_rider.blue.png)
 3. green-black feather headdress in unit_secret.raptor_rider_idle — TABS: upright fan of dark feathers on a headband; ours has none (ref: secret.raptor_rider.red.png)
 5. fur loincloth in unit_secret.raptor_rider_idle — TABS: bare team torso over a dark fur loincloth; ours is a team box tunic (ref: secret.raptor_rider.jpg)
b FAIL (0 since 515)
 1. spear in unit_secret.raptor_rider_idle — TABS: short wooden spear with a dark knapped stone head and wrist binding; ours is a long thin pole with a steel leaf tip, taller than the man (ref: secret.raptor_rider.red.png)
 2. off-hand shield in unit_secret.raptor_rider_idle — TABS: tall wooden plank shield with lashed bones and a skull; ours has an empty off hand (ref: secret.raptor_rider.red.png)
c FAIL (0 since 515)
 1. trample bursts under the mount in unit_secret.raptor_rider_release/_flight — TABS: cavalry trample explosions where it runs; ours has none (ref: card Characteristics)
 2. charging mount in unit_secret.raptor_rider_release/_flight — TABS: the raptor runs the rider into the target (hit-and-run); ours has the box static while the rider thrusts from a standing pose (ref: secret.raptor_rider.jpg)
d PASS (518 stats)
## Ranked gaps
1. [S] secret.raptor_rider.a head — blocker 2: team face with brown shoulder-length hair, bone_mask hat off (secretDress) — ref: reference/units/secret.raptor_rider.blue.png — ours: unit_secret.raptor_rider_idle.png
2. [S] secret.raptor_rider.a headdress — blocker 3: upright fan of dark green-black feathers on a headband — ref: reference/units/secret.raptor_rider.red.png — ours: unit_secret.raptor_rider_idle.png
3. [S] secret.raptor_rider.b plank shield — blocker 2: tall wooden plank shield with lashed bones and a skull on the off arm — ref: reference/units/secret.raptor_rider.red.png — ours: unit_secret.raptor_rider_idle.png
## Attempts (iter | gap | criterion | verdict)
518 | dark raptor mount, open toothed jaw, spikes, two-jointed legs, rider lifted onto its back, propBuilder buildRaptorMount RAPTOR_MOUNT (8e341463) | a | approved (struck 1, 4 by lineup)
## Rejected (last 4)
## Notes (max 3 lines)
- 518: the mount is a linked actor sharing the rider's definition id; the rider's hip lift is gated on visual.special !== raptor_mount (unitFactory).
- 518 DEFECTS: the raptor trunk is lean with thin legs; TABS heavy, deep-chested, nearly as wide as the rider's shoulders. The mount's legs are static (no walk).
