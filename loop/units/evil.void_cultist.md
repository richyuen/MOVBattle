# evil.void_cultist
Status: open   Audited: 489 (AUDIT x2)   Done: -
## Verdicts
a FAIL (1 since 489, 1 struck)
 2. beard in unit_evil.void_cultist_idle: a small grey mask over the chin — TABS: a big dark-grey pointed beard and drooping moustache from the nose to mid-chest (ref: evil.void_cultist.blue.png)
 3. robe in unit_evil.void_cultist_idle: a grey-lilac robe — TABS: a near-black priest robe with a team-coloured stripe down the front (ref: evil.void_cultist.red.png)
b PASS (491 shoulder-wide spiked buckler)
c FAIL (0 since 489)
 1. attack in unit_evil.void_cultist_release: dark spear projectiles fired from 7.8 m — TABS: a melee mace blow (card "Bludgeon - Melee")
 2. ability in unit_evil.void_cultist_ability/_ability_after: a blue knight is summoned beside him and no enemy is pulled in — TABS: Sword Implosion sucks surrounding enemies into one point (card)
d PASS (491 stats)
## Ranked gaps
1. [S] evil.void_cultist.c melee mace — blocker 1: a melee mace blow (melee archetype, mace swing) in place of the ranged spears — ref: card "Bludgeon - Melee" — ours: unit_evil.void_cultist_release.png
2. [S] evil.void_cultist.a beard — blocker 2: evilDress cultistBeard, a faceted dark-grey pointed beard and drooping moustache from nose to mid-chest replacing the chin mask — ref: evil.void_cultist.blue.png — ours: unit_evil.void_cultist_idle.png
## Attempts (iter | gap | criterion | verdict)
492 | dark spiked halo, evilDress cultistHalo (68d128e0) | a | approved (struck 1, 4 by lineup test)
491 | shoulder-wide dark spiked buckler, evilDress cultistBuckler (4dfe45ac) | b | approved (struck 2; b PASS)
490 | thin dark spiked-ball mace, propBuilder CULTIST_MACE (a9a68a3e) | b | approved (struck 1)
## Rejected (last 4)
## Notes (max 3 lines)
- 490 DEFECTS: idle mace held slanted across the body, ball at the shoulder (TABS upright at the side).
- Dress is unitFactory dressVoidCultist (wheel, beard, robe bands); buckler moved to evilDress (world-sized, the hand frame is shrunken).
