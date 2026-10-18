# farmer.hay_baler
Status: open   Audited: 339   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (2 since 339)
 3. scale in lineup_farmer a giant beside the farmer — TABS: average size 1.00x (ref: factions/farmer.jpg)
b FAIL (1 since 339)
 2. stick in unit_farmer.hay_baler_idle / lineup_farmer slants up and back from the hip and does not show in idle — TABS: held level across the front at hip height in one fist (ref: farmer.hay_baler.blue.png; thickness cleared 341)
c FAIL (0 since 339)
 1. blow in unit_farmer.hay_baler_release/_flight is an arm/box shove — TABS: fast stick whack (ref: card, Stick cd 0.75)
d PASS (cost 140, hp 1.00x, dmg 0.59x, cd 0.38x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] c stick whack — blocker 1: a fast one-handed swing whose stick head lands the hit — ref: card Weapons — ours: unit_farmer.hay_baler_release.png
2. [S] b level carry — blocker 2: stick horizontal across the front at the hips at rest — ref: farmer.hay_baler.blue.png — ours: lineup_farmer.png
3. [S] a whole-unit scale 1.00x, bale bulk carried by the bale mesh not body scale — blocker 3 — ref: factions/farmer.jpg — ours: lineup_farmer.png
## Attempts (iter | gap | criterion | verdict)
339 | hay-bale armour worn, box dropped (HAY_BALE) [S] (5acc99a + 56a8306) | a | approved
340 | crooked stick, one-handed low carry (STICK, id hayStick) [S] (cef515a +4383754 +3d12d35 +3015a29 +228fc78) | b | approved
340 | bale clears the shoulders, HAY_BALE.top 1.6 [P] (d63de24) | a | approved
341 | brown bowl cut, no hat (BOWL, tribalDress) [S] (f6567f9) | a | approved
341 | STICK.thick .085 [P] (ffd0fe6) | b | approved
## Rejected (last 4)
## Notes (max 3 lines)
- Bale tan still a bit pale (TABS warmer golden tan). Bale is unitFactory dressHayBale. 341 critic: bowl a touch red-auburn (TABS plum-brown).
- Stick is named "handle" (the animator turns it); named otherwise with its own rotation it hid behind the bale. Carry pick keyed on id hayStick.
