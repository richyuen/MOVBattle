# ancient.zeus
Status: open   Audited: 378   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (6 since 378)
 3. toga trim in unit_ancient.zeus_idle: drape bright white now, but the shoulder bolt a faint peach zig-zag; the gold rings only two small tan stacks under the drape's hem; the skirt pale grey-blue - TABS: bright orange-gold bolt, gold triple belt fully round the waist over the drape, white skirt (ref: .red.png)
b PASS (384)
c PASS (386)
d PASS (cost 2000, hp 14.04x, dmg 0.55x, cd 0.76x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a toga trim - blocker 3: gold rings outside the drape (a radius past its surface), the bolt a saturated unlit gold - ref: .red.png - ours: unit_ancient.zeus_idle.png
## Attempts (iter | gap | criterion | verdict)
379 | blond jaw mass + bolt strands, bolt locks, temple leaves (dressZeus) [S] (f708157) | a | approved
383-386 | thrown bolt, ZEUS_REARM, BOLT_SPARK, bare legs (ZEUS_SANDAL), chain (ZEUS_CHAIN) [S] | a,b,c | approved (c PASS)
385 | toga: bare trunk, white diagonal drape, gold bolt, triple gold belt (ZEUS_TOGA) [S] (3d11834) | a | approved
387 | beard: jaw + bib masses under 6x7 zig-zag slabs (ZEUS_BEARD) [S] (de591d4) | a | approved (struck a.1)
388 | toga fill to the belt under the diagonal, bigger unlit bolt, no cape special, unlit white, no solar fx (ZEUS_TOGA edgeHigh/edgeLow/foot) [S] (cdf9011 +f3b4ea5 +4780a33 +a91f576 +b098030) | a | approved (narrowed a.3)
389 | toga drape one-sided facing out (SSAO read the double faces), body torus belt hidden (ZEUS_TOGA) [S] (fdab7e5) | a | approved (narrowed a.3)
## Rejected (last 4)
## Notes (max 3 lines)
- Look comes from the iconic_zeus preset (unitVisuals getPresetVisual), not the "ancient.zeus" map entry. Toga ancientDress dressZeusToga + zeusLegs (unitFactory isZeus block).
- 389: the grey was the SSAO pass reading the double-sided ribbon's inward faces; dress meshes stay one-sided facing out. Body torus _belt hidden.
- Probes: output/loop/probe_mat.mjs (unit meshes + materials), probe_near.mjs (scene meshes and particle systems near the unit).
