# viking.brawler
Status: open   Audited: 391, 395   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (1 since 391)
 2. beard in _idle - TABS: a huge dark beard and moustache filling the jaw and chest (ref: .red.png, .jpg, card Appearance); ours: no beard, a thin dark cone from the eyes over the mouth
 3. boots in _flight - TABS: puffy pants with big cream fur calf cuffs over brown boots (ref: .red.png, card Appearance); ours: slim blue legs and plain blue boots
 (struck 1 at 394: the helmet)
b PASS (393)
c PASS (391)
d PASS (cost 220, hp 2.39x, dmg 1.08x, cd 0.60x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a beard - blocker 2: start the jaw mass BELOW the mask's bottom edge, proud of the mask face, with a bib at least .9 head heights onto the chest and a braid, so it spills out under the mask - ref: .jpg - ours: unit_viking.brawler_idle.png
2. [S] a boots - blocker 3: puffy pants, cream fur calf cuffs over brown boots (reuse the headbutter's boot shell and fur ring) - ref: .red.png - ours: unit_viking.brawler_flight.png
## Attempts (iter | gap | criterion | verdict)
392 | bearded axe with a crescent head (8bcbb27 + 8289d53) | b | approved (struck b.1)
393 | own round board: two-tone face, boss, brown rim (b76e2fe) | b | approved (b PASS)
394 | full-face Norse helm (df2b922) | a | approved (struck a.1)
395 | dark beard from under the mask (d4bac61, reverted 0922c08) | a | rejected
## Rejected (last 4)
- beard [S] [1] - 395: a dark beard hung from under the helm's mask - nearly all of it sat buried inside the mask (maskBottom -1.02 against under .17) and what showed read as a flat chinstrap
## Notes (max 3 lines)
- The shield is held across the chest: anything the beard needs to show must clear the mask's bottom edge and the shield's top rim in _idle.
- 394 a.1: hat is "none"; vikingDress brawlerHelm builds the dome, brow band, lower-face mask with cheek guards and the leather nasal.
