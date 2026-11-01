# wild_west.cactus
Status: open   Audited: 444   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (1 since 444)
  (struck 1 at 447)
 2. robe length in unit_wild_west.cactus_idle: hem to the ground, legs hidden — TABS: robe to the knee, team shins and dark brown boots below (ref: red.png; card Appearance)
 3. spikes in unit_wild_west.cactus_idle: about fifteen scattered small spikes — TABS: dense regular grid of tan pyramid spikes over robe, hood, sleeves (ref: red.png)
 4. flowers in unit_wild_west.cactus_idle: one small at the hem, a tiny one on the hood — TABS: large flower on the hood top, one on the shoulder, one on the hem (ref: red.png; cactus.png)
b PASS (444: empty hands per card Unarmed)
c PASS (445: needles burst out of his middle in every direction when he is hurt; CACTUS_EXPLOSION)
d PASS (cost 400, hp 5.40x, dmg 0.25x, cd 1.24x; 448 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a slim boots resubmit - blocker 2: CACTUS_BOOTS out ~1.15, cuff ~1.35, from ~.55, cuffFrom ~.5, CACTUS_LONG kept .5, so team shins show under the hem and each boot is its own slim column - ref: red.png - ours: unit_wild_west.cactus_idle (critic 448)
8. [S] a flowers - blocker 4: a large pink-petal flower on the hood top, one on the shoulder, one on the hem - ref: red.png - ours: unit_wild_west.cactus_idle (critic 447, 448)
## Attempts (iter | gap | criterion | verdict)
445 | CACTUS_EXPLOSION + visualEffects CACTUS_NEEDLES (9ab466fa) | c | approved (struck 1; c PASS)
446 | [P] CACTUS_NEEDLES tan-brown (.5,.33,.17), glow .12 (7d34b606) | c | approved
447 | CACTUS_SLEEVE wildWestDress fat 6-sided mitten sleeves, 4 rows x 5 spikes (f263e7a6) | a | approved (struck 1)
448 | CACTUS_LONG .86 -> .5 + CACTUS_BOOTS out 2.1 cuff 2.5 from .42 (2f5a4704) | a | rejected-kept (revert conflicted on the import line)
## Rejected (last 4)
- robe to the knee + boots [S] [1] - 448: CACTUS_LONG .5, CACTUS_BOOTS out 2.1 - the boots read as one fat dark mass, a second skirt, no team shin between hem and boot top
## Notes (max 3 lines)
- 447 critic: a team-blue chunk with a spike shows through the robe front at hip height in the idle (predates 447).
- 448: the rejected boots are still in the code (rejected-kept): the resubmit edits CACTUS_BOOTS in place.
