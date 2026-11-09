# evil.death_bringer
Status: open   Audited: 489 (AUDIT x2), 500 (CONFIRM: passed b, c, d; failed a), 502 (CONFIRM: copied b, c, d; failed a), 503 (CONFIRM: passed a; copied b, c, d), 504 (CONFIRM: copied b, c, d; failed a)   Done: -
## Verdicts
a FAIL (0 since 504 CONFIRM; plateau)
 1. Skull silhouette in unit_evil.death_bringer_idle and lineup_evil — TABS: a compact face mask with a rounded cranium and pinched jaw (ref: reference/units/evil.death_bringer.blue.png, reference/factions/evil.jpg). Ours reads as a broad, square helmet with a slab behind the face.
b PASS (491 twin gold warglaives; CONFIRM 500)
c PASS (499 charge through the line, cutting each man passed; CONFIRM 500)
d PASS (504 stats; CONFIRM 500)
## Ranked gaps
1. [R] evil.death_bringer.a skull mask — blocker 1: replace the deep cranium with a shallow rounded face shell and pinched jaw, keeping hair and wraps — ref: evil.death_bringer.blue.png — ours: unit_evil.death_bringer_idle
## Attempts (iter | gap | criterion | verdict)
504 | separated tapered crown locks and narrower back fall (e46ee0c3) | a | approved (struck 1; CONFIRM failed a)
503 | [R] scalp under the mask in place of the cap/crown/side boxes, thin flat side locks, back fall inside the head's width; shin mesh itself pale bandage with seams, team feet (90f0707f, 6ace58da) | a | approved (struck 2; 1's "rises above the crown" clause cleared)
502 | sculpted skull mask (c1dc9a29); crown-rooted locks and back fall (1dde2456) | a | approved (struck 3, 2)
501 | knee shorts over whole-shin wraps (28c99aa4); straggly hair fall (12556880) | a | approved (struck 1, 4)
491-500 | lanky build, bare torso, hair, mask, shorts, belt (a); twin warglaives (b PASS); TWIN_SLASH, QUICK_DODGE, DEATH_CHARGE (c PASS) | a, b, c | approved
## Rejected (last 4)
495 | [P] stance default | a | attempts 1 | ledger reversal of UV:DEATH (approved 494); wants an [S] idle pose of its own, square with arms out low
## Notes (max 3 lines)
- 504 CONFIRM: rebuild the skull to a compact face mask, keeping the separated strands and shin wraps.
- Weapon "greatsword" both hands (variant warglaive). Look is HORNED_EVIL "evil.death_bringer" + evilDress deathBringerHair, Mask, BareTorso, ShinWraps, Belt. Capture: 8 m from three archers, two more 9 m behind.
