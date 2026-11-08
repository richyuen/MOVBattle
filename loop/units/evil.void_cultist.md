# evil.void_cultist
Status: open   Audited: 489 (AUDIT x2)   Done: -
## Verdicts
a FAIL (2 since 489, 2 struck)
 3. robe in unit_evil.void_cultist_idle: a grey-lilac robe — TABS: a near-black priest robe with a team-coloured stripe down the front (ref: evil.void_cultist.red.png)
b PASS (491 shoulder-wide spiked buckler)
c FAIL (1 since 489, 1 struck)
 2. ability in unit_evil.void_cultist_ability/_ability_after: a blue knight is summoned beside him and no enemy is pulled in — TABS: Sword Implosion sucks surrounding enemies into one point (card)
d PASS (493 stats)
## Ranked gaps
1. [S] evil.void_cultist.c summon instead of implosion — blocker 2: Sword Implosion pull of nearby enemies into one point (simulationSystem summon branch), a dark implosion effect there — ref: card Abilities — ours: unit_evil.void_cultist_ability_after.png
2. [S] evil.void_cultist.a grey-lilac robe — blocker 3: near-black robe with a team stripe down the front (unitFactory dressVoidCultist) — ref: evil.void_cultist.red.png — ours: unit_evil.void_cultist_idle.png
## Attempts (iter | gap | criterion | verdict)
493 | heavy_melee archetype, mace hint, heavy_swing family (a127c2f7, 0a8a899c; 7dcdbf23 reverted 9fb211d5; stats ddbe3995) | c | approved (struck 1)
493 | big dark pointed beard + moustache, evilDress cultistBeard (6c991027) | a | approved (struck 2)
492 | dark spiked halo, evilDress cultistHalo (68d128e0) | a | approved (struck 1, 4 by lineup test)
491 | shoulder-wide dark spiked buckler, evilDress cultistBuckler (4dfe45ac) | b | approved (struck 2; b PASS)
490 | thin dark spiked-ball mace, propBuilder CULTIST_MACE (a9a68a3e) | b | approved (struck 1)
## Rejected (last 4)
## Notes (max 3 lines)
- 493 DEFECTS: the blow shows the mace up, pommel spike skyward, ball hidden (reads as a raised spear); beard reads as a flat squared board, moustache unseen.
- The mace is a caster rod ("staff" + "orb"); unmarking it (7dcdbf23) hung it head-down in the idle via the hashed carry, so it was reverted.
- Dress is unitFactory dressVoidCultist (robe bands; it hides the mace "orb" and adds its own ball); halo, buckler, beard in evilDress.
