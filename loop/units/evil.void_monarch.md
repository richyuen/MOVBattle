# evil.void_monarch
Status: open   Audited: 489 (AUDIT x2)   Done: -
## Verdicts
a FAIL (2 since 489, 2 struck)
 2. crown in unit_evil.void_monarch_idle: a pale grey crown of spikes — TABS: a bone-tan crown of flared rays with a tall black-wrapped central spike ringed in pink (ref: evil.void_monarch.red.png)
 4. chest in unit_evil.void_monarch_idle: a plain lilac block with a white fur collar — TABS: three bone chevron ribs across a dark tunic, over a studded belt (ref: evil.void_monarch.red.png)
 5. knees in unit_evil.void_monarch_idle: plain blue boots — TABS: big bone knee plates covered in spikes (ref: evil.void_monarch.red.png)
 6. arms in unit_evil.void_monarch_idle are bare — TABS: spiked bone balls at the elbows (ref: evil.void_monarch.blue.png)
b PASS (491 twin bone swords)
c FAIL (2 since 489, 2 struck)
 2. ability in unit_evil.void_monarch_ability_after: a summon plus a fear status are logged — TABS: Void Monarch Dodge and Demon Transformation (rising into the air after 800 damage), no summon (card Abilities; evil.void_monarch.jpg)
d PASS (496 stats)
## Ranked gaps
1. [S] evil.void_monarch.a chest — blocker 4: three bone chevron ribs on a dark tunic over a studded belt — ref: evil.void_monarch.red.png — ours: unit_evil.void_monarch_idle.png
2. [S] evil.void_monarch.a knees — blocker 5: big spiked bone knee plates — ref: evil.void_monarch.red.png — ours: unit_evil.void_monarch_idle.png
3. [S] evil.void_monarch.c fear ability — blocker 2: Demon Transformation, after 800 damage he rises into the air; no fear — ref: evil.void_monarch.jpg — ours: unit_evil.void_monarch_ability_after.png
## Attempts (iter | gap | criterion | verdict)
496 | bone V harness with spiked wing-arms over both shoulders, evilDress monarchHarness (evil preset only) (4f58d007) | a | approved (struck 3)
494 | no giant size class, man-sized vis 1.2/1.12 (cdc2f6f8; stats e2469b0d) | a | approved (struck 1)
493 | no summon; pink radius-2 burst at each blow, simulationSystem MONARCH_BURST (f22ca9e7) | c | approved (struck 1)
492 | boss_melee archetype (boss.legendary splash 2), weaponHint sword; stats retuned (2117c98a, 421014cc) | c | approved (struck the dart clause of 1)
491 | twin long bone swords with spiked hilt balls, propBuilder MONARCH_SWORD (071b5f23) | b | approved (struck 1, 2; b PASS)
## Rejected (last 4)
## Notes (max 3 lines)
- Its look and kit match custom.void_monarch: change the evil.* preset only (HORNED_EVIL harness flag); custom_* presets and custom.* ids stay untouched (custom keeps its staff, summon, pauldrons, giant size).
- 496 DEFECTS: harness and crown read pale grey-white, not bone-tan (colour only); wing-arms rise steeply where TABS runs them out near level.
