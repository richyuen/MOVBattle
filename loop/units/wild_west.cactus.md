# wild_west.cactus
Status: open   Audited: 444   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (0 since 451; the [R] cleared the plateau)
  (struck 1 at 447; 2, 4 at 451)
 3. spikes in unit_wild_west.cactus_idle: about fifteen scattered small spikes — TABS: dense regular grid of tan pyramid spikes over robe, hood, sleeves (ref: red.png)
b PASS (444: empty hands per card Unarmed)
c PASS (445: needles burst out of his middle in every direction when he is hurt; CACTUS_EXPLOSION)
d PASS (cost 400, hp 5.40x, dmg 0.25x, cd 1.24x; 451 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
7. [S] a spikes - blocker 3: wildWestDress cactusSpike/spineMat - a tan spike material (pick off palette.png), bigger broad pyramids, a hood ring and sleeve rows in the same grid - ref: red.png - ours: unit_wild_west.cactus_idle (critic 451)
## Attempts (iter | gap | criterion | verdict)
445 | CACTUS_EXPLOSION + visualEffects CACTUS_NEEDLES (9ab466fa) | c | approved (struck 1; c PASS)
446 | [P] CACTUS_NEEDLES tan-brown (.5,.33,.17), glow .12 (7d34b606) | c | approved
447 | CACTUS_SLEEVE wildWestDress fat 6-sided mitten sleeves, 4 rows x 5 spikes (f263e7a6) | a | approved (struck 1)
448 | CACTUS_LONG .86 -> .5 + CACTUS_BOOTS out 2.1 cuff 2.5 from .42 (2f5a4704) | a | rejected-kept (revert conflicted on the import line)
449 | CACTUS_BOOTS out 1.15 cuff 1.35 from .55 (a4b9b357) | a | rejected (reverted 54cb5a91)
451 | [R] CACTUS_ROBE wildWestDress cactusRobe: hem .9 of the knee joint drop, 2+3 rings of 8 spikes, cactusFlower x3 salmon, slim CACTUS_BOOTS, CACTUS_UPRIGHT stance, hands hidden (1a160cdf) | a | approved (struck 2, 4)
## Rejected (last 4)
- robe to the knee + boots [S] [1] - 448: CACTUS_LONG .5, CACTUS_BOOTS out 2.1 - the boots read as one fat dark mass, a second skirt, no team shin between hem and boot top
- slim boots [S] [2] - 449: CACTUS_BOOTS values only - a [P] in effect; the hem still sits on the boot tops, no team shin
## Notes (max 3 lines)
- 451 critic: spikes are dark maroon-brown (CACTUS_SPINE_COLOR (.66,.38,.26) cloth) and small; the hood carries one or two. The robe is a wide box at the shoulders (TABS A-line narrow at the shoulders) - not a blocker.
- 451 probe: the hashed idle crouch (knee .66-.91, chest .4) put his knee through the robe front and the boot tops up to the hem; CACTUS_UPRIGHT (proceduralAnimation) zeroes it.
