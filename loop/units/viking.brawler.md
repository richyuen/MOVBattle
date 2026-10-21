# viking.brawler
Status: open   Audited: 391, 395, 396   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (0 since 396)
 2. beard in _idle - TABS: a huge dark beard and moustache filling the jaw and chest (ref: .red.png, .jpg, card Appearance); ours: no beard, a thin dark cone from the eyes over the mouth
 3. boots in _flight - TABS: puffy pants with big cream fur calf cuffs over brown boots (ref: .red.png, card Appearance); ours: slim blue legs and plain blue boots
  (struck 1 at 394: the helmet; 396: a dark beard hangs under the mask now, but it is still a narrow wedge, not past both cheek guards, and the bib never reads past the shield)
b PASS (393)
c PASS (391)
d PASS (cost 220, hp 2.39x, dmg 1.08x, cd 0.60x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a huge beard - blocker 2: jaw wider than both cheek guards, bib on the chest in front of the shield - ref: .red.png - ours: unit_viking.brawler_idle.png
2. [S] a fur boots - blocker 3: puffy pants, cream fur calf cuffs, brown boots - ref: .red.png - ours: unit_viking.brawler_flight.png
## Attempts (iter | gap | criterion | verdict)
392 | bearded axe with a crescent head (8bcbb27 + 8289d53) | b | approved (struck b.1)
393 | own round board: two-tone face, boss, brown rim (b76e2fe) | b | approved (b PASS)
394 | full-face Norse helm (df2b922) | a | approved (struck a.1)
395 | dark beard from under the mask (d4bac61, reverted 0922c08) | a | rejected
396 | beard hung below the mask, 1.38 W jaw, stache at the mask's foot (3c8562d + 0ae74ce) | a | approved (narrowed a.2)
## Rejected (last 4)
- beard [S] [1] - 395: a dark beard hung from under the helm's mask - nearly all of it sat buried inside the mask (maskBottom -1.02 against under .17) and what showed read as a flat chinstrap
## Notes (max 3 lines)
- 396: VIKING_BEARD takes a helmed cut (jaw/jawY/jawZ, stacheLow/stacheZ, burns off); the brawler's jaw is 1.38 W at 1.06 H, muzzle 1.24 D. The shield still covers the bib.
- The shield is held across the chest: anything the beard needs to show must clear the mask's bottom edge and the shield's top rim in _idle.
