# secret.wheelbarrow_dragon
Status: open   Audited: 527 (AUDIT x2)   Done: -
## Verdicts
a FAIL (2 since 527, 2 struck)
 3. Headgear in unit_secret.wheelbarrow_dragon_idle is a huge grey flat-crowned wide-brim hat — TABS: a brown afro, no hat (ref: secret.wheelbarrow_dragon.red.png)
 4. Operator in unit_secret.wheelbarrow_dragon_idle is a hulking slab-torsoed giant — TABS: a lanky normal-sized Traveller in team overalls (ref: secret.wheelbarrow_dragon.red.png; card Appearance)
b FAIL (1 since 527, 1 struck)
 2. No dragon head with a toothed jaw in unit_secret.wheelbarrow_dragon_windup — TABS: an open jaw full of teeth at the front of the barrow (ref: secret.wheelbarrow_dragon.jpg)
c FAIL (0 since 527)
 1. The fire event at 1900 ms shows no flame in unit_secret.wheelbarrow_dragon_ability/_ability_after; the man only swings his arms — TABS: the little dragon breathes fire from its mouth (ref: card Characteristics)
d PASS (529 stats)
## Ranked gaps
1. [S] secret.wheelbarrow_dragon.c dragon breath — blocker 1: a flame cone out of the barrow dragon's jaw on the fire event — ref: card Characteristics — ours: unit_secret.wheelbarrow_dragon_ability
2. [S] secret.wheelbarrow_dragon.a afro — blocker 3: remove the grey wide-brim hat (unitVisuals straw_hat), add a brown afro — ref: secret.wheelbarrow_dragon.red.png — ours: unit_secret.wheelbarrow_dragon_idle
## Attempts (iter | gap | criterion | verdict)
529 | team dragon head in the tray: horns, eyes, nostrils, fanged grin, BARROW_DRAGON; dragon_cart special builds nothing (f0b2561d, a83f0825) | a | approved (struck 2)
528 | plank barrow on a log wheel, two handles, DRAGON_BARROW special on the cart actor (a6bcb527) | a | approved (struck 1; b.1 struck too)
## Rejected (last 4)
## Notes (max 3 lines)
- The dragon is built in the barrow (cart actor root, its ground); the dragon_head actor is the emitter only (fire origin offsets in linkedActorPresets).
- 529 critic: b.2's teeth are hidden side-on in _windup; head is a dome (TABS crocodile snout); horns grey-white (TABS tan).
- 528 critic: in _idle the handles end at his knees, below the mitts (minor).
