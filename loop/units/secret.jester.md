# secret.jester
Status: open   Audited: 500 (AUDIT x2)   Done: -
## Verdicts
a FAIL (1 since 500, 3 struck)
 3. belt in unit_secret.jester_idle — none; TABS a dark belt with a buckle (ref: secret.jester.red.png)
b PASS (511 toe knives on both shoes)
c FAIL (1 since 500, 2 struck)
 3. kick in unit_secret.jester_ability — the blow lands while he is horizontal in the dodge flip, with the bladed foot trailing away from the man — TABS: a planted front kick drives the toe blade into the man (ref: card Weapons "Jester Kick"; Characteristics "delivering a lethal kick")
d PASS (511 stats)
## Ranked gaps
1. [S] secret.jester.c kick from a standing pose — blocker 3: cancel or hold the kick while the dodge flip runs, foot driving at the man (simulationSystem kick start / _landKicks) — ref: loop/cards/secret.jester.md — ours: unit_secret.jester_ability.png
2. [S] secret.jester.a belt — blocker 3: dark waist band with a pale buckle over the tunic hem (secretDress) — ref: reference/units/secret.jester.red.png — ours: unit_secret.jester_idle.png
## Attempts (iter | gap | criterion | verdict)
511 | toe knives on both shoes (65f47ff7, 5dc19fb4) | b | approved (struck 2; b PASS)
511 | Jester Kick on the shared kick, 2 s clock (278dab28, 68792d69) | c | approved (struck 2; added 3)
511 | striped puffed shorts (32de5d14) | a | approved (struck 4)
506 | gold-edged collar with six scallops (2f45b912) | a | approved (struck 2)
506 | melee dodge with an airborne forward roll (beecdbea) | c | approved (struck 1)
506 | thin paired forearm daggers with straps (55f5caee, 607a9757) | b | approved (struck 1)
503 | team hood, two drooping points with bells, brown spike (1101ed14) | a | approved (struck 1)
## Rejected (last 4)
## Notes (max 3 lines)
- 511 DEFECTS: shorts barely wider than the thigh; wrist blades longer than TABS. The kick wind-up starts ~417 ms and the 617 ms dodge does not cancel it (68792d69 gates only the start).
- Capture: ability shot follows "kick" (ABILITY_PREF, 827be5cc).
