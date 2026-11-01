# wild_west.gunslinger
Status: open   Audited: 444   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (2 since 444)
  (struck 1 at 445)
 2. jacket in unit_wild_west.gunslinger_idle: short vest block, bare team arms — TABS: long-sleeved team suit jacket with lapels over a buttoned waistcoat (ref: red.png)
 3. tie in unit_wild_west.gunslinger_idle: none — TABS: wide purple tie at the throat (ref: red.png; card Appearance)
 4. sideburns in unit_wild_west.gunslinger_idle: none — TABS: black bushy sideburns (ref: red.png)
b PASS (446: two dark revolvers in each fist)
c PASS (444: arms straight up, guns fired into the sky, the bullets fall on the man after the fall delay with blasts)
d PASS (cost 650, hp 0.62x, dmg 0.77x, cd 6.00x; 446 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
3. [S] a tie - blocker 3: wide purple tie slab from the collar down the shirt V - ref: red.png - ours: unit_wild_west.gunslinger_idle (critic 446)
4. [S] a jacket - blocker 2: team-tinted jacket and sleeves (not the wildwest_leather body material) plus a buttoned waistcoat panel (gunslingerJacket) - ref: red.png - ours: lineup_wild_west (critic 446)
## Attempts (iter | gap | criterion | verdict)
444 | BULLET_RAIN arms up (gunsUp), guns fired skyward, 3 bullets fall with blasts (0e73eb2a) | c | approved (struck 1; c PASS)
445 | REVOLVER weaponVariant "revolver" + pistolBell mark (4a52867e, e2029795) | b | approved (struck 1)
445 | BOWLER wildWestDress dark team bowler (6e54d4ad, b5e033d5) | a | approved (struck 1)
446 | REVOLVER pair "revolver_pair": twin without pistolBell, own muzzle (39b50bf9) | b | approved (struck 2; b PASS)
446 | GUNSLINGER_JACKET sleeves + cuffs + shirt V + lapels, tunic skirt to .78 of the knee (75a14901) | a | approved (bare-arms clause cleared, none struck)
## Rejected (last 4)
## Notes (max 3 lines)
- c fallout (critic 444): the falling streak is not caught in any shot and the blast is a large white glow (BULLET_RAIN.blast .6 -> ~.35); drop spots use Math.random (seeded by capture).
- 446 critic: the jacket uses body.bodyMaterial (wildwest_leather, reads brown on red in the lineup); team cloth wanted.
