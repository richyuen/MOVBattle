# legacy.boxer
Status: open   Audited: 457, 461 (RE-AUDIT lineup), 465 (CONFIRM: passed c, d; failed a, b)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4 (6 on a), and the count of approved [S] since the list was written)
a FAIL (0 since 465, CONFIRM)
 1. dark vest block covering the chest above the yellow waistband in unit_legacy.boxer_idle (it shows grey in lineup_legacy, near rank right of the barrel roller) — TABS: bare team-skin chest and shoulders, nothing between the neck and the yellow waistband (ref: reference/units/legacy.boxer.red.png, legacy.boxer.png)
b FAIL (0 since 465, CONFIRM)
 1. boxing gloves in unit_legacy.boxer_idle are small grey octagonal knobs, about half the head's width — TABS: team-coloured gloves bigger than the head with a white palm patch, the main read of the unit (ref: reference/units/legacy.boxer.red.png; card Main Hand/Off Hand Boxer's Glove, Appearance)
c PASS (464: straight jab from the guard, Backwards Dodge hop back logged "dodge"; BOXER_JAB + HOP_BACK; CONFIRM 465)
d PASS (cost 450, hp 3.66x, dmg 1.00x, cd 0.60x; 465 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] legacy.boxer.a bare chest — blocker 1: the trunk and yoke in team skin, no vest block (the base torso material) — ref: legacy.boxer.red.png — ours: _idle
2. [S] legacy.boxer.b gloves — blocker 1: TEAM_GLOVE wider than the head, team-coloured, white palm patch — ref: legacy.boxer.red.png — ours: _idle
## Attempts (iter | gap | criterion | verdict)
457-458 | TEAM_GLOVE team mitts, white band; [P] team x .5 (4e6b33f9, bc99e306, f7d4c129) | b | approved (b PASS 458)
459-461 | BOXER_HEADGEAR (17904d07), BOXER_SHORTS (37bcb6d4), BOXER_BOOTS (66d5aaff) | a | approved (struck 2, 5, 3, 4)
463 | BOXER_JAB straight jab from the guard (523ab3d2; follow-up 578ed136: any blow, the glove's is blade_slash) | c | approved (struck 1)
464 | HOP_BACK Backwards Dodge, 2.6 m, 3 s cooldown (f5c1b38a) | c | approved (struck 2; c PASS)
465 | lanky 1.08x build, MINER_BUILD cut (af84fde5, shared) | a | approved (struck 1; a PASS, CONFIRM failed a, b)
## Rejected (last 4)
## Notes (max 3 lines)
- 463 critic (minor): the trunk pitches ~35 deg forward over the jab (BOXER_JAB.lean); TABS stays upright.
- TEAM_GLOVE has no further [P] on its colour (LEDGER): the glove fix is an [S] (size, shape, palm patch).
