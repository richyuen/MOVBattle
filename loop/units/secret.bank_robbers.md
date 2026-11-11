# secret.bank_robbers
Status: open   Audited: 515 (AUDIT x2)   Done: -
## Verdicts
a FAIL (1 since 515, 1 struck)
 1. safe in unit_secret.bank_robbers_idle — TABS: huge team-coloured vault with gold trim, dial and hinges held overhead by the pair; ours has none (ref: secret.bank_robbers.red.png)
 2. hats in unit_secret.bank_robbers_idle — TABS: head-sized red-brown cowboy hats; ours wear huge black flat-crown hats wider than the shoulders (ref: secret.bank_robbers.blue.png)
 3. bandana over the lower face in unit_secret.bank_robbers_idle — TABS: maroon bandana up to the eyes; ours has none (ref: secret.bank_robbers.red.png)
 4. buttoned vest over a grey shirt in unit_secret.bank_robbers_idle — TABS: team vest with buttons and grey sleeves; ours has a plain team torso (ref: secret.bank_robbers.blue.png)
 5. cowboy boots in unit_secret.bank_robbers_idle — TABS: dark brown tall boots; ours has team feet (ref: secret.bank_robbers.red.png)
 7. the second robber is about four-fifths the first's height in unit_secret.bank_robbers_idle — TABS: two near-equal men side by side under the safe (ref: secret.bank_robbers.png)
b FAIL (0 since 515)
 1. overhead safe carry in unit_secret.bank_robbers_windup — TABS: both men with hands raised under the safe; ours both point pistols forward (ref: secret.bank_robbers.png)
 2. drawn pistols in unit_secret.bank_robbers_idle — TABS: guns holstered at the hip (no weapons listed); ours hold pistols out (ref: card Weapons, secret.bank_robbers.red.png)
c FAIL (0 since 515)
 1. missing: safe hurl — summary records only a pistol "burst", and unit_secret.bank_robbers_release shows muzzle flash (ref: card Characteristics)
 2. landing shockwave and cash burst in unit_secret.bank_robbers_flight — TABS: the safe bursts open with money and a 5 m shockwave; ours has none (ref: card Characteristics)
 3. safe left on the ground as a barrier in unit_secret.bank_robbers_struck — TABS: the opened safe stays then sinks; ours has none (ref: card Characteristics)
d PASS (518 stats)
## Ranked gaps
1. [S] secret.bank_robbers.b overhead carry — blocker 1: both men's hands raised under a man-sized safe, pistols holstered — ref: reference/units/secret.bank_robbers.png — ours: unit_secret.bank_robbers_windup.png
2. [S] secret.bank_robbers.a hats — blocker 2: head-sized red-brown cowboy hats — ref: reference/units/secret.bank_robbers.blue.png — ours: unit_secret.bank_robbers_idle.png
## Attempts (iter | gap | criterion | verdict)
518 | team vault with gold trim, dial, handle, hinges, plinth and feet over the pair, propBuilder buildOverheadSafe OVERHEAD_SAFE (a9080780) | a | approved (struck 6 by lineup; 1's "none" clause cleared)
## Rejected (last 4)
## Notes (max 3 lines)
- 518 DEFECTS: safe far too small (a hat-brim wide, a third of his height; TABS man-tall, wider than the pair) and floats offset behind them; the hidden safe actor's own hat and pistol hang in the air beside it in windup.
- 518: a.1 stands on size and carry: grow it to ~1.0 Hh x 1.2 Hh resting on raised hands (with b.1) and hide the safe actor's props. The safe sits above head+.3: RE-AUDIT a after.
