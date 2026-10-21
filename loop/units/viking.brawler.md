# viking.brawler
Status: open   Audited: 391   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (1 since 391)
 2. beard in _idle — TABS: a huge dark beard and moustache filling the jaw and chest (ref: .red.png, .jpg, card Appearance); ours: no beard, a thin dark cone from the eyes over the mouth
 3. boots in _flight — TABS: puffy pants with big cream fur calf cuffs over brown boots (ref: .red.png, card Appearance); ours: slim blue legs and plain blue boots
  (struck 1 at 394: the helmet)
b PASS (393)
c PASS (391)
d PASS (cost 220, hp 2.39x, dmg 1.08x, cd 0.60x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a beard - blocker 2: a big dark faceted beard and moustache hung from under the mask onto the chest - ref: .red.png - ours: unit_viking.brawler_idle.png
2. [S] a boots - blocker 3: puffy pants with cream fur calf cuffs over brown boots - ref: .red.png - ours: unit_viking.brawler_flight.png
## Attempts (iter | gap | criterion | verdict: approved, rejected, rejected-kept, dropped)
392 | bearded axe: dark haft, grey crescent, poll, held up beside the board [S] (8bcbb27 + 8289d53) | b | approved (struck b.1)
393 | own round board: light/dark halves, big faceted boss, brown rim (ShieldType "norse") [S] (b76e2fe) | b | approved (b PASS)
394 | full-face Norse helm in place of the shared viking_helmet: dome, brow band, mask, cheek guards, nasal [S] (df2b922) | a | approved (struck a.1)
## Rejected (last 4)
## Notes (max 3 lines)
- 394 a.1: hat is "none" in unitVisuals; vikingDress brawlerHelm (BRAWLER_HELM) builds the dome, the brow band on the eye line (eyes at .12 H, .3 W across), the lower-face mask with cheek guards and the leather nasal.
- The shared viking_helmet's beard cone left with the helm, so his jaw is bare: the beard (a.2) is the next gap.
- 393 critic: the board's boss is pale grey, TABS a dark bronze-brown (not a lineup-distance blocker).
