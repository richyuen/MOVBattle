# legacy.barrel_roller
Status: open   Audited: 457, 461 (RE-AUDIT lineup: a 2-6 placed), 468 (CONFIRM: passed a, b, c; the gap critic kept c.2 and added a.7)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4 (6 on a), and the count of approved [S] since the list was written)
a FAIL (6 since 457)
 7. socks in unit_legacy.barrel_roller_idle: white socks from just below the knee to the shoe, the pants ending at the knee — TABS: the baggy pants reach near the ankle over a short cream sock band (ref: legacy.barrel_roller.blue.png)
b PASS (463: stands on a light staved barrel lying on the ground, two riveted grey hoops; BARREL_RIDE)
c FAIL (2 since 457)
 2. delivery in unit_legacy.barrel_roller_flight, the blast arrives by a throw from 6 m while he stands — TABS: he walks the barrel forward under his feet into the enemy (ref: card Appearance, legacy.barrel_roller.png)
d PASS (cost 350, hp 0.47x, dmg 0.33x, cd 0.75x; 468 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] legacy.barrel_roller.c ridden barrel rolls — blocker 2: when the barrel shot spawns hide the ridden barrelBody so he drops to his feet, bring it back when the cooldown ends; the barrel he rode is the one that rolls in — ref: legacy.barrel_roller.png — ours: _release
2. [P] legacy.barrel_roller.a socks — blocker 7: BARREL_LEGS.pantTo .35 -> .8, cream glow .22 -> .1 (fallout of 468 [S] 6539168f) — ref: legacy.barrel_roller.blue.png — ours: _idle
## Attempts (iter | gap | criterion | verdict)
458 | lanky slim build 1.00x, bulk .82, longer limbs (336bafe3) | a | approved (struck 1)
463 | BARREL_RIDE staved barrel under his feet, hip lifted (e3458425) | b | approved (struck 1, 2; b PASS)
463 | BARREL_SHOT hooped barrel missile, projectileHint barrel (7089b8e7) | c | approved (struck 1)
464 | hat tricorn, the harpooner's (38bca2d8) | a | approved (struck 2)
465 | BARREL_VEST team vest, white shirt V (ab5eacbe, shared) | a | approved (struck 4)
467 | BARREL_WRAPS brown forearm wraps (c676cf71, shared) | a | approved (struck 5)
468 | BARREL_ROLL closes to 1.6 m, the shot rolls from the barrelBody core (5a54adf1) | c | approved (none struck; "a throw from 6 m" cleared)
468 | BARREL_HAIR white side locks and back sheet (6539168f, shared) | a | approved (struck 3)
468 | BARREL_LEGS team pants, cream socks, tan shoes (6539168f, shared) | a | approved (struck 6; added 7)
## Rejected (last 4)
## Notes (max 3 lines)
- 463 critic (minor): barrel wood khaki-olive (TABS warm orange-brown). 465: grey tunic hem shows below the vest (TABS rope belt).
- 468 critic c: the rolled bomb is a copy; the ridden barrel stays whole under him, so _release shows two barrels at once.
- 468 critic [P] fallout: BARREL_HAIR.top .3 -> .45 so the lock meets the brim.
