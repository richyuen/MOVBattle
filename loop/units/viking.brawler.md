# viking.brawler
Status: open   Audited: 391, 395, 396, 397, 398, 401   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (3 since 396; 2 rejected [S])
 2. beard in _idle - TABS: a huge dark beard and moustache filling the jaw and chest (ref: .red.png, .jpg, card Appearance); ours: a short dark mass under the mask, not a jaw-wide beard onto the chest
 4. beard length in _idle: it stops at the top of the chest under the shield rim - TABS: the beard covers the chest down to the belt (ref: .red.png) (added 398)
 5. beard colour in _idle: it reads a lighter brown than the reference's near-black brown - TABS: dark beard (ref: .red.png) (added 398)
 (struck 1 at 394: the helmet; struck 3 at 397: puffy trousers, cream fur calf cuffs over brown boots)
b PASS (393)
c PASS (391)
d PASS (cost 220, hp 2.39x, dmg 1.08x, cd 0.60x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a beard - blocker 4: the jaw locks splayed wide of the board's outer edge, beard visible beside the shield (a bib layered on the board's face reads as a patch on the shield) - ref: .red.png - ours: unit_viking.brawler_idle.png
2. [S] a beard - blocker 5: the dark near-black brown of the reference, in the open lower face - ref: .red.png - ours: unit_viking.brawler_idle.png
## Attempts (iter | gap | criterion | verdict)
392 | bearded axe with a crescent head (8bcbb27 + 8289d53) | b | approved (struck b.1)
393 | own round board: two-tone face, boss, brown rim (b76e2fe) | b | approved (b PASS)
394 | full-face Norse helm (df2b922) | a | approved (struck a.1)
395 | dark beard from under the mask (d4bac61, reverted 0922c08) | a | rejected
396 | beard hung below the mask, 1.38 W jaw, stache at the mask's foot (3c8562d + 0ae74ce) | a | approved (narrowed a.2)
397 | brawlerLegs: puffy trousers, cream fur calf rolls, brown boots (707a5b0 + df9e860) | a | approved (struck a.3)
398 | mask to the cheek line, jaw-wide beard in the open lower face (3c31474) | a | approved (a.2 stands; added 4, 5)
401 | second, wider bib down the chest (05ccbb8 + 6f22d10, reverted a1edda8/3d01ac1) | a | rejected
## Rejected (last 4)
- beard [S] [2] - 395: a dark beard hung from under the helm's mask - nearly all of it sat buried inside the mask and what showed read as a flat chinstrap
- beard [S] [2] - 401: a second wider bib hung over the board's face - the beard's centre line still ends at the shield's top rim, so nothing reads as a beard down the chest; the added length read as a patch on the board
## Notes (max 3 lines)
- 401: vikingBeard's optional bib2 was tried and reverted - the board covers the chest from the rim down, so length added on the chest cannot show; splay the jaw locks wide of the board's outer edge instead.
- 398: BRAWLER_HELM.maskBottom -.52 with the cheek guards kept long; VIKING_BEARD brawler jaw [1.5,.95,.8] at 1.0 down, z .55, stache .62 low.
- The shield is held across the chest: anything the beard needs to show must clear the mask's bottom edge and the board's outer edge in _idle.
