# map.simulation
Status: done   Audited: 587 (AUDIT x2), 588 (CONFIRM: passed a, b), 591 (CONFIRM: a, b copied as confirmed)   Done: 591
## Verdicts
a PASS (591: struck 3; CONFIRM 588)
b PASS (587 AUDIT x2; CONFIRM 588)
c PASS (591 judge)

## Ranked gaps

## Attempts (iter | gap | criterion | verdict)
591 | [S] sky untoned (simKit untoned) cyan (183,218,219) over (211,226,219) dd6f6429 | a3 | APPROVE, struck a3 (a PASS)
590 | [P] haze (.74,.93,.97), span .15, blue (.68,.9,1) c576c21c + 519e11df | a3 | APPROVE, no strike
588 | [P] sky blue (.62,.86,.93) span .4 a7eceb90 | a3 | REJECT, reverted
587 | [S] grid floor b23e942c; empty centre 9fed27e5 (+40c4de96); pale sky bafe8f20 | a1, a2, a3 | APPROVE, struck a1, a4, a2, a5

## Rejected (last 4)
588 | [P] a3 a7eceb90 | attempts 1 | lighter, not more cyan

## Notes (max 3 lines)
- Builder tabs/simulation.ts dresses this map only (imports simKit's untoned). Critic 591 minor: top strip leans mint, horizon a soft fade.
