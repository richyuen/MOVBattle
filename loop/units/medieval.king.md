# medieval.king
Status: open   Audited: 351   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (0 since 351)
 1. crown in unit_medieval.king_idle is an oversized flat yellow torus floating like a halo, red balls on spikes — TABS: fitted gold band on the head, tall gold points, inset gems (ref: medieval.king.red.png, .jpg)
 2. no beard in unit_medieval.king_idle — TABS: dirty-blonde beard and moustache (ref: medieval.king.blue.png)
 3. body plain team in unit_medieval.king_idle — TABS: puffed short-sleeve team blouse with gold stripes and collar, pantaloons, beige stockings, brown belt gold buckle (ref: medieval.king.red.png)
 4. cape a narrow yellow strip in unit_medieval.king_idle — TABS: cream cape off the shoulders, gold clasps (ref: medieval.king.jpg)
b FAIL (1 since 351)
 1. grip one fist at the shoulder in unit_medieval.king_windup — TABS: two fists spaced on the long grip (ref: medieval.king.jpg)
c PASS (351)
d PASS (cost 1500, hp 29.60x, dmg 4.32x (+18%), cd 1.24x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] b two-fisted Zweihander — blocker 1: off fist one grip-span below the main fist, blade leading, not via the POLE_GRIP pole carry — ref: medieval.king.jpg — ours: unit_medieval.king_windup.png
2. [S] a fitted crown — blocker 1: gold band seated on the head, tall points, gems, replacing the floating torus — ref: medieval.king.red.png — ours: unit_medieval.king_idle.png
## Attempts (iter | gap | criterion | verdict)
351 | Zweihander variant (ZWEI, POLE_GRIP.zweiGrip) [S] (4c91ec8, reverted ce15b46) | b | rejected
352 | Zweihander retry: greatsword slab cut ZWEI (.85 H, .05 wide, lugs, 4.5-fist grip), own mount, no marker [S] (519c8af) | b | approved
## Rejected (last 4)
- Zweihander [S] [1] — 351: blade hair-thin; swing led pommel-first — cause: the zweiGrip marker put it through the two-handed pole carry (POLE_GRIP), not the mesh
## Notes (max 3 lines)
- A two-fisted grip must not use a POLE_GRIP marker on a sword: the pole carry turns it pommel-first (351).
