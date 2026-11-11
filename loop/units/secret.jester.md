# secret.jester
Status: open   Audited: 500 (AUDIT x2), 512 (CONFIRM: passed b, c, d; failed a)   Done: -
## Verdicts
a FAIL (0 since 512 CONFIRM)
 1. tunic colour in lineup_secret (jester, left-centre, about x340 y590): the jester outfit reads olive/khaki under pink team arms and collar, not team red; in unit_secret.jester_idle it is a teal shade off the blue skin — TABS: the red jester's tunic, hat and breeches are all team red, the blue one's all team blue (ref: reference/units/secret.jester.red.png, .blue.png; card Appearance "team-colored jester outfit and hat")
b PASS (512 CONFIRM: forearm daggers and toe knives)
c PASS (512 CONFIRM: standing front kick at 4100 ms flings the man)
d PASS (512 stats)
## Ranked gaps
1. [S] secret.jester.a team tunic — blocker 1: give the torso, yoke and tunicSkirt their own team cloth (as the hood's), not the body material the faction tint shifts to khaki (LESSONS 449); check the red team on a --noglow swatch — ref: reference/units/secret.jester.red.png — ours: lineup_secret.png, unit_secret.jester_idle.png
## Attempts (iter | gap | criterion | verdict)
512 | dodge drops a pending kick; kick starts only on his feet, SS _tryDodge / kick gate (891ac028, 027436f7) | c | approved (struck 3; c PASS)
512 | brown belt with a pale square buckle, secretDress jesterBelt (b1030b43) | a | approved (struck 3; a PASS; CONFIRM failed a)
511 | toe knives on both shoes (65f47ff7, 5dc19fb4) | b | approved (struck 2; b PASS)
511 | Jester Kick on the shared kick, 2 s clock (278dab28, 68792d69) | c | approved (struck 2; added 3)
511 | striped puffed shorts (32de5d14) | a | approved (struck 4)
503-506 | hood and points, collar, dodge roll, forearm daggers | a, b, c | approved
## Rejected (last 4)
## Notes (max 3 lines)
- 512 DEFECTS: belt shows mostly right of the buckle, its left run sinks into the torso.
- Capture: ability shot follows "kick" (ABILITY_PREF); the capture duel's first kick is dropped by the 617 ms dodge, the logged one is at 4100 ms.
