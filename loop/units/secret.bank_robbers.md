# secret.bank_robbers
Status: open   Audited: 515 (AUDIT x2), 519 (RE-AUDIT a, b x2), 521, 523 (RE-AUDIT a x2), 524 (RE-AUDIT c x2)   Done: -
## Verdicts
a FAIL (2 since 523, 3 struck)
 2. vest front in unit_secret.bank_robbers_idle — TABS: fitted team vest with a deep charcoal neckline and a row of buttons. Ours have plain angular team torsos that flare at the waist (ref: secret.bank_robbers.red.png).
 4. boot shafts in unit_secret.bank_robbers_idle — TABS: broad dark boot shafts cover the lower shins and end in prominent turned cuffs. Ours have low angular ankle boots (ref: secret.bank_robbers.png).
 5. Short, bent-legged carrier silhouette in unit_secret.bank_robbers_idle — TABS: long-legged Wobblers with relatively straight legs under the load (ref: secret.bank_robbers.png).
b PASS (520: struck 1, 2; overhead carry, pistols put away)
c FAIL (0 since 524, 3 struck)
 4. fisticuffs after the throw in unit_secret.bank_robbers_flight — TABS: once the safe is released the robbers fight on with their fists; ours both draw and aim flintlock pistols at once and keep shooting (ref: card Characteristics)
d PASS (519 stats)
## Ranked gaps
1. [S] secret.bank_robbers.c post-throw fisticuffs — blocker 4: after the safe leaves, replace the rapid_fire pistol attack with a bare-fist melee punch, pistols kept hidden (reuse the Flintlock's bare-fisted mechanism) — ref: card Characteristics — ours: unit_secret.bank_robbers_flight
2. [S] secret.bank_robbers.a vest — blocker 2: a fitted team vest with a charcoal V neckline and a button row — ref: secret.bank_robbers.red.png — ours: unit_secret.bank_robbers_idle
## Attempts (iter | gap | criterion | verdict)
524 | charcoal sleeves with turned cuffs on both robbers, secretDress BANK_SLEEVE (e976a1b4) | a | approved (struck 3)
524 | evidence: barrier and sink shots on the landing spot (ce2f1763) | c | re-audit struck 3; added 4
523 | vault door opens at contact with cash and shockwave (4b3b6265) | c | approved (struck 2)
523 | pinched burgundy felt crowns, curled side brims (3c3fcc54) | a | approved (struck 1, 6 by lineup)
522 | portrait vault, inset hinged door (7bca30d3) | a | approved (struck 1, 3 by lineup)
520 | safe hurl, shockwave and sink, hold fire during flight (37d214e6, 66d5e2d6) | c | approved (struck 1)
520 | overhead carry, pistols away, taller flank robber (9ac31691, 60abe3c1) | b | approved (b PASS; a.6 struck)
518 | team vault with trim and hardware (a9080780) | a | approved (struck 6 by lineup, cleared 1's "none" clause)
## Rejected (last 4)
## Notes (max 3 lines)
- 524: the _sink shot (+450 ticks) does not hold the landing camera (both re-audits); re-aim only if a CONFIRM asks for the sink.
- 524: the barrier is judged in unit_secret.bank_robbers_barrier (+180 ticks, landing camera).
- 519 RE-AUDIT: card says "the taller one", so a slight height gap is TABS.
