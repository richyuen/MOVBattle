# wild_west.gunslinger
Status: open   Audited: 444   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (3 since 444)
  (struck 1 at 445; 2 by lineup, 3 at 447)
 4. sideburns in unit_wild_west.gunslinger_idle: none — TABS: black bushy sideburns (ref: red.png)
b PASS (446: two dark revolvers in each fist)
c PASS (444: arms straight up, guns fired into the sky, the bullets fall on the man after the fall delay with blasts)
d PASS (cost 650, hp 0.62x, dmg 0.77x, cd 6.00x; 447 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
5. [S] a sideburns - blocker 4: black bushy faceted slabs on the head's sides from under the brim to the jaw, a little proud (wildWestDress gunslingerSideburns) - ref: red.png - ours: unit_wild_west.gunslinger_idle (critic 447)
## Attempts (iter | gap | criterion | verdict)
444 | BULLET_RAIN arms up (gunsUp), guns fired skyward, 3 bullets fall with blasts (0e73eb2a) | c | approved (struck 1; c PASS)
445 | REVOLVER weaponVariant "revolver" + pistolBell mark (4a52867e, e2029795) | b | approved (struck 1)
445 | BOWLER wildWestDress dark team bowler (6e54d4ad, b5e033d5) | a | approved (struck 1)
446 | REVOLVER pair "revolver_pair": twin without pistolBell, own muzzle (39b50bf9) | b | approved (struck 2; b PASS)
446 | GUNSLINGER_JACKET sleeves + cuffs + shirt V + lapels, tunic skirt to .78 of the knee (75a14901) | a | approved (bare-arms clause cleared, none struck)
447 | GUNSLINGER_TIE violet knot + widening blade down the shirt V (28aec26d) | a | approved (struck 3; 2 by lineup)
## Rejected (last 4)
## Notes (max 3 lines)
- c fallout (critic 444): the falling streak is not caught in any shot and the blast is a large white glow (BULLET_RAIN.blast .6 -> ~.35); drop spots use Math.random (seeded by capture).
- 446 critic: the jacket uses body.bodyMaterial (wildwest_leather, reads brown on red in the lineup); team cloth wanted (no longer a blocker after 447's lineup strike).
- 447 critic: the tie blade is a third of the V's width at the top; TABS fills the V (not a blocker).
