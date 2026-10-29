# farmer.halfling
Status: done   Audited: 375 (re), a 391, 397-400, 402, 404 (re-audit a + CONFIRM)   Done: 404
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a PASS (404 re-audit; CONFIRM 404)
  (struck 1 at 404: the legs - at the render's angle the shins match the shorts and the feet are planted wide; struck 2 at 399: foot fur; struck 3: the vest V, 391; struck 5 at 400: the shin's length against the shorts; struck 4 at 402: the shorts' shade on the swatch; struck 6 at 402 under the lineup rule)
b PASS (383; CONFIRM 404)
c PASS (375; CONFIRM 404)
d PASS (cost 50, hp 1.50x, dmg 0.17x, cd 1.50x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
## Attempts (iter | gap | criterion | verdict: approved, rejected, rejected-kept, dropped)
339-402 | mitts, mop, jacket, shorts, belt, feet, Jump, Grab, coat, sleeves, cuff, belt ring, stance, vest, foot fur, shinLength 1.95, shorts hem, HALFLING_SHORTS_CLOTH [S]; belt bar [P] | a,b,c | approved
403 | evidence: idle swing .2 rad (94a7f14) | a | re-audit 404 struck a.1, a PASS; CONFIRM agreed -> D
## Rejected (last 4)
- vest [S] [1] - 390: V to the belt, one-sided faceFront pieces - the white V vanished, a dark gap showed
- foot fur [P] [1] - 390: tuft inX 0, clump .8 - still rooted at the ankle off to the side
- stance [P] [2] - spent (HALFLING_STANCE row, ledger)
## Notes (max 3 lines)
- 404 re-audit (minor, not a blocker): a dark sock-like band at each ankle between the shin and the fur tuft; the renders show bare skin to the fur.
- 402: the shorts are an unlit plate (team x .14, emissive = colour, out of the glow). 400: HALFLING_SHORTS long .99; 399: HALFLING_TUFT.
- 398: shinLength 1.95 (bodyBuilder), HALFLING_STANCE spread .52; 403: idle shot swing .2 rad.
