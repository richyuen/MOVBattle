# spooky.reaper
Status: open   Audited: 434   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (1 since 434)
  (struck 1 at 435)
 2. legs in unit_spooky.reaper_idle are short grey stumps on the ground under a wide robe — TABS: long thin cream bone legs dangling below the robe hem, hovering (ref: spooky.reaper.red.png, card Abilities Hover)
 3. skull in unit_spooky.reaper_idle is grey — TABS: cream bone skull (ref: spooky.reaper.jpg)
 4. robe in unit_spooky.reaper_idle is a wide squat bell — TABS: narrow tall tattered robe with ragged hem at the thigh (ref: spooky.reaper.red.png)
b PASS (434)
c FAIL (1 since 434)
  (struck 1 at 436)
 2. missing: tendrils impaling and hanging a weak unit (ref: spooky.reaper.jpg, card Characteristics)
d PASS (cost 2500, hp 16.72x, dmg 3.33x, cd 1.24x; 436 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] c tendril impale - blocker 2: on a hit on a low-HP target, drive the tendril tips onto it and hold it up off the ground as an effigy - ref: spooky.reaper.jpg - ours: unit_spooky.reaper_flight (critic 436)
2. [S] a hovering legs - blocker 2: long thin cream bone legs dangling below the hem, the unit hovering - ref: spooky.reaper.red.png - ours: unit_spooky.reaper_idle (critic 436)
## Attempts (iter | gap | criterion | verdict)
435 | REAPER_TENDRILS six dark tubes off the upper back (ae92e8fa) | a | approved (struck 1)
436 | REAPER_BURST violet ring + dark dome + shards at the scythe hit (30c492bd) | c | approved (struck 1)
## Rejected (last 4)
## Notes (max 3 lines)
- 435 critic: tendrils are thin wisps ~2 body widths long; TABS thick tubes spanning many widths, arching over the head (a top over the head re-frames every shot: RE-AUDIT).
- Dress: unitFactory dressReaper + spookyDress reaperTendrils. Burst: simulationSystem melee landing -> visualEffects spawnReaperBurst/REAPER_BURST.
- Existing "fear" ability logs status:fear on his blow (the ability pair shows the burst too).
