# ancient.zeus
Status: open   Audited: 378, 398, 399   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (7 since 378; 1 rejected [S] since 378)
 3. toga trim in unit_ancient.zeus_idle: the skirt is white, the belt gold across the waist and the bolt a bold zig-zag now, but the bolt reads red-pink rather than orange-gold and its top touches the beard's foot - TABS: bright orange-gold bolt, gold triple belt fully round the waist over the drape, white skirt, the bolt clear of the beard (ref: .red.png)
  (struck 1 at 387: the beard; struck 2 at 385: the toga)
b PASS (384)
c PASS (386)
d PASS (cost 2000, hp 14.04x, dmg 0.55x, cd 0.76x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a toga trim - blocker 3: a thick saturated orange-gold emblem at the belt's .85 self-light, held on the open shoulder line clear of the beard's foot AND of the raised hand's bolt bloom - ref: ancient.zeus.red.png - ours: unit_ancient.zeus_idle.png
## Attempts (iter | gap | criterion | verdict)
379 | blond jaw mass + bolt strands, bolt locks, temple leaves (dressZeus) [S] (f708157) | a | approved
383-386 | thrown bolt, ZEUS_REARM, BOLT_SPARK, bare legs (ZEUS_SANDAL), chain (ZEUS_CHAIN) [S] | a,b,c | approved (c PASS)
385 | toga: bare trunk, white diagonal drape, gold bolt, triple gold belt (ZEUS_TOGA) [S] (3d11834) | a | approved
387 | beard: jaw + bib masses under 6x7 flat zig-zag slabs (ZEUS_BEARD) [S] (de591d4) | a | approved (struck a.1)
388 | toga fill to the belt under the diagonal, bigger unlit bolt, no cape special, unlit white (cdf9011 + 4 follow-ups) | a | approved (narrowed a.3)
389 | toga drape one-sided facing out (SSAO read the double faces), body torus belt hidden (fdab7e5) | a | approved (narrowed a.3)
391 | [R] three gold waist bands, a flat seven-point unlit gold bolt, unlit white skirt (e30be40, reverted 86c09ff) | a | rejected
398 | [R] toga trim rebuilt: beard foot to the collarbone, four-link bolt, three thick gold rings, unlit white skirt (4778c43) | a | approved (a.3 stands)
399 | [S] orange-gold (1,.55,.1) at .55, boltTop .72, links 7.5 cm proud (feff7d2 + 860ea63, reverted aa36ed2/9849d90) | a | rejected
## Rejected (last 4)
- toga trim [R] [1] - 391: three waist bands + flat gold bolt + white skirt - the bolt still a pale sliver half under the beard, the bands khaki; an [R] must clear the whole blocker
- toga trim [S] [1] - 399: orange-gold + top .1 lower + 7.5 cm stand-off - at .55 self-light the emblem still reads dusty pink-grey beside the belt's .85 gold, and the hand's bloom veils its lower half
## Notes (max 3 lines)
- 399 critic: the belt's .85 gold survives where the emblem's .55 self-light washes pink under ACES; the hand's bloom veils its lower half; TABS holds the bolt high on the shoulder.
- 398: ZEUS_BEARD foot -1.95 (the beard ends at the collarbone); ZEUS_TOGA bolt .11 over 4 links from .9 down, "cloth" self-lit .55 of (.95,.22,.03); the skirt is zeusSkirt, unlit white.
- Look from the iconic_zeus preset; toga ancientDress dressZeusToga + zeusLegs. Probes: probe_close.mjs, probe_mat.mjs.
