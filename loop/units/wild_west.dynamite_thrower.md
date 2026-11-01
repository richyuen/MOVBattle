# wild_west.dynamite_thrower
Status: open   Audited: 444   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (1 since 444)
  (struck 1 at 449)
 2. skirt in unit_wild_west.dynamite_thrower_idle: short dark tunic hem at the hip, no stripes — TABS: knee-length team skirt with vertical gold stripes and a gold hem band (ref: red.png; card Appearance)
 3. braided hair in unit_wild_west.dynamite_thrower_idle: none — TABS: brown braid over the off shoulder (ref: red.png)
 4. boots in unit_wild_west.dynamite_thrower_idle: plain team feet — TABS: black knee boots with a folded cuff (ref: red.png; card Appearance)
b FAIL (1 since 444)
  (struck 2 at 449)
 1. dynamite grip in unit_wild_west.dynamite_thrower_idle: bundle horizontal on the shoulder, one hand — TABS: upright bundle in front of the belly in both hands (ref: red.png; card Two-handed)
c PASS (444: lit bundle thrown one-handed, blast flash and debris, the knight flung)
d PASS (cost 100, hp 0.63x, dmg 0.22x, cd 49.5x; 449 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] b two-handed bundle - blocker 1: proceduralAnimation dynamite hold, upright bundle held in front of the belly in both hands - ref: red.png - ours: unit_wild_west.dynamite_thrower_idle (critic 449)
2. [S] a striped skirt - blocker 2: wildWestDress dynamiteSkirt, knee-length team skirt with vertical gold stripes and a gold hem band - ref: red.png - ours: lineup_wild_west (critic 449)
## Attempts (iter | gap | criterion | verdict)
449 | DYNAMITE_WIRES black two-leg wire per stick, fuse black (3adeea7c) | b | approved (struck 2)
449 | PEAK_HAT (wildWestDress, shared with the deadeye) hat "peak_hat" (221f3f5a) | a | approved (struck 1)
## Rejected (last 4)
## Notes (max 3 lines)
- 449 critic: the idle frames her with the bundle across her head (head, braid, face unjudgeable there) and lineup_wild_west shows her back; re-aim the idle with an evidence commit before a/3 is judged.
- 449 critic: wires splay like a whisk, the curled tail does not read (not a blocker). summary "target never hurt within the window" for c: re-check c (no 449 gap touched the sim).
