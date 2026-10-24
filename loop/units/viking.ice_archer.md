# viking.ice_archer
Status: open   Audited: 391, 395, 396, 397, 398   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (0 since 396)
 2. shoulder mantle in _idle - TABS: a pale jagged fur/snow mantle over both shoulders (ref: .jpg); ours: a flat smooth blue disc ring at the neck
 3. fur calf cuffs in _flight - TABS: big cream fur cuffs over dark boots (ref: .red.png, .jpg); ours: slim blue boots, no fur
 4. front view in lineup_viking (also _idle) - TABS: the face, long nose and bead eyes read (ref: .red.png); ours: the archer shows its back and quiver, no face or cap front
 (struck 1 at 396: her own round cap with a fur brim and snow pom)
b PASS (393)
c FAIL (3 since 391)
 1. ice arrow in _release - TABS: a long pale-blue arrow with an irregular jagged ice head and a frost spray behind it (ref: .jpg); ours: the head is a crown of irregular shards now, but the frost behind it is still .frost flakes strung along the shaft like beads, not a spray (398)
 (struck 2 at 395: the freeze now leaves an ice crust on the target)
d PASS (cost 160, hp 0.62x, cd 1.50x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] c ice arrow - blocker 1: a ribbon of three pale tetra shards trailing the crown in place of the bead line - ref: .jpg - ours: unit_viking.ice_archer_ability.png
2. [S] a shoulder mantle - blocker 2: a pale jagged fur mantle over both shoulders, replacing the flat neck disc - ref: .jpg - ours: unit_viking.ice_archer_idle.png
3. [S] a cuffs - blocker 3: cream fur calf cuffs over dark boots - ref: .jpg - ours: unit_viking.ice_archer_flight.png
4. [S] a front view - blocker 4 first an evidence commit: the idle and lineup are a back view (quiver), so the cap and face cannot be judged - ours: unit_viking.ice_archer_idle.png
## Attempts (iter | gap | criterion | verdict)
392 | Ice Bow: pale-ice limbs, jagged tips, snowball nock (dd3caf1) | b | approved (b.1 stood)
393 | icicle fringe down both limbs, bigger tip crowns (1e0549d) | b | approved (b PASS)
395 | ice crust on the frozen target, 4 shards a part (9400138) | c | approved (struck c.2)
396 | her own round cap, pale fur brim, snow pom (d84c723) | a | approved (struck a.1)
397 | iceArrow dressing: pale shaft, ice spike + two barbs, 4 frost flakes (0fc57f6 + 636060c) | c | approved (c.1 narrowed)
398 | ice crown of 4 uneven shards + 3 swept barbs + 10 tetra flakes (42cf51c) | c | approved (c.1 stands: the trail still beads)
## Rejected (last 4)
- (none in the last 5 iterations)
## Notes (max 3 lines)
- 398: ProjectileSystem ICE_ARROW { head .34, wide .2, spikes 4, spike .66, spikeOut .42, barbs 3, barb .5, frost 10, frostSize .05, frostLong .52, frostOpen 2.4, frostShrink .6 }; each shard aimed by Quaternion.FromUnitVectors.
- The frost flakes are separate ico-spheres at subdiv 0, which the critic reads as beads: a trailing ribbon is the next pick.
- 396: vikingDress ICE_ARCHER_CAP (dome 1.26 W, brim torus .26 H, pom .62 W); the shared hood is off in unitVisuals (hat "none").
