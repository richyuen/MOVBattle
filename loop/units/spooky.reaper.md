# spooky.reaper
Status: open   Audited: 434   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (4 since 434)
  (struck 1 at 435, 2 at 440, 4 at 441)
 3. skull in unit_spooky.reaper_idle is grey — TABS: cream bone skull (ref: spooky.reaper.jpg)
b PASS (434)
c FAIL (1 since 434)
  (struck 1 at 436)
 2. missing: tendrils impaling and hanging a weak unit (ref: spooky.reaper.jpg, card Characteristics)
d PASS (cost 2500, hp 16.72x, dmg 3.33x, cd 1.24x; 441 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] c tendril impale - blocker 2: tendrils spear a weak unit and hold it hanging aloft - ref: spooky.reaper.jpg - ours: unit_spooky.reaper_ability (critic 441; STARVING at 442)
2. [S] a skull cream - blocker 3: the shared SKELETON_BONE fix on the head (see the archer's gap) - ref: spooky.reaper.jpg - ours: unit_spooky.reaper_swatch.png (critic 441)
## Attempts (iter | gap | criterion | verdict)
435 | REAPER_TENDRILS six dark tubes off the upper back (ae92e8fa) | a | approved (struck 1)
436 | REAPER_BURST violet ring + dark dome + shards at the scythe hit (30c492bd) | c | approved (struck 1)
439 | REAPER_LEGS cream bone legs + REAPER_HOVER lift, legs hanging (e97d690a) | a | approved (no strike: legs still stubs)
440 | REAPER_LEGS leg chain x1.6, thin .5, hip raised (b0c472fa) | a | approved (struck 2)
441 | REAPER_ROBE narrow straight coat to mid-thigh, torn hem, bell removed (0d48da55) | a | approved (struck 4)
## Rejected (last 4)
## Notes (max 3 lines)
- c impale design (checked 441): the capture's squire has 189 hp vs his 1939, so "weak = target max hp under ~.15 of his" fits with no evidence commit; applyBlastLaunch only throws (no hold): a held-aloft state is new code.
- Dress: unitFactory dressReaper + spookyDress reaperRobe, reaperTendrils, reaperLegs ("reaperHover" node marks the animator's REAPER_HOVER). Burst: visualEffects REAPER_BURST.
- Existing "fear" ability logs status:fear on his blow (the ability pair shows the burst too). 435: tendrils thin wisps (TABS thick tubes arching over the head).
