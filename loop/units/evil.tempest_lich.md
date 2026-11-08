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
c FAIL (1 since 489)
 1. attack in unit_evil.tempest_lich_release/_flight: a horizontal blue zig-zag bolt from the staff to the target — TABS: a storm cloud forms over the enemies and drops lightning straight down (ref: evil.tempest_lich.jpg)
 2. hover in unit_evil.tempest_lich_release: he strides on the ground — TABS: Hover keeps him floating above the ground (card Abilities Hover)
d PASS (491 stats)
## Ranked gaps
1. [S] evil.tempest_lich.c bolts in the struck frame — blocker 1: the cloud's Zeus bolts alive at the struck shot (first bolt held, or each bolt kept for the cloud's life), cloud to ground — ref: evil.tempest_lich.jpg — ours: unit_evil.tempest_lich_struck.png
2. [S] evil.tempest_lich.c hover — blocker 2: lift the rig off the ground with a bob, legs trailing — ref: card Abilities Hover — ours: unit_evil.tempest_lich_release.png
3. [S] evil.tempest_lich.a headless tendrils — blocker 2: hide the head, black tendril cluster from the neck (evilDress.ts) — ref: evil.tempest_lich.red.png — ours: unit_evil.tempest_lich_idle.png
4. [S] evil.tempest_lich.b crystal staff head — blocker 1: jagged team-coloured blade-crystal head — ref: evil.tempest_lich.red.png — ours: unit_evil.tempest_lich_idle.png
## Attempts (iter | gap | criterion | verdict)
491 | storm cloud over the target drops Zeus bolts, visualEffects spawnStormCloud (6a770969, f86388a0) | c | approved (no strike)
## Rejected (last 4)
## Notes (max 3 lines)
- 491 DEFECTS: _struck is 33 ms after the 467 ms strike and shows the cloud (3.2 m up) but no bolt; release/flight frame only the lich.
- Look is unitFactory HORNED_EVIL "evil.tempest_lich" (tines, skirt, rags).
