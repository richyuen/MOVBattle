# viking.brawler
Status: open   Audited: 391, 395-398, 401, 402   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (1 since 407; the [R] struck 2 and 5 at 407, plateau cleared)
 4. beard length in _idle: it stops at the top of the chest under the shield rim - TABS: the beard covers the chest down to the belt (ref: .red.png) (added 398)
 (struck 1 at 394: the helmet; struck 3 at 397: puffy trousers, cream fur calf cuffs over brown boots; struck 2 at 407: jaw-wide beard onto the chest; struck 5 at 407: near-black brown)
b PASS (393)
c PASS (391)
d PASS (cost 220, hp 2.39x, dmg 1.08x, cd 0.60x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a beard length - blocker 4: a torso-hung beard tail that drops in front of the board's rim down to the belt line, replacing the board-glued spill (vikingDress brawlerBeard) - ref: viking.brawler.jpg - ours: unit_viking.brawler_idle.png
## Attempts (iter | gap | criterion | verdict)
392-393 | bearded axe with a crescent head; own round board: two-tone face, boss, brown rim [S] | b | approved (b PASS)
394-398 | full-face Norse helm; beard under the mask (395 rejected); 1.38 W jaw; brawlerLegs; mask to the cheek line [S] | a | approved
401 | second, wider bib down the chest (05ccbb8 + 6f22d10, reverted) | a | rejected
402 | beard splay: 3 locks a side off the jaw (2230052, reverted 77a7b59) | a | rejected
407 | [R] BRAWLER_BEARD: near-black jaw mass, torso bib, spill lying on the board's face toward the boss (9ece9b8) | a | approved (struck 2, 5)
## Rejected (last 4)
- beard [S] [2] - 395: hung from under the mask - buried inside it, what showed read as a flat chinstrap
- beard [S] [2] - 401: a second wider bib over the board's face - the centre line still ends at the shield's rim; the length read as a patch on the board
- beard [S] [3] - 402: six locks radiating sideways and up from the jaw - a spiked ruff TABS never shows; blocker 4 untouched
## Notes (max 3 lines)
- 407 critic: the spill reads as a dark stripe painted on the board; in lineup_viking the chest between board and belt shows no beard. Hair hangs from the chin in front of the body.
- 407 probe_axes: in the idle the board lies as a tray, face normal (0,.97,.23) in the torso frame, centre .1 under the chin; the torso front is at z .11.
- 398: BRAWLER_HELM.maskBottom -.52, cheek guards long.
