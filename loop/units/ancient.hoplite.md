# ancient.hoplite
Status: open   Audited: 378   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (1 since 378)
 1. crest in unit_ancient.hoplite_idle (also lineup_ancient): now one solid stepped fin a third of the bowl wide, but a quarter-arc of bands hugging the bowl brow to nape — TABS: a tall boxy crest standing up off the bowl's top on a short stalk, flat-topped, square in profile (ref: .red.png)
 2. legs in _idle: grey boots — TABS: dark brown greaves knee to ankle over strapped sandals (ref: .red.png)
b PASS (383)
c PASS (381)
d PASS (cost 180, hp 1.26x, dmg 0.49x, cd 0.75x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a greaves — blocker 2: dark brown greaves knee to ankle over strapped sandals (ancientDress) — ref: .red.png — ours: unit_ancient.hoplite_idle.png
2. [S] a crest — blocker 1: hoplite-only crest variant in buildFittedHat: a short stalk at the crown carrying one tall flat-topped stepped box brow to nape, ~.6 of the bowl's height above it; the sarissa keeps the arc — ref: .red.png — ours: unit_ancient.hoplite_idle.png
## Attempts (iter | gap | criterion | verdict)
379-382 | aspis (ASPIS); dory low at the hip (DORY_CARRY); thrust (DORY_THRUST); carry aimed (DORY_AIM) [S] | b,c | approved
383 | crest bands each one solid swept strip, wide .42 (CORINTH_CREST, sweptBar) [S] (376288d) | a | approved
383 | aspis rim on flat unlit trim, three big tapered wave swirls (ASPIS_WAVE) [S] (0c3eee8) | b | approved (b PASS)
## Rejected (last 4)
## Notes (max 3 lines)
- Aspis is shield type "aspis" on body.torso at ASPIS; rim now SCUTUM_TRIM_FLAT unlit. _carryDory runs Idle/Walking/Attacking; probe output/loop/probe_hoplite.mjs.
- The sim logs a melee blow as the attack starts; the _release shot is a tick before the animator's attack, so the motion shows in _flight.
- Critic 383 minors: swirls fill about half the face (TABS sweep in from the rim); the crest side-on in _windup breaks into a fan of facets.
