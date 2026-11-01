# legacy.pike
Status: open   Audited: 457, 462 (RE-AUDIT lineup)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4 (6 on a), and the count of approved [S] since the list was written)
a FAIL (1 since 457)
 1. headgear in unit_legacy.pike_idle, a bucket great-helm — TABS: a wide-brimmed team hat with a tan feather plume (ref: legacy.pike.jpg, card Appearance)
 2. torso in unit_legacy.pike_idle, plain team body — TABS: a cream armour vest with a half-circle team emblem (ref: legacy.pike.jpg)
 3. hair in unit_legacy.pike_idle, hidden or none — TABS: brown hair below the hat brim (ref: legacy.pike.jpg)
 4. waist in unit_legacy.pike_idle, none — TABS: a dark belt over baggy team trousers (ref: legacy.pike.jpg)
b FAIL (0 since 457)
 1. pike length in unit_legacy.pike_idle, a thin spear about 1.3x the man's height — TABS: a pike many times the man's height (range 8.5) (ref: legacy.pike.red.png, card Weapons)
 2. pike head in unit_legacy.pike_idle, a small leaf point — TABS: a long steel blade with a side hook (ref: legacy.pike.blue.png, card Appearance)
 3. grip in unit_legacy.pike_windup, held upright one-handed — TABS: two-handed, levelled forward at the hip (ref: legacy.pike.jpg)
c FAIL (0 since 457)
 1. thrust in unit_legacy.pike_release, the pike stays vertical when the hit is recorded — TABS: a long levelled pike thrust (ref: card Weapons)
 2. drop in unit_legacy.pike_flight, the pike is still in hand after the attack — TABS: it loses its pike after one attack and then slaps (ref: card Characteristics)
d PASS (cost 300, hp 0.45x, dmg 1.11x, cd 1.30; 457 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] legacy.pike.b pike length — blocker 1: a pike several times his height (range 8.5), orange shaft, with the levelled two-hand grip (b.3) — ref: legacy.pike.red.png — ours: _idle
2. [P] legacy.pike.a headgear — blocker 1: cavalier_hat plume tan (~.85,.7,.45) for the pike only (fallout of 9708312a) — ref: legacy.pike.jpg — ours: _idle
3. [S] legacy.pike.a torso — blocker 2: cream armour vest with a half-circle team emblem — ref: legacy.pike.jpg — ours: _idle
## Attempts (iter | gap | criterion | verdict)
462 | cavalier_hat in place of the great-helm (9708312a) | a | approved (none struck: plume team-coloured)
## Rejected (last 4)
## Notes (max 3 lines)
- 462 critic (minor): the brim is narrower than TABS's broad tilted brim (near twice the head width).
- b.1 waits for the levelled two-hand grip (b.3) in the same iteration: an upright long pike re-frames every shot.
