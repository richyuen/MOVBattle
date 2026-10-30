# pirate.blunderbuss
Status: open   Audited: 422   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (0 since 422)
 1. the head in unit_pirate.blunderbuss_idle - a small round tan cap - TABS: a flat wooden plank hat as wide as the shoulders, a barrel lid worn level (ref: pirate.blunderbuss.red.png)
 2. the torso in unit_pirate.blunderbuss_idle - a dark closed tunic - TABS: a brown barrel of vertical staves with two black straps round the chest (ref: pirate.blunderbuss.red.png; card Appearance "barrel armor")
 3. the forearms in unit_pirate.blunderbuss_idle - bare team - TABS: brown stave bracers with black straps on each arm (ref: pirate.blunderbuss.red.png; card "large straps around their arms")
 4. the sides of the head in unit_pirate.blunderbuss_idle - bare - TABS: dark-brown hair falling to the shoulders either side of the face (ref: pirate.blunderbuss.blue.png)
b FAIL (1 since 422)
 1. the main-hand prop in unit_pirate.blunderbuss_idle - TABS: a blunderbuss ... the whole as long as the man is tall (ref: pirate.blunderbuss.red.png, pirate.blunderbuss.jpg; card Main Hand Blunderbuss)
  (struck 2 at 425; 1's mace, stock, barrel and bell clauses at 425)
c FAIL (0 since 422) [RE-AUDIT at 426: the 425 evidence commit re-framed its motion shots]
 1. the shooter in unit_pirate.blunderbuss_release - not in frame, the field empty at the 200 ms shot - TABS: the man planted with the blunderbuss levelled and its bell flashing (ref: pirate.blunderbuss.jpg; card Weapons)
 2. the knight in unit_pirate.blunderbuss_struck - standing on its feet mid-swing, untouched - TABS: blown off its feet by the shot (card Weapons: force 650)
 3. the recoil in unit_pirate.blunderbuss_flight - no man in frame to show it - TABS: the shooter thrown backwards by his own shot (card Abilities: Blunderbuss Recoil)
d PASS (cost 160, hp 2.49x, dmg 0.45x, cd 4.00x; 425 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a barrel armour - blocker 2: vertical stave barrel with two black straps round the chest (pirateDress BARREL_ARMOUR) - ref: pirate.blunderbuss.red.png - ours: unit_pirate.blunderbuss_idle (425 rank 5)
2. [P] b gun length - blocker 1: propBuilder BLUNDERBUSS.long 0.62 -> 0.9, fallout of 425 [S] BLUNDERBUSS (28779788) - NEXT shot: unit_pirate.blunderbuss_windup (425 rank 6)
## Attempts (iter | gap | criterion | verdict)
425 | BLUNDERBUSS prop + _aimBlunderbuss two-hand low hold (28779788) | b | approved (struck 2; 1 down to its length)
## Rejected (last 4)
## Notes (max 3 lines)
- 425 evidence (386d1e73): framed as a ranged unit (shooter and the shot's first metres); the shooter is now in _windup/_release/_flight. c is re-audited at 426's step 2.
- The gun: propBuilder case "blunderbuss" (root "blunderbuss", BLUNDERBUSS_OFF_GRIP, smoke at "musketMuzzle"); held by proceduralAnimation _aimBlunderbuss (BLUNDERBUSS_AIM).
