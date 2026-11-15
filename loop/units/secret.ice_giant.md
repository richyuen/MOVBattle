# secret.ice_giant
Status: open   Audited: 538 (AUDIT x2), 550 (CONFIRM: passed b, c; failed a)   Done: -
## Verdicts
a FAIL (0 since 550, CONFIRM list)
 1. legs too long in unit_secret.ice_giant_idle: belt-to-sole about 1.5x the shoulder-to-belt torso — TABS: ape build, a huge snow torso over short legs about half the torso's length (ref: secret.ice_giant.red.png, .jpg)
 2. arms too short in unit_secret.ice_giant_idle: the hanging fists reach only mid-thigh — TABS: "giant long arms", about twice the leg length, knuckles near the ground in the lineup (ref: secret.ice_giant.blue.png, reference/factions/secret.jpg right end, card Appearance)
 3. torso below the snow mantle is a pale washed-out blue/grey in unit_secret.ice_giant_idle — TABS: saturated team colour flanks the snow V down to the belt (ref: secret.ice_giant.red.png)
 4. pale tunic-hem panel below the belt over the crotch in unit_secret.ice_giant_idle — TABS: team-coloured legs come straight out of a broad team-coloured belt (ref: secret.ice_giant.blue.png)
b PASS (543: struck 2; CONFIRM 550)
c PASS (549: struck 3; CONFIRM 550)
d PASS (544 stats)
## Ranked gaps
1. [S] secret.ice_giant.a proportions — blockers 1+2: height from a longer trunk and ICE_APE arms (knuckles near the ground), legs back toward ~.5 of the trunk; keep the head over the tree giant's 4.3 m — ref: secret.ice_giant.red.png, secret.jpg — ours: unit_secret.ice_giant_idle.png
2. [S] secret.ice_giant.a hem panel — blocker 4: the pale panel under the belt off, a broad team belt — ref: secret.ice_giant.blue.png — ours: unit_secret.ice_giant_idle.png
3. [S] secret.ice_giant.a torso flanks — blocker 3 (colour-only: --noglow swatch): saturated team trunk beside the snow V — ref: secret.ice_giant.red.png — ours: unit_secret.ice_giant_idle.png
## Attempts (iter | gap | criterion | verdict)
550 | legs .92 -> 1.4, trunk 1.3, tallest of the faction (56982960) | a | approved (struck 5, a PASS; CONFIRM failed a: legs too long, arms too short)
549 | overhead long-arm slam ICE_SLAM (94a04464) | c | approved (struck 3, c PASS)
548 | mantle clearance and pointed icicle badge (c9d01196) | a | approved (struck 4)
548 | face-origin cone that freezes enemies (0dc76c7c) | c | approved (struck 2)
547 | belt, badge and paired hip shields (5858fc91, ad2a5e5c) | a | approved
546 | shallow faceted snow cap (36bb1488) | a | approved (struck 2)
541-544 | ape rig ICE_APE, club fists, snow mantle, punch shockwave | a, b, c | approved
## Rejected (last 4)
## Notes (max 3 lines)
- ICE_FIST row spent for [P].
- 550: the gap critic approved the long legs for height; the CONFIRM eye wants the height from trunk and arms instead (ape build).
- 549 critic: the slam's ground shockwave is a few shards, no ring.
