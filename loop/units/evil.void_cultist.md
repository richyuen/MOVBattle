# evil.void_cultist
Status: open   Audited: 489 (AUDIT x2), 494 (CONFIRM: passed c, d; failed a, b)   Done: -
## Verdicts
a FAIL (1 since 494, 1 struck)
 2. coat hem reaches the ground as a bell, hiding the legs in unit_evil.void_cultist_idle (and lineup_evil, 4th from left) — TABS: coat ends at the knee, with dark trousers and boots with team-coloured cuffs showing below (ref: evil.void_cultist.red.png / .blue.png lower third; reference/factions/evil.jpg centre unit)
b FAIL (1 since 494, 1 struck)
 2. shield disc about torso-wide in unit_evil.void_cultist_windup (head-to-waist) — TABS: oversized disc wider than the shoulders, chin to hip, hiding most of the torso (ref: evil.void_cultist.red.png; card Off Hand Void Cultist Shield)
c PASS (494 Sword Implosion pull; CONFIRM 494)
d PASS (494 stats; CONFIRM 494)
## Ranked gaps
1. [S] evil.void_cultist.a coat length — blocker 2: robe skirt cut at the knee, dark trousers and team-cuffed boots below (VOID_SKIRT, cultistDarkRobe) — ref: evil.void_cultist.blue.png — ours: unit_evil.void_cultist_idle.png
2. [S] evil.void_cultist.b buckler size — blocker 2: disc wider than the shoulders, centred chin to hip (evidence commit first: the windup shows his back, re-aim blocker 2 to the idle) — ref: evil.void_cultist.red.png — ours: unit_evil.void_cultist_idle.png
## Attempts (iter | gap | criterion | verdict)
495 | dark coat sleeves to the wrist with a team cuff band, evilDress cultistSleeves (978009c4) | a | approved (struck 1)
495 | buckler is a board: low guard hold, squared face-out always, proceduralAnimation _shieldBoard/_squareShield (9ebc78bd) | b | approved (struck 1)
494 | near-black robe with a team stripe, evilDress cultistDarkRobe (2f7c8529, 5c8089a5, 85c56b08) | a | approved (struck 3; CONFIRM failed a)
494 | Sword Implosion pull into one point, no summon (146499df) | c | approved (struck 2; c PASS)
493 | heavy_melee archetype, mace hint, heavy_swing family (a127c2f7, 0a8a899c; stats ddbe3995) | c | approved (struck 1)
490-493 | mace, buckler (b); halo, beard (a) | a, b | approved
## Rejected (last 4)
## Notes (max 3 lines)
- 495 DEFECTS: robe reads plum-maroon; the board sits off to his left side, not centred over the chest. b.2's named shot (windup) shows his back: evidence commit first.
- The mace is a caster rod ("staff" + "orb"); unmarking it hung it head-down (493). Dress is unitFactory dressVoidCultist + evilDress (robe, sleeves, halo, buckler, beard).
