# evil.void_monarch
Status: open   Audited: 489 (AUDIT x2)   Done: -
## Verdicts
a FAIL (0 since 489)
 1. scale in lineup_evil: a hunched giant (rig 2.79 m, s 1.55, size 2.08), the tallest in the lineup — TABS: 1.1x, a man's height (card Infobox; reference/factions/evil.jpg)
 2. crown in unit_evil.void_monarch_idle: a pale grey crown of spikes — TABS: a bone-tan crown of flared rays with a tall black-wrapped central spike ringed in pink (ref: evil.void_monarch.red.png)
 3. harness in unit_evil.void_monarch_idle: a single grey antler branch behind one shoulder — TABS: a bone V harness whose spiked wing-arms reach out over both shoulders (ref: evil.void_monarch.blue.png)
 4. chest in unit_evil.void_monarch_idle: a plain lilac block with a white fur collar — TABS: three bone chevron ribs across a dark tunic, over a studded belt (ref: evil.void_monarch.red.png)
 5. knees in unit_evil.void_monarch_idle: plain blue boots — TABS: big bone knee plates covered in spikes (ref: evil.void_monarch.red.png)
 6. arms in unit_evil.void_monarch_idle are bare — TABS: spiked bone balls at the elbows (ref: evil.void_monarch.blue.png)
b PASS (491 twin bone swords)
c FAIL (1 since 489, 1 struck)
 1. attack in unit_evil.void_monarch_release/_flight: he summons two Shadow Walkers — TABS: a two-sword melee strike with a radius-2 burst (card Weapons)
 2. ability in unit_evil.void_monarch_ability_after: a summon plus a fear status are logged — TABS: Void Monarch Dodge and Demon Transformation (rising into the air after 800 damage), no summon (card Abilities; evil.void_monarch.jpg)
d PASS (491 stats)
## Ranked gaps
1. [S] evil.void_monarch.c summon gone, burst shown — blocker 1: drop summon and summonUnitIds from the evil entry (custom keeps them) and spawn a pink-magenta radius-2 shard burst at each sword hit — ref: card Weapons, evil.void_monarch.jpg — ours: unit_evil.void_monarch_flight.png
2. [S] evil.void_monarch.a giant — blocker 1: drop the giant size class so he stands 1.1x a man — ref: card Infobox, reference/factions/evil.jpg — ours: lineup_evil.png
## Attempts (iter | gap | criterion | verdict)
492 | boss_melee archetype (boss.legendary splash 2), weaponHint sword; stats retuned (2117c98a, 421014cc) | c | approved (struck the "a dart flies off" clause of 1)
491 | twin long bone swords with spiked hilt balls, propBuilder MONARCH_SWORD (071b5f23) | b | approved (struck 1, 2; b PASS)
## Rejected (last 4)
## Notes (max 3 lines)
- Its look and kit match custom.void_monarch: change the evil.* preset only; custom_* presets and custom.* ids stay untouched (custom keeps its staff).
- 491 DEFECTS: blade narrower and paler cream than the render's olive-tan (not a blocker).
