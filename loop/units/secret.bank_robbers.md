# secret.bank_robbers
Status: open   Audited: 515 (AUDIT x2), 519 (RE-AUDIT a, b x2)   Done: -
## Verdicts
a FAIL (0 since 519)
 1. safe size in unit_secret.bank_robbers_idle — TABS: a vault nearly as long as the man is tall and wider than both robbers' shoulders; ours is a box about half a robber's height, narrower than the front robber's hat brim (ref: secret.bank_robbers.png)
 2. hats in unit_secret.bank_robbers_idle — TABS: head-sized red-brown cowboy hats; ours wear huge black flat-crown hats wider than the shoulders (ref: secret.bank_robbers.blue.png)
 3. bandana over the lower face in unit_secret.bank_robbers_idle — TABS: maroon bandana up to the eyes; ours has none (ref: secret.bank_robbers.red.png)
 4. buttoned vest over a grey shirt in unit_secret.bank_robbers_idle — TABS: team vest with buttons and grey sleeves; ours has a plain team torso (ref: secret.bank_robbers.blue.png)
 5. cowboy boots in unit_secret.bank_robbers_idle — TABS: dark brown tall boots; ours has team feet (ref: secret.bank_robbers.red.png)
 6. the second robber is about four-fifths the first's height in unit_secret.bank_robbers_idle — TABS: two near-equal men side by side under the safe (ref: secret.bank_robbers.png)
b FAIL (0 since 519)
 1. overhead safe carry in unit_secret.bank_robbers_windup — TABS: both men with hands raised under the safe; ours both point pistols forward (ref: secret.bank_robbers.png)
 2. drawn pistols in unit_secret.bank_robbers_idle — TABS: guns holstered at the hip (no weapons listed); ours hold pistols out (ref: card Weapons, secret.bank_robbers.red.png)
c FAIL (0 since 515)
 1. missing: safe hurl — summary records only a pistol "burst", and unit_secret.bank_robbers_release shows muzzle flash (ref: card Characteristics)
 2. landing shockwave and cash burst in unit_secret.bank_robbers_flight — TABS: the safe bursts open with money and a 5 m shockwave; ours has none (ref: card Characteristics)
 3. safe left on the ground as a barrier in unit_secret.bank_robbers_struck — TABS: the opened safe stays then sinks; ours has none (ref: card Characteristics)
d PASS (519 stats)
## Ranked gaps
1. [S] secret.bank_robbers.b overhead safe carry — blocker 1: an arms-up carry pose for both robbers, with the safe parented to their raised hands
2. [S] secret.bank_robbers.a hats — blocker 2: replace the black flat-crown hat with a head-sized red-brown cowboy hat (pinched crown, upturned side brim)
3. [S] secret.bank_robbers.a bandana — blocker 3: a maroon cloth wedge over the lower face up to the eyes (in secretDress.ts)
## Attempts (iter | gap | criterion | verdict)
518 | team vault with gold trim, dial, handle, hinges, plinth and feet over the pair, propBuilder buildOverheadSafe OVERHEAD_SAFE (a9080780) | a | approved (struck 6 by lineup; 1's "none" clause cleared)
## Rejected (last 4)
## Notes (max 3 lines)
- 518: the safe actor's own hat and pistol hang beside it in windup: hide them; grow the safe on raised hands (b.1).
- 519 RE-AUDIT: card says "the taller one", so a slight height gap is TABS; four-fifths is too much. The safe sits above head+.3: re-audit a after a carry change.
