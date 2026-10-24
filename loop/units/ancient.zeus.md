# ancient.zeus
Status: open   Audited: 378, 398   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (7 since 378)
 3. toga trim in unit_ancient.zeus_idle: the skirt is white, the belt gold across the waist and the bolt a bold zig-zag now, but the bolt reads red-pink rather than orange-gold and its top touches the beard's foot - TABS: bright orange-gold bolt, gold triple belt fully round the waist over the drape, white skirt, the bolt clear of the beard (ref: .red.png)
 (struck 1 at 387: the beard; struck 2 at 385: the toga)
b PASS (384)
c PASS (386)
d PASS (cost 2000, hp 14.04x, dmg 0.55x, cd 0.76x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [R] a toga trim - blocker 3: the bolt to a true orange-gold (lift the .55 self-light or the hue) and its top dropped .1 to clear the beard's foot - ref: ancient.zeus.red.png - ours: unit_ancient.zeus_idle.png
## Attempts (iter | gap | criterion | verdict)
379 | blond jaw mass + bolt strands, bolt locks, temple leaves (dressZeus) [S] (f708157) | a | approved
383-386 | thrown bolt, ZEUS_REARM, BOLT_SPARK, bare legs (ZEUS_SANDAL), chain (ZEUS_CHAIN) [S] | a,b,c | approved (c PASS)
385 | toga: bare trunk, white diagonal drape, gold bolt, triple gold belt (ZEUS_TOGA) [S] (3d11834) | a | approved
387 | beard: jaw + bib masses under 6x7 flat zig-zag slabs (ZEUS_BEARD) [S] (de591d4) | a | approved (struck a.1)
388 | toga fill to the belt under the diagonal, bigger unlit bolt, no cape special, unlit white, no solar fx (ZEUS_TOGA) [S] (cdf9011 +4 follow-ups) | a | approved (narrowed a.3)
389 | toga drape one-sided facing out (SSAO read the double faces), body torus belt hidden (ZEUS_TOGA) [S] (fdab7e5) | a | approved (narrowed a.3)
391 | [R] toga trim: three gold waist bands, a flat seven-point unlit gold bolt, unlit white skirt (e30be40, reverted 86c09ff) | a | rejected
398 | [R] toga trim rebuilt: beard foot to the collarbone, four-link bolt on the drape's surface in deep orange-red, three thick gold rings, unlit white skirt (4778c43) | a | approved (a.3 stands: bolt hue and its top under the beard)
## Rejected (last 4)
- toga trim [R] [1] - 391: three waist bands + flat gold bolt + white skirt - the bolt still a pale sliver half under the beard, the bands khaki; an [R] must clear the whole blocker
## Notes (max 3 lines)
- 398: ZEUS_BEARD foot -1.95 (the beard ends at the collarbone), ZEUS_TOGA bolt .11 wide over 4 links from .9 of the trunk down, laid on the drape's own rounded-box surface; a lit "cloth" self-lit .55 of (0.95, .22, .03) - an unlit emissive washed pale under ACES and the bolt-bloom veils small light props.
- 398 critic's retry: an orange-gold hue and the bolt's top .1 lower, clear of the beard.
- Look comes from the iconic_zeus preset; toga ancientDress dressZeusToga + zeusLegs; the skirt is unitFactory's zeusSkirt. Probes: probe_close.mjs, probe_mat.mjs.
