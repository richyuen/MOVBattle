# dynasty.monkey_king
Status: open   Audited: 411   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (1 since 411)
 1. headgear in unit_dynasty.monkey_king_idle: a yellow torus crown with red-ball spikes - TABS: a gold swirl circlet with two long team-coloured feather antennae (ref: dynasty.monkey_king.red.png)
 2. face in unit_dynasty.monkey_king_idle: a plain team head - TABS: a baboon face with a tan muzzle and blond hair tufts (ref: dynasty.monkey_king.red.png, card Appearance)
 4. trousers in unit_dynasty.monkey_king_idle: slim legs - TABS: puffy team-coloured shorts gathered at the knee over pointy shoes (ref: dynasty.monkey_king.red.png)
  (struck 3 at 416: a team tail rising over his head)
b PASS (416: long team staff, gold banded ends)
c FAIL (1 since 411)
 2. knockback in unit_dynasty.monkey_king_ability_after: the knight stands among the clones unmoved - TABS: force 1500 sends the target flying (ref: card Weapons)
  (struck 1 at 417: the leap onto the man)
d PASS (cost 2000, hp 6.71x, dmg 0.73x, cd 0.41x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [S] c knockback - blocker 2: evidence first (re-aim blocker 2 at unit_dynasty.monkey_king_struck: _ability_after now shows the leap), then a 1500-force launch of the struck man (BO_SHOVE entry) - ref: card Weapons - ours: unit_dynasty.monkey_king_struck.png
2. [S] a headgear - blocker 1: a gold swirl circlet with two long team feather antennae, crown hat off (MONKEY_CROWN) - ref: dynasty.monkey_king.red.png - ours: unit_dynasty.monkey_king_idle.png
3. [S] a face - blocker 2: a baboon face, tan muzzle, blond tufts - ref: dynasty.monkey_king.red.png - ours: unit_dynasty.monkey_king_idle.png
## Attempts (iter | gap | criterion | verdict)
416 | MONKEY_STAFF on the monk carry (10e4da35) | b | approved (struck 1, 2; b PASS)
416 | MONKEY_TAIL: team tube tail over the head (f97d38f2) | a | approved (struck 3)
417 | jump_charge leap (adc7786a; capture start 8 m) | c | approved (struck 1)
## Rejected (last 4)
## Notes (max 3 lines)
- 416 critic: the tail reads a near-straight thin pole from the idle (TABS thicker S-curve); the windup shows the staff end-on.
- 411 audit: the self-copy reads (clones appear in _windup/_ability).
