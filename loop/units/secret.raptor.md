# secret.raptor
Status: open   Audited: 500 (AUDIT x2), 511 (CONFIRM: passed b, c; failed a)   Done: -
## Verdicts
a FAIL (0 since 511 CONFIRM)
 1. team-coloured tongue in unit_secret.raptor_idle — TABS: the jaw hangs wide open on a dark mouth interior with a red/blue tongue showing between white tooth rows. This is the second team-colour accent after the crest. Ours has the jaw shut with only a white zigzag of teeth and no team colour in the mouth. The open mouth in _struck and _windup is also black inside with no tongue. (ref: secret.raptor.red.png / .blue.png; card Appearance "a tongue corresponding to its team's colors")
 2. back spots in unit_secret.raptor_idle — TABS: small flat team-coloured triangle spots scattered along the spine from the shoulders to the base of the tail. Ours has a clump of raised pale-blue scute plates bunched over the shoulders that sticks above the back line, with nothing further down the back or on the tail. (ref: secret.raptor.blue.png; card Appearance "spots near its spine")
b PASS (511 CONFIRM: white claws and teeth)
c PASS (511 CONFIRM: low lunging bite closes on the man)
d PASS (511 stats)
## Ranked gaps
1. [S] secret.raptor.a team tongue — blocker 1: a team-coloured tongue in a dark mouth, the idle jaw a little open — ref: secret.raptor.blue.png — ours: unit_secret.raptor_idle.png
2. [S] secret.raptor.a flush spine spots — blocker 2: fit the spot ellipsoid to the trunk mesh so flat triangles lie flush from shoulders to tail root — ref: secret.raptor.blue.png — ours: unit_secret.raptor_idle.png
## Attempts (iter | gap | criterion | verdict)
511 | team back spots, raptorBody dressRaptorSpots (70e26c54, 3ec7bafc) | a | approved (struck 5; CONFIRM failed a)
510 | tail-tip feather fan (b60b1a73) | a | approved (struck 4)
510 | pale toe and forelimb claws (0313ad73) | b | approved (struck 2)
510 | target-directed jaw closure and neck reach (3bc37fcc, fbe5fa90) | c | approved (struck 1)
505 | forward jaw snap timed to contact (be96b2b5, d7165ae8) | c | approved (no strike)
505 | opposing rows of triangular teeth (53a75e63) | b | approved (struck 1)
505 | standalone bipedal dinosaur (18710e8b) | a | approved (struck 1, 2, 3)
## Rejected (last 4)
## Notes (max 3 lines)
- 511 critic DEFECTS: spots stand proud of the outline (the ellipsoid RAPTOR_SPOT does not match the trunk mesh) and the visible ones cluster at the shoulders.
- lineup_secret shows the raptor only as the rider's mount; judge a on the idle.
