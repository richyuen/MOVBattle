# farmer.potion_seller
Status: open   Audited: 339   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (1 since 339)
 2. torso in unit_farmer.potion_seller_idle plain — TABS: dark team jerkin laced at chest, two copper buttons, brown undershirt (ref: farmer.potion_seller.blue.png)
 3. feet in lineup_farmer plain — TABS: brown cuffed boots (ref: farmer.potion_seller.red.png)
b PASS (339)
c PASS (342)
d PASS (cost 340, hp 0.76x, dmg 0.11x, cd 3.50x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a jerkin — blocker 2: dark team vest laced at the chest, a copper button each side, brown undershirt V (unitFactory dress) — ref: farmer.potion_seller.blue.png — ours: unit_farmer.potion_seller_idle.png
2. [S] a boots — blocker 3: brown cuffed boots over dark hosen — ref: farmer.potion_seller.red.png — ours: lineup_farmer.png
## Attempts (iter | gap | criterion | verdict)
339 | a pale-blue potion bottle in each hand (POTION) [S] (a682e21 + 122ce87) | b | approved
341 | lobbed bottle: held potion flies (THROWS_HELD_PROP) [S] (e8afe34) | c | approved
342 | green drunk splash, drunk status (DRUNK_SPLASH, DRUNK) [S] (97ea8d4 +925e370) | c | approved
343 | close umber hair cap, hood dropped (HAIR_CAP, tribalDress) [S] (fb5c49e) | a | approved
## Rejected (last 4)
## Notes (max 3 lines)
- 343 critic: cap edge a bit high at back and sides (TABS hair to the ear tops all round). Cap is tribalDress bowlCut with HAIR_CAP shares.
- 339 critic: glass reads near-white grey, a touch small after .065; held at mid height, TABS at the thighs.
- 342 critic: splash cloud one big opaque blob hiding the victim. Drunk lives in RuntimeUnit._applyDrunk.
