# pirate.flintlock
Status: open   Audited: 422   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (2 since 422)
 3. the shins in unit_pirate.flintlock_idle - bare - TABS: grey socks between the pant cuff and brown shoes (ref: pirate.flintlock.blue.png; card "socks")
 4. the sides of the head in unit_pirate.flintlock_idle - bare under the cap - TABS: long dark-team hair falling to the shoulders either side of the face (ref: pirate.flintlock.red.png; card "hair")
  (struck 1 at 423; 2 at 424)
b PASS (424: a pistol held out level in each fist at shoulder height)
c FAIL (0 since 422)
 1. the discharge in unit_pirate.flintlock_release - a white sphere the size of his torso floating ahead of the chest while the barrel sits at the hip pointing down-forward - TABS: a small flash at the pistol's bell and a bullet leaving the muzzle (card Weapons: projectile Flintlock Bullet, speed 65)
 2. the gun in unit_pirate.flintlock_flight - still in hand 150 ms after the shot, raised vertical, summary.notes recording only "fire" - TABS: the pistol thrown away as soon as it fires and the man closing bare-fisted (card Characteristics)
d PASS (cost 100, hp 0.55x, dmg 0.61x, cd 2.50x; 424 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] c throw away - blocker 2: both pistols tossed as the shot fires, then he closes bare-fisted (simulationSystem flintlock) - ref: card Characteristics - ours: unit_pirate.flintlock_flight (424 rank 3)
2. [S] a socks - blocker 3: grey sock shells from the pant cuff to the shoe (pirateDress) - ref: pirate.flintlock.blue.png - ours: unit_pirate.flintlock_idle (424 rank 4)
## Attempts (iter | gap | criterion | verdict)
423 | PISTOL prop + _aimPistol held out (5b56edc3, caf27b2a) | b | approved (struck 1, 3)
423 | PIRATE_VEST open vest (e6ed0749) | a | approved (struck 1)
424 | off-hand pistol, _aimPistol both arms (785cfeb0) | b | approved (struck 2; b PASS)
424 | PIRATE_PANTS brown pants to mid-shin, turned cuff (87042b0e) | a | approved (struck 2)
## Rejected (last 4)
## Notes (max 3 lines)
- The "flintlock" prop (propBuilder PISTOL, smoke at its "musketMuzzle" bell) is shared with gunslinger/quick_draw/bank_robbers; _aimPistol aims a left-hand pistol too when both hands hold one (they get it; the queen's single off-hand copy is not aimed).
- 424 defect: the pants brown (.45,.19,.045) warmer/more orange than the render's dusty mid-brown. The c.1 sphere may now leave the bell: look before a c pick.
