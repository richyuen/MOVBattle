# wild_west.gunslinger
Status: open   Audited: 444   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (0 since 444)
 1. hat in unit_wild_west.gunslinger_idle: brown wide flat-brim hat with band — TABS: dark team bowler, round crown, narrow brim (ref: red.png; card Appearance)
 2. jacket in unit_wild_west.gunslinger_idle: short vest block, bare team arms — TABS: long-sleeved team suit jacket with lapels over a buttoned waistcoat (ref: red.png)
 3. tie in unit_wild_west.gunslinger_idle: none — TABS: wide purple tie at the throat (ref: red.png; card Appearance)
 4. sideburns in unit_wild_west.gunslinger_idle: none — TABS: black bushy sideburns (ref: red.png)
b FAIL (0 since 444)
 1. gun shape in unit_wild_west.gunslinger_idle: silver flared-muzzle flintlock pistol — TABS: long dark-grey revolver with a cylinder (ref: red.png, .blue.png)
 2. gun count in unit_wild_west.gunslinger_idle: one gun per hand — TABS: two revolvers in each hand (ref: card Characteristics; red.png)
c PASS (444: arms straight up, guns fired into the sky, the bullets fall on the man after the fall delay with blasts)
d PASS (cost 650, hp 0.62x, dmg 0.77x, cd 6.00x; 444 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
2. [S] a hat - blocker 1: dark team bowler (round crown, short curled brim) replacing the huge flat wide brim - ref: red.png - ours: unit_wild_west.gunslinger_idle (critic 444)
1. [S] b revolver mesh - blocker 1: long dark revolver with a cylinder, replacing the flintlock - ref: red.png - ours: unit_wild_west.gunslinger_idle
## Attempts (iter | gap | criterion | verdict)
444 | BULLET_RAIN arms up (gunsUp), guns fired skyward, 3 bullets fall with blasts (0e73eb2a) | c | approved (struck 1; c PASS)
## Rejected (last 4)
## Notes (max 3 lines)
- c fallout (critic 444): the falling streak is not caught in any shot and the blast is a large white glow (BULLET_RAIN.blast .6 -> ~.35); drop spots use Math.random (seeded by capture).
