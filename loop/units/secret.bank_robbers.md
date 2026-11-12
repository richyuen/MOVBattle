# secret.bank_robbers
Status: open   Audited: 515 (AUDIT x2), 519 (RE-AUDIT a, b x2), 521 (RE-AUDIT a x2)   Done: -
## Verdicts
a FAIL (1 since 521, 2 struck)
 2. hats in unit_secret.bank_robbers_idle — TABS: burgundy-brown pinched cowboy crowns with upturned side brims; ours has tall black flat crowns and broad flat brims (ref: secret.bank_robbers.blue.png).
 4. vest front in unit_secret.bank_robbers_idle — TABS: a tapered team-colour button-front vest with a deep neckline; ours has a plain angular torso and flared hem (ref: secret.bank_robbers.red.png).
 5. sleeve coverage in unit_secret.bank_robbers_idle — TABS: charcoal shirt sleeves run to turned-back cuffs near the wrists; ours leaves blue arm segments visible (ref: secret.bank_robbers.blue.png).
 6. boot shafts in unit_secret.bank_robbers_idle — TABS: broad dark leather boots with prominent cuffs up the lower shins; ours has short ankle boots (ref: secret.bank_robbers.red.png).
b PASS (520: struck 1, 2; overhead carry, pistols put away)
c FAIL (1 since 515, 1 struck)
 2. landing shockwave and cash burst in unit_secret.bank_robbers_flight — TABS: the safe bursts open with money and a 5 m shockwave; ours has none (ref: card Characteristics)
 3. safe left on the ground as a barrier in unit_secret.bank_robbers_struck — TABS: the opened safe stays then sinks; ours has none (ref: card Characteristics)
d PASS (519 stats)
## Ranked gaps
1. [S] secret.bank_robbers.a cowboy hats — blocker 2: upturned sides and low pinched burgundy crowns.
2. [S] secret.bank_robbers.c cash burst — blocker 2: open the safe on landing and spray cash stacks.
## Attempts (iter | gap | criterion | verdict)
522 | portrait vault with an inset hinged door (7bca30d3) | a | approved (struck 1 and 3 by lineup)
520 | they open by hurling the safe in an arc onto the man, shockwave, it sinks; hold fire while it flies, simulationSystem SAFE_HURL (37d214e6, 66d5e2d6) | c | approved (struck 1)
520 | both robbers carry the safe on raised fists, pistols away; flank .78 -> .95, safe over .2, RU _tendSafeCarry, animator carryOverheadAt (9ac31691, 60abe3c1) | b | approved (struck 1, 2; b PASS; a.6 struck)
518 | team vault with gold trim, dial, handle, hinges, plinth and feet over the pair, propBuilder OVERHEAD_SAFE (a9080780) | a | approved (struck 6 by lineup; 1's "none" clause cleared)
## Rejected (last 4)
## Notes (max 3 lines)
- 522: idle frame fits the taller vault (187228c2). Face covering unresolvable in lineup.
- 520 DEFECTS: no cash trailing or bursting; no landed safe in _struck's view.
- 519 RE-AUDIT: card says "the taller one", so a slight height gap is TABS.
