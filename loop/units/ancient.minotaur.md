# ancient.minotaur
Status: open   Audited: 378   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (4 since 378)
 2. gear in unit_ancient.minotaur_idle: the pauldron is one curved team shell on the left shoulder now, but its rim and scroll do not read from the front; the chest tuft is a small spike clump half under the sash; the belt a plain flared blue band, no scrolls or rim — TABS: scrolled team belt with a dark rim, scroll on the pauldron, dark tuft clear on the chest (ref: .red.png)
 3. scale in lineup_ancient: towers over Zeus (size 2.10) — TABS: about Zeus height (wiki 1.2x vs 1.5x) (ref: factions/ancient.jpg)
b PASS (379)
c FAIL (2 since 378)
 1. missing Big Headbutt (card ability, 4.5 m blast)
d PASS (cost 1600, hp 20.73x, dmg 2.16x, cd 0.99x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a gear — blocker 2: scrolled team belt (dark rim band at the foot, two big lighter scroll tubes on its front), tuft moved clear above the sash (ancientDress MINO_BELT) — ref: .red.png — ours: unit_ancient.minotaur_idle.png
2. [S] c Big Headbutt — blocker 1: a head-down butt with a 4.5 m blast, logged in abilityLog — ref: card — ours: unit_ancient.minotaur_ability.png. Evidence first: capture.mjs takes the first special event (charge at 17 ms) as _ability.
## Attempts (iter | gap | criterion | verdict)
378 | fur body, team belt + pauldron, sash + buckle, tuft; Charge (dressMinotaur, MINOTAUR_CHARGE) [S] | a,c | approved
379 | bare fists, grab-then-punch (BULL_FISTS) [S] (4f9553c..88e0d0a) | b | approved
382 | bull head rebuilt (BULL_HEAD) [S] (4c7d9fb) | a | approved (struck a.1)
383 | gear: pauldron slab + flap, broad tan sash, frame buckle, belt rims + curls (MINO_GEAR) [S] (9779a54) | a | approved
385 | pauldron one curved shell on the deltoid, flush rim, scroll; spiky chest tuft (MINO_SHELL) [S] (3131dbb +ac045b2) | a | approved
## Rejected (last 4)
## Notes (max 3 lines)
- Body -x is his left (383). Critic 382 minors: horns grey-white straight segments (TABS tan, smooth curve); cranium a flat-topped box.
- Gear in ancientDress (MINO_*); the fur override skips every mesh of a prop. Head propBuilder bull_head (BULL_HEAD). Fists BULL_FISTS. Probe: output/loop/probe_mino.mjs (--build).
- _idle: his bowed muzzle hides the left shoulder; belt curls (tubes on the octagon's front faces) still unreadable in 385.
