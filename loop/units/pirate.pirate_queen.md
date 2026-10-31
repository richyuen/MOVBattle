# pirate.pirate_queen
Status: open   Audited: 422, 426 (RE-AUDIT c), 431 (CONFIRM: passed b, c; failed a), 434 (CONFIRM: passed b, c; failed a)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (0 since 440) (plateau from CONFIRM 431/434 spent by the [R] 440, approved, struck 1)
  (struck 1 at 440)
 2. legs in unit_pirate.pirate_queen_idle are short stumps, the boots start at the skirt hem and no thigh shows — TABS: long slim legs, bare thigh between the skirt's front hem and the knee boots (ref: pirate.pirate_queen.red.png)
b PASS (431: both blades crossed in an X at rest, the big cutlass and the jewelled sabre; CONFIRM 431, 434)
c PASS (427: Bomb Spin - arms out, seven bombs out round her, she rises; CONFIRM 431, 434)
d PASS (cost 2500, hp 36.57x, dmg 2.68x, cd 0.76x; 440 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a long legs - blocker 2: queenFrame legs back toward .9, take the height from the trunk and head instead; skirt front to mid-thigh so thigh shows above the boots - ref: pirate.pirate_queen.red.png - ours: unit_pirate.pirate_queen_idle (critic 440)
## Attempts (iter | gap | criterion | verdict)
425-434 | CUTLASS, CUTLASS_SLASH, BOMB_SPIN, QUEEN_BANDANA, QUEEN_SASH, QUEEN_HAIR, QUEEN_CUTLASS, QUEEN_GUARD, QUEEN_SKIRT, QUEEN_SHIRT, QUEEN_DREADS | a,b,c | approved (b, c PASS; CONFIRM 431, 434 failed a)
435-439 | [R] QUEEN_BOOTS build; QUEEN_UPRIGHT; QUEEN_FRAME; [P] tall .85; [P] scale 1.2 | a | approved
440 | [R] QUEEN_BUILD leg chain .74, trunk .76: head top 2.31 -> 1.96 m vs captain 1.87 (fba5bc29) | a | approved (struck 1; added 2)
## Rejected (last 4)
## Notes (max 3 lines)
- 440 critic: legs now stubby, head about a quarter of her height (TABS a seventh). Measure with a probe (head top, hip, neck in world m) before and after.
- Spec of the [R]s at pirateDress QUEEN_BOOTS, QUEEN_FRAME (QUEEN_BUILD 440); queenFrame runs before her dress in unitFactory; stance QUEEN_UPRIGHT. The scale row is spent.
