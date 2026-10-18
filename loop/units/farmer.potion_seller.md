# farmer.potion_seller
Status: open   Audited: 339   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (0 since 339)
 1. head in unit_farmer.potion_seller_idle has purple pointed hood and ruff — TABS: umber-brown hair cap, no collar (ref: farmer.potion_seller.red.png)
 2. torso in unit_farmer.potion_seller_idle plain — TABS: dark team jerkin laced at chest, two copper buttons, brown undershirt (ref: farmer.potion_seller.blue.png)
 3. feet in lineup_farmer plain — TABS: brown cuffed boots (ref: farmer.potion_seller.red.png)
b PASS (339)
c PASS (342)
d PASS (cost 340, hp 0.76x, dmg 0.11x, cd 3.50x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a umber hair cap in place of the hood and ruff — blocker 1 (tribalDress BOWL can serve as a close cap) — ref: farmer.potion_seller.red.png — ours: unit_farmer.potion_seller_idle.png
2. [S] a laced dark jerkin, copper buttons, brown undershirt — blocker 2: torso dress mesh — ref: farmer.potion_seller.blue.png — ours: unit_farmer.potion_seller_idle.png
## Attempts (iter | gap | criterion | verdict)
339 | a pale-blue potion bottle in each hand (POTION) [S] (a682e21 + 122ce87) | b | approved
341 | lobbed bottle: held potion flies (THROWS_HELD_PROP) [S] (e8afe34) | c | approved
342 | green drunk splash, drunk status (DRUNK_SPLASH, DRUNK) [S] (97ea8d4 +925e370) | c | approved
## Rejected (last 4)
## Notes (max 3 lines)
- 339 critic: glass reads near-white grey, a touch small after .065; held at mid height, TABS at the thighs.
- 342 critic: splash cloud one big opaque blob hiding the victim (TABS short splash, then a green swirl over the drunk head). Drunk lives in RuntimeUnit._applyDrunk.
