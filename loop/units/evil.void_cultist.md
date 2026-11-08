# evil.void_cultist
Status: open   Audited: 489 (AUDIT x2), 494 (CONFIRM: passed c, d; failed a, b), 496 (CONFIRM: passed a, b, c, d), 497 (CONFIRM: passed a, b, c, d)   Done: -
## Verdicts
a PASS (496 knee coat, team-cuffed boots; CONFIRM 496)
b FAIL (3 since 494, 1 struck)
 2. shield disc about torso-wide in unit_evil.void_cultist_idle (head-to-waist) — TABS: oversized disc wider than the shoulders, chin to hip, hiding most of the torso (ref: evil.void_cultist.red.png; card Off Hand Void Cultist Shield)
c PASS (494 Sword Implosion pull; CONFIRM 494)
d PASS (497 stats; CONFIRM 497)
## Ranked gaps
1. [P] evil.void_cultist.b buckler size — blocker 2: evilDress CULTIST_BUCKLER across ~1.4x so the disc overhangs the shoulders (fallout of [S] 88b2fcc7, approved 497) — ref: evil.void_cultist.red.png — ours: unit_evil.void_cultist_idle.png
## Attempts (iter | gap | criterion | verdict)
497 | buckler face turned .4 rad across his body to the weapon side, tipped .14 up, proceduralAnimation CULTIST_SEAT turn/tilt (88b2fcc7) | b | approved (no strike; face-on now, width short)
496 | coat cut at the knee, team-cuffed boots, evilDress cultistCoatLength + cultistBoots (94c8cd58) | a | approved (struck 2; a PASS)
496 | buckler 1.85 chests across, seated over his front chin to hip, proceduralAnimation _seatBuckler (55ee1043, a3943b02) | b | approved (no strike; reads edge-on)
495 | dark coat sleeves to the wrist with a team cuff band, evilDress cultistSleeves (978009c4) | a | approved (struck 1)
495 | buckler is a board: low guard hold, squared face-out always, proceduralAnimation _shieldBoard/_squareShield (9ebc78bd) | b | approved (struck 1)
494 | near-black robe with a team stripe, evilDress cultistDarkRobe (2f7c8529, 5c8089a5, 85c56b08) | a | approved (struck 3; CONFIRM failed a)
490-494 | mace, buckler (b); halo, beard (a); heavy_melee archetype, Sword Implosion (c) | a, b, c | approved
## Rejected (last 4)
## Notes (max 3 lines)
- 497 DEFECTS: disc faces the camera now, chin to hip, but only trunk-wide. CONFIRM 496 and 497 passed b; the gap critic did not. b has 2 approved [S] in a row with no strike (496, 497): a third makes it plateau.
- The mace is a caster rod ("staff" + "orb"); unmarking it hung it head-down (493). Dress is unitFactory dressVoidCultist + evilDress (robe, sleeves, coat, boots, halo, buckler, beard).
