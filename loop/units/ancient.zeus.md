# ancient.zeus
Status: open   Audited: 378   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (5 since 378)
 3. toga in unit_ancient.zeus_idle: the filled drape reads mid-grey with a dark smoky band across the belly over the belt; the shoulder bolt a faint tan zig-zag; the triple belt grey — TABS: bright white cloth, a bright orange-gold bolt, a gold belt (ref: .red.png)
b PASS (384)
c PASS (386)
d PASS (cost 2000, hp 14.04x, dmg 0.55x, cd 0.76x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a toga colour — blocker 3: find the layer greying the chest (storm_halo attachment, secret_holy material shell, or a screen-space pass) and drop it or exclude the toga — ref: .red.png — ours: unit_ancient.zeus_idle.png
## Attempts (iter | gap | criterion | verdict)
379 | blond jaw mass + bolt strands, bolt locks, temple leaves (dressZeus) [S] (f708157) | a | approved
383-386 | thrown bolt, ZEUS_REARM, BOLT_SPARK, bare legs (ZEUS_SANDAL), chain (ZEUS_CHAIN) [S] | a,b,c | approved (c PASS)
385 | toga: bare trunk, white diagonal drape, gold bolt, triple gold belt (ZEUS_TOGA) [S] (3d11834) | a | approved
387 | beard: jaw + bib masses under 6x7 zig-zag slabs (ZEUS_BEARD) [S] (de591d4) | a | approved (struck a.1)
388 | toga fill to the belt under the diagonal, bigger unlit bolt, no cape special, unlit white, no solar fx (ZEUS_TOGA edgeHigh/edgeLow/foot) [S] (cdf9011 +f3b4ea5 +4780a33 +a91f576 +b098030) | a | approved (narrowed a.3)
## Rejected (last 4)
## Notes (max 3 lines)
- Look comes from the iconic_zeus preset (unitVisuals getPresetVisual), not the "ancient.zeus" map entry. Toga ancientDress dressZeusToga + zeusLegs (unitFactory isZeus block).
- 388: the toga's material is unlit white (emissive 1) and the solar fx is gone, yet it still renders grey with a dark gradient under the beard: the cause is not lighting. Suspects: storm_halo / secret_holy shell (probe stormHalo vis=false), a post-process (SSAO), or the body's _yoke mesh (team, torso-sized) over it.
- Probes: output/loop/probe_mat.mjs (unit meshes + materials), probe_near.mjs (scene meshes and particle systems near the unit).
