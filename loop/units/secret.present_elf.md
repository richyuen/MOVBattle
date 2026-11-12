# secret.present_elf
Status: open   Audited: 515 (AUDIT x2), 518 (RE-AUDIT a, b x2), 523 (RE-AUDIT c x2)   Done: -
## Verdicts
a FAIL (1 since 518, 1 struck)
 2. open vest with toggles in unit_secret.present_elf_idle — TABS: team vest open over the cream shirt; ours is a dark teal tunic block (ref: secret.present_elf.png)
 3. green trousers in unit_secret.present_elf_idle — TABS: green legs; ours has team legs (ref: secret.present_elf.blue.png)
 4. black boots in unit_secret.present_elf_idle — TABS: black boots; ours has team feet (ref: secret.present_elf.red.png)
b FAIL (2 since 518, 2 struck)
 3. candy cane on the present in unit_secret.present_elf_idle — TABS: a cream-and-team striped cane laid across the lid; ours has none (ref: secret.present_elf.red.png)
c PASS (523 RE-AUDIT x2)
d PASS (519 stats)
## Ranked gaps
1. [S] secret.present_elf.a open vest — blocker 2: two open team-coloured panels with toggles over the cream shirt — ref: secret.present_elf.png — ours: unit_secret.present_elf_idle.png
2. [S] secret.present_elf.b candy cane — blocker 3: fit a striped hooked cane diagonally across the lid.
## Attempts (iter | gap | criterion | verdict)
523 | two open gold bells with clappers in front of the bow (a369ec7a) | b | approved (struck 2)
522 | the hollow present kicks its lid clear and releases the ally in confetti (d8255310) | c | approved (struck 2, c PASS)
521 | add a cream undershirt and flared wrist sleeves (d7ddb060) | a | approved (struck 1)
520 | throws the present from his chest at the man; it lands, opens 3 s on and his ally steps out, simulationSystem PRESENT_THROW (ed6474a0) | c | approved (struck 1)
519 | torso-sized team present, gold-edged band, bow with tails and small bells, secretDress presentElfPresent PRESENT (b2600e04) | b | approved (struck 1)
517 | green elf cap, cream fur band, pompom, hood off, secretDress elfCap (b34b4519, 8142c383) | a | approved (struck 1, 7, 6 by lineup)
## Rejected (last 4)
## Notes (max 3 lines)
- 522: the ability pair holds on the box's landing spot at present_open (da9a1858).
- 519 DEFECTS: bells (PRESENT.bell .13 W) hidden in the knot; box narrower than tall, bow small.
- 517 DEFECTS: the cap is short and upright; TABS taller, flopping forward over the band.
