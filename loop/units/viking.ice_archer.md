# viking.ice_archer
Status: open   Audited: 391, 395, 396   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (0 since 396)
 2. shoulder mantle in _idle - TABS: a pale jagged fur/snow mantle over both shoulders (ref: .jpg); ours: a flat smooth blue disc ring at the neck
 3. fur calf cuffs in _flight - TABS: big cream fur cuffs over dark boots (ref: .red.png, .jpg); ours: slim blue boots, no fur
 4. front view in lineup_viking (also _idle) - TABS: the face, long nose and bead eyes read (ref: .red.png); ours: the archer shows its back and quiver, no face or cap front
  (struck 1 at 396: her own round cap with a fur brim and snow pom)
b PASS (393)
c FAIL (1 since 391)
 1. ice arrow in _release - TABS: a long pale-blue arrow with a jagged ice head and frost trail (ref: .jpg); ours: a dark-brown shaft with a small blue cone head
  (struck 2 at 395: the freeze now leaves an ice crust on the target)
d PASS (cost 160, hp 0.62x, cd 1.50x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] c ice arrow - blocker 1: a long pale shaft, jagged ice head, frost trail, leaving the bow - ref: .jpg - ours: unit_viking.ice_archer_release.png
2. [S] a shoulder mantle - blocker 2: a pale jagged fur mantle over both shoulders, replacing the flat neck disc - ref: .jpg - ours: unit_viking.ice_archer_idle.png
3. [S] a cuffs - blocker 3: cream fur calf cuffs over dark boots - ref: .jpg - ours: unit_viking.ice_archer_flight.png
4. [S] a front view - blocker 4 first an evidence commit: the idle and lineup are a back view (quiver), so the cap and face cannot be judged - ours: unit_viking.ice_archer_idle.png
## Attempts (iter | gap | criterion | verdict)
392 | Ice Bow: pale-ice limbs, jagged tips, snowball nock (dd3caf1) | b | approved (b.1 stood)
393 | icicle fringe down both limbs, bigger tip crowns (1e0549d) | b | approved (b PASS)
395 | ice crust on the frozen target, 4 shards a part (9400138) | c | approved (struck c.2)
396 | her own round cap, pale fur brim, snow pom (d84c723) | a | approved (struck a.1)
## Rejected (last 4)
## Notes (max 3 lines)
- 396: vikingDress ICE_ARCHER_CAP (dome 1.26 W, brim torus .26 H, pom .62 W); the shared hood is off in unitVisuals (hat "none"), so the crown is the cap at every angle.
- 395: the freeze status is applied at the FIRE tick (status:freeze at 383 ms) and the crust stays statusDuration.
- 393 critic: the shards stick out sideways from both faces like thorns; TABS thin icicles hang off the limb's belly (not a lineup blocker).
