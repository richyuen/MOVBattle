# wild_west.miner
Status: open   Audited: 444, 452 (CONFIRM: passed c; failed a, b)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (0 since 452; CONFIRM list)
 1. hat in unit_wild_west.miner_idle: a rounded skullcap with a short front bill — TABS: a tall faceted team-colour crown with a wide brim all round (ref: wild_west.miner.red.png, wild_west.miner.blue.png)
 2. trouser legs in unit_wild_west.miner_idle: bare team skin from a thin navy waistband down to the boots — TABS: dark team-shade overall legs running into the boots (ref: wild_west.miner.blue.png)
 3. face in unit_wild_west.miner_idle: no bead eyes readable; the camera gets the back of the head and the strap-crossed pale torso, the mustache only a dark curve at the collar — TABS: two white bead eyes over a black handlebar mustache facing out (ref: wild_west.miner.blue.png, card Appearance)
 4. sleeves in unit_wild_west.miner_idle: bare skin arms — TABS: dark team-colour sleeves ending in tan glove cuffs (ref: wild_west.miner.red.png)
b FAIL (0 since 452; CONFIRM list)
 1. pickaxe carry in unit_wild_west.miner_idle: held one-handed low at the hip, the shaft trailing out diagonally to the left with the head at head height away from the body — TABS: gripped two-handed and shouldered, the shaft upright past the head (ref: wild_west.miner.red.png, card Characteristics "over its shoulder")
c PASS (451: the iron head comes down in front of him onto the man, blast after; _aimPick; CONFIRM 452)
d PASS (cost 200, hp 2.72x, dmg 1.07x, cd 3.49x; 452 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] a face - blocker 3: evidence first - the idle/lineup show his back; find why he faces away (heading or pose) before any look gap - ours: lineup_wild_west, unit_wild_west.miner_idle (CONFIRM 452)
2. [S] b shouldered pick - blocker 1: idle carry two-handed on the shoulder, haft upright past the head (the _windup grip held at rest) - ref: red.png - ours: unit_wild_west.miner_idle (CONFIRM 452)
3. [S] a trousers - blocker 2: dark team-shade overall legs into the boots (limbShell on the thighs/shins) - ref: blue.png (CONFIRM 452)
## Attempts (iter | gap | criterion | verdict)
445-446 | MINER_PICK long haft + POLE_GRIP.minerHaft | b | approved (b PASS)
447-449 | MINER_CAP, MINER_OVERALLS, MINER_MOUSTACHE | a | approved (struck 1, 3, 2)
447-448 | MINER_BLAST burst at the landed blow, scale .5 | c | approved
451 | _aimPick haft along _aimBlow's _aimTip while aimed (1a48b2d8) | c | approved (struck 2; c PASS)
452 | MINER_BOOTS dark brown knee boots, turned top, dark feet (e0e391fd) | a | approved (struck 4; a PASS, then CONFIRM failed a, b)
## Rejected (last 4)
## Notes (max 3 lines)
- 452 critic: boots chunky, about twice the shin's width (MINER_BOOTS.out 1.25 -> 1.1 [P]); shirt reads pale lilac-white, a short olive hem at the waist over bare thighs.
- 451 critic: the haft passes through his cap with the fists above and behind the head (TABS fists before the chest) - not a blocker.
