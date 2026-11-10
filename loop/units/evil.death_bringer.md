# evil.death_bringer
Status: open   Audited: 489 (AUDIT x2), 500 (CONFIRM: passed b, c, d; failed a), 502 (CONFIRM: copied b, c, d; failed a), 503 (CONFIRM: passed a; copied b, c, d), 504 (CONFIRM: copied b, c, d; failed a), 505 (CONFIRM: copied b, c, d; failed a), 506 (CONFIRM: copied b, c, d; failed a)   Done: -
## Verdicts
a FAIL (0 since 506 CONFIRM; plateau)
 1. The feather mantle in unit_evil.death_bringer_idle is a narrow bib that leaves a broad strip of bare team-color shoulder and flank, visible on the second unit from the right in lineup_evil — TABS: a dense, ragged mantle widens across the shoulders and encloses the sides of the upper torso (ref: reference/units/evil.death_bringer.blue.png, reference/factions/evil.jpg).
b PASS (491 twin gold warglaives; CONFIRM 500)
c PASS (499 charge through the line, cutting each man passed; CONFIRM 500)
d PASS (504 stats; CONFIRM 500)
## Ranked gaps
1. [R] evil.death_bringer.a overlapping mantle — blocker 1: rebuild the mantle with a faceted wrap and overlapping feathers covering the shoulder-to-rib surface — ref: reference/units/evil.death_bringer.blue.png — ours: lineup_evil.png
## Attempts (iter | gap | criterion | verdict)
507 | [R] shoulder-to-flank feather tiers (b3f04314, reverted 473257ab) | a | rejected
506 | [R] outward-swept horns and neckline-rooted chest feathers (729b5eaf, 42f202ed) | a | approved (struck 1, 2)
505 | [R] shallow faceted skull shell with rounded crown and pinched jaw (37724d45) | a | approved (struck 1; gap critic a PASS, CONFIRM failed a)
504 | separated tapered crown locks and narrower back fall (e46ee0c3) | a | approved (struck 1; CONFIRM failed a)
503 | [R] scalp under the mask in place of the cap/crown/side boxes, thin flat side locks, back fall inside the head's width; shin mesh itself pale bandage with seams, team feet (90f0707f, 6ace58da) | a | approved (struck 2; 1's "rises above the crown" clause cleared)
502 | sculpted skull mask (c1dc9a29); crown-rooted locks and back fall (1dde2456) | a | approved (struck 3, 2)
501 | knee shorts over whole-shin wraps (28c99aa4); straggly hair fall (12556880) | a | approved (struck 1, 4)
491-500 | lanky build, bare torso, hair, mask, shorts, belt (a); twin warglaives (b PASS); TWIN_SLASH, QUICK_DODGE, DEATH_CHARGE (c PASS) | a, b, c | approved
## Rejected (last 4)
507 | [R] shoulder-to-flank feather tiers | a | attempts 1 | exposed team-color channels between feather tiers
495 | [P] stance default | a | attempts 1 | ledger reversal of UV:DEATH (approved 494); wants an [S] idle pose of its own, square with arms out low
## Notes (max 3 lines)
- 507 DEFECTS: shoulder tips read, but gaps expose skin from collar to ribs. The critic asks for a fitted wrap beneath overlapping feathers.
- 506 CONFIRM: the dark feather mantle still needs to fill the shoulders and flanks. Skull and swept horns read.
- 505 DEFECTS: the dark sockets read as shallow rectangular cuts instead of sloping cavities.
