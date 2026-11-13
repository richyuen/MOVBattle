# secret.wheelbarrow_dragon
Status: open   Audited: 527 (AUDIT x2)   Done: -
## Verdicts
a FAIL (3 since 527, 3 struck)
 4. Operator in unit_secret.wheelbarrow_dragon_idle is a hulking slab-torsoed giant — TABS: a lanky normal-sized Traveller in team overalls (ref: secret.wheelbarrow_dragon.red.png; card Appearance)
b FAIL (1 since 527, 1 struck)
 2. No dragon head with a toothed jaw in unit_secret.wheelbarrow_dragon_idle — TABS: an open jaw full of teeth at the front of the barrow (ref: secret.wheelbarrow_dragon.jpg)
c PASS (530: struck 1, flame jet from the jaw)
d PASS (531 stats)
## Ranked gaps
1. [S] secret.wheelbarrow_dragon.a lanky operator — blocker 4: lanky build + team overalls (unitVisuals bulk, secretDress) — ref: secret.wheelbarrow_dragon.red.png — ours: unit_secret.wheelbarrow_dragon_idle.png
2. [S] secret.wheelbarrow_dragon.b dragon jaw — blocker 2: open toothed jaw at barrow front — ref: secret.wheelbarrow_dragon.jpg — ours: unit_secret.wheelbarrow_dragon_idle.png
## Attempts (iter | gap | criterion | verdict)
531 | driver's brown afro (tribalDress dressAfro), straw hat off, gated on the mounted driver (e7664e58, 0ef10b96) | a | approved (struck 3)
530 | barrow dragon breathes a held flame jet from "barrowDragonMouth" onto the man, body flames, BARROW_BREATH (SS fire_dot) (7b82178a) | c | approved (struck 1, c PASS)
529 | team dragon head in the tray: horns, eyes, nostrils, fanged grin, BARROW_DRAGON; dragon_cart special builds nothing (f0b2561d, a83f0825) | a | approved (struck 2)
528 | plank barrow on a log wheel, two handles, DRAGON_BARROW special on the cart actor (a6bcb527) | a | approved (struck 1; b.1 struck too)
## Rejected (last 4)
## Notes (max 3 lines)
- The dragon is built in the barrow (cart actor root); the dragon_head actor is the emitter only. The driver's special is suppressed: gate his dress on posePreset "mounted" and special !== "dragon_barrow".
- 531 critic: driver body a pale lilac slab with a block torso (TABS lanky, team overalls over a bare team chest).
- 529 critic: head is a dome (TABS crocodile snout); horns grey-white (TABS tan). b starves at 533 (last attempt 528).
