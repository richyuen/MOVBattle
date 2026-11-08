# evil.void_monarch
Status: open   Audited: 489 (AUDIT x2)   Done: -
## Verdicts
a FAIL (1 since 489, 1 struck)
 2. crown in unit_evil.void_monarch_idle: a pale grey crown of spikes — TABS: a bone-tan crown of flared rays with a tall black-wrapped central spike ringed in pink (ref: evil.void_monarch.red.png)
 3. harness in unit_evil.void_monarch_idle: a single grey antler branch behind one shoulder — TABS: a bone V harness whose spiked wing-arms reach out over both shoulders (ref: evil.void_monarch.blue.png)
 4. chest in unit_evil.void_monarch_idle: a plain lilac block with a white fur collar — TABS: three bone chevron ribs across a dark tunic, over a studded belt (ref: evil.void_monarch.red.png)
 5. knees in unit_evil.void_monarch_idle: plain blue boots — TABS: big bone knee plates covered in spikes (ref: evil.void_monarch.red.png)
 6. arms in unit_evil.void_monarch_idle are bare — TABS: spiked bone balls at the elbows (ref: evil.void_monarch.blue.png)
b PASS (491 twin bone swords)
c FAIL (2 since 489, 2 struck)
 2. ability in unit_evil.void_monarch_ability_after: a summon plus a fear status are logged — TABS: Void Monarch Dodge and Demon Transformation (rising into the air after 800 damage), no summon (card Abilities; evil.void_monarch.jpg)
d PASS (494 stats, hm .27 after the size change)
## Ranked gaps
1. [S] evil.void_monarch.a harness — blocker 3: bone V from the belt to the shoulders with spiked wing-arms out over both shoulders, replacing the antler branches (evilDress monarchHarness) — ref: evil.void_monarch.blue.png — ours: unit_evil.void_monarch_idle.png
2. [S] evil.void_monarch.c fear ability — blocker 2: Demon Transformation, after 800 damage he rises into the air; no fear — ref: evil.void_monarch.jpg — ours: unit_evil.void_monarch_ability_after.png
## Attempts (iter | gap | criterion | verdict)
494 | no giant size class, man-sized vis 1.2/1.12 (cdc2f6f8; stats e2469b0d) | a | approved (struck 1)
493 | no summon; pink radius-2 burst at each blow, simulationSystem MONARCH_BURST (f22ca9e7) | c | approved (struck 1)
492 | boss_melee archetype (boss.legendary splash 2), weaponHint sword; stats retuned (2117c98a, 421014cc) | c | approved (struck the dart clause of 1)
491 | twin long bone swords with spiked hilt balls, propBuilder MONARCH_SWORD (071b5f23) | b | approved (struck 1, 2; b PASS)
## Rejected (last 4)
## Notes (max 3 lines)
- Its look and kit match custom.void_monarch: change the evil.* preset only; custom_* presets and custom.* ids stay untouched (custom keeps its staff, summon and giant size).
- 494 DEFECTS: in the idle the second sword's blade hides behind the left forearm. Blocker 2 of c stands for the fear status (the summon went in 493).
