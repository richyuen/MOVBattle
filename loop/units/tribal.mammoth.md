# tribal.mammoth
Status: open   Audited: 360 (a re-audited 377, idle re-aimed 378)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (2 since 377)
 1. head scale in unit_tribal.mammoth_flight (also _idle): head ~1/3 body height, tucked under the front, crown below the hull behind it, eye mid-face — TABS: huge dome about as tall as the body front, googly eye set high (ref: .red.png)
 2. tail in unit_tribal.mammoth_ability (also _idle): small dark ball floating off the rump — TABS: skinny fluffy tail hanging from the rump (ref: card)
b PASS (366)
c PASS (364)
d PASS (cost 2200, hp 31.76x; dmg, cd wiki none)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a huge head dome, eye high, crest on its crown — blocker 1: buildMammoth head scale (vehicleBuilder) — ref: .red.png — ours: unit_tribal.mammoth_flight.png
2. [S] a hanging fluffy tail — blocker 2: thin tapered lathe with a tuft, joined to the rump — ref: card — ours: unit_tribal.mammoth_ability.png
## Attempts (iter | gap | criterion | verdict)
323-375 | fur, mane, ankles, paint, Charge, legs, trample, barrel, trunk, tusks, hump, ears, legs taper, skirt, belly [S] | a,b,c | approved (367 hem rejected)
378 | topline falls to a lower, smaller rump (MAMMOTH_BARREL slope .45, slopeWide .15, hump .2 at .5) [S] (ad41648 +d33b7c6) | a | approved
378 | mane as one near-black crest of 6 chunks, brow to nape (MAMMOTH_CREST) [S] (97b036e) | a | approved
## Rejected (last 4)
- fur hem over the leg roots [S] [1] — 367: separate jittered lobes — read as stacked balls/boulders heaped on the leg tops
## Notes (max 3 lines)
- Critic 378 minors: rump still a full round bulb about chest-wide (TABS smaller, tucked); crest reads as a smooth caterpillar of lumps, not ragged hair.
- Hull wound outward (374): keep it. Tans: "cloth" (matte), not bone/wood PBR. A radius-only MAMMOTH_LEG change is a ledger reversal (372).
- Evidence 378: _idle pulled back 2x, lineup_tribal re-centred on the rank with the mammoth whole.
