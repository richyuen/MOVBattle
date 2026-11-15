# dynasty.dragon
Status: done   Audited: 411, 419 (CONFIRM: failed a, b, c), 420 (RE-AUDIT a, b, c), 429 (CONFIRM: failed a), 431 (CONFIRM: passed)   Done: 431
## Verdicts (a-c critic, d stats; FAIL carries a closed list, max 4, and the count of approved [S] since the list was written)
a PASS (431: [R] lion-dog head, cheeks, beak, cream brow + horns, hanging tongue, tube body with crest and frills; CONFIRM 431)
b PASS (429: front carrier's fists on the head pole's grip while running; CONFIRM 429, 431)
c PASS (421: opaque white plume with yellow lobes; CONFIRM 429, 431)
d PASS (cost 1000, hp 18.78x; 431 stats)
## Ranked gaps (the critic's entries for this unit, pruned as they are taken)
## Attempts (iter | gap | criterion | verdict)
416-424 | FLAME_JET, DRAGON_FORM band, DRAGON_CARRIER, BODY_FLAMES, DRAGON_MUZZLE, FRONT_GRIP | a,b,c | approved (c PASS 421)
429 | DRAGON_TRIM collar, hem, cuffs (3b24b339); _holdDragonPole (df5dd028) | a, b | approved (b PASS; CONFIRM failed a: plateau)
431 | [R] DRAGON_FORM head + body rebuilt (3e94ecfa, 48329bf4) | a | approved (struck 1-4; a PASS; CONFIRM passed, D)
## Rejected (last 4)
- fists in skin, .12/.1 [P] [1] - 421: ledger reversal of the 420 DRAGON_CARRIER row
## Notes (max 3 lines)
- 431 defects: tongue curls up at the tip, ends at the carrier's head; no cream diamond marks on cheeks/brow; carriers lack bun hair (CONFIRM).
- Front carrier is the real humanoid; head pole "dragonPole" held by _holdDragonPole; flame from "dragonMouth". Framed by mesh top (rig 5.70 m).
