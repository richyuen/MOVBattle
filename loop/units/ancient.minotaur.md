# ancient.minotaur
Status: open   Audited: 378   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (3 since 378)
 2. gear in unit_ancient.minotaur_idle: sash and buckle fixed, but the pauldron is a tilted light-blue plank sticking up off his left shoulder with a near-black block standing off behind it; belt a plain blue flared band, no readable scrolls or rims; no chest tuft — TABS: one patterned team pauldron seated on his left shoulder, scrolled team belt, dark chest tuft (ref: .red.png)
 3. scale in lineup_ancient: towers over Zeus (size 2.10) — TABS: about Zeus height (wiki 1.2x vs 1.5x) (ref: factions/ancient.jpg)
b PASS (379)
c FAIL (2 since 378)
 1. missing Big Headbutt (card ability, 4.5 m blast)
d PASS (cost 1600, hp 20.73x, dmg 2.16x, cd 0.99x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a gear — blocker 2: pauldron seated on the deltoid as one curved shell (no padTilt lift), rim flush, a lighter team scroll inlaid on its face; scroll curls readable on the belt's front face; dark chest tuft (ancientDress MINO_GEAR) — ref: .red.png — ours: unit_ancient.minotaur_idle.png
2. [S] c Big Headbutt — blocker 1: a head-down butt with a 4.5 m blast, logged in abilityLog — ref: card — ours: unit_ancient.minotaur_ability.png. Evidence first: capture.mjs takes the first special event (charge at 17 ms) as _ability.
## Attempts (iter | gap | criterion | verdict)
378 | fur body, team belt + pauldron, sash + buckle, tuft (dressMinotaur) [S] (87155bc +8ac5a35) | a | approved
378 | Minotaur Charge, head-down run (MINOTAUR_CHARGE) [S] (241b811) | c | approved
379 | bare fists, grab-then-punch (BULL_FISTS) [S] (4f9553c..88e0d0a) | b | approved
382 | bull head rebuilt (BULL_HEAD) [S] (4c7d9fb) | a | approved (struck a.1)
383 | gear: pauldron to his left (side -1) as top slab + flap, broad tan sash, frame buckle, belt rims + curls (MINO_GEAR) [S] (9779a54) | a | approved
## Rejected (last 4)
## Notes (max 3 lines)
- Body -x is his left (383). Critic 382 minors: horns grey-white straight segments (TABS tan, smooth curve); cranium a flat-topped box.
- Gear in ancientDress (MINO_*); the fur override skips every mesh of a prop. Head propBuilder bull_head (BULL_HEAD). Fists BULL_FISTS.
- Probe: output/loop/probe_mino.mjs (--build). Belt curls are tubes on the octagon's front faces; still not readable in 383.
