# farmer.hay_baler
Status: open   Audited: 339   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (2 since 339)
 3. scale in lineup_farmer a giant beside the farmer — TABS: average size 1.00x (ref: factions/farmer.jpg)
b FAIL (1 since 339)
 2. stick in unit_farmer.hay_baler_idle / lineup_farmer slants up and back from the hip and does not show in idle — TABS: held level across the front at hip height in one fist (ref: farmer.hay_baler.blue.png; thickness cleared 341)
c PASS (343)
d PASS (cost 140, hp 1.00x, dmg 0.59x, cd 0.38x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] b level carry — blocker 2: stick held level across the front at the hips in one fist at rest — ref: farmer.hay_baler.blue.png — ours: unit_farmer.hay_baler_idle.png
2. [S] a whole-unit scale 1.00x, an average man inside the bale, bale sized off the torso — blocker 3 — ref: factions/farmer.jpg — ours: lineup_farmer.png
## Attempts (iter | gap | criterion | verdict)
339 | hay-bale armour worn, box dropped (HAY_BALE) [S] (5acc99a + 56a8306) | a | approved
340 | crooked stick, one-handed low carry (STICK, id hayStick) [S] (cef515a +4) | b | approved
340 | bale clears the shoulders, HAY_BALE.top 1.6 [P] (d63de24) | a | approved
341 | brown bowl cut, no hat (BOWL, tribalDress) [S] (f6567f9) | a | approved
341 | STICK.thick .085 [P] (ffd0fe6) | b | approved
343 | stick whack from the ear, no overhead aimed blow (STICK_WHACK) [S] (a4f19ae) | c | approved
## Rejected (last 4)
## Notes (max 3 lines)
- 343 critic: in _release the body folds ~45 deg forward (TABS trunk mostly upright). Whack is proceduralAnimation _animateWhack, gated by _whacks() (id hayStick).
- Stick is named "handle" (the animator turns it); carry pick keyed on id hayStick. Bale is unitFactory dressHayBale; scale 1.25 in unitVisuals.
- 341 critic: bowl a touch red-auburn (TABS plum-brown). Bale tan a bit pale.
