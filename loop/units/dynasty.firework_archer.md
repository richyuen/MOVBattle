# dynasty.firework_archer
Status: open   Audited: 411   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (1 since 411)
 2. robe in unit_dynasty.firework_archer_idle: a short purple tunic box - TABS: a crossed-lapel team-coloured robe to the knee (ref: dynasty.firework_archer.jpg)
 3. sash in unit_dynasty.firework_archer_idle: none - TABS: an orange-brown waist sash (ref: dynasty.firework_archer.jpg)
 4. legs in unit_dynasty.firework_archer_idle: plain legs and boots - TABS: wrapped shins with sandals (ref: dynasty.firework_archer.red.png)
  (struck 1 at 412: dark long hair with a knot, no hat)
b FAIL (1 since 411)
 1. bow in unit_dynasty.firework_archer_idle: a small dark curved stick held low and horizontal - TABS: a large upright brown recurve with orange tip caps, taller than the torso (ref: dynasty.firework_archer.jpg)
 2. firework arrow in unit_dynasty.firework_archer_idle: none, only a thin arrow - TABS: a fat team-coloured rocket tube with green bands and a dark head nocked across the bow (ref: dynasty.firework_archer.red.png)
c FAIL (1 since 411)
 2. explosion in unit_dynasty.firework_archer_struck: the knight runs on with no burst - TABS: an explosion with a 2.5 m radius at impact (ref: card Weapons)
 3. release pose in unit_dynasty.firework_archer_release: the bow slung on her back while she runs - TABS: looses from a full draw with the rocket nocked (ref: dynasty.firework_archer.jpg)
  (struck 1 at 413: the rocket tube flies through _flight)
d PASS (cost 180, hp 0.62x, dmg 0.27x, cd 4.00x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] c impact explosion - blocker 2: a 2.5 m spark/flash burst at the Firework Arrow's impact - ref: card Weapons - ours: unit_dynasty.firework_archer_struck.png
2. [S] b rocket nocked at rest - blocker 2: the FIREWORK_ROCKET tube as a prop lying across the bow at the grip - ref: dynasty.firework_archer.red.png - ours: unit_dynasty.firework_archer_idle.png
3. [P] b upright grip, fallout of 413.3: stave upright in the bow fist (it floats diagonal), tip caps ~3x larger orange - shows in unit_dynasty.firework_archer_idle
4. [S] a robe - blocker 2: a team crossed-lapel robe shell to the knee with an orange-brown sash (dynastyDress archerRobe; clears 3 too) - ref: dynasty.firework_archer.jpg - ours: unit_dynasty.firework_archer_idle.png
## Attempts (iter | gap | criterion | verdict)
412 | ARCHER_HAIR: dark hair cap, back fall, side locks, knot; conical hat off (772d55d) | a | approved (struck 1)
413 | firework_bow: tall brown stave, orange tip caps, iceBowCarry carry (bb471b5) | b | approved (none struck: diagonal, not gripped, caps dull)
413 | FIREWORK_ROCKET: fat team tube, green bands, dark head, flame; flatter arc (191f1a5) | c | approved (struck 1)
## Rejected (last 4)
## Notes (max 3 lines)
- 413 critic: the rocket spawns at her head, not off the bow; she has no draw pose (c.3).
- 411 audit: _release/_flight frame the target out of shot. DRAWS_BEFORE_LOOSE is the draw-before-loose mechanism.
- 412 critic (minor): the hair cap is a flat-topped box.
