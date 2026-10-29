# viking.ice_archer
Status: open   Audited: 391, 395-402   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (1 since 396; struck 2 at 402)
 3. fur calf cuffs in _flight - TABS: big cream fur cuffs over dark boots (ref: .red.png, .jpg); ours: slim blue boots, no fur
 4. front view in unit_viking.ice_archer_idle - TABS: the face, long nose and bead eyes read (ref: .red.png); ours: the archer shows its back and quiver, no face or cap front
  (struck 1 at 396: her own round cap with a fur brim and snow pom; struck 2 at 402: the pale jagged snow mantle)
b PASS (393)
c PASS (401)
d PASS (cost 160, hp 0.62x, cd 1.50x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a cuffs - blocker 3: cream fur rolls (the Headbutter's HEADBUTTER_CREAM cut) over dark boot shells on both shins (vikingDress iceArcherLegs, new) - ref: .red.png - ours: unit_viking.ice_archer_flight.png
2. [S] a front view - blocker 4: bead eyes and a nose on the side of the head the re-aimed idle sees, or the idle re-aimed on the eye meshes themselves (evidence commit) - ref: .red.png - ours: unit_viking.ice_archer_idle.png
## Attempts (iter | gap | criterion | verdict)
395 | ice crust on the frozen target, 4 shards a part (9400138) | c | approved (struck c.2)
396 | her own round cap, pale fur brim, snow pom (d84c723) | a | approved (struck a.1)
397-398 | iceArrow dressing: pale shaft, ice spike + barbs, flakes; ice crown of 4 shards + 3 barbs + 10 flakes [S] | c | approved
399 | frost ribbon of 3 flat tetra shards swept along the shaft (2684991, reverted 084f002) | c | rejected
400 | icicles hanging under the shaft: 4 tapered spikes, raked back (92f8e5b) | c | approved (c.1 stands)
401 | the bead loop out, nine icicles as a comb (5509051) | c | approved (c PASS)
402 | ICE_ARCHER_MANTLE: pale grey ring, 10 points over the shoulders, 8 snow clumps (911eda0) | a | approved (struck 2)
## Rejected (last 4)
- ice arrow [S] [1] - 399: three flat shards in the shaft's own line - the widest read as a fin; TABS's spray hangs UNDER the shaft
## Notes (max 3 lines)
- 402 evidence (5f3f1b8 + f8ff48e): her idle camera sits on the head block's own world facing (alpha = atan2(fz, fx) - swing); blocker 4's shot is now _idle. The critic still sees a blank blue head under the brim: the eyes are not on the side the camera sees - re-aim on the eye meshes (eye midpoint minus head centre) next, as an evidence commit.
- 402: ICE_ARCHER_MANTLE ring .8 of the shoulder width, 10 points .32 H (+.5 over the shoulders) leaning .6 rad, 8 lumps; unlit (.74,.76,.8) out of the glow.
- 401: ICE_ARROW icles 9, icleFrom .16, icleSpan .62; 396: ICE_ARCHER_CAP (dome 1.26 W, brim .26 H, pom .62 W); the shared hood is off.
