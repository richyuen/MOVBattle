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
1. [S] c low horizontal side-to-side sweep that launches the target, in place of the vertical overhead chop — blockers 1-2 — ref: card Characteristics, farmer.harvester.png — ours: unit_farmer.harvester_release.png
2. [S] a long braids to the chest with team bands — blocker 2 (propBuilder sun_hat braids) — ref: farmer.harvester.blue.png — ours: unit_farmer.harvester_idle.png
3. [S] a beige collar, rope belt, light team patches — blocker 3: tunic dress — ref: farmer.harvester.red.png — ours: unit_farmer.harvester_idle.png
## Attempts (iter | gap | criterion | verdict)
340 | soft floppy hat and side braids (FLOPPY, sun_hat rebuilt) [S] (e4fd698) | a | approved
342 | low diagonal two-handed scythe carry, snath pegs (SCYTHE_LOW, SNATH_PEG) [S] (0c87e29) | b | approved
342 | chunkier braids FLOPPY thick/braid/apart [P] (7017d25) | a | approved
343 | pegs rooted on the bow, red-brown snath, grey blade (SNATH_PEG.sink, SNATH_STEEL) [S] (0c7f22a) | b | approved
344 | plain snath, grip wraps disposed in addSnathPegs [S] (651d95a) | b | approved
## Rejected (last 4)
## Notes (max 3 lines)
- Scythe prop is shared with spooky.reaper: harvester-only changes go in unitFactory addSnathPegs (materials, pegs); snath bows z = bow*(1-4t^2).
- 344 critic: idle scythe stands near upright, blade by his feet (TABS carried level across the front, blade out to the far side); b closed.
- 340 critic: brim (2.25 heads) renders pale tan; TABS narrower, mid-brown.
