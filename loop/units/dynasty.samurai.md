# dynasty.samurai
Status: open   Audited: 411   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (3 since 411)
 1. kabuto helmet in unit_dynasty.samurai_idle: a dark maroon bowl with a yellow fringe hiding the face - TABS: a team-coloured kabuto with a flared, gold-trimmed neck guard and a front crest, with two bead eyes under the brim (ref: dynasty.samurai.red.png)
  (struck 2 at 419: lamellar cuirass, gold rows, sode; 3, 4 at 420: hakama, gold-banded greaves)
b PASS (416: light steel blade, 52fa1771)
c PASS (418: the crescent at his chest, the katana swung through, 073a4c36 + 33baf14d)
d PASS (cost 140, hp 1.51x, dmg 2.00x, cd 1.80x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a kabuto - blocker 1: a flared gold-edged shikoro - three widening six-sided frustum rings round the back half of the bowl out to shoulder width - and a tall flat gold maedate crest at the brow (samuraiKabuto) - ref: dynasty.samurai.red.png - ours: unit_dynasty.samurai_idle.png
## Attempts (iter | gap | criterion | verdict)
413 | KABUTO: team bowl, gold peak, 3 flared gold-rimmed lames, gold crest (e140c38) | a | approved (none struck)
414 | [P] kabuto opening to the front, arc .55 (981199b; evidence 0434511 idle swing .3) | a | approved (none struck; lames read gold)
414 | KATANA_REST + _restKatana: upright in both fists (1b007b1) | b | approved (struck 1; added 3)
415 | katana along the forearm in the swing, rest eases back .8 s, rest edge-forward (44749436) | b | approved (struck 3)
416 | [P] KATANA_STEEL light grey blade (52fa1771) | b | approved (struck 2; b PASS)
417 | SAMURAI_BLOCK + deflectAt + SLASH_ARC (e7f66440; evidence 101e6c62 archer foe) | c | approved (struck 1; added 2)
418 | block within 1.3 m, turn + swing, crescent at his chest (073a4c36, 33baf14d) | c | approved (c PASS)
419 | SAMURAI_CUIRASS lamellar, gold rows, sode (95700a8c) | a | approved (struck 2)
420 | SAMURAI_HAKAMA flared hakama + gold-banded greaves (69c590af) | a | approved (struck 3, 4)
## Rejected (last 4)
## Notes (max 3 lines)
- 420 critic: the kabuto lames bunch at one side of the bowl (TABS a skirt flaring all round the back to near shoulder width, a tall crest); feet dark boot blocks (TABS geta with team straps).
- 419 critic: cuirass + sode one wide square block (TABS trimmer); purple tunic shows at the neck and under the rim. 413: head facets poke through the bowl.
- 411 audit: the capture scene uses a melee knight, so no shot can show a deflect (c.1: evidence commit first). The overhead chop reads.
