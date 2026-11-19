# challenge.zeus
Status: open   Audited: 609 (AUDIT x2)   Done: -
## Verdicts
a PASS (609 judge)
b FAIL (1 since 609; list from AUDIT 609): 1. Shield Bearers in stage_challenge.zeus_army.png: a gappy front rank with visible space between the shields — TABS: one long shoulder-to-shoulder wall of tower shields at the front (ref: reference/stages/challenge.zeus.png, .thumb.png) s2. Sarissas packed behind in stage_challenge.zeus_army.png (struck 609) 3. Hoplites in stage_challenge.zeus_army.png: in a straight back row level with the other rear units — TABS: Hoplites in a slanted line on the phalanx's flank, at frame-right (ref: reference/stages/challenge.zeus.png) s4. Zeus at the centre in stage_challenge.zeus_army.png (struck 609) 5. the shield-bearer front in stage_challenge.zeus_army.png runs straight across the frame, square to the camera — TABS: a slanted phalanx running diagonally from far left (by the temple) to near right (ref: reference/stages/challenge.zeus.png)
c PASS (609 judge)
## Ranked gaps
1. [S] b rotate the phalanx to a strong far-left to near-right diagonal (~45-50 deg; 609's is ~23 deg) — blocker 5: formation group re-laid in web/src/campaign/stages/challenge.ts — ref: reference/stages/challenge.zeus.png — ours: stage_challenge.zeus_army.png
2. [S] b Hoplites hinged back from the phalanx's near-right end at an angle to it, not collinear — blocker 3 — ref: reference/stages/challenge.zeus.png — ours: stage_challenge.zeus_army.png
3. [P] b shield spacing along the wall ~1.08 m -> ~0.75 m, Sarissas re-spaced to match (fallout of 4e382b32) — blocker 1 — ref: reference/stages/challenge.zeus.thumb.png — ours: stage_challenge.zeus_army.png
## Attempts (iter | gap | criterion | verdict)
609 | [S] slanted phalanx, Zeus centre behind 4e382b32 (+29e3a14d) | b4 | APPROVE, struck 2, 4
## Rejected (last 4)
## Notes (max 3 lines)
- Map: ancient_2. The team-1 zone starts near x 27: the phalanx's near end must stay at x >= 27.2 (609 follow-up).
- Layout generator kept in the 609 diff (centre c, wall dir (-6,-14), back normal (0.919,-0.394)).
