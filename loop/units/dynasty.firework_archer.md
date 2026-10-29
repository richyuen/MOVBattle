# dynasty.firework_archer
Status: open   Audited: 411   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (1 since 411)
 2. robe in unit_dynasty.firework_archer_idle: a short purple tunic box - TABS: a crossed-lapel team-coloured robe to the knee (ref: dynasty.firework_archer.jpg)
 3. sash in unit_dynasty.firework_archer_idle: none - TABS: an orange-brown waist sash (ref: dynasty.firework_archer.jpg)
 4. legs in unit_dynasty.firework_archer_idle: plain legs and boots - TABS: wrapped shins with sandals (ref: dynasty.firework_archer.red.png)
  (struck 1 at 412: dark long hair with a knot, no hat)
b FAIL (0 since 411)
 1. bow in unit_dynasty.firework_archer_idle: a small dark curved stick held low and horizontal - TABS: a large upright brown recurve with orange tip caps, taller than the torso (ref: dynasty.firework_archer.jpg)
 2. firework arrow in unit_dynasty.firework_archer_idle: none, only a thin arrow - TABS: a fat team-coloured rocket tube with green bands and a dark head nocked across the bow (ref: dynasty.firework_archer.red.png)
c FAIL (0 since 411)
 1. firework arrow in unit_dynasty.firework_archer_flight: nothing in the air - TABS: a rocket tube flying with a spark/smoke trail (ref: card Weapons, projectile Firework Arrow)
 2. explosion in unit_dynasty.firework_archer_struck: the knight runs on with no burst - TABS: an explosion with a 2.5 m radius at impact (ref: card Weapons)
 3. release pose in unit_dynasty.firework_archer_release: the bow slung on her back while she runs - TABS: looses from a full draw with the rocket nocked (ref: dynasty.firework_archer.jpg)
d PASS (cost 180, hp 0.62x, dmg 0.27x, cd 4.00x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] b big upright recurve - blocker 1: a brown recurve taller than the torso with orange tip caps, held upright in the main fist at rest - ref: dynasty.firework_archer.jpg - ours: unit_dynasty.firework_archer_idle.png
2. [S] c rocket in flight - blocker 1: the projectile a fat team rocket tube with green bands and a dark head, trailing sparks/smoke - ref: dynasty.firework_archer.red.png, card Weapons - ours: unit_dynasty.firework_archer_flight.png
3. [S] a robe - blocker 2: a team crossed-lapel robe shell to the knee with an orange-brown sash (dynastyDress archerRobe; clears 3 too) - ref: dynasty.firework_archer.jpg - ours: unit_dynasty.firework_archer_idle.png
4. [S] b rocket - blocker 2: a banded team rocket tube nocked on the bow - ref: dynasty.firework_archer.jpg - ours: unit_dynasty.firework_archer_idle.png
## Attempts (iter | gap | criterion | verdict)
412 | ARCHER_HAIR: dark hair cap, back fall, side locks, knot; conical hat off (772d55d) | a | approved (struck 1)
## Rejected (last 4)
## Notes (max 3 lines)
- 411 audit: the _release/_flight framing has the target out of frame (reframe to include it). DRAWS_BEFORE_LOOSE (409 ice archer) is the draw-before-loose mechanism.
- 412 critic (minor): the hair cap is a flat-topped box, a little helmet-like from the front.
