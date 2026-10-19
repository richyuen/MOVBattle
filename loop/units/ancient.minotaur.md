# ancient.minotaur
Status: open   Audited: 378   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (5 since 378)
 2. gear in unit_ancient.minotaur_idle: the pauldron's rim and scroll do not read from the front; the girdle's band is a thin team strip half under the sash with the scroll curls hanging below it and no dark rim visible at its foot — TABS: tall team belt, lighter scrolls on its face, dark rim, scroll on the pauldron (ref: .red.png)
 3. scale in lineup_ancient: towers over Zeus (size 2.10) — TABS: about Zeus height (wiki 1.2x vs 1.5x) (ref: factions/ancient.jpg)
b PASS (379)
c PASS (387)
d PASS (cost 1600, hp 20.73x, dmg 2.16x, cd 0.99x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a girdle face — blocker 2: tall team belt with light scrolls and dark rim visible below the sash, scroll on the pauldron front (ancientDress MINO_SCROLL) — ref: .red.png — ours: unit_ancient.minotaur_idle.png
2. [S] a scale — blocker 3: about Zeus height in the lineup — ref: factions/ancient.jpg — ours: lineup_ancient.png
## Attempts (iter | gap | criterion | verdict)
378-379 | fur body, gear, sash; Charge (MINOTAUR_CHARGE); bare fists grab-then-punch (BULL_FISTS) [S] | a,b,c | approved
382 | bull head rebuilt (BULL_HEAD) [S] (4c7d9fb) | a | approved (struck a.1)
383 | gear: pauldron slab + flap, sash, frame buckle, belt rims + curls (MINO_GEAR) [S] (9779a54) | a | approved
385 | pauldron one curved shell, flush rim, scroll; spiky chest tuft (MINO_SHELL) [S] (3131dbb +ac045b2) | a | approved
386 | girdle .24 tall, rims, outlined ram's-horn scrolls; no tunic skirt (MINO_SCROLL) [S] (20a8ed6 +ab2eb1a) | a | approved (narrowed a.2)
387 | Big Headbutt: stop, head down, 4.5 m burst flings men, 5 s apart, first 5 s in (BIG_HEADBUTT) [S] (72be3fb +720dffe) | c | approved (c PASS)
## Rejected (last 4)
## Notes (max 3 lines)
- Body -x is his left. Gear ancientDress (MINO_*); head propBuilder bull_head; unitFactory skips the tunic skirt for him. Probe: output/loop/probe_mino.mjs (--build).
- _idle: his bowed muzzle hides the left shoulder; the sash's low end covers the girdle front. 387 minor: headbutt head drop modest.
- Capture ABILITY_PREF takes _ability on headbutt (5450 ms); simulationSystem BIG_HEADBUTT _landButts.
