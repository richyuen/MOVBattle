# ancient.minotaur
Status: open   Audited: 378   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (5 since 378)
 2. gear in unit_ancient.minotaur_idle: the pauldron's rim and scroll do not read from the front; the girdle's band is a thin team strip half under the sash with the scroll curls hanging below it and no dark rim visible at its foot — TABS: tall team belt, lighter scrolls on its face, dark rim, scroll on the pauldron (ref: .red.png)
 3. scale in lineup_ancient: towers over Zeus (size 2.10) — TABS: about Zeus height (wiki 1.2x vs 1.5x) (ref: factions/ancient.jpg)
b PASS (379)
c FAIL (2 since 378)
 1. missing Big Headbutt (card ability, 4.5 m blast)
d PASS (cost 1600, hp 20.73x, dmg 2.16x, cd 0.99x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] c Big Headbutt — blocker 1: head-down butt (5 s cd), 4.5 m blast flinging nearby men, logged — ref: card — ours: unit_ancient.minotaur_ability.png. Evidence first: capture takes the first special event (charge at 17 ms) as _ability.
2. [S] a girdle face — blocker 2: tall band visible below the sash's low end (sash end up or girdle down), scrolls on it, dark foot rim; pauldron scroll facing front (ancientDress MINO_SCROLL) — ref: .red.png — ours: unit_ancient.minotaur_idle.png
## Attempts (iter | gap | criterion | verdict)
378 | fur body, team belt + pauldron, sash + buckle, tuft; Charge (dressMinotaur, MINOTAUR_CHARGE) [S] | a,c | approved
379 | bare fists, grab-then-punch (BULL_FISTS) [S] (4f9553c..88e0d0a) | b | approved
382 | bull head rebuilt (BULL_HEAD) [S] (4c7d9fb) | a | approved (struck a.1)
383 | gear: pauldron slab + flap, sash, frame buckle, belt rims + curls (MINO_GEAR) [S] (9779a54) | a | approved
385 | pauldron one curved shell, flush rim, scroll; spiky chest tuft (MINO_SHELL) [S] (3131dbb +ac045b2) | a | approved
386 | girdle .24 tall, rims, outlined ram's-horn scrolls; no tunic skirt; tuft on right breast (MINO_SCROLL) [S] (20a8ed6 +ab2eb1a) | a | approved (narrowed a.2)
## Rejected (last 4)
## Notes (max 3 lines)
- Body -x is his left. Critic 382 minors: horns grey-white straight segments (TABS tan, smooth curve); cranium a flat-topped box.
- Gear ancientDress (MINO_*); fur override skips props. Head propBuilder bull_head. unitFactory skips the tunic skirt for him (386). Probe: output/loop/probe_mino.mjs (--build).
- _idle: his bowed muzzle hides the left shoulder; the sash's low end covers the girdle front.
