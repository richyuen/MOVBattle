# evil.void_monarch
Status: open   Audited: 489 (AUDIT x2), 500 (CONFIRM: passed d; failed a, b, c), 502 (CONFIRM: passed a, b, c; copied d)   Done: -
## Verdicts
a PASS (502 bone beak mask; CONFIRM 502)
b PASS (501 broad khaki toothed bone swords; CONFIRM 502)
c FAIL (1 since 500, 0 struck; CONFIRM 502 passed c, the gap critic did not)
 1. demon transformation in unit_evil.void_monarch_ability -> unit_evil.void_monarch_ability_after: the recorded demon_form at 4917 ms shows only the unit tipping flat inside the melee pile, with no change of form, and he is the same grounded figure in unit_evil.void_monarch_dodge at 5783 ms — TABS: after dealing 800 damage he begins to float and transforms into his demon form (ref: loop/cards/evil.void_monarch.md, ability Demon Transformation)
d PASS (502 stats; CONFIRM 500)
## Ranked gaps
1. [S] evil.void_monarch.c demon form hover — blocker 1: upright snap plus a held ~.4 m hover while in form (PA demonForm / SS DEMON_FORM) — ref: loop/cards/evil.void_monarch.md — ours: unit_evil.void_monarch_ability_after.png
## Attempts (iter | gap | criterion | verdict)
502 | bone beak mask under the eyes, pointed plate, beak ridge, nostrils, evilDress monarchBeak (bd0dacb6) | a | approved (struck 2; a PASS)
502 | demon form: standFirm (no topple), void body, pink eyes, ring + shard aura, evilDress monarchDemonForm (495878c2) | c | approved (no strike; "no change of form" clause cleared)
501 | crown-tan bone material, evilDress monarchBone (baccf212) | a | approved (struck 3, 1 by lineup)
501 | broad khaki bone swords, MONARCH_SWORD (82b8820a) | b | approved (struck 1; b PASS)
500 | bone-tan ray crown, black pole ringed in pink, evilDress monarchCrown (ce31248d, 2b00b363) | a | approved (struck 2)
491-499 | harness, tunic, knees, elbows (a); bone swords (b); burst, DEMON_FORM, MONARCH_DODGE (c) | a, b, c | approved
## Rejected (last 4)
## Notes (max 3 lines)
- Its look and kit match custom.void_monarch: change the evil.* preset only (HORNED_EVIL harness flag gates harness, tunic, knees, elbows, crown, monarchBone, monarchBeak); DEMON_FORM is evil-id only; custom_* untouched.
- 502: probe_eval (5 knights) shows root rotation 0 and physicsState steady after the form, yet _ability_after shows him flat and the crown pole horizontal: the tilt is a pose layer (swing lean / head pitch), not the topple; and the hover lift does not clear the pile.
- 502 DEFECTS: a little team skin either side of the beak plate's lower half.
