# secret.ice_mage
Status: open   Audited: 515 (AUDIT x2), 518 (RE-AUDIT a, b x2)   Done: -
## Verdicts
a FAIL (0 since 518)
 1. overall pinafore in unit_secret.ice_mage_idle — TABS: dark-red apron dress to the thigh with shoulder straps, gold studs and a gold chain; ours has a plain body (ref: secret.ice_mage.blue.png)
 2. sash with a teal round brooch in unit_secret.ice_mage_idle — TABS: team sash at the waist with a gold-rimmed teal brooch and a hanging tail; ours has none (ref: secret.ice_mage.red.png)
 3. dark shorts below the skirt in unit_secret.ice_mage_idle — TABS: dark team shorts over team legs; ours has plain legs (ref: secret.ice_mage.blue.png)
 4. fur-cuffed boots in unit_secret.ice_mage_idle — TABS: brown-red boots with cream fur cuffs; ours has pale boots (ref: secret.ice_mage.red.png)
 5. pale whitish-blue body tint in unit_secret.ice_mage_idle — TABS: team-coloured skin and sleeves (ref: secret.ice_mage.blue.png)
 6. gold studs and chain on the pinafore bib in unit_secret.ice_mage_idle — TABS: two gold shoulder studs joined by a hanging gold chain; ours has none (ref: secret.ice_mage.red.png)
b FAIL (1 since 518, 1 struck)
 2. icy glow orbs round both hands in unit_secret.ice_mage_idle — TABS: white glowing frost balls with particles at each hand; ours has none (ref: secret.ice_mage.blue.png)
c FAIL (0 since 515)
 1. projectile in unit_secret.ice_mage_release — TABS: icicle; ours is a dark arrow shaft with a steel tip (ref: card Weapons, secret.ice_mage.png)
 2. launch point in unit_secret.ice_mage_release — TABS: thrown from the open hand; ours leaves from beside the staff at chest height (ref: card Characteristics)
 3. freeze in unit_secret.ice_mage_struck — TABS: target trapped in a block of ice; ours shows a few icy spikes on the knight (ref: card Characteristics)
d PASS (519 stats)
## Ranked gaps
1. [S] secret.ice_mage.b frost balls — blocker 2: unlit white glowing ball at each hand (secretDress) — ref: secret.ice_mage.blue.png — ours: unit_secret.ice_mage_idle
2. [S] secret.ice_mage.c icicle projectile — blocker 1: pale-blue faceted icicle missile instead of the arrow (projectileSystem dress) — ref: secret.ice_mage.png — ours: unit_secret.ice_mage_release
3. [S] secret.ice_mage.a pinafore — blocker 1: dark-red strapped apron dress to the thigh (secretDress) — ref: secret.ice_mage.blue.png — ours: unit_secret.ice_mage_idle
## Attempts (iter | gap | criterion | verdict)
519 | staff off, both hands empty and open, unitVisuals weapon none (cddeb53a) | b | approved (struck 1)
517 | long cream-white hair, dome cap, fringe, side locks, hood off, secretDress iceMageHair (c46885b9, b82fd72b) | a | approved (struck 1)
## Rejected (last 4)
## Notes (max 3 lines)
- 517 DEFECTS: hair cap and locks blocky square slabs up close; TABS tapers in points along the face.
- a.5 is the secret_ice materialPreset (pale tint): a team-material body fixes it with the pinafore.
