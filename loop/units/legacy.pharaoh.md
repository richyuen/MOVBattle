# legacy.pharaoh
Status: open   Audited: 468, 475 (CONFIRM: passed b, c; failed a)   Done: -
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4 (6 on a), and the count of approved [S] since the list was written)
a FAIL (0 since 475)
 1. build in unit_legacy.pharaoh_idle: squat, with a wide boxy striped torso and short legs, about a quarter of his height below the skirt — TABS: slim and lanky, with long thin legs about half the height below a short skirt (ref: legacy.pharaoh.red.png, legacy.pharaoh.jpg)
 2. false beard in unit_legacy.pharaoh_idle: no beard under the chin — TABS: a small gold pharaoh beard hangs from the chin onto the collar (ref: legacy.pharaoh.red.png)
b PASS (475: crook, flail up and out with tassels hanging; FLAIL_HOLD; CONFIRM 475)
c PASS (475: golden ring and rays, the struck man kneels; KNEEL_POSE; CONFIRM 475)
d PASS (cost 750=750, hp 0.81x vs 0.81x (0%), dmg 1.08x vs 1.08x (+0%), cd 1.01x vs 1.00x (+1%); 475 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
(none listed: the CONFIRM 475 list carries no ranked entries; pick its blockers in order)
## Attempts (iter | gap | criterion | verdict)
475 | FLAIL_HOLD rod up and out, strands hung plumb (b994faf3) | b | approved (struck 3; b PASS)
475 | KNEEL_POSE struck man and circle kneel (a5a5db73) | c | approved (struck 2; c PASS)
474 | PHARAOH_BANDS gold armlets and wrist cuffs (44052bc1) | a | approved (struck 5; a PASS, then CONFIRM 475 failed a)
473 | KNEEL_AURA gold ring, disc, wheeling rays (3f0f1952) | c | approved (struck 1)
472 | PHARAOH_COLLAR flat gold broad collar, bib (063e6c76) | a | approved (struck 3)
471 | PHARAOH_KILT flared pleated kilt, bare legs (a032b635) | a | approved (struck 4, 6)
469-470 | MODIUS, PHARAOH_CROOK, PHARAOH_GARB, PHARAOH_FLAIL | a, b | approved
## Rejected (last 4)
## Notes (max 3 lines)
- 475 critic minor: flail strands are baked for the idle hand, they fan stiffly in the swing; the kneeling man keeps his sword at guard.
