# secret.ice_mage
Status: open   Audited: 515 (AUDIT x2), 518 (RE-AUDIT a, b x2)   Done: -
## Verdicts
a FAIL (2 since 518, 2 struck)
 2. sash with a teal round brooch in unit_secret.ice_mage_idle — TABS: team sash at the waist with a gold-rimmed teal brooch and a hanging tail; ours has none (ref: secret.ice_mage.red.png)
 3. dark shorts below the skirt in unit_secret.ice_mage_idle — TABS: dark team shorts over team legs; ours has plain legs (ref: secret.ice_mage.blue.png)
 4. fur-cuffed boots in unit_secret.ice_mage_idle — TABS: brown-red boots with cream fur cuffs; ours has pale boots (ref: secret.ice_mage.red.png)
 5. pale whitish-blue body tint in unit_secret.ice_mage_idle — TABS: team-coloured skin and sleeves (ref: secret.ice_mage.blue.png)
b PASS (521)
c FAIL (2 since 515, 2 struck)
 2. launch point in unit_secret.ice_mage_release — TABS: thrown from the open hand; ours leaves from beside the staff at chest height (ref: card Characteristics)
d PASS (519 stats)
## Ranked gaps
1. [S] secret.ice_mage.c launch — blocker 2: spawn the icicle at the throwing palm after its release pose.
2. [S] secret.ice_mage.a sash — blocker 2: team sash with hanging ends and a gold-rimmed teal brooch.
## Attempts (iter | gap | criterion | verdict)
523 | translucent faceted block enclosing the struck rig (73fc448f) | c | approved (struck 3)
522 | brass strap studs with a draped chain (1b6811a1) | a | approved (struck 1, 6)
521 | hang a strapped pinafore with a flared skirt (d14602dd, 9615069e) | a | approved (pinafore visible, studs and chain remain)
521 | cluster frosted glow orbs at both hands (fca3b6fb) | b | approved (struck 2, b PASS)
520 | pale-blue faceted icicle with splinters at its butt, not a dark bolt, projectileSystem _dressIcicle ICICLE (d0b30045) | c | approved (struck 1)
519 | staff off, both hands empty and open, unitVisuals weapon none (cddeb53a) | b | approved (struck 1)
517 | long cream-white hair, dome cap, fringe, side locks, hood off, secretDress iceMageHair (c46885b9, b82fd72b) | a | approved (struck 1)
## Rejected (last 4)
## Notes (max 3 lines)
- 520 DEFECTS: the icicle leaves at chest height by her shoulder while both fists are low at her waist (c.2).
- 517 DEFECTS: hair slabs blocky up close; TABS tapers in points.
- a.5 is the secret_ice materialPreset tint: a team body fixes it with the pinafore.
