# spooky.reaper
Status: open   Audited: 434   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a PASS (442: cream skull in the hood, cream bone legs; shared SKELETON_BONE unlit)
b PASS (434)
c FAIL (2 since 434)
  (struck 1 at 436, 2 at 442; 3 added 442)
 3. the impaled man in unit_spooky.reaper_ability_after hangs at chest height in front of the Reaper, against his sleeve — TABS: the man hangs high beside the Reaper's shoulder, head above the hood, on a black tendril (ref: spooky.reaper.jpg)
d PASS (cost 2500, hp 16.72x, dmg 3.33x, cd 1.24x; 442 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] c impaled man hangs low in front - blocker 3: _hangImpaled hangs him beside the off shoulder, feet at about his head height (up ~.85, side ~.45); the spear rooted on a REAPER_TENDRILS root, arcing up to him, thicker (~.22) so it reads apart from the sleeve - ref: spooky.reaper.jpg - ours: unit_spooky.reaper_ability_after (critic 442)
## Attempts (iter | gap | criterion | verdict)
435-441 | REAPER_TENDRILS, REAPER_LEGS x2, REAPER_ROBE | a | approved (struck 1, 2, 4)
436 | REAPER_BURST violet ring + dark dome + shards at the scythe hit (30c492bd) | c | approved (struck 1)
442 | SKELETON_BONE flat unlit cream, out of the glow (21f0bc9a) | a | approved (struck 3; a PASS)
442 | REAPER_IMPALE weak man speared on a tendril and hung, stabbed every .6 s (c350e411, 56eae583) | c | approved (struck 2; added 3)
## Rejected (last 4)
## Notes (max 3 lines)
- Impale: simulationSystem REAPER_IMPALE (_tryImpale, _hangImpaled, _holdImpales), runtimeUnit hangAt/dropFromHang, spookyDress reaperSpear; capture ABILITY_PREF "impale" (evidence 442). Probe loop/scripts/probes/probe_impale.mjs prints both men's positions over time.
- 442 probe: head top ~3.4-3.9 m (metrics.overallHeight 2.7, pre-hover); the hang is fixed off his yaw and head height at the stab (he turns to face the man, who orbited him before). Critic minor: an impaling blow skips REAPER_BURST.
- Dress: unitFactory dressReaper + spookyDress reaperRobe, reaperTendrils, reaperLegs. Burst: visualEffects REAPER_BURST.
