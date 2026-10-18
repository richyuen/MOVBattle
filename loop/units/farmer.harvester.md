# farmer.harvester
Status: open   Audited: 339   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (1 since 339)
 2. braids in unit_farmer.harvester_idle stop at the chin, no bands — TABS: two long brown braids each side to the chest, team bands (ref: farmer.harvester.blue.png)
 3. tunic in unit_farmer.harvester_idle plain — TABS: beige collar, rope belt, light team patches (ref: farmer.harvester.red.png)
b FAIL (2 since 339)
 4. grip wraps in unit_farmer.harvester_idle hang as loose red-brown hoops beside the snath, off its bowed line — TABS: no rings, only the two pegs rooted in a plain snath (ref: farmer.harvester.red.png)
c FAIL (0 since 339)
 1. swing in unit_farmer.harvester_release/_flight vertical overhead — TABS: low horizontal sweep (ref: card Characteristics)
 2. target in unit_farmer.harvester_struck barely moved — TABS: sweep launches fragile units (ref: card, force 65)
d PASS (cost 500, hp 7.52x, dmg 1.25x, cd 1.80x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] b grip wraps — blocker 4: drop the harvester's gripWrap hoops (or root them on the bow line) in addSnathPegs — ref: farmer.harvester.red.png — ours: unit_farmer.harvester_idle.png
2. [S] c low horizontal two-handed sweep that launches the target — blockers 1-2 — ref: card Characteristics — ours: unit_farmer.harvester_release.png
3. [S] a beige collar, rope belt, light team patches — blocker 3: tunic dress — ref: farmer.harvester.red.png — ours: unit_farmer.harvester_idle.png
4. [S] a team band near each braid tip, braids to chest length — blocker 2 (propBuilder sun_hat braids) — ref: farmer.harvester.blue.png — ours: unit_farmer.harvester_idle.png
## Attempts (iter | gap | criterion | verdict)
340 | soft floppy hat and side braids (FLOPPY, sun_hat rebuilt) [S] (e4fd698) | a | approved
342 | low diagonal two-handed scythe carry, snath pegs (SCYTHE_LOW, SNATH_PEG) [S] (0c87e29) | b | approved
342 | chunkier braids FLOPPY thick/braid/apart [P] (7017d25) | a | approved
343 | pegs rooted on the bow, red-brown snath, grey blade (SNATH_PEG.sink, SNATH_STEEL) [S] (0c7f22a) | b | approved
## Rejected (last 4)
## Notes (max 3 lines)
- Scythe prop is shared with spooky.reaper: harvester-only changes go in unitFactory addSnathPegs (materials, pegs); snath bows z = bow*(1-4t^2).
- 340 critic: brim (2.25 heads) renders pale tan; TABS narrower, mid-brown.
