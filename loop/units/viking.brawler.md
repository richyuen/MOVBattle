# viking.brawler
Status: open   Audited: 391, 395, 396, 397, 398   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (2 since 396)
 2. beard in _idle - TABS: a huge dark beard and moustache filling the jaw and chest (ref: .red.png, .jpg, card Appearance); ours: a short dark mass under the mask, not a jaw-wide beard onto the chest
 4. beard length in _idle: it stops at the top of the chest under the shield rim - TABS: the beard covers the chest down to the belt (ref: .red.png) (added 398)
 5. beard colour in _idle: it reads a lighter brown than the reference's near-black brown - TABS: dark beard (ref: .red.png) (added 398)
 (struck 1 at 394: the helmet; struck 3 at 397: puffy trousers, cream fur calf cuffs over brown boots)
b PASS (393)
c PASS (391)
d PASS (cost 220, hp 2.39x, dmg 1.08x, cd 0.60x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a beard - blocker 4: a second, wider bib piece down the chest under the beard, not a colour change on the existing cut - ref: .red.png - ours: unit_viking.brawler_idle.png
2. [S] a beard - blocker 5: the dark near-black brown of the reference, in the open lower face - ref: .red.png - ours: unit_viking.brawler_idle.png
## Attempts (iter | gap | criterion | verdict: approved, rejected, rejected-kept, dropped)
392 | bearded axe with a crescent head (8bcbb27 + 8289d53) | b | approved (struck b.1)
393 | own round board: two-tone face, boss, brown rim (b76e2fe) | b | approved (b PASS)
394 | full-face Norse helm (df2b922) | a | approved (struck a.1)
395 | dark beard from under the mask (d4bac61, reverted 0922c08) | a | rejected
396 | beard hung below the mask, 1.38 W jaw, stache at the mask's foot (3c8562d + 0ae74ce) | a | approved (narrowed a.2)
397 | brawlerLegs: puffy trousers, cream fur calf rolls, brown boots (707a5b0 + df9e860) | a | approved (struck a.3)
398 | mask ends at the cheek line, jaw-wide beard filling the open lower face (3c31474) | a | approved (a.2 stands; added 4, 5)
## Rejected (last 4)
- beard [S] [1] - 395: a dark beard hung from under the helm's mask - nearly all of it sat buried inside the mask (maskBottom -1.02 against under .17) and what showed read as a flat chinstrap
## Notes (max 3 lines)
- 398: BRAWLER_HELM.maskBottom -1.02 -> -0.52 with the cheek guards kept long (cheekBottom -1.02), so the lower face is open; VIKING_BEARD brawler cut jaw [1.5, .95, .8] at 1.0 down, z .55, stache at .62 low.
- The shield is held across the chest: anything the beard needs to show must clear the mask's bottom edge and the shield's top rim in _idle.
- The beard is self-lit .22; the critic read it lighter than the reference's near-black.
