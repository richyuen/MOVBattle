# farmer.hay_baler
Status: open   Audited: 339   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (1 since 339)
 2. head in unit_farmer.hay_baler_idle wears wide grey brim hat — TABS: brown bowl-cut hair, no hat (ref: farmer.hay_baler.blue.png)
 3. scale in lineup_farmer a giant beside the farmer — TABS: average size 1.00x (ref: factions/farmer.jpg)
 4. upper arms in unit_farmer.hay_baler_idle/_flight lie across the bale's front face — TABS: bale wider than the shoulders, arms out of its sides (ref: farmer.hay_baler.red.png; from 5acc99a)
b FAIL (0 since 339)
 1. main hand in unit_farmer.hay_baler_idle/_windup is empty — TABS: crooked wooden stick one-handed (ref: farmer.hay_baler.blue.png)
c FAIL (0 since 339)
 1. blow in unit_farmer.hay_baler_release/_flight is an arm/box shove — TABS: fast stick whack (ref: card, Stick cd 0.75)
d PASS (cost 140, hp 1.00x, dmg 0.59x, cd 0.38x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] b crooked stick — blocker 1: one-handed bent wooden stick in the empty main hand — ref: farmer.hay_baler.blue.png — ours: unit_farmer.hay_baler_windup.png
2. [S] a bowl cut — blocker 2: brown bowl-cut hair, drop straw_hat — ref: farmer.hay_baler.blue.png — ours: unit_farmer.hay_baler_idle.png
3. [P] a bale clears the shoulders — blocker 4: HAY_BALE.top 1.25 -> ~1.6 (bottom to match), fallout of [S] 339.4 (5acc99a) — NEXT shot: unit_farmer.hay_baler_idle (arms at the bale sides)
## Attempts (iter | gap | criterion | verdict)
339 | hay-bale armour worn, box dropped (HAY_BALE) [S] (5acc99a + 56a8306) | a | approved
## Rejected (last 4)
## Notes (max 3 lines)
- 339 critic: tan still pale cream (TABS warmer golden tan, brown top of big flat blades). Bale is unitFactory dressHayBale.
