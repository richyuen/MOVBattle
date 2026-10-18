# farmer.hay_baler
Status: open   Audited: 339   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (1 since 339)
 2. head in unit_farmer.hay_baler_idle wears wide grey brim hat — TABS: brown bowl-cut hair, no hat (ref: farmer.hay_baler.blue.png)
 3. scale in lineup_farmer a giant beside the farmer — TABS: average size 1.00x (ref: factions/farmer.jpg)
b FAIL (1 since 339)
 2. stick in unit_farmer.hay_baler_idle stands up behind his back and is pole-thin — TABS: thick crooked branch, forearm-thick, held level across the front at hip height in one fist (ref: farmer.hay_baler.blue.png; from cef515a/228fc78)
c FAIL (0 since 339)
 1. blow in unit_farmer.hay_baler_release/_flight is an arm/box shove — TABS: fast stick whack (ref: card, Stick cd 0.75)
d PASS (cost 140, hp 1.00x, dmg 0.59x, cd 0.38x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a bowl cut — blocker 2: brown bowl-cut hair chunk, drop straw_hat — ref: farmer.hay_baler.blue.png — ours: unit_farmer.hay_baler_idle.png
2. [P] b thicker stick, fallout of [S] cef515a — STICK.thick 0.045 -> 0.085 — NEXT shot: lineup_farmer, unit_farmer.hay_baler_windup (a thick branch)
3. [S] c stick whack — blocker 1: downward arc crossing the target in _release (340 critic: stick held up, never comes down) — ref: card — ours: unit_farmer.hay_baler_release.png
## Attempts (iter | gap | criterion | verdict)
339 | hay-bale armour worn, box dropped (HAY_BALE) [S] (5acc99a + 56a8306) | a | approved
340 | crooked stick, one-handed low carry (STICK, id hayStick) [S] (cef515a +4383754 +3d12d35 +3015a29 +228fc78) | b | approved
340 | bale clears the shoulders, HAY_BALE.top 1.6 [P] (d63de24) | a | approved
## Rejected (last 4)
## Notes (max 3 lines)
- Bale tan still a bit pale (TABS warmer golden tan). Bale is unitFactory dressHayBale.
- Stick is named "handle" (the animator turns it); named otherwise with its own rotation it hid behind the bale. Carry pick keyed on id hayStick.
