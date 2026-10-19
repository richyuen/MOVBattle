# ancient.minotaur
Status: open   Audited: 378   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (2 since 378)
 2. gear in _idle: pauldron a plain light-blue dome on the wrong shoulder; sash thin, fur-toned; buckle a tiny white diamond; belt plain blue, no scrolls; no chest tuft — TABS: patterned team pauldron on his left (render's right), broad tan sash, chunky grey square buckle, scrolled team belt (ref: .red.png)
 3. scale in lineup_ancient: towers over Zeus (size 2.10) — TABS: about Zeus height (wiki 1.2x vs 1.5x) (ref: factions/ancient.jpg)
b PASS (379)
c FAIL (2 since 378)
 1. missing Big Headbutt (card ability, 4.5 m blast)
d PASS (cost 1600, hp 20.73x, dmg 2.16x, cd 0.99x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] c Big Headbutt — blocker 1: a headbutt ability with a 4.5 m blast, logged in abilityLog — ref: card Weapons — ours: unit_ancient.minotaur_ability.png. Evidence first: capture.mjs takes the first special event (charge at 17 ms) as _ability, so a headbutt needs its own frame.
2. [S] a gear — blocker 2: patterned team pauldron on his left, broad tan sash, chunky grey square buckle, scrolled belt (ancientDress MINO_PAULDRON/MINO_SASH) — ref: .red.png — ours: unit_ancient.minotaur_idle.png
## Attempts (iter | gap | criterion | verdict)
378 | brown fur body, team belt + pauldron, sash + buckle, chest tuft (ancientDress dressMinotaur) [S] (87155bc +8ac5a35) | a | approved
378 | Minotaur Charge, head-down run (MINOTAUR_CHARGE, BULL_CHARGE) [S] (241b811) | c | approved
379 | bare fists, carry out at the flanks, grab-then-punch (BULL_FISTS, no hammer) [S] (4f9553c +c54ed63 +f07a183 +88e0d0a) | b | approved (also struck c.2)
382 | bull head rebuilt: cranium, long face, muzzle, curved horns, floppy ears, thick neck (BULL_HEAD) [S] (4c7d9fb) | a | approved (struck a.1)
## Rejected (last 4)
## Notes (max 3 lines)
- Critic 379 minors: right fist akimbo on the hip in _idle; _windup cock flings one arm straight up. 382 minors: horns grey-white straight segments (TABS tan, smooth curve); cranium a flat-topped box (TABS rounded poll).
- Gear in web/src/units/ancientDress.ts (MINO_*); the fur override skips every mesh of a prop. Head is propBuilder bull_head (BULL_HEAD). Fists: BULL_FISTS, _applyBullFists.
- Probe: output/loop/probe_mino.mjs (--build) prints his joints in placement.
