# ancient.zeus
Status: open   Audited: 378   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (6 since 378) [plateau; 1 rejected [R] since 391]
 3. toga trim in unit_ancient.zeus_idle: drape bright white now, but the shoulder bolt a faint peach zig-zag; the gold rings only two small tan stacks under the drape's hem; the skirt pale grey-blue - TABS: bright orange-gold bolt, gold triple belt fully round the waist over the drape, white skirt (ref: .red.png)
b PASS (384)
c PASS (386)
d PASS (cost 2000, hp 14.04x, dmg 0.55x, cd 0.76x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [R] a toga trim - blocker 3: rebuild the bolt emblem as a large deep-orange flat zig-zag on the drape's front clear of the beard (about .7 tr up, .5 of halfX, .6 tr tall, (1,.5,.1)), keeping the 391 waist belt and white skirt and warming the belt toward (.95,.55,.2) - ref: .red.png - ours: unit_ancient.zeus_idle.png
## Attempts (iter | gap | criterion | verdict)
379 | blond jaw mass + bolt strands, bolt locks, temple leaves (dressZeus) [S] (f708157) | a | approved
383-386 | thrown bolt, ZEUS_REARM, BOLT_SPARK, bare legs (ZEUS_SANDAL), chain (ZEUS_CHAIN) [S] | a,b,c | approved (c PASS)
385 | toga: bare trunk, white diagonal drape, gold bolt, triple gold belt (ZEUS_TOGA) [S] (3d11834) | a | approved
387 | beard: jaw + bib masses under 6x7 flat zig-zag slabs (ZEUS_BEARD) [S] (de591d4) | a | approved (struck a.1)
388 | toga fill to the belt under the diagonal, bigger unlit bolt, no cape special, unlit white, no solar fx (ZEUS_TOGA) [S] (cdf9011 +4 follow-ups) | a | approved (narrowed a.3)
389 | toga drape one-sided facing out (SSAO read the double faces), body torus belt hidden (ZEUS_TOGA) [S] (fdab7e5) | a | approved (narrowed a.3)
391 | [R] toga trim: three gold waist bands, a flat seven-point unlit gold bolt, unlit white skirt (e30be40, reverted 86c09ff) | a | rejected
## Rejected (last 4)
- toga trim [R] [1] - 391: three waist bands + flat gold bolt + white skirt - the bolt still a pale sliver half under the beard, the bands khaki; an [R] must clear the whole blocker
## Notes (max 3 lines)
- 391 critic's spec for the retry: bolt lower (.7 tr up, .5 halfX), .6 tr tall, deeper orange (1,.5,.1); keep the 391 waist belt (warmer .95,.55,.2) and white skirt.
- The 391 [R] moved the belt over the hem and whitened the skirt; the revert restored the 389 code, so those must be rebuilt with the bolt.
- Look comes from the iconic_zeus preset; toga ancientDress dressZeusToga + zeusLegs. Probes: probe_mat.mjs, probe_near.mjs.
