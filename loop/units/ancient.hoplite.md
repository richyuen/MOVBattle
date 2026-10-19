# ancient.hoplite
Status: open   Audited: 378   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (2 since 378)
 1. crest in unit_ancient.hoplite_idle (also lineup_ancient): one solid stepped fin a third of the bowl wide, a quarter-arc of bands hugging the bowl brow to nape — TABS: a tall boxy crest standing up off the bowl's top on a short stalk, flat-topped, square in profile (ref: .red.png)
b PASS (383)
c PASS (381)
d PASS (cost 180, hp 1.26x, dmg 0.49x, cd 0.75x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a crest — blocker 1: hoplite-only crest variant in buildFittedHat: a short stalk at the crown carrying one tall flat-topped square-profile box brow to nape, ~.6 of the bowl's height above it; the sarissa keeps the arc (propBuilder CORINTH_CREST) — ref: .red.png — ours: unit_ancient.hoplite_idle.png
## Attempts (iter | gap | criterion | verdict)
379-382 | aspis (ASPIS); dory low at the hip (DORY_CARRY); thrust (DORY_THRUST); carry aimed (DORY_AIM) [S] | b,c | approved
383 | crest bands each one solid swept strip, wide .42 (CORINTH_CREST, sweptBar) [S] (376288d) | a | approved
383 | aspis rim on flat unlit trim, three big tapered wave swirls (ASPIS_WAVE) [S] (0c3eee8) | b | approved (b PASS)
384 | dark brown greaves + rim, team foot in a brown sandal (HOPLITE_LEGS) [S] (d611ead) | a | approved (struck a.2)
## Rejected (last 4)
## Notes (max 3 lines)
- Aspis is shield type "aspis" on body.torso at ASPIS; rim SCUTUM_TRIM_FLAT unlit. _carryDory runs Idle/Walking/Attacking; probe output/loop/probe_hoplite.mjs.
- Legs: ancientDress dressHoplite (limbShell exported from medievalDress). Sandal code reusable for the shield bearer.
- Critic 383 minors: swirls fill about half the face (TABS sweep in from the rim); the crest side-on in _windup breaks into a fan of facets.
