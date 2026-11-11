# secret.ballooner
Status: open   Audited: 500 (AUDIT x2), 515 (CONFIRM: passed b, c, d; failed a)   Done: -
## Verdicts
a FAIL (0 since 515 CONFIRM)
 1. team pantaloons reaching nearly to the shoes, with the tan stockings showing only as a thin strip above the orange shoes in unit_secret.ballooner_idle — TABS: puffy pantaloons end at the knee, and tan stockings run from the knee to the ankle (about the lower fifth of the figure) (ref: reference/units/secret.ballooner.red.png, .blue.png)
b PASS (515 CONFIRM: cream glue club on each hand)
c PASS (515 CONFIRM: dive, glued pair lifted under the balloons)
d PASS (515 stats)
## Ranked gaps
1. [P] secret.ballooner.a hem — blocker 1: secretDress BALLOONER_LEG.hem -0.07 -> +0.03 (critic 515 fallout of b8a58d45), the stocking runs down the shin — ref: reference/units/secret.ballooner.blue.png — ours: unit_secret.ballooner_idle.png
2. [S] secret.ballooner.a legs — blocker 1: two separate pantaloon legs ending at the knee (narrower lathe, a gap between the legs), stocking the length of the shin — ref: reference/units/secret.ballooner.blue.png — ours: unit_secret.ballooner_idle.png
## Attempts (iter | gap | criterion | verdict)
515 | team knee pantaloons, tan stockings, orange shoes, secretDress balloonerBreeches; no tunic skirt (b8a58d45, d8a671fe) | a | approved (struck 6; CONFIRM failed a: pantaloons too long)
514 | grey ruff of 16 flutes, secretDress balloonerRuff (c478e0f8) | a | approved (struck 4, 3 by lineup)
514 | brown hair falls and goggle rims, secretDress balloonerHead (baed6b00) | a | approved (struck 5)
514 | glued chest to chest at the grab, both held upright through the lift (99a107b4) | c | approved (struck 2; c PASS)
511 | team doublet, cream V, slashed puffs, belt (f7143acb) | a | approved
511 | glued dive (026039a3, reverted e2a612c1) | c | dropped
501-506 | satchel and balloons; glue mitts; one-use backpack lift | a, b, c | approved
## Rejected (last 4)
## Notes (max 3 lines)
- 515 swatch: shoe (1,.42,.12) unlit displayed tan in the grass; (1,.2,.05) reads orange.
- 515 DEFECTS: the two pantaloon legs read as one wide block.
