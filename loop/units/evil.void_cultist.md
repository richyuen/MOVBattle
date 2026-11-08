# evil.void_cultist
Status: open   Audited: 489 (AUDIT x2), 494 (CONFIRM: passed c, d; failed a, b)   Done: -
## Verdicts
a FAIL (0 since 494)
 1. bare team-coloured arms (upper arm to fist glowing blue, no sleeve) in unit_evil.void_cultist_idle — TABS: dark priest-coat sleeves to the wrist, team colour only on a cuff band and the mitt (ref: evil.void_cultist.red.png, both arms)
 2. coat hem reaches the ground as a bell, hiding the legs in unit_evil.void_cultist_idle (and lineup_evil, 4th from left) — TABS: coat ends at the knee, with dark trousers and boots with team-coloured cuffs showing below (ref: evil.void_cultist.red.png / .blue.png lower third; reference/factions/evil.jpg centre unit)
b FAIL (0 since 494)
 1. shield carried high and edge-on beside the head at shoulder level, with the empty off-hand fist raised above it, in unit_evil.void_cultist_idle — TABS: shield held low in front of the body, face to the viewer, covering chest to hip (ref: evil.void_cultist.red.png, blue.png)
 2. shield disc about torso-wide in unit_evil.void_cultist_windup (head-to-waist) — TABS: oversized disc wider than the shoulders, chin to hip, hiding most of the torso (ref: evil.void_cultist.red.png; card Off Hand Void Cultist Shield)
c PASS (494 Sword Implosion pull; CONFIRM 494)
d PASS (494 stats; CONFIRM 494)
## Ranked gaps
1. [S] evil.void_cultist.a sleeves — blocker 1: dark coat sleeves to the wrist over the arms, team cuff band (evilDress, cultistDarkRobe's cloth) — ref: evil.void_cultist.red.png — ours: unit_evil.void_cultist_idle.png
2. [S] evil.void_cultist.b shield hold — blocker 1: buckler held low in front of the body, face out, chest to hip — ref: evil.void_cultist.blue.png — ours: unit_evil.void_cultist_idle.png
3. [S] evil.void_cultist.a knee coat — blocker 2: robe hem at the knee, dark trousers and team-cuffed boots below (VOID_SKIRT) — ref: evil.void_cultist.red.png — ours: unit_evil.void_cultist_idle.png
## Attempts (iter | gap | criterion | verdict)
494 | near-black robe with a team stripe, evilDress cultistDarkRobe (2f7c8529, 5c8089a5, 85c56b08) | a | approved (struck 3; critic a PASS, CONFIRM failed a)
494 | Sword Implosion pull into one point, no summon, simulationSystem CULTIST_IMPLOSION + spawnImplosion (146499df) | c | approved (struck 2; c PASS)
493 | heavy_melee archetype, mace hint, heavy_swing family (a127c2f7, 0a8a899c; stats ddbe3995) | c | approved (struck 1)
493 | big dark pointed beard + moustache, evilDress cultistBeard (6c991027) | a | approved (struck 2)
492 | dark spiked halo, evilDress cultistHalo (68d128e0) | a | approved (struck 1, 4)
490-491 | spiked-ball mace CULTIST_MACE (a9a68a3e); spiked buckler cultistBuckler (4dfe45ac) | b | approved (b PASS; CONFIRM 494 failed b)
## Rejected (last 4)
## Notes (max 3 lines)
- 494 DEFECTS: robe a shade plum; in _ability the camera sits inside the 4.5 m shell. Capture: two more squires beside his squire.
- The mace is a caster rod ("staff" + "orb"); unmarking it hung it head-down (493). Dress is unitFactory dressVoidCultist + evilDress (robe, halo, buckler, beard).
