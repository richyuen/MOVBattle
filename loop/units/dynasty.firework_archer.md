# dynasty.firework_archer
Status: open   Audited: 411   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (2 since 411)
 4. legs in unit_dynasty.firework_archer_idle: plain legs and boots - TABS: wrapped shins with sandals (ref: dynasty.firework_archer.red.png)
  (struck 1 at 412: hair; 2, 3 at 417: robe, sash)
b PASS (420: the bow stood near upright at her front, ends over the head and below the hip, 59a5baca)
c PASS (420: she looses from a planted draw with the rocket nocked, 1cb514fd; the rocket in flight 413, the burst 418)
d PASS (cost 180, hp 0.62x, dmg 0.27x, cd 4.00x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a legs - blocker 4: wrapped shins as stacked ring bands with sandals (a dynasty LEG_WRAPS, as NINJA_TROUSERS wraps) - ref: dynasty.firework_archer.red.png - ours: unit_dynasty.firework_archer_idle.png
2. [P] b tip caps (fallout of 59a5baca): FIREWORK_BOW.cap .12 -> .2, the cap a self-lit cloth (.92,.5,.12), seen at both stave ends in unit_dynasty.firework_archer_idle
## Attempts (iter | gap | criterion | verdict)
412 | ARCHER_HAIR (772d55d) | a | approved (struck 1)
413 | firework_bow (bb471b5) | b | approved (none struck)
413 | FIREWORK_ROCKET tube (191f1a5) | c | approved (struck 1)
417 | ARCHER_ROBE: lapel robe to the knee, orange-brown sash (55118a80) | a | approved (struck 2, 3)
418 | FIREWORK_BURST spark ball + 2.5 m blast, logged burst (ceb67f2b, 20d32730; evidence 79d583da) | c | approved (struck 2)
418 | FIREWORK_NOCK rocket across the grip (e9d4c966; 88c49c12 shrank it) | b | approved (none struck: arrow-thin)
419 | FIREWORK_NOCK rebuilt fat on an arrow shaft (efc224ec) | b | approved (struck 2)
420 | DRAWS_BEFORE_LOOSE: planted full draw (1cb514fd) | c | approved (struck 3; c PASS)
420 | FIREWORK_REST: the bow upright in the world at rest (59a5baca) | b | approved (struck 1; b PASS)
## Rejected (last 4)
## Notes (max 3 lines)
- 420 critic: the string stays straight in _release, the draw hand by her ear (TABS the string pulled in a V: give the firework bow the ICE_NOCK split string); a second rocket is nocked while the first flies; tip caps unreadable.
- 418 critic: burst core a flat opaque hexagon over the man; 417: old tunic at collar/under sash, skirt behind the thighs.
- Her burn status is logged at the decision (`fire` + `status:fire`, target hurt at 400 ms) while the rocket leaves at `throw` 1900 ms: the impact note is the burn, not a second rocket.
