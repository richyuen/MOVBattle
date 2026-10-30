# dynasty.firework_archer
Status: open   Audited: 411   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (2 since 411)
 4. legs in unit_dynasty.firework_archer_idle: plain legs and boots - TABS: wrapped shins with sandals (ref: dynasty.firework_archer.red.png)
  (struck 1 at 412: hair; 2, 3 at 417: robe, sash)
b FAIL (3 since 411)
 1. bow in unit_dynasty.firework_archer_idle: a small dark curved stick held low and horizontal - TABS: a large upright brown recurve with orange tip caps, taller than the torso (ref: dynasty.firework_archer.jpg)
  (struck 2 at 419: the fat rocket tube on an arrow)
c FAIL (2 since 411)
 3. release pose in unit_dynasty.firework_archer_release: the bow slung on her back while she runs - TABS: looses from a full draw with the rocket nocked (ref: dynasty.firework_archer.jpg)
  (struck 1 at 413: rocket in flight; 2 at 418: the burst, judged in _ability/_ability_after)
d PASS (cost 180, hp 0.62x, dmg 0.27x, cd 4.00x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] b upright bow - blocker 1: bow carried upright at her front, ends above the head and below the hip, so the rocket sits square across it (proceduralAnimation firework carry) - ref: dynasty.firework_archer.jpg - ours: unit_dynasty.firework_archer_idle.png
2. [S] c full-draw loose - blocker 3: a planted full-draw release with the rocket nocked - ref: dynasty.firework_archer.jpg - ours: unit_dynasty.firework_archer_release.png
3. [S] a legs - blocker 4: banded shin wraps and sandals (as NINJA_TROUSERS wraps) - ref: dynasty.firework_archer.red.png - ours: unit_dynasty.firework_archer_idle.png
## Attempts (iter | gap | criterion | verdict)
412 | ARCHER_HAIR (772d55d) | a | approved (struck 1)
413 | firework_bow (bb471b5) | b | approved (none struck)
413 | FIREWORK_ROCKET tube (191f1a5) | c | approved (struck 1)
417 | ARCHER_ROBE: lapel robe to the knee, orange-brown sash (55118a80) | a | approved (struck 2, 3)
418 | FIREWORK_BURST spark ball + 2.5 m blast, logged burst (ceb67f2b, 20d32730; evidence 79d583da) | c | approved (struck 2)
418 | FIREWORK_NOCK rocket across the grip (e9d4c966; 88c49c12 shrank it) | b | approved (none struck: arrow-thin)
419 | FIREWORK_NOCK rebuilt fat on an arrow shaft (efc224ec) | b | approved (struck 2)
## Rejected (last 4)
## Notes (max 3 lines)
- 418 critic: burst core a flat opaque hexagon over the man; 417: old tunic at collar/under sash, skirt behind the thighs.
- 413 critic: the rocket spawns at her head, not off the bow; she has no draw pose (c.3). DRAWS_BEFORE_LOOSE is the draw mechanism.
