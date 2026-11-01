# legacy.boxer
Status: open   Audited: 457, 461 (RE-AUDIT lineup)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4 (6 on a), and the count of approved [S] since the list was written)
a FAIL (3 since 457)
 1. build in unit_legacy.boxer_idle, a short figure (size 0.68) — TABS: a tall lanky man at 1.08x (ref: legacy.boxer.red.png, card Size)
b PASS (458: team mitts centred on the fists, white palm band, team x .5 on the swatch; TEAM_GLOVE)
c PASS (464: straight jab from the guard, Backwards Dodge hop back logged "dodge"; BOXER_JAB + HOP_BACK)
d PASS (cost 450, hp 3.66x, dmg 1.00x, cd 0.60x; 457 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] legacy.boxer.a build — blocker 1: a lanky frame at 1.08x, legs to half the height (as MINER_BUILD), in place of scale .68 — ref: legacy.boxer.red.png — ours: _idle
## Attempts (iter | gap | criterion | verdict)
457-458 | TEAM_GLOVE team mitts, white band; [P] team x .5 (4e6b33f9, bc99e306, f7d4c129) | b | approved (b PASS 458)
459-461 | BOXER_HEADGEAR (17904d07), BOXER_SHORTS (37bcb6d4), BOXER_BOOTS (66d5aaff) | a | approved (struck 2, 5, 3, 4)
463 | BOXER_JAB straight jab from the guard (523ab3d2; follow-up 578ed136: any blow, the glove's is blade_slash) | c | approved (struck 1)
464 | HOP_BACK Backwards Dodge, 2.6 m, 3 s cooldown (f5c1b38a) | c | approved (struck 2; c PASS)
## Rejected (last 4)
## Notes (max 3 lines)
- 463 critic (minor): the trunk pitches ~35 deg forward over the jab (BOXER_JAB.lean); TABS stays upright.
- 464 critic: the build may go as a [P] scale .68 -> 1.08 under the root exception; it was listed as an [S] (lanky frame) at the audit.
