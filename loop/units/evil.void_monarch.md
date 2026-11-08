# evil.void_monarch
Status: done   Audited: 489 (AUDIT x2), 500 (CONFIRM: passed d; failed a, b, c), 502 (CONFIRM: passed a, b, c; copied d), 503 (CONFIRM: copied a, b, c, d)   Done: 503
## Verdicts
a PASS (502 bone beak mask; CONFIRM 502)
b PASS (501 broad khaki toothed bone swords; CONFIRM 502)
c PASS (503 demon form floats upright through blasts and swings; CONFIRM 502)
d PASS (503 stats; CONFIRM 500)
## Ranked gaps
## Attempts (iter | gap | criterion | verdict)
503 | demon form steadfast through blasts (no lift/tumble/sprawl, RU applyBlastLaunch), torso and neck pitch/roll held to .3 (STEADFAST_UPRIGHT) (412d556a, 1888c349) | c | approved (struck 1; c PASS)
502 | bone beak mask (bd0dacb6); demon form standFirm, void body, ring + shard aura (495878c2) | a, c | approved (a PASS; c form-change clause cleared)
491-501 | harness, tunic, knees, elbows, crown, bone (a); bone swords (b); burst, DEMON_FORM, MONARCH_DODGE (c) | a, b, c | approved
## Rejected (last 4)
## Notes (max 3 lines)
- Its look and kit match custom.void_monarch: the evil.* preset only (HORNED_EVIL harness flag); DEMON_FORM is evil-id only; custom_* untouched.
- 503 DEFECTS: in _ability_after the head and crown pole lean ~25 deg off the torso (fallout [P]: STEADFAST_UPRIGHT .3 -> .15).
