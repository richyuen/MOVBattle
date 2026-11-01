# spooky.reaper
Status: done   Audited: 434, 443 (CONFIRM: passed a, b; failed c), 444 (CONFIRM: passed a, b, c)   Done: 444
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a PASS (442: cream skull in the hood, cream bone legs; shared SKELETON_BONE unlit; CONFIRM 443)
b PASS (434; CONFIRM 443)
c PASS (444: impale hangs a weak man on a tendril; every scythe blow, the impaling one too, bursts the violet ring + dark dome; CONFIRM 444)
d PASS (cost 2500, hp 16.72x, dmg 3.33x, cd 1.24x; 444 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
## Attempts (iter | gap | criterion | verdict)
435-441 | REAPER_TENDRILS, REAPER_LEGS x2, REAPER_ROBE | a | approved (struck 1, 2, 4)
436 | REAPER_BURST violet ring + dark dome + shards at the scythe hit (30c492bd) | c | approved (struck 1)
442 | SKELETON_BONE flat unlit cream, out of the glow (21f0bc9a) | a | approved (struck 3; a PASS)
442 | REAPER_IMPALE weak man speared on a tendril and hung, stabbed every .6 s (c350e411, 56eae583) | c | approved (struck 2; added 3)
443 | REAPER_IMPALE hung high beside the off shoulder (up .8, side .45), the held man not targeted, REAPER_SPEAR .22 (b111a980) | c | approved (struck 3; CONFIRM failed c: no burst in the pair)
444 | REAPER_BURST on the impaling blow too (49fad4e0) | c | approved (struck 1; c PASS; CONFIRM 444)
## Rejected (last 4)
## Notes (max 3 lines)
- Impale: simulationSystem REAPER_IMPALE (_tryImpale, _hangImpaled, _holdImpales), runtimeUnit hangAt/dropFromHang, spookyDress reaperSpear; capture ABILITY_PREF "impale" (evidence 442). Probe loop/scripts/probes/probe_impale.mjs prints both men's positions over time.
- 442 probe: head top ~3.4-3.9 m (metrics.overallHeight 2.7, pre-hover); the hang is fixed off his yaw and head height at the stab (he turns to face the man, who orbited him before). Critic minor: an impaling blow skips REAPER_BURST.
- Dress: unitFactory dressReaper + spookyDress reaperRobe, reaperTendrils, reaperLegs. Burst: visualEffects REAPER_BURST.
