# ancient.minotaur
Status: open   Audited: 378   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (1 since 378)
 1. head in _idle: small bull mask on a man's head, straight white cone horns, a hat brim — TABS: big bull head on a thick forward neck, tan horns curving out and up, floppy ears, broad snout (ref: .red.png, .png)
 2. gear in _idle: pauldron a plain light-blue dome on his hammer (right) shoulder; sash thin, fur-toned, barely reads; buckle a tiny white diamond; belt plain blue, no scrolls; no chest tuft visible — TABS: patterned team pauldron on his left (render's right), broad tan sash, chunky grey square buckle, scrolled team belt (ref: .red.png)
 3. scale in lineup_ancient: towers over Zeus (size 2.10) — TABS: about Zeus height (wiki 1.2x vs 1.5x) (ref: factions/ancient.jpg)
b FAIL (0 since 378)
 1. sledgehammer in the right hand in _idle, _windup — TABS: bare-fisted (Minotaur Grab both hands) (ref: card Infobox, .png)
c FAIL (1 since 378)
 1. missing Big Headbutt (card ability, 4.5 m blast)
 2. blow in _release/_flight: overhead hammer smash on a downed man — TABS: grabs and punches with fists (ref: .png, card)
d PASS (cost 1600, hp 20.73x, dmg 2.16x, cd 0.99x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] b bare fists, no hammer — blocker 1: unitVisuals weapon none + Minotaur Grab fists — ref: .png — ours: unit_ancient.minotaur_windup.png
2. [S] a bull head: big head, curved tan horns, floppy ears, broad snout — blocker 1 (hat bull_head / ancientDress) — ref: .red.png — ours: unit_ancient.minotaur_idle.png
3. [S] c fist grab-and-punch blow — blocker 2 — ref: .png — ours: unit_ancient.minotaur_release.png
## Attempts (iter | gap | criterion | verdict)
378 | brown fur body, team belt + pauldron, sash + buckle, chest tuft (ancientDress dressMinotaur) [S] (87155bc +8ac5a35) | a | approved
378 | Minotaur Charge, head-down run (MINOTAUR_CHARGE, BULL_CHARGE) [S] (241b811) | c | approved
## Rejected (last 4)
## Notes (max 3 lines)
- Critic 378 minors: fur reads pale greyish taupe (TABS warm red-brown ~130,80,65); on the run the arms hold the hammer across the body (b.1 consequence).
- Gear in web/src/units/ancientDress.ts (MINO_*); the fur override skips every mesh of a prop.
