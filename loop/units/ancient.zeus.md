# ancient.zeus
Status: open   Audited: 378, 398, 399, 400   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (9 since 378; 1 rejected [S] since 378; blocker 3 split at 405)
 3. toga trim in unit_ancient.zeus_idle: the skirt is white, the belt gold across the waist and the bolt a bold zig-zag now, but its top touches the beard's foot - TABS: bright orange-gold bolt, gold triple belt fully round the waist over the drape, white skirt, the bolt clear of the beard (ref: .red.png)
  (struck 1 at 387: the beard; struck 2 at 385: the toga; 3's "reads red-pink rather than orange-gold" clause struck at 405)
b PASS (384)
c PASS (386)
d PASS (cost 2000, hp 14.04x, dmg 0.55x, cd 0.76x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a toga trim - blocker 3: seat the bolt emblem off the beard mesh's measured foot (bbox, as eyeTopInHead seats caps) a fixed gap below it, instead of the fixed ZEUS_TOGA.boltTop (dressZeusToga) - ref: .red.png - ours: unit_ancient.zeus_idle.png
## Attempts (iter | gap | criterion | verdict)
379-389 | beard + locks (379); thrown bolt, REARM, SPARK, sandals, chain (c PASS 386); toga (385); ZEUS_BEARD (struck a.1, 387); toga fill, one-sided drape (388-389) [S] | a,b,c | approved
391 | [R] three gold waist bands, a flat seven-point unlit gold bolt, unlit white skirt (e30be40, reverted 86c09ff) | a | rejected
398 | [R] toga trim rebuilt: beard foot to the collarbone, four-link bolt, three thick gold rings, unlit white skirt (4778c43) | a | approved (a.3 stands)
399 | [S] orange-gold (1,.55,.1) at .55, boltTop .72, links 7.5 cm proud (feff7d2 + 860ea63, reverted aa36ed2/9849d90) | a | rejected
400 | [S] emblem high on the shoulder, .boltStand .075, unlit gold (0.62,0.26,0.03) emissive = colour (6169685 + 9f043da) | a | approved (blocker 3 stands: still pink-grey in the idle)
405 | [S] emblem links in render group 1, drawn after the glow merge (main.ts glowLayer.renderingGroupId 0) (7738aea) | a | approved (colour clause struck)
## Rejected (last 4)
- toga trim [R] [1] - 391: three waist bands, a flat gold bolt, a white skirt - the bolt a pale sliver under the beard, the bands khaki
- toga trim [S] [1] - 399: orange-gold + top .1 lower + 7.5 cm stand-off - at .55 self-light the emblem still reads dusty pink-grey beside the belt's .85 gold, and the hand's bloom veils its lower half
## Notes (max 3 lines)
- 405: the pink was the raised hand-bolt's blue-white bloom over the orange (orange with --noglow). runtimeUnit.ts:1053 resets a flung body's meshes to group 0 on landing, so a flung Zeus loses it: keep a mesh's own group (fix next).
- 398: ZEUS_BEARD foot -1.95; ZEUS_TOGA 4 links from .98 down .30 (.boltX .66/.boltOut .98), gold ring belt at .06.
- Look from the iconic_zeus preset; toga ancientDress dressZeusToga + zeusLegs. Probes: probe_close.mjs (--aim=y:1.15 --dist=3.2 --yaw=0.5 frames the emblem).
