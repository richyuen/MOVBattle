# farmer.harvester
Status: open   Audited: 339   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (1 since 339)
 2. braids in unit_farmer.harvester_idle stop at the chin, no bands — TABS: two long brown braids each side to the chest, team bands (ref: farmer.harvester.blue.png)
 3. tunic in unit_farmer.harvester_idle plain — TABS: beige collar, rope belt, light team patches (ref: farmer.harvester.red.png)
b PASS (344)
c FAIL (0 since 339)
 1. swing in unit_farmer.harvester_release/_flight vertical overhead — TABS: low horizontal sweep (ref: card Characteristics)
 2. target in unit_farmer.harvester_struck barely moved — TABS: sweep launches fragile units (ref: card, force 65)
d PASS (cost 500, hp 7.52x, dmg 1.25x, cd 1.80x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] c level sweep timed to the hit — blocker 1: the snath crosses his front level at shin height on the release tick , low recovery, man visibly airborne in _struck — ref: farmer.harvester.png — ours: unit_farmer.harvester_release.png
2. [S] a long braids to the chest with team bands — blocker 2: braid chunks lengthened to the chest, a team band near each end — ref: farmer.harvester.blue.png — ours: unit_farmer.harvester_idle.png
3. [S] a beige collar, rope belt, light team patches — blocker 3: tunic dress — ref: farmer.harvester.red.png — ours: unit_farmer.harvester_idle.png
## Attempts (iter | gap | criterion | verdict)
340 | soft floppy hat and side braids (FLOPPY, sun_hat rebuilt) [S] (e4fd698) | a | approved
342 | low two-handed scythe carry, pegs (SCYTHE_LOW) [S] (0c87e29) | b | approved
343 | pegs on the bow, snath and blade colours (SNATH_PEG.sink) [S] (0c7f22a) | b | approved
344 | plain snath, grip wraps disposed in addSnathPegs [S] (651d95a) | b | approved
345 | low level sweep + fling (SCYTHE_SWEEP, SCYTHE_FLING) [S] (8bd49db +c11f873) | c | rejected
## Rejected (last 4)
- low level sweep + fling [S] [1] — 345: hit lands before the cut (scythe overhead at release, low blade only after, behind him), fling not visible (knight crumpled, not airborne), recovery stands the scythe overhead
## Notes (max 3 lines)
- Scythe is weapon blade_slash (not heavy_swing); a sweep must branch in _animateBladeSlash and _blowLandFraction's blade path, and skip _aimBlow. Release shot = hit tick; side-on camera foreshortens a level snath.
- Scythe prop shared with spooky.reaper: harvester-only changes go in unitFactory addSnathPegs.
