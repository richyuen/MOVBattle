# secret.bank_robbers
Status: open   Audited: 515 (AUDIT x2), 519 (RE-AUDIT a, b x2), 521 (RE-AUDIT a x2)   Done: -
## Verdicts
a FAIL (0 since 521)
 1. vault silhouette in unit_secret.bank_robbers_idle — TABS: a tall door face nearly the height of the front robber, with the vault dominating the pair's silhouette; ours is a short horizontal box (ref: secret.bank_robbers.png, secret.jpg).
 2. hats in unit_secret.bank_robbers_idle — TABS: burgundy-brown pinched cowboy crowns with upturned side brims; ours has tall black flat crowns and broad flat brims (ref: secret.bank_robbers.blue.png).
 3. face covering in unit_secret.bank_robbers_idle — TABS: a faceted maroon bandana reaches just below the eyes and tapers to a point over the neck; ours leaves the lower face bare (ref: secret.bank_robbers.blue.png).
 4. vest front in unit_secret.bank_robbers_idle — TABS: a tapered team-colour button-front vest with a deep neckline; ours has a plain angular torso and flared hem (ref: secret.bank_robbers.red.png).
 5. sleeve coverage in unit_secret.bank_robbers_idle — TABS: charcoal shirt sleeves run to turned-back cuffs near the wrists; ours leaves blue arm segments visible (ref: secret.bank_robbers.blue.png).
 6. boot shafts in unit_secret.bank_robbers_idle — TABS: broad dark leather boots with prominent cuffs up the lower shins; ours has short ankle boots (ref: secret.bank_robbers.red.png).
b PASS (520: struck 1, 2; overhead carry, pistols put away)
c FAIL (1 since 515, 1 struck)
 2. landing shockwave and cash burst in unit_secret.bank_robbers_flight — TABS: the safe bursts open with money and a 5 m shockwave; ours has none (ref: card Characteristics)
 3. safe left on the ground as a barrier in unit_secret.bank_robbers_struck — TABS: the opened safe stays then sinks; ours has none (ref: card Characteristics)
d PASS (519 stats)
## Ranked gaps
1. [S] secret.bank_robbers.a upright vault — blocker 1: portrait door nearly the front robber's height, supported at its underside.
2. [S] secret.bank_robbers.a cowboy hats — blocker 2: upturned sides and low pinched burgundy crowns.
3. [S] secret.bank_robbers.a face bandanas — blocker 3: faceted maroon cloth below each eye line.
4. [S] secret.bank_robbers.c cash burst — blocker 2: open the safe on landing and spray cash stacks.
## Attempts (iter | gap | criterion | verdict)
520 | they open by hurling the safe in an arc onto the man, shockwave, it sinks; hold fire while it flies, simulationSystem SAFE_HURL (37d214e6, 66d5e2d6) | c | approved (struck 1)
520 | both robbers carry the safe on raised fists, pistols away; flank .78 -> .95, safe over .2, RU _tendSafeCarry, animator carryOverheadAt (9ac31691, 60abe3c1) | b | approved (struck 1, 2; b PASS; a.6 struck)
518 | team vault with gold trim, dial, handle, hinges, plinth and feet over the pair, propBuilder OVERHEAD_SAFE (a9080780) | a | approved (struck 6 by lineup; 1's "none" clause cleared)
## Rejected (last 4)
## Notes (max 3 lines)
- 521: both audits still see a shallow vault.
- 520 DEFECTS: no cash trailing or bursting; no landed safe in _struck's view.
- 519 RE-AUDIT: card says "the taller one", so a slight height gap is TABS.
