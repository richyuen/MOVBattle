# ancient.minotaur
Status: open   Audited: 378   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (5 since 378; 1 rejected [S] since 378)
 2. gear in unit_ancient.minotaur_idle: the girdle a thin light team strip at the waist, its darker scroll curls hanging below it, no tall band face, no dark foot rim; the pauldron's rim and scroll do not read from the front — TABS: tall team belt (~a quarter of the trunk), lighter scrolls flat on its face, dark rim, scroll on the pauldron (ref: .red.png)
 3. scale in lineup_ancient: towers over Zeus (size 2.10) — TABS: about Zeus height (wiki 1.2x vs 1.5x) (ref: factions/ancient.jpg)
b PASS (379)
c PASS (387)
d PASS (cost 1600, hp 20.73x, dmg 2.16x, cd 0.99x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a girdle — blocker 2: rebuild it as one tall team band (~.25 of the trunk) with lighter flat scroll inlays inside its outline on the front face and a dark rim strip at its foot (ancientDress MINO_SCROLL) — ref: .red.png — ours: unit_ancient.minotaur_idle.png
2. [S] a scale — blocker 3: about Zeus height in the lineup — ref: factions/ancient.jpg — ours: lineup_ancient.png
## Attempts (iter | gap | criterion | verdict)
378-379 | fur body, gear, sash; Charge (MINOTAUR_CHARGE); bare fists (BULL_FISTS) [S] | a,b,c | approved
382-385 | bull head (BULL_HEAD); gear (MINO_GEAR); pauldron shell, chest tuft (MINO_SHELL) [S] | a | approved
386 | girdle .24 tall, rims, outlined ram's-horn scrolls; no tunic skirt (MINO_SCROLL) [S] (20a8ed6 +ab2eb1a) | a | approved (narrowed a.2)
387 | Big Headbutt (BIG_HEADBUTT) [S] (72be3fb +720dffe) | c | approved (c PASS)
388 | sash foot raised to his right flank + wrap piece, off the girdle (MINO_SASH_FOOT) [S] (8b1943a, reverted 55b56d1) | a | rejected
## Rejected (last 4)
- girdle face [S] [1] — 388: sash ended on the flank with a side wrap — the girdle itself stayed a thin strip with dangling curls; the wrap read as a loose tan slab on the flank
## Notes (max 3 lines)
- Body -x is his left. Gear ancientDress (MINO_*); head propBuilder bull_head; unitFactory skips the tunic skirt for him. Probe: output/loop/probe_mino.mjs (--build).
- _idle: his bowed muzzle hides the left shoulder; a crossed forearm lies over the waist. 387 minor: headbutt head drop modest.
- The girdle's scroll tubes sit at the band's open middle but read below it: put the inlays inside the band face, not hanging.
