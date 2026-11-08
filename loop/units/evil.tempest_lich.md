# evil.tempest_lich
Status: open   Audited: 489 (AUDIT x2)   Done: -
## Verdicts
a FAIL (0 since 489)
 1. scale in lineup_evil: rig 2.58 m (s 1.44), standing above the cultist and Shadow Walker — TABS: size 1.00x, a normal man's height (card Infobox; reference/factions/evil.jpg)
 2. head in unit_evil.tempest_lich_idle: a blue head with bead eyes under a dark box crown sprouting brown twigs — TABS: headless; tall black tendrils rise from the neck in place of a head (ref: evil.tempest_lich.red.png)
 3. collar in unit_evil.tempest_lich_idle: none — TABS: a jagged ochre-brown collar at the base of the tendrils (ref: evil.tempest_lich.blue.png)
 4. lower body in unit_evil.tempest_lich_idle: a wide purple bell skirt down to the ground — TABS: a team tunic over thin dark legs, with long black tattered strips trailing (ref: evil.tempest_lich.red.png)
b FAIL (0 since 489)
 1. staff head in unit_evil.tempest_lich_idle: a white orb — TABS: a crude, jagged, team-coloured blade-crystal head (ref: evil.tempest_lich.red.png)
 2. staff foot in unit_evil.tempest_lich_idle: a plain round end — TABS: a lightning-bolt-shaped foot (ref: evil.tempest_lich.red.png)
 3. shaft in unit_evil.tempest_lich_idle: a thick grey tube — TABS: a thin dark pole (ref: evil.tempest_lich.blue.png)
 4. grip in unit_evil.tempest_lich_idle is one hand with the other arm raised — TABS: two-handed, both hands on the shaft at chest and waist (card Weapon Type Two-handed)
c FAIL (2 since 489, 1 struck)
 2. hover in unit_evil.tempest_lich_release: he strides on the ground — TABS: Hover keeps him floating above the ground (card Abilities Hover)
d PASS (493 stats)
## Ranked gaps
1. [S] evil.tempest_lich.a ground-length bell skirt — blocker 4: team tunic over thin dark legs with trailing black strips; unblocks the hover — ref: evil.tempest_lich.red.png — ours: unit_evil.tempest_lich_idle.png
2. [S] evil.tempest_lich.b crystal staff head — blocker 1: jagged team-coloured blade-crystal head — ref: evil.tempest_lich.red.png — ours: unit_evil.tempest_lich_idle.png
3. [S] evil.tempest_lich.a headless tendrils — blocker 2: hide the head, black tendril cluster from the neck (evilDress.ts) — ref: evil.tempest_lich.red.png — ours: unit_evil.tempest_lich_idle.png
4. [S] evil.tempest_lich.c hover — blocker 2: "reaperHover" mark on the hip (REAPER_HOVER), only after the skirt is short — ref: card Abilities Hover — ours: unit_evil.tempest_lich_release.png
## Attempts (iter | gap | criterion | verdict)
493 | REAPER_HOVER mark on the hip (301f1fad, reverted 06b4f975) | c | rejected (the ground-length skirt hid the lift)
492 | storm bolts held under the cloud until it goes, spawnZeusBolt hold (a91f8594) | c | approved (struck 1)
491 | storm cloud over the target drops Zeus bolts, visualEffects spawnStormCloud (6a770969, f86388a0) | c | approved (no strike)
## Rejected (last 4)
493 | hover | c | attempts 1 | hover invisible: the skirt runs to the ground, a 15% lift opens no gap
## Notes (max 3 lines)
- Look is unitFactory HORNED_EVIL "evil.tempest_lich" (tines, skirt 1.9, rags). a and b had no attempt since 489: they starve at 494.
