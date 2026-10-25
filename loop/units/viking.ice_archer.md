# viking.ice_archer
Status: open   Audited: 391, 395, 396, 397, 398, 399, 400, 401   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (0 since 396)
 2. shoulder mantle in _idle - TABS: a pale jagged fur/snow mantle over both shoulders (ref: .jpg); ours: a flat smooth blue disc ring at the neck
 3. fur calf cuffs in _flight - TABS: big cream fur cuffs over dark boots (ref: .red.png, .jpg); ours: slim blue boots, no fur
 4. front view in lineup_viking (also _idle) - TABS: the face, long nose and bead eyes read (ref: .red.png); ours: the archer shows its back and quiver, no face or cap front
  (struck 1 at 396: her own round cap with a fur brim and snow pom)
b PASS (393)
c PASS (401)
d PASS (cost 160, hp 0.62x, cd 1.50x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a front view - blocker 4 needs an evidence commit first: idle/lineup are a back view (quiver) - ours: unit_viking.ice_archer_idle.png
2. [S] a mantle - blocker 2: a pale jagged fur mantle over both shoulders, replacing the flat neck disc - ref: .jpg - ours: unit_viking.ice_archer_idle.png
3. [S] a cuffs - blocker 3: cream fur calf cuffs over dark boots - ref: .jpg - ours: unit_viking.ice_archer_flight.png
## Attempts (iter | gap | criterion | verdict)
395 | ice crust on the frozen target, 4 shards a part (9400138) | c | approved (struck c.2)
396 | her own round cap, pale fur brim, snow pom (d84c723) | a | approved (struck a.1)
397 | iceArrow dressing: pale shaft, ice spike + two barbs, 4 flakes (0fc57f6 + 636060c) | c | approved (c.1 narrowed)
398 | ice crown of 4 uneven shards + 3 swept barbs + 10 tetra flakes (42cf51c) | c | approved (c.1 stands)
399 | frost ribbon of 3 flat tetra shards swept along the shaft (2684991, reverted 084f002) | c | rejected
400 | icicles hanging under the shaft: 4 tapered spikes, raked back (92f8e5b) | c | approved (c.1 stands)
401 | the bead loop out, nine icicles as a comb (5509051) | c | approved (c PASS)
## Rejected (last 4)
- ice arrow [S] [1] - 399: three flat shards in the shaft's own line - the widest read as a fin; TABS's spray hangs UNDER the shaft
## Notes (max 3 lines)
- 401: ICE_ARROW icles 9, icleFrom .16, icleSpan .62, icleLong .21, icleWide .075, icleOut .55, icleRake .24; the .frost* fields are retired. The critic: the comb runs two thirds of the shaft (TABS bunches ~3 in the first third) and repeats a little.
- 400: the icicles hang under the shaft from .icleFrom behind the crown; the crown is 4 uneven shards + 3 barbs (42cf51c).
- 396: ICE_ARCHER_CAP (dome 1.26 W, brim .26 H, pom .62 W); the shared hood is off (hat "none").
