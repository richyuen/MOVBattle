# viking.brawler
Status: open   Audited: 391, 395-398, 401, 402   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (3 since 396; 3 rejected [S], 2 since 396) [plateau]
 2. beard in _idle - TABS: a huge dark beard and moustache filling the jaw and chest (ref: .red.png, .jpg, card Appearance); ours: a short dark mass under the mask, not a jaw-wide beard onto the chest
 4. beard length in _idle: it stops at the top of the chest under the shield rim - TABS: the beard covers the chest down to the belt (ref: .red.png) (added 398)
 5. beard colour in _idle: it reads a lighter brown than the reference's near-black brown - TABS: dark beard (ref: .red.png) (added 398)
 (struck 1 at 394: the helmet; struck 3 at 397: puffy trousers, cream fur calf cuffs over brown boots)
b PASS (393)
c PASS (391)
d PASS (cost 220, hp 2.39x, dmg 1.08x, cd 0.60x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [R] a beard - blockers 2/4/5: rebuild brawlerBeard from .red.png: a near-black cut (glow .1), a jaw-wide mass, a bib stood proud of the chest by the board's depth so it hangs over the shield's top rim and down its face toward the boss, in front of the board in _idle (not the 401 bib2 behind it, not the 402 splay) - ref: .red.png - ours: unit_viking.brawler_idle.png
## Attempts (iter | gap | criterion | verdict)
392-393 | bearded axe with a crescent head; own round board: two-tone face, boss, brown rim [S] | b | approved (b PASS)
394 | full-face Norse helm (df2b922) | a | approved (struck a.1)
395 | dark beard from under the mask (d4bac61, reverted 0922c08) | a | rejected
396 | beard hung below the mask, 1.38 W jaw, stache at the mask's foot (3c8562d + 0ae74ce) | a | approved (narrowed a.2)
397 | brawlerLegs: puffy trousers, cream fur calf rolls, brown boots (707a5b0 + df9e860) | a | approved (struck a.3)
398 | mask to the cheek line, jaw-wide beard in the open lower face (3c31474) | a | approved (a.2 stands; added 4, 5)
401 | second, wider bib down the chest (05ccbb8 + 6f22d10, reverted a1edda8/3d01ac1) | a | rejected
402 | beard splay: 3 locks a side off the jaw, 1.0 W long, .15 up to .75 down (2230052, reverted 77a7b59) | a | rejected
## Rejected (last 4)
- beard [S] [2] - 395: hung from under the mask - buried inside it, what showed read as a flat chinstrap
- beard [S] [2] - 401: a second wider bib over the board's face - the centre line still ends at the shield's rim; the length read as a patch on the board
- beard [S] [3] - 402: six locks radiating sideways and up from the jaw - a spiked ruff TABS never shows; blocker 4 untouched
## Notes (max 3 lines)
- 402 critic's recipe: a bib stood proud of the chest by the board's depth so it hangs over the shield's top rim and down its face; hair hangs down, nothing sideways; a near-black cut.
- 398: BRAWLER_HELM.maskBottom -.52, cheek guards long; VIKING_BEARD brawler jaw [1.5,.95,.8] at 1.0 down, z .55, stache .62 low.
- The shield is held across the chest: the beard must clear the mask's bottom edge and sit in front of the board's face in _idle.
