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
d PASS (cost 400, hp 5.40x, dmg 0.25x, cd 1.24x; 447 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
8. [S] a robe length - blocker 2: hem cut to the knee, team shins, dark brown knee boots (BOOT_SHAFT-style shells) - ref: red.png - ours: unit_wild_west.cactus_idle (critic 447)
9. [S] a flowers - blocker 4: a large pink-petal flower on the hood top, one on the shoulder, one on the hem - ref: red.png - ours: unit_wild_west.cactus_idle (critic 447)
## Attempts (iter | gap | criterion | verdict)
445 | CACTUS_EXPLOSION + visualEffects CACTUS_NEEDLES (9ab466fa) | c | approved (struck 1; c PASS)
446 | [P] CACTUS_NEEDLES tan-brown (.5,.33,.17), glow .12 (7d34b606) | c | approved
447 | CACTUS_SLEEVE wildWestDress fat 6-sided mitten sleeves, 4 rows x 5 spikes (f263e7a6) | a | approved (struck 1)
## Rejected (last 4)
## Notes (max 3 lines)
- 447 critic: a team-blue chunk with a spike shows through the robe front at hip height in the idle (predates 447).
