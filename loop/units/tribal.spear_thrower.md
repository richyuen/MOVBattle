# tribal.spear_thrower
Status: open   Audited: 315   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (1 since 315)
 1. (struck 321: tusk headband)
 2. loincloth in unit_tribal.spear_thrower_idle is a plain dark box — TABS: brown loincloth with rope belt, a skull at the centre and bones each side (ref: tribal.spear_thrower.red.png)
 3. neck in unit_tribal.spear_thrower_idle is a dark flat ring — TABS: one long pale fang hanging on a strap (ref: tribal.spear_thrower.blue.png)
 4. tusks in unit_tribal.spear_thrower_idle are thin spikes rising half a head over the crown, reading as horns — TABS: thick pale tusks along the sides of the head, jaw to just over the crown (ref: tribal.spear_thrower.blue.png) — introduced by 36befcc
b PASS (320)
c PASS (317)
d PASS (stats 317: cost 120=120, hp -12%, dmg 0%, cd 0%)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a loincloth — blocker 2: add the unit to dressTribalLoincloth's LOINCLOTHS (rope, skull at the centre, bones each side) — ref: tribal.spear_thrower.red.png — ours: unit_tribal.spear_thrower_idle.png
2. [S] a fang necklace — blocker 3: a "fang" style in dressTribalNecklace, one long pale curved tooth on a long strap to mid-chest — ref: tribal.spear_thrower.blue.png — ours: unit_tribal.spear_thrower_idle.png
3. [P] a tusks (fallout of 36befcc) — blocker 4: TUSK_BAND rise 1.1 -> 0.65, thick 0.28 -> 0.4 — NEXT: shows in unit_tribal.spear_thrower_idle as the tips dropping to just over the crown
## Attempts (iter | gap | criterion | verdict)
317 | stick-and-launch (6f13b5a) | c | approved
318 | spear raised overhead (b194791) | b | rejected
319 | spear stood up out of the fist (c8f0e70) | b | approved
320 | stone leaf head (4e68c1c) | b | approved
321 | tusk headband (36befcc) | a | approved
## Rejected (last 4)
- spear raised overhead [S] [1] — 318: JAVELIN_COCK alone (arm straight up) — the javelin's +y runs toward the elbow, so the shaft hung DOWN the back of the head
## Notes (max 3 lines)
- 316: LAUNCH spear 20, 9.8 + solveLowArc. 317: LAUNCH.spear.throw 220. 319: _standJavelin turns the "shaft" pi about the fist at the cock; the javelin's +y runs fist -> elbow.
- 320: javelin "tip" is a jittered flat icosphere leaf (JAVELIN_LEAF). Critic 320 (minor): leaf a little paler than the reference's charcoal.
- 321: tuskBand (tribalDress.ts, TUSK_BAND, through dressTribalHair "tusk_band", which also drops the mop).
