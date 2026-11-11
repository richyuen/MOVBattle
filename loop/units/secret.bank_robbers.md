# secret.bank_robbers
Status: open   Audited: 515 (AUDIT x2), 519 (RE-AUDIT a, b x2)   Done: -
## Verdicts
a FAIL (0 since 519, 1 struck)
 1. safe size in unit_secret.bank_robbers_idle — TABS: a vault nearly as long as the man is tall and wider than both robbers' shoulders; ours is a box about half a robber's height, narrower than the front robber's hat brim (ref: secret.bank_robbers.png)
 2. hats in unit_secret.bank_robbers_idle — TABS: head-sized red-brown cowboy hats; ours wear huge black flat-crown hats wider than the shoulders (ref: secret.bank_robbers.blue.png)
 3. bandana over the lower face in unit_secret.bank_robbers_idle — TABS: maroon bandana up to the eyes; ours has none (ref: secret.bank_robbers.red.png)
 4. buttoned vest over a grey shirt in unit_secret.bank_robbers_idle — TABS: team vest with buttons and grey sleeves; ours has a plain team torso (ref: secret.bank_robbers.blue.png)
 5. cowboy boots in unit_secret.bank_robbers_idle — TABS: dark brown tall boots; ours has team feet (ref: secret.bank_robbers.red.png)
b PASS (520: struck 1, 2; overhead carry, pistols put away)
c FAIL (1 since 515, 1 struck)
 2. landing shockwave and cash burst in unit_secret.bank_robbers_flight — TABS: the safe bursts open with money and a 5 m shockwave; ours has none (ref: card Characteristics)
 3. safe left on the ground as a barrier in unit_secret.bank_robbers_struck — TABS: the opened safe stays then sinks; ours has none (ref: card Characteristics)
d PASS (519 stats)
## Ranked gaps
1. [S] secret.bank_robbers.c cash burst — blocker 2: opened safe on landing and a spray of cash-stack boxes — ref: card Characteristics — ours: unit_secret.bank_robbers_struck.png
2. [S] secret.bank_robbers.a bandana — blocker 3: maroon bandana chunk over the lower face up to the eyes — ref: secret.bank_robbers.red.png — ours: unit_secret.bank_robbers_idle.png
3. [S] secret.bank_robbers.a hats — blocker 2: replace the black flat-crown hat with a head-sized red-brown cowboy hat (pinched crown, upturned side brim)
## Attempts (iter | gap | criterion | verdict)
520 | they open by hurling the safe in an arc onto the man, shockwave, it sinks; hold fire while it flies, simulationSystem SAFE_HURL (37d214e6, 66d5e2d6) | c | approved (struck 1)
520 | both robbers carry the safe on raised fists, pistols away; flank .78 -> .95, safe over .2, RU _tendSafeCarry, animator carryOverheadAt (9ac31691, 60abe3c1) | b | approved (struck 1, 2; b PASS; a.6 struck)
518 | team vault with gold trim, dial, handle, hinges, plinth and feet over the pair, propBuilder OVERHEAD_SAFE (a9080780) | a | approved (struck 6 by lineup; 1's "none" clause cleared)
## Rejected (last 4)
## Notes (max 3 lines)
- 520: carry changed (fists up, safe lower): RE-AUDIT a at 521. After the hurl they draw pistols (TABS fists; c-side).
- 520 DEFECTS: no cash trailing or bursting; no landed safe in _struck's view.
- 519 RE-AUDIT: card says "the taller one", so a slight height gap is TABS.
