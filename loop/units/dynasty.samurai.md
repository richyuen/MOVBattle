# dynasty.samurai
Status: open   Audited: 411   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (1 since 411)
 1. kabuto helmet in unit_dynasty.samurai_idle: a dark maroon bowl with a yellow fringe hiding the face - TABS: a team-coloured kabuto with a flared, gold-trimmed neck guard and a front crest, with two bead eyes under the brim (ref: dynasty.samurai.red.png)
 2. chest armour in unit_dynasty.samurai_idle: a plain purple tunic box - TABS: a team-coloured lamellar cuirass with gold trim lines and shoulder sode plates (ref: dynasty.samurai.red.png)
 3. trousers in unit_dynasty.samurai_idle: slim blue legs - TABS: wide flared team-coloured hakama to the knee (ref: dynasty.samurai.red.png)
 4. shin armour in unit_dynasty.samurai_idle: dark plain boots - TABS: gold-banded team-coloured greaves over geta sandals (ref: dynasty.samurai.red.png, card Appearance)
b FAIL (1 since 411)
 2. katana blade in unit_dynasty.samurai_idle: reads as a short dark ridged stick about a forearm long - TABS: a slender light steel blade longer than the torso with a round tsuba (ref: dynasty.samurai.red.png)
 3. katana in unit_dynasty.samurai_windup: the blade hangs down behind his back from the raised fist with the wrapped grip sticking out past the fist, inverted for the chop - TABS: the blade raised high over the head in both hands for the two-handed overhead cut (ref: dynasty.samurai.jpg, card Weapon Type Two-handed) (added 414, by 1b007b1)
  (struck 1 at 414: the upright two-handed hold)
c FAIL (0 since 411)
 1. missing: Projectile Block (a bright deflecting slash against incoming projectiles) - nothing in the sim; summary records only the melee hit at 1300 ms (ref: card Weapons ability)
d PASS (cost 140, hp 1.51x, dmg 2.00x, cd 1.80x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] b katana in the swing - blocker 3: reset the blade's rotationQuaternion outside the rest (w<=0.01) so the authored overhead grip returns; turn the rest blade edge-forward (b.2 dark flat) - ref: dynasty.samurai.jpg - ours: unit_dynasty.samurai_windup.png
2. [P] a kabuto lames team-coloured, gold only on the rims, crest .6 raised over the peak (fallout of e140c38) - blocker 1 - shows in unit_dynasty.samurai_idle
3. [S] a cuirass - blocker 2: a team lamellar cuirass with gold trim lines and sode shoulder plates (dynastyDress) - ref: dynasty.samurai.red.png - ours: unit_dynasty.samurai_idle.png
## Attempts (iter | gap | criterion | verdict)
413 | KABUTO: team bowl, gold peak, 3 flared gold-rimmed lames, gold crest (e140c38) | a | approved (none struck: the lames cross the face)
414 | [P] kabuto opening to the front, arc .55 (981199b; evidence 0434511 idle swing .3) | a | approved (none struck; lames read gold)
414 | KATANA_REST + _restKatana: upright in both fists (1b007b1) | b | approved (struck 1; added 3)
## Rejected (last 4)
## Notes (max 3 lines)
- 413 critic: head facets poke through the bowl's sides.
- 411 audit: the capture scene uses a melee knight, so no shot can show a deflect (c.1: evidence commit first). The overhead chop reads.
