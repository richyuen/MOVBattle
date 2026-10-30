# dynasty.dragon
Status: open   Audited: 411   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a FAIL (1 since 411)
 1. body form in unit_dynasty.dragon_idle: one humanoid wearing a dragon mask - TABS: a giant paper dragon head about twice man height on a long serpentine body (ref: dynasty.dragon.red.png, dynasty.dragon.jpg)
 2. carriers in unit_dynasty.dragon_idle: none - TABS: four Dragon Carriers in team clothes with Chinese hair beneath the body (ref: dynasty.dragon.jpg, card Appearance)
  (struck 3, 4 at 416: the head towers over the roster; a team body ribbon with a spine fringe)
b FAIL (0 since 411)
 1. carrier poles in unit_dynasty.dragon_idle: none - TABS: red poles with dark grips linking each carrier to the body (ref: dynasty.dragon.jpg)
c FAIL (1 since 411)
 2. burning target in unit_dynasty.dragon_struck: the knight shows no fire - TABS: the target catches fire (ref: card Characteristics)
  (struck 1 at 416: a held flame jet from the paper mouth)
d PASS (cost 1000, hp 18.78x)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
1. [P] a head scale - blocker 1: DRAGON_FORM.skull .62 -> ~1.5, snout/jaw/headY scaled (headY ~1.9), the head ~2x the bearer in lineup_dynasty (fallout of 3ac0c32c); with an evidence commit framing unit_dynasty.dragon_idle on the full rig
2. [S] a carriers - blocker 2: four Dragon Carriers (dynasty clothes, hair knot) under the ribbon, each gripping a red pole into it (clears b.1 too) - ref: dynasty.dragon.jpg - ours: lineup_dynasty.png
3. [S] c burning target - blocker 2: flame tongues and a smoke wisp on a status:fire unit's torso for the burn - ref: card Characteristics - ours: unit_dynasty.dragon_struck.png
## Attempts (iter | gap | criterion | verdict)
416 | FLAME_JET + DRAGON_BREATH: held flame jet from the mouth (799cefaa) | c | approved (struck 1)
416 | DRAGON_FORM: paper head on a pole, body ribbon, fin, mask off (3ac0c32c) | a | approved (struck 3, 4; head 0.75x man)
## Rejected (last 4)
## Notes (max 3 lines)
- 416 critic: jet mostly orange and thin at the mouth (TABS fat white-yellow); jaw a flat shelf; the idle frames the man only.
