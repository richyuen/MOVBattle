# tribal.spear_thrower
Status: open   Audited: 315   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (2 since 315)
 1. (struck 321: tusk headband)
 2. (struck 322: ornamented loincloth)
 3. neck in unit_tribal.spear_thrower_idle is a dark flat ring — TABS: one long pale fang hanging on a strap (ref: tribal.spear_thrower.blue.png)
 4. (struck 322: tusks no longer read as horns)
b PASS (320)
c PASS (317)
d PASS (stats 317: cost 120=120, hp -12%, dmg 0%, cd 0%)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a fang necklace — blocker 3: dressTribalNecklace "fang" style, one long pale curved fang on a strap, dropping the fur collar — ref: tribal.spear_thrower.blue.png — ours: unit_tribal.spear_thrower_idle.png
## Attempts (iter | gap | criterion | verdict)
318 | spear raised overhead (b194791) | b | rejected
319 | spear stood up out of the fist (c8f0e70) | b | approved
320 | stone leaf head (4e68c1c) | b | approved
321 | tusk headband (36befcc) | a | approved
322 | ornamented loincloth (076f7fd) | a | approved
322 | [P] tusks rise 0.65, thick 0.4 (8acb32d) | a | approved
## Rejected (last 4)
- spear raised overhead [S] [1] — 318: JAVELIN_COCK alone (arm straight up) — the javelin's +y runs toward the elbow, so the shaft hung DOWN the back of the head
## Notes (max 3 lines)
- 316: LAUNCH spear 20, 9.8 + solveLowArc. 317: LAUNCH.spear.throw 220. 319: _standJavelin turns the "shaft" pi about the fist at the cock.
- 321: tuskBand (tribalDress.ts, TUSK_BAND via dressTribalHair "tusk_band"). Critic 322 (minor): tusks straight cones; do not re-nudge TUSK_BAND for 20 iterations.
- 322: in LOINCLOTHS. Critic 322 (minor): the dark hide kilt still wraps the whole hips; TABS bare sides, only the brown flap.
