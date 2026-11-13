# secret.wheelbarrow_dragon
Status: open   Audited: 527 (AUDIT x2)   Done: -
## Verdicts
a FAIL (1 since 527, 1 struck)
 2. No dragon in unit_secret.wheelbarrow_dragon_idle — TABS: a big team dragon head with tan horns and teeth sitting in the barrow (ref: secret.wheelbarrow_dragon.red.png, .jpg)
 3. Headgear in unit_secret.wheelbarrow_dragon_idle is a huge grey flat-crowned wide-brim hat — TABS: a brown afro, no hat (ref: secret.wheelbarrow_dragon.red.png)
 4. Operator in unit_secret.wheelbarrow_dragon_idle is a hulking slab-torsoed giant — TABS: a lanky normal-sized Traveller in team overalls (ref: secret.wheelbarrow_dragon.red.png; card Appearance)
b FAIL (1 since 527, 1 struck)
 2. No dragon head with a toothed jaw in unit_secret.wheelbarrow_dragon_windup — TABS: an open jaw full of teeth at the front of the barrow (ref: secret.wheelbarrow_dragon.jpg)
c FAIL (0 since 527)
 1. The fire event at 1900 ms shows no flame in unit_secret.wheelbarrow_dragon_ability/_ability_after; the man only swings his arms — TABS: the little dragon breathes fire from its mouth (ref: card Characteristics)
d PASS (528 stats)
## Ranked gaps
1. [S] secret.wheelbarrow_dragon.a dragon in the barrow — blocker 2: a team dragon head with tan horns and a toothed open jaw sitting in the tray (also b.2; replace the dragon_head actor's dragon_cart box) — ref: secret.wheelbarrow_dragon.red.png — ours: unit_secret.wheelbarrow_dragon_idle
2. [S] secret.wheelbarrow_dragon.c fire breath — blocker 1: a flame cone out of the dragon's mouth at the fire event — ref: card Characteristics — ours: unit_secret.wheelbarrow_dragon_ability
## Attempts (iter | gap | criterion | verdict)
528 | plank barrow on a log wheel, two handles, DRAGON_BARROW special on the cart actor (a6bcb527) | a | approved (struck 1; b.1 struck too)
## Rejected (last 4)
## Notes (max 3 lines)
- The cart actor sits at the driver's spot (offset 0): the barrow is built forward from its body.root (ground).
- 528 critic: in _idle the handles end at his knees, below the mitts (minor).
