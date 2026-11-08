# evil.shadow_walker
Status: open   Audited: 489 (AUDIT x2)   Done: -
## Verdicts
a FAIL (0 since 489)
 1. horns in unit_evil.shadow_walker_idle: two tall white hoops rising straight up from the cap into a U above the head — TABS: horns run far out sideways, then turn up only at the tips, almost twice the head width each side (ref: evil.shadow_walker.red.png)
 2. helmet in unit_evil.shadow_walker_idle: a flat dark box cap with a brim sitting on top of the head — TABS: a dark rounded helmet that encloses the head, with four tan vertical teeth-bars over the face (ref: evil.shadow_walker.blue.png)
 3. torso in unit_evil.shadow_walker_idle: a team-blue jacket with a dark spiked plate on the chest — TABS: a dark sleeveless tattered vest with a jagged hem over team skin (ref: evil.shadow_walker.red.png)
 4. boots in unit_evil.shadow_walker_idle: plain team-blue tall boots — TABS: dark boots with tan spike fins up the shin (ref: evil.shadow_walker.red.png)
 5. knees in unit_evil.shadow_walker_idle: no knee pads — TABS: round dark knee pads, each with a tan spike (ref: evil.shadow_walker.red.png)
 6. hair in unit_evil.shadow_walker_idle is missing — TABS: long dark hair hangs from under the helmet to the shoulders (ref: evil.shadow_walker.red.png)
b FAIL (3 since 489, 1 struck)
 1. main hand in unit_evil.shadow_walker_windup: a dark four-point star on a short stick — TABS: a long, curved bone-tan dagger with a spiky back edge, held point-down (ref: evil.shadow_walker.red.png)
c FAIL (0 since 489)
 1. teleport in unit_evil.shadow_walker_ability/_ability_after: no smoke or shadow puff at departure or arrival — TABS: Assassin Poof vanishes him and puts him at the farthest enemy (card)
 2. blow in unit_evil.shadow_walker_release/_flight: an overhead chop with the star — TABS: a one-handed knife stab or backstab (card "Knife - Melee")
 3. hit mark in unit_evil.shadow_walker_struck: no green particles on the struck knight — TABS: each hit leaves stacking green particles on the target (card)
d PASS (490 stats)
## Ranked gaps
1. [S] evil.shadow_walker.b broad bone blade — blocker 1: one extruded crescent slab, wrist-wide, with a jagged spine — ref: evil.shadow_walker.red.png — ours: unit_evil.shadow_walker_idle.png
2. [S] evil.shadow_walker.a sideways horns — blocker 1: horns straight out sideways about one head width each side, turning up at the tips — ref: evil.shadow_walker.red.png — ours: unit_evil.shadow_walker_idle.png
3. [S] evil.shadow_walker.a enclosing helmet — blocker 2: dark rounded helmet shell over the head with four tan teeth-bars, replacing the box cap — ref: evil.shadow_walker.blue.png — ours: unit_evil.shadow_walker_idle.png
## Attempts (iter | gap | criterion | verdict)
490 | dagger point-down in a flat tan, boneDaggerHold (df94c995) | b | approved (no strike)
489 | curved bone dagger (2c327ce9); empty off hand (48281a0d) | b | approved (struck 2)
## Rejected (last 4)
## Notes (max 3 lines)
- 490 DEFECTS: blade needle-thin (.075 of its length), a sliver at lineup distance; TABS a broad crescent, wrist-wide at the root.
- custom.dark_peasant/void_monarch summon evil.shadow_walker: never rename it.
