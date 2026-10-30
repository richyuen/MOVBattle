# dynasty.dragon
Status: open   Audited: 411, 419 (CONFIRM: failed a, b, c), 420 (RE-AUDIT a, b, c), 429 (CONFIRM: failed a)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (0 since 429; the CONFIRM 429 list) plateau (CONFIRM failed a twice: 419, 429)
 1. head in unit_dynasty.dragon_idle is a rectangular box snout on a sphere skull — TABS: a bulbous lion-dog head with round puffed cheeks, a beaked nose and a heavy cream-patterned brow (ref: reference/units/dynasty.dragon.red.png)
 2. body in unit_dynasty.dragon_idle is a flat rectangular slab with a sawtooth top edge — TABS: a long curving tubular body with a scalloped dorsal fin and frilled underside, tapering back (ref: reference/units/dynasty.dragon.jpg)
 3. no tongue in unit_dynasty.dragon_idle — TABS: a long team-coloured tongue hangs from the lower jaw down to the front carrier's chest (ref: reference/units/dynasty.dragon.red.png)
 4. no horns in unit_dynasty.dragon_idle — TABS: two cream curved horns rise behind the brow (ref: reference/units/dynasty.dragon.jpg, reference/factions/dynasty.jpg)
b PASS (429: front carrier's fists on the head pole's grip while running; CONFIRM 429)
c PASS (421: opaque white plume with yellow lobes; CONFIRM 429)
d PASS (cost 1000, hp 18.78x; 429 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [R] a head + body - blockers 1-4: rebuild DRAGON_FORM's head as a bulbous faceted lion-dog head (puffed cheeks, beaked nose, cream patterned brow, two cream curved horns, a long team tongue hanging to the front carrier's chest) and the body as a curving tube tapering back with a scalloped dorsal fin and frilled underside; keep "dragonMouth", "dragonPoleGrip" and the carrier stations; spec from both CONFIRM lists (419, 429) - ref: dynasty.dragon.red.png, dynasty.dragon.jpg - ours: unit_dynasty.dragon_idle, lineup_dynasty (CONFIRM 429)
## Attempts (iter | gap | criterion | verdict)
416-420 | FLAME_JET, DRAGON_FORM, DRAGON_CARRIER, [P] poles, BODY_FLAMES, carrier heads (0f7dd79c) | a,b,c | approved; CONFIRM 419 failed a, b, c
421 | FLAME_JET plume (ba799e89, 8027d61c) | c | approved (c PASS)
421-424 | DRAGON_FORM flat band, band on edge + fins, DRAGON_MUZZLE | a | approved (struck 2, 5, 4)
422-424 | DRAGON_CARRIER two-box arms + fists; FRONT_GRIP orange-red pole, wrapped grip | b | approved (struck 1, 3)
429 | DRAGON_TRIM orange collar, hem, cuffs on every carrier (3b24b339) | a | approved (struck 3; a PASS; CONFIRM failed a: plateau)
429 | _holdDragonPole both fists on the grip, pole in at his chest (df5dd028) | b | approved (struck 2; b PASS, CONFIRM passed b)
## Rejected (last 4)
- fists in skin, .12/.1 [P] [1] - 421: ledger reversal of the 420 DRAGON_CARRIER row
## Notes (max 3 lines)
- 429 defects: trims proud boxes (TABS flush piping); idle arms cross in a V to the grip.
- The front carrier is the real humanoid (dragonTrim dresses him); his head pole "dragonPole" stands at FRONT_GRIP.ahead, held by proceduralAnimation _holdDragonPole (DRAGON_HOLD). Framed by his mesh top (rig 5.70 m).
