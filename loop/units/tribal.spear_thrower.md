# tribal.spear_thrower
Status: open   Audited: 360   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (0 since 360)
 1. tusks in unit_tribal.spear_thrower_idle: small white nubs pointing up off the headband — TABS: large tan tusks strapped to the band, curving down past the eyes to cheek level (ref: tribal.spear_thrower.red.png, .jpg)
b FAIL (0 since 360)
 1. spearhead in unit_tribal.spear_thrower_windup/_idle: small narrow pale-grey point — TABS: large dark charcoal leaf head, wider than the hand, lashed with tan cord (ref: tribal.spear_thrower.red.png, .jpg)
c PASS (360)
d PASS (cost 120, hp 0.55x, dmg 2.23x, cd 4.00x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] b spearhead — blocker 1: a large dark charcoal leaf-shaped head lashed with tan cord — ref: tribal.spear_thrower.red.png — ours: unit_tribal.spear_thrower_windup.png
## Attempts (iter | gap | criterion | verdict)
318 | spear raised overhead (b194791) | b | rejected
319 | spear stood up out of the fist (c8f0e70) | b | approved
320 | stone leaf head (4e68c1c) | b | approved
321 | tusk headband (36befcc) | a | approved
322 | ornamented loincloth (076f7fd) | a | approved
322 | [P] tusks rise 0.65, thick 0.4 (8acb32d) | a | approved
323 | fang necklace (eae473f) | a | approved
## Rejected (last 4)
- spear raised overhead [S] [1] — 318: JAVELIN_COCK alone (arm straight up) — the javelin's +y runs toward the elbow, so the shaft hung DOWN the back of the head
## Notes (max 3 lines)
- 316: LAUNCH spear 20, 9.8 + solveLowArc. 317: LAUNCH.spear.throw 220. 319: _standJavelin turns the "shaft" pi about the fist at the cock.
- 321 tuskBand (TUSK_BAND, do not re-nudge before 342); 322 LOINCLOTHS; 323 fangNecklace (FANG_NECKLACE). Critic 323 (minor): fang a little short (0.8 vs ~1 head height).
