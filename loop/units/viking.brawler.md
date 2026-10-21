# viking.brawler
Status: open   Audited: 391, 395, 396, 397   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (1 since 396)
 2. beard in _idle - TABS: a huge dark beard and moustache filling the jaw and chest (ref: .red.png, .jpg, card Appearance); ours: a short dark mass under the mask, not a jaw-wide beard onto the chest
 (struck 1 at 394: the helmet; struck 3 at 397: puffy trousers, cream fur calf cuffs over brown boots)
b PASS (393)
c PASS (391)
d PASS (cost 220, hp 2.39x, dmg 1.08x, cd 0.60x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a beard - blocker 2: a jaw-wide dark beard and moustache hanging onto the chest, visible in _idle and lineup_viking (VIKING_BEARD brawler cut) - ref: .red.png - ours: unit_viking.brawler_idle.png
## Attempts (iter | gap | criterion | verdict)
392 | bearded axe with a crescent head (8bcbb27 + 8289d53) | b | approved (struck b.1)
393 | own round board: two-tone face, boss, brown rim (b76e2fe) | b | approved (b PASS)
394 | full-face Norse helm (df2b922) | a | approved (struck a.1)
395 | dark beard from under the mask (d4bac61, reverted 0922c08) | a | rejected
396 | beard hung below the mask, 1.38 W jaw, stache at the mask's foot (3c8562d + 0ae74ce) | a | approved (narrowed a.2)
397 | brawlerLegs: puffy trousers, unlit cream fur calf rolls, brown boots over the feet (707a5b0 + df9e860) | a | approved (struck a.3)
## Rejected (last 4)
- beard [S] [1] - 395: a dark beard hung from under the helm's mask - nearly all of it sat buried inside the mask (maskBottom -1.02 against under .17) and what showed read as a flat chinstrap
## Notes (max 3 lines)
- 397: BRAWLER_LEGS (thighOut 1.3, hemOut 1.36, cuffOut 1.52 with 7 clumps, bootOut 1.14, feet in the boot's leather over a dark sole). The fur is an unlit material, its meshes glow-excluded.
- 396: VIKING_BEARD takes a helmed cut (jaw/jawY/jawZ, stacheLow/stacheZ, burns off); the brawler's jaw is 1.38 W at 1.06 H, muzzle 1.24 D. The shield still covers the bib.
- The shield is held across the chest: anything the beard needs to show must clear the mask's bottom edge and the shield's top rim in _idle.
