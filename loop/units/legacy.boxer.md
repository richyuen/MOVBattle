# legacy.boxer
Status: open   Audited: 457, 461 (RE-AUDIT lineup)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4 (6 on a), and the count of approved [S] since the list was written)
a FAIL (3 since 457)
 1. build in unit_legacy.boxer_idle, a short figure (size 0.68) — TABS: a tall lanky man at 1.08x (ref: legacy.boxer.red.png, card Size)
b PASS (458: team mitts centred on the fists, white palm band, team x .5 on the swatch; TEAM_GLOVE)
c FAIL (1 since 457)
 2. missing: Backwards Dodge (no ability event within the capture) — TABS: backs away 1-5 on a 3 s cooldown (ref: card Weapons ability)
d PASS (cost 450, hp 3.66x, dmg 1.00x, cd 0.60x; 457 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] legacy.boxer.c Backwards Dodge — blocker 2: a 3 s cooldown hop back 1-5 m after a blow, logged in abilityLog — ref: card Weapons ability — ours: _release
2. [S] legacy.boxer.a build — blocker 1: a lanky frame at 1.08x, legs to half the height (as MINER_BUILD) — ref: legacy.boxer.red.png — ours: _idle
## Attempts (iter | gap | criterion | verdict)
457-458 | TEAM_GLOVE team mitts, white band; [P] team x .5 (4e6b33f9, bc99e306, f7d4c129) | b | approved (b PASS 458)
459-461 | BOXER_HEADGEAR (17904d07), BOXER_SHORTS (37bcb6d4), BOXER_BOOTS (66d5aaff) | a | approved (struck 2, 5, 3, 4)
463 | BOXER_JAB straight jab from the guard (523ab3d2; follow-up 578ed136: any blow, the glove's is blade_slash) | c | approved (struck 1)
## Rejected (last 4)
## Notes (max 3 lines)
- 463 critic (minor): the trunk pitches ~35 deg forward over the jab (BOXER_JAB.lean); TABS stays upright.
